const express = require('express');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const { generateToken, findUser } = require('../middleware/auth');

const router = express.Router();
const USERS_FILE = path.join(__dirname, '..', 'data', 'users.json');

const otpStore = {};

const EMPLOYEES = [
    { id: 'EMP001', name: 'Rajesh Kumar', email: 'rajesh.kumar@company.com', password: 'emp@001', department: 'Software Development' },
    { id: 'EMP002', name: 'Priya Sharma', email: 'priya.sharma@company.com', password: 'emp@002', department: 'Web Development' },
    { id: 'EMP003', name: 'Amit Patel', email: 'amit.patel@company.com', password: 'emp@003', department: 'UI/UX Design' },
    { id: 'EMP004', name: 'Sneha Reddy', email: 'sneha.reddy@company.com', password: 'emp@004', department: 'Data Analytics' },
    { id: 'EMP005', name: 'Vikram Singh', email: 'vikram.singh@company.com', password: 'emp@005', department: 'Artificial Intelligence' },
    { id: 'EMP006', name: 'Neha Gupta', email: 'neha.gupta@company.com', password: 'emp@006', department: 'Human Resources' },
    { id: 'EMP007', name: 'Arjun Nair', email: 'arjun.nair@company.com', password: 'emp@007', department: 'Marketing' },
    { id: 'EMP008', name: 'Divya Menon', email: 'divya.menon@company.com', password: 'emp@008', department: 'Finance' },
    { id: 'EMP009', name: 'Rohan Desai', email: 'rohan.desai@company.com', password: 'emp@009', department: 'Quality Assurance' },
    { id: 'EMP010', name: 'Kavita Joshi', email: 'kavita.joshi@company.com', password: 'emp@010', department: 'Administration' },
    { id: 'EMP011', name: 'Suresh Iyer', email: 'suresh.iyer@company.com', password: 'emp@011', department: 'Software Development' },
    { id: 'EMP012', name: 'Ananya Verma', email: 'ananya.verma@company.com', password: 'emp@012', department: 'Web Development' },
    { id: 'EMP013', name: 'Manish Tiwari', email: 'manish.tiwari@company.com', password: 'emp@013', department: 'Data Analytics' },
    { id: 'EMP014', name: 'Pooja Mehta', email: 'pooja.mehta@company.com', password: 'emp@014', department: 'Artificial Intelligence' }
];

router.get('/login', (req, res) => {
    res.json({ method: 'GET', message: 'Use POST to login' });
});

router.post('/login', (req, res) => {
    console.log('POST login called, body keys:', Object.keys(req.body));
    res.json({ success: true, body: req.body });
});

router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Please provide your Employee ID or Email' });
        }
        const user = findUser(email);
        const emp = EMPLOYEES.find(e => e.id === email || e.email === email);
        if (!user && !emp) {
            return res.status(404).json({ message: 'Account not found with this ID/Email' });
        }
        const targetEmail = user ? user.email : emp.email;
        const otp = String(Math.floor(100000 + Math.random() * 900000));
        otpStore[targetEmail] = { otp, expiresAt: Date.now() + 10 * 60 * 1000 };
        return res.json({
            message: 'Verification code sent',
            otp: otp,
            email: targetEmail
        });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
});

router.post('/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: 'Please provide email and OTP' });
    }
    const stored = otpStore[email];
    if (!stored) {
        return res.status(400).json({ message: 'No verification code sent to this email' });
    }
    if (Date.now() > stored.expiresAt) {
        delete otpStore[email];
        return res.status(400).json({ message: 'Verification code has expired' });
    }
    if (stored.otp !== otp) {
        return res.status(400).json({ message: 'Invalid verification code' });
    }
    delete otpStore[email];
    return res.json({ message: 'OTP verified successfully' });
});

router.post('/reset-password', async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({ message: 'Please provide email and new password' });
        }
        if (newPassword.length < 4) {
            return res.status(400).json({ message: 'Password must be at least 4 characters' });
        }
        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        const userIndex = users.findIndex(u => u.email === email);
        if (userIndex === -1) {
            return res.status(404).json({ message: 'User not found' });
        }
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        users[userIndex].password = hashedPassword;
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        return res.json({ message: 'Password reset successful' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
});

router.post('/change-password', async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Please provide current and new password' });
        }
        if (newPassword.length < 4) {
            return res.status(400).json({ message: 'Password must be at least 4 characters' });
        }
        const user = findUser(req.user?.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const validPassword = await bcrypt.compare(currentPassword, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }
        const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
        const userIndex = users.findIndex(u => u.id === user.id);
        users[userIndex].password = await bcrypt.hash(newPassword, 10);
        fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
        return res.json({ message: 'Password updated successfully!' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
});

router.post('/first-time-setup', async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Please provide email, OTP, and new password' });
        }
        const stored = otpStore[email];
        if (!stored || stored.otp !== otp) {
            return res.status(400).json({ message: 'Invalid verification code' });
        }
        if (newPassword.length < 4) {
            return res.status(400).json({ message: 'Password must be at least 4 characters' });
        }
        const emp = EMPLOYEES.find(e => e.id === email || e.email === email);
        if (!emp) {
            return res.status(404).json({ message: 'Employee not found' });
        }
        emp.password = newPassword;
        delete otpStore[email];
        return res.json({ message: 'Password set successfully!' });
    } catch (err) {
        return res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
