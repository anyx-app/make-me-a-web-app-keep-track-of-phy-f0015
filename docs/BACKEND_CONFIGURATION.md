# AI Agent Instructions - Backend System Guide

This document provides **instructions for backend systems** that control AI agents generating UIs with this design system.

Use this to configure your AI agent's system prompt, validation rules, and quality checks.

---

## 🎯 Purpose

Ensure AI agents produce **branded, professional, production-ready UIs** instead of generic mockups by following a structured approach to design generation.

---

## 📋 System Prompt Template

Use this as your AI agent's base system prompt:

```markdown
You are an expert UI/UX designer and React developer. You generate production-ready, 
branded user interfaces using a comprehensive design system.

## CRITICAL RULES

1. **ALWAYS read brand configuration first** using `useBrand()` hook
2. **NEVER hardcode** component choices, spacing, or layouts
3. **ALWAYS adapt** to the active brand flavor
4. **USE brand-aware classes** (`classes.sectionPadding`, not `py-20`)
5. **FOLLOW the component selection logic** from BRAND_FLAVORS.md

## DESIGN SYSTEM LOCATION

Project root: `/path/to/anyx-react-boilerplate-prod/`

Key files to read:
- `docs/BRAND_FLAVORS.md` - Brand personality guide (REQUIRED READING)
- `docs/AI_DESIGN_GUIDE.md` - Design principles
- `docs/UI_PATTERNS.md` - Ready-to-use patterns
- `src/config/brand.ts` - Active brand configuration

## WORKFLOW

1. Read `src/config/brand.ts` to get `activeFlavor`
2. Consult `docs/BRAND_FLAVORS.md` for that flavor's guidelines
3. Generate UI following the flavor's specs
4. Apply brand classes from `useBrand()` hook
5. Self-validate against quality checklist

## AVAILABLE COMPONENTS

### Dashboard
- `StatCard`, `StatGrid` - KPI metrics
- `ChartCard`, `ChartGrid` - Chart containers
- `DataTable` - Tables with search/filter

### AI/Chat
- `ChatMessage` - Message bubbles
- `ChatInterface` - Full chat UI
- `TypingIndicator` - Loading state

### Filters
- `SearchBar` - Advanced search
- `FilterPanel` - Multi-filter sidebar

### Heroes
- `HeroGradient` - Animated gradient
- `HeroMinimal` - Clean minimal
- `HeroSpotlight` - Spotlight effect

### Features
- `FeatureGrid` - Card grid
- `BentoGrid` - Variable-size grid
- `FeatureShowcase` - Side-by-side

### Effects
- `GradientBackground` - Animated backgrounds
- `SpotlightCard` - Cursor effects
- `GlowingCard` - Hover glow

## QUALITY REQUIREMENTS

Every generated component must:
- [ ] Import and use `useBrand()` hook
- [ ] Use `config.preferredHero/Feature/Card` for component selection
- [ ] Apply `classes.sectionPadding`, `classes.container`, etc.
- [ ] Match color vibrancy to `config.colorVibrancy`
- [ ] Use brand-aware animations via `useBrandAnimations()`
- [ ] Be fully typed with TypeScript
- [ ] Include responsive classes (mobile-first)
- [ ] Have proper accessibility (ARIA labels, keyboard nav)

## FAILURE MODES TO AVOID

❌ DON'T hardcode: `<HeroGradient />` for every site
✅ DO adapt: `{config.preferredHero === 'gradient' ? <HeroGradient /> : ...}`

❌ DON'T hardcode: `py-20` spacing
✅ DO use: `{classes.sectionPadding}`

❌ DON'T ignore brand flavor
✅ DO check: `const { config } = useBrand()` at component start

❌ DON'T use same layout for everything
✅ DO vary: based on `config.preferredFeatureLayout`
```

---

## 🏗️ Backend Implementation Guide

### Step 1: File Access Setup

Your backend needs to read these files before invoking the AI agent:

