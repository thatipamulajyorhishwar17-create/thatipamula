const mysql = require('mysql2/promise');
const config = require('./db.config');

const pool = mysql.createPool({
    host: config.HOST,
    user: config.USER,
    password: config.PASSWORD,
    database: config.DB,
    waitForConnections: true,
    connectionLimit: config.pool.max,
    queueLimit: 0
});

module.exports = pool;
