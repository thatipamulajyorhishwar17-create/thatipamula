const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

let notifications = [
    { id: 1, message: 'New report submitted by Rajesh Kumar', read: false, type: 'info', created_at: new Date().toISOString() },
    { id: 2, message: 'Project NeuralNet is 88% complete', read: false, type: 'success', created_at: new Date().toISOString() },
    { id: 3, message: 'Employee Ananya Verma marked Late', read: false, type: 'warning', created_at: new Date().toISOString() }
];

router.get('/', authenticateToken, (req, res) => {
    res.json(notifications);
});

router.put('/:id/read', authenticateToken, (req, res) => {
    const n = notifications.find(x => x.id === parseInt(req.params.id));
    if (n) n.read = true;
    res.json({ message: 'Notification marked as read' });
});

router.put('/read-all', authenticateToken, (req, res) => {
    notifications.forEach(n => n.read = true);
    res.json({ message: 'All notifications marked as read' });
});

module.exports = router;
