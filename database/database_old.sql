CREATE DATABASE IF NOT EXISTS paguyuban;
USE paguyuban;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nama VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    no_hp VARCHAR(15) NOT NULL,
    blok VARCHAR(10) NOT NULL,
    jenis ENUM('warga', 'ketua', 'admin', 'koordinator_perblok') NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample data (password: 123456)
INSERT INTO users (nama, email, no_hp, blok, jenis, password) VALUES 
('Admin User', 'admin@paguyuban.com', '081234567890', 'A1', 'admin', '$2b$10$N9qo8uLOickgx2ZMRZoMye.IcnJIrOxu6hMh6uLfxhd/RQ9dHinzK'),
('Ketua RT', 'ketua@paguyuban.com', '081234567891', 'A1', 'ketua', '$2b$10$N9qo8uLOickgx2ZMRZoMye.IcnJIrOxu6hMh6uLfxhd/RQ9dHinzK'),
('Koordinator A', 'koordinator@paguyuban.com', '081234567892', 'A1', 'koordinator_perblok', '$2b$10$N9qo8uLOickgx2ZMRZoMye.IcnJIrOxu6hMh6uLfxhd/RQ9dHinzK'),
('Warga 1', 'warga@paguyuban.com', '081234567893', 'A1', 'warga', '$2b$10$N9qo8uLOickgx2ZMRZoMye.IcnJIrOxu6hMh6uLfxhd/RQ9dHinzK');