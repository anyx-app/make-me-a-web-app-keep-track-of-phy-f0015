# Brand Flavors Guide - AI Design System

This guide teaches AI agents how to use the brand configuration system to generate **unique, branded UIs** instead of repetitive, generic designs.

---

## 🎯 The Problem We're Solving

**Before:** AI generates the same blue gradient hero, same layout, same components for every app.

**After:** AI reads brand config → adapts colors, spacing, animations, layouts to match brand personality → generates unique, branded UI.

---

## 🎨 8 Brand Flavors

Each flavor defines a complete visual personality. **Change `activeFlavor` in `src/config/brand.ts` to instantly rebrand.**

### 1. Minimal (`'minimal'`)

**When to use:** Clean SaaS products, tools, Apple-style apps

**Visual DNA:**
- Theme: `default-light`
- Spacing: Spacious (breathing room)
- Colors: Mostly grayscale, subtle primary
- Animations: Subtle fades only
- Radius: Small (sharp, clean)
- Hero: Minimal (no gradients)
- Cards: Flat (no shadows)

**AI Instructions:**
```tsx
// When brand flavor is 'minimal':
- Use HeroMinimal (not HeroGradient)
- Avoid gradients and effects
- Use lots of whitespace (py-32 instead of py-20)
- Keep animations subtle (fadeIn only, no scale/rotate)
- Use FeatureShowcase (not BentoGrid)
- Monochrome color scheme with ONE accent color
```

**Example:**
```tsx
const { config } = useBrand() // config.flavor === 'minimal'

<section className={cn(
  'py-32', // Spacious, not py-20
  'bg-background' // Solid, not gradient
)}>
  <HeroMinimal /> {/* Not HeroGradient */}
</section>
```

---

### 2. Bold (`'bold'`)

**When to use:** Startups, high-energy products, attention-grabbing sites

**Visual DNA:**
- Theme: `sunset-light`
- Spacing: Tight (dense, action-packed)
- Colors: Vibrant, multiple accent colors
- Animations: Playful (scale, rotate, bounce)
- Radius: Large (friendly, approachable)
- Hero: Gradient (colorful, energetic)
- Cards: Elevated (strong shadows)

**AI Instructions:**
```tsx
// When brand flavor is 'bold':
- Use HeroGradient with dramatic gradients
- Multiple colors (primary + accent)
- Tight spacing (py-12 instead of py-20)
- Bold animations (scale, rotate, pulse)
- Use BentoGrid (asymmetric, modern)
- Large shadows and border-radius
```

---

### 3. Playful (`'playful'`)

**When to use:** Creative agencies, fun products, kids' apps, games

**Visual DNA:**
- Theme: `sunset-light`
- Spacing: Comfortable
- Colors: Vibrant, rainbow palette
- Animations: Playful (bounce, float, spin)
- Radius: Full (very rounded)
- Hero: Gradient with floating orbs
- Cards: Elevated with color backgrounds

**AI Instructions:**
```tsx
// When brand flavor is 'playful':
- Add floating orbs/shapes to backgrounds
- Use asymmetric layouts
- Colorful icons and illustrations
- Animated gradients everywhere
- Fun, casual copy tone
- Use emoji sparingly but strategically
```

---

### 4. Corporate (`'corporate'`)

**When to use:** Enterprise B2B, finance, legal, government

**Visual DNA:**
- Theme: `professional-light`
- Spacing: Comfortable (structured)
- Colors: Muted (navy, gray, minimal color)
- Animations: Subtle (slides only)
- Radius: Small (professional)
- Hero: Split (text + image side-by-side)
- Cards: Bordered (clean lines)

**AI Instructions:**
```tsx
// When brand flavor is 'corporate':
- Avoid gradients and effects
- Grid-based layouts (no asymmetry)
- Professional copy (no casual language)
- Use borders instead of shadows
- Data-focused (charts, tables, stats)
- Icons: outlined, not filled
```

---

### 5. Luxury (`'luxury'`)

**When to use:** Premium products, fashion, high-end services

**Visual DNA:**
- Theme: `default-dark`
- Spacing: Spacious (maximum whitespace)
- Colors: Muted (black, white, gold accent)
- Animations: Subtle, slow (elegant)
- Radius: None (sharp, precise)
- Hero: Minimal (typography-focused)
- Cards: Flat (minimal design)

**AI Instructions:**
```tsx
// When brand flavor is 'luxury':
- Maximum whitespace
- Large, elegant typography
- Monochrome + one metallic accent
- Slow, smooth animations
- No playful elements
- Focus on product imagery
- Minimalist UI
```

---

### 6. Tech (`'tech'`)

**When to use:** AI products, dev tools, fintech, crypto

