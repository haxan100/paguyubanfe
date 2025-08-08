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
      const { konten } = req.body;
      const foto = req.file ? req.file.filename : null;
      const user_id = req.user.id;
      
      const result = await Post.create({ user_id, konten, foto });
      
      // Emit realtime notification
      const io = req.app.get('io');
      const notificationData = {
        nama: req.user.nama,
        blok: req.user.blok,
        konten: konten.substring(0, 50) + '...',
        postId: result.insertId
      };
      
      console.log('📢 Emitting post notification:', notificationData);
      io.emit('post-notification', notificationData);
      
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
      const user_id = req.user.id;
      
      const result = await Post.toggleLike(id, user_id);
      
      // Get post data for notification
      const post = await Post.findById(id);
      
      // Emit realtime notification if liked (not unliked)
      if (result.action === 'liked' && post && post.user_id !== user_id) {
        const io = req.app.get('io');
        const notificationData = {
          nama: req.user.nama,
          postId: id,
          postOwner: post.user_id
        };
        
        console.log('❤️ Emitting like notification:', notificationData);
        io.to(`user-${post.user_id}`).emit('like-notification', notificationData);
      }
      
      // Emit update to all users
      const io = req.app.get('io');
      io.emit('post-update', { postId: id, type: 'like' });
      
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
      const { komentar } = req.body;
      const user_id = req.user.id;
      
      await Post.addComment({ post_id: id, user_id, komentar });
      
      // Get post data for notification
      const post = await Post.findById(id);
      
      // Emit realtime notification to post owner
      if (post && post.user_id !== user_id) {
        const io = req.app.get('io');
        const notificationData = {
          nama: req.user.nama,
          comment: komentar,
          postId: id,
          postOwner: post.user_id
        };
        
        console.log('💬 Emitting comment notification:', notificationData);
        io.to(`user-${post.user_id}`).emit('comment-notification', notificationData);
      }
      
      // Emit update to all users
      const io = req.app.get('io');
      io.emit('post-update', { postId: id, type: 'comment' });
      
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
      
      // Get post data to check ownership
      const post = await Post.findById(id);
      if (!post) {
        return res.status(404).json({ status: 'error', message: 'Post tidak ditemukan' });
      }
      
      // Check permission: admin, ketua, koordinator_perblok, or post owner
      const canDelete = ['admin', 'ketua', 'koordinator_perblok'].includes(req.user.jenis) || 
                       post.user_id === req.user.id;
      
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