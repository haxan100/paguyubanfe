-- Database Paguyuban
CREATE DATABASE IF NOT EXISTS paguyuban;
USE paguyuban;

-- Tabel users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    no_hp VARCHAR(15) NOT NULL,
    blok VARCHAR(10) NOT NULL,
    jenis ENUM('warga', 'ketua', 'admin', 'koordinator_perblok') NOT NULL,
    password VARCHAR(255) NOT NULL,
    foto_profile TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabel aduan
CREATE TABLE aduan (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    judul VARCHAR(255) NOT NULL,
    jenis_aduan ENUM('infrastruktur', 'keamanan', 'kebersihan', 'lainnya') NOT NULL,
    deskripsi TEXT,
    foto JSON,
    status ENUM('pending', 'proses', 'selesai') DEFAULT 'pending',
    jawaban TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sample data users (password: 123456)
INSERT INTO users (nama, email, no_hp, blok, jenis, password) VALUES 
('Admin User', 'admin@paguyuban.com', '081234567890', 'A1', 'admin', '$2b$10$hdsoFScFE/WKmg1wP2tF0ORzEwB6kH91RjNx1kn77rEfrFPR5vvju'),
('Ketua RT', 'ketua@paguyuban.com', '081234567891', 'A1', 'ketua', '$2b$10$hdsoFScFE/WKmg1wP2tF0ORzEwB6kH91RjNx1kn77rEfrFPR5vvju'),
('Koordinator A', 'koordinator@paguyuban.com', '081234567892', 'A1', 'koordinator_perblok', '$2b$10$hdsoFScFE/WKmg1wP2tF0ORzEwB6kH91RjNx1kn77rEfrFPR5vvju'),
('Warga 1', 'warga@paguyuban.com', '081234567893', 'A1', 'warga', '$2b$10$hdsoFScFE/WKmg1wP2tF0ORzEwB6kH91RjNx1kn77rEfrFPR5vvju');

-- Tabel payments untuk warga
CREATE TABLE warga_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    bulan INT NOT NULL,
    tahun INT NOT NULL,
    jumlah DECIMAL(10,2) NOT NULL,
    bukti_transfer TEXT,
    status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES warga(id)
);

-- Tabel payments untuk user non-warga
CREATE TABLE user_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    bulan INT NOT NULL,
    tahun INT NOT NULL,
    jumlah DECIMAL(10,2) NOT NULL,
    bukti_transfer TEXT,
    status ENUM('pending', 'verified', 'rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sample data aduan
INSERT INTO aduan (user_id, judul, jenis_aduan, deskripsi, foto, status) VALUES
(4, 'Lampu Jalan Mati', 'infrastruktur', 'Lampu jalan di depan blok A1 sudah mati sejak 3 hari yang lalu', '[]', 'pending'),
(4, 'Sampah Menumpuk', 'kebersihan', 'Tempat sampah di area parkir sudah penuh dan berbau', '[]', 'proses');