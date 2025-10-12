-- Test queries for the db_utils_test_table
-- These queries will help you test the database utility functionality

-- 1. Select all test records
SELECT * FROM db_utils_test_table ORDER BY created_at DESC;

-- 2. Count total test records
SELECT COUNT(*) as total_test_records FROM db_utils_test_table;

-- 3. Count active test records
SELECT COUNT(*) as active_test_records FROM db_utils_test_table WHERE is_active = true;

-- 4. Get test records by value range
SELECT test_name, test_value, test_description FROM db_utils_test_table 
WHERE test_value BETWEEN 200 AND 600 
ORDER BY test_value;

-- 5. Get test statistics
SELECT 
    COUNT(*) as total_records,
    AVG(test_value) as average_value,
    MIN(test_value) as min_value,
    MAX(test_value) as max_value,
    COUNT(CASE WHEN is_active = true THEN 1 END) as active_count
FROM db_utils_test_table;

-- 6. Get test records created in the last hour
SELECT test_name, test_value, created_at FROM db_utils_test_table 
WHERE created_at >= NOW() - INTERVAL '1 hour';

