const db = require('../config/db');

class UserModel {
    static findByEmail(email, callback) {
        db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
            callback(err, results);
        });
    }

    static create(data, callback) {
        const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
        const role = data.role || 'user'; 
        db.query(query, [data.name, data.email, data.password, role], (err, results) => {
            callback(err, results);
        });
    }
}

module.exports = UserModel;