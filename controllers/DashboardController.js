import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database.js';

class DashboardController {
  static async getKoordinatorStats(req, res) {
    try {
      const connection = await mysql.createConnection(dbConfig);
      const userBlok = req.user.blok?.charAt(0);
      
      // Total warga di blok koordinator
      const [wargaResult] = await connection.execute(
        'SELECT COUNT(*) as total FROM warga WHERE blok LIKE ?',
        [`${userBlok}%`]
      );
      
      // Total aduan di blok koordinator
      const [aduanResult] = await connection.execute(`
        SELECT COUNT(*) as total 
        FROM aduan a 
        WHERE a.user_id IN (
          SELECT id FROM warga WHERE blok LIKE ?
          UNION
          SELECT id FROM users WHERE blok LIKE ? AND jenis = 'warga'
        )
      `, [`${userBlok}%`, `${userBlok}%`]);
      
      // Total pemasukan keseluruhan
      const [pemasukanResult] = await connection.execute(
        'SELECT COALESCE(SUM(jumlah), 0) as total FROM payments WHERE status = "dikonfirmasi"'
      );
      
      // Total pengeluaran keseluruhan
      const [pengeluaranResult] = await connection.execute(
        'SELECT COALESCE(SUM(jumlah), 0) as total FROM pengeluaran'
      );
      
      const totalPemasukan = parseInt(pemasukanResult[0].total) || 0;
      const totalPengeluaran = parseInt(pengeluaranResult[0].total) || 0;
      const saldo = totalPemasukan - totalPengeluaran;
      
      await connection.end();
      
      res.json({
        status: 'success',
        data: {
          totalWarga: parseInt(wargaResult[0].total) || 0,
          totalAduan: parseInt(aduanResult[0].total) || 0,
          totalPemasukan,
          totalPengeluaran,
          saldo
        }
      });
    } catch (error) {
      console.error('Error getting koordinator stats:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default DashboardController;