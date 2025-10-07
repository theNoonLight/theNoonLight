# 🚀 Vercel Deployment Guide

This guide covers all environment variables and configurations needed for successful Vercel deployment.

## 🔧 Required Environment Variables

Set these in your **Vercel Dashboard** → **Project Settings** → **Environment Variables**:

### **Supabase Configuration**
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### **NextAuth Configuration**
```env
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your_random_secret_string
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
```

### **Puzzle Sync Configuration**
```env
SYNC_SECRET_KEY=your_random_secret_for_admin_endpoints
```

## 📋 How to Get These Values

### **Supabase Variables**
1. Go to your Supabase project dashboard
2. **Settings** → **API**
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`

### **Google OAuth Variables**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable **Google+ API**
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Set **Authorized redirect URIs**:
   - `https://your-domain.vercel.app/api/auth/callback/google`
   - `http://localhost:3000/api/auth/callback/google` (for development)
6. Copy **Client ID** and **Client Secret**

### **NextAuth Variables**
1. **NEXTAUTH_URL**: Your Vercel domain (e.g., `https://your-app.vercel.app`)
2. **NEXTAUTH_SECRET**: Generate with `openssl rand -base64 32`
3. **SYNC_SECRET_KEY**: Generate with `openssl rand -base64 32`

## 🧩 Puzzle System Configuration

### **Current Puzzle Issue**
Your puzzle has `date_utc: "2025-10-10"` which is in the future. Fix this:

1. Update `puzzles/0003/meta.json`:
```json
{
  "date_utc": "2025-01-15",
  "title": "Voices from the Past",
  "summary": "Open the audio and look at the spectrogram. Your answer is the full quoted sentence.",
  "type": "audio",
  "difficulty": 2,
  "answer_mode": "hash",
  "answer_plain": "we choose to go to the moon not because it is easy...",
  "answer_regex": null,
  "published": true
}
```

2. The system picks the **latest published puzzle** by `date_utc`, so use current or past dates.

## 🔄 GitHub Actions Setup

Your GitHub Actions workflow is already configured but needs these secrets:

### **Repository Secrets** (GitHub → Settings → Secrets and variables → Actions):
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## 🚀 Deployment Steps

1. **Set Environment Variables** in Vercel Dashboard
2. **Push to GitHub** - triggers automatic deployment
3. **Verify Puzzle Sync** - check GitHub Actions tab
4. **Test Authentication** - try signing in with Google
5. **Test Puzzle System** - visit `/today` to see current puzzle

## 🐛 Common Issues

### **"client_id is required" Error**
- Missing `GOOGLE_CLIENT_ID` or `GOOGLE_CLIENT_SECRET`
- Check Google OAuth redirect URIs

### **"No puzzle available"**
- Puzzle date is in the future
- Puzzle not published (`published: false`)
- GitHub Actions sync failed

### **Authentication Redirect Issues**
- Wrong `NEXTAUTH_URL` in Vercel
- Missing redirect URIs in Google OAuth

## ✅ Verification Checklist

- [ ] All environment variables set in Vercel
- [ ] Google OAuth configured with correct redirect URIs
- [ ] Puzzle dates are current/past (not future)
- [ ] GitHub Actions secrets configured
- [ ] Supabase database has puzzles table
- [ ] Supabase storage has puzzles bucket

## 🔗 Useful Links

- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [NextAuth.js Configuration](https://next-auth.js.org/configuration/options)
- [Google OAuth Setup](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Documentation](https://supabase.com/docs)
