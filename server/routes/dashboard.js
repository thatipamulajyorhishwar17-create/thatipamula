const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const departments = ['Administration', 'Human Resources', 'Software Development', 'Web Development', 'UI/UX Design', 'Data Analytics', 'Artificial Intelligence', 'Marketing', 'Finance', 'Quality Assurance'];

const employees = [
    { id: 'EMP001', name: 'Rajesh Kumar', email: 'rajesh.kumar@company.com', department: 'Software Development', designation: 'Senior Software Engineer', status: 'Active', progress: 92, attendance: 98, performance: 4.8, work_hours: 8.5 },
    { id: 'EMP002', name: 'Priya Sharma', email: 'priya.sharma@company.com', department: 'Web Development', designation: 'Full Stack Developer', status: 'Active', progress: 85, attendance: 95, performance: 4.5, work_hours: 8.0 },
    { id: 'EMP003', name: 'Amit Patel', email: 'amit.patel@company.com', department: 'UI/UX Design', designation: 'UI/UX Designer', status: 'Active', progress: 78, attendance: 92, performance: 4.2, work_hours: 7.5 },
    { id: 'EMP004', name: 'Sneha Reddy', email: 'sneha.reddy@company.com', department: 'Data Analytics', designation: 'Data Analyst', status: 'Active', progress: 70, attendance: 88, performance: 3.8, work_hours: 8.0 },
    { id: 'EMP005', name: 'Vikram Singh', email: 'vikram.singh@company.com', department: 'Artificial Intelligence', designation: 'AI Engineer', status: 'Active', progress: 95, attendance: 99, performance: 4.9, work_hours: 9.0 },
    { id: 'EMP006', name: 'Neha Gupta', email: 'neha.gupta@company.com', department: 'Human Resources', designation: 'HR Manager', status: 'Active', progress: 88, attendance: 96, performance: 4.6, work_hours: 8.0 },
    { id: 'EMP007', name: 'Arjun Nair', email: 'arjun.nair@company.com', department: 'Marketing', designation: 'Marketing Lead', status: 'Active', progress: 75, attendance: 90, performance: 4.0, work_hours: 7.5 },
    { id: 'EMP008', name: 'Divya Menon', email: 'divya.menon@company.com', department: 'Finance', designation: 'Finance Analyst', status: 'Active', progress: 65, attendance: 85, performance: 3.5, work_hours: 7.0 },
    { id: 'EMP009', name: 'Rohan Desai', email: 'rohan.desai@company.com', department: 'Quality Assurance', designation: 'QA Lead', status: 'Active', progress: 82, attendance: 93, performance: 4.3, work_hours: 8.0 },
    { id: 'EMP010', name: 'Kavita Joshi', email: 'kavita.joshi@company.com', department: 'Administration', designation: 'Admin Officer', status: 'Active', progress: 90, attendance: 97, performance: 4.7, work_hours: 8.5 },
    { id: 'EMP011', name: 'Suresh Iyer', email: 'suresh.iyer@company.com', department: 'Software Development', designation: 'Junior Developer', status: 'Active', progress: 45, attendance: 82, performance: 3.2, work_hours: 7.0 },
    { id: 'EMP012', name: 'Ananya Verma', email: 'ananya.verma@company.com', department: 'Web Development', designation: 'Frontend Developer', status: 'Active', progress: 55, attendance: 87, performance: 3.6, work_hours: 7.5 },
    { id: 'EMP013', name: 'Manish Tiwari', email: 'manish.tiwari@company.com', department: 'Data Analytics', designation: 'Data Engineer', status: 'On Leave', progress: 60, attendance: 78, performance: 3.7, work_hours: 7.0 },
    { id: 'EMP014', name: 'Pooja Mehta', email: 'pooja.mehta@company.com', department: 'Artificial Intelligence', designation: 'ML Engineer', status: 'Active', progress: 72, attendance: 91, performance: 4.1, work_hours: 8.0 }
];

