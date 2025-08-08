import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function createDokumenTable() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'paguyuban'
    });
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS dokumen (
        id INT AUTO_INCREMENT PRIMARY KEY,
        judul VARCHAR(255) NOT NULL,
        deskripsi TEXT,
        nama_file VARCHAR(255) NOT NULL,
        ukuran_file INT NOT NULL,
        tipe_file VARCHAR(50) NOT NULL,
        admin_id INT NOT NULL,
        tanggal_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES users(id)
      )
    `);
    
    console.log('✅ Tabel dokumen berhasil dibuat');
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createDokumenTable();