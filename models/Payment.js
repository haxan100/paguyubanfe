import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'paguyuban'
};

class Payment {
  static async create(paymentData) {
    const connection = await mysql.createConnection(dbConfig);
    const { user_id, tahun, bulan, jumlah, bukti_transfer } = paymentData;
    
    const [result] = await connection.execute(
      'INSERT INTO payments (user_id, tahun, bulan, jumlah, bukti_transfer) VALUES (?, ?, ?, ?, ?)',
      [user_id, tahun, bulan, jumlah, bukti_transfer]
    );
    
    await connection.end();
    return result;
  }

  static async findByUser(userId) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(`
      SELECT * FROM payments 
      WHERE user_id = ? 
      ORDER BY tahun DESC, bulan DESC
    `, [userId]);
    
    await connection.end();
    return rows;
  }

  static async findByUserAndYear(userId, tahun) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(`
      SELECT * FROM payments 
      WHERE user_id = ? AND tahun = ?
      ORDER BY bulan ASC
    `, [userId, tahun]);
    
    await connection.end();
    return rows;
  }

  static async getPaymentStatus(userId, tahun, bulan) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT status FROM payments WHERE user_id = ? AND tahun = ? AND bulan = ?',
      [userId, tahun, bulan]
    );
    
    await connection.end();
    return rows[0]?.status || 'belum_bayar';
  }

  static async findAll() {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(`
      SELECT p.*, u.nama, u.blok, admin.nama as admin_nama
      FROM payments p 
      JOIN users u ON p.user_id = u.id 
      LEFT JOIN users admin ON p.admin_id = admin.id
      ORDER BY p.tanggal_upload DESC
    `);
    
    await connection.end();
    return rows;
  }

  static async findById(id) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT * FROM payments WHERE id = ?',
      [id]
    );
    
    await connection.end();
    return rows[0];
  }

  static async delete(id) {
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute('DELETE FROM payments WHERE id = ?', [id]);
    
    await connection.end();
  }

  static async findByMonthYear(tahun, bulan) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(`
      SELECT p.*, u.nama, u.blok, u.no_hp
      FROM payments p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.tahun = ? AND p.bulan = ?
      ORDER BY u.blok, u.nama
    `, [tahun, bulan]);
    
    await connection.end();
    return rows;
  }

  static async findById(id) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT * FROM payments WHERE id = ?',
      [id]
    );
    
    await connection.end();
    return rows[0];
  }

  static async getTotalIncome() {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(`
      SELECT SUM(jumlah) as total 
      FROM payments 
      WHERE status = 'dikonfirmasi'
    `);
    
    await connection.end();
    return rows[0]?.total || 0;
  }

  static async updateStatus(id, status, adminId, catatan = null) {
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute(
      'UPDATE payments SET status = ?, admin_id = ?, catatan = ?, tanggal_konfirmasi = NOW() WHERE id = ?',
      [status, adminId, catatan, id]
    );
    
    await connection.end();
  }

  static async findByYear(tahun) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(`
      SELECT p.*, u.nama 
      FROM payments p 
      JOIN users u ON p.user_id = u.id 
      WHERE p.tahun = ? AND p.status = 'dikonfirmasi'
      ORDER BY p.tanggal_konfirmasi DESC
    `, [tahun]);
    
    await connection.end();
    return rows;
  }
}

export default Payment;