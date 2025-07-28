import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';
import { dbConfig } from './config/database.js';

dotenv.config();
import AuthController from './controllers/AuthController.js';
import AduanController from './controllers/AduanController.js';
import PostController from './controllers/PostController.js';
import PaymentController from './controllers/PaymentController.js';
import PaymentAdminController from './controllers/PaymentAdminController.js';
import UserController from './controllers/UserController.js';
import WargaController from './controllers/WargaController.js';
import PengeluaranController from './controllers/PengeluaranController.js';
import BukuKasController from './controllers/BukuKasController.js';
import DokumenController from './controllers/DokumenController.js';
import DashboardController from './controllers/DashboardController.js';
import WargaProfileController from './controllers/WargaProfileController.js';
import WargaPaymentController from './controllers/WargaPaymentController.js';
import UserPaymentController from './controllers/UserPaymentController.js';
import PerangkatController from './controllers/PerangkatController.js';
import { verifyToken, checkRole } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const PORT = process.env.PORT || 3001;

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);
  
  socket.on('join-room', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined room user-${userId}`);
  });
  
  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

// Make io available to controllers
app.set('io', io);

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('dist'));

// API Routes
app.post('/api/auth/login', AuthController.login);
app.post('/api/auth/register', AuthController.register);

// Profile Routes - User (non-warga)
app.post('/api/auth/update-password', AuthController.updatePassword);
app.post('/api/auth/update-profile', AuthController.updateProfile);

// Profile Routes - Warga
app.post('/api/warga/update-password', WargaProfileController.updatePassword);
app.post('/api/warga/update-profile', WargaProfileController.updateProfile);

// Payment Routes - Warga
// app.post('/api/warga/payments', verifyToken, WargaPaymentController.create);
app.post('/api/warga/payments', verifyToken, PaymentController.upload.single('bukti_transfer'), PaymentController.createWarga);

app.get('/api/warga/payments/:user_id', verifyToken, WargaPaymentController.getByUser);
app.delete('/api/warga/payments/:id', verifyToken, WargaPaymentController.delete);

// Payment Routes - User (non-warga)
app.post('/api/user/payments', UserPaymentController.create);
app.get('/api/user/payments/:user_id', UserPaymentController.getByUser);
app.delete('/api/user/payments/:id', UserPaymentController.delete);

// Aduan Routes (Protected)
app.post('/api/aduan', verifyToken, AduanController.upload.single('foto'), AduanController.create);
app.get('/api/aduan', verifyToken, checkRole(['admin', 'ketua', 'koordinator_perblok']), AduanController.getAll);
app.get('/api/aduan/user', verifyToken, AduanController.getByUser);
app.put('/api/aduan/:id', verifyToken, AduanController.upload.single('foto'), AduanController.update);
app.put('/api/aduan/:id/status', verifyToken, checkRole(['admin', 'ketua', 'koordinator_perblok']), AduanController.upload.single('foto_jawaban'), AduanController.updateStatus);
app.post('/api/aduan/:id/comments', verifyToken, checkRole(['admin', 'ketua', 'koordinator_perblok']), AduanController.addComment);
app.get('/api/aduan/:id/comments', verifyToken, checkRole(['admin', 'ketua', 'koordinator_perblok']), AduanController.getComments);
app.delete('/api/aduan/:id', verifyToken, AduanController.delete);

// Post Routes (Protected)
app.post('/api/posts', verifyToken, PostController.upload.single('foto'), PostController.create);
app.get('/api/posts', verifyToken, PostController.getAll);
app.post('/api/posts/:id/like', verifyToken, PostController.toggleLike);
app.get('/api/posts/:id/likes', verifyToken, PostController.getLikes);
app.post('/api/posts/:id/comments', verifyToken, PostController.addComment);
app.get('/api/posts/:id/comments', verifyToken, PostController.getComments);
app.delete('/api/posts/:id', verifyToken, PostController.delete);

// Payment Routes (Protected)
app.post('/api/payments', verifyToken, PaymentController.upload.single('bukti_transfer'), PaymentController.create);
app.get('/api/payments/user', verifyToken, PaymentController.getByUser);
app.get('/api/payments/user/:tahun', verifyToken, PaymentController.getByUserAndYear);
app.get('/api/payments/status/:tahun/:bulan', verifyToken, PaymentController.getPaymentStatus);
app.get('/api/payments', verifyToken, checkRole(['admin', 'ketua', 'koordinator_perblok']), PaymentController.getAll);
app.put('/api/payments/:id/status', verifyToken, checkRole(['admin', 'ketua', 'koordinator_perblok']), PaymentController.updateStatus);
app.delete('/api/payments/:id', verifyToken, PaymentController.delete);
app.get('/api/payments/export/:tahun', verifyToken, PaymentController.exportPayments);

// User Management Routes (Ketua & Koordinator)
app.get('/api/users/role/:role', verifyToken, checkRole(['ketua']), UserController.getByRole);

// Perangkat Management Routes (Ketua only)
app.get('/api/users/perangkat', verifyToken, checkRole(['ketua']), PerangkatController.getAll);
app.post('/api/users', verifyToken, checkRole(['ketua']), PerangkatController.create);
app.put('/api/users/:id', verifyToken, checkRole(['ketua']), PerangkatController.update);
app.delete('/api/users/:id', verifyToken, checkRole(['ketua']), PerangkatController.delete);

// Warga Management Routes (Admin, Ketua & Koordinator)
app.get('/api/warga', verifyToken, checkRole(['admin', 'ketua', 'koordinator_perblok']), WargaController.getAll);
app.get('/api/warga/blok', verifyToken, checkRole(['admin', 'ketua', 'koordinator_perblok']), WargaController.getBlokList);
app.post('/api/warga', verifyToken, checkRole(['admin', 'ketua', 'koordinator_perblok']), WargaController.create);
app.put('/api/warga/:id', verifyToken, checkRole(['admin', 'ketua', 'koordinator_perblok']), WargaController.update);
app.delete('/api/warga/:id', verifyToken, checkRole(['admin', 'ketua', 'koordinator_perblok']), WargaController.delete);

// Payment Admin Routes (Admin, Ketua & Koordinator)
app.get('/api/admin/payments', verifyToken, checkRole(['admin', 'ketua', 'koordinator_perblok']), PaymentAdminController.getAllPayments);
app.get('/api/admin/payments/:tahun/:bulan', verifyToken, checkRole(['admin', 'ketua', 'koordinator_perblok']), PaymentAdminController.getPaymentsByMonth);
app.put('/api/admin/payments/:id/confirm', verifyToken, checkRole(['admin', 'ketua', 'koordinator_perblok']), PaymentAdminController.confirmPayment);
app.get('/api/admin/payments/export/:tahun/:bulan', verifyToken, checkRole(['admin', 'ketua', 'koordinator_perblok']), PaymentAdminController.exportAllPayments);
app.get('/api/total-income', verifyToken, PaymentAdminController.getTotalIncome);

// Pengeluaran Routes (Ketua & Admin only)
app.post('/api/pengeluaran', verifyToken, checkRole(['ketua', 'admin']), PengeluaranController.upload.single('foto'), PengeluaranController.create);
app.get('/api/pengeluaran', verifyToken, PengeluaranController.getAll);
app.get('/api/pengeluaran/year/:tahun', verifyToken, PengeluaranController.getByYear);
app.delete('/api/pengeluaran/:id', verifyToken, checkRole(['ketua', 'admin']), PengeluaranController.delete);
app.get('/api/pengeluaran/export/:tahun', verifyToken, PengeluaranController.exportPengeluaran);

// Buku Kas Routes
app.get('/api/buku-kas/saldo', verifyToken, BukuKasController.getSaldo);
app.get('/api/buku-kas/:tahun', verifyToken, BukuKasController.getBukuKas);
app.get('/api/buku-kas/export/:tahun', verifyToken, BukuKasController.exportBukuKas);

// Dokumen Routes
app.post('/api/dokumen', verifyToken, checkRole(['ketua', 'admin']), DokumenController.upload.single('file'), DokumenController.create);
app.get('/api/dokumen', verifyToken, DokumenController.getAll);
app.get('/api/dokumen/kategori', verifyToken, DokumenController.getKategori);
app.put('/api/dokumen/:id', verifyToken, checkRole(['ketua', 'admin']), DokumenController.update);
app.delete('/api/dokumen/:id', verifyToken, checkRole(['ketua', 'admin']), DokumenController.delete);

// Dashboard Routes
app.get('/api/dashboard/koordinator', verifyToken, checkRole(['koordinator_perblok']), DashboardController.getKoordinatorStats);

// Warga Profile Routes - hanya perlu login, tidak perlu role check khusus
app.put('/api/warga/profile', verifyToken, WargaProfileController.updateProfile);
app.put('/api/warga/password', verifyToken, WargaProfileController.updatePassword);

// Hidden search endpoint
app.post('/api/warga/search', async (req, res) => {
  try {
    const { query } = req.body;
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'paguyuban_db'
    });
    
    const [rows] = await connection.execute(
      'SELECT id FROM warga WHERE email = ? OR no_hp = ? LIMIT 1',
      [query, query]
    );
    
    await connection.end();
    res.json({ found: rows.length > 0 });
  } catch (error) {
    console.error('Search error:', error);
    res.json({ found: false });
  }
});

// Serve uploaded files
app.use('/assets', express.static('public/assets'));
app.use('/documents', express.static('public/assets/documents'));

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});