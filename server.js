import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import AuthController from './controllers/AuthController.js';
import AduanController from './controllers/AduanController.js';
import PostController from './controllers/PostController.js';

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

// Aduan Routes
app.post('/api/aduan', AduanController.upload.single('foto'), AduanController.create);
app.get('/api/aduan', AduanController.getAll);
app.get('/api/aduan/user/:user_id', AduanController.getByUser);
app.put('/api/aduan/:id', AduanController.upload.single('foto'), AduanController.update);
app.put('/api/aduan/:id/status', AduanController.upload.single('foto_jawaban'), AduanController.updateStatus);
app.delete('/api/aduan/:id', AduanController.delete);

// Post Routes
app.post('/api/posts', PostController.upload.single('foto'), PostController.create);
app.get('/api/posts', PostController.getAll);
app.post('/api/posts/:id/like', PostController.toggleLike);
app.get('/api/posts/:id/likes', PostController.getLikes);
app.post('/api/posts/:id/comments', PostController.addComment);
app.get('/api/posts/:id/comments', PostController.getComments);
app.delete('/api/posts/:id', PostController.delete);

// Serve uploaded files
app.use('/assets', express.static('public/assets'));

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});