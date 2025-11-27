---
name: anyx-common-api
agent: anyx-ai
triggers:
  - anyx
  - api
  - llm
  - image
  - email
  - sms
  - common-api
---

# Anyx Common API SDK

Your project includes the **Anyx Common API** for server-side capabilities: LLM, image generation, email, and SMS. Access is tier-gated, usage is logged, and credits are managed automatically.

## Quick Reference

**SDK Location**: `src/sdk/anyx.ts` (exported via `src/sdk/index.ts`)

**Methods:**
- `llm({ model, messages })` - Chat completions
- `vision({ prompt, images, model? })` - Vision API (image analysis)
- `image({ prompt, size? })` - Image generation
- `email({ to, subject, html })` - Email sending
- `sms({ to, body })` - SMS sending

**Environment Variables** (auto-configured):
```env
VITE_ANYX_COMMON_API_KEY=<auto-filled>
VITE_ANYX_SERVER_URL=<auto-filled from NEXT_PUBLIC_API_URL>
VITE_PROJECT_ID=<auto-filled project id>
```

## API Endpoints (Server-Side)

All requests go through your backend, which attaches API keys:

- `POST /api/common/llm` - LLM completions
- `POST /api/common/llm/vision` - Vision API (image analysis)
- `POST /api/common/image` - Image generation
- `POST /api/common/email` - Email sending
- `POST /api/common/sms` - SMS sending

## Tier Rules & Credits

### AI Credits (LLM & Image)

**Models by Tier:**
- **free**: `gpt-4.1-nano`
- **starter**: + `gpt-4o-mini`
- **builder**: + `gpt-5-mini`
- **pro/elite**: + `gpt-5`

**Image Generation:**
- Only available for: `builder`, `pro`, `elite`

**Costs:**
- LLM call = **1 aiCredit**
- Image generation = **3 aiCredits**

### Vision Credits (Separate Pool)

**Models by Tier:**
- **free**: ❌ Not available
- **starter**: `gpt-4o-mini` only
- **builder**: + `gpt-4o`
- **pro/elite**: + `gpt-4o`

**Vision Credit Limits:**
| Tier    | Credits/Period |
|---------|----------------|
| Free    | 0              |
| Starter | 10             |
| Builder | 30             |
| Pro     | 100            |
| Elite   | 300            |

**Cost:**
- Vision call = **5 visionCredits**

### Integration Credits (Email & SMS)

- Email = **1 integrationCredit**
- SMS = **1 integrationCredit**

Credits are evaluated within the active subscription period (`subscriptions.current_period_start/end`).

## Usage Examples

### Basic Setup

```typescript
import { createAnyxClient } from '@/sdk'

// Uses environment variables (VITE_ANYX_SERVER_URL, VITE_PROJECT_ID)
const anyx = createAnyxClient()

// Or override manually:
const anyx = createAnyxClient({
  baseUrl: 'https://anyx.app',
  projectId: 'your-project-id'
})
```

### LLM Completions

```typescript
import { createAnyxClient } from '@/sdk'

const anyx = createAnyxClient()

// Simple completion (defaults to gpt-4.1-nano)
const response = await anyx.llm({
  model: 'gpt-4.1-nano',
  messages: [
    { role: 'user', content: 'Write a tagline for a fitness app' }
  ]
})

console.log(response.text)  // API returns { success, model, text }

// With system prompt and multiple messages
const response = await anyx.llm({
  model: 'gpt-4o-mini',  // Requires starter tier or higher
  messages: [
    { role: 'system', content: 'You are a helpful programming assistant.' },
    { role: 'user', content: 'Explain React hooks in simple terms' }
  ]
})

console.log(response.text)  // Access .text property for AI response
```

### Vision API (Image Analysis)

```typescript
import { createAnyxClient, TierError, CreditExceededError } from '@/sdk'

const anyx = createAnyxClient()

try {
  // Analyze images with AI
  const response = await anyx.vision({
    prompt: 'What products are in this image?',
    images: [
      'https://example.com/photo.jpg',
      'data:image/jpeg;base64,/9j/4AAQSkZJRg...'
    ],
    model: 'gpt-4o-mini'  // Optional, defaults to gpt-4o-mini
  })
  
  console.log('Analysis:', response.text)
  console.log('Images processed:', response.imagesProcessed)
  
} catch (error) {
  if (error instanceof TierError) {
    // Free tier doesn't have vision access
    console.error('Vision API requires starter tier or higher')
    // Show upgrade CTA
  } else if (error instanceof CreditExceededError) {
    // Out of vision credits
    console.error('Out of vision credits. Upgrade or wait for next period.')
  }
}
```

