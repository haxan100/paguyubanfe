import bcrypt from 'bcrypt';
import Warga from '../models/Warga.js';

class WargaProfileController {
  static async updateProfile(req, res) {
    try {
      const { user_id, nama, email, no_hp, foto_profile } = req.body;
      
      console.log('Warga update profile request:', { user_id, nama, email, no_hp });
      
      const result = await Warga.updateProfile(user_id, { nama, email, no_hp, foto_profile });
      
      console.log('Warga profile update completed:', result);
      
      res.json({ status: 'success', message: 'Profil berhasil diupdate' });
    } catch (error) {
      console.error('Warga update profile error:', error);
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ status: 'error', message: 'Email sudah digunakan' });
      } else {
        res.status(500).json({ status: 'error', message: 'Server error: ' + error.message });
      }
    }
  }

  static async updatePassword(req, res) {
    try {
      const { user_id, currentPassword, newPassword } = req.body;
      
      const user = await Warga.findById(user_id);
      if (!user) {
        return res.status(404).json({ status: 'error', message: 'User tidak ditemukan' });
      }
      
      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return res.status(401).json({ status: 'error', message: 'Password saat ini salah' });
      }
      
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await Warga.updatePassword(user_id, hashedPassword);
      
      res.json({ status: 'success', message: 'Password berhasil diubah' });
    } catch (error) {
      console.error('Warga update password error:', error);
      res.status(500).json({ status: 'error', message: 'Server error: ' + error.message });
    }
  }
}

export default WargaProfileController;