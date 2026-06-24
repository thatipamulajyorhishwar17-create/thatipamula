const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'project_solovers_jwt_secret_key_2024';

const authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token.' });
    }
};

const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin' && req.user.role !== 'super_admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
};

const authorizeEmployee = (req, res, next) => {
    if (req.user.role !== 'employee') {
        return res.status(403).json({ message: 'Access denied. Employee only.' });
    }
    next();
};

module.exports = { authenticate, authorizeAdmin, authorizeEmployee, JWT_SECRET };
