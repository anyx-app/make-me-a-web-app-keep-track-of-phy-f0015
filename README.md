# Anyx React Boilerplate

**Boilerplate Version: 1** | A starter template for building scalable multi-page React applications with modern patterns and best practices.

## 🚀 Features

- React 19.1.0 with hooks support
- React Router DOM v6.28.0 for client-side routing
- TypeScript with predefined types and interfaces
- Tailwind CSS with CSS variables and utility-first styling
- **UI Recipe Library** - Pre-built animated components (heroes, features, effects)
- **Framer Motion Integration** - Smooth animations and transitions
- **Production Stability** - Error boundaries, component guards, runtime validation
- Enhanced Design System with 20 theme presets (10 families × light/dark)
- Brand-Aware Components - 8 brand flavors for automatic styling
- 50+ reusable UI components (shadcn/ui + Radix UI primitives)
- Custom utility functions (`cn`, `formatDate`)
- Folder structure for pages, components, hooks, utils, types, and styles
- ESLint configured for TypeScript and React Hooks
- Vite for fast builds and HMR

## 📁 Folder Structure
```
anyx-react-boilerplate/
├── docs/                      # Documentation
│   ├── AI_DESIGN_GUIDE.md     # Design principles for AI agents
│   ├── AI_AGENT_VALIDATION.md # Backend validation rules for AI
│   ├── AI_AGENT_INSTRUCTIONS.md # AI agent control guide
│   ├── UI_PATTERNS.md         # Copy-paste UI patterns
│   ├── ROUTING.md             # Routing guide
│   ├── RECIPES.md             # UI recipe library docs
│   ├── DESIGN_SYSTEM.md       # Design system reference
│   ├── PRODUCTION_STABILITY.md # Production error prevention
│   ├── BRAND_FLAVORS.md       # Brand personality system
│   ├── HERO_SELECTION_GUIDE.md # Hero component guide
│   ├── DASHBOARD_LAYOUTS.md   # Dashboard layout system
│   └── CREATING_BRAND_AWARE_COMPONENTS.md # Component creation guide
├── public/                    # Static assets (e.g., index.html, images)
├── src/
│   ├── pages/                 # Route-based pages
│   │   ├── Home.tsx
│   │   ├── About.tsx
│   │   └── Contact.tsx
│   ├── components/
│   │   ├── ui/                # Core UI components & Radix UI primitives (Button.tsx, Input.tsx, Card.tsx, Dialog.tsx, Form.tsx, Label.tsx, Select.tsx, Textarea.tsx, Toast.tsx, plus 40+ additional UI primitives under this folder)
│   │   ├── layout/            # Layout components (Header, Navigation, Footer)
│   │   └── common/            # Common cross-cutting components
│   ├── hooks/                 # Custom React hooks
│   ├── utils/                 # Utility functions (cn, formatDate)
│   ├── types/                 # TypeScript definitions (User, ApiResponse)
│   ├── styles/                # Additional CSS or Tailwind layers
│   ├── App.tsx                # Root application with routing
│   ├── index.css              # Global styles and CSS variables
│   └── main.tsx               # App entry point
├── .eslintrc.cjs              # ESLint configuration
├── tailwind.config.ts         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
├── vite.config.ts             # Vite configuration
├── package.json               # Dependencies and scripts
└── README.md                  # This file
```

## 🧩 UI Components
We provide a self-contained set of core UI components under `src/components/ui`. These are built with Radix UI primitives, Tailwind CSS, and helper libraries.

