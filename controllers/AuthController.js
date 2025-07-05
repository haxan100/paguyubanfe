import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';

class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      
      const user = await User.findByEmail(email);
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'Email atau password salah' });
      }
      
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ status: 'error', message: 'Email atau password salah' });
      }
      
      const token = generateToken(user);
      
      res.json({
        status: 'success',
        token,
        user: {
          id: user.id,
          nama: user.nama,
          email: user.email,
          jenis: user.jenis,
          blok: user.blok
        }
      });
    } catch (error) {
      res.status(500).json({ status: 'error', message: 'Server error' });
    }
  }

  static async register(req, res) {
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
      
      res.json({ status: 'success', message: 'Registrasi berhasil' });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        res.status(400).json({ status: 'error', message: 'Email sudah terdaftar' });
      } else {
        res.status(500).json({ status: 'error', message: 'Server error' });
      }
    }
  }
}

export default AuthController;