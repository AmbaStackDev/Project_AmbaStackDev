const ProductModel = require('../models/ProductModel');

class ProductController {
    static index(req, res) {
        ProductModel.getAllProducts((err, results) => {
            if (err) return res.status(500).json({ error: 'Failed to retrieve products' });
            res.json({ message: 'Products retrieved successfully', data: results });
        });
    }

    static store(req, res) {
        const { name, description, price, stock, category_id } = req.body;

        if (!name || !price) {
            return res.status(400).json({ success: false, message: 'Validasi gagal: Nama dan harga wajib diisi!' });
        }
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ success: false, message: 'Validasi gagal: Harga harus berupa angka lebih dari 0!' });
        }

        ProductModel.create({ name, description, price, stock: stock || 0, category_id: category_id || null }, (err, results) => {
            if (err) return res.status(500).json({ success: false, message: 'Gagal menyimpan', error: err.message });
            res.status(201).json({ success: true, message: 'Produk ditambahkan!', data: { id: results.insertId, name, price } });
        });
    }
}

module.exports = ProductController;