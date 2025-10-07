-- Migrate submissions table to use attempts instead of correct boolean
-- First, add the new columns
ALTER TABLE submissions ADD COLUMN attempts INTEGER DEFAULT 1;
ALTER TABLE submissions ADD COLUMN user_id UUID REFERENCES users(id);

-- Update existing records to set attempts based on correct field
UPDATE submissions SET attempts = CASE WHEN correct THEN 1 ELSE 1 END;

-- Create unique constraint on puzzle_id and user_id
ALTER TABLE submissions ADD CONSTRAINT unique_puzzle_user UNIQUE(puzzle_id, user_id);

-- Create index on user_id for better query performance
CREATE INDEX idx_submissions_user_id ON submissions(user_id);

-- Drop the old correct column (commented out for safety)
-- ALTER TABLE submissions DROP COLUMN correct;