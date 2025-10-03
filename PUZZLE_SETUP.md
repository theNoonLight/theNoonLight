# 🧩 Puzzle Upload System Setup

This guide explains how to set up automatic puzzle uploads to Supabase when you push to GitHub and Vercel deploys.

## 🚀 How It Works

### **1. Build-Time Sync (Primary)**
- When Vercel builds your app, it runs `npm run build`
- This automatically validates and syncs all puzzles from the `puzzles/` directory
- Puzzles are uploaded to Supabase Storage and metadata is saved to the database

### **2. Cron Job Sync (Backup)**
- Vercel runs a cron job every 6 hours to ensure puzzles stay in sync
- This catches any puzzles that might have been missed during build

## 📁 Puzzle Structure

Each puzzle should be in its own folder under `puzzles/`:

```
puzzles/
├── 0001/
│   ├── meta.json          # Required: Puzzle metadata
│   └── puzzle0001.zip     # Required: Puzzle file
├── 0002/
│   ├── meta.json
│   └── puzzle0002.zip
└── 0003/
    ├── meta.json
    └── puzzle0003.zip
```

## 📋 Meta.json Format

Each puzzle folder must contain a `meta.json` file with this structure:

```json
{
  "date_utc": "2025-01-15",           // Required: Puzzle date (YYYY-MM-DD)
  "title": "Puzzle Title",            // Required: Display title
  "summary": "Puzzle description",    // Optional: Description
  "answer_mode": "hash",              // Required: "hash" or "regex"
  "answer_plain": "correct answer",   // Required for hash mode
  "answer_regex": null,               // Required for regex mode
  "published": true,                  // Optional: Whether puzzle is live (default: false)
  "type": "audio",                    // Optional: Puzzle type
  "difficulty": 2                     // Optional: Difficulty level
}
```

### **Answer Modes:**

**Hash Mode:**
- Set `answer_mode: "hash"`
- Provide `answer_plain` with the correct answer
- System will hash and normalize the answer for comparison

**Regex Mode:**
- Set `answer_mode: "regex"`
- Provide `answer_regex` with the regex pattern
- System will test user input against this pattern

## 🔧 Environment Variables

### **For Vercel Deployment:**
Make sure these are set in your Vercel project:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CRON_SECRET=your_random_secret_key  # For cron job security
```

### **For Local Development:**
Create a `.env.local` file in your project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
CRON_SECRET=your_random_secret_key
```

**Note:** You only need these for local puzzle syncing. Regular development (`npm run dev`) works without them.

## 📝 Adding New Puzzles

### **Step 1: Create Puzzle Folder**
```bash
mkdir puzzles/0004
```

### **Step 2: Add Puzzle Files**
- Place your puzzle file (`.zip`) in the folder
- Create `meta.json` with the required fields

### **Step 3: Commit and Push**
```bash
git add puzzles/0004/
git commit -m "Add puzzle 0004"
git push origin main
```

### **Step 4: Automatic Sync**
- Vercel will automatically build and sync the puzzle
- The puzzle will appear in your app once deployed

## 🛠️ Manual Commands

### **Validate Puzzles Locally**
```bash
npm run validate-puzzles
```

### **Sync Puzzles Manually**
```bash
npm run sync-puzzles
```

### **Local Development**
```bash
# Regular development (no puzzle sync)
npm run dev

# Development with puzzle sync (requires Supabase env vars)
npm run dev:with-sync
```

### **Test Cron Job**
Visit: `https://your-domain.vercel.app/api/cron/sync-puzzles`

## 🔍 Troubleshooting

### **Puzzle Not Appearing**
1. Check that `published: true` in meta.json
2. Verify the puzzle folder structure
3. Check Vercel build logs for sync errors
4. Run validation script locally

### **Build Failures**
1. Ensure all required fields are in meta.json
2. Check that .zip files are not empty
3. Verify Supabase credentials are correct

### **Cron Job Issues**
1. Check that `CRON_SECRET` is set in Vercel
2. Verify the cron job is enabled in Vercel dashboard
3. Check Vercel function logs

## 📊 Monitoring

- **Build Logs**: Check Vercel deployment logs for sync status
- **Cron Logs**: Monitor Vercel function logs for cron job execution
- **Database**: Check Supabase dashboard for uploaded puzzles
- **Storage**: Verify files in Supabase Storage bucket

## 🎯 Best Practices

1. **Always validate locally** before pushing
2. **Use descriptive folder names** (0001, 0002, etc.)
3. **Test answers thoroughly** before publishing
4. **Keep meta.json consistent** across puzzles
5. **Use meaningful titles and summaries**

## 🚨 Important Notes

- **Never commit sensitive data** in meta.json (like actual answers in plain text for hash mode)
- **Test puzzles thoroughly** before setting `published: true`
- **Backup your puzzles** before major changes
- **Monitor storage usage** in Supabase dashboard

---

**Need help?** Check the Vercel function logs or run the validation script locally to debug issues.
