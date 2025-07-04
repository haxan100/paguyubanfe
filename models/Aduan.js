import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'paguyuban'
};

class Aduan {
  static async create(aduanData) {
    const connection = await mysql.createConnection(dbConfig);
    const { user_id, judul, jenis_aduan, deskripsi, foto } = aduanData;
    
    const [result] = await connection.execute(
      'INSERT INTO aduan (user_id, judul, jenis_aduan, deskripsi, foto) VALUES (?, ?, ?, ?, ?)',
      [user_id, judul, jenis_aduan, deskripsi, JSON.stringify(foto)]
    );
    
    await connection.end();
    return result;
  }

  static async findByUserId(user_id) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT * FROM aduan WHERE user_id = ? ORDER BY created_at DESC',
      [user_id]
    );
    
    await connection.end();
    return rows;
  }

  static async update(id, aduanData) {
    const connection = await mysql.createConnection(dbConfig);
    const { judul, jenis_aduan, deskripsi, foto } = aduanData;
    
    const [result] = await connection.execute(
      'UPDATE aduan SET judul = ?, jenis_aduan = ?, deskripsi = ?, foto = ? WHERE id = ?',
      [judul, jenis_aduan, deskripsi, JSON.stringify(foto), id]
    );
    
    await connection.end();
    return result;
  }

  static async delete(id) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [result] = await connection.execute(
      'DELETE FROM aduan WHERE id = ?',
      [id]
    );
    
    await connection.end();
    return result;
  }
}

export default Aduan;