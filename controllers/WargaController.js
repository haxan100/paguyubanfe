import Warga from '../models/Warga.js';
import bcrypt from 'bcrypt';

class WargaController {
  static async getAll(req, res) {
    try {
      const { blok } = req.query;
      const warga = blok ? await Warga.findByBlok(blok) : await Warga.findAll();
      res.json({ status: 'success', data: warga });
    } catch (error) {
      console.error('Error getting warga:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getBlokList(req, res) {
    try {
      const blokList = await Warga.getBlokList();
      res.json({ status: 'success', data: blokList });
    } catch (error) {
      console.error('Error getting blok list:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { nama, email, no_hp, blok, password } = req.body;
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await Warga.create({
        nama,
        email,
        no_hp,
        blok,
        password: hashedPassword
      });
      
      res.json({ status: 'success', message: 'Warga berhasil ditambahkan' });
    } catch (error) {
      console.error('Error creating warga:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ status: 'error', message: 'Email sudah terdaftar' });
      } else {
        res.status(500).json({ status: 'error', message: error.message });
      }
    }
  }

  static async update(req, res) {
    try {
      const { id } = req.params;
      const { nama, email, no_hp, blok, password } = req.body;
      
      const updateData = { nama, email, no_hp, blok };
      
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }
      
      await Warga.update(id, updateData);
      res.json({ status: 'success', message: 'Data warga berhasil diupdate' });
    } catch (error) {
      console.error('Error updating warga:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      await Warga.delete(id);
      res.json({ status: 'success', message: 'Data warga berhasil dihapus' });
    } catch (error) {
      console.error('Error deleting warga:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default WargaController;