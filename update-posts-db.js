import mysql from 'mysql2/promise';
import { dbConfig } from './config/database.js';

async function updatePostsToWarga() {
  try {
    const connection = await mysql.createConnection(dbConfig);
    
    console.log('🔄 Updating posts table foreign keys to warga...');
    
    // Drop existing foreign keys
    await connection.execute('ALTER TABLE posts DROP FOREIGN KEY IF EXISTS posts_ibfk_1');
    await connection.execute('ALTER TABLE post_comments DROP FOREIGN KEY IF EXISTS post_comments_ibfk_2');  
    await connection.execute('ALTER TABLE post_likes DROP FOREIGN KEY IF EXISTS post_likes_ibfk_2');
    
    // Add new foreign keys to warga table
    await connection.execute('ALTER TABLE posts ADD CONSTRAINT posts_warga_fk FOREIGN KEY (user_id) REFERENCES warga(id) ON DELETE CASCADE');
    await connection.execute('ALTER TABLE post_comments ADD CONSTRAINT post_comments_warga_fk FOREIGN KEY (user_id) REFERENCES warga(id) ON DELETE CASCADE');
    await connection.execute('ALTER TABLE post_likes ADD CONSTRAINT post_likes_warga_fk FOREIGN KEY (user_id) REFERENCES warga(id) ON DELETE CASCADE');
    
    console.log('✅ Successfully updated posts tables to reference warga');
    
    await connection.end();
  } catch (error) {
    console.error('❌ Error updating database:', error);
  }
}

updatePostsToWarga();