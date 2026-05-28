const mysql = require('mysql2');
require('dotenv').config();

const db = mysql.createPool({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
});

db.query('SELECT 1', (err) => {
    if (err) {
        console.error('Gagal terkoneksi ke database:', err.message);
    } else {
        console.log('Berhasil terkoneksi ke database MySQL: ambacart_db');
    }
});

module.exports = db;