Supported components:
- **Button**: Variants (`default`, `destructive`, `outline`, `ghost`, `link`) and sizes (`sm`, `default`, `lg`) via `class-variance-authority`.
- **Input** & **Textarea**: Styled form controls with focus, disabled, and placeholder states.
- **Card**: Container component with header, content, and footer parts for consistent layouts.
- **Dialog**: Modal dialogs with overlay, content, header/footer, title/description, and close triggers.
- **Form**: React Hook Form context provider for building form UIs.
- **Label**: Accessible labels with peer-disabled styling.
- **Select**: Headless select/dropdown using Radix primitives, customizable triggers and items.
- **Toast**: Global notification container using `react-hot-toast`.
- **Other Radix UI primitives** are also available under `@/components/ui`: Accordion, AlertDialog, Alert, AspectRatio, Avatar, Badge, Breadcrumb, Calendar, Carousel, Chart, Checkbox, Collapsible, Command, ContextMenu, DropdownMenu, HoverCard, Menubar, NavigationMenu, Pagination, Popover, Progress, RadioGroup, Resizable, ScrollArea, Separator, Sheet, Sidebar, Skeleton, Slider, Sonner, Switch, Table, Tabs, ToggleGroup, Toggle, Tooltip, useToast, Toaster.

Best practices:
1. Import components from `@/components/ui` to keep usage consistent.
2. Use the `cn` helper for composing or overriding styles: `<Button className="mt-4" />`.
3. For Radix-based components (`Dialog`, `Select`), wrap triggers with `asChild` to use custom elements.
4. Wrap form fields inside `<Form>` to enable React Hook Form features.
5. Leverage `variant` and `size` props where available for built-in styling options.
6. Customize theme tokens (`--radius`, colors) in `src/index.css` and `tailwind.config.ts` for branding.

## 🏁 Getting Started

1. **Clone the repository**

   ```bash
   git clone https://github.com/mkisilenko/anyx-react-boilerplate-webapp.git my-app
   cd my-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Build for production**

   ```bash
   npm run build
   ```

5. **Preview production build**

   ```bash
   npm run preview
   ```

## 🛡️ Production Stability

This boilerplate includes **critical** stability features to prevent common React errors in production:

### Error Boundary
All React errors are caught to prevent white screen of death:

```tsx
// Already installed in src/main.tsx
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

### Component Guards
Runtime validation prevents type errors:

```tsx
import { ensureArray, ensureString } from '@/lib/component-guards'

function MyComponent({ items, title }) {
  // Protect against non-arrays → prevents ".map is not a function"
  const safeItems = ensureArray(items)
  
  // Protect against non-strings → prevents Error #31
  const safeTitle = ensureString(title, 'Default Title')
  
  return (
    <div>
      <h2>{safeTitle}</h2>
      {safeItems.map(item => <div key={item.id}>{item.name}</div>)}
    </div>
  )
}
```

### Common Errors & Fixes

**Error #31: "Objects are not valid as React children"**
```tsx
// ❌ BAD - Passing object as child
<Button>{buttonConfig}</Button>

// ✅ GOOD - Extract string
<Button>{buttonConfig.label}</Button>
```

**TypeError: ".map is not a function"**
```tsx
// ❌ BAD - No array validation
items.map(item => ...)

// ✅ GOOD - Ensure array
(items || []).map(item => ...)
// or
ensureArray(items).map(item => ...)
```

**📖 See [Production Stability Guide](./docs/PRODUCTION_STABILITY.md) for complete prevention strategies.**

6. **Scaffold UI primitives**

   ```bash
   pnpm run scaffold:ui
   ```
   Regenerates stubs and re-exports for all UI primitives under `src/components/ui`.

## 📚 Documentation

Comprehensive guides are available in the `./docs/` directory:

### Core Guides
- **[Routing Guide](./docs/ROUTING.md)** - How to add pages, routes, and navigation
- **[Design System](./docs/DESIGN_SYSTEM.md)** - Theme customization, tokens, and architecture
- **[UI Recipes](./docs/RECIPES.md)** - Pre-built component patterns and examples
- **[Production Stability](./docs/PRODUCTION_STABILITY.md)** - ⚠️ **CRITICAL** - Prevent common production errors

### Brand & Design
- **[Brand Flavors](./docs/BRAND_FLAVORS.md)** - 8 brand personalities for automatic styling
- **[Hero Selection Guide](./docs/HERO_SELECTION_GUIDE.md)** - Choose the right hero component
- **[Dashboard Layouts](./docs/DASHBOARD_LAYOUTS.md)** - Dashboard with sidebar navigation
- **[Creating Brand-Aware Components](./docs/CREATING_BRAND_AWARE_COMPONENTS.md)** - Build adaptive components

