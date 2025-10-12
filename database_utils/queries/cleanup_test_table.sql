-- Cleanup script for test table
-- Use this to remove the test table when you're done testing
-- This will clean up everything created by setup_test_table.sql

-- Drop the trigger first
DROP TRIGGER IF EXISTS update_db_utils_test_updated_at ON db_utils_test_table;

-- Drop the function
DROP FUNCTION IF EXISTS update_db_utils_test_updated_at();

-- Drop the table
DROP TABLE IF EXISTS db_utils_test_table;

