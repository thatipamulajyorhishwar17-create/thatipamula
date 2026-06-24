const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

let reports = [
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

router.get('/', authenticateToken, (req, res) => {
    let result = [...reports];
    if (req.query.status) {
        result = result.filter(r => r.status === req.query.status);
    }
    if (req.query.employee_id) {
        result = result.filter(r => r.employee_id === req.query.employee_id);
    }
    res.json(result);
});

router.get('/:id', authenticateToken, (req, res) => {
    const r = reports.find(x => x.id === req.params.id);
    if (!r) return res.status(404).json({ message: 'Report not found' });
    res.json(r);
});

router.post('/', authenticateToken, (req, res) => {
    const newReport = {
        id: 'RPT' + String(reports.length + 1).padStart(3, '0'),
        employee_id: req.body.employeeId,
        employee_name: req.body.employeeName,
        project: req.body.project,
        date: req.body.reportDate,
        tasks_completed: parseInt(req.body.tasksCompleted) || 0,
        tasks_pending: parseInt(req.body.tasksPending) || 0,
        working_hours: parseFloat(req.body.workingHours) || 0,
        progress: parseInt(req.body.progress) || 0,
        manager_comments: '',
        status: 'Submitted'
    };
    reports.push(newReport);
    res.status(201).json({ message: 'Report submitted', report: newReport });
});

router.put('/:id/status', authenticateToken, (req, res) => {
    const idx = reports.findIndex(r => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Report not found' });
    reports[idx].status = req.body.status;
    if (req.body.managerComments) reports[idx].manager_comments = req.body.managerComments;
    res.json({ message: 'Report status updated', report: reports[idx] });
});

router.delete('/:id', authenticateToken, (req, res) => {
    const idx = reports.findIndex(r => r.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Report not found' });
    reports.splice(idx, 1);
    res.json({ message: 'Report deleted' });
});

module.exports = router;
