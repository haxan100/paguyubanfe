import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function fixAduanTable() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'paguyuban'
    });
    
    // Drop existing table and recreate with correct structure
    await connection.execute('DROP TABLE IF EXISTS aduan');
    
    // Create new aduan table with correct structure
    await connection.execute(`
      CREATE TABLE aduan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        judul VARCHAR(200) NOT NULL,
        deskripsi TEXT NOT NULL,
        kategori ENUM('infrastruktur', 'kebersihan', 'keamanan', 'lainnya') NOT NULL,
        status ENUM('pending', 'proses', 'selesai', 'ditolak') DEFAULT 'pending',
        foto VARCHAR(255) NULL,
        tanggal_aduan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tanggal_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        jawaban TEXT NULL,
        foto_jawaban VARCHAR(255) NULL,
        admin_id INT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (admin_id) REFERENCES users(id)
      )
    `);
    
    console.log('✅ Tabel aduan berhasil diperbaiki');
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixAduanTable();