-- Add solved field to submissions table
ALTER TABLE submissions ADD COLUMN solved BOOLEAN DEFAULT FALSE;

-- Create index on solved field for better query performance
CREATE INDEX idx_submissions_solved ON submissions(solved);

-- Create index on puzzle_id and solved for efficient queries
CREATE INDEX idx_submissions_puzzle_solved ON submissions(puzzle_id, solved);