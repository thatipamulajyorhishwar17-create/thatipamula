const express = require('express');
const router = express.Router();
const { getAttendance, getEmployeeAttendance, checkIn, checkOut, getTodayAttendance } = require('../controllers/attendanceController');
const { authenticate } = require('../middleware/auth');

router.get('/', authenticate, getAttendance);
router.get('/today', authenticate, getTodayAttendance);
router.get('/:employeeId', authenticate, getEmployeeAttendance);
router.post('/check-in', authenticate, checkIn);
router.post('/check-out', authenticate, checkOut);

module.exports = router;
