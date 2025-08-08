import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

async function fixKoordinatorLogin() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'paguyuban'
    });
    
    // Check if koordinator exists
    const [existing] = await connection.execute('SELECT * FROM users WHERE email = ?', ['koordinator@paguyuban.com']);
    
    if (existing.length > 0) {
      console.log('✅ User koordinator sudah ada, update password...');
      // Update password
      const hashedPassword = await bcrypt.hash('123456789', 10);
      await connection.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, 'koordinator@paguyuban.com']);
    } else {
      console.log('❌ User koordinator tidak ada, buat baru...');
      // Create new koordinator
      const hashedPassword = await bcrypt.hash('123456789', 10);
      await connection.execute(`
        INSERT INTO users (nama, email, no_hp, blok, jenis, password) VALUES 
        ('Koordinator Blok B', 'koordinator@paguyuban.com', '081234567890', 'B1-1', 'koordinator_perblok', ?)
      `, [hashedPassword]);
    }
    
    // Verify the user
    const [verify] = await connection.execute('SELECT * FROM users WHERE email = ?', ['koordinator@paguyuban.com']);
    console.log('User data:', verify[0]);
    
    console.log('✅ Login koordinator berhasil diperbaiki');
    console.log('📧 Email: koordinator@paguyuban.com');
    console.log('🔑 Password: 123456789');
    console.log('🏠 Blok: B1-1 (Koordinator Blok B)');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

fixKoordinatorLogin();