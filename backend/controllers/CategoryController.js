const db = require('../config/db');

class CategoryController {
    // GET: Ambil semua kategori
    static index(req, res) {
        db.query('SELECT * FROM categories ORDER BY id ASC', (err, results) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.status(200).json({ success: true, data: results });
        });
    }

    // POST: Tambah kategori baru
    static store(req, res) {
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi!' });

        db.query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description || ''], (err, results) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.status(201).json({ success: true, message: 'Kategori berhasil ditambahkan!', data: { id: results.insertId, name, description } });
        });
    }

    // PUT: Edit kategori (FITUR BARU)
    static update(req, res) {
        const { id } = req.params;
        const { name, description } = req.body;
        if (!name) return res.status(400).json({ success: false, message: 'Nama kategori wajib diisi!' });

        db.query('UPDATE categories SET name = ?, description = ? WHERE id = ?', [name, description || '', id], (err) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.status(200).json({ success: true, message: 'Kategori berhasil diupdate!' });
        });
    }

    // DELETE: Hapus kategori
    static destroy(req, res) {
        const { id } = req.params;
        db.query('DELETE FROM categories WHERE id = ?', [id], (err) => {
            if (err) return res.status(500).json({ success: false, error: err.message });
            res.status(200).json({ success: true, message: 'Kategori berhasil dihapus!' });
        });
    }
}

module.exports = CategoryController;