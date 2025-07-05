import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import AuthController from './controllers/AuthController.js';
import AduanController from './controllers/AduanController.js';
import PostController from './controllers/PostController.js';
import PaymentController from './controllers/PaymentController.js';
import PaymentAdminController from './controllers/PaymentAdminController.js';
import UserController from './controllers/UserController.js';
import { verifyToken, checkRole } from './middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(express.static('dist'));

// API Routes
app.post('/api/auth/login', AuthController.login);
app.post('/api/auth/register', AuthController.register);

// Aduan Routes (Protected)
app.post('/api/aduan', verifyToken, AduanController.upload.single('foto'), AduanController.create);
app.get('/api/aduan', verifyToken, checkRole(['admin', 'ketua', 'koordinator_perblok']), AduanController.getAll);
app.get('/api/aduan/user', verifyToken, AduanController.getByUser);
app.put('/api/aduan/:id', verifyToken, AduanController.upload.single('foto'), AduanController.update);
app.put('/api/aduan/:id/status', verifyToken, checkRole(['admin', 'ketua', 'koordinator_perblok']), AduanController.upload.single('foto_jawaban'), AduanController.updateStatus);
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

// User Management Routes (Ketua only)
app.get('/api/users', verifyToken, checkRole(['ketua']), UserController.getAll);
app.get('/api/users/role/:role', verifyToken, checkRole(['ketua']), UserController.getByRole);
app.post('/api/users', verifyToken, checkRole(['ketua']), UserController.create);
app.put('/api/users/:id', verifyToken, checkRole(['ketua']), UserController.update);
app.delete('/api/users/:id', verifyToken, checkRole(['ketua']), UserController.delete);

// Payment Admin Routes (Ketua only)
app.get('/api/admin/payments', verifyToken, checkRole(['ketua']), PaymentAdminController.getAllPayments);
app.put('/api/admin/payments/:id/confirm', verifyToken, checkRole(['ketua']), PaymentAdminController.confirmPayment);
app.get('/api/admin/payments/export/:tahun/:bulan', verifyToken, checkRole(['ketua']), PaymentAdminController.exportAllPayments);

// Serve uploaded files
app.use('/assets', express.static('public/assets'));

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});