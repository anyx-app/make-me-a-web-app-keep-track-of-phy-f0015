# Core Development Guidelines

## ⛔ FORBIDDEN FILES (NEVER EDIT - CRITICAL!)

**IF YOU EDIT ANY OF THESE FILES, THE ENTIRE TASK FAILS. READ THIS LIST CAREFULLY.**

You MUST NOT change ANY of these files under ANY circumstances:
- `.eslintrc.cjs` ❌
- `.gitignore` ❌
- `package.json` ❌ (use `pnpm add <package>` instead)
- `pnpm-lock.yaml` ❌
- `tsconfig.json` ❌
- `tsconfig.node.json` ❌
- `vercel.json` ❌
- `vite.config.ts` ❌
- `anyx-logo.png` ❌
- `.github/` ❌ (any files in this directory)
- `index.html` ❌
- `tailwind.config.ts` ❌
- `postcss.config.js` ❌

**WHY THESE ARE FORBIDDEN:**
- These files control the build system, deployment, and project infrastructure
- Editing them breaks the deployment pipeline and CI/CD
- The boilerplate is carefully configured - changes cause build failures
- Microagent files are YOUR instructions - editing them corrupts guidance

**FOR DEPENDENCIES:**

**⚠️ CRITICAL: Always commit pnpm-lock.yaml after adding packages! ⚠️**

1. ✅ Run: `pnpm add <package-name>`
2. ✅ **IMMEDIATELY commit BOTH files:**
   ```bash
   git add package.json pnpm-lock.yaml
   git commit -m "feat: add <package-name> dependency"
   ```
3. ❌ NEVER manually edit `package.json`
4. ❌ NEVER run `pnpm add` without committing the lockfile

**Why this is critical:**
- Uncommitted `pnpm-lock.yaml` causes deployment failures
- Vercel uses `--frozen-lockfile` by default in CI
- Mismatched lockfile = "Cannot install with frozen-lockfile" error
- This blocks ALL deployments until fixed

**ONLY EDIT FILES IN:**
- ✅ `src/` directory (pages, components, hooks, utils, types, data)
- ✅ `supabase/migrations/*.sql` (if database is connected)
- ✅ `README.md` (project documentation)
- ✅ `repo.md` (project context - YOU MUST UPDATE THIS)

---

## 🚨 CRITICAL: Routing Setup (Fix Boilerplate Index)

**PROBLEM**: React shows boilerplate placeholder instead of your generated pages!

**ROOT CAUSE**: The boilerplate starts with NO routing by default. You must:
1. **Landing pages**: Replace `src/pages/Index.tsx` content directly
2. **Multi-page apps**: Add routing to `src/App.tsx`

---

### **Landing Pages** (Single Page):

✅ **Replace Index.tsx content** - NO routing needed

**What to do:**
```tsx
// src/pages/Index.tsx - REPLACE this entire file with your landing page
import { HeroGradient } from '@/components/recipes/heroes/HeroGradient'
import { Button } from '@/components/ui/button'

export default function Index() {
  return (
    <div className="min-h-screen">
      <nav className="p-4">
        {/* Your navigation */}
      </nav>
      <HeroGradient 
        title="Your Product Name"
        subtitle="Your compelling subtitle"
      />
      <section className="py-20">
        {/* Your features */}
      </section>
      <footer className="py-10">
        {/* Your footer */}
      </footer>
    </div>
  )
}
```

**Don't touch `App.tsx`** - it's already configured for single-page apps.

---

### **Dashboards/Multi-Page Apps**:

✅ **Add routing to App.tsx** - Import BrowserRouter and Routes

**Step 1: Update App.tsx**
```tsx
// src/App.tsx - Add routing imports and structure
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";  // ADD THIS
import { ThemeProvider } from "@/theme/ThemeProvider";
import Dashboard from "./pages/Dashboard";  // Your pages
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<div>404 Not Found</div>} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
```

**Step 2: Create your pages**
```tsx
// src/pages/Dashboard.tsx
import { DashboardLayout } from '@/components/recipes/dashboards/DashboardLayout'
import { StatGrid } from '@/components/recipes/dashboards/StatGrid'

export default function Dashboard() {
  return (
    <DashboardLayout>
      <StatGrid stats={[...]} />
      {/* ...rest of dashboard */}
    </DashboardLayout>
  )
}
```

### **⚠️ CRITICAL TESTS**:

**After building, test**:
1. Navigate to `/` → Should show YOUR page, NOT "Vite + React" boilerplate
2. No console errors
3. All components render

