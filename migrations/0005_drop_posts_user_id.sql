-- Remove user_id from posts since auth was removed
DROP INDEX IF EXISTS idx_posts_user_id;
ALTER TABLE posts DROP COLUMN user_id;
