-- Create a test table for database utility testing
-- This table will be used to test the SQL execution functionality
-- It's completely separate from the main application tables

CREATE TABLE IF NOT EXISTS db_utils_test_table (
    id SERIAL PRIMARY KEY,
    test_name VARCHAR(100) NOT NULL,
    test_value INTEGER NOT NULL,
    test_description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_db_utils_test_name ON db_utils_test_table(test_name);
CREATE INDEX IF NOT EXISTS idx_db_utils_test_value ON db_utils_test_table(test_value);
CREATE INDEX IF NOT EXISTS idx_db_utils_test_active ON db_utils_test_table(is_active);

-- Insert some test data
INSERT INTO db_utils_test_table (test_name, test_value, test_description, is_active) VALUES 
    ('connection_test', 100, 'Test for database connection', true),
    ('query_test', 250, 'Test for basic queries', true),
    ('insert_test', 375, 'Test for insert operations', true),
    ('update_test', 500, 'Test for update operations', false),
    ('delete_test', 750, 'Test for delete operations', true)
ON CONFLICT DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_db_utils_test_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_db_utils_test_updated_at ON db_utils_test_table;
CREATE TRIGGER update_db_utils_test_updated_at
    BEFORE UPDATE ON db_utils_test_table
    FOR EACH ROW
    EXECUTE FUNCTION update_db_utils_test_updated_at();

