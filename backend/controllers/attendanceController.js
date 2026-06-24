const pool = require('../config/db');

const getAttendance = async (req, res) => {
    try {
        let query = `SELECT a.*, e.name as employee_name, e.department FROM attendance a JOIN employees e ON a.employee_id = e.id`;
        let params = [];
        if (req.query.employee_id) {
            query += ' WHERE a.employee_id = ?';
            params.push(req.query.employee_id);
        }
        if (req.query.date) {
            query += params.length ? ' AND a.date = ?' : ' WHERE a.date = ?';
            params.push(req.query.date);
        }
        query += ' ORDER BY a.date DESC, a.employee_id ASC';
        const [rows] = await pool.query(query, params);
        return res.json(rows);
    } catch (err) {
        console.error('Get attendance error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getEmployeeAttendance = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT a.*, e.name as employee_name, e.department FROM attendance a JOIN employees e ON a.employee_id = e.id WHERE a.employee_id = ? ORDER BY a.date DESC LIMIT 60',
            [req.params.employeeId]
        );
        const [stats] = await pool.query(
            `SELECT
                SUM(CASE WHEN status = 'Present' THEN 1 ELSE 0 END) as present,
                SUM(CASE WHEN status = 'Late' THEN 1 ELSE 0 END) as late,
                SUM(CASE WHEN status = 'Absent' THEN 1 ELSE 0 END) as absent,
                SUM(CASE WHEN status = 'On Leave' THEN 1 ELSE 0 END) as on_leave,
                COALESCE(SUM(hours), 0) as total_hours
             FROM attendance WHERE employee_id = ?`,
            [req.params.employeeId]
        );
        return res.json({ records: rows, stats: stats[0] });
    } catch (err) {
        console.error('Get employee attendance error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const checkIn = async (req, res) => {
    try {
        const { employeeId } = req.body;
        if (!employeeId) return res.status(400).json({ message: 'Employee ID required' });
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const [existing] = await pool.query('SELECT * FROM attendance WHERE employee_id = ? AND date = ?', [employeeId, today]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Already checked in today' });
        }
        const hour = now.getHours();
        const status = (hour >= 9 && hour < 10 && now.getMinutes() <= 15) || hour < 9 ? 'Present' : 'Late';
        await pool.query(
            'INSERT INTO attendance (employee_id, date, check_in, status) VALUES (?, ?, ?, ?)',
            [employeeId, today, timeStr, status]
        );
        await pool.query('UPDATE employees SET check_in = ? WHERE id = ?', [timeStr, employeeId]);
        return res.json({ message: 'Check-in recorded', time: timeStr, status });
    } catch (err) {
        console.error('Check-in error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const checkOut = async (req, res) => {
    try {
        const { employeeId } = req.body;
        if (!employeeId) return res.status(400).json({ message: 'Employee ID required' });
        const today = new Date().toISOString().split('T')[0];
        const now = new Date();
        const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        const [existing] = await pool.query('SELECT * FROM attendance WHERE employee_id = ? AND date = ?', [employeeId, today]);
        if (existing.length === 0) {
            return res.status(400).json({ message: 'No check-in record found for today' });
        }
        if (existing[0].check_out) {
            return res.status(400).json({ message: 'Already checked out today' });
        }
        const checkInTime = existing[0].check_in;
        const [hours, minutes, period] = checkInTime.match(/(\d+):(\d+)\s*(AM|PM)/i).slice(1);
        let checkInHour = parseInt(hours);
        if (period.toUpperCase() === 'PM' && checkInHour !== 12) checkInHour += 12;
        if (period.toUpperCase() === 'AM' && checkInHour === 12) checkInHour = 0;
        const checkInDate = new Date(today);
        checkInDate.setHours(checkInHour, parseInt(minutes), 0);
        const diffMs = now - checkInDate;
        const workHours = Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;
        await pool.query(
            'UPDATE attendance SET check_out = ?, hours = ? WHERE id = ?',
            [timeStr, workHours, existing[0].id]
        );
        await pool.query('UPDATE employees SET check_out = ?, work_hours = ? WHERE id = ?', [timeStr, workHours, employeeId]);
        return res.json({ message: 'Check-out recorded', time: timeStr, hours: workHours });
    } catch (err) {
        console.error('Check-out error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const getTodayAttendance = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const [rows] = await pool.query(
            `SELECT a.*, e.name as employee_name, e.department FROM attendance a
             JOIN employees e ON a.employee_id = e.id
             WHERE a.date = ? ORDER BY a.check_in ASC`,
            [today]
        );
        return res.json(rows);
    } catch (err) {
        console.error('Get today attendance error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAttendance, getEmployeeAttendance, checkIn, checkOut, getTodayAttendance };