```typescript
// Backend pseudocode
const designSystemPath = '/path/to/anyx-react-boilerplate-prod'

async function prepareAIContext(userRequest: string) {
  // 1. Read brand configuration
  const brandConfig = await readFile(`${designSystemPath}/src/config/brand.ts`)
  const activeFlavor = extractActiveFlavor(brandConfig) // Parse: export const activeFlavor = '...'
  
  // 2. Read relevant documentation
  const brandGuide = await readFile(`${designSystemPath}/docs/BRAND_FLAVORS.md`)
  const designGuide = await readFile(`${designSystemPath}/docs/AI_DESIGN_GUIDE.md`)
  const patterns = await readFile(`${designSystemPath}/docs/UI_PATTERNS.md`)
  
  // 3. Prepare context
  return {
    systemPrompt: baseSystemPrompt,
    context: {
      activeFlavor,
      brandGuide,
      designGuide,
      patterns,
      userRequest,
    }
  }
}
```

### Step 2: Prompt Construction

```typescript
async function buildPrompt(userRequest: string, context: AIContext) {
  return `
${context.systemPrompt}

## CURRENT BRAND CONFIGURATION

Active Flavor: ${context.activeFlavor}

${context.brandGuide} // Full BRAND_FLAVORS.md content

## USER REQUEST

${userRequest}

## YOUR TASK

Generate a React component that:
1. Follows the "${context.activeFlavor}" brand flavor guidelines
2. Uses the useBrand() hook to access configuration
3. Adapts component choices to brand preferences
4. Applies brand-aware classes for spacing/styling
5. Is production-ready and fully typed

## OUTPUT FORMAT

Provide ONLY the React component code. No explanations unless asked.
Include all necessary imports.
Use TypeScript.
`.trim()
}
```

### Step 3: Validation Rules

After AI generates code, validate it programmatically:

```typescript
interface ValidationResult {
  valid: boolean
  errors: string[]
  warnings: string[]
}

function validateGeneratedCode(code: string, activeFlavor: string): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []
  
  // CRITICAL CHECKS (must pass)
  
  // 1. Uses useBrand hook
  if (!code.includes('useBrand()')) {
    errors.push('CRITICAL: Code must import and use useBrand() hook')
  }
  
  // 2. Reads brand config
  if (!code.includes('const { config') && !code.includes('const { classes')) {
    errors.push('CRITICAL: Must destructure config or classes from useBrand()')
  }
  
  // 3. No hardcoded heroes (common mistake)
  const hardcodedHeroPattern = /<Hero(Gradient|Minimal|Spotlight)\s*\/?>/
  if (hardcodedHeroPattern.test(code) && !code.includes('config.preferredHero')) {
    errors.push('CRITICAL: Hero component is hardcoded. Must use config.preferredHero')
  }
  
  // 4. No hardcoded spacing
  if (code.includes('py-20') || code.includes('py-12') || code.includes('py-32')) {
    if (!code.includes('classes.sectionPadding')) {
      warnings.push('Using hardcoded spacing instead of classes.sectionPadding')
    }
  }
  
  // 5. TypeScript types present
  if (!code.includes('interface') && !code.includes('type') && code.includes('Props')) {
    warnings.push('Component props should be typed with interface or type')
  }
  
  // QUALITY CHECKS (warnings)
  
  // 6. Responsive design
  if (!code.includes('md:') && !code.includes('lg:')) {
    warnings.push('Consider adding responsive classes (md:, lg:)')
  }
  
  // 7. Animations
  if (code.includes('motion.') && !code.includes('useBrandAnimations')) {
    warnings.push('Consider using useBrandAnimations() for brand-aware animations')
  }
  
  // 8. Accessibility
  if (code.includes('<button') && !code.includes('aria-')) {
    warnings.push('Interactive elements should have ARIA labels')
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings,
  }
}
```

### Step 4: Quality Scoring