### AI Agent Guides
- **[AI Design Guide](./docs/AI_DESIGN_GUIDE.md)** - Design principles for AI-generated UIs
- **[AI Agent Instructions](./docs/AI_AGENT_INSTRUCTIONS.md)** - Backend control for top-notch design
- **[AI Agent Validation](./docs/AI_AGENT_VALIDATION.md)** - Validation rules for AI code generation
- **[UI Patterns](./docs/UI_PATTERNS.md)** - Ready-to-use UI patterns and structures

## 🛣️ Adding Pages and Routes

The boilerplate starts minimal with just a homepage. When you're ready to add more pages:

**See [ROUTING.md](./docs/ROUTING.md)** for comprehensive guide including:
- How to create new pages
- Adding routes step-by-step
- Using pre-built pages (Auth, Dashboard, Themes, Recipes, Showcase)
- Protected routes with authentication
- Nested routes and layouts
- Navigation components
- Best practices and examples

**Quick example:**

```tsx
// 1. Create page: src/pages/About.tsx
export default function About() {
  return <div>About Page</div>
}

// 2. Add to App.tsx
import About from "./pages/About"
<Route path="/about" element={<About />} />

// 3. Navigate
import { Link } from 'react-router-dom'
<Link to="/about">About</Link>
```

## ⚙️ Customization

- **Add new pages**: Create files under `src/pages` and register routes in `src/App.tsx`.
- **UI Components**: Add reusable components in `src/components/ui` or common components in `src/components/common`.
- **Hooks**: Create custom hooks under `src/hooks`.
- **Utilities**: Add helper functions in `src/utils` and types in `src/types`.
- **Styling**: Customize CSS variables in `src/index.css` and extend Tailwind in `tailwind.config.ts`.

## 🤝 Contributing

Contributions welcome! Please open issues or pull requests. Keep code quality high and follow existing conventions.

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details. 

## 📦 Anyx Common API SDK

This boilerplate includes a thin, typed SDK for the Anyx Common API.

- Location: `src/sdk/anyx.ts` (exported via `src/sdk/index.ts`)
- Methods:
  - `llm({ model, messages })`
  - `image({ prompt, size? })`
  - `email({ to, subject, html })`
  - `sms({ to, body })`
- Behavior:
  - Sends requests to your backend at `VITE_ANYX_SERVER_URL` (which should attach `x-api-key`), and includes `x-project-id` from `VITE_PROJECT_ID`.
  - Maps errors to typed classes: `AuthError (401)`, `TierError (403)`, `CreditExceededError (402)`, `RateLimitedError (429)`, `ProviderError (5xx)`, `HttpError`.
  - Validates responses with `zod`.

### Environment

The SDK now works out of the box with a built‑in default server URL (`https://anyx.dev`). `.env` is optional.

If you want to override via env (Vite requires the `VITE_` prefix):

```env
VITE_ANYX_SERVER_URL=https://your-anyx-server.example.com
VITE_PROJECT_ID=<your-project-id>
```

You can also override at runtime:

```ts
import { createAnyxClient } from '@/sdk'

const anyx = createAnyxClient({
  baseUrl: 'https://your-anyx-server.example.com', // optional; defaults to https://anyx.dev
  projectId: '<your-project-id>',
})
```

### Usage examples

