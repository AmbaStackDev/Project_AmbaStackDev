const UserModel = require('../models/UserModel');

class UserController {
    // 1. Mengambil data profil pembeli aktif
    static getProfile(req, res) {
        // req.user otomatis disisipkan oleh authMiddleware (verifyToken)
        const userId = req.user.id; 

        UserModel.findById(userId, (err, results) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            if (results.length === 0) {
                return res.status(404).json({ success: false, message: 'User tidak ditemukan!' });
            }
            res.status(200).json({ success: true, data: results[0] });
        });
    }

    // 2. Memperbarui data alamat & logistik pembeli
    static updateProfile(req, res) {
        const userId = req.user.id;
        const { name, phone_number, address, city, postal_code } = req.body;

        if (!name) {
            return res.status(400).json({ success: false, message: 'Nama lengkap wajib diisi!' });
        }

        const updateData = { name, phone_number, address, city, postal_code };

        UserModel.updateProfile(userId, updateData, (err, result) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.status(200).json({ success: true, message: 'Profil Anda sukses diperbarui!' });
        });
    }
}

module.exports = UserController;