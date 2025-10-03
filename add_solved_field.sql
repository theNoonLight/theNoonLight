-- Add solved field to submissions table
-- This field tracks whether the user has solved the puzzle correctly

ALTER TABLE public.submissions 
ADD COLUMN IF NOT EXISTS solved BOOLEAN DEFAULT FALSE;

-- Update existing records where attempts > 0 to solved = true
-- (assuming they were solved if they have attempts)
UPDATE public.submissions 
SET solved = TRUE 
WHERE attempts > 0;

-- Add index for better performance on solved queries
CREATE INDEX IF NOT EXISTS idx_submissions_solved ON public.submissions(solved);
CREATE INDEX IF NOT EXISTS idx_submissions_puzzle_solved ON public.submissions(puzzle_id, solved);
