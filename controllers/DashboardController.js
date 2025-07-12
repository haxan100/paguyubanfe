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
        JOIN warga w ON a.user_id = w.id 
        WHERE w.blok LIKE ?
      `, [`${userBlok}%`]);
      
      // Total saldo keseluruhan
      const [saldoResult] = await connection.execute(`
        SELECT 
          COALESCE(SUM(CASE WHEN p.status = 'dikonfirmasi' THEN p.jumlah ELSE 0 END), 0) as total_pemasukan,
          COALESCE((SELECT SUM(jumlah) FROM pengeluaran), 0) as total_pengeluaran
        FROM payments p
        JOIN warga w ON p.user_id = w.id
      `);
      
      const totalPemasukan = saldoResult[0].total_pemasukan;
      const totalPengeluaran = saldoResult[0].total_pengeluaran;
      const saldo = totalPemasukan - totalPengeluaran;
      
      await connection.end();
      
      res.json({
        status: 'success',
        data: {
          totalWarga: wargaResult[0].total,
          totalAduan: aduanResult[0].total,
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