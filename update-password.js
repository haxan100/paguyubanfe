import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

async function updatePassword() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'paguyuban'
    });
    
    const hashedPassword = await bcrypt.hash('123456789', 10);
    await connection.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, 'warga@paguyuban.com']);
    
    console.log('✅ Password berhasil diupdate');
    console.log('📧 Email: warga@paguyuban.com');
    console.log('🔑 Password: 123456789');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updatePassword();