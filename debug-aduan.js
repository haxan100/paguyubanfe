import mysql from 'mysql2/promise';

async function debugAduan() {
  try {
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'paguyuban'
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