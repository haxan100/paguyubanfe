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
}

export default User;