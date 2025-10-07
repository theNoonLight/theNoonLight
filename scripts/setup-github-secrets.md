# 🔐 GitHub Secrets Setup Guide

This guide helps you set up the required secrets for the GitHub Actions workflow.

## 📋 Required Secrets

You need to add these secrets to your GitHub repository:

1. `NEXT_PUBLIC_SUPABASE_URL`
2. `SUPABASE_SERVICE_ROLE_KEY`

## 🚀 How to Add Secrets

### **Step 1: Go to Repository Settings**
1. Navigate to your GitHub repository
2. Click on **Settings** tab
3. In the left sidebar, click **Secrets and variables** → **Actions**

### **Step 2: Add Repository Secrets**
1. Click **New repository secret**
2. Add each secret one by one:

#### **NEXT_PUBLIC_SUPABASE_URL**
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: Your Supabase project URL (e.g., `https://your-project.supabase.co`)

#### **SUPABASE_SERVICE_ROLE_KEY**
- **Name**: `SUPABASE_SERVICE_ROLE_KEY`
- **Value**: Your Supabase service role key (starts with `eyJ...`)

### **Step 3: Verify Secrets**
1. You should see both secrets listed in the repository secrets
2. The values will be hidden for security

## 🔍 Finding Your Supabase Credentials

### **Supabase URL**
1. Go to your Supabase project dashboard
2. Click **Settings** → **API**
3. Copy the **Project URL**

### **Service Role Key**
1. In the same API settings page
2. Copy the **service_role** key (not the anon key)
3. This key has admin privileges - keep it secure!

## ✅ Testing the Setup

1. **Push a change** to the `puzzles/` directory
2. **Check GitHub Actions**:
   - Go to your repository → **Actions** tab
   - Look for "Sync Puzzles to Supabase" workflow
   - Click on it to see the logs

3. **Verify in Supabase**:
   - Check your Supabase Storage bucket for uploaded files
   - Check your puzzles table for new records

## 🚨 Troubleshooting

### **Workflow Not Running**
- Check that the workflow file is in `.github/workflows/sync-puzzles.yml`
- Ensure you're pushing to the `main` or `master` branch
- Verify the workflow is triggered by changes to `puzzles/` directory

### **Authentication Errors**
- Double-check the Supabase URL and service role key
- Ensure the service role key has the correct permissions
- Check the GitHub Actions logs for specific error messages

### **Puzzle Sync Failures**
- Run `npm run validate-puzzles` locally first
- Check that your puzzle structure matches the requirements
- Verify the Supabase Storage bucket exists and is accessible

## 🔒 Security Notes

- **Never commit secrets** to your repository
- **Use repository secrets** for sensitive data
- **Rotate keys regularly** for security
- **Limit service role key permissions** when possible

---

**Need help?** Check the GitHub Actions logs or run the validation script locally to debug issues.
