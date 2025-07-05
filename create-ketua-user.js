import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

async function createKetuaUser() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'paguyuban'
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