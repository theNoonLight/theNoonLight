# Puzzle Upload Guide

This guide explains how to upload new puzzles to The Noon Light.

## How It Works

1. **Add puzzles locally** to the `puzzles/` directory
2. **Push to GitHub** - triggers automatic upload
3. **Vercel builds** your app
4. **GitHub Action** syncs puzzles to Supabase
5. **Puzzles appear** on your live site

## Puzzle Structure

Each puzzle should be in its own folder:

```
puzzles/
├── 0001/
│   ├── meta.json
│   └── puzzle0001.zip
├── 0002/
│   ├── meta.json
│   └── puzzle0002.zip
└── meta-template.json
```

## Meta.json Format

Each puzzle folder must contain a `meta.json` file with these fields:

```json
{
  "date_utc": "2025-01-15",
  "title": "Puzzle Title",
  "summary": "Brief description",
  "answer_mode": "hash",
  "answer_plain": "correct answer",
  "published": true
}
```

### Required Fields:
- `date_utc`: Date in YYYY-MM-DD format
- `title`: Display name for the puzzle
- `answer_mode`: Either "hash" or "regex"
- `answer_plain`: The correct answer (for hash mode)
- `published`: Set to `true` to make puzzle visible

### Optional Fields:
- `summary`: Description shown to users
- `answer_regex`: Regex pattern (for regex mode)

## Answer Modes

### Hash Mode (Recommended)
- Uses `answer_plain` field
- Answer is hashed and compared
- Case-insensitive, normalized comparison

### Regex Mode
- Uses `answer_regex` field
- Supports complex pattern matching
- Case-insensitive by default

## Upload Process

1. **Create puzzle folder** with date or number
2. **Add meta.json** with puzzle details
3. **Add puzzle.zip** file
4. **Commit and push** to GitHub
5. **Wait for deployment** (usually 2-3 minutes)
6. **Check logs** in GitHub Actions tab

## Manual Upload

If you need to upload manually:

```bash
curl "https://your-domain.com/api/admin/sync-storage?key=YOUR_SECRET_KEY"
```

## Troubleshooting

### Common Issues:
- **Missing meta.json**: Each folder needs a meta.json file
- **Invalid date format**: Use YYYY-MM-DD format
- **No zip file**: Each folder needs a .zip file
- **Upload fails**: Check GitHub Actions logs for details

### Check Status:
- View GitHub Actions: Repository → Actions tab
- Check Vercel deployment: Vercel dashboard
- Test API: Visit `/api/admin/sync-storage?key=YOUR_KEY`

## Environment Variables

Make sure these are set in Vercel:
- `SYNC_SECRET_KEY`: Secret key for manual uploads
- `GITHUB_SYNC_KEY`: Key for GitHub Actions (optional)
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service key
