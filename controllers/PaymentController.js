import Payment from '../models/Payment.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diizinkan'));
    }
  }
});

class PaymentController {
  static upload = upload;
  
  static async create(req, res) {
    try {
      const { tahun, bulan } = req.body;
      const bukti_transfer = req.file ? req.file.filename : null;
      const user_id = req.user.id;
      const jumlah = 100000; // Fixed amount
      
      if (!bukti_transfer) {
        return res.status(400).json({ status: 'error', message: 'Bukti transfer harus diupload' });
      }
      
      const result = await Payment.create({ user_id, tahun, bulan, jumlah, bukti_transfer });
      
      // Emit notification to ketua
      const io = req.app.get('io');
      console.log('💰 Emitting new-payment notification:', req.user.nama);
      io.emit('new-payment', {
        type: 'payment',
        message: 'Pembayaran baru menunggu konfirmasi',
        user: req.user.nama,
        timestamp: new Date()
      });
      
      res.json({ status: 'success', message: 'Pembayaran berhasil diupload', id: result.insertId });
    } catch (error) {
      console.error('Error creating payment:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ status: 'error', message: 'Pembayaran untuk bulan ini sudah ada' });
      } else {
        res.status(500).json({ status: 'error', message: error.message });
      }
    }
  }

  static async getByUser(req, res) {
    try {
      const user_id = req.user.id;
      const payments = await Payment.findByUser(user_id);
      res.json({ status: 'success', data: payments });
    } catch (error) {
      console.error('Error getting payments:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getByUserAndYear(req, res) {
    try {
      const { tahun } = req.params;
      const user_id = req.user.id;
      const payments = await Payment.findByUserAndYear(user_id, tahun);
      res.json({ status: 'success', data: payments });
    } catch (error) {
      console.error('Error getting payments by year:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getPaymentStatus(req, res) {
    try {
      const { tahun, bulan } = req.params;
      const user_id = req.user.id;
      const status = await Payment.getPaymentStatus(user_id, tahun, bulan);
      res.json({ status: 'success', data: { status } });
    } catch (error) {
      console.error('Error getting payment status:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const payments = await Payment.findAll();
      res.json({ status: 'success', data: payments });
    } catch (error) {
      console.error('Error getting all payments:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, catatan } = req.body;
      const admin_id = req.user.id;
      
      await Payment.updateStatus(id, status, admin_id, catatan);
      res.json({ status: 'success', message: 'Status pembayaran berhasil diupdate' });
    } catch (error) {
      console.error('Error updating payment status:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const user_id = req.user.id;
      
      // Get payment to check ownership and status
      const payment = await Payment.findById(id);
      if (!payment) {
        return res.status(404).json({ status: 'error', message: 'Pembayaran tidak ditemukan' });
      }
      
      // Check ownership
      if (payment.user_id !== user_id) {
        return res.status(403).json({ status: 'error', message: 'Tidak memiliki izin' });
      }
      
      // Check if status is not 'dikonfirmasi'
      if (payment.status === 'dikonfirmasi') {
        return res.status(400).json({ status: 'error', message: 'Pembayaran yang sudah dikonfirmasi tidak dapat dihapus' });
      }
      
      await Payment.delete(id);
      res.json({ status: 'success', message: 'Pembayaran berhasil dihapus' });
    } catch (error) {
      console.error('Error deleting payment:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async exportPayments(req, res) {
    try {
      const { tahun } = req.params;
      const user_id = req.user.id;
      const payments = await Payment.findByUserAndYear(user_id, tahun);
      
      // Create export data for 12 months
      const exportData = [];
      const bulanNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                         'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      
      for (let i = 1; i <= 12; i++) {
        const payment = payments.find(p => p.bulan === i);
        exportData.push({
          no: i,
          bulan: bulanNames[i-1],
          status: payment ? payment.status : 'belum_bayar',
          bukti: payment ? `/assets/uploads/${payment.bukti_transfer}` : null
        });
      }
      
      res.json({ status: 'success', data: exportData });
    } catch (error) {
      console.error('Error exporting payments:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default PaymentController;