const express = require('express');
const router = express.Router();
const { login, forgotPassword, verifyOTP, resetPassword, changePassword, firstTimeSetup } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');

router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.post('/change-password', authenticate, changePassword);
router.post('/first-time-setup', firstTimeSetup);

module.exports = router;
