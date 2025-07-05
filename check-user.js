import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

async function checkUser() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'paguyuban'
    });
    
    // Check if user exists
    const [users] = await connection.execute('SELECT * FROM users WHERE email = ?', ['warga@paguyuban.com']);
    
    if (users.length === 0) {
      console.log('❌ User tidak ditemukan');
      
      // Create user with correct password
      const hashedPassword = await bcrypt.hash('123456789', 10);
      await connection.execute(`
        INSERT INTO users (nama, email, no_hp, blok, jenis, password) VALUES 
        ('Warga Test', 'warga@paguyuban.com', '081234567890', 'A1', 'warga', ?)
      `, [hashedPassword]);
      
      console.log('✅ User berhasil dibuat');
    } else {
      console.log('✅ User ditemukan:', users[0].email);
      
      // Test password
      const isValid = await bcrypt.compare('123456789', users[0].password);
      console.log('🔑 Password valid:', isValid);
      
      if (!isValid) {
        // Update password
        const hashedPassword = await bcrypt.hash('123456789', 10);
        await connection.execute('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, 'warga@paguyuban.com']);
        console.log('🔄 Password berhasil diupdate');
      }
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkUser();