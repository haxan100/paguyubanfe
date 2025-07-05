import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

async function updatePassword() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'paguyuban'
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