# Production Stability Guide

This guide prevents the most common production errors and ensures stable deployments.

---

## 🚨 Common Production Errors

### Error #31: "Objects are not valid as React children"

**What it looks like:**
```
Minified React error #31
args[]=object%20with%20keys%20%7Blabel%2C%20variant%2C%20onClick%7D
```

**Root cause:** Passing an object where a string or component is expected.

**Common mistakes:**

```tsx
// ❌ BAD - Passing object as children
<Button>{buttonConfig}</Button>  // buttonConfig = { label: "Click", variant: "primary" }

// ✅ GOOD - Pass string
<Button>{buttonConfig.label}</Button>

// ❌ BAD - Passing object as title
<StatCard title={cardData} />  // cardData = { title: "Revenue", value: "$1000" }

// ✅ GOOD - Extract string
<StatCard title={cardData.title} />
```

**Fix:** Always pass primitives (strings, numbers) or React elements, never plain objects.

---

### TypeError: ".map is not a function"

**What it looks like:**
```
Uncaught TypeError: a.map is not a function
```

**Root cause:** Passing a non-array to a component that calls `.map()`.

**Common mistakes:**

```tsx
// ❌ BAD - Passing single object instead of array
<StatGrid stats={statsObject} />  // statsObject = { revenue: 100 }

// ✅ GOOD - Pass array
<StatGrid stats={[statsObject]} />

// ❌ BAD - Undefined/null
<DataTable data={undefined} />

// ✅ GOOD - Provide empty array default
<DataTable data={data || []} />
```

**Fix:** Always ensure array props are actual arrays.

---

## 🛡️ Stability Tools

### 1. Component Guards

Use runtime validators to catch errors early:

```tsx
import { ensureArray, ensureString, validateMapItems } from '@/lib/component-guards'

function MyComponent({ items, title }: Props) {
  // Protect against non-arrays
  const safeItems = ensureArray(items)
  
  // Protect against non-strings
  const safeTitle = ensureString(title, 'Default Title')
  
  // Validate before mapping
  const validatedItems = validateMapItems(items, 'MyComponent')
  
  return (
    <div>
      <h2>{safeTitle}</h2>
      {validatedItems.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

### 2. Error Boundary

Wrap your app to prevent white screen of death:

```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary
      onError={(error, errorInfo) => {
        // Send to error tracking
        console.error('App error:', error, errorInfo)
      }}
    >
      <YourApp />
    </ErrorBoundary>
  )
}
```

### 3. Prop Validation

Validate required props in development:

```tsx
import { validateProps } from '@/lib/component-guards'

function MyComponent(props: MyComponentProps) {
  // Validates in development, silent in production
  validateProps(props, ['title', 'items'], 'MyComponent')
  
  return <div>...</div>
}
```

---

## ✅ Pre-Deployment Checklist

Before deploying, verify:

### Required
- [ ] No linter errors (`pnpm lint`)
- [ ] Build succeeds (`pnpm build`)
- [ ] No console errors in dev mode
- [ ] ErrorBoundary is installed
- [ ] Critical components use guards

### Recommended
- [ ] Test with production build locally (`pnpm preview`)
- [ ] Check bundle size (should be < 500kb)
- [ ] Test on slow network (throttle in DevTools)
- [ ] Verify mobile responsiveness
- [ ] Check accessibility (Lighthouse)

### Critical Validations
- [ ] All `.map()` calls are on arrays
- [ ] No objects passed as React children
- [ ] All required props are provided
- [ ] No hardcoded JSX in default parameters
- [ ] No async functions in render

---

## 🔧 Fixing Deployed Projects

If a project is already broken in production:

### Step 1: Identify the Error

Check browser console for:
- Error #31 → Object as child issue
- `.map is not a function` → Non-array issue
- Other errors → See error boundary

### Step 2: Quick Fixes

**For Error #31:**
```tsx
// Find the component mentioned in error stack
// Look for props that might be objects

// Before
<Component title={data} />

