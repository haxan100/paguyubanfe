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
  static async updateProfile(id, data) {
    const connection = await mysql.createConnection(dbConfig);
    const { nama, email, no_hp, foto_profile } = data;
    
    console.log('Updating warga ID:', id);
    console.log('Update data:', { nama, email, no_hp });
    
    const [result] = await connection.execute(
      'UPDATE warga SET nama = ?, email = ?, no_hp = ?, foto_profile = ? WHERE id = ?',
      [nama, email, no_hp, foto_profile || null, id]
    );
    
    console.log('Update affected rows:', result.affectedRows);
    
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

  static async findByPhone(phone) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT * FROM warga WHERE no_hp = ?',
      [phone]
    );
    
    await connection.end();
    console.log(rows);
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
  static async updatePassword(id, password) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.execute(
      'UPDATE warga SET password = ? WHERE id = ?',
      [password, id]
    );
    
    await connection.end();
    return result;
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
    
    const [result] = await connection.execute(
      `UPDATE warga SET ${fields} WHERE id = ?`,
      values
    );
    console.log('Rows affected:', result.affectedRows);
    
    await connection.end();
  }

  static async delete(id) {
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute('DELETE FROM warga WHERE id = ?', [id]);
    
    await connection.end();
 
    await connection.execute('DELETE FROM warga WHERE id = ?', [id]);
    
    await connection.end();
  }
}

export default Warga;