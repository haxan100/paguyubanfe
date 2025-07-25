import Payment from '../models/Payment.js';

class WargaPaymentController {
  // POST /warga/payment
  static async create(req, res) {
    try {
      const { tahun, bulan } = req.body;
      const { id: user_id, nama } = req.user;
      const bukti_transfer = req.file ? req.file.filename : null;
      const jumlah = 100000; // Misalnya fixed

      if (!tahun || !bulan) {
        return res.status(400).json({ status: 'error', message: 'Tahun dan bulan wajib diisi' });
      }

      if (!bukti_transfer) {
        return res.status(400).json({ status: 'error', message: 'Bukti transfer wajib diupload' });
      }

      const isDuplicate = await Payment.isDuplicate(user_id, tahun, bulan);
      if (isDuplicate) {
        return res.status(400).json({ 
          status: 'error', 
          message: `Pembayaran bulan ${bulan} tahun ${tahun} sudah pernah dilakukan.` 
        });
      }

      const result = await Payment.create({ user_id, tahun, bulan, jumlah, bukti_transfer });

      const io = req.app.get('io');
      io.emit('new-payment', {
        type: 'payment',
        message: 'Pembayaran baru menunggu konfirmasi',
        user: nama,
        timestamp: new Date()
      });

      res.json({
        status: 'success',
        message: 'Pembayaran berhasil diupload',
        id: result.insertId
      });
    } catch (error) {
      console.error('Warga payment create error:', error);
      res.status(500).json({ status: 'error', message: 'Server error: ' + error.message });
    }
  }

  // GET /warga/payments
  static async getByUser(req, res) {
    try {
      const { id: user_id } = req.user;
      const payments = await Payment.findByUser(user_id);
      res.json({ status: 'success', data: payments });
    } catch (error) {
      console.error('Warga payment get error:', error);
      res.status(500).json({ status: 'error', message: 'Server error: ' + error.message });
    }
  }

  // DELETE /warga/payment/:id
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;

      const payment = await Payment.findById(id);
      if (!payment) {
        return res.status(404).json({ status: 'error', message: 'Pembayaran tidak ditemukan' });
      }

      if (payment.user_id !== user_id) {
        return res.status(403).json({ status: 'error', message: 'Tidak memiliki izin' });
      }

      if (payment.status === 'dikonfirmasi') {
        return res.status(400).json({ status: 'error', message: 'Pembayaran yang sudah dikonfirmasi tidak dapat dihapus' });
      }

      await Payment.delete(id);
      res.json({ status: 'success', message: 'Pembayaran berhasil dihapus' });
    } catch (error) {
      console.error('Warga payment delete error:', error);
      res.status(500).json({ status: 'error', message: 'Server error: ' + error.message });
    }
  }
}

export default WargaPaymentController;
