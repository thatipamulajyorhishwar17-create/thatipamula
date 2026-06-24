const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function seed() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'project_solovers',
        waitForConnections: true,
        connectionLimit: 1,
        queueLimit: 0
    });

    const salt = await bcrypt.genSalt(10);

    // Hash admin password: admin123
    const adminHash = await bcrypt.hash('admin123', salt);
    await pool.query('UPDATE admins SET password = ? WHERE email = ?', [adminHash, 'admin@projectsolovers.com']);
    console.log('Admin password hashed: admin123');

    // Hash employee passwords: emp@001 through emp@010
    for (let i = 1; i <= 10; i++) {
        const empId = 'EMP' + String(i).padStart(3, '0');
        const pass = 'emp@' + String(i).padStart(3, '0');
        const hash = await bcrypt.hash(pass, salt);
        await pool.query('UPDATE employees SET password = ? WHERE id = ?', [hash, empId]);
        console.log(`Employee ${empId} password hashed: ${pass}`);
    }

    console.log('\nAll passwords seeded successfully!');
    await pool.end();
}

seed().catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
});
