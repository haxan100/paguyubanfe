import mysql from 'mysql2/promise';
import { dbConfig } from '../config/database.js';

class Post {
  static async create(postData) {
    const connection = await mysql.createConnection(dbConfig);
    const { user_id, konten, foto } = postData;
    
    const [result] = await connection.execute(
      'INSERT INTO posts (user_id, konten, foto) VALUES (?, ?, ?)',
      [user_id, konten, foto]
    );
    
    await connection.end();
    return result;
  }

  static async findAll() {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(`
      SELECT p.*, w.nama, w.blok,
        (SELECT COUNT(*) FROM post_likes WHERE post_id = p.id) as total_likes,
        (SELECT COUNT(*) FROM post_comments WHERE post_id = p.id) as total_comments
      FROM posts p 
      JOIN warga w ON p.user_id = w.id 
      ORDER BY p.tanggal_post DESC
    `);
    
    await connection.end();
    return rows;
  }

  static async toggleLike(postId, userId) {
    const connection = await mysql.createConnection(dbConfig);
    
    // Check if already liked
    const [existing] = await connection.execute(
      'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );
    
    if (existing.length > 0) {
      // Unlike
      await connection.execute(
        'DELETE FROM post_likes WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );
      await connection.end();
      return { action: 'unliked', liked: false };
    } else {
      // Like
      await connection.execute(
        'INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)',
        [postId, userId]
      );
      await connection.end();
      return { action: 'liked', liked: true };
    }
  }

  static async getLikes(postId) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(`
      SELECT pl.*, w.nama 
      FROM post_likes pl 
      JOIN warga w ON pl.user_id = w.id 
      WHERE pl.post_id = ? 
      ORDER BY pl.tanggal_like DESC
    `, [postId]);
    
    await connection.end();
    return rows;
  }

  static async addComment(commentData) {
    const connection = await mysql.createConnection(dbConfig);
    const { post_id, user_id, komentar } = commentData;
    
    const [result] = await connection.execute(
      'INSERT INTO post_comments (post_id, user_id, komentar) VALUES (?, ?, ?)',
      [post_id, user_id, komentar]
    );
    
    await connection.end();
    return result;
  }

  static async getComments(postId) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(`
      SELECT pc.*, w.nama, w.blok 
      FROM post_comments pc 
      JOIN warga w ON pc.user_id = w.id 
      WHERE pc.post_id = ? 
      ORDER BY pc.tanggal_komentar ASC
    `, [postId]);
    
    await connection.end();
    return rows;
  }

  static async findById(id) {
    const connection = await mysql.createConnection(dbConfig);
    
    const [rows] = await connection.execute(
      'SELECT * FROM posts WHERE id = ?',
      [id]
    );
    
    await connection.end();
    return rows[0];
  }

  static async delete(id) {
    const connection = await mysql.createConnection(dbConfig);
    
    await connection.execute('DELETE FROM posts WHERE id = ?', [id]);
    
    await connection.end();
  }
}

export default Post;