```ts
import { createAnyxClient, TierError, CreditExceededError } from '@/sdk'

const anyx = createAnyxClient() // reads VITE_ANYX_SERVER_URL and VITE_PROJECT_ID

// LLM
const llm = await anyx.llm({
  model: 'gpt-4.1-nano',
  messages: [{ role: 'user', content: 'Hello' }],
})

// Image (may throw TierError on lower tiers)
try {
  const img = await anyx.image({ prompt: 'a modern logo in blue', size: '1024x1024' })
} catch (e) {
  if (e instanceof TierError) {
    // handle upgrade CTA
  }
}

// Email / SMS (may throw CreditExceededError)
try {
  const email = await anyx.email({ to: 'user@example.com', subject: 'Welcome', html: '<b>Hello</b>' })
  const sms = await anyx.sms({ to: '+15555550123', body: 'Your code is 123456' })
} catch (e) {
  if (e instanceof CreditExceededError) {
    // handle out-of-credits
  }
}
```

### Integration tests (opt-in)

Integration tests live under `@tests/sdk/integration` and are disabled by default. They hit your configured server and may consume credits.

1) Ensure `.env` has:

```env
VITE_ANYX_SERVER_URL=https://your-anyx-server.example.com
VITE_PROJECT_ID=<your-project-id>
```

2) Run tests explicitly:

```bash
# PowerShell
$env:RUN_ANYX_INTEGRATION='true'; pnpm test

# POSIX
RUN_ANYX_INTEGRATION=true pnpm test
```

Note: `@tests` is gitignored by default. For CI, remove or adjust the ignore rule.

### Images API notes

OpenAI Images accepts the following sizes only: `1024x1024`, `1024x1536`, `1536x1024`, or `auto`.
Use one of these values for `size`. If a different size is sent, the backend should respond with a clear `400` and the allowed list. The SDK types reflect the allowed set.

### Configuration resolution

The SDK resolves configuration at runtime in this order:
- `process.env` (Node/SSR/tests)
- `import.meta.env` (Vite/browser)
- Built-in defaults (serverUrl falls back to `https://anyx.dev`)

You can always override by passing options to `createAnyxClient({ baseUrl, projectId })`.

### Security and headers

- Frontend SDK intentionally sends only `x-project-id`. It does NOT send `x-api-key`.
- Your backend proxy at `serverUrl` must attach `x-api-key` before forwarding to the Common API.
- Server/test contexts can include the key explicitly:

```ts
import { createAnyxClient } from '@/sdk'
const anyx = createAnyxClient({ apiKey: process.env.ANYX_COMMON_API_KEY })
```

### Troubleshooting

- Error: `Missing x-api-key or x-project-id`
  - Ensure `projectId` is set (env, config, or `createAnyxClient({ projectId })`).
  - Ensure your backend proxy injects `x-api-key` (browser should not send it).
  - For server/test usage only, pass `apiKey` to `createAnyxClient`.

- **INSERT/UPDATE/DELETE fails with 404 errors** (Pre-Nov 9, 2025 shared schema projects)
  - **Symptoms**: `PUT .../api/projects/[id]/update 404 Not Found`
  - **Cause**: Old SDK only supported SELECT queries
  - **Fix**: See `docs/MIGRATION_SHARED_SCHEMA_CRUD.md`

## 🎨 Enhanced Design System & Theming

This boilerplate includes a production-ready design system with comprehensive theming capabilities, multiple preset themes, and visual customization tools.

### Features

- **10 Theme Presets**: 5 theme families (Default, Ocean, Sunset, Professional, High-Contrast), each with light/dark variants
- **Comprehensive Design Tokens**: Colors, spacing, typography, shadows, transitions, and animations
- **Visual Theme Customizer**: Live editing and preview of theme colors
- **Theme Import/Export**: Share themes as JSON files
- **Full TypeScript Support**: Typed tokens and theme definitions
- **Zero Runtime Cost**: CSS variables with no JavaScript overhead
- **Backward Compatible**: Legacy `light`/`dark` themes still work

### Quick Start

```tsx
import { ThemeSelector } from '@/components/theme/ThemeSelector'
import { ThemeToggle } from '@/components/common/ThemeToggle'

function Header() {
  return (
    <header className="flex items-center justify-between p-4">
      <h1>My App</h1>
      <div className="flex gap-2">
        <ThemeToggle />      {/* Quick light/dark toggle */}
        <ThemeSelector />    {/* Full theme picker */}
      </div>
    </header>
  )
}
```

