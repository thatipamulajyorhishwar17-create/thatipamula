const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Auto-seed admin users if users.json doesn't exist
const USERS_FILE = path.join(dataDir, 'users.json');
async function autoSeed() {
    if (!fs.existsSync(USERS_FILE)) {
        try {
            const bcrypt = require('bcryptjs');
            const adminUsers = [
                { id: 'admin', name: 'Admin', email: 'admin@company.com', password: 'admin123', role: 'admin', created_at: new Date().toISOString() },
                { id: 'thatipamulajyothishwargoud@gmail.com', name: 'Jyothishwar Goud Thatipamula', email: 'thatipamulajyothishwargoud@gmail.com', password: 'Bhanu@9002', role: 'admin', created_at: new Date().toISOString() }
            ];
            const seededUsers = [];
            for (const user of adminUsers) {
                seededUsers.push({ ...user, password: await bcrypt.hash(user.password, 10) });
            }
            fs.writeFileSync(USERS_FILE, JSON.stringify(seededUsers, null, 2));
            console.log(`  Auto-seeded ${seededUsers.length} admin user(s)`);
        } catch (e) {
            console.error('  Auto-seed failed:', e.message);
        }
    }
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files from the parent directory (frontend)
app.use(express.static(path.join(__dirname, '..')));

// API Routes
const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employees');
const attendanceRoutes = require('./routes/attendance');
const projectRoutes = require('./routes/projects');
const reportRoutes = require('./routes/reports');
const dashboardRoutes = require('./routes/dashboard');
const notificationRoutes = require('./routes/notifications');

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/notifications', notificationRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// SPA fallback - serve index.html for all non-file, non-api routes
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ message: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

autoSeed().then(() => {
    app.listen(PORT, () => {
        console.log(`\n  Project Slovers Backend Server`);
        console.log(`  ================================`);
        console.log(`  URL:        http://localhost:${PORT}`);
        console.log(`  API:        http://localhost:${PORT}/api`);
        console.log(`  Frontend:   http://localhost:${PORT}/login.html`);
        console.log(`  \n  Admin Logins:`);
        console.log(`    - admin / admin123 (legacy)`);
        console.log(`    - thatipamulajyothishwargoud@gmail.com / Bhanu@9002 (new)`);
        console.log(`  ================================\n`);
    });
}).catch(err => {
    console.error('Failed to start server:', err);
    process.exit(1);
});
