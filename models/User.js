import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database.js';

class User {
  static async create(userData) {
    const connection = await mysql.createConnection(dbConfig);
    const { nama, email, no_hp, blok, jenis, password } = userData;
    
    const [result] = await connection.execute(
      'INSERT INTO users (nama, email, no_hp, blok, jenis, password) VALUES (?, ?, ?, ?, ?, ?)',
      [nama, email, no_hp, blok, jenis, password]
    );
    
    await connection.end();
    return result;
  }

  static async findByEmail(email) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    
    await connection.end();
    return rows[0];
  }

  static async findByJenis(jenisArray) {
    const connection = await mysql.createConnection(dbConfig);
    
    const placeholders = jenisArray.map(() => '?').join(',');
    const [rows] = await connection.execute(
      `SELECT * FROM users WHERE jenis IN (${placeholders}) ORDER BY jenis, nama`,
      jenisArray
    );
    
    await connection.end();
    return rows;
  }

  static async findById(id) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    
    await connection.end();
    return rows[0];
  }

  static async findAll() {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT id, nama, email, no_hp, blok, jenis, created_at FROM users ORDER BY created_at DESC'
    );
    
    await connection.end();
    return rows;
  }

  static async findByRole(role) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT id, nama, email, no_hp, blok, jenis, created_at FROM users WHERE jenis = ? ORDER BY created_at DESC',
      [role]
    );
    
    await connection.end();
    return rows;
  }

  static async update(id, userData) {
    const connection = await mysql.createConnection(dbConfig);
    
    const fields = Object.keys(userData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(userData);
    values.push(id);
    
    await connection.execute(
      `UPDATE users SET ${fields} WHERE id = ?`,
      values
    );
    
    await connection.end();
  }

  static async delete(id) {
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute('DELETE FROM users WHERE id = ?', [id]);
    
    await connection.end();
  }

  static async findWarga() {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT id, nama, email, no_hp, blok, jenis, created_at FROM users WHERE jenis = "warga" ORDER BY blok, nama'
    );
    
    await connection.end();
    return rows;
  }

  static async findByBlok(blok) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT id, nama, email, no_hp, blok, jenis, created_at FROM users WHERE jenis = "warga" AND blok = ? ORDER BY nama',
      [blok]
    );
    
    await connection.end();
    return rows;
  }

  static async getBlokList() {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT DISTINCT blok FROM users WHERE jenis = "warga" AND blok IS NOT NULL ORDER BY blok'
    );
    
    await connection.end();
    return rows.map(row => row.blok);
  }
}

export default User;