**Visual DNA:**
- Theme: `ocean-dark` or `tech-dark`
- Spacing: Comfortable
- Colors: Vibrant (cyan, purple, neon accents)
- Animations: Moderate (smooth, futuristic)
- Radius: Medium (modern)
- Hero: Spotlight (dramatic lighting)
- Cards: Glass (frosted glass effect)

**AI Instructions:**
```tsx
// When brand flavor is 'tech':
- Dark mode by default
- Neon/electric accents
- Glass morphism effects
- Grid patterns in background
- Code snippets and data viz
- Futuristic animations
```

---

### 7. Warm (`'warm'`)

**When to use:** Health, wellness, community, education

**Visual DNA:**
- Theme: `sunset-light` or `health-light`
- Spacing: Comfortable
- Colors: Balanced (warm oranges, soft greens)
- Animations: Moderate (friendly)
- Radius: Large (friendly, soft)
- Hero: Gradient (warm, inviting)
- Cards: Elevated (soft shadows)

**AI Instructions:**
```tsx
// When brand flavor is 'warm':
- Warm color palette (orange, coral, soft green)
- Rounded corners everywhere
- Friendly, approachable copy
- Human-centered imagery
- Soft gradients
- Inviting animations
```

---

### 8. Dark (`'dark'`)

**When to use:** Gaming, entertainment, modern apps

**Visual DNA:**
- Theme: `default-dark` or `gaming-dark`
- Spacing: Comfortable
- Colors: Vibrant (neon against dark)
- Animations: Moderate (dramatic)
- Radius: Large (modern)
- Hero: Spotlight (dramatic contrast)
- Cards: Glass (frosted effects)

**AI Instructions:**
```tsx
// When brand flavor is 'dark':
- Dark backgrounds everywhere
- High contrast
- Vibrant accent colors
- Dramatic lighting effects
- Glow effects on hover
- RGB/neon aesthetics (for gaming)
```

---

## 🤖 How AI Should Use This System

### Step 1: Read Brand Config

```tsx
import { useBrand } from '@/hooks/useBrand'

function GeneratedComponent() {
  const { config, classes, isMinimal, isBold } = useBrand()
  
  // config.flavor → 'minimal' | 'bold' | etc.
  // config.preferredHero → 'minimal' | 'gradient' | 'spotlight'
  // config.animations → 'subtle' | 'moderate' | 'playful'
  // classes.sectionPadding → 'py-12' | 'py-20' | 'py-32'
}
```

### Step 2: Adapt Components

```tsx
// DON'T hardcode hero type:
<HeroGradient /> // ❌ Always the same

// DO use brand config:
{config.preferredHero === 'gradient' ? (
  <HeroGradient />
) : config.preferredHero === 'minimal' ? (
  <HeroMinimal />
) : (
  <HeroSpotlight />
)} // ✅ Adapts to brand
```

### Step 3: Apply Brand Classes

```tsx
// DON'T hardcode spacing:
<section className="py-20"> // ❌ Same for everyone

// DO use brand classes:
<section className={classes.sectionPadding}> // ✅ py-12 | py-20 | py-32
```

### Step 4: Match Animation Intensity

```tsx
import { useBrandAnimations } from '@/hooks/useBrand'

const animations = useBrandAnimations()

// Adapts distance, scale, duration based on config.animations
<motion.div {...animations.fadeInUp}>
```

---

## 📋 AI Decision Tree

When generating a new page/component:

### 1. Determine Industry/Purpose
- **SaaS Tool** → `minimal` or `tech`
- **Startup/Marketing** → `bold` or `playful`
- **Enterprise/B2B** → `corporate` or `professional`
- **Health/Wellness** → `warm` or `health`
- **Gaming/Entertainment** → `dark` or `gaming`
- **Luxury/Premium** → `luxury`

### 2. Choose Hero Type
```tsx
if (config.preferredHero === 'minimal') {
  return <HeroMinimal />
} else if (config.preferredHero === 'gradient') {
  return <HeroGradient />
} else if (config.preferredHero === 'spotlight') {
  return <HeroSpotlight />
}
```

### 3. Choose Feature Layout
```tsx
if (config.preferredFeatureLayout === 'grid') {
  return <FeatureGrid features={features} />
} else if (config.preferredFeatureLayout === 'bento') {
  return <BentoGrid items={features} />
} else {
  return <FeatureShowcase features={features} />
}
```

### 4. Apply Card Style
```tsx
const cardClassName = cn(
  config.preferredCardStyle === 'flat' && 'shadow-none',
  config.preferredCardStyle === 'elevated' && 'shadow-lg',
  config.preferredCardStyle === 'bordered' && 'border-2',
  config.preferredCardStyle === 'glass' && 'bg-background/50 backdrop-blur'
)
```

