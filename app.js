const express = require('express');
const app = express();
const port = 3000;

// Middleware untuk mem-parsing request body berformat JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Endpoint Utama (GET /)
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Selamat datang di API AmbaCart - AmbaStackDev!',
  });
});

// Menjalankan server di port yang sudah ditentukan
app.listen(port, () => {
  console.log(`Server AmbaCart berjalan di http://localhost:${port}`);
});