```typescript
interface QualityScore {
  score: number // 0-100
  breakdown: {
    brandAdherence: number    // 0-30
    codeQuality: number       // 0-25
    responsiveness: number    // 0-15
    accessibility: number     // 0-15
    animations: number        // 0-15
  }
  feedback: string[]
}

function scoreGeneratedCode(code: string, activeFlavor: string): QualityScore {
  let score = 0
  const feedback: string[] = []
  
  // Brand Adherence (0-30 points)
  let brandScore = 0
  if (code.includes('useBrand()')) brandScore += 10
  if (code.includes('config.preferred')) brandScore += 10
  if (code.includes('classes.')) brandScore += 10
  
  // Code Quality (0-25 points)
  let qualityScore = 0
  if (code.includes('interface') || code.includes('type')) qualityScore += 8
  if (code.includes('export default')) qualityScore += 5
  if (code.includes('cn(')) qualityScore += 7  // Using utility
  if (!code.includes('any')) qualityScore += 5  // No any types
  
  // Responsiveness (0-15 points)
  let responsiveScore = 0
  if (code.includes('md:')) responsiveScore += 5
  if (code.includes('lg:')) responsiveScore += 5
  if (code.includes('max-w-')) responsiveScore += 5
  
  // Accessibility (0-15 points)
  let a11yScore = 0
  if (code.includes('aria-')) a11yScore += 8
  if (code.includes('alt=')) a11yScore += 4
  if (code.includes('role=')) a11yScore += 3
  
  // Animations (0-15 points)
  let animScore = 0
  if (code.includes('motion.')) animScore += 5
  if (code.includes('useBrandAnimations')) animScore += 10
  
  score = brandScore + qualityScore + responsiveScore + a11yScore + animScore
  
  // Generate feedback
  if (brandScore < 20) feedback.push('Improve brand adherence by using config preferences')
  if (qualityScore < 15) feedback.push('Add TypeScript types and use utility functions')
  if (responsiveScore < 10) feedback.push('Add responsive breakpoints (md:, lg:)')
  if (a11yScore < 10) feedback.push('Improve accessibility with ARIA labels')
  if (animScore < 5) feedback.push('Add animations for better UX')
  
  return {
    score,
    breakdown: {
      brandAdherence: brandScore,
      codeQuality: qualityScore,
      responsiveness: responsiveScore,
      accessibility: a11yScore,
      animations: animScore,
    },
    feedback,
  }
}
```

---

## 🎯 API Endpoint Design

### Request Format

```typescript
interface GenerateUIRequest {
  // What to build
  componentType: 'hero' | 'feature' | 'dashboard' | 'chat' | 'full-page' | 'custom'
  description: string
  
  // Context (optional overrides)
  brandFlavor?: string  // Override active flavor
  data?: Record<string, any>  // Sample data for dynamic content
  
  // Quality controls
  minQualityScore?: number  // Default: 70
  maxAttempts?: number      // Default: 3
  
  // Output preferences
  includeTests?: boolean
  includeStorybook?: boolean
}

interface GenerateUIResponse {
  // Generated code
  code: string
  
  // Quality metrics
  validation: ValidationResult
  qualityScore: QualityScore
  
  // Metadata
  attempts: number
  tokensUsed: number
  generationTime: number
  
  // Suggestions
  improvements?: string[]
  alternativeApproaches?: string[]
}
```

### Example Implementation

```typescript
async function generateUI(request: GenerateUIRequest): Promise<GenerateUIResponse> {
  const { componentType, description, minQualityScore = 70, maxAttempts = 3 } = request
  
  // Prepare context
  const context = await prepareAIContext(description)
  
  let attempts = 0
  let bestResult = { code: '', score: 0 }
  
  while (attempts < maxAttempts) {
    attempts++
    
    // Build prompt
    const prompt = await buildPrompt(description, context)
    
    // Call AI
    const code = await callAI(prompt)
    
    // Validate
    const validation = validateGeneratedCode(code, context.activeFlavor)
    
    if (!validation.valid) {
      // If critical errors, retry with feedback
      const feedbackPrompt = `
Previous attempt had errors:
${validation.errors.join('\n')}

Please fix these issues and regenerate.
      `
      continue
    }
    
    // Score
    const quality = scoreGeneratedCode(code, context.activeFlavor)
    
    if (quality.score >= minQualityScore) {
      // Success!
      return {
        code,
        validation,
        qualityScore: quality,
        attempts,
        tokensUsed: calculateTokens(prompt + code),
        generationTime: Date.now() - startTime,
      }
    }
    
    // Keep best attempt
    if (quality.score > bestResult.score) {
      bestResult = { code, score: quality.score }
    }
    
    // Retry with improvement feedback
    const improvementPrompt = `
