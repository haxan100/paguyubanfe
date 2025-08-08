-- Update posts table to reference warga instead of users
ALTER TABLE posts 
DROP FOREIGN KEY IF EXISTS posts_ibfk_1;

ALTER TABLE posts 
ADD CONSTRAINT posts_warga_fk 
FOREIGN KEY (user_id) REFERENCES warga(id) ON DELETE CASCADE;

-- Update post_comments table to reference warga instead of users  
ALTER TABLE post_comments 
DROP FOREIGN KEY IF EXISTS post_comments_ibfk_2;

ALTER TABLE post_comments 
ADD CONSTRAINT post_comments_warga_fk 
FOREIGN KEY (user_id) REFERENCES warga(id) ON DELETE CASCADE;

-- Update post_likes table to reference warga instead of users
ALTER TABLE post_likes 
DROP FOREIGN KEY IF EXISTS post_likes_ibfk_2;

ALTER TABLE post_likes 
ADD CONSTRAINT post_likes_warga_fk 
FOREIGN KEY (user_id) REFERENCES warga(id) ON DELETE CASCADE;