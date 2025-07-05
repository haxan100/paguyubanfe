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
      const { user_id, judul, deskripsi, kategori } = req.body;
      const foto = req.file ? req.file.filename : null;
      
      console.log('Create aduan data:', { user_id, judul, deskripsi, kategori, foto });
      
      const result = await Aduan.create({
        user_id,
        judul,
        deskripsi,
        kategori,
        foto
      });
      
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
      const { user_id } = req.params;
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
      res.json({ status: 'success', message: 'Status aduan berhasil diupdate' });
    } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Get aduan data to delete associated files
      const aduan = await Aduan.findById(id);
      if (aduan) {
        // Delete photo files if exist
        if (aduan.foto) {
          const fotoPath = path.join('public/assets/uploads/', aduan.foto);
          if (fs.existsSync(fotoPath)) fs.unlinkSync(fotoPath);
        }
        if (aduan.foto_jawaban) {
          const fotoJawabanPath = path.join('public/assets/uploads/', aduan.foto_jawaban);
          if (fs.existsSync(fotoJawabanPath)) fs.unlinkSync(fotoJawabanPath);
        }
      }
      
      await Aduan.delete(id);
      res.json({ status: 'success', message: 'Aduan berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error' });
    }
  }
}

export default AduanController;