### 5. Adjust Color Vibrancy
```tsx
const iconClassName = cn(
  'rounded-lg p-3',
  config.colorVibrancy === 'muted' 
    ? 'bg-muted text-muted-foreground'
    : config.colorVibrancy === 'balanced'
    ? 'bg-primary/10 text-primary'
    : 'bg-gradient-to-br from-primary to-accent text-white'
)
```

---

## 🎨 Complete Example: AI-Generated Landing Page

```tsx
import { useBrand, useBrandAnimations } from '@/hooks/useBrand'
import {
  HeroGradient,
  HeroMinimal,
  HeroSpotlight,
  FeatureGrid,
  BentoGrid,
  FeatureShowcase,
  StatGrid,
} from '@/components/recipes'

export default function LandingPage() {
  const { config, classes, isMinimal, isBold, isTech } = useBrand()
  const animations = useBrandAnimations()

  return (
    <>
      {/* Hero adapts to brand */}
      <section className={cn('relative', classes.sectionPadding)}>
        {config.preferredHero === 'minimal' && (
          <HeroMinimal
            title="Your Product Name"
            subtitle="Clear value proposition"
            primaryCta="Get Started"
          />
        )}
        {config.preferredHero === 'gradient' && (
          <HeroGradient
            title="Your Product Name"
            subtitle="Clear value proposition"
            primaryCta="Get Started"
          />
        )}
        {config.preferredHero === 'spotlight' && (
          <HeroSpotlight
            title="Your Product Name"
            subtitle="Clear value proposition"
            primaryCta="Get Started"
          />
        )}
      </section>

      {/* Stats section - adapts card style */}
      <section className={classes.sectionPadding}>
        <div className={classes.container}>
          <StatGrid
            stats={[
              { title: 'Users', value: '10K+', change: { value: 12, isPositive: true } },
              { title: 'Revenue', value: '$2M', change: { value: 25, isPositive: true } },
            ]}
            columns={4}
          />
        </div>
      </section>

      {/* Features - layout adapts to brand */}
      <section className={cn(classes.sectionPadding, 'bg-muted/30')}>
        <div className={classes.container}>
          <motion.div {...animations.fadeInUp} className="text-center mb-12">
            <h2 className={cn('text-4xl font-bold', classes.headingTracking)}>
              Powerful Features
            </h2>
          </motion.div>

          {config.preferredFeatureLayout === 'grid' && (
            <FeatureGrid features={features} columns={3} />
          )}
          {config.preferredFeatureLayout === 'bento' && (
            <BentoGrid items={features} />
          )}
          {config.preferredFeatureLayout === 'showcase' && (
            <FeatureShowcase features={features} />
          )}
        </div>
      </section>
    </>
  )
}
```

---

## ✅ Verification Checklist for AI

Before considering a design complete:

- [ ] Read `useBrand()` config at component start
- [ ] Used `config.preferredHero` instead of hardcoded hero
- [ ] Used `config.preferredFeatureLayout` for features
- [ ] Applied `classes.sectionPadding` instead of `py-20`
- [ ] Applied `classes.cardPadding` for card interiors
- [ ] Used `useBrandAnimations()` for motion
- [ ] Matched color vibrancy to `config.colorVibrancy`
- [ ] Applied card style from `config.preferredCardStyle`
- [ ] Respected `config.spacing` density
- [ ] Used conditional rendering based on flavor

---

## 🚀 Quick Reference Table

| Brand Flavor | Theme | Hero | Feature Layout | Card Style | Animation |
|--------------|-------|------|----------------|------------|-----------|
| **Minimal** | default-light | minimal | showcase | flat | subtle |
| **Bold** | sunset-light | gradient | bento | elevated | playful |
| **Playful** | sunset-light | gradient | grid | elevated | playful |
| **Corporate** | professional-light | split | grid | bordered | subtle |
| **Luxury** | default-dark | minimal | showcase | flat | subtle |
| **Tech** | ocean-dark | spotlight | bento | glass | moderate |
| **Warm** | sunset-light | gradient | showcase | elevated | moderate |
| **Dark** | default-dark | spotlight | bento | glass | moderate |

---

## 💡 Pro Tips for AI

1. **Always start components with** `const { config } = useBrand()`
2. **Use conditional rendering** based on config, not hardcoded components
3. **Apply brand classes** (`classes.sectionPadding`, `classes.container`)
4. **Match copy tone** to brand (formal for corporate, casual for playful)
5. **Test different flavors** mentally - does this work for both minimal AND bold?

---

This system ensures every generated UI is **unique, branded, and professional** - not generic mockups.

