import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function debugAduan() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'paguyuban'
    });
    
    // Check if aduan table exists
    const [tables] = await connection.execute("SHOW TABLES LIKE 'aduan'");
    console.log('Aduan table exists:', tables.length > 0);
    
    if (tables.length > 0) {
      // Show table structure
      const [columns] = await connection.execute("DESCRIBE aduan");
      console.log('Aduan table structure:', columns);
      
      // Show existing data
      const [rows] = await connection.execute("SELECT * FROM aduan LIMIT 5");
      console.log('Sample data:', rows);
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

debugAduan();