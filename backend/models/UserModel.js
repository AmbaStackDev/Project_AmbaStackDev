const db = require('../config/db');

class UserModel {
    // Mencari user berdasarkan Email (Untuk Login/Register)
    static findByEmail(email, callback) {
        db.query('SELECT * FROM users WHERE email = ?', [email], callback);
    }

    // Membuat user baru (Untuk Register)
    static create(data, callback) {
        db.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [data.name, data.email, data.password, data.role || 'customer'],
            callback
        );
    }

    // [BARU] Mencari user berdasarkan ID (Untuk Get Profile)
    static findById(id, callback) {
        db.query(
            'SELECT id, name, email, role, phone_number, address, city, postal_code FROM users WHERE id = ?',
            [id],
            callback
        );
    }

    // [BARU] Memperbarui data user (Untuk Simpan Profil)
    static updateProfile(id, data, callback) {
        const { name, phone_number, address, city, postal_code } = data;
        db.query(
            'UPDATE users SET name = ?, phone_number = ?, address = ?, city = ?, postal_code = ? WHERE id = ?',
            [name, phone_number, address, city, postal_code, id],
            callback
        );
    }
}

module.exports = UserModel;