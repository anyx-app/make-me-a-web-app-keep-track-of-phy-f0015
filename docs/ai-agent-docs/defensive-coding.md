# Defensive Coding Guidelines - Prevent Runtime Errors

**Purpose**: Ensure generated projects never crash with undefined/null errors.

---

## 🚨 Common Error #1: "Cannot read properties of undefined (reading 'map')"

**This happens when you try to map over undefined/null data:**

```tsx
// ❌ WRONG - Will crash if features is undefined
{features.map(f => <div>{f.title}</div>)}

// ✅ CORRECT - Safe with fallback
{features?.map(f => <div>{f.title}</div>) || <p>No features</p>}

// ✅ BETTER - Default empty array
{(features || []).map(f => <div>{f.title}</div>)}
```

---

## 🚨 Common Error #2: React Error #130 - "Objects are not valid as a React child"

**This happens when you try to render an object instead of text/number:**

```tsx
// ❌ WRONG - Will crash with Error #130
const response = await anyx.llm({ prompt: userInput })
return <div>{response}</div>  // response is object { success, model, text, requestId }

// ✅ CORRECT - Extract text property first
const response = await anyx.llm({ prompt: userInput })
return <div>{response.text}</div>  // text is string

// ✅ BETTER - Store text in state
const [result, setResult] = useState('')
const response = await anyx.llm({ prompt: userInput })
setResult(response.text)  // Store string, not object
return <div>{result}</div>
```

**Common mistakes:**
```tsx
// ❌ Rendering API response directly
<div>{apiResponse}</div>

// ❌ Rendering date objects
<div>{new Date()}</div>

// ❌ Rendering entire objects
<div>{user}</div>

// ✅ Extract properties first
<div>{apiResponse.text}</div>
<div>{new Date().toLocaleDateString()}</div>
<div>{user.name}</div>
```

---

## ✅ Mandatory Safety Rules

### 1. **Always Use Optional Chaining for Arrays**

```tsx
// ❌ BAD
{items.map(item => ...)}

// ✅ GOOD
{items?.map(item => ...) ?? []}
{(items || []).map(item => ...)}
```

### 2. **Always Provide Default Values**

```tsx
// ❌ BAD
const [data, setData] = useState()

// ✅ GOOD
const [data, setData] = useState([])
const [user, setUser] = useState(null)
const [config, setConfig] = useState({})
```

### 3. **Always Check Before Mapping**

```tsx
// ✅ Pattern 1: Optional chaining with fallback
{data?.map(item => <Card key={item.id}>{item.title}</Card>) ?? (
  <p className="text-muted-foreground">No items found</p>
)}

// ✅ Pattern 2: Default empty array
{(data || []).map(item => <Card key={item.id}>{item.title}</Card>)}

// ✅ Pattern 3: Conditional rendering
{data && data.length > 0 ? (
  data.map(item => <Card key={item.id}>{item.title}</Card>)
) : (
  <p>No items</p>
)}
```

### 4. **Always Initialize Mock Data**

```tsx
// ❌ BAD - undefined by default
const features = getFeaturesFromSomewhere()

// ✅ GOOD - Always has a value
const features = [
  { id: 1, title: 'Feature 1', description: '...' },
  { id: 2, title: 'Feature 2', description: '...' },
]

// ✅ ALSO GOOD - Empty array as fallback
const features = getFeaturesFromSomewhere() || []
```

### 5. **Props Must Have Default Values**

```tsx
// ❌ BAD
function FeatureList({ features }) {
  return features.map(f => <div>{f.title}</div>)
}

// ✅ GOOD
function FeatureList({ features = [] }) {
  return features.map(f => <div>{f.title}</div>)
}

// ✅ BETTER
function FeatureList({ features = [] }) {
  if (features.length === 0) {
    return <p>No features available</p>
  }
  return features.map(f => <div key={f.id}>{f.title}</div>)
}
```

---

## 📋 Pre-Deployment Checklist

