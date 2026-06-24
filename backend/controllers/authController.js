const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const { JWT_SECRET } = require('../middleware/auth');
const { sendOTPEmail } = require('../utils/email');

const login = async (req, res) => {
    try {
        const { id, password, role } = req.body;
        if (!id || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        if (role === 'admin') {
            const [admins] = await pool.query('SELECT * FROM admins WHERE email = ? OR id = ?', [id, isNaN(id) ? 0 : id]);
            if (admins.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const admin = admins[0];
            const validPassword = await bcrypt.compare(password, admin.password);
            if (!validPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const token = jwt.sign({ id: admin.id, name: admin.name, email: admin.email, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
            return res.json({
                message: 'Login successful',
                token,
                user: { id: admin.id, name: admin.name, email: admin.email, role: 'admin' }
            });
        } else if (role === 'employee') {
            const [employees] = await pool.query('SELECT * FROM employees WHERE id = ? OR email = ?', [id, id]);
            if (employees.length === 0) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const employee = employees[0];
            const validPassword = await bcrypt.compare(password, employee.password);
            if (!validPassword) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const token = jwt.sign({
                id: employee.id,
                name: employee.name,
                email: employee.email,
                role: 'employee',
                department: employee.department
            }, JWT_SECRET, { expiresIn: '24h' });
            return res.json({
                message: 'Login successful',
                token,
                user: {
                    id: employee.id,
                    name: employee.name,
                    email: employee.email,
                    role: 'employee',
                    department: employee.department,
                    isFirstLogin: employee.is_first_login === 1
                }
            });
        }
        return res.status(400).json({ message: 'Invalid role' });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ message: 'Email is required' });
        const [employees] = await pool.query('SELECT * FROM employees WHERE email = ?', [email]);
        const [admins] = await pool.query('SELECT * FROM admins WHERE email = ?', [email]);
        if (employees.length === 0 && admins.length === 0) {
            return res.status(404).json({ message: 'Email not found in our records' });
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        await pool.query('DELETE FROM password_reset_otps WHERE email = ?', [email]);
        await pool.query('INSERT INTO password_reset_otps (email, otp, expires_at) VALUES (?, ?, ?)', [email, otp, expiresAt]);
        try {
            await sendOTPEmail(email, otp);
        } catch (emailErr) {
            console.error('Email send failed:', emailErr.message);
        }
        return res.json({ message: 'OTP sent to your email', otp: process.env.NODE_ENV === 'development' ? otp : undefined });
    } catch (err) {
        console.error('Forgot password error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required' });
        const [records] = await pool.query(
            'SELECT * FROM password_reset_otps WHERE email = ? AND otp = ? AND is_verified = 0 AND expires_at > NOW()',
            [email, otp]
        );
        if (records.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        await pool.query('UPDATE password_reset_otps SET is_verified = 1 WHERE id = ?', [records[0].id]);
        return res.json({ message: 'OTP verified successfully' });
    } catch (err) {
        console.error('Verify OTP error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) return res.status(400).json({ message: 'Email and new password are required' });
        if (newPassword.length < 4) return res.status(400).json({ message: 'Password must be at least 4 characters' });
        const [otpRecords] = await pool.query(
            'SELECT * FROM password_reset_otps WHERE email = ? AND is_verified = 1 ORDER BY id DESC LIMIT 1',
            [email]
        );
        if (otpRecords.length === 0) {
            return res.status(400).json({ message: 'Please verify OTP first' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        const [employees] = await pool.query('SELECT * FROM employees WHERE email = ?', [email]);
        if (employees.length > 0) {
            await pool.query('UPDATE employees SET password = ?, is_first_login = 0 WHERE email = ?', [hashedPassword, email]);
        } else {
            await pool.query('UPDATE admins SET password = ? WHERE email = ?', [hashedPassword, email]);
        }
        await pool.query('DELETE FROM password_reset_otps WHERE email = ?', [email]);
        return res.json({ message: 'Password reset successful' });
    } catch (err) {
        console.error('Reset password error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) return res.status(400).json({ message: 'All fields are required' });
        if (newPassword.length < 4) return res.status(400).json({ message: 'Password must be at least 4 characters' });
        let user;
        if (req.user.role === 'admin') {
            const [admins] = await pool.query('SELECT * FROM admins WHERE id = ?', [req.user.id]);
            user = admins[0];
        } else {
            const [employees] = await pool.query('SELECT * FROM employees WHERE id = ?', [req.user.id]);
            user = employees[0];
        }
        if (!user) return res.status(404).json({ message: 'User not found' });
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) return res.status(401).json({ message: 'Current password is incorrect' });
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        if (req.user.role === 'admin') {
            await pool.query('UPDATE admins SET password = ? WHERE id = ?', [hashedPassword, req.user.id]);
        } else {
            await pool.query('UPDATE employees SET password = ?, is_first_login = 0 WHERE id = ?', [hashedPassword, req.user.id]);
        }
        return res.json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error('Change password error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

const firstTimeSetup = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) return res.status(400).json({ message: 'All fields are required' });
        if (newPassword.length < 4) return res.status(400).json({ message: 'Password must be at least 4 characters' });
        const [otpRecords] = await pool.query(
            'SELECT * FROM password_reset_otps WHERE email = ? AND otp = ? AND is_verified = 0 AND expires_at > NOW()',
            [email, otp]
        );
        if (otpRecords.length === 0) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        const [result] = await pool.query('UPDATE employees SET password = ?, is_first_login = 0 WHERE email = ?', [hashedPassword, email]);
        if (result.affectedRows === 0) return res.status(404).json({ message: 'Employee not found' });
        await pool.query('DELETE FROM password_reset_otps WHERE email = ?', [email]);
        return res.json({ message: 'Password setup completed successfully' });
    } catch (err) {
        console.error('First time setup error:', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { login, forgotPassword, verifyOTP, resetPassword, changePassword, firstTimeSetup };
