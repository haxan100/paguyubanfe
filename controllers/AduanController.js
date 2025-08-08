import Aduan from '../models/Aduan.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Configure multer for file upload
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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
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

class AduanController {
  static upload = upload;
  
  static async create(req, res) {
    try {
      const { judul, deskripsi, kategori } = req.body;
      const foto = req.file ? req.file.filename : null;
      const user_id = req.user.id;
      
      console.log('Create aduan data:', { user_id, judul, deskripsi, kategori, foto });
      
      const result = await Aduan.create({
        user_id,
        judul,
        deskripsi,
        kategori,
        foto
      });
      
      // Emit realtime notification
      const io = req.app.get('io');
      const notificationData = {
        nama: req.user.nama,
        blok: req.user.blok,
        judul: judul,
        kategori: kategori,
        aduanId: result.insertId
      };
      
      console.log('📝 Emitting complaint notification:', notificationData);
      
      // Send to ketua, admin, and koordinator
      io.to('ketua').emit('complaint-notification', notificationData);
      io.to('admin').emit('complaint-notification', notificationData);
      io.to('koordinator').emit('complaint-notification', notificationData);
      
      // Emit general update
      io.emit('aduan-update', { type: 'new', aduanId: result.insertId });
      
      res.json({ status: 'success', message: 'Aduan berhasil dibuat', id: result.insertId });
    } catch (error) {
      console.error('Error creating aduan:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const aduan = await Aduan.findAll();
      res.json({ status: 'success', data: aduan });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error' });
    }
  }

  static async getByUser(req, res) {
    try {
      const user_id = req.user.id;
      console.log('Get aduan for user:', user_id);
      const aduan = await Aduan.findByUserId(user_id);
      res.json({ status: 'success', data: aduan });
    } catch (error) {
      console.error('Error getting aduan by user:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { judul, deskripsi, kategori } = req.body;
      const foto = req.file ? req.file.filename : null;
      
      // Check if user owns this aduan
      const aduan = await Aduan.findById(id);
      if (!aduan || aduan.user_id !== req.user.id) {
        return res.status(403).json({ status: 'error', message: 'Tidak memiliki izin untuk mengubah aduan ini' });
      }
      
      console.log('Update aduan data:', { id, judul, deskripsi, kategori, foto });
      
      await Aduan.update(id, { judul, deskripsi, kategori, foto });
      res.json({ status: 'success', message: 'Aduan berhasil diupdate' });
    } catch (error) {
      console.error('Error updating aduan:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status, jawaban, admin_id } = req.body;
      const foto_jawaban = req.file ? req.file.filename : null;
      
      await Aduan.updateStatus(id, { status, jawaban, foto_jawaban, admin_id });
      
      // Get aduan data for notification
      const aduan = await Aduan.findById(id);
      
      // Emit realtime update
      const io = req.app.get('io');
      io.emit('aduan-update', { type: 'status', aduanId: id, status });
      
      // Send notification to aduan owner
      if (aduan) {
        const notificationData = {
          nama: req.user.nama,
          jenis: req.user.jenis,
          status: status,
          jawaban: jawaban,
          aduanId: id,
          aduanJudul: aduan.judul
        };
        
        console.log('🔄 Emitting aduan status notification:', notificationData);
        io.to(`user-${aduan.user_id}`).emit('aduan-status-notification', notificationData);
      }
      
      res.json({ status: 'success', message: 'Status aduan berhasil diupdate' });
    } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async addComment(req, res) {
    try {
      const { id } = req.params;
      const { komentar } = req.body;
      const user_id = req.user.id;
      
      await Aduan.addComment({ aduan_id: id, user_id, komentar });
      
      // Get aduan data for notification
      const aduan = await Aduan.findById(id);
      
      // Emit realtime update
      const io = req.app.get('io');
      io.emit('aduan-update', { type: 'comment', aduanId: id });
      
      // Send notification to aduan owner if comment is from admin/ketua
      if (aduan && aduan.user_id !== user_id) {
        const notificationData = {
          nama: req.user.nama,
          jenis: req.user.jenis,
          comment: komentar,
          aduanId: id,
          aduanJudul: aduan.judul
        };
        
        console.log('💬 Emitting aduan comment notification:', notificationData);
        io.to(`user-${aduan.user_id}`).emit('aduan-comment-notification', notificationData);
      }
      
      res.json({ status: 'success', message: 'Komentar berhasil ditambahkan' });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getComments(req, res) {
    try {
      const { id } = req.params;
      const comments = await Aduan.getComments(id);
      res.json({ status: 'success', data: comments });
    } catch (error) {
      console.error('Error getting comments:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Get aduan data to check ownership
      const aduan = await Aduan.findById(id);
      if (!aduan) {
        return res.status(404).json({ status: 'error', message: 'Aduan tidak ditemukan' });
      }
      
      // Check permission: admin, ketua, koordinator_perblok, or aduan owner
      const canDelete = ['admin', 'ketua', 'koordinator_perblok'].includes(req.user.jenis) || 
                       aduan.user_id === req.user.id;
      
      if (!canDelete) {
        return res.status(403).json({ status: 'error', message: 'Tidak memiliki izin untuk menghapus aduan ini' });
      }
      
      // Delete photo files if exist
      if (aduan.foto) {
        const fotoPath = path.join('public/assets/uploads/', aduan.foto);
        if (fs.existsSync(fotoPath)) fs.unlinkSync(fotoPath);
      }
      if (aduan.foto_jawaban) {
        const fotoJawabanPath = path.join('public/assets/uploads/', aduan.foto_jawaban);
        if (fs.existsSync(fotoJawabanPath)) fs.unlinkSync(fotoJawabanPath);
      }
      
      await Aduan.delete(id);
      res.json({ status: 'success', message: 'Aduan berhasil dihapus' });
    } catch (error) {
      console.error('Error deleting aduan:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default AduanController;