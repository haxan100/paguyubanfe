import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

async function createKetuaUser() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'paguyuban'
    });
    
    // Hash password
    const hashedPassword = await bcrypt.hash('123456789', 10);
    
    // Insert ketua user
    await connection.execute(`
      INSERT IGNORE INTO users (nama, email, no_hp, blok, jenis, password) VALUES 
      ('Ketua RT', 'ketua@paguyuban.com', '081234567890', 'A1', 'ketua', ?)
    `, [hashedPassword]);
    
    console.log('✅ User ketua berhasil dibuat');
    console.log('📧 Email: ketua@paguyuban.com');
    console.log('🔑 Password: 123456789');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createKetuaUser();