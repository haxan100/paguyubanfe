import Post from '../models/Post.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assets/uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Hanya file gambar yang diizinkan'));
    }
  }
});

class PostController {
  static upload = upload;
  
  static async create(req, res) {
    try {
      const { user_id, konten } = req.body;
      const foto = req.file ? req.file.filename : null;
      
      const result = await Post.create({ user_id, konten, foto });
      res.json({ status: 'success', message: 'Post berhasil dibuat', id: result.insertId });
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getAll(req, res) {
    try {
      const posts = await Post.findAll();
      res.json({ status: 'success', data: posts });
    } catch (error) {
      console.error('Error getting posts:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async toggleLike(req, res) {
    try {
      const { id } = req.params;
      const { user_id } = req.body;
      
      const result = await Post.toggleLike(id, user_id);
      res.json({ status: 'success', data: result });
    } catch (error) {
      console.error('Error toggling like:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getLikes(req, res) {
    try {
      const { id } = req.params;
      const likes = await Post.getLikes(id);
      res.json({ status: 'success', data: likes });
    } catch (error) {
      console.error('Error getting likes:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async addComment(req, res) {
    try {
      const { id } = req.params;
      const { user_id, komentar } = req.body;
      
      await Post.addComment({ post_id: id, user_id, komentar });
      res.json({ status: 'success', message: 'Komentar berhasil ditambahkan' });
    } catch (error) {
      console.error('Error adding comment:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async getComments(req, res) {
    try {
      const { id } = req.params;
      const comments = await Post.getComments(id);
      res.json({ status: 'success', data: comments });
    } catch (error) {
      console.error('Error getting comments:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  static async delete(req, res) {
    try {
      const { id } = req.params;
      const { user_id, user_role } = req.body;
      
      // Get post data to check ownership
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ status: 'error', message: 'Post tidak ditemukan' });
      }
      
      // Check permission: admin, ketua, koordinator_perblok, or post owner
      const canDelete = ['admin', 'ketua', 'koordinator_perblok'].includes(user_role) || 
                       post.user_id === parseInt(user_id);
      
      if (!canDelete) {
        return res.status(403).json({ status: 'error', message: 'Tidak memiliki izin untuk menghapus post ini' });
      }
      
      await Post.delete(id);
      res.json({ status: 'success', message: 'Post berhasil dihapus' });
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }
}

export default PostController;