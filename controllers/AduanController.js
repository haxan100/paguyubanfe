import Aduan from '../models/Aduan.js';

class AduanController {
  static async create(req, res) {
    try {
      const { user_id, judul, jenis_aduan, deskripsi, foto } = req.body;
      
      await Aduan.create({
        user_id,
        judul,
        jenis_aduan,
        deskripsi,
        foto: foto || []
      });
      
      res.json({ status: 'success', message: 'Aduan berhasil dibuat' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error' });
    }
  }

  static async getByUser(req, res) {
    try {
      const { user_id } = req.params;
      const aduan = await Aduan.findByUserId(user_id);
      
      res.json({ status: 'success', data: aduan });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error' });
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { judul, jenis_aduan, deskripsi, foto } = req.body;
      
      await Aduan.update(id, {
        judul,
        jenis_aduan,
        deskripsi,
        foto: foto || []
      });
      
      res.json({ status: 'success', message: 'Aduan berhasil diupdate' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error' });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await Aduan.delete(id);
      
      res.json({ status: 'success', message: 'Aduan berhasil dihapus' });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error' });
    }
  }
}

export default AduanController;