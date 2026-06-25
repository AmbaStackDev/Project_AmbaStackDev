const ProductModel = require('../models/ProductModel');

class ProductController {

    // GET /products
    static index(req, res) {
        ProductModel.getAllProducts((err, results) => {
            if (err) {
                return res.status(500).json({ status: 500, message: 'Database Error', error: err.message });
            }
            // Mapping kolom DB → skema JSON Sprint 10
            const mapped = results.map(p => ({
                id          : p.id,
                name        : p.name,
                price       : p.price,
                location    : p.location  || 'Gudang Pusat',
                stock       : p.stock || 0,
                sold        : p.sold      || 0,
                image_url   : p.image_url || (p.image ? `/uploads/${p.image}` : null),
                category_id : p.category_id,
            }));
            res.status(200).json({ success: true, data: mapped });
        });
    }

    // GET /products/:id
    static show(req, res) {
        const id = req.params.id;
        ProductModel.getProductById(id, (err, result) => {
            if (err) {
                return res.status(500).json({ status: 500, message: 'Database Error', error: err.message });
            }
            if (!result) {
                return res.status(404).json({ status: 404, message: 'Produk tidak ditemukan!' });
            }
            res.status(200).json({ status: 200, data: result });
        });
    }

    // POST /products
    static store(req, res) {
        // PERBAIKAN: Menangkap name, price, dan location
        const { name, price, location, stock, description } = req.body;

        // Tangkap filename dari Multer, null jika tidak ada file
        const image = req.file ? req.file.filename : null;

        // Validasi input wajib
        if (!name || !price) {
            return res.status(400).json({ status: 400, message: 'Nama dan harga wajib diisi!' });
        }
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ status: 400, message: 'Harga harus berupa angka positif!' });
        }

        // PERBAIKAN: Menyimpan data yang sesuai
        const data = {
            name,
            price,
            location: location || 'Gudang Pusat',
            stock: stock || 0,
            description: description || '',
            image,
        };

        ProductModel.create(data, (err, results) => {
            if (err) {
                return res.status(500).json({ status: 500, message: 'Gagal simpan data', error: err.message });
            }
            res.status(201).json({
                status  : 201,
                message : 'Produk berhasil dibuat',
                data    : { id: results.insertId, name, image },
            });
        });
    }

    // PUT /products/:id
    static update(req, res) {
        const id = req.params.id;
        
        // 1. TANGKAP VARIABEL STOCK DARI FRONTEND
        const { name, price, location, stock, description } = req.body;

        if (!name || !price) {
            return res.status(400).json({ status: 400, message: 'Nama dan harga wajib diisi!' });
        }
        if (isNaN(price) || price <= 0) {
            return res.status(400).json({ status: 400, message: 'Harga harus berupa angka positif!' });
        }

        ProductModel.getProductById(id, (err, product) => {
            if (err) {
                return res.status(500).json({ status: 500, message: 'Database Error', error: err.message });
            }
            if (!product) {
                return res.status(404).json({ status: 404, message: 'Produk tidak ditemukan!' });
            }

            const image = req.file ? req.file.filename : product.image;

            // 2. MASUKKAN STOCK KE DALAM DATA YANG AKAN DI-UPDATE
            const data = {
                name,
                price,
                location: location || product.location || 'Gudang Pusat',
                stock: stock !== undefined ? stock : product.stock, // <--- INI KUNCINYA
                image,
            };

            ProductModel.update(id, data, (err, results) => {
                if (err) {
                    return res.status(500).json({ status: 500, message: 'Database Error', error: err.message });
                }
                if (results.affectedRows === 0) {
                    return res.status(404).json({ status: 404, message: 'Produk tidak ditemukan!' });
                }
                res.status(200).json({
                    status  : 200,
                    message : 'Update sukses',
                    data    : { id, name, image, stock: data.stock },
                });
            });
        });
    }
    // DELETE /products/:id
    static destroy(req, res) {
        const id = req.params.id;

        ProductModel.getProductById(id, (err, product) => {
            if (err) {
                return res.status(500).json({ status: 500, message: 'Database Error', error: err.message });
            }
            if (!product) {
                return res.status(404).json({ status: 404, message: 'Produk tidak ditemukan!' });
            }

            ProductModel.delete(id, (err, results) => {
                if (err) {
                    return res.status(500).json({ status: 500, message: 'Gagal hapus data', error: err.message });
                }
                res.status(200).json({ status: 200, message: `Produk ID ${id} berhasil dihapus` });
            });
        });
    }
}

module.exports = ProductController;