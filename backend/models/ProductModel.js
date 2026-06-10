const db = require('../config/db');

class ProductModel {

    // GET semua produk
    static getAllProducts(callback) {
        db.query('SELECT * FROM products', (err, results) => {
            callback(err, results);
        });
    }

    // GET produk by ID (untuk keperluan update - ambil image lama)
    static getProductById(id, callback) {
        db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
            callback(err, results[0]);
        });
    }

    // CREATE - Sinkronisasi dengan form Frontend (name, price, location, image)
    static create(data, callback) {
        const query = `
            INSERT INTO products (name, price, location, image, description, stock, category_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(
            query,
            [
                data.name, 
                data.price, 
                data.location, 
                data.image,
                data.description || null, // Biarkan null jika dari frontend tidak ada
                data.stock || 0,          // Beri nilai 0 agar tidak melanggar NOT NULL MySQL
                data.category_id || null  // Biarkan null
            ],
            (err, results) => {
                callback(err, results);
            }
        );
    }

    static update(id, data, callback) {
        const query = `
            UPDATE products 
            SET name=?, price=?, location=?, stock=?, image=? 
            WHERE id=?
        `;
        db.query(
            query,
            // PASTIKAN URUTAN ARRAY INI SAMA DENGAN TANDA TANYA DI ATAS
            [data.name, data.price, data.location, data.stock, data.image, id],
            (err, results) => {
                callback(err, results);
            }
        );
    }

    // DELETE produk by ID
    static delete(id, callback) {
        db.query('DELETE FROM products WHERE id = ?', [id], (err, results) => {
            callback(err, results);
        });
    }
}

module.exports = ProductModel;