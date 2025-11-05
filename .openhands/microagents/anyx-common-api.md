# Anyx Common API - Quick Reference

**CRITICAL**: All env vars are already configured. Just import and use!

## Setup (Already Done)

```typescript
import { createAnyxClient } from '@/sdk'
const anyx = createAnyxClient() // Auto-reads VITE_ANYX_SERVER_URL and VITE_PROJECT_ID
```

## LLM (Text Generation)

### Request
```typescript
const response = await anyx.llm({
  model: 'gpt-4.1-nano', // Optional: defaults to gpt-4.1-nano
  messages: [
    { role: 'user', content: 'Explain React hooks in 3 sentences' }
  ]
})
```

### Response
```typescript
// Access the text response via .text property
console.log(response.text)      // "React hooks are functions that..."
console.log(response.model)     // "gpt-4.1-nano"
console.log(response.requestId) // "abc123-request-id"
```

### ⚠️ CRITICAL: Always Access `.text`
```typescript
// ✅ CORRECT
const answer = response.text

// ❌ WRONG - These don't exist!
const answer = response.content  // undefined
const answer = response.message  // undefined
const answer = response.data     // undefined
```

## Vision (Image Analysis)

### Request
```typescript
const visionResponse = await anyx.vision({
  prompt: 'What objects are in this image?',
  images: ['https://example.com/photo.jpg'], // or base64 data URIs
  model: 'gpt-4o-mini' // Optional: defaults to gpt-4o-mini
})
```

### Response
```typescript
console.log(visionResponse.text)             // "I see a cat sitting on a couch..."
console.log(visionResponse.imagesProcessed)  // 1
```

## Image Generation

### Request
```typescript
const img = await anyx.image({
  prompt: 'A futuristic city at sunset',
  size: '1024x1024' // Optional: '1024x1024', '1024x1536', '1536x1024'
})
```

### Response
```typescript
console.log(img.image) // Image URL or base64 data
// Use in JSX: <img src={img.image.url} alt="Generated" />
```

## Email

### Request
```typescript
const email = await anyx.email({
  to: 'user@example.com',
  subject: 'Welcome to our app',
  html: '<h1>Welcome!</h1><p>Thanks for joining.</p>'
})
```

### Response
```typescript
console.log(email.id) // Email ID from provider (for tracking)
```

## SMS

### Request
```typescript
const sms = await anyx.sms({
  to: '+15555550123', // E.164 format
  body: 'Your verification code is 123456'
})
```

### Response
```typescript
console.log(sms.sid) // SMS ID from provider (for tracking)
```

## Error Handling

```typescript
import { TierError, CreditExceededError, AuthError } from '@/sdk'

try {
  const response = await anyx.llm({ messages: [...] })
  setAnswer(response.text) // ✅ Always use .text
} catch (error) {
  if (error instanceof TierError) {
    // User's tier doesn't allow this feature/model
    showUpgradePrompt()
  } else if (error instanceof CreditExceededError) {
    // User ran out of credits
    showOutOfCreditsMessage()
  } else if (error instanceof AuthError) {
    // Invalid API key (shouldn't happen in production)
    console.error('Auth error:', error)
  } else {
    // Generic error
    showErrorMessage('Sorry, something went wrong. Please try again.')
  }
}
```

## Common Patterns

### Chat Interface
```typescript
const [messages, setMessages] = useState([])
const [input, setInput] = useState('')

const handleSend = async () => {
  const userMessage = { role: 'user', content: input }
  setMessages([...messages, userMessage])
  
  try {
    const response = await anyx.llm({
      model: 'gpt-4.1-nano',
      messages: [...messages, userMessage]
    })
    
    // ✅ CRITICAL: Use response.text
    setMessages(prev => [...prev, { role: 'assistant', content: response.text }])
  } catch (error) {
    console.error('LLM error:', error)
    showErrorToast('Failed to get response')
  }
  
  setInput('')
}
```

### Image Generator with Loading State
```typescript
const [isGenerating, setIsGenerating] = useState(false)
const [imageUrl, setImageUrl] = useState(null)

const generateImage = async (prompt: string) => {
  setIsGenerating(true)
  try {
    const img = await anyx.image({ prompt })
    setImageUrl(img.image.url) // Access .image property
  } catch (error) {
    if (error instanceof TierError) {
      showUpgradeModal('Image generation requires Starter tier or higher')
    } else {
      showErrorToast('Failed to generate image')
    }
  } finally {
    setIsGenerating(false)
  }
}
```

## Available Models by Tier

- **Free**: gpt-4.1-nano
- **Starter**: gpt-4.1-nano, gpt-4o-mini
- **Pro**: gpt-4.1-nano, gpt-4o-mini, gpt-4o
- **Enterprise**: All models

Backend enforces tier limits automatically. Invalid models fallback to tier's default.

## Credits

- **LLM**: 1 AI credit per call
- **Vision**: 5 AI credits per call
- **Image**: 3 AI credits per generation
- **Email**: 1 integration credit per email
- **SMS**: 1 integration credit per SMS

Credits reset monthly based on subscription tier.

## Testing

```typescript
// Integration tests hit your real server (consumes credits)
// Located in: @tests/sdk/integration/

// Run explicitly:
npm run test:integration
```

## Debugging

```typescript
// All responses include requestId for tracking
const response = await anyx.llm({ ... })
console.log('Request ID:', response.requestId) // Use for support tickets
```

## ⚠️ Common Mistakes

```typescript
// ❌ WRONG - Missing .text
const answer = await anyx.llm({ messages: [...] })
return <p>{answer}</p> // This will fail!

// ✅ CORRECT
const response = await anyx.llm({ messages: [...] })
return <p>{response.text}</p> // Always use .text

// ❌ WRONG - Using 'content' or 'message'
const text = response.content // undefined!
const text = response.message // undefined!

// ✅ CORRECT - Always use 'text'
const text = response.text

// ❌ WRONG - Incorrect parameter names
await anyx.llm({ input: '...' }) // 'input' doesn't exist!
await anyx.llm({ prompt: '...' }) // 'prompt' doesn't exist for llm()!

// ✅ CORRECT - Use 'messages' array
await anyx.llm({ messages: [{ role: 'user', content: '...' }] })
```

---

**Summary**: Always access **`response.text`** for LLM/Vision responses. Never use `.content` or `.message`.