const projects = [
    { id: 'PRJ001', name: 'Project Phoenix', manager: 'Rajesh Kumar', team_ids: 'EMP001,EMP011', start_date: '2024-01-15', deadline: '2024-12-31', status: 'In Progress', priority: 'High', completion: 72 },
    { id: 'PRJ002', name: 'Project Atlas', manager: 'Sneha Patel', team_ids: 'EMP002,EMP012', start_date: '2024-02-01', deadline: '2024-10-30', status: 'In Progress', priority: 'High', completion: 58 },
    { id: 'PRJ003', name: 'Project Zenith', manager: 'Neha Gupta', team_ids: 'EMP003', start_date: '2024-03-01', deadline: '2024-09-15', status: 'In Progress', priority: 'Medium', completion: 45 },
    { id: 'PRJ004', name: 'Project DataStream', manager: 'Sneha Reddy', team_ids: 'EMP004,EMP013', start_date: '2024-04-01', deadline: '2024-11-30', status: 'In Progress', priority: 'Medium', completion: 35 },
    { id: 'PRJ005', name: 'Project NeuralNet', manager: 'Vikram Singh', team_ids: 'EMP005,EMP014', start_date: '2024-01-01', deadline: '2024-08-31', status: 'In Progress', priority: 'High', completion: 88 },
    { id: 'PRJ006', name: 'Project TalentHub', manager: 'Amit Sharma', team_ids: 'EMP006', start_date: '2024-02-15', deadline: '2024-07-31', status: 'Completed', priority: 'Low', completion: 100 },
    { id: 'PRJ007', name: 'Project BrandBoost', manager: 'Priya Sharma', team_ids: 'EMP007', start_date: '2024-05-01', deadline: '2024-12-31', status: 'On Hold', priority: 'Medium', completion: 20 },
    { id: 'PRJ008', name: 'Project FinTrack', manager: 'Neha Gupta', team_ids: 'EMP008', start_date: '2024-06-01', deadline: '2025-03-31', status: 'Not Started', priority: 'Low', completion: 0 },
    { id: 'PRJ009', name: 'Project QualityFirst', manager: 'Rohan Desai', team_ids: 'EMP009', start_date: '2024-03-15', deadline: '2024-09-30', status: 'Completed', priority: 'Medium', completion: 100 },
    { id: 'PRJ010', name: 'Project OfficeOps', manager: 'Kavita Joshi', team_ids: 'EMP010', start_date: '2024-01-01', deadline: '2024-06-30', status: 'Completed', priority: 'Low', completion: 100 }
];

const reports = [
    { id: 'RPT001', employee_id: 'EMP001', employee_name: 'Rajesh Kumar', project: 'Project Phoenix', date: '2024-06-21', tasks_completed: 5, tasks_pending: 1, working_hours: 8.5, progress: 92, manager_comments: 'Excellent work this week. Keep it up!', status: 'Approved' },
    { id: 'RPT002', employee_id: 'EMP002', employee_name: 'Priya Sharma', project: 'Project Atlas', date: '2024-06-21', tasks_completed: 4, tasks_pending: 2, working_hours: 8.0, progress: 85, manager_comments: 'Good progress, need to focus on pending tasks.', status: 'Approved' },
    { id: 'RPT003', employee_id: 'EMP003', employee_name: 'Amit Patel', project: 'Project Zenith', date: '2024-06-21', tasks_completed: 3, tasks_pending: 2, working_hours: 7.5, progress: 78, manager_comments: 'Design quality is good, please improve speed.', status: 'Pending' },
    { id: 'RPT004', employee_id: 'EMP004', employee_name: 'Sneha Reddy', project: 'Project DataStream', date: '2024-06-21', tasks_completed: 2, tasks_pending: 3, working_hours: 8.0, progress: 70, manager_comments: '', status: 'Submitted' },
    { id: 'RPT005', employee_id: 'EMP005', employee_name: 'Vikram Singh', project: 'Project NeuralNet', date: '2024-06-21', tasks_completed: 6, tasks_pending: 0, working_hours: 9.0, progress: 95, manager_comments: 'Outstanding performance!', status: 'Approved' },
    { id: 'RPT006', employee_id: 'EMP006', employee_name: 'Neha Gupta', project: 'Project TalentHub', date: '2024-06-20', tasks_completed: 4, tasks_pending: 1, working_hours: 8.0, progress: 88, manager_comments: 'HR initiatives are on track.', status: 'Approved' },
    { id: 'RPT007', employee_id: 'EMP007', employee_name: 'Arjun Nair', project: 'Project BrandBoost', date: '2024-06-20', tasks_completed: 2, tasks_pending: 4, working_hours: 7.5, progress: 75, manager_comments: '', status: 'Pending' },
    { id: 'RPT008', employee_id: 'EMP008', employee_name: 'Divya Menon', project: 'Project FinTrack', date: '2024-06-20', tasks_completed: 1, tasks_pending: 5, working_hours: 7.0, progress: 65, manager_comments: 'Need improvement in financial reporting.', status: 'Rejected' },
    { id: 'RPT009', employee_id: 'EMP009', employee_name: 'Rohan Desai', project: 'Project QualityFirst', date: '2024-06-19', tasks_completed: 5, tasks_pending: 1, working_hours: 8.0, progress: 82, manager_comments: 'QA processes are well maintained.', status: 'Approved' },
    { id: 'RPT010', employee_id: 'EMP010', employee_name: 'Kavita Joshi', project: 'Project OfficeOps', date: '2024-06-19', tasks_completed: 4, tasks_pending: 2, working_hours: 8.5, progress: 90, manager_comments: 'Administration running smoothly.', status: 'Approved' },
    { id: 'RPT011', employee_id: 'EMP011', employee_name: 'Suresh Iyer', project: 'Project Phoenix', date: '2024-06-18', tasks_completed: 2, tasks_pending: 4, working_hours: 7.0, progress: 45, manager_comments: 'Needs more focus and training.', status: 'Pending' },
    { id: 'RPT012', employee_id: 'EMP012', employee_name: 'Ananya Verma', project: 'Project Atlas', date: '2024-06-18', tasks_completed: 3, tasks_pending: 3, working_hours: 7.5, progress: 55, manager_comments: '', status: 'Submitted' }
];