**Before creating PR, verify ALL of these:**

### Array Operations:
- [ ] Every `.map()` has optional chaining (`?.map()`) or default (`|| []`)
- [ ] Every `.filter()` has safety check
- [ ] Every `.find()` checks for undefined result
- [ ] Every array prop has default value (`= []`)

### State Initialization:
- [ ] All `useState` calls have initial values
- [ ] Array states initialize to `[]`, not `undefined`
- [ ] Object states initialize to `{}` or `null`
- [ ] Loading states are handled before rendering data

### Data Access:
- [ ] All nested object access uses optional chaining (`user?.profile?.name`)
- [ ] All array access checks length first
- [ ] API responses have error handling
- [ ] Async data has loading states

---

## 🎯 Common Patterns - Use These

### Pattern 1: Safe Feature List
```tsx
function FeatureSection({ features = [] }) {
  if (features.length === 0) {
    return (
      <section className="py-20 text-center">
        <p className="text-muted-foreground">No features to display</p>
      </section>
    )
  }

  return (
    <section className="py-20">
      <div className="grid md:grid-cols-3 gap-6">
        {features.map(feature => (
          <Card key={feature.id}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  )
}
```

### Pattern 2: Safe Data Display with Loading
```tsx
function DataDisplay() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData([/* mock data */])
      setLoading(false)
    }, 1000)
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (data.length === 0) {
    return <div>No data available</div>
  }

  return (
    <div>
      {data.map(item => (
        <div key={item.id}>{item.name}</div>
      ))}
    </div>
  )
}
```

### Pattern 3: Safe Recipe Usage
```tsx
import { BentoGrid } from '@/components/recipes/features'

function FeaturesSection() {
  // Always provide default data
  const items = [
    { title: 'Feature 1', description: 'Description 1', icon: '🚀' },
    { title: 'Feature 2', description: 'Description 2', icon: '⚡' },
    { title: 'Feature 3', description: 'Description 3', icon: '🎯' },
  ]

  // Recipe handles empty arrays gracefully
  return <BentoGrid items={items} />
}
```

---

## 🔧 Quick Fixes for Common Errors

### Error: "Cannot read properties of undefined (reading 'map')"

**Find**:
```tsx
{data.map(...)}
```

**Replace with**:
```tsx
{(data || []).map(...)}
```

### Error: "Cannot read properties of undefined (reading 'length')"

**Find**:
```tsx
if (items.length > 0)
```

**Replace with**:
```tsx
if (items && items.length > 0)
// or
if (items?.length > 0)
```

### Error: "Cannot destructure property 'X' of 'undefined'"

**Find**:
```tsx
const { name, email } = user
```

**Replace with**:
```tsx
const { name, email } = user || {}
// or
const name = user?.name
const email = user?.email
```

---

## 🎯 Testing Before PR

**Run these checks in your head (or actually test):**

1. **Refresh the page** - Does it load without errors?
2. **Open Console** - Are there any errors?
3. **Click around** - Do interactions work?
4. **Check empty states** - What if data is empty?

**If ANY of these fail, fix before PR!**

---

## 📚 TypeScript Tip

**Use TypeScript to catch these issues:**

```typescript
// ❌ BAD - No type safety
function FeatureList({ features }) {
  return features.map(f => <div>{f.title}</div>)
}

// ✅ GOOD - Type safety
interface Feature {
  id: number
  title: string
  description: string
}

function FeatureList({ features = [] }: { features?: Feature[] }) {
  return features.map(f => <div key={f.id}>{f.title}</div>)
}
```

---

## 🚨 MANDATORY: Never Ship Code That Can Crash

**Before creating PR, ask yourself:**
- "What if this data is undefined?"
- "What if this array is empty?"
- "What if this API fails?"
- "What if this prop isn't passed?"

**If you can't answer confidently, add safety checks!**

---

**Remember**: It's better to show "No data" than to crash with a white screen.