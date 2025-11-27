# Adding Pages and Routes

This boilerplate is intentionally minimal with just a homepage. Here's how to add more pages and routes when you need them.

## Quick Start

### 1. Create a New Page

Create a new file in `src/pages/`:

```tsx
// src/pages/About.tsx
export default function About() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold">About Page</h1>
    </div>
  )
}
```

### 2. Add the Route

Update `src/App.tsx`:

```tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import About from "./pages/About";  // Import your new page

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/about" element={<About />} />  {/* Add route */}
            <Route path="*" element={<Index />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);
```

### 3. Navigate to Your Page

Use React Router's navigation:

```tsx
import { useNavigate } from 'react-router-dom'

function MyComponent() {
  const navigate = useNavigate()
  
  return (
    <button onClick={() => navigate('/about')}>
      Go to About
    </button>
  )
}
```

Or use Link component:

```tsx
import { Link } from 'react-router-dom'

function MyComponent() {
  return (
    <Link to="/about">About</Link>
  )
}
```

---

## Common Patterns

### Basic Page with Layout

```tsx
// src/pages/Contact.tsx
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function Contact() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border p-4">
        <h1 className="text-2xl font-bold">Contact Us</h1>
      </header>
      
      <main className="max-w-4xl mx-auto p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-3xl mb-4">Get in Touch</h2>
          <p className="text-muted-foreground mb-8">
            We'd love to hear from you.
          </p>
          <Button>Send Message</Button>
        </motion.div>
      </main>
    </div>
  )
}
```

---

## Pre-Built Pages Available

Your boilerplate includes these pages (currently not routed):

### 1. **Auth Page** - `/auth`
Login/signup with Supabase or basic form

```tsx
import AuthPage from "@/pages/Auth";
<Route path="/auth" element={<AuthPage />} />
```

### 2. **Dashboard** - `/dashboard`
Protected route example

```tsx
import Dashboard from "@/pages/Dashboard";
import { AuthGuard } from "@/auth/AuthGuard";
import { AuthProvider } from "@/auth/AuthProvider";

// Wrap App in AuthProvider first
<AuthProvider>
  <Routes>
    <Route path="/dashboard" element={
      <AuthGuard>
        <Dashboard />
      </AuthGuard>
    } />
  </Routes>
</AuthProvider>
```

### 3. **Themes** - `/themes`
Theme showcase and customizer

```tsx
import Themes from "@/pages/Themes";
<Route path="/themes" element={<Themes />} />
```

### 4. **Recipes** - `/recipes`
UI component recipes showcase

```tsx
import Recipes from "@/pages/Recipes";
<Route path="/recipes" element={<Recipes />} />
```

### 5. **Showcase** - `/showcase`
Full animated demo page

```tsx
import Showcase from "@/pages/Showcase";
<Route path="/showcase" element={<Showcase />} />
```

### 6. **Not Found** - `404`
Custom 404 page

```tsx
import NotFound from "@/pages/NotFound";
<Route path="*" element={<NotFound />} />
```

---

## Complete Example: Adding Multiple Pages

```tsx
// src/App.tsx
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/theme/ThemeProvider";
import { AuthProvider } from "@/auth/AuthProvider";
import { AuthGuard } from "@/auth/AuthGuard";

// Import pages
import Index from "./pages/Index";
import About from "./pages/About";
import AuthPage from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Themes from "./pages/Themes";
import Recipes from "./pages/Recipes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/themes" element={<Themes />} />
              <Route path="/recipes" element={<Recipes />} />
              
              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <AuthGuard>
                    <Dashboard />
                  </AuthGuard>
                }
              />
              
              {/* 404 catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
```

---

## Advanced Patterns

### Nested Routes

```tsx
// src/pages/Blog.tsx (parent)
import { Outlet } from 'react-router-dom'

export default function Blog() {
  return (
    <div>
      <header>Blog Header</header>
      <Outlet /> {/* Child routes render here */}
    </div>
  )
}

// src/pages/BlogPost.tsx (child)
export default function BlogPost() {
  return <article>Post content</article>
}

// App.tsx
<Route path="/blog" element={<Blog />}>
  <Route index element={<div>Blog Home</div>} />
  <Route path=":postId" element={<BlogPost />} />
</Route>
```

