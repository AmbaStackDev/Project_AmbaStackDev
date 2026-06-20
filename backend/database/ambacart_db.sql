-- ==========================================
-- FILE DATABASE AMBACART (UPDATE SPRINT 14)
-- Fokus: Transaksi E-Commerce & Logistik
-- ==========================================

-- 1. Membuat Database
CREATE DATABASE IF NOT EXISTS ambacart_db;
USE ambacart_db;

-- 2. Membuat Tabel users (Update Profil Pembeli)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    phone_number VARCHAR(20),       -- TAMBAHAN SPRINT 14: Nomor HP Pembeli
    address TEXT,                   -- TAMBAHAN SPRINT 14: Alamat Lengkap
    city VARCHAR(100),              -- TAMBAHAN SPRINT 14: Kota Tujuan
    postal_code VARCHAR(10),        -- TAMBAHAN SPRINT 14: Kode Pos
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Membuat Tabel categories
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- 4. Membuat Tabel products
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    image VARCHAR(255), 
    location VARCHAR(100) DEFAULT 'Gudang Pusat', 
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 5. Membuat Tabel orders (Update Status & Resi Pengiriman)
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'COMPLETED', 'CANCELLED') DEFAULT 'PENDING',
    shipping_address TEXT NOT NULL,       -- TAMBAHAN SPRINT 14: Alamat tujuan spesifik untuk pesanan ini
    tracking_number VARCHAR(100) NULL,    -- TAMBAHAN SPRINT 14: Nomor Resi Ekspedisi (Diisi oleh Admin)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Membuat Tabel order_items
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ==========================================
-- SEEDER: DATA DUMMY AWAL (AKUN, KATEGORI & PRODUK)
-- ==========================================

-- Insert Akun Master Admin
-- Email: admin@amba.com | Password: admin123
INSERT INTO users (name, email, password, role) VALUES 
('Amba Administrator', 'admin@amba.com', '$2b$10$z9HT1pFmf1tYaw13RVJJjO.yQKeCYMyW4ezxXEhmUXby9zmBk34Zi', 'admin');

-- Insert Data Kategori
INSERT INTO categories (id, name, description) VALUES 
(1, 'Elektronik', 'Kumpulan gadget dan barang elektronik mutakhir'),
(2, 'Fashion', 'Pakaian dan aksesoris trendi kekinian'),
(3, 'Peralatan', 'Perlengkapan kerja dan rumah tangga');

-- Insert Data Produk beserta lokasi
INSERT INTO products (category_id, name, description, price, stock, image, location) VALUES 
(1, 'Smart TV 4K Ultra HD 43 Inch Premium', 'TV Pintar resolusi 4K dengan bazel tipis', 3499000.00, 15, '/products/tv.jpg', 'Jakarta Selatan'),
(3, 'Ergonomic Office Chair Hidrolik', 'Kursi kerja nyaman anti sakit punggung', 850000.00, 24, '/products/kursi.webp', 'Tangerang'),
(1, 'Mechanical Keyboard RGB Wireless', 'Keyboard mekanik hotswap switch merah', 620000.00, 50, '/products/keyboard.webp', 'Bandung'),
(2, 'Running Shoes Light Weight', 'Sepatu lari ringan dan bernapas', 450000.00, 30, '/products/sepatu.webp', 'Surabaya');