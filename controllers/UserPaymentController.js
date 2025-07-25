import mysql from 'mysql2/promise';

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'paguyuban'
};

class UserPaymentController {
  static async create(req, res) {
    try {
      const { user_id, bulan, tahun, jumlah, bukti_transfer } = req.body;
      
      const connection = await mysql.createConnection(dbConfig);
      
      const [result] = await connection.execute(
        'INSERT INTO user_payments (user_id, bulan, tahun, jumlah, bukti_transfer, status) VALUES (?, ?, ?, ?, ?, ?)',
        [user_id, bulan, tahun, jumlah, bukti_transfer, 'pending']
      );
      
      await connection.end();
      
      res.json({ status: 'success', message: 'Pembayaran berhasil diupload' });
    } catch (error) {
      console.error('User payment create error:', error);
      res.status(500).json({ status: 'error', message: 'Server error: ' + error.message });
    }
  }

  static async getByUser(req, res) {
    try {
      const { user_id } = req.params;
      
      const connection = await mysql.createConnection(dbConfig);
      
      const [rows] = await connection.execute(
        'SELECT * FROM user_payments WHERE user_id = ? ORDER BY tahun DESC, bulan DESC',
        [user_id]
      );
      
      await connection.end();
      
      res.json({ status: 'success', data: rows });
    } catch (error) {
      console.error('User payment get error:', error);
      res.status(500).json({ status: 'error', message: 'Server error: ' + error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      const connection = await mysql.createConnection(dbConfig);
      
      const [result] = await connection.execute(
        'DELETE FROM user_payments WHERE id = ?',
        [id]
      );
      
      await connection.end();
      
      res.json({ status: 'success', message: 'Pembayaran berhasil dihapus' });
    } catch (error) {
      console.error('User payment delete error:', error);
      res.status(500).json({ status: 'error', message: 'Server error: ' + error.message });
    }
  }
}

export default UserPaymentController;