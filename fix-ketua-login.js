import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

async function fixKetuaLogin() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'paguyuban'
    });
    
    // Check if ketua exists
    const [existing] = await connection.execute('SELECT * FROM users WHERE email = ?', ['ketua@paguyuban.com']);
    
    if (existing.length > 0) {
      console.log('✅ User ketua sudah ada, update password...');
      // Update password
      const hashedPassword = await bcrypt.hash('123456789', 10);
      await connection.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, 'ketua@paguyuban.com']);
    } else {
      console.log('❌ User ketua tidak ada, buat baru...');
      // Create new ketua
      const hashedPassword = await bcrypt.hash('123456789', 10);
      await connection.execute(`
        INSERT INTO users (nama, email, no_hp, blok, jenis, password) VALUES 
        ('Ketua RT', 'ketua@paguyuban.com', '081234567890', 'A1', 'ketua', ?)
      `, [hashedPassword]);
    }
    
    console.log('✅ Login ketua berhasil diperbaiki');
    console.log('📧 Email: ketua@paguyuban.com');
    console.log('🔑 Password: 123456789');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixKetuaLogin();