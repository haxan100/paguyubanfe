import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database.js';

class Dokumen {
  static async create({ judul, deskripsi, kategori, nama_file, ukuran_file, tipe_file, admin_id }) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.execute(
      'INSERT INTO dokumen (judul, deskripsi, kategori, nama_file, ukuran_file, tipe_file, admin_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [judul, deskripsi, kategori, nama_file, ukuran_file, tipe_file, admin_id]
    );
    
    await connection.end();
    return result;
  }

  static async findAll() {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(`
      SELECT d.*, u.nama as admin_nama 
      FROM dokumen d 
      JOIN users u ON d.admin_id = u.id 
      ORDER BY d.tanggal_upload DESC
    `);
    
    await connection.end();
    return rows;
  }

  static async findByKategori(kategori) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(`
      SELECT d.*, u.nama as admin_nama 
      FROM dokumen d 
      JOIN users u ON d.admin_id = u.id 
      WHERE d.kategori = ?
      ORDER BY d.tanggal_upload DESC
    `, [kategori]);
    
    await connection.end();
    return rows;
  }

  static async getKategoriList() {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT DISTINCT kategori FROM dokumen ORDER BY kategori'
    );
    
    await connection.end();
    return rows.map(row => row.kategori);
  }

  static async findById(id) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute('SELECT * FROM dokumen WHERE id = ?', [id]);
    
    await connection.end();
    return rows[0];
  }

  static async delete(id) {
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute('DELETE FROM dokumen WHERE id = ?', [id]);
    
    await connection.end();
  }

  static async update(id, { judul, deskripsi, kategori }) {
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute(
      'UPDATE dokumen SET judul = ?, deskripsi = ?, kategori = ? WHERE id = ?',
      [judul, deskripsi, kategori, id]
    );
    
    await connection.end();
  }
}

export default Dokumen;