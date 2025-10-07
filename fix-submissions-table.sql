-- Add additional columns to submissions table for better tracking
ALTER TABLE submissions ADD COLUMN answer_raw TEXT;
ALTER TABLE submissions ADD COLUMN ip INET;
ALTER TABLE submissions ADD COLUMN user_agent TEXT;

-- Create index on ip for potential analytics
CREATE INDEX idx_submissions_ip ON submissions(ip);

-- Create index on timestamp for time-based queries
CREATE INDEX idx_submissions_timestamp ON submissions(timestamp);