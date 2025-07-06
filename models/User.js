import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'paguyuban'
};

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
}

export default User;