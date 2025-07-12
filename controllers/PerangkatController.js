import User from '../models/User.js';
import bcrypt from 'bcrypt';

class PerangkatController {
  static async getAll(req, res) {
    try {
      const users = await User.findByJenis(['admin', 'koordinator_perblok', 'ketua']);
      res.json({ status: 'success', data: users });
    } catch (error) {
      console.error('Error fetching perangkat:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { nama, email, no_hp, blok, jenis, password } = req.body;
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const userId = await User.create({
        nama,
        email,
        no_hp,
        blok,
        jenis,
        password: hashedPassword
      });
      
      res.json({ 
        status: 'success', 
        message: 'Perangkat berhasil ditambahkan',
        data: { id: userId }
      });
    } catch (error) {
      console.error('Error creating perangkat:', error);
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
      const { nama, email, no_hp, blok, jenis, password } = req.body;
      
      const updateData = { nama, email, no_hp, blok, jenis };
      
      // Hash password jika diisi
      if (password && password.trim() !== '') {
        updateData.password = await bcrypt.hash(password, 10);
      }
      
      await User.update(id, updateData);
      
      res.json({ 
        status: 'success', 
        message: 'Perangkat berhasil diupdate' 
      });
    } catch (error) {
      console.error('Error updating perangkat:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await User.delete(id);
      
      res.json({ 
        status: 'success', 
        message: 'Perangkat berhasil dihapus' 
      });
    } catch (error) {
      console.error('Error deleting perangkat:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default PerangkatController;