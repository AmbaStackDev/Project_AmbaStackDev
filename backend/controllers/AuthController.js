const UserModel = require('../models/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // ← TAMBAHAN BARU

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

    // ↓ TAMBAHAN BARU
    static login(req, res) {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ success: false, message: 'Email dan Password wajib diisi!' });

        UserModel.findByEmail(email, async (err, results) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            if (results.length === 0)
                return res.status(404).json({ success: false, message: 'Email tidak ditemukan!' });

            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch)
                return res.status(400).json({ success: false, message: 'Password salah!' });

            const token = jwt.sign(
                { id: user.id, email: user.email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            res.json({ success: true, message: 'Login berhasil!', token: token });
        });
    }
}

module.exports = AuthController;