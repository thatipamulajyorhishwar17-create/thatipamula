const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

const sendOTPEmail = async (to, otp) => {
    const mailOptions = {
        from: `"Project Solovers" <${process.env.SMTP_USER}>`,
        to,
        subject: 'Password Reset OTP - Project Solovers',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <div style="text-align: center; margin-bottom: 20px;">
                    <h2 style="color: #1a237e;">Project Solovers Private Limited</h2>
                    <hr style="border: 1px solid #1a237e;">
                </div>
                <h3>Password Reset Request</h3>
                <p>You have requested to reset your password. Use the following OTP to proceed:</p>
                <div style="text-align: center; margin: 30px 0;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1a237e; background: #e8eaf6; padding: 12px 24px; border-radius: 8px;">${otp}</span>
                </div>
                <p>This OTP is valid for <strong>10 minutes</strong>.</p>
                <p>If you did not request this, please ignore this email.</p>
                <hr style="border: 1px solid #e0e0e0;">
                <p style="color: #666; font-size: 12px; text-align: center;">
                    Project Solovers Private Limited<br>
                    Hyderabad, India<br>
                    &copy; ${new Date().getFullYear()} All rights reserved.
                </p>
            </div>
        `
    };
    return transporter.sendMail(mailOptions);
};

const generateEmployeeId = async (pool) => {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM employees');
    const count = rows[0].count + 1;
    return 'EMP' + String(count).padStart(3, '0');
};

const generateReportId = async (pool) => {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM reports');
    const count = rows[0].count + 1;
    return 'RPT' + String(count).padStart(3, '0');
};

const generateProjectId = async (pool) => {
    const [rows] = await pool.query('SELECT COUNT(*) as count FROM projects');
    const count = rows[0].count + 1;
    return 'PRJ' + String(count).padStart(3, '0');
};

module.exports = { sendOTPEmail, generateEmployeeId, generateReportId, generateProjectId };
