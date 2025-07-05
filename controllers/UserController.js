import User from '../models/User.js';
import bcrypt from 'bcrypt';

class UserController {
  static async getAll(req, res) {
    try {
      const users = await User.findAll();
      res.json({ status: 'success', data: users });
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getByRole(req, res) {
    try {
      const { role } = req.params;
      const users = await User.findByRole(role);
      res.json({ status: 'success', data: users });
    } catch (error) {
      console.error('Error getting users by role:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async create(req, res) {
    try {
      const { nama, email, no_hp, blok, jenis, password } = req.body;
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await User.create({
        nama,
        email,
        no_hp,
        blok,
        jenis,
        password: hashedPassword
      });
      
      res.json({ status: 'success', message: 'User berhasil dibuat' });
    } catch (error) {
      console.error('Error creating user:', error);
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
      
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }
      
      await User.update(id, updateData);
      res.json({ status: 'success', message: 'User berhasil diupdate' });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      await User.delete(id);
      res.json({ status: 'success', message: 'User berhasil dihapus' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default UserController;