// GET /api/dashboard/stats
router.get('/stats', authenticateToken, (req, res) => {
    const activeEmployees = employees.filter(e => e.status === 'Active').length;
    const onLeave = employees.filter(e => e.status === 'On Leave').length;
    const ongoingProjects = projects.filter(p => p.status === 'In Progress').length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const pendingReports = reports.filter(r => r.status === 'Pending' || r.status === 'Submitted').length;
    const avgProgress = Math.round(employees.reduce((s, e) => s + e.progress, 0) / employees.length);

    res.json({
        totalEmployees: employees.length,
        activeEmployees,
        onLeave,
        totalDepartments: departments.length,
        ongoingProjects,
        completedProjects,
        pendingReports,
        averageProgress: avgProgress
    });
});

// GET /api/dashboard/charts
router.get('/charts', authenticateToken, (req, res) => {
    const deptPerformance = departments.map(d => {
        const emps = employees.filter(e => e.department === d);
        const avgPerf = emps.length ? (emps.reduce((s, e) => s + e.performance, 0) / emps.length) : 0;
        const avgProgress = emps.length ? Math.round(emps.reduce((s, e) => s + e.progress, 0) / emps.length) : 0;
        return {
            department: d,
            count: emps.length,
            avg_performance: parseFloat(avgPerf.toFixed(2)),
            avg_progress: avgProgress
        };
    });

    const perfDistribution = {
        needs_improvement: employees.filter(e => e.performance < 1.5).length,
        below_average: employees.filter(e => e.performance >= 1.5 && e.performance < 2.5).length,
        average: employees.filter(e => e.performance >= 2.5 && e.performance < 3.5).length,
        good: employees.filter(e => e.performance >= 3.5 && e.performance < 4.5).length,
        excellent: employees.filter(e => e.performance >= 4.5).length
    };

    const progressBrackets = {
        needs_improvement: employees.filter(e => e.progress <= 40).length,
        average: employees.filter(e => e.progress > 40 && e.progress <= 60).length,
        good: employees.filter(e => e.progress > 60 && e.progress <= 80).length,
        excellent: employees.filter(e => e.progress > 80).length
    };

    const attendanceSummary = {
        present: employees.filter(e => e.attendance >= 90).length,
        absent: employees.filter(e => e.attendance < 70).length,
        late: employees.filter(e => e.attendance >= 70 && e.attendance < 80).length,
        on_leave: employees.filter(e => e.status === 'On Leave').length
    };

    const reportStatus = [
        { status: 'Submitted', count: reports.filter(r => r.status === 'Submitted').length },
        { status: 'Pending', count: reports.filter(r => r.status === 'Pending').length },
        { status: 'Approved', count: reports.filter(r => r.status === 'Approved').length },
        { status: 'Rejected', count: reports.filter(r => r.status === 'Rejected').length }
    ];

    res.json({
        deptPerformance,
        perfDistribution,
        progressBrackets,
        attendanceSummary,
        reportStatus
    });
});

// GET /api/dashboard/top-performers
router.get('/top-performers', authenticateToken, (req, res) => {
    const top = [...employees].sort((a, b) => b.performance - a.performance).slice(0, 5);
    res.json(top.map(e => ({ name: e.name, performance: e.performance })));
});

// GET /api/dashboard/department-overview
router.get('/department-overview', authenticateToken, (req, res) => {
    const overview = departments.map(d => {
        const emps = employees.filter(e => e.department === d);
        return {
            department: d,
            count: emps.length,
            avg_performance: emps.length ? parseFloat((emps.reduce((s, e) => s + e.performance, 0) / emps.length).toFixed(2)) : 0,
            avg_progress: emps.length ? Math.round(emps.reduce((s, e) => s + e.progress, 0) / emps.length) : 0
        };
    });
    res.json(overview);
});

module.exports = router;
