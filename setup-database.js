import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  multipleStatements: true
};

async function setupDatabase() {
  try {
    // Connect without database first
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || ''
    });
    
    // Create database
    await connection.execute(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'paguyuban'}`);
    await connection.end();
    
    // Connect to the database
    const dbConnection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'paguyuban'
    });
    
    // Create users table
    await dbConnection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nama VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        no_hp VARCHAR(15) NOT NULL,
        blok VARCHAR(10) NOT NULL,
        jenis ENUM('warga', 'ketua', 'admin', 'koordinator_perblok') NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Hash password for default user
    const hashedPassword = await bcrypt.hash('123456789', 10);
    
    // Insert default user
    await dbConnection.execute(`
      INSERT IGNORE INTO users (nama, email, no_hp, blok, jenis, password) VALUES 
      ('Warga Test', 'warga@paguyuban.com', '081234567890', 'A1', 'warga', ?)
    `, [hashedPassword]);
    
    console.log('✅ Database setup berhasil!');
    console.log('📧 Email: warga@paguyuban.com');
    console.log('🔑 Password: 123456789');
    
    await dbConnection.end();
  } catch (error) {
    console.error('❌ Error setup database:', error.message);
  }
}

setupDatabase();