import mysql from 'mysql2/promise';
import { dbConfig } from './config/database.js';

async function updateAduanToWarga() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    console.log('🔄 Updating aduan table foreign keys to warga...');
    
    // Drop existing foreign keys
    await connection.execute('ALTER TABLE aduan DROP FOREIGN KEY IF EXISTS aduan_ibfk_1');
    await connection.execute('ALTER TABLE aduan_comments DROP FOREIGN KEY IF EXISTS aduan_comments_ibfk_2');
    
    // Add new foreign keys to warga table
    await connection.execute('ALTER TABLE aduan ADD CONSTRAINT aduan_warga_fk FOREIGN KEY (user_id) REFERENCES warga(id) ON DELETE CASCADE');
    await connection.execute('ALTER TABLE aduan_comments ADD CONSTRAINT aduan_comments_warga_fk FOREIGN KEY (user_id) REFERENCES warga(id) ON DELETE CASCADE');
    
    console.log('✅ Successfully updated aduan tables to reference warga');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error updating database:', error);
  }
}

updateAduanToWarga();