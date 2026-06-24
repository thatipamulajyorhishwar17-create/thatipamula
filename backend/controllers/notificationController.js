const pool = require('../config/db');

const getNotifications = async (req, res) => {
    try {
        let query = 'SELECT * FROM notifications WHERE';
        let params = [];
        if (req.user.role === 'admin' || req.user.role === 'super_admin') {
            query += " (user_id = 'admin' OR user_type = 'admin')";
        } else {
            query += ' (user_id = ? OR user_type = ?)';
            params.push(req.user.id, 'employee');
        }
        query += ' ORDER BY created_at DESC LIMIT 50';
        const [rows] = await pool.query(query, params);
        return res.json(rows);
    } catch (err) {
        console.error('Get notifications error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const markAsRead = async (req, res) => {
    try {
        await pool.query('UPDATE notifications SET is_read = 1 WHERE id = ?', [req.params.id]);
        return res.json({ message: 'Notification marked as read' });
    } catch (err) {
        console.error('Mark as read error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const markAllAsRead = async (req, res) => {
    try {
        if (req.user.role === 'admin' || req.user.role === 'super_admin') {
            await pool.query("UPDATE notifications SET is_read = 1 WHERE user_id = 'admin' OR user_type = 'admin'");
        } else {
            await pool.query('UPDATE notifications SET is_read = 1 WHERE user_id = ?', [req.user.id]);
        }
        return res.json({ message: 'All notifications marked as read' });
    } catch (err) {
        console.error('Mark all as read error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const createNotification = async (userId, userType, title, message, type = 'info') => {
    try {
        await pool.query(
            'INSERT INTO notifications (user_id, user_type, title, message, type) VALUES (?, ?, ?, ?, ?)',
            [userId, userType, title, message, type]
        );
    } catch (err) {
        console.error('Create notification error:', err);
    }
};

module.exports = { getNotifications, markAsRead, markAllAsRead, createNotification };