### Route Parameters

```tsx
// src/pages/User.tsx
import { useParams } from 'react-router-dom'

export default function User() {
  const { userId } = useParams()
  return <div>User ID: {userId}</div>
}

// App.tsx
<Route path="/user/:userId" element={<User />} />
```

### Layout Wrapper

```tsx
// src/components/Layout.tsx
import { Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div>
      <nav>Navigation</nav>
      <main>
        <Outlet />
      </main>
      <footer>Footer</footer>
    </div>
  )
}

// App.tsx
<Route element={<Layout />}>
  <Route path="/" element={<Index />} />
  <Route path="/about" element={<About />} />
</Route>
```

### Lazy Loading

```tsx
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./pages/Dashboard'))

<Route
  path="/dashboard"
  element={
    <Suspense fallback={<div>Loading...</div>}>
      <Dashboard />
    </Suspense>
  }
/>
```

### Programmatic Navigation

```tsx
import { useNavigate, useLocation } from 'react-router-dom'

function MyComponent() {
  const navigate = useNavigate()
  const location = useLocation()
  
  const handleClick = () => {
    // Navigate to route
    navigate('/about')
    
    // Navigate with state
    navigate('/about', { state: { from: 'homepage' } })
    
    // Go back
    navigate(-1)
    
    // Replace current entry
    navigate('/about', { replace: true })
  }
  
  return <button onClick={handleClick}>Navigate</button>
}
```

### Protected Routes Pattern

```tsx
// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()
  
  if (loading) return <div>Loading...</div>
  
  if (!user) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }
  
  return <>{children}</>
}

// Usage in App.tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

---

## Navigation Components

### Simple Nav Bar

```tsx
// src/components/Navbar.tsx
import { Link } from 'react-router-dom'

export function Navbar() {
  return (
    <nav className="border-b border-border">
      <div className="max-w-7xl mx-auto px-4 py-4 flex gap-6">
        <Link to="/" className="font-bold">Home</Link>
        <Link to="/about" className="hover:text-primary">About</Link>
        <Link to="/recipes" className="hover:text-primary">Recipes</Link>
        <Link to="/themes" className="hover:text-primary">Themes</Link>
      </div>
    </nav>
  )
}
```

### Active Link Styling

```tsx
import { NavLink } from 'react-router-dom'

<NavLink
  to="/about"
  className={({ isActive }) =>
    isActive ? 'text-primary font-bold' : 'text-muted-foreground'
  }
>
  About
</NavLink>
```

---

## Best Practices

1. **Keep Routes Organized**: Group related routes together
2. **Use Lazy Loading**: For large pages to improve initial load time
3. **Implement 404 Page**: Always have a catch-all route at the end
4. **Consistent Layout**: Use layout components for shared UI
5. **SEO Friendly**: Use meaningful paths like `/about` not `/page1`
6. **Type Safety**: Define route types for TypeScript autocomplete

---

## Testing Navigation

```tsx
import { MemoryRouter } from 'react-router-dom'
import { render } from '@testing-library/react'

test('navigates to about page', () => {
  render(
    <MemoryRouter initialEntries={['/about']}>
      <App />
    </MemoryRouter>
  )
  // assertions...
})
```

---

## Quick Reference

| Task | Code |
|------|------|
| Create page | `src/pages/MyPage.tsx` |
| Add route | `<Route path="/my-page" element={<MyPage />} />` |
| Link to page | `<Link to="/my-page">Go</Link>` |
| Navigate programmatically | `navigate('/my-page')` |
| Get URL params | `const { id } = useParams()` |
| Get query params | `const [search] = useSearchParams()` |
| Current location | `const location = useLocation()` |
| Protect route | Wrap in `<AuthGuard>` or `<ProtectedRoute>` |

---

## Need Help?

- [React Router Docs](https://reactrouter.com/)
- Check existing pages in `src/pages/` for examples
- Use recipe components from `src/components/recipes/` for quick layouts

---

**Pro Tip**: Start simple with just the routes you need. You can always add more later!