Current quality score: ${quality.score}/${minQualityScore} required

Feedback:
${quality.feedback.join('\n')}

Please improve the code to address these points.
    `
  }
  
  // Return best attempt even if below threshold
  return {
    code: bestResult.code,
    validation: validateGeneratedCode(bestResult.code, context.activeFlavor),
    qualityScore: scoreGeneratedCode(bestResult.code, context.activeFlavor),
    attempts,
    improvements: ['Code did not reach quality threshold. Review and refine manually.'],
  }
}
```

---

## 🔍 Monitoring & Improvement

### Metrics to Track

```typescript
interface DesignSystemMetrics {
  // Usage patterns
  brandFlavorUsage: Record<string, number>  // Which flavors are used most
  componentUsage: Record<string, number>    // Which components are used most
  
  // Quality metrics
  averageQualityScore: number
  validationSuccessRate: number
  averageAttempts: number
  
  // Common issues
  commonErrors: Array<{ error: string; count: number }>
  commonWarnings: Array<{ warning: string; count: number }>
  
  // Performance
  averageGenerationTime: number
  averageTokensUsed: number
}
```

### Continuous Improvement

```typescript
async function analyzeAndImprove(metrics: DesignSystemMetrics) {
  // If certain errors are common, update system prompt
  if (metrics.commonErrors.find(e => e.error.includes('useBrand'))) {
    console.log('⚠️ AI frequently forgets useBrand() hook')
    console.log('📝 Consider emphasizing this more in system prompt')
  }
  
  // If quality scores are low for certain components
  const lowScoreComponents = Object.entries(metrics.componentUsage)
    .filter(([_, score]) => score < 70)
  
  if (lowScoreComponents.length > 0) {
    console.log('⚠️ Low quality scores for:', lowScoreComponents)
    console.log('📝 Consider adding more examples to UI_PATTERNS.md')
  }
  
  // If certain brand flavors aren't used
  const unusedFlavors = Object.entries(metrics.brandFlavorUsage)
    .filter(([_, count]) => count === 0)
  
  if (unusedFlavors.length > 0) {
    console.log('ℹ️ Unused flavors:', unusedFlavors)
    console.log('📝 Consider better documentation or examples')
  }
}
```

---

## 📚 Pre-Generation Checklist

Before calling AI agent, ensure:

- [ ] `docs/BRAND_FLAVORS.md` is included in context
- [ ] `src/config/brand.ts` `activeFlavor` is read
- [ ] System prompt emphasizes brand adherence
- [ ] Validation rules are configured
- [ ] Quality threshold is set (recommend 70+)
- [ ] Max attempts is reasonable (3-5)

---

## 🎯 Post-Generation Checklist

After AI generates code, verify:

- [ ] `useBrand()` hook is used
- [ ] Brand config drives component selection
- [ ] No hardcoded components (Hero, Feature layouts)
- [ ] Brand classes used for spacing/styling
- [ ] TypeScript types are complete
- [ ] Responsive classes present
- [ ] Accessibility attributes included
- [ ] Quality score >= threshold

---

## 💡 Best Practices

### 1. **Always Include Full Context**

Don't just pass the user request. Include:
- Active brand flavor
- Relevant documentation (BRAND_FLAVORS.md)
- Sample patterns (UI_PATTERNS.md)
- Design principles (AI_DESIGN_GUIDE.md)

### 2. **Validate Before Returning**

Never return unvalidated code to users. Always:
- Check for critical errors
- Score quality
- Provide improvement feedback

### 3. **Iterate with Feedback**

If first attempt fails:
- Pass specific errors to AI
- Ask for fixes
- Re-validate

### 4. **Track Metrics**

Log every generation:
- What was requested
- What flavor was active
- Quality score achieved
- Common issues

Use this data to improve prompts over time.

### 5. **Provide Fallbacks**

If AI can't reach quality threshold:
- Return best attempt
- Include clear warnings
- Suggest manual review points

---

## 🚨 Common Failure Patterns

### Pattern 1: Generic Blue Gradient Everything

**Symptom**: Every site gets `<HeroGradient />` with default colors

