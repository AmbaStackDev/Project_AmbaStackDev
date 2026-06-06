const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/ProductController');

// Kita nonaktifkan sementara fitur keamanan untuk fokus pada CRUD Sprint 12
// const { verifyToken, isAdmin } = require('../middleware/authMiddleware'); 

const upload = require('../middleware/uploadMiddleware'); 

// 1. READ (Menarik semua produk untuk katalog dan tabel admin)
router.get('/', (req, res, next) => {
    console.log('>>> HIT GET /products');
    next();
}, ProductController.index);

// 2. READ SATUAN (Menarik 1 produk khusus untuk Form Edit)
router.get('/:id', ProductController.show);

// 3. CREATE (Menambah produk - tanpa verifyToken sementara)
router.post('/', upload.single('image'), ProductController.store);

// 4. UPDATE (Memperbarui produk - tanpa verifyToken sementara)
router.put('/:id', upload.single('image'), ProductController.update);

// 5. DELETE (Menghapus produk - Sebelumnya rute ini lupa dibuat!)
router.delete('/:id', ProductController.destroy);

module.exports = router;