### Available Themes

**Default** - Clean, neutral theme  
**Ocean** - Calming blues and teals inspired by the sea  
**Sunset** - Warm oranges and purples for an energetic feel  
**Professional** - Corporate-friendly gray and blue palette  
**High-Contrast** - WCAG AAA compliant for maximum accessibility

Each theme has light and dark variants. Visit `/themes` to explore all themes with live previews.

### Architecture

```
src/
  design-system/
    tokens/
      primitives.ts      # Base values (colors, scales)
      semantic.ts        # Contextual token mappings
      component.ts       # Component-specific tokens
      types.ts           # TypeScript definitions
    themes/
      presets/           # 10 built-in themes
      theme-registry.ts  # Theme management
    utils/
      color-generator.ts # HSL manipulation utilities
  components/
    theme/
      ThemeSelector.tsx  # Theme picker dropdown
      ThemeCustomizer.tsx # Visual theme editor
  theme/
    ThemeProvider.tsx    # Theme context provider
```

### Using the Theme System

#### Basic Theme Switching

```tsx
import { useTheme } from '@/theme/ThemeProvider'

function ThemeSettings() {
  const { themeId, setTheme } = useTheme()
  
  return (
    <div>
      <p>Current: {themeId}</p>
      <button onClick={() => setTheme('ocean-dark')}>Ocean Dark</button>
      <button onClick={() => setTheme('sunset-light')}>Sunset Light</button>
    </div>
  )
}
```

#### Visual Theme Customizer

```tsx
import { ThemeCustomizer } from '@/components/theme/ThemeCustomizer'

function SettingsPage() {
  return <ThemeCustomizer /> // Full visual editor with export/import
}
```

#### Accessing Theme Data

```tsx
import { useTheme } from '@/theme/ThemeProvider'

function CustomComponent() {
  const { theme } = useTheme()
  
  console.log(theme?.metadata.name)        // "Ocean Dark"
  console.log(theme?.tokens.primary)       // "199 89% 55%"
  console.log(theme?.preview?.primary)     // Color preview value
  
  return <div>Using {theme?.metadata.name}</div>
}
```

### Design Tokens

#### Color Tokens
- `--background`, `--foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--secondary-foreground`
- `--muted`, `--muted-foreground`
- `--accent`, `--accent-foreground`
- `--destructive`, `--destructive-foreground`
- `--success`, `--success-foreground`
- `--warning`, `--warning-foreground`
- `--border`, `--input`, `--ring`

#### Spacing Scale
`--spacing-xs` (4px) through `--spacing-5xl` (128px)

#### Typography
`--font-size-xs` (12px) through `--font-size-5xl` (48px)  
`--font-weight-light` through `--font-weight-bold`  
`--line-height-tight`, `--line-height-normal`, etc.

#### Shadows & Effects
`--shadow-xs` through `--shadow-xl`  
`--transition-fast`, `--transition-base`, `--transition-slow`

### Custom Themes

#### Creating a Custom Theme

```tsx
import { registerTheme } from '@/design-system/themes/theme-registry'
import type { ThemePreset } from '@/design-system/themes/types'

const myTheme: ThemePreset = {
  metadata: {
    id: 'my-custom-theme',
    name: 'My Theme',
    description: 'A custom theme',
    category: 'light',
  },
  tokens: {
    background: '0 0% 100%',
    foreground: '0 0% 0%',
    primary: '220 100% 50%',
    primaryForeground: '0 0% 100%',
    // ... other required tokens
  },
}

registerTheme(myTheme)
```

#### Export/Import Themes

```tsx
import { exportTheme, importTheme } from '@/design-system/themes/theme-registry'

// Export current theme as JSON
const json = exportTheme('ocean-dark')
console.log(json)

// Import theme from JSON string
const theme = importTheme(jsonString)
if (theme) {
  console.log(`Imported: ${theme.metadata.name}`)
}
```

### Color Utilities

