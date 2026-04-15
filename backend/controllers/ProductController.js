const ProductModel = require('../models/ProductModel');

class ProductController {
    
    static index(req, res) {
        ProductModel.getAllProducts((err, results) => {
            if (err) {
                return res.status(500).json({ status: 500, message: 'Database Error', error: err.message });
            }
            res.status(200).json({ status: 200, data: results });
        });
    }

    static store(req, res) {
        const { name, price } = req.body;

        if (!name || !price) {
            return res.status(400).json({ status: 400, message: 'Nama dan harga wajib diisi!' });
        }

        ProductModel.create(req.body, (err, results) => {
            if (err) {
                return res.status(500).json({ status: 500, message: 'Gagal simpan data', error: err.message });
            }
            res.status(201).json({ status: 201, message: 'Produk berhasil dibuat' });
        });
    }

    static update(req, res) {
        const id = req.params.id;
        ProductModel.update(id, req.body, (err, results) => {
            if (err) {
                return res.status(500).json({ status: 500, message: 'Database Error' });
            }
            
            if (results.affectedRows === 0) {
                return res.status(404).json({ status: 404, message: 'Produk tidak ditemukan!' });
            }
            
            res.status(200).json({ status: 200, message: 'Update sukses' });
        });
    }
}

module.exports = ProductController;