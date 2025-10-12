# Database Utilities for Supabase

This folder contains utilities for connecting to and managing your Supabase database programmatically.

## 📁 Folder Structure

```
database_utils/
├── utils/
│   └── supabase_util.py    # Core database utility class
├── queries/
│   ├── example_query.sql   # Example query to test connection
│   ├── setup_test_table.sql # Creates test table for testing
│   ├── test_queries.sql    # Various test queries
│   └── cleanup_test_table.sql # Removes test table
├── run_sql.py             # Script to run SQL files
├── requirements.txt       # Python dependencies
├── .env.example          # Environment variables template
└── README.md              # This file
```

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd database_utils
pip install -r requirements.txt
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env
# Edit .env with your actual Supabase credentials
```

### 3. Test the Connection
```bash
python run_sql.py queries/example_query.sql
```

### 4. Set Up Test Table
```bash
python run_sql.py queries/setup_test_table.sql
```

### 5. Run Test Queries
```bash
python run_sql.py queries/test_queries.sql
```

### 6. Clean Up (when done testing)
```bash
python run_sql.py queries/cleanup_test_table.sql
```

## 🔧 Usage

### Run Any SQL File
```bash
python run_sql.py path/to/your/query.sql
```

### Run Your Existing SQL Files
```bash
# Run your main database schema
python run_sql.py ../rebuild-database.sql

# Run any other SQL file
python run_sql.py ../add_solved_field.sql
```

## 🧪 Testing

The `queries/` folder contains several test files:

- **setup_test_table.sql** - Creates a test table with sample data
- **test_queries.sql** - Various queries to test the functionality
- **cleanup_test_table.sql** - Removes the test table when done

## 🔐 Environment Variables

Create a `.env` file with your Supabase credentials:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## 📝 Notes

- The utility uses Supabase's REST API to execute SQL queries
- Make sure you have the service role key (not the anon key) for full database access
- Test queries are safe and won't affect your production data
- Always test with the test table before running on your main database