// After
<Component title={data?.title || 'Default'} />
```

**For .map errors:**
```tsx
// Find the .map() call in error stack

// Before
items.map(...)

// After
(items || []).map(...)
// or
Array.isArray(items) ? items.map(...) : null
```

### Step 3: Add Guards

```tsx
import { ensureArray, ensureString } from '@/lib/component-guards'

// Wrap all risky data
const safeItems = ensureArray(props.items)
const safeTitle = ensureString(props.title)
```

### Step 4: Rebuild and Deploy

```bash
pnpm lint
pnpm build
# Deploy dist/ folder
```

---

## 🎯 AI Agent Guidelines

To prevent AI from generating broken code:

### Update AI System Prompt

Add this to your AI agent's instructions:

```markdown
CRITICAL RULES - Production Stability:

1. NEVER pass objects as React children
   ❌ <div>{userObject}</div>
   ✅ <div>{userObject.name}</div>

2. ALWAYS ensure arrays before .map()
   ❌ items.map(...)
   ✅ (items || []).map(...)

3. ALWAYS extract values from objects for props
   ❌ <Card title={cardData} />
   ✅ <Card title={cardData.title} />

4. NEVER use JSX as default parameters
   ❌ function Comp({ icon = <Icon /> }) {}
   ✅ function Comp({ icon }) { return icon || <Icon /> }

5. ALWAYS use component guards for risky props
   import { ensureArray, ensureString } from '@/lib/component-guards'
```

### Validation Rules

Add to backend validation:

```typescript
// Backend validation before returning code
function validateGeneratedCode(code: string): ValidationResult {
  const errors: string[] = []
  
  // Check for object children
  if (code.match(/<\w+>\{[\w.]+\}</)) {
    errors.push('Potential object as child detected')
  }
  
  // Check for .map without array check
  if (code.match(/\w+\.map\(/) && !code.includes('Array.isArray')) {
    errors.push('.map() used without array validation')
  }
  
  // Check for JSX default params
  if (code.match(/= <[A-Z]/)) {
    errors.push('JSX used as default parameter')
  }
  
  return { valid: errors.length === 0, errors }
}
```

---

## 📊 Monitoring & Prevention

### Development Checks

```tsx
// Add to your dev environment
if (process.env.NODE_ENV === 'development') {
  // Warn about common mistakes
  const originalError = console.error
  console.error = (...args) => {
    if (args[0]?.includes?.('Objects are not valid')) {
      console.warn('⚠️ STABILITY: Detected object as React child. Fix before production!')
    }
    originalError(...args)
  }
}
```

### Production Monitoring

```tsx
// Add error tracking
window.addEventListener('error', (event) => {
  // Send to analytics
  if (event.message.includes('Minified React error')) {
    analytics.track('production_error', {
      error: event.message,
      stack: event.error?.stack,
    })
  }
})
```

---

## 🚀 Migration Guide

### For Existing Projects

1. **Install Error Boundary**
   ```tsx
   // src/main.tsx
   import { ErrorBoundary } from '@/components/ErrorBoundary'
   
   <ErrorBoundary>
     <App />
   </ErrorBoundary>
   ```

2. **Add Component Guards**
   ```bash
   # Copy src/lib/component-guards.ts to your project
   ```

3. **Audit Risky Components**
   ```tsx
   // Find all .map() calls
   // Add: Array.isArray(items) ? items.map(...) : null
   
   // Find all object props
   // Extract: obj.property instead of obj
   ```

4. **Test Thoroughly**
   ```bash
   pnpm build
   pnpm preview
   # Test all pages
   ```

---

## ✅ Summary

**To prevent production errors:**

1. ✅ Use `ErrorBoundary` wrapper
2. ✅ Import `component-guards` for validation
3. ✅ Never pass objects as React children
4. ✅ Always validate arrays before `.map()`
5. ✅ Test with production build before deploying
6. ✅ Update AI agent system prompts with rules
7. ✅ Add validation to your backend
8. ✅ Monitor production errors

**Result:** Stable, production-ready applications that don't break! 🎉

