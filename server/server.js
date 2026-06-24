const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// ====== MIDDLEWARE ======
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// ====== API ROUTES (MUST be before static files) ======
const authRoutes = require('./routes/auth');

// Diagnostic: minimal POST handler (no deps, no async) to test Render POST handling
app.post('/api/debug/ping', (req, res) => {
    res.json({ ok: true, received: req.body || {} });
});

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
app.all('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ====== STATIC FILES ======
app.use(express.static(path.join(__dirname, '..')));

// ====== FALLBACKS ======
// SPA fallback - serve index.html for non-API GET routes
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ success: false, message: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// JSON 404 for any unmatched POST/PUT/DELETE to /api/*
app.use('/api/*', (req, res) => {
    res.status(404).json({ success: false, message: 'API endpoint not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    if (!res.headersSent) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// ====== STARTUP ======
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
                { id: 'admin', name: 'Admin', email: 'admin@company.com', password: 'admin123', role: 'admin', created_at: new Date().toISOString() }
            ];
            const seededUsers = [];
            for (const user of adminUsers) {
                seededUsers.push({ ...user, password: await bcrypt.hash(user.password, 10) });
            }
            fs.writeFileSync(USERS_FILE, JSON.stringify(seededUsers, null, 2));
            console.log('  Auto-seeded 1 admin user');
        } catch (e) {
            console.error('  Auto-seed failed:', e.message);
        }
    }
}

app.listen(PORT, () => {
    console.log(`\n  Project Slovers Backend Server`);
    console.log(`  ================================`);
    console.log(`  URL:        http://0.0.0.0:${PORT}`);
    console.log(`  API:        http://0.0.0.0:${PORT}/api`);
    console.log(`  Frontend:   http://0.0.0.0:${PORT}/login.html`);
    console.log(`  \n  Admin Login:`);
    console.log(`    - admin / admin123`);
    console.log(`  ================================\n`);
});

// Auto-seed in background
autoSeed().then(() => {
    console.log('Auto-seed check complete');
}).catch(err => {
    console.error('Auto-seed failed:', err);
});