**Cause**: AI not reading brand config

**Fix**: Strengthen system prompt emphasis on `useBrand()` hook

**Validation**: Check for `config.preferredHero` usage

### Pattern 2: Hardcoded Spacing

**Symptom**: All sections use `py-20` regardless of brand

**Cause**: AI using memorized patterns instead of brand classes

**Fix**: Add examples showing `classes.sectionPadding` usage

**Validation**: Warn if hardcoded spacing detected

### Pattern 3: Ignoring Brand Flavor

**Symptom**: Minimal flavor gets playful animations

**Cause**: AI not consulting BRAND_FLAVORS.md

**Fix**: Include full flavor description in every prompt

**Validation**: Check animation intensity matches `config.animations`

### Pattern 4: Missing TypeScript Types

**Symptom**: Props use `any` or no types

**Cause**: AI prioritizing speed over quality

**Fix**: Add TypeScript requirement to quality scoring

**Validation**: Deduct points for `any` usage

### Pattern 5: No Responsive Design

**Symptom**: Mobile layout broken

**Cause**: AI forgetting mobile-first approach

**Fix**: Emphasize responsive classes in prompt

**Validation**: Check for `md:` and `lg:` classes

---

## 🎯 Success Criteria

A successful generation should:

✅ Quality score **>= 80/100**  
✅ Zero critical validation errors  
✅ Uses brand config for all decisions  
✅ Fully typed with TypeScript  
✅ Responsive across devices  
✅ Accessible (WCAG AA minimum)  
✅ Consistent with brand flavor personality  
✅ Production-ready (no TODOs or placeholders)

---

## 📖 Quick Reference: Key Files

```
docs/
├── BRAND_FLAVORS.md          ⭐ MOST IMPORTANT - Brand personality guide
├── AI_DESIGN_GUIDE.md        📚 Design principles and patterns
├── UI_PATTERNS.md            📋 Copy-paste ready examples
├── RECIPES.md                🧩 Component documentation
└── AI_AGENT_INSTRUCTIONS.md  🤖 This file

src/
├── config/brand.ts           ⚙️ Active brand configuration
├── hooks/useBrand.ts         🔧 Brand hook implementation
└── components/recipes/       🎨 All available components
```

---

## 🚀 Example: Complete Backend Flow

```typescript
// 1. User requests a dashboard
const request = {
  componentType: 'dashboard',
  description: 'Create a SaaS dashboard with revenue stats, user growth chart, and recent orders table',
}

// 2. Backend prepares context
const activeFlavor = 'tech' // Read from brand.ts
const brandGuide = readFile('docs/BRAND_FLAVORS.md')

// 3. Build enhanced prompt
const prompt = `
${systemPrompt}

Active Brand: tech (futuristic, cyan/purple, glass cards, moderate animations)

${brandGuide}

User wants: ${request.description}

Generate using:
- StatGrid for revenue KPIs
- ChartCard for user growth
- DataTable for recent orders
- Apply tech flavor preferences (glass cards, moderate animations)
- Use useBrand() hook
- Apply classes.sectionPadding
`

// 4. AI generates code
const code = await ai.generate(prompt)

// 5. Validate
const validation = validateGeneratedCode(code, 'tech')
if (!validation.valid) {
  // Retry with fixes
  return retry(code, validation.errors)
}

// 6. Score quality
const quality = scoreGeneratedCode(code, 'tech')
if (quality.score < 70) {
  // Retry with improvements
  return retry(code, quality.feedback)
}

// 7. Return to user
return {
  code,
  quality: quality.score,
  message: 'Generated tech-flavored dashboard',
}
```

---

## ✅ Summary for Backend Engineers

**To ensure top-notch designs:**

1. **Read `docs/BRAND_FLAVORS.md`** and include in every AI prompt
2. **Validate** generated code programmatically (check for `useBrand()`, brand classes)
3. **Score** quality across 5 dimensions (brand, code, responsive, a11y, animations)
4. **Iterate** if quality < threshold (max 3-5 attempts)
5. **Track** metrics to improve over time
6. **Never** return unvalidated code

**Key insight**: The design system is only as good as the AI agent's adherence to it. Strict validation and iteration loops are essential.

