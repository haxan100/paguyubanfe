import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';

async function createKoordinatorUser() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'paguyuban'
    });
    
    // Hash password
    const hashedPassword = await bcrypt.hash('123456789', 10);
    
    // Insert koordinator user untuk blok B
    await connection.execute(`
      INSERT IGNORE INTO users (nama, email, no_hp, blok, jenis, password) VALUES 
      ('Koordinator Blok B', 'koordinator@paguyuban.com', '081234567890', 'B1-1', 'koordinator_perblok', ?)
    `, [hashedPassword]);
    
    console.log('✅ User koordinator berhasil dibuat');
    console.log('📧 Email: koordinator@paguyuban.com');
    console.log('🔑 Password: 123456789');
    console.log('🏠 Blok: B1-1 (Koordinator Blok B)');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createKoordinatorUser();