-- ==========================================
-- FILE DATABASE AMBACART (ULTIMATE VERSION)
-- Fitur: E-Commerce, Chat, Notifikasi, Refund & Rating
-- ==========================================

-- 1. Membuat Database Baru (Bongkar ulang agar bersih)
DROP DATABASE IF EXISTS ambacart_db;
CREATE DATABASE ambacart_db;
USE ambacart_db;

-- ==========================================
-- STRUKTUR TABEL
-- ==========================================

-- 2. Tabel users (Akun Pengguna)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'customer') DEFAULT 'customer',
    phone_number VARCHAR(20),       
    address TEXT,                   
    city VARCHAR(100),              
    postal_code VARCHAR(10),        
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel categories (Kategori Produk)
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

-- 4. Tabel products (Data Barang Dagangan)
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 50,
    sold INT DEFAULT 0,
    image VARCHAR(255),
    image_url VARCHAR(500),
    location VARCHAR(100) DEFAULT 'Gudang Pusat',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- 5. Tabel orders (Pesanan Pembeli)
-- FIXED: Status diubah jadi VARCHAR agar bisa menampung 'RETURNED', 'REFUND_REJECTED', dll.
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    shipping_address TEXT NOT NULL,
    tracking_number VARCHAR(100) NULL,
    cancel_reason TEXT NULL,
    refund_proof LONGTEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 6. Tabel order_items (Rincian Barang yang Dipesan)
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- 7. Tabel chats (Riwayat Obrolan Real-Time)
CREATE TABLE chats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    sender_role VARCHAR(20) NOT NULL, -- isinya: 'user' atau 'admin'
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

-- 8. Tabel notifications (Pemberitahuan / Lonceng Navbar)
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL,
    target_role VARCHAR(20) DEFAULT 'user', -- isinya: 'user' atau 'admin'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 9. Tabel ratings (Penilaian & Ulasan Bintang 5)
CREATE TABLE ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    user_id INT NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    stars INT NOT NULL DEFAULT 5,
    review TEXT NULL,
    photo LONGTEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


-- ==========================================
-- SEEDER: DATA DUMMY AWAL (Untuk Testing)
-- ==========================================

-- Insert Akun Master Admin (Password: admin123)
INSERT INTO users (id, name, email, password, role) VALUES 
(1, 'Amba Administrator', 'admin@amba.com', '$2b$10$z9HT1pFmf1tYaw13RVJJjO.yQKeCYMyW4ezxXEhmUXby9zmBk34Zi', 'admin');

-- Insert Akun Pembeli Dummy (Password: user123)
INSERT INTO users (id, name, email, password, role, phone_number, address, city, postal_code) VALUES 
(2, 'Budi Santoso', 'budi@gmail.com', '$2b$10$TKh8H1.PfQx37YgCzwi.t.s9PByYn2L/M3Q6qKjKjUqPByYn2L/M3', 'customer', '08123456789', 'Jl. Merdeka No. 10', 'Jakarta', '12345');

-- Insert Data Kategori
INSERT INTO categories (id, name, description) VALUES 
(1, 'Elektronik', 'Kumpulan gadget dan barang elektronik mutakhir'),
(2, 'Fashion', 'Pakaian dan aksesoris trendi kekinian'),
(3, 'Peralatan', 'Perlengkapan kerja dan rumah tangga');

-- Insert Data Produk
INSERT INTO products (category_id, name, description, price, stock, sold, image, location) VALUES 
(1, 'Smart TV 4K Ultra HD 43 Inch Premium', 'TV Pintar resolusi 4K dengan bazel tipis', 3499000.00, 15, 12, '/products/tv.jpg', 'Jakarta Selatan'),
(3, 'Ergonomic Office Chair Hidrolik', 'Kursi kantor ergonomis dengan sandaran leher', 850000.00, 24, 8, '/products/kursi.webp', 'Tangerang'),
(2, 'Sepatu Sneakers Pria Casual', 'Sepatu kasual cocok untuk hangout dan kuliah', 320000.00, 40, 25, '/products/sepatu.webp', 'Bandung'),
(1, 'Mechanical Keyboard RGB TKL', 'Keyboard mekanik switch blue untuk gaming', 450000.00, 8, 3, '/products/keyboard.webp', 'Depok'),
(1, 'Air Fryer No Oil Low Watt', 'Air fryer yang hemat daya', 275000.00, 60, 45, '/products/airfry.jpg', 'Jakarta Barat');