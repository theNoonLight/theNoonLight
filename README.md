# TigerMonkey

A daily puzzle platform built with Next.js 15 and Supabase. Users can download daily puzzles and submit their answers for validation.

## 🎯 Features

- **Daily Puzzle Drops**: New puzzles available at noon PT
- **Answer Submission**: Submit answers with real-time validation
- **Multiple Answer Modes**: Support for both hash-based and regex-based answer checking
- **Admin Panel**: Sync puzzles from local storage to Supabase
- **Responsive Design**: Built with Tailwind CSS

## 🏗️ Project Structure

```
tigermonkey-app/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── api/                      # API Routes
│   │   │   ├── admin/
│   │   │   │   └── sync-storage/     # Admin puzzle sync endpoint
│   │   │   │       └── route.ts
│   │   │   ├── submit/               # Answer submission endpoint
│   │   │   │   └── route.ts
│   │   │   └── today/                # Today's puzzle data
│   │   │       └── route.ts
│   │   ├── today/                    # Today's puzzle page
│   │   │   └── page.tsx
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Home page
│   ├── components/
│   │   └── TodayClient.tsx           # Client-side puzzle component
│   └── lib/
│       ├── normalize.ts              # Answer normalization utilities
│       └── supabaseAdmin.ts          # Supabase admin client
├── puzzles/                          # Local puzzle storage
│   ├── 0001/                         # Puzzle 1
│   │   ├── meta.json                 # Puzzle metadata
│   │   ├── puzzle0001.zip            # Puzzle files
│   │   ├── test.txt                  # Test files
│   │   └── test.txt.bz2
│   └── 0002/                         # Puzzle 2
│       ├── meta.json
│       ├── puzzle0002.zip
│       ├── test.txt
│       └── test.txt.bz2
├── public/                           # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tigermonkey-app
```

2. Install dependencies:
```bash
pnpm install
# or
npm install
```

3. Set up environment variables:
Create a `.env.local` file with the following variables:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_string
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret

# Admin Configuration
SYNC_SECRET_KEY=your_sync_secret_key
```

4. Run the development server:
```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📋 API Endpoints

### Public Endpoints

- `GET /api/today` - Get today's puzzle data
- `POST /api/submit` - Submit an answer for validation

### Admin Endpoints

- `GET /api/admin/sync-storage?key=<secret>` - Sync local puzzles to Supabase storage

### Health Check Endpoints


## 🧩 Puzzle System

### Puzzle Structure

Each puzzle is stored in a numbered folder (e.g., `0001`, `0002`) containing:

- `meta.json` - Puzzle metadata including:
  - `title` - Puzzle title
  - `summary` - Puzzle description
  - `date_utc` - Release date (YYYY-MM-DD format)
  - `answer_mode` - Either "hash" or "regex"
  - `answer_plain` - Plain text answer (for hash mode)
  - `answer_regex` - Regex pattern (for regex mode)
  - `published` - Boolean for publication status
- `puzzle*.zip` - The actual puzzle files
- Additional test files as needed

### Answer Validation

The system supports two answer validation modes:

1. **Hash Mode**: Answers are normalized and hashed with SHA-256
2. **Regex Mode**: Answers are matched against a regex pattern

## 🛠️ Development

### Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

### Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Deployment**: Vercel

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add the required environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set these in your Vercel dashboard:

**Supabase Configuration:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

**NextAuth Configuration:**
- `NEXTAUTH_URL` (your Vercel domain)
- `NEXTAUTH_SECRET` (random string)
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

**Admin Configuration:**
- `SYNC_SECRET_KEY`

📖 **See `VERCEL_DEPLOYMENT.md` for detailed setup instructions.**

## 📝 Usage

### For Users

1. Visit `/today` to see the current puzzle
2. Download the puzzle files
3. Solve the puzzle
4. Submit your answer using the form
5. Get immediate feedback on correctness and see your attempt count

### For Admins

1. Add new puzzles to the `puzzles/` directory
2. Ensure each puzzle has a proper `meta.json` file
3. Use the sync endpoint to upload puzzles to Supabase:
   ```
   GET /api/admin/sync-storage?key=your_secret_key
   ```

## 🔧 Configuration

### Database Schema

The application expects the following Supabase tables:

- `puzzles` - Stores puzzle metadata and answers
- `submissions` - Stores user answer submissions

### Puzzle Metadata Format

```json
{
  "title": "Puzzle Title",
  "summary": "Puzzle description",
  "date_utc": "2025-01-15",
  "answer_mode": "hash",
  "answer_plain": "correct answer",
  "published": true
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is private and proprietary.