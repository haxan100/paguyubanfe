import Payment from '../models/Payment.js';
import User from '../models/User.js';

class PaymentAdminController {
  static async getAllPayments(req, res) {
    try {
      const payments = await Payment.findAll();
      res.json({ status: 'success', data: payments });
    } catch (error) {
      console.error('Error getting all payments:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async confirmPayment(req, res) {
    try {
      const { id } = req.params;
      const { status, catatan } = req.body;
      const admin_id = req.user.id;
      
      // Get payment data to get user_id
      const payment = await Payment.findById(id);
      await Payment.updateStatus(id, status, admin_id, catatan);
      
      // Emit notification to user
      const io = req.app.get('io');
      console.log(`✅ Emitting payment-confirmed to user-${payment.user_id}:`, status);
      io.to(`user-${payment.user_id}`).emit('payment-confirmed', {
        type: 'payment-status',
        message: status === 'dikonfirmasi' ? 'Pembayaran Anda telah dikonfirmasi' : 'Pembayaran Anda ditolak',
        status: status,
        catatan: catatan,
        timestamp: new Date()
      });
      
      res.json({ status: 'success', message: 'Status pembayaran berhasil diupdate' });
    } catch (error) {
      console.error('Error confirming payment:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getTotalIncome(req, res) {
    try {
      const totalIncome = await Payment.getTotalIncome();
      res.json({ 
        status: 'success', 
        data: { totalIncome }
      });
    } catch (error) {
      console.error('Error getting total income:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async exportAllPayments(req, res) {
    try {
      const { tahun, bulan } = req.params;
      
      // Get all users
      const users = await User.findAll();
      
      // Get payments for specific month/year
      const payments = await Payment.findByMonthYear(tahun, bulan);
      
      const bulanNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                         'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      
      const exportData = users.map(user => {
        const payment = payments.find(p => p.user_id === user.id);
        return {
          nama: user.nama,
          blok: user.blok,
          no_hp: user.no_hp,
          status: payment ? payment.status : 'belum_bayar',
          bukti: payment ? `/assets/uploads/${payment.bukti_transfer}` : null,
          tanggal_upload: payment ? payment.tanggal_upload : null
        };
      });
      
      res.json({ 
        status: 'success', 
        data: exportData,
        title: `Laporan Pembayaran ${bulanNames[bulan - 1]} ${tahun}`
      });
    } catch (error) {
      console.error('Error exporting all payments:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default PaymentAdminController;