**Available Models:**
- `gpt-4o-mini` (default, starter+ tier)
- `gpt-4o` (builder+ tier, more accurate)

**Supported Image Formats:**
- URLs: Direct image links
- Base64: `data:image/jpeg;base64,...`
- Multiple images: Up to 10 images per request

**Use Cases:**
- Product catalog analysis
- Receipt/document scanning
- Image moderation
- Visual search
- Accessibility (image descriptions)

### Image Generation

```typescript
import { createAnyxClient, TierError } from '@/sdk'

const anyx = createAnyxClient()

try {
  const image = await anyx.image({
    prompt: 'A modern logo with blue gradient',
    size: '1024x1024'  // Options: 1024x1024, 1024x1536, 1536x1024, auto
  })
  
  console.log('Image URL:', image.url)
  console.log('Revised prompt:', image.revised_prompt)
  
} catch (error) {
  if (error instanceof TierError) {
    // User's tier doesn't allow image generation
    console.error('Upgrade to builder tier to generate images')
    // Show upgrade CTA in UI
  }
}
```

**Allowed Image Sizes:**
- `1024x1024` (square)
- `1024x1536` (portrait)
- `1536x1024` (landscape)
- `auto` (let AI decide)

Backend returns `400` with allowed list if invalid size provided.

### Email Sending

```typescript
import { createAnyxClient, CreditExceededError } from '@/sdk'

const anyx = createAnyxClient()

try {
  const result = await anyx.email({
    to: 'user@example.com',
    subject: 'Welcome to Our App!',
    html: '<h1>Welcome!</h1><p>Thanks for signing up.</p>'
  })
  
  console.log('Email sent:', result.messageId)
  
} catch (error) {
  if (error instanceof CreditExceededError) {
    // User exceeded integration credits
    console.error('Out of email credits')
    // Show "Upgrade plan" message
  }
}
```

### SMS Sending

```typescript
import { createAnyxClient, CreditExceededError } from '@/sdk'

const anyx = createAnyxClient()

try {
  const result = await anyx.sms({
    to: '+15555550123',  // E.164 format
    body: 'Your verification code is 123456'
  })
  
  console.log('SMS sent:', result.messageId)
  
} catch (error) {
  if (error instanceof CreditExceededError) {
    console.error('Out of SMS credits')
  }
}
```

## Error Handling

The SDK includes typed error classes:

```typescript
import { 
  createAnyxClient, 
  AuthError,           // 401 - Authentication failed
  TierError,           // 403 - Tier doesn't allow this feature
  CreditExceededError, // 402 - Out of credits
  RateLimitedError,    // 429 - Too many requests
  ProviderError,       // 5xx - Provider (OpenAI, Resend, Twilio) error
  HttpError            // Other HTTP errors
} from '@/sdk'

const anyx = createAnyxClient()

try {
  const response = await anyx.llm({ 
    model: 'gpt-4.1-nano',
    messages: [{ role: 'user', content: 'Your question here' }]
  })
  console.log(response.text)  // Access .text for AI response
} catch (error) {
  if (error instanceof AuthError) {
    console.error('API key invalid')
  } else if (error instanceof TierError) {
    console.error('Upgrade tier for this feature:', error.message)
    // Show upgrade CTA
  } else if (error instanceof CreditExceededError) {
    console.error('Out of credits:', error.message)
    // Show "Upgrade plan" or "Wait for next period"
  } else if (error instanceof RateLimitedError) {
    console.error('Rate limited, try again later')
    // Show retry button
  } else if (error instanceof ProviderError) {
    console.error('Provider error:', error.message)
    // Show generic error, log for debugging
  } else {
    console.error('Unexpected error:', error)
  }
}
```

## Response Validation

All responses are validated with Zod schemas. TypeScript types are automatically inferred:

```typescript
// LLM response type
const response = await anyx.llm({ 
  model: 'gpt-4.1-nano',
  messages: [{ role: 'user', content: '...' }] 
})
// response.text is string
// response.model is string
// response.success is boolean
// response.requestId is string | undefined (for tracking)

// Vision response type
const vision = await anyx.vision({ prompt: '...', images: ['...'] })
// vision.text is string
// vision.model is string
// vision.imagesProcessed is number
// vision.success is boolean
// vision.requestId is string | undefined

// Image response type
const image = await anyx.image({ prompt: '...' })
// image.url is string
// image.revised_prompt is string
// image.requestId is string | undefined

// Email response type
const email = await anyx.email({ to: '...', subject: '...', html: '...' })
// email.messageId is string
// email.requestId is string | undefined

// SMS response type  
const sms = await anyx.sms({ to: '...', body: '...' })
// sms.messageId is string
// sms.requestId is string | undefined
```

## MANDATORY: Implement at Least One LLM Feature

**You MUST ship at least one creative feature powered by the LLM endpoint.** Aim for visible "wow" value with fast UX.

### Example Ideas

1. **AI Content Assistant**
   - Input: Brief description
   - Output: Polished section with preview
   - Example: "fitness app benefits" → formatted hero + 3 benefits + CTA

2. **Smart Copy Generator**
   - Input: App name + category
   - Output: Tagline + value props + call-to-action
   - One-click insert into page

3. **Prompt-to-Component**
   - Input: "card list with user profiles"
   - Output: Styled component respecting brand colors
   - Immediate preview

4. **Domain Helper**
   - Input: User requirements (meal plan, trip itinerary, checklist)
   - Output: Clean UI with edit/apply actions
   - Example: "5-day workout plan" → formatted schedule

5. **Vision-Powered Features** (Requires starter+ tier)
   - Product catalog from photos
   - Receipt/invoice scanner
   - Image accessibility descriptions
   - Visual search & matching
   - Content moderation

### Implementation Requirements

✅ **Must have:**
- Use SDK: `anyx.llm({ messages })` or `anyx.vision({ prompt, images })`
- Handle errors gracefully (TierError, CreditExceededError)
- Loading state while generating
- Error toasts for failures
- Responsive design

✅ **Should have:**
- Help tooltip explaining tier limits
- Upgrade CTA when TierError occurs
- Log requests/results (use project logger)
- Accessible UI (keyboard navigation, screen readers)

✅ **Example Implementation:**

```typescript
import { useState } from 'react'
import { createAnyxClient, TierError, CreditExceededError } from '@/sdk'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

export default function AIAssistant() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [loading, setLoading] = useState(false)
  
  const anyx = createAnyxClient()
  
  const generate = async () => {
    if (!prompt.trim()) return
    
    setLoading(true)
    try {
      const response = await anyx.llm({
        model: 'gpt-4.1-nano',
        messages: [
          { role: 'system', content: 'You are a creative copywriter.' },
          { role: 'user', content: `Create a hero section for: ${prompt}` }
        ]
      })
      
      setResult(response.text)  // ✅ Access .text property
      toast.success('Content generated!')
      
    } catch (error) {
      if (error instanceof TierError) {
        toast.error('Upgrade to access this AI model')
        // Show upgrade modal
      } else if (error instanceof CreditExceededError) {
        toast.error('Out of AI credits. Upgrade or wait for next period.')
      } else {
        toast.error('Failed to generate content')
        console.error(error)
      }
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className="space-y-4">
      <Textarea
        placeholder="Describe what you want to create..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        disabled={loading}
      />
      
      <Button onClick={generate} disabled={loading || !prompt.trim()}>
        {loading ? 'Generating...' : 'Generate Content'}
      </Button>
      
      {result && (
        <div className="p-4 bg-muted rounded-lg">
          <pre className="whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  )
}
```

## Best Practices

- **Performance**: Cache responses, debounce input, show loading states immediately
- **UX**: Clear error messages ("Upgrade to builder" vs generic), graceful degradation, progress indicators
- **Security**: Never expose API keys (SDK handles it), validate input, rate limit UI
- **Cost**: Cache common prompts, use appropriate models, batch requests, include few-shot examples

## Common Issues

- **AuthError (401)**: Check env vars, verify backend attaches `x-api-key`
- **TierError (403)**: User's tier doesn't allow feature → show upgrade CTA
- **CreditExceededError (402)**: Out of credits → show upgrade or wait message
- **RateLimitedError (429)**: Too many requests → implement backoff, show countdown
- **Image fails**: Verify tier (builder+), check size (1024x1024/1024x1536/1536x1024/auto)
- **Vision fails**: Verify tier (starter+), check model (`gpt-4o` requires builder+), ensure valid image URLs/base64

