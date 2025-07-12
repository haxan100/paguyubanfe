import jwt from 'jsonwebtoken';

const JWT_SECRET = 'paguyuban-secret-key-2024';

export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      nama: user.nama,
      no_hp: user.no_hp,
      jenis: user.jenis,
      blok: user.blok 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  console.log('=== VERIFY TOKEN DEBUG ===');
  console.log('Request URL:', req.url);
  console.log('Token received:', token ? 'YES' : 'NO');
  
  if (!token) {
    return res.status(401).json({ 
      status: 'error', 
      message: 'Token tidak ditemukan. Silakan login terlebih dahulu.' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    console.log('Decoded user:', decoded);
    console.log('=== END VERIFY TOKEN DEBUG ===');
    next();
  } catch (error) {
    console.log('Token error:', error.message);
    return res.status(401).json({ 
      status: 'error', 
      message: 'Token tidak valid. Silakan login ulang.' 
    });
  }
};

export const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Unauthorized' 
      });
    }

    console.log('User role:', req.user.jenis, 'Allowed roles:', allowedRoles);
    
    if (!allowedRoles.includes(req.user.jenis)) {
      return res.status(403).json({ 
        status: 'error', 
        message: 'Akses ditolak. Role tidak memiliki izin.' 
      });
    }

    next();
  };
};