import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database.js';

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
  static async isDuplicate(user_id, tahun, bulan) {
    console.log(`Checking for duplicate payment for user ${user_id} in year ${tahun} and month ${bulan}`);
    
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      'SELECT id FROM payments WHERE user_id = ? AND tahun = ? AND bulan = ?',
      [user_id, tahun, bulan]
    );
    await connection.end();
    return rows.length > 0;
  }
  
    static async getByUser(req, res) {
      try {
        const { user_id } = req.params;
        
        const connection = await mysql.createConnection(dbConfig);
        
        const [rows] = await connection.execute(
          'SELECT * FROM payments WHERE user_id = ? ORDER BY tahun DESC, bulan DESC',
          [user_id]
        );
        
        await connection.end();
        
        res.json({ status: 'success', data: rows });
      } catch (error) {
        console.error('Warga payment get error:', error);
        res.status(500).json({ status: 'error', message: 'Server error: ' + error.message });
      }
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
      SELECT p.*, w.nama, w.blok, admin.nama as admin_nama
      FROM payments p 
      JOIN warga w ON p.user_id = w.id 
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