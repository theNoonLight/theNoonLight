SELECT 
    test_name,
    test_value,
    test_description,
    is_active,
    created_at
FROM db_utils_test_table 
WHERE is_active = true
ORDER BY test_value ASC;

