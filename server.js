import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import AuthController from './controllers/AuthController.js';
import AduanController from './controllers/AduanController.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('dist'));

// API Routes
app.post('/api/auth/login', AuthController.login);
app.post('/api/auth/register', AuthController.register);

// Aduan Routes
app.post('/api/aduan', AduanController.create);
app.get('/api/aduan/user/:user_id', AduanController.getByUser);
app.put('/api/aduan/:id', AduanController.update);
app.delete('/api/aduan/:id', AduanController.delete);

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});