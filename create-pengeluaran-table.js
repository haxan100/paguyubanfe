import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function createPengeluaranTable() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'paguyuban'
    });
    
    // Create pengeluaran table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS pengeluaran (
        id INT AUTO_INCREMENT PRIMARY KEY,
        admin_id INT NOT NULL,
        tahun INT NOT NULL,
        bulan INT NOT NULL,
        jumlah DECIMAL(15,2) NOT NULL,
        judul VARCHAR(255) NOT NULL,
        deskripsi TEXT NOT NULL,
        foto VARCHAR(255) NOT NULL,
        tanggal_dibuat TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (admin_id) REFERENCES users(id)
      )
    `);
    
    console.log('✅ Tabel pengeluaran berhasil dibuat');
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createPengeluaranTable();