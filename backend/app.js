const express = require('express');
const db = require('./config/db'); // Memanggil koneksi DB
const productRoutes = require('./routes/productRoutes'); 
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ message: 'API AmbaCart Berjalan!' });
});

// Endpoint Uji Coba Database
app.get('/test-db', (req, res) => {
  db.query('SHOW TABLES', (err, results) => {
    if (err) return res.status(500).json({ error: 'Gagal melakukan query' });
    res.json({ message: 'Koneksi Sukses!', tables: results });
  });
});

app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

app.use('/api/products', productRoutes); 