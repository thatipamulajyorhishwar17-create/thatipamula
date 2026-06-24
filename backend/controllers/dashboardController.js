const pool = require('../config/db');

const getDashboardStats = async (req, res) => {
    try {
        let stats = {};
        if (req.user.role === 'admin' || req.user.role === 'super_admin') {
            const [[empCount]] = await pool.query('SELECT COUNT(*) as total FROM employees');
            const [[activeCount]] = await pool.query("SELECT COUNT(*) as total FROM employees WHERE status = 'Active'");
            const [[leaveCount]] = await pool.query("SELECT COUNT(*) as total FROM employees WHERE status = 'On Leave'");
            const [[deptCount]] = await pool.query('SELECT COUNT(DISTINCT department) as total FROM employees');
            const [[ongoingProjects]] = await pool.query("SELECT COUNT(*) as total FROM projects WHERE status = 'In Progress'");
            const [[completedProjects]] = await pool.query("SELECT COUNT(*) as total FROM projects WHERE status = 'Completed'");
            const [[pendingReports]] = await pool.query("SELECT COUNT(*) as total FROM reports WHERE status IN ('Submitted', 'Pending')");
            const [[avgProgress]] = await pool.query('SELECT COALESCE(AVG(progress), 0) as avg FROM employees');
            stats = {
                totalEmployees: empCount.total,
                activeEmployees: activeCount.total,
                onLeave: leaveCount.total,
                totalDepartments: deptCount.total,
                ongoingProjects: ongoingProjects.total,
                completedProjects: completedProjects.total,
                pendingReports: pendingReports.total,
                averageProgress: Math.round(avgProgress.avg)
            };
        } else {
            const [empRows] = await pool.query('SELECT * FROM employees WHERE id = ?', [req.user.id]);
            if (empRows.length === 0) return res.status(404).json({ message: 'Employee not found' });
            const emp = empRows[0];
            const [[attendanceStats]] = await pool.query(
                "SELECT COUNT(*) as total, SUM(CASE WHEN status IN ('Present','Late') THEN 1 ELSE 0 END) as present FROM attendance WHERE employee_id = ?",
                [req.user.id]
            );
            const [empProjects] = await pool.query(
                'SELECT COUNT(*) as total FROM project_team WHERE employee_id = ?',
                [req.user.id]
            );
            const [completedReports] = await pool.query(
                "SELECT COUNT(*) as total FROM reports WHERE employee_id = ? AND status = 'Approved'",
                [req.user.id]
            );
            stats = {
                name: emp.name,
                department: emp.department,
                designation: emp.designation,
                attendance: emp.attendance,
                progress: emp.progress,
                performance: emp.performance,
                workHours: emp.work_hours,
                projectCount: empProjects[0].total,
                reportsCompleted: completedReports[0].total
            };
        }
        return res.json(stats);
    } catch (err) {
        console.error('Dashboard stats error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getChartData = async (req, res) => {
    try {
        const [monthlyProgress] = await pool.query(`
            SELECT DATE_FORMAT(date, '%Y-%m') as month, COALESCE(AVG(progress), 0) as avg_progress
            FROM reports WHERE date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(date, '%Y-%m') ORDER BY month
        `);

        const [deptPerformance] = await pool.query(
            'SELECT department, COUNT(*) as count, COALESCE(AVG(performance), 0) as avg_performance, COALESCE(AVG(progress), 0) as avg_progress FROM employees GROUP BY department'
        );

        const [projectStatus] = await pool.query('SELECT status, COUNT(*) as count FROM projects GROUP BY status');

        const [attendanceSummary] = await pool.query(`
            SELECT
                SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present,
                SUM(CASE WHEN status = 'Late' THEN 1 ELSE 0 END) as late,
                SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent,
                SUM(CASE WHEN status = 'On Leave' THEN 1 ELSE 0 END) as on_leave
            FROM attendance WHERE date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        `);

        const [perfDistribution] = await pool.query(`
            SELECT
                SUM(CASE WHEN performance >= 4.5 THEN 1 ELSE 0 END) as excellent,
                SUM(CASE WHEN performance >= 3.5 AND performance < 4.5 THEN 1 ELSE 0 END) as good,
                SUM(CASE WHEN performance >= 2.5 AND performance < 3.5 THEN 1 ELSE 0 END) as average,
                SUM(CASE WHEN performance >= 1.5 AND performance < 2.5 THEN 1 ELSE 0 END) as below_average,
                SUM(CASE WHEN performance < 1.5 THEN 1 ELSE 0 END) as needs_improvement
            FROM employees
        `);

        const [progressBrackets] = await pool.query(`
            SELECT
                SUM(CASE WHEN progress >= 80 THEN 1 ELSE 0 END) as excellent,
                SUM(CASE WHEN progress >= 60 AND progress < 80 THEN 1 ELSE 0 END) as good,
                SUM(CASE WHEN progress >= 40 AND progress < 60 THEN 1 ELSE 0 END) as average,
                SUM(CASE WHEN progress < 40 THEN 1 ELSE 0 END) as needs_improvement
            FROM employees
        `);

        const [reportStatus] = await pool.query('SELECT status, COUNT(*) as count FROM reports GROUP BY status');

        return res.json({
            monthlyProgress,
            deptPerformance,
            projectStatus,
            attendanceSummary: attendanceSummary[0] || { present: 0, late: 0, absent: 0, on_leave: 0 },
            perfDistribution: perfDistribution[0] || { excellent: 0, good: 0, average: 0, below_average: 0, needs_improvement: 0 },
            progressBrackets: progressBrackets[0] || { excellent: 0, good: 0, average: 0, needs_improvement: 0 },
            reportStatus
        });
    } catch (err) {
        console.error('Chart data error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getTopPerformers = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT id, name, department, performance, progress, attendance FROM employees ORDER BY performance DESC, progress DESC LIMIT 5');
        return res.json(rows);
    } catch (err) {
        console.error('Top performers error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getDepartmentOverview = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT department, COUNT(*) as count, COALESCE(AVG(performance), 0) as avg_performance, COALESCE(AVG(progress), 0) as avg_progress, COALESCE(AVG(attendance), 0) as avg_attendance FROM employees GROUP BY department ORDER BY count DESC'
        );
        return res.json(rows);
    } catch (err) {
        console.error('Department overview error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getDashboardStats, getChartData, getTopPerformers, getDepartmentOverview };
