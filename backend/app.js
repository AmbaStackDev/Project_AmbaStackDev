require('dotenv').config();
const express = require('express');
const cors = require('cors'); // <--- TAMBAHKAN INI KEMBALI
const path = require('path'); 
const db = require('./config/db');

// IMPORT ROUTES
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const CategoryController = require('./controllers/CategoryController');
const chatRoutes = require('./routes/chatRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// INISIALISASI EXPRESS
const app = express();
const port = 8000;

// MIDDLEWARE
app.use(cors()); 
// FIXED: Menaikkan limit menjadi 50mb agar bisa menerima gambar Base64
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// SINKRONISASI FOLDER UPLOAD FOTO
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// RUTE TESTING
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

// ===================================
// DAFTAR RUTE UTAMA (ROUTING API)
// ===================================
app.use('/api/products', productRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// START SERVER
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

app.get('/api/categories', CategoryController.index);
app.post('/api/categories', CategoryController.store);
app.delete('/api/categories/:id', CategoryController.destroy);
app.put('/api/categories/:id', CategoryController.update);
app.use('/api/chats', chatRoutes);
app.use('/api/notifications', notificationRoutes);