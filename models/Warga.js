import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'paguyuban'
};

class Warga {
  static async findByEmail(email) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT * FROM warga WHERE email = ?',
      [email]
    );
    
    await connection.end();
    return rows[0];
  }

  static async findByPhone(no_hp) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT * FROM warga WHERE no_hp = ?',
      [no_hp]
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

  static async updatePassword(id, password) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.execute(
      'UPDATE warga SET password = ? WHERE id = ?',
      [password, id]
    );
    
    await connection.end();
    return result;
  }
}

export default Warga;