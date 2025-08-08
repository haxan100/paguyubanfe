import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function createAduanComments() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'paguyuban'
    });
    
    // Create aduan comments table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS aduan_comments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        aduan_id INT NOT NULL,
        user_id INT NOT NULL,
        komentar TEXT NOT NULL,
        tanggal_komentar TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (aduan_id) REFERENCES aduan(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);
    
    console.log('✅ Tabel aduan_comments berhasil dibuat');
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createAduanComments();