**If you see "Vite + React" text → Routing is broken! Fix it!**

---

## 🚨 CRITICAL: Defensive Coding (Prevent Crashes)

**MANDATORY: Read `defensive-coding.md` for complete patterns.**

**Every generated project MUST follow these rules to prevent runtime errors:**

### Rule 1: Safe Array Operations
```tsx
// ❌ WRONG - Will crash if features is undefined
{features.map(f => <div>{f.title}</div>)}

// ✅ CORRECT - Safe with fallback
{(features || []).map(f => <div>{f.title}</div>)}
{features?.map(f => <div>{f.title}</div>) ?? <p>No features</p>}
```

### Rule 2: Always Provide Default Values
```tsx
// ❌ WRONG
const [data, setData] = useState()

// ✅ CORRECT
const [data, setData] = useState([])
const [items, setItems] = useState<Item[]>([])
```

### Rule 3: Props Must Have Defaults
```tsx
// ❌ WRONG
function FeatureList({ features }) {
  return features.map(f => <div>{f.title}</div>)
}

// ✅ CORRECT
function FeatureList({ features = [] }) {
  return features.map(f => <div key={f.id}>{f.title}</div>)
}
```

### Rule 4: Use Optional Chaining
```tsx
// ❌ WRONG
const name = user.profile.name

// ✅ CORRECT
const name = user?.profile?.name
const name = user?.profile?.name || 'Anonymous'
```

**⚠️ BEFORE CREATING PR: Test that refreshing the page doesn't crash!**

**See defensive-coding.md for complete patterns and examples.**

## 🔒 CRITICAL: Environment Variables & Secrets Security

**⚠️ NEVER COMMIT SECRETS TO GIT! ⚠️**

### ❌ FORBIDDEN - DO NOT CREATE OR COMMIT:
- `.env` files with actual secrets
- `.env.local` files with credentials
- Any file containing `SUPABASE_SERVICE_ROLE_KEY`
- Any file containing actual API keys or passwords

### ✅ CORRECT APPROACH:

**For Supabase credentials:**
```typescript
// ✅ CORRECT - Use environment variables from Vercel
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```

**These values are:**
- ✅ Automatically provided by Vercel at build/runtime
- ✅ Set via Vercel dashboard (not in code)
- ✅ Never committed to Git
- ✅ Safe to use in frontend code

**If you need to document environment variables:**
```bash
# ✅ CORRECT - Create .env.example (no actual values)
VITE_SUPABASE_URL=your-project-url-here
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 🚨 SECURITY RULES:

1. **NEVER** create `.env` or `.env.local` files with real credentials
2. **ALWAYS** use `import.meta.env.VITE_*` for environment variables
3. **ONLY** create `.env.example` files with placeholder values
4. **CHECK** `.gitignore` includes `.env*` (already configured)
5. **USE** Vercel dashboard for setting actual environment variables

**Why this matters:**
- Committing secrets to Git exposes them permanently in history
- Anyone with repo access can steal credentials
- GitHub scanners will flag and revoke exposed secrets
- This is a critical security vulnerability

## Git Configuration

**MANDATORY**: Set git author for all commits:
```bash
git config user.name "Anyx Agent"
git config user.email "ai@anyx.app"
```

All commits MUST use: `--author="Anyx Agent <ai@anyx.app>"`

## Cost Efficiency & Token Optimization

Be cost-effective with token usage:

### Code Analysis
1. Use `grep -r` to locate files before viewing
2. Use `git log --oneline` instead of full history
3. Use `find` with specific patterns, not broad listings
4. Read specific line ranges, not entire files

### File Operations
1. Combine multiple edits in single operations
2. Use `sed` for global find-replace across files
3. Plan edits to minimize file access

### Development
1. Keep React components ≤50 lines when possible
2. Don't create more than 3 pages in initial versions
3. Focus on core features, avoid over-engineering
4. Only edit files inside `/src/` directory

## Quality Standards

**Before every commit:**
1. Run `pnpm lint` - must pass
2. Run `pnpm build` - must succeed
3. Update `repo.md` with changes
4. Update `README.md` if functionality changed

## Browser & Testing

- **Don't access browser** - focus on code
- **No browser tests** - rely on lint/build
- You're responsible for **frontend only** (no DevOps, server-side)

## When Stuck

After 3 failed attempts:
1. Document what you tried
2. Provide structured output with `task_status: "stuck"`
3. Don't be ashamed - ask for help early

