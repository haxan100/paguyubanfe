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