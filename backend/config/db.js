const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'ambacart_db'
});

db.connect((err) => {
    if (err) {
        console.error('Gagal terkoneksi ke database:', err.message);
        return;
    }
    console.log('Berhasil terkoneksi ke database MySQL: ambacart_db');
});

module.exports = db;