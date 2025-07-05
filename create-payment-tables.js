import mysql from 'mysql2/promise';

async function createPaymentTables() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'paguyuban'
    });
    
    // Drop existing table if exists
    await connection.execute('DROP TABLE IF EXISTS payments');
    
    // Create payments table
    await connection.execute(`
      CREATE TABLE payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        tahun INT NOT NULL,
        bulan INT NOT NULL,
        jumlah DECIMAL(10,2) DEFAULT 0,
        bukti_transfer VARCHAR(255) NOT NULL,
        status ENUM('menunggu_konfirmasi', 'dikonfirmasi', 'ditolak') DEFAULT 'menunggu_konfirmasi',
        tanggal_upload TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        tanggal_konfirmasi TIMESTAMP NULL,
        admin_id INT NULL,
        catatan TEXT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (admin_id) REFERENCES users(id),
        UNIQUE KEY unique_payment (user_id, tahun, bulan)
      )
    `);
    
    console.log('✅ Tabel payments berhasil dibuat');
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createPaymentTables();