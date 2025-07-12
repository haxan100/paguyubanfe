import User from '../models/User.js';
import bcrypt from 'bcrypt';

class UserController {
  static async getAll(req, res) {
    try {
      const { blok } = req.query;
      const users = blok ? await User.findByBlok(blok) : await User.findWarga();
      res.json({ status: 'success', data: users });
    } catch (error) {
      console.error('Error getting users:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getBlokList(req, res) {
    try {
      const blokList = await User.getBlokList();
      res.json({ status: 'success', data: blokList });
    } catch (error) {
      console.error('Error getting blok list:', error);
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
      const { nama, email, no_hp, blok, password } = req.body;
      const jenis = 'warga'; // Force warga only for admin
      
      // Validasi blok untuk koordinator
      if (req.user.jenis === 'koordinator_perblok') {
        const userBlok = req.user.blok?.charAt(0);
        const targetBlok = blok?.charAt(0);
        
        if (userBlok !== targetBlok) {
          return res.status(403).json({ 
            status: 'error', 
            message: `Koordinator hanya bisa menambah warga di Blok ${userBlok}` 
          });
        }
        
        // Koordinator hanya bisa buat warga
        if (jenis !== 'warga') {
          return res.status(403).json({ 
            status: 'error', 
            message: 'Koordinator hanya bisa menambah warga' 
          });
        }
      }
      
      const hashedPassword = await bcrypt.hash(password, 10);
      
      await User.create({
        nama,
        email,
        no_hp,
        blok,
        jenis,
        password: hashedPassword
      });
      
      res.json({ status: 'success', message: 'Warga berhasil ditambahkan' });
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
      const { nama, email, no_hp, blok, password } = req.body;
      
      // Check if user is warga
      const existingUser = await User.findById(id);
      if (!existingUser || existingUser.jenis !== 'warga') {
        return res.status(403).json({ status: 'error', message: 'Hanya bisa mengedit data warga' });
      }
      
      // Validasi blok untuk koordinator
      if (req.user.jenis === 'koordinator_perblok') {
        const userBlok = req.user.blok?.charAt(0);
        const targetBlok = blok?.charAt(0);
        
        if (userBlok !== targetBlok) {
          return res.status(403).json({ 
            status: 'error', 
            message: `Koordinator hanya bisa mengubah warga di Blok ${userBlok}` 
          });
        }
        
        // Check existing user blok
        const existingUser = await User.findById(id);
        if (existingUser && existingUser.blok?.charAt(0) !== userBlok) {
          return res.status(403).json({ 
            status: 'error', 
            message: 'Tidak memiliki izin untuk mengubah user ini' 
          });
        }
      }
      
      const updateData = { nama, email, no_hp, blok, jenis: 'warga' };
      
      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }
      
      await User.update(id, updateData);
      res.json({ status: 'success', message: 'Data warga berhasil diupdate' });
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      // Validasi blok untuk koordinator
      if (req.user.jenis === 'koordinator_perblok') {
        const userBlok = req.user.blok?.charAt(0);
        const existingUser = await User.findById(id);
        
        if (existingUser && existingUser.blok?.charAt(0) !== userBlok) {
          return res.status(403).json({ 
            status: 'error', 
            message: 'Tidak memiliki izin untuk menghapus user ini' 
          });
        }
      }
      
      await User.delete(id);
      // Check if user is warga
      const existingUser = await User.findById(id);
      if (!existingUser || existingUser.jenis !== 'warga') {
        return res.status(403).json({ status: 'error', message: 'Hanya bisa menghapus data warga' });
      }
      
      await User.delete(id);
      res.json({ status: 'success', message: 'Data warga berhasil dihapus' });
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default UserController;