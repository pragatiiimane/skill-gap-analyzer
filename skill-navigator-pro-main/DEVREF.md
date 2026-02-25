# Development Quick Reference

## 🚀 Quick Commands

```bash
# Start dev server (http://localhost:8080)
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run tests with watch
npm run test:watch

# Check code quality
npm run lint

# Preview production build
npm run preview
```

## 🎯 IDE Shortcuts (VS Code)

| Action | Shortcut |
|--------|----------|
| Start Debug | `F5` |
| Stop Debug | `Shift+F5` |
| Toggle Breakpoint | `F9` |
| Step Over | `F10` |
| Step Into | `F11` |
| Continue | `F5` when paused |
| Debug Console | `Ctrl+Shift+Y` |
| Run Task | `Ctrl+Shift+B` |
| Run Task (custom) | `Ctrl+Shift+P` → "Run Task" |
| Format Document | `Alt+Shift+F` |
| Lint Fix | `Ctrl+K Ctrl+F` |

## 📁 Key Files

```
src/
├── App.tsx                    # Main app component
├── main.tsx                   # Entry point
├── pages/
│   ├── Dashboard.tsx          # Main dashboard
│   ├── Auth.tsx               # Authentication
│   └── Index.tsx              # Home page
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── MatchResults.tsx       # Results display
│   ├── RoadmapView.tsx        # Skills roadmap
│   └── SkillRadarChart.tsx    # Radar chart
├── hooks/
│   ├── useAuth.tsx            # Auth hook
│   └── use-toast.ts           # Toast notifications
└── integrations/
    └── supabase/              # Supabase client

.vscode/
├── launch.json                # Debug config
├── tasks.json                 # Tasks
└── settings.json              # Editor settings
```

## 🔍 Common Tasks

### Starting Development
```bash
npm run dev
# Opens http://localhost:8080
```

### With VS Code Debugging
1. Press `F5`
2. Select "Launch Chrome Dev Server"
3. Set breakpoints by clicking line numbers
4. Use Debug Console to inspect variables

### Building Production
```bash
npm run build
# Output in dist/ folder
```

### Running Tests
```bash
npm test                # Run once
npm run test:watch     # Continuous
```

## 🐛 Debugging Tips

1. **Set Breakpoint**: Click line number on left
2. **Watch Variables**: Right-click → "Add to Watch"
3. **Call Stack**: See function execution order
4. **Step Commands**:
   - F10: Step over (next line)
   - F11: Step into (function)
   - Shift+F11: Step out (return from function)

## 🎨 Styling

- **Framework**: Tailwind CSS
- **Components**: shadcn/ui
- **Theme**: Configured in `tailwind.config.ts`
- **Utilities**: `src/lib/utils.ts`

**Example className:**
```tsx
<div className="flex items-center gap-4 p-4 bg-slate-100 rounded-lg">
  Content here
</div>
```

## 📦 Project Files

- `package.json` - Dependencies & scripts
- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript settings
- `.env` - Environment variables
- `.vscode/` - VS Code configuration
- `supabase/` - Backend functions

## 🔧 Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 8080 in use | Kill process: `taskkill /PID <id> /F` |
| Changes not showing | Hard refresh: `Ctrl+Shift+R` |
| TypeScript errors | Check `tsconfig.json` |
| Import errors | Verify path aliases in `tsconfig.json` |
| Tests failing | Run `npm test:watch` to debug |

## 🌐 Environment URLs

- **Dev Server**: http://localhost:8080
- **Supabase**: https://mcugpjlmciojlmkhzprh.supabase.co
- **Debugger Port**: 9222

## 📚 Resources

- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [TypeScript Docs](https://www.typescriptlang.org)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [Supabase](https://supabase.com)

---

**Happy coding!** 🎉
