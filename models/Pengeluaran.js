import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database.js';

class Pengeluaran {
  static async create({ admin_id, tahun, bulan, jumlah, judul, deskripsi, foto }) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.execute(
      'INSERT INTO pengeluaran (admin_id, tahun, bulan, jumlah, judul, deskripsi, foto) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [admin_id, tahun, bulan, jumlah, judul, deskripsi, foto]
    );
    
    await connection.end();
    return result;
  }

  static async findAll() {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(`
      SELECT p.*, u.nama as admin_nama 
      FROM pengeluaran p 
      JOIN users u ON p.admin_id = u.id 
      ORDER BY p.tanggal_dibuat DESC
    `);
    
    await connection.end();
    return rows;
  }

  static async findByYear(tahun) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(`
      SELECT p.*, u.nama as admin_nama 
      FROM pengeluaran p 
      JOIN users u ON p.admin_id = u.id 
      WHERE p.tahun = ? 
      ORDER BY p.bulan DESC, p.tanggal_dibuat DESC
    `, [tahun]);
    
    await connection.end();
    return rows;
  }

  static async getTotalPengeluaran() {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute('SELECT SUM(jumlah) as total FROM pengeluaran');
    
    await connection.end();
    return rows[0]?.total || 0;
  }

  static async delete(id) {
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute('DELETE FROM pengeluaran WHERE id = ?', [id]);
    
    await connection.end();
  }

  static async findById(id) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute('SELECT * FROM pengeluaran WHERE id = ?', [id]);
    
    await connection.end();
    return rows[0];
  }
}

export default Pengeluaran;