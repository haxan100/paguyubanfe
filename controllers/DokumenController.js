import Dokumen from '../models/Dokumen.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/documents/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /application\/(pdf|msword|vnd\.openxmlformats-officedocument\.wordprocessingml\.document)/.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya file PDF, DOC, dan DOCX yang diizinkan'));
    }
  }
});

class DokumenController {
  static upload = upload;
  
  static async create(req, res) {
    try {
      const { judul, deskripsi, kategori } = req.body;
      const file = req.file;
      const admin_id = req.user.id;
      
      if (!file) {
        return res.status(400).json({ status: 'error', message: 'File dokumen wajib diupload' });
      }
      
      const result = await Dokumen.create({
        judul,
        deskripsi: deskripsi || '',
        kategori: kategori || 'Umum',
        nama_file: file.filename,
        ukuran_file: file.size,
        tipe_file: file.mimetype,
        admin_id
      });
      
      res.json({ status: 'success', message: 'Dokumen berhasil diupload', id: result.insertId });
    } catch (error) {
      console.error('Error creating dokumen:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const { kategori } = req.query;
      const dokumen = kategori ? await Dokumen.findByKategori(kategori) : await Dokumen.findAll();
      res.json({ status: 'success', data: dokumen });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error' });
    }
  }

  static async getKategori(req, res) {
    try {
      const kategoriList = await Dokumen.getKategoriList();
      res.json({ status: 'success', data: kategoriList });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error' });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { judul, deskripsi, kategori } = req.body;
      
      await Dokumen.update(id, { judul, deskripsi, kategori });
      res.json({ status: 'success', message: 'Dokumen berhasil diupdate' });
    } catch (error) {
      console.error('Error updating dokumen:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      const dokumen = await Dokumen.findById(id);
      if (!dokumen) {
        return res.status(404).json({ status: 'error', message: 'Dokumen tidak ditemukan' });
      }
      
      // Delete file
      const filePath = path.join('public/assets/documents/', dokumen.nama_file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      
      await Dokumen.delete(id);
      res.json({ status: 'success', message: 'Dokumen berhasil dihapus' });
    } catch (error) {
      console.error('Error deleting dokumen:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default DokumenController;