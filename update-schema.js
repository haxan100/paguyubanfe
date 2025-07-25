import mysql from 'mysql2/promise';

async function updateSchema() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'paguyuban'
    });
    
    // Create aduan table with photo support
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS aduan (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        judul VARCHAR(200) NOT NULL,
        deskripsi TEXT NOT NULL,
        kategori ENUM('infrastruktur', 'kebersihan', 'keamanan', 'lainnya') NOT NULL,
        status ENUM('pending', 'proses', 'selesai', 'ditolak') DEFAULT 'pending',
        foto VARCHAR(255) NULL,
        tanggal_aduan TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tanggal_update TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        jawaban TEXT NULL,
        foto_jawaban VARCHAR(255) NULL,
        admin_id INT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (admin_id) REFERENCES users(id)
      )
    `);
    
    console.log('✅ Schema aduan berhasil dibuat/diupdate');
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateSchema();