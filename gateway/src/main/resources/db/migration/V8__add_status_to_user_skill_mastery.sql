-- Ensure status column exists in user_skill_mastery table
ALTER TABLE user_skill_mastery
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'LOCKED';
