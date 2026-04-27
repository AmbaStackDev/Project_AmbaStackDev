JavaScript
const multer = require('multer');
const path = require('path');

// 1. Konfigurasi Storage & Rename File Otomatis
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // File akan disimpan di folder backend/uploads/
    },
    filename: function (req, file, cb) {
        // Format: timestamp-randomangka.ekstensi (contoh: 1690123-456.jpg)
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); 
    }
});

// 2. Validasi Tipe File (Hanya menerima gambar)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Validasi Error: Hanya file gambar (JPG, JPEG, PNG, WEBP) yang diperbolehkan!'));
    }
};

// 3. Inisialisasi Multer dengan batasan ukuran 2MB
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Maksimal 2 MB
    fileFilter: fileFilter
});

module.exports = upload;
