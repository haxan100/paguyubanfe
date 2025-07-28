import mysql from 'mysql2/promise';
import { dbConfig } from './config/database.js';

async function addTanggalDigunakanColumn() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    // Check if column already exists
    const [columns] = await connection.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'pengeluaran' AND COLUMN_NAME = 'tanggal_digunakan'
    `, [dbConfig.database]);
    
    if (columns.length === 0) {
      // Add tanggal_digunakan column
      await connection.execute(`
        ALTER TABLE pengeluaran 
        ADD COLUMN tanggal_digunakan DATE NULL AFTER foto
      `);
      console.log('✅ Column tanggal_digunakan added successfully');
    } else {
      console.log('ℹ️ Column tanggal_digunakan already exists');
    }
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error adding tanggal_digunakan column:', error);
  }
}

addTanggalDigunakanColumn();