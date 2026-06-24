const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

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

router.get('/', authenticateToken, (req, res) => {
    const employeeId = req.query.employee_id;
    let result = projects;
    if (employeeId) {
        result = projects.filter(p => p.team_ids && p.team_ids.split(',').includes(employeeId));
    }
    res.json(result);
});

router.get('/:id', authenticateToken, (req, res) => {
    const p = projects.find(x => x.id === req.params.id);
    if (!p) return res.status(404).json({ message: 'Project not found' });
    res.json(p);
});

router.post('/', authenticateToken, (req, res) => {
    const newProject = {
        id: 'PRJ' + String(projects.length + 1).padStart(3, '0'),
        ...req.body,
        completion: 0
    };
    projects.push(newProject);
    res.status(201).json({ message: 'Project created', project: newProject });
});

router.put('/:id', authenticateToken, (req, res) => {
    const idx = projects.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Project not found' });
    projects[idx] = { ...projects[idx], ...req.body };
    res.json({ message: 'Project updated', project: projects[idx] });
});

router.delete('/:id', authenticateToken, (req, res) => {
    const idx = projects.findIndex(p => p.id === req.params.id);
    if (idx === -1) return res.status(404).json({ message: 'Project not found' });
    projects.splice(idx, 1);
    res.json({ message: 'Project deleted' });
});

module.exports = router;
