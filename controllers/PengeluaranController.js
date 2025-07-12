import Pengeluaran from '../models/Pengeluaran.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

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

class PengeluaranController {
  static upload = upload;
  
  static async create(req, res) {
    try {
      const { tahun, bulan, jumlah, judul, deskripsi } = req.body;
      const foto = req.file ? req.file.filename : null;
      const admin_id = req.user.id;
      
      if (!foto) {
        return res.status(400).json({ status: 'error', message: 'Foto bukti wajib diupload' });
      }
      
      const result = await Pengeluaran.create({
        admin_id,
        tahun: parseInt(tahun),
        bulan: parseInt(bulan),
        jumlah: parseFloat(jumlah),
        judul,
        deskripsi,
        foto
      });
      
      res.json({ status: 'success', message: 'Pengeluaran berhasil ditambahkan', id: result.insertId });
    } catch (error) {
      console.error('Error creating pengeluaran:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const pengeluaran = await Pengeluaran.findAll();
      res.json({ status: 'success', data: pengeluaran });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error' });
    }
  }

  static async getByYear(req, res) {
    try {
      const { tahun } = req.params;
      const pengeluaran = await Pengeluaran.findByYear(tahun);
      res.json({ status: 'success', data: pengeluaran });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error' });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      const pengeluaran = await Pengeluaran.findById(id);
      if (!pengeluaran) {
        return res.status(404).json({ status: 'error', message: 'Pengeluaran tidak ditemukan' });
      }
      
      // Delete photo file
      if (pengeluaran.foto) {
        const fotoPath = path.join('public/assets/uploads/', pengeluaran.foto);
        if (fs.existsSync(fotoPath)) fs.unlinkSync(fotoPath);
      }
      
      await Pengeluaran.delete(id);
      res.json({ status: 'success', message: 'Pengeluaran berhasil dihapus' });
    } catch (error) {
      console.error('Error deleting pengeluaran:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async exportPengeluaran(req, res) {
    try {
      const { tahun } = req.params;
      const pengeluaran = await Pengeluaran.findByYear(tahun);
      
      const bulanNames = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 
                         'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
      
      const exportData = pengeluaran.map(item => ({
        tanggal: new Date(item.tanggal_dibuat).toLocaleDateString('id-ID'),
        bulan: bulanNames[item.bulan - 1],
        judul: item.judul,
        jumlah: item.jumlah,
        deskripsi: item.deskripsi,
        admin: item.admin_nama,
        foto: `${req.protocol}://${req.get('host')}/assets/uploads/${item.foto}`
      }));
      
      res.json({ 
        status: 'success', 
        data: exportData,
        title: `Laporan Pengeluaran ${tahun}`
      });
    } catch (error) {
      console.error('Error exporting pengeluaran:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default PengeluaranController;