```tsx
import { generateColorScale, lighten, darken, complementary } from '@/design-system/utils/color-generator'

// Generate a full color scale from a base color
const scale = generateColorScale('220 100% 50%')
console.log(scale[500]) // Base color
console.log(scale[700]) // Darker variant

// Manipulate colors
const lighter = lighten('220 100% 50%', 10)
const darker = darken('220 100% 50%', 10)
const opposite = complementary('220 100% 50%')

// Check accessibility
import { meetsContrastRequirement } from '@/design-system/utils/color-generator'
const accessible = meetsContrastRequirement('0 0% 100%', '0 0% 0%', 'AA', 'normal')
```

### Routes

- `/themes` - Theme showcase and customizer page
- `/recipes` - UI recipe library showcase

---

## 🎨 UI Recipe Library

Pre-built, animated UI components powered by Framer Motion that enable rapid development of stunning interfaces.

### What's Included

**Hero Sections** (3 variants):
- `HeroGradient` - Animated aurora gradient with floating orbs
- `HeroSpotlight` - Split layout with spotlight effect
- `HeroMinimal` - Clean, minimal hero

**Feature Sections** (3 types):
- `BentoGrid` - Modern card grid with variable sizing
- `FeatureGrid` - Spotlight cards in responsive grid
- `FeatureShowcase` - Side-by-side feature presentation

**Interactive Effects**:
- `SpotlightCard` - Cursor-following spotlight
- `GlowingCard` - Hover glow effect
- `GradientBackground` - Animated gradient backgrounds

**Animation Presets**:
- Entrance animations (fade, slide, scale)
- Stagger animations for lists
- Hover effects (lift, scale, glow)
- Scroll-triggered animations
- Continuous animations (float, pulse, rotate)

### Quick Start

```tsx
import { HeroGradient, FeatureGrid, BentoGrid } from '@/components/recipes'

function LandingPage() {
  return (
    <>
      <HeroGradient
        title="Build Amazing Products"
        subtitle="The fastest way to ship beautiful applications"
        primaryCta="Start Free Trial"
      />
      
      <FeatureGrid
        features={[
          { title: 'Fast', description: 'Lightning fast', icon: '⚡' },
          { title: 'Secure', description: 'Bank-grade security', icon: '🔒' },
        ]}
        columns={3}
      />
    </>
  )
}
```

### Features

- **Stunning Animations**: All components include smooth Framer Motion animations
- **Responsive**: Mobile-first design that works on all screen sizes
- **Type-Safe**: Full TypeScript support with comprehensive types
- **Customizable**: Easy to adapt with className props and theme tokens
- **Performance**: Optimized with scroll-triggered animations

### Documentation

See [RECIPES.md](./docs/RECIPES.md) for complete documentation including:
- All available recipes with examples
- Animation preset usage
- Customization guide
- Best practices
- Tips for AI generation

### Demo

Visit `/recipes` to see all recipes in action with interactive examples and code snippets

### Files

- `src/design-system/` - Complete design system architecture
- `src/theme/ThemeProvider.tsx` - Theme context provider
- `src/components/theme/` - Theme UI components
- `src/index.css` - CSS variable definitions
- `src/pages/Themes.tsx` - Theme demo page

### Backward Compatibility

Legacy code using `theme='light'|'dark'` continues to work:

```tsx
// Still works!
const { theme, setTheme } = useTheme()
setTheme('light')  // Maps to 'default-light'
setTheme('dark')   // Maps to 'default-dark'
```

### Best Practices

1. **Use semantic tokens** (`--primary`, `--muted`) instead of hard-coded colors
2. **Test themes** using the `/themes` page before deploying
3. **Export custom themes** for version control and sharing
4. **Consider accessibility** - use High-Contrast themes as reference
5. **Leverage TypeScript** - import token types for autocomplete

### Migration from Basic Theming

No migration needed! The enhanced system is fully backward compatible. Start using new features incrementally:

1. Replace `<ThemeToggle />` with `<ThemeSelector />` for more options
2. Add `/themes` link to your navigation
3. Use new design tokens (`--spacing-md`, `--shadow-lg`) in custom styles
4. Create custom themes using the visual customizer

