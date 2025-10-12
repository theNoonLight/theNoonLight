#!/usr/bin/env python3
"""
Simple script to run SQL files against Supabase database
Usage: python run_sql.py your_file.sql
"""

import sys
import os
from utils.supabase_util import SupabaseUtil

def main():
    if len(sys.argv) != 2:
        print("Usage: python run_sql.py <sql_file>")
        print("Example: python run_sql.py queries/my_query.sql")
        sys.exit(1)
    
    sql_file = sys.argv[1]
    
    # Initialize utility
    util = SupabaseUtil()
    
    # Test connection
    print("🔌 Testing database connection...")
    if not util.connect_to_database():
        print("❌ Failed to connect to database")
        print("Please check your .env file and ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set")
        sys.exit(1)
    
    print("✅ Database connection successful")
    
    # Execute SQL file
    print(f"🚀 Executing SQL file: {sql_file}")
    result = util.execute_sql_file(sql_file)
    
    if result["success"]:
        print("✅ SQL file executed successfully")
        if result.get("data"):
            data = result["data"]
            
            # Check if this is multiple query results
            if isinstance(data, list) and len(data) > 0 and isinstance(data[0], dict) and "query_number" in data[0]:
                # Multiple queries executed
                print(f"📊 Results ({result.get('successful_queries', 0)}/{result.get('total_queries', 0)} queries successful):")
                print("=" * 80)
                
                for query_result in data:
                    print(f"\n🔍 Query {query_result['query_number']}: {query_result['query']}")
                    print("-" * 60)
                    
                    if query_result["success"]:
                        query_data = query_result.get("data")
                        if query_data:
                            if isinstance(query_data, list) and len(query_data) > 0:
                                # Display table data
                                if isinstance(query_data[0], dict):
                                    columns = list(query_data[0].keys())
                                    header = " | ".join([col.ljust(15) for col in columns])
                                    print(header)
                                    print("-" * len(header))
                                    
                                    for row in query_data:
                                        row_str = " | ".join([str(row.get(col, "")).ljust(15) for col in columns])
                                        print(row_str)
                                else:
                                    for item in query_data:
                                        print(item)
                            elif isinstance(query_data, str):
                                print(query_data)
                            else:
                                print(query_data)
                        else:
                            print("Query executed successfully (no data returned)")
                    else:
                        print(f"❌ Query failed: {query_result.get('error', 'Unknown error')}")
                
                print("=" * 80)
            else:
                # Single query result (original format)
                print("📊 Results:")
                print("-" * 50)
                
                if isinstance(data, list) and len(data) > 0:
                    # Display table data nicely
                    if isinstance(data[0], dict):
                        # Get column names from first row
                        columns = list(data[0].keys())
                        
                        # Print header
                        header = " | ".join([col.ljust(15) for col in columns])
                        print(header)
                        print("-" * len(header))
                        
                        # Print each row
                        for row in data:
                            row_str = " | ".join([str(row.get(col, "")).ljust(15) for col in columns])
                            print(row_str)
                    else:
                        # Simple list of values
                        for item in data:
                            print(item)
                elif isinstance(data, str):
                    print(data)
                else:
                    print(data)
                
                print("-" * 50)
    else:
        print(f"❌ SQL execution failed: {result['error']}")
        sys.exit(1)

if __name__ == "__main__":
    main()
