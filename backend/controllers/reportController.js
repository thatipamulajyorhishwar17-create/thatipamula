const pool = require('../config/db');
const { generateReportId } = require('../utils/email');

const getAllReports = async (req, res) => {
    try {
        let query = 'SELECT r.*, e.name as employee_name FROM reports r JOIN employees e ON r.employee_id = e.id';
        let params = [];
        if (req.query.employee_id) {
            query += ' WHERE r.employee_id = ?';
            params.push(req.query.employee_id);
        }
        if (req.query.status) {
            query += params.length ? ' AND r.status = ?' : ' WHERE r.status = ?';
            params.push(req.query.status);
        }
        query += ' ORDER BY r.created_at DESC';
        const [rows] = await pool.query(query, params);
        return res.json(rows);
    } catch (err) {
        console.error('Get reports error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getReport = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT r.*, e.name as employee_name, e.department FROM reports r JOIN employees e ON r.employee_id = e.id WHERE r.id = ?',
            [req.params.id]
        );
        if (rows.length === 0) return res.status(404).json({ message: 'Report not found' });
        return res.json(rows[0]);
    } catch (err) {
        console.error('Get report error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const createReport = async (req, res) => {
    try {
        const { employeeId, employeeName, project, reportDate, workDone, pendingWork, blockers, tasksCompleted, tasksPending, workingHours, progress, tomorrowPlan } = req.body;
        if (!employeeId || !reportDate) return res.status(400).json({ message: 'Employee ID and date are required' });
        const id = await generateReportId(pool);
        await pool.query(
            `INSERT INTO reports (id, employee_id, employee_name, project, date, work_done, pending_work, blockers, tasks_completed, tasks_pending, working_hours, progress, tomorrow_plan, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, employeeId, employeeName || '', project || '', reportDate, workDone || '', pendingWork || '', blockers || '',
             tasksCompleted || 0, tasksPending || 0, workingHours || 0, progress || 0, tomorrowPlan || '', 'Submitted']
        );
        return res.status(201).json({ message: 'Report submitted', id });
    } catch (err) {
        console.error('Create report error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const updateReportStatus = async (req, res) => {
    try {
        const { status, managerComments } = req.body;
        if (!status) return res.status(400).json({ message: 'Status is required' });
        const validStatuses = ['Submitted', 'Pending', 'Approved', 'Rejected'];
        if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });
        const [existing] = await pool.query('SELECT * FROM reports WHERE id = ?', [req.params.id]);
        if (existing.length === 0) return res.status(404).json({ message: 'Report not found' });
        await pool.query('UPDATE reports SET status = ?, manager_comments = ? WHERE id = ?', [status, managerComments || '', req.params.id]);
        return res.json({ message: 'Report status updated' });
    } catch (err) {
        console.error('Update report status error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const deleteReport = async (req, res) => {
    try {
        const [result] = await pool.query('DELETE FROM reports WHERE id = ?', [req.params.id]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Report not found' });
        return res.json({ message: 'Report deleted' });
    } catch (err) {
        console.error('Delete report error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAllReports, getReport, createReport, updateReportStatus, deleteReport };