## 🔐 Supabase Integration (Auth + Guards)

This boilerplate includes optional Supabase auth with a drop-in UI and Google/GitHub OAuth.

### Environment

Add these to your `.env` (Vite requires the `VITE_` prefix):

```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

### Files

- `src/sdk/supabase.ts` – singleton Supabase client
- `src/auth/AuthProvider.tsx` – exposes `{ user, session, loading, signOut }`
- `src/auth/AuthGuard.tsx` – protects private routes
- `src/hooks/useAuth.ts` – convenience hook
- `src/pages/Auth.tsx` – drop-in auth UI (Google/GitHub)
- `src/pages/Dashboard.tsx` – example protected page
- `src/App.tsx` – provider wiring and routes

### Routes

- `/auth` – public authentication page
- `/dashboard` – example protected route

### Supabase Dashboard Setup

1. In Supabase → Authentication → URL Configuration:
   - Site URL: `http://localhost:5173` (and your prod domain)
   - Additional Redirect URLs: `http://localhost:5173`
2. In Authentication → Providers: enable Google and GitHub; paste Client ID/Secret.

### Usage

```tsx
import { useAuth } from '@/hooks/useAuth'

function Profile() {
  const { user, loading, signOut } = useAuth()
  if (loading) return null
  if (!user) return <a href="/auth">Sign in</a>
  return (
    <div>
      <p>{user.email}</p>
      <button onClick={signOut}>Sign out</button>
    </div>
  )
}
```

### Notes

- Expect a brief loading state on page load while the session is restored.
- If OAuth callbacks fail, verify Site/Redirect URLs and provider credentials.

## 🔄 Real-time Features (Supabase Realtime)

Built-in support for real-time broadcast/presence features using Supabase Realtime. Works for **all projects** (with or without database).

### How It Works

- **Projects with DB**: Uses your own Supabase instance
- **Projects without DB**: Uses centralized AnyX Realtime (auto-configured)
- **Same API**: No conditional logic needed

### Quick Start

```tsx
import { createProjectChannel } from '@/sdk'

function GameRoom() {
  useEffect(() => {
    // Create namespaced channel (auto-scoped to your project)
    const channel = createProjectChannel('poker-room-123')
    
    if (!channel) {
      console.error('Realtime not configured')
      return
    }

    // Listen for events
    channel
      .on('broadcast', { event: 'player-action' }, (payload) => {
        console.log('Player moved:', payload)
      })
      .subscribe()

    // Send events
    const sendAction = (action: string) => {
      channel.send({
        type: 'broadcast',
        event: 'player-action',
        payload: { action, timestamp: Date.now() }
      })
    }

    return () => {
      channel.unsubscribe()
    }
  }, [])

  return <div>Game Room</div>
}
```

### Use Cases

- **Multiplayer Games**: Real-time player actions, game state sync
- **Chat Applications**: Live messaging, typing indicators
- **Collaborative Tools**: Cursor tracking, live editing
- **Live Dashboards**: Real-time metrics, notifications
- **Presence**: Show who's online, active users

### Channel Naming

Channels are auto-namespaced to your project:
```
anyx:{project_id}:{room_name}
```

This ensures isolation when using centralized Realtime.

### Broadcast vs Presence

**Broadcast** (most common):
```tsx
channel.on('broadcast', { event: 'message' }, handler)
channel.send({ type: 'broadcast', event: 'message', payload })
```

**Presence** (track online users):
```tsx
channel.on('presence', { event: 'sync' }, () => {
  const state = channel.presenceState()
  console.log('Online users:', Object.keys(state))
})

channel.track({ user: 'alice', status: 'online' })
```

### Important

- No database required for Broadcast/Presence
- For Postgres Changes, you need a connected database
- Channels are scoped to your project automatically
- Use unique room names to avoid conflicts

### Files

- `src/sdk/realtime.ts` - Realtime utilities
- `src/sdk/supabase.ts` - Supabase client singleton

