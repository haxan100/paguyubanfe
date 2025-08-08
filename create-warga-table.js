import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function createWargaTable() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'paguyuban'
    });
    
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS warga (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        no_hp VARCHAR(20),
        blok VARCHAR(10) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Migrate existing warga from users table
    await connection.execute(`
      INSERT INTO warga (nama, email, password, no_hp, blok, created_at)
      SELECT u.nama, u.email, u.password, u.no_hp, u.blok, u.created_at 
      FROM users u
      WHERE u.jenis = 'warga'
      ON DUPLICATE KEY UPDATE nama = VALUES(nama)
    `);
    
    console.log('✅ Tabel warga berhasil dibuat dan data dimigrate');
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createWargaTable();