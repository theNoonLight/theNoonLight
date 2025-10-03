-- Migration to replace correct boolean with attempts integer
-- This migration changes the submissions table to track attempts instead of just correct/incorrect

-- First, add the attempts column
ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS attempts INTEGER DEFAULT 1;

-- Add user_id column to track attempts per user per puzzle
ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS user_id UUID;

-- Create a unique constraint on puzzle_id + user_id to ensure one record per user per puzzle
-- This will allow us to use upsert logic to increment attempts
ALTER TABLE public.submissions 
ADD CONSTRAINT IF NOT EXISTS unique_user_puzzle 
UNIQUE (puzzle_id, user_id);

-- Update existing records to have attempts = 1 where correct = true
-- and attempts = 1 where correct = false (since they were single attempts)
UPDATE public.submissions 
SET attempts = 1 
WHERE attempts IS NULL;

-- Drop the correct column since we're replacing it with attempts
ALTER TABLE public.submissions 
DROP COLUMN IF NOT EXISTS correct;

-- Update indexes - remove correct index, add attempts index
DROP INDEX IF EXISTS idx_submissions_correct;
CREATE INDEX IF NOT EXISTS idx_submissions_attempts ON public.submissions(attempts);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_puzzle_user ON public.submissions(puzzle_id, user_id);

