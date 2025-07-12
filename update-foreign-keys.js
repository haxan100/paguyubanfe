import mysql from 'mysql2/promise';
import { dbConfig } from './config/database.js';

async function updateForeignKeys() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    console.log('🔄 Updating foreign keys to warga table...');
    
    // Check and update payments table
    try {
      await connection.execute(`
        UPDATE payments p 
        JOIN users u ON p.user_id = u.id 
        JOIN warga w ON u.email = w.email 
        SET p.user_id = w.id 
        WHERE u.jenis = 'warga'
      `);
      console.log('✅ Payments table updated');
    } catch (e) {
      console.log('⚠️ Payments table not found or error:', e.message);
    }
    
    // Check and update aduan table
    try {
      await connection.execute(`
        UPDATE aduan a 
        JOIN users u ON a.user_id = u.id 
        JOIN warga w ON u.email = w.email 
        SET a.user_id = w.id 
        WHERE u.jenis = 'warga'
      `);
      console.log('✅ Aduan table updated');
    } catch (e) {
      console.log('⚠️ Aduan table not found or error:', e.message);
    }
    
    console.log('✅ Foreign keys updated successfully');
    await connection.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

updateForeignKeys();