# make-env.ps1 - Creates .env.local file for the TigerMonkey puzzle app
# Run this script to set up your environment variables

Write-Host "Creating .env.local file for TigerMonkey puzzle app..." -ForegroundColor Green

# Check if .env.local already exists
if (Test-Path ".env.local") {
    Write-Host "WARNING: .env.local already exists. Backing up to .env.local.backup" -ForegroundColor Yellow
    Copy-Item ".env.local" ".env.local.backup"
}

# Create the .env.local file
$envContent = @"
# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-here

# Google OAuth (for authentication)
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

# Optional: Database URL (if using direct database connection)
# DATABASE_URL=postgresql://username:password@host:port/database
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8

Write-Host "SUCCESS: .env.local file created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Get your Google OAuth credentials from: https://console.developers.google.com/"
Write-Host "2. Get your Supabase credentials from: https://supabase.com/dashboard"
Write-Host "3. Replace the placeholder values in .env.local with your actual credentials"
Write-Host "4. Generate a secure NEXTAUTH_SECRET (you can use: openssl rand -base64 32)"
Write-Host ""
Write-Host "Security reminder:" -ForegroundColor Red
Write-Host "- Never commit .env.local to version control"
Write-Host "- Keep your service role key secure"
Write-Host "- Use different credentials for development and production"