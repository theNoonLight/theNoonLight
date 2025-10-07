-- Supabase migration script for The Noon Light puzzle platform
-- This script sets up the complete database schema

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create puzzles table
CREATE TABLE IF NOT EXISTS puzzles (
    id SERIAL PRIMARY KEY,
    date_utc DATE NOT NULL,
    title TEXT NOT NULL,
    summary TEXT,
    storage_path TEXT NOT NULL,
    answer_mode TEXT NOT NULL CHECK (answer_mode IN ('hash', 'regex')),
    answer_hash TEXT,
    answer_regex TEXT,
    published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sessions table for NextAuth
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create accounts table for NextAuth
CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
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
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create verification_tokens table for NextAuth
CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier TEXT NOT NULL,
    token TEXT NOT NULL,
    expires TIMESTAMP WITH TIME ZONE NOT NULL,
    PRIMARY KEY (identifier, token)
);

-- Create submissions table
CREATE TABLE IF NOT EXISTS submissions (
    id SERIAL PRIMARY KEY,
    puzzle_id INTEGER REFERENCES puzzles(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    answer TEXT NOT NULL,
    correct BOOLEAN NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_puzzles_date_utc ON puzzles(date_utc DESC);
CREATE INDEX IF NOT EXISTS idx_puzzles_published ON puzzles(published);
CREATE INDEX IF NOT EXISTS idx_submissions_puzzle_id ON submissions(puzzle_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_timestamp ON submissions(timestamp);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE puzzles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for puzzles (public read access)
CREATE POLICY "Puzzles are publicly readable" ON puzzles
    FOR SELECT USING (true);

-- Create RLS policies for users (users can only see their own data)
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Create RLS policies for sessions
CREATE POLICY "Sessions are accessible by user" ON sessions
    FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for accounts
CREATE POLICY "Accounts are accessible by user" ON accounts
    FOR ALL USING (auth.uid() = user_id);

-- Create RLS policies for verification_tokens
CREATE POLICY "Verification tokens are accessible by identifier" ON verification_tokens
    FOR ALL USING (true);

-- Create RLS policies for submissions (users can only see their own submissions)
CREATE POLICY "Users can view own submissions" ON submissions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions" ON submissions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create storage bucket for puzzles
INSERT INTO storage.buckets (id, name, public)
VALUES ('puzzles', 'puzzles', false)
ON CONFLICT (id) DO NOTHING;

-- Create storage policy for puzzles bucket
CREATE POLICY "Puzzles bucket is accessible by service role" ON storage.objects
    FOR ALL USING (bucket_id = 'puzzles');