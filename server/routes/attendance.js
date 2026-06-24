const express = require('express');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

let attendanceRecords = [
    { employeeId: 'EMP001', date: '2024-06-21', checkIn: '09:00 AM', checkOut: '06:30 PM', hours: 8.5, status: 'Present' },
    { employeeId: 'EMP002', date: '2024-06-21', checkIn: '09:15 AM', checkOut: '06:00 PM', hours: 8.0, status: 'Present' },
    { employeeId: 'EMP003', date: '2024-06-21', checkIn: '09:30 AM', checkOut: '05:45 PM', hours: 7.5, status: 'Present' },
    { employeeId: 'EMP004', date: '2024-06-21', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: 8.0, status: 'Present' },
    { employeeId: 'EMP005', date: '2024-06-21', checkIn: '08:45 AM', checkOut: '07:00 PM', hours: 9.0, status: 'Present' },
    { employeeId: 'EMP006', date: '2024-06-21', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: 8.0, status: 'Present' },
    { employeeId: 'EMP007', date: '2024-06-21', checkIn: '09:30 AM', checkOut: '05:30 PM', hours: 7.5, status: 'Late' },
    { employeeId: 'EMP008', date: '2024-06-21', checkIn: '09:45 AM', checkOut: '05:15 PM', hours: 7.0, status: 'Late' },
    { employeeId: 'EMP009', date: '2024-06-21', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: 8.0, status: 'Present' },
    { employeeId: 'EMP010', date: '2024-06-21', checkIn: '08:30 AM', checkOut: '06:30 PM', hours: 8.5, status: 'Present' },
    { employeeId: 'EMP011', date: '2024-06-21', checkIn: '09:30 AM', checkOut: '05:30 PM', hours: 7.0, status: 'Present' },
    { employeeId: 'EMP012', date: '2024-06-21', checkIn: '09:15 AM', checkOut: '05:45 PM', hours: 7.5, status: 'Present' },
    { employeeId: 'EMP013', date: '2024-06-21', checkIn: '-', checkOut: '-', hours: 0, status: 'On Leave' },
    { employeeId: 'EMP014', date: '2024-06-21', checkIn: '09:00 AM', checkOut: '06:00 PM', hours: 8.0, status: 'Present' }
];

router.get('/', authenticateToken, (req, res) => {
    res.json(attendanceRecords);
});

router.get('/today', authenticateToken, (req, res) => {
    res.json(attendanceRecords);
});

router.get('/:employeeId', authenticateToken, (req, res) => {
    const records = attendanceRecords.filter(a => a.employeeId === req.params.employeeId);
    res.json(records);
});

router.post('/check-in', authenticateToken, (req, res) => {
    const { employeeId } = req.body;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    attendanceRecords.push({
        employeeId,
        date: now.toISOString().split('T')[0],
        checkIn: timeStr,
        checkOut: '--:--',
        hours: 0,
        status: 'Present'
    });
    res.json({ message: 'Check-in recorded', checkIn: timeStr });
});

router.post('/check-out', authenticateToken, (req, res) => {
    const { employeeId } = req.body;
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    res.json({ message: 'Check-out recorded', checkOut: timeStr });
});

module.exports = router;
