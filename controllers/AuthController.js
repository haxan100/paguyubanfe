import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Warga from '../models/Warga.js';
import { generateToken } from '../middleware/auth.js';

class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      let user = null;
      let isWarga = false;
      
      // Check if input is phone number (starts with 08)
      const isPhoneNumber = /^08\d+$/.test(email);
      console.log("cek dulu",isPhoneNumber);
      
      if (isPhoneNumber) {
        console.log("Searching for phone:", email);
        // Phone number -> search in warga table only
        user = await Warga.findByPhone(email);
        console.log('Found user by phone:', user);
        isWarga = true;
      } else {
        // Email format -> try users table first, then warga
        user = await User.findByEmail(email);
        
        if (!user) {
          user = await Warga.findByEmail(email);
          isWarga = true;
        }
      }
      
      if (!user) {
        return res.status(401).json({ status: 'error', message: 'Email atau password salah #1' });
      }
      
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ status: 'error', message: 'Email atau password salah #2' });
      }
      
      // Create user object with jenis
      const userWithJenis = {
        ...user,
        jenis: isWarga ? 'warga' : user.jenis
      };
      
      const token = generateToken(userWithJenis);
      
      res.json({
        status: 'success',
        token,
        user: {
          id: user.id,
          nama: user.nama,
          email: user.email,
          no_hp: user.no_hp,
          jenis: isWarga ? 'warga' : user.jenis,
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