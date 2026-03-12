// Import express
const express = require("express");

// Membuat object express
const app = express();

// Middleware untuk membaca request body berformat JSON dan URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing dasar untuk mengecek server
app.get("/", (req, res) => {
  res.send("Selamat datang di API AmbaCart!");
});

// Mendefinisikan port dan menjalankan server
app.listen(3000, () => {
    console.log("Server running at: http://localhost:3000");
});