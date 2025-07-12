import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database.js';

class Warga {
  static async create(wargaData) {
    const connection = await mysql.createConnection(dbConfig);
    const { nama, email, no_hp, blok, password } = wargaData;
    
    const [result] = await connection.execute(
      'INSERT INTO warga (nama, email, no_hp, blok, password) VALUES (?, ?, ?, ?, ?)',
      [nama, email, no_hp, blok, password]
    );
    
    await connection.end();
    return result;
  }

  static async findByEmail(email) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT * FROM warga WHERE email = ?',
      [email]
    );
    
    await connection.end();
    return rows[0];
  }

  static async findById(id) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT * FROM warga WHERE id = ?',
      [id]
    );
    
    await connection.end();
    return rows[0];
  }

  static async findAll() {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT id, nama, email, no_hp, blok, created_at FROM warga ORDER BY blok, nama'
    );
    
    await connection.end();
    return rows;
  }

  static async findByBlok(blok) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT id, nama, email, no_hp, blok, created_at FROM warga WHERE blok = ? ORDER BY nama',
      [blok]
    );
    
    await connection.end();
    return rows;
  }

  static async getBlokList() {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT DISTINCT blok FROM warga ORDER BY blok'
    );
    
    await connection.end();
    return rows.map(row => row.blok);
  }

  static async update(id, wargaData) {
    const connection = await mysql.createConnection(dbConfig);
    
    const fields = Object.keys(wargaData).map(key => `${key} = ?`).join(', ');
    const values = Object.values(wargaData);
    values.push(id);
    
    await connection.execute(
      `UPDATE warga SET ${fields} WHERE id = ?`,
      values
    );
    
    await connection.end();
  }

  static async delete(id) {
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute('DELETE FROM warga WHERE id = ?', [id]);
    
    await connection.end();
  }
}

export default Warga;