# Quick Start Guide

## ⚡ Get Started in 30 Seconds

### Prerequisites
- Node.js 18+ and npm installed
- Google Chrome (for debugging)

### Step 1: Start Development Server

**Windows:**
```bash
start.bat
```

**macOS/Linux:**
```bash
./start.sh
```

**Manual (any OS):**
```bash
npm run dev
```

The app will open at `http://localhost:8080`

---

## 🎯 VS Code Quick Start (Recommended)

1. **Open the project in VS Code**
2. **Press `F5`** to start debugging
3. **Select** "Launch Chrome Dev Server" 
4. Browser opens automatically with full debugging support ✅

**Stop:** Press Ctrl+C in the terminal or click Stop in VS Code

---

## 📦 Available Commands

| Command | What it does |
|---------|-------------|
| `npm run dev` | Start development server (port 8080) |
| `npm run build` | Build for production |
| `npm test` | Run tests once |
| `npm run test:watch` | Run tests continuously |
| `npm run lint` | Check code quality |
| `npm run preview` | Preview production build locally |

---

## 🔧 Troubleshooting

### Port 8080 already in use
```bash
# Find process using port 8080
netstat -ano | findstr :8080

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Dependencies not installed
```bash
npm install
```

### Clear build cache
```bash
# Delete build artifacts
rm -rf dist node_modules/.vite

# Reinstall
npm install
npm run dev
```

### Module not found errors
Make sure Node.js version is 18+:
```bash
node --version
```

---

## 🌐 Environment Setup

The `.env` file is already configured with Supabase credentials:
- API URL: `https://mcugpjlmciojlmkhzprh.supabase.co`
- Project: `mcugpjlmciojlmkhzprh`

To modify, edit `.env`:
```
VITE_SUPABASE_PROJECT_ID="your-project"
VITE_SUPABASE_PUBLISHABLE_KEY="your-key"
VITE_SUPABASE_URL="your-url"
```

---

## 📂 Project Structure

```
skill-navigator-pro-main/
├── src/                   # React components & pages
│  ├── components/        # UI components
│  ├── pages/             # Page components
│  ├── hooks/             # Custom React hooks
│  ├── integrations/      # Supabase integration
│  └── App.tsx            # Main app
├── supabase/             # Backend functions
├── .vscode/              # VS Code config
├── public/               # Static files
├── package.json          # Dependencies
├── vite.config.ts        # Build config
└── .env                  # Environment variables
```

---

## 🚀 Next Steps

1. **Open `http://localhost:8080` in browser**
2. **Explore the app** - Make sure it loads properly
3. **Edit files in `src/`** - Changes auto-reload
4. **Press F12** to open Developer Tools
5. **Check Console** for any errors

---

## 💬 Need Help?

- **Dev Server Won't Start?** Rebuild: `npm install && npm run dev`
- **Page Blank?** Check browser console (F12) for errors
- **Changes Not Showing?** Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)

---

## ✅ Project Status

- ✅ Dependencies installed
- ✅ Build system configured
- ✅ Dev server ready
- ✅ VS Code debugging set up
- ✅ Environment variables configured
- ✅ Ready to code! 🎉

**Happy coding!** 🚀
