const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');

class AuthController {
    static async register(req, res) {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: 'Nama, Email, dan Password wajib diisi!' });
        }

        UserModel.findByEmail(email, async (err, results) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            if (results.length > 0) return res.status(400).json({ success: false, message: 'Email sudah terdaftar!' });

            try {
                // Hashing Password
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                UserModel.create({ name, email, password: hashedPassword, role }, (err, insertResult) => {
                    if (err) return res.status(500).json({ success: false, error: err.message });
                    res.status(201).json({ success: true, message: 'Register berhasil! Silakan login.' });
                });
            } catch (error) {
                res.status(500).json({ success: false, message: 'Terjadi kesalahan sistem' });
            }
        });
    }
}

module.exports = AuthController;