---

## 🔐 Dual-Mode Authentication

This boilerplate supports **two authentication modes** automatically:

### Mode 1: Native Supabase Auth (Dedicated Instances)
- Direct Supabase SDK calls
- Your own Supabase project
- Standard OAuth flow

### Mode 2: Backend Proxy Auth (Shared Schema Projects)
- Centralized authentication
- Multi-tenant isolation via namespaced emails
- OAuth support via backend proxy
- Auto-detected by `VITE_USE_BACKEND_AUTH` flag

### Usage

Import from `@/lib/auth` instead of using Supabase SDK directly:

```tsx
import { signUp, signIn, signInWithOAuth, signOut } from '@/lib/auth'

// Email/password signup
async function handleSignup(email: string, password: string) {
  try {
    const { user, session } = await signUp(email, password)
    console.log('User created:', user)
  } catch (error) {
    console.error('Signup failed:', error)
  }
}

// Email/password login
async function handleLogin(email: string, password: string) {
  try {
    const { user, session } = await signIn(email, password)
    console.log('Logged in:', user)
  } catch (error) {
    console.error('Login failed:', error)
  }
}

// OAuth (Google, GitHub, etc.)
async function handleOAuth(provider: 'google' | 'github') {
  await signInWithOAuth(provider, window.location.origin + '/auth/callback')
}

// Sign out
async function handleSignOut() {
  await signOut()
}
```

### How It Works

The auth lib automatically detects the mode based on environment variables:

**Dedicated Mode** (`VITE_USE_BACKEND_AUTH` not set or `false`):
```typescript
// Uses native Supabase SDK
return await supabase.auth.signUp({ email, password })
```

**Shared Schema Mode** (`VITE_USE_BACKEND_AUTH=true`):
```typescript
// Uses backend proxy API
const res = await fetch(`${BACKEND_URL}/api/projects/${PROJECT_ID}/auth/signup`, {
  method: 'POST',
  body: JSON.stringify({ email, password })
})
```

### Environment Variables

**Dedicated Mode:**
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

**Shared Schema Mode:**
```env
VITE_USE_BACKEND_AUTH=true
VITE_PROJECT_ID=your-project-uuid
VITE_SUPABASE_URL=https://centralized.supabase.co
VITE_SUPABASE_ANON_KEY=centralized-anon-key
VITE_ANYX_SERVER_URL=https://anyx.dev
```

### OAuth Callback

OAuth redirects are handled differently:

**Dedicated**: Supabase redirects directly to your app
**Shared**: Backend proxy handles the callback, then redirects with tokens

Add a callback route:

```tsx
// src/pages/AuthCallback.tsx
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'

export default function AuthCallback() {
  const navigate = useNavigate()
  
  useEffect(() => {
    // Extract tokens from URL (backend proxy flow)
    const params = new URLSearchParams(window.location.search)
    const accessToken = params.get('access_token')
    const refreshToken = params.get('refresh_token')
    
    if (accessToken && refreshToken) {
      // Set session manually (shared schema mode)
      supabase.auth.setSession({ access_token: accessToken, refresh_token: refreshToken })
        .then(() => navigate('/dashboard'))
    } else {
      // Native Supabase flow handles automatically
      navigate('/dashboard')
    }
  }, [navigate])
  
  return <div>Completing sign in...</div>
}
```

### Migration Guide

**Existing code using Supabase SDK:**

```tsx
// ❌ OLD (breaks in shared schema mode)
import { supabase } from '@/integrations/supabase/client'
await supabase.auth.signUp({ email, password })
```

```tsx
// ✅ NEW (works in both modes)
import { signUp } from '@/lib/auth'
await signUp(email, password)
```

### Files

- `src/lib/auth.ts` - Dual-mode auth library
- `src/integrations/supabase/client.ts` - Supabase client singleton
- `src/auth/AuthProvider.tsx` - Auth context (works with both modes)
- `src/pages/Auth.tsx` - Drop-in auth UI