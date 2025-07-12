import Warga from '../models/Warga.js';
import bcrypt from 'bcrypt';

class WargaProfileController {
  static async updateProfile(req, res) {
    try {
      const { nama, email, no_hp, blok } = req.body;
      const wargaId = req.user.id;
      
      await Warga.update(wargaId, { nama, email, no_hp, blok });
      
      res.json({ 
        status: 'success', 
        message: 'Profile berhasil diupdate' 
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ 
        status: 'error', 
        message: error.message 
      });
    }
  }

  static async updatePassword(req, res) {
    try {
      const { currentPassword, newPassword } = req.body;
      const wargaId = req.user.id;
      
      // Get current warga data
      const warga = await Warga.findById(wargaId);
      if (!warga) {
        return res.status(404).json({ 
          status: 'error', 
          message: 'Warga tidak ditemukan' 
        });
      }
      
      // Check current password
      const isValidPassword = await bcrypt.compare(currentPassword, warga.password);
      if (!isValidPassword) {
        return res.status(400).json({ 
          status: 'error', 
          message: 'Password lama tidak benar' 
        });
      }
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      
      // Update password
      await Warga.update(wargaId, { password: hashedPassword });
      
      res.json({ 
        status: 'success', 
        message: 'Password berhasil diubah' 
      });
    } catch (error) {
      console.error('Error updating password:', error);
      res.status(500).json({ 
        status: 'error', 
        message: error.message 
      });
    }
  }
}

export default WargaProfileController;