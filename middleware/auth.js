import jwt from 'jsonwebtoken';

const JWT_SECRET = 'paguyuban-secret-key-2024';

export const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      nama: user.nama,
      jenis: user.jenis,
      blok: user.blok 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      status: 'error', 
      message: 'Token tidak ditemukan. Silakan login terlebih dahulu.' 
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
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

    if (!allowedRoles.includes(req.user.jenis)) {
      return res.status(403).json({ 
        status: 'error', 
        message: 'Akses ditolak. Role tidak memiliki izin.' 
      });
    }

    next();
  };
};