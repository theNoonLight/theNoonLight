-- Complete database rebuild for TigerMonkey
-- Run this in Supabase SQL editor to recreate all tables

-- 1. Create sequence for puzzles first
CREATE SEQUENCE IF NOT EXISTS public.puzzles_id_seq
  AS integer
  START WITH 1
  INCREMENT BY 1
  NO MINVALUE
  NO MAXVALUE
  CACHE 1;

-- 2. Create puzzles table
CREATE TABLE public.puzzles (
  id integer NOT NULL DEFAULT nextval('puzzles_id_seq'::regclass),
  date_utc date NOT NULL UNIQUE,
  title text NOT NULL,
  summary text,
  storage_path text NOT NULL,
  answer_mode text NOT NULL DEFAULT 'hash'::text,
  answer_hash text,
  answer_regex text,
  published boolean DEFAULT false,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT puzzles_pkey PRIMARY KEY (id)
);

-- 3. Create users table for NextAuth
CREATE TABLE public.users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create sessions table for NextAuth
CREATE TABLE public.sessions (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  access_token TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Create accounts table for NextAuth
CREATE TABLE public.accounts (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL,
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at INTEGER,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(provider, provider_account_id)
);

-- 6. Create verification_tokens table for NextAuth
CREATE TABLE public.verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMP WITH TIME ZONE NOT NULL,
  PRIMARY KEY (identifier, token)
);

-- 7. Create submissions table
CREATE TABLE public.submissions (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  puzzle_id integer NOT NULL,
  user_id uuid,
  answer_raw text,
  answer_norm text,
  attempts integer DEFAULT 1,
  solved boolean DEFAULT FALSE,               
  ip text,
  user_agent text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT submissions_pkey PRIMARY KEY (id),
  CONSTRAINT fk_submissions_puzzle_id FOREIGN KEY (puzzle_id) REFERENCES public.puzzles(id) ON DELETE CASCADE,
  CONSTRAINT fk_submissions_user_id FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL,
  CONSTRAINT unique_user_puzzle UNIQUE (puzzle_id, user_id)
);

-- 8. Create indexes for better performance

-- Puzzles indexes
CREATE INDEX IF NOT EXISTS idx_puzzles_date_utc ON public.puzzles(date_utc);
CREATE INDEX IF NOT EXISTS idx_puzzles_published ON public.puzzles(published);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

-- Sessions indexes
CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_session_token ON public.sessions(session_token);

-- Accounts indexes
CREATE INDEX IF NOT EXISTS idx_accounts_user_id ON public.accounts(user_id);
CREATE INDEX IF NOT EXISTS idx_accounts_provider ON public.accounts(provider, provider_account_id);

-- Submissions indexes
CREATE INDEX IF NOT EXISTS idx_submissions_puzzle_id ON public.submissions(puzzle_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_attempts ON public.submissions(attempts);
CREATE INDEX IF NOT EXISTS idx_submissions_puzzle_user ON public.submissions(puzzle_id, user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_created_at ON public.submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_submissions_solved ON public.submissions(solved);                
CREATE INDEX IF NOT EXISTS idx_submissions_puzzle_solved ON public.submissions(puzzle_id, solved); 

-- 9. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- 10. Create RLS policies

-- Users policies
CREATE POLICY "Users can view their own data" ON public.users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data" ON public.users
  FOR UPDATE USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert their own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid()::text = id::text);

-- Sessions policies
CREATE POLICY "Users can view their own sessions" ON public.sessions
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own sessions" ON public.sessions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own sessions" ON public.sessions
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own sessions" ON public.sessions
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Accounts policies
CREATE POLICY "Users can view their own accounts" ON public.accounts
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own accounts" ON public.accounts
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own accounts" ON public.accounts
  FOR UPDATE USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete their own accounts" ON public.accounts
  FOR DELETE USING (auth.uid()::text = user_id::text);

-- Submissions policies
CREATE POLICY "Users can view their own submissions" ON public.submissions
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can insert their own submissions" ON public.submissions
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text OR user_id IS NULL);

CREATE POLICY "Users can update their own submissions" ON public.submissions
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- 11. Set ownership of sequence
ALTER SEQUENCE public.puzzles_id_seq OWNED BY public.puzzles.id;
