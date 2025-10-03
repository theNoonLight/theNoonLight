-- Fix submissions table to match the submit API
-- Add missing columns to the submissions table

ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS answer_raw text,
ADD COLUMN IF NOT EXISTS ip text,
ADD COLUMN IF NOT EXISTS user_agent text;

-- Update the existing columns to match the API expectations
-- (The existing columns are already correct, just adding the missing ones)

-- Optional: Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_submissions_puzzle_id ON public.submissions(puzzle_id);
CREATE INDEX IF NOT EXISTS idx_submissions_correct ON public.submissions(correct);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON public.submissions(created_at);
