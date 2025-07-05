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
    const { user_id, judul, deskripsi, kategori, foto } = aduanData;
    
    const [result] = await connection.execute(
      'INSERT INTO aduan (user_id, judul, deskripsi, kategori, foto) VALUES (?, ?, ?, ?, ?)',
      [user_id, judul, deskripsi, kategori, foto]
    );
    
    await connection.end();
    return result;
  }

  static async findAll() {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(`
      SELECT a.*, u.nama as nama_user, u.blok, admin.nama as nama_admin
      FROM aduan a 
      JOIN users u ON a.user_id = u.id 
      LEFT JOIN users admin ON a.admin_id = admin.id
      ORDER BY a.tanggal_aduan DESC
    `);
    
    await connection.end();
    return rows;
  }

  static async findByUserId(user_id) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT * FROM aduan WHERE user_id = ? ORDER BY tanggal_aduan DESC',
      [user_id]
    );
    
    await connection.end();
    return rows;
  }

  static async findById(id) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT * FROM aduan WHERE id = ?',
      [id]
    );
    
    await connection.end();
    return rows[0];
  }

  static async update(id, updateData) {
    const connection = await mysql.createConnection(dbConfig);
    const { judul, deskripsi, kategori, foto } = updateData;
    
    if (foto) {
      // Update with new photo
      await connection.execute(
        'UPDATE aduan SET judul = ?, deskripsi = ?, kategori = ?, foto = ? WHERE id = ?',
        [judul, deskripsi, kategori, foto, id]
      );
    } else {
      // Update without changing photo
      await connection.execute(
        'UPDATE aduan SET judul = ?, deskripsi = ?, kategori = ? WHERE id = ?',
        [judul, deskripsi, kategori, id]
      );
    }
    
    await connection.end();
  }

  static async updateStatus(id, updateData) {
    const connection = await mysql.createConnection(dbConfig);
    const { status, jawaban, foto_jawaban, admin_id } = updateData;
    
    await connection.execute(
      'UPDATE aduan SET status = ?, jawaban = ?, foto_jawaban = ?, admin_id = ? WHERE id = ?',
      [status, jawaban, foto_jawaban, admin_id, id]
    );
    
    await connection.end();
  }

  static async delete(id) {
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute('DELETE FROM aduan WHERE id = ?', [id]);
    
    await connection.end();
  }
}

export default Aduan;