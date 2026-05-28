require('dotenv').config();
const express = require('express');
const path = require('path'); 
const db = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get('/', (req, res) => {
  res.json({ message: 'API AmbaCart Berjalan!' });
});

app.get('/test-db', (req, res) => {
  db.query('SHOW TABLES', (err, results) => {
    if (err) return res.status(500).json({ error: 'Gagal melakukan query' });
    res.json({ message: 'Koneksi Sukses!', tables: results });
  });
});

app.get('/debug-products', (req, res) => {
    db.query('SELECT * FROM products', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true, data: results });
    });
});

app.use('/api/products', productRoutes); 
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});