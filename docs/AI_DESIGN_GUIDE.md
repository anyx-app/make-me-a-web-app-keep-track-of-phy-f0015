# AI Design Guide - Creating Production-Quality UIs

This guide helps AI agents understand how to use the design system to create **branded, professional designs** instead of simple mockups.

## 🎯 Core Principle

**Simple mockup** = Components placed on a page  
**Professional design** = Strategic composition + visual hierarchy + brand personality + polish

---

## 🚀 START HERE: Brand Configuration System

**IMPORTANT**: Before generating any UI, ALWAYS check the brand configuration:

```tsx
import { useBrand } from '@/hooks/useBrand'

function Component() {
  const { config, classes } = useBrand()
  
  // config.flavor → Determines entire visual personality
  // config.preferredHero → Which hero to use
  // config.preferredFeatureLayout → How to layout features
  // classes.sectionPadding → Brand-aware spacing
}
```

### 📚 Required Reading
1. **[BRAND_FLAVORS.md](./BRAND_FLAVORS.md)** - Complete guide on 8 brand personalities and how to use them
2. **[UI_PATTERNS.md](./UI_PATTERNS.md)** - Copy-paste ready patterns for common sections

### ⚡ Quick Decision Tree

**Step 1**: Read brand config
```tsx
const { config } = useBrand()
```

**Step 2**: Choose components based on config
```tsx
// Hero selection
if (config.preferredHero === 'minimal') return <HeroMinimal />
if (config.preferredHero === 'gradient') return <HeroGradient />
if (config.preferredHero === 'spotlight') return <HeroSpotlight />

// Feature layout
if (config.preferredFeatureLayout === 'grid') return <FeatureGrid />
if (config.preferredFeatureLayout === 'bento') return <BentoGrid />
if (config.preferredFeatureLayout === 'showcase') return <FeatureShowcase />
```

**Step 3**: Apply brand classes
```tsx
<section className={classes.sectionPadding}> // Not hardcoded py-20
  <div className={classes.container}>        // Not hardcoded max-w-7xl
```

### 🎨 Available Components by Category

#### **Dashboard Components** (`@/components/recipes/dashboard`)
- `StatCard` / `StatGrid` - KPI metrics with trends
- `ChartCard` / `ChartGrid` - Chart containers
- `DataTable` - Searchable, filterable tables

#### **AI Components** (`@/components/recipes/ai`)
- `ChatMessage` - Individual chat bubbles
- `ChatInterface` - Complete chat UI with input
- `TypingIndicator` - Animated typing effect

#### **Filter Components** (`@/components/recipes/filters`)
- `SearchBar` - Advanced search with suggestions
- `FilterPanel` - Multi-group filter sidebar

#### **Hero Components** (`@/components/recipes/heroes`)
- `HeroGradient` - Animated gradient with orbs
- `HeroSpotlight` - Spotlight effect hero
- `HeroMinimal` - Clean, minimal hero

#### **Feature Components** (`@/components/recipes/features`)
- `FeatureGrid` - Spotlight cards in grid
- `BentoGrid` - Modern variable-size grid
- `FeatureShowcase` - Side-by-side layout

#### **Effects** (`@/components/recipes/effects`)
- `GradientBackground` - Animated backgrounds
- `SpotlightCard` - Cursor-following effect
- `GlowingCard` - Hover glow

### 🎨 20 Available Themes (10 Families × Light/Dark)

1. **Default** - Neutral, versatile
2. **Ocean** - Calming blues
3. **Sunset** - Warm oranges/purples
4. **Professional** - Corporate gray/blue
5. **High-Contrast** - WCAG AAA accessibility
6. **Tech** - Futuristic cyan/purple ⭐ NEW
7. **Finance** - Trustworthy navy/gold ⭐ NEW
8. **Health** - Caring greens/blues ⭐ NEW
9. **Creative** - Bold magenta/yellow ⭐ NEW
10. **Gaming** - High-energy purple/cyan ⭐ NEW

**Each theme auto-applied based on `config.theme`**

---

## 🎨 The Professional Design Checklist

When generating UI, AI should apply ALL of these:

### ✅ Visual Hierarchy
- [ ] Clear primary action (largest, most prominent)
- [ ] Secondary actions clearly de-emphasized
- [ ] Heading sizes follow importance (h1 > h2 > h3)
- [ ] Content grouped by relatedness
- [ ] Whitespace separates sections

### ✅ Spacing & Layout
- [ ] Consistent spacing scale used (`spacing-md`, `spacing-lg`, etc.)
- [ ] Generous whitespace (don't cram everything)
- [ ] Max-width containers (usually `max-w-7xl`)
- [ ] Proper padding on all sections (`py-20 px-4`)
- [ ] Aligned elements (use grid/flex properly)

### ✅ Typography
- [ ] Font sizes follow scale (`text-4xl`, `text-xl`, etc.)
- [ ] Line height appropriate for text length
- [ ] Text color uses semantic tokens (`text-muted-foreground`)
- [ ] Proper font weights for emphasis
- [ ] Readable line length (max 65-75 characters)

### ✅ Color & Contrast
- [ ] Background uses theme tokens (`bg-background`, `bg-muted/30`)
- [ ] Sufficient contrast for readability
- [ ] Primary color used strategically (not everywhere)
- [ ] Muted colors for secondary content
- [ ] Consistent color meaning (primary = action, destructive = danger)

### ✅ Animation & Polish
- [ ] Entrance animations on scroll (`whileInView`)
- [ ] Hover states on interactive elements
- [ ] Smooth transitions (`transition-base`)
- [ ] Stagger animations for lists
- [ ] Subtle floating/pulse effects for key elements

### ✅ Brand Personality
- [ ] Logo prominently displayed
- [ ] Consistent tone (professional/playful/minimal)
- [ ] Strategic use of effects (gradients, shadows, blur)
- [ ] Icons that match brand style
- [ ] Custom accent colors if needed

---

## 📐 Layout Patterns That Look Professional

### ❌ Simple Mockup Pattern
```tsx
<div>
  <h1>Title</h1>
  <p>Text</p>
  <button>Click</button>
</div>
```

### ✅ Professional Pattern
```tsx
<section className="py-20 px-4 bg-gradient-to-b from-background to-muted/20">
  <div className="max-w-4xl mx-auto">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-center space-y-6"
    >
      <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
        Compelling Title That Grabs Attention
      </h1>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Supporting text that explains the value proposition clearly
        and concisely without overwhelming the reader.
      </p>
      <div className="flex gap-4 justify-center pt-4">
        <Button size="lg" className="shadow-lg">
          Primary Action
        </Button>
        <Button size="lg" variant="outline">
          Secondary Action
        </Button>
      </div>
    </motion.div>
  </div>
</section>
```

**What makes it professional**:
- Proper section padding (`py-20`)
- Max-width container for readability
- Entrance animation
- Responsive typography sizes
- Muted supporting text
- Clear visual hierarchy
- Generous spacing (`space-y-6`)
- Gradient background for depth

---

## 🎭 Recipe Composition Rules

### When to Use Each Recipe

**HeroGradient**
- Use for: Landing pages, product launches
- When: Need maximum impact and "wow" factor
- Pair with: Animated backgrounds, large CTAs
- Example: SaaS landing page hero

**HeroSpotlight**  
- Use for: Product pages, feature highlights
- When: Need split content (text + visual)
- Pair with: Product screenshots, illustrations
- Example: App feature showcase

**HeroMinimal**
- Use for: Content-first sites, professional services
- When: Content is more important than flash
- Pair with: Clean typography, subtle animations
- Example: Blog, documentation, portfolio

**BentoGrid**
- Use for: Feature lists, service offerings
- When: Have 3-8 items to showcase
- Pair with: Icons, short descriptions
- Example: Product features section

**FeatureGrid**
- Use for: Detailed features, benefits
- When: Need hover interactions
- Pair with: SpotlightCard effects
- Example: Platform capabilities

**FeatureShowcase**
- Use for: In-depth explanations
- When: Need to explain complex features
- Pair with: Images, diagrams, demos
- Example: How it works section

### Recipe Combinations That Work

```tsx
// Landing Page (Professional)
<HeroMinimal />
<FeatureGrid /> // 6 features
<FeatureShowcase /> // Detailed explanation
<BentoGrid /> // Benefits
<CTASection />

// Landing Page (Bold)
<HeroGradient />
<BentoGrid />
<FeatureShowcase />
<FeatureShowcase /> // Another feature, opposite side
<PricingSection />
<CTASection />

// Product Page
<HeroSpotlight />
<FeatureGrid />
<FeatureShowcase />
<FeatureShowcase />
<TestimonialsSection />
<CTASection />
```

---

## 🎨 Color Usage Guidelines

### ❌ Common Mistakes

```tsx
// Everything uses primary color
<div className="bg-primary text-primary border-primary">
  <h1 className="text-primary">Title</h1>
  <Button className="bg-primary">Click</Button>
</div>
```

### ✅ Professional Color Usage

```tsx
// Strategic color usage
<div className="bg-background">
  <h1 className="text-foreground">Title</h1>
  <p className="text-muted-foreground">Supporting text</p>
  <Button> {/* Primary color only on CTA */}
    Take Action
  </Button>
</div>
```

**Rules**:
- Primary color = Call to action buttons only
- Muted = Supporting text, labels, captions
- Foreground = Main content
- Background gradients = Subtle (20-30% opacity)
- Accent = Highlights, badges, important info

---

## 📏 Spacing System

### The "Breathing Room" Rule

**Every section needs**:
- Top/bottom: `py-20` or `py-16` minimum
- Left/right: `px-4` or `px-6` minimum
- Between elements: `space-y-8` or `gap-8`
- Max width: `max-w-7xl` or smaller for content

### ❌ Cramped Design
```tsx
<div className="p-4">
  <h1>Title</h1>
  <p>Text</p>
  <button>Button</button>
</div>
```

### ✅ Professional Spacing
```tsx
<section className="py-20 px-4">
  <div className="max-w-5xl mx-auto space-y-12">
    <div className="space-y-4">
      <h1 className="text-5xl">Title</h1>
      <p className="text-xl text-muted-foreground">Text</p>
    </div>
    <Button size="lg">Button</Button>
  </div>
</section>
```

---

## ✨ Animation Guidelines

### When to Animate

**Always animate**:
- Hero section entrance
- Section headers on scroll
- Cards in grids (stagger)
- CTAs (subtle hover)
- Modal/dialog entrance

**Never animate**:
- Navigation bars
- Footer
- Body text
- Form inputs (except validation)
- Static images

### Animation Intensity

```tsx
// Subtle (professional)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>

// Medium (engaging)
<motion.div
  initial={{ opacity: 0, scale: 0.9 }}
  whileInView={{ opacity: 1, scale: 1 }}
  transition={{ duration: 0.6 }}
>

// Bold (hero only)
<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.8, type: "spring" }}
>
```

---

## 🏗️ Component Composition Patterns

### Card Design Patterns

**❌ Basic Card**
```tsx
<div className="border p-4">
  <h3>Title</h3>
  <p>Text</p>
</div>
```

**✅ Professional Card**
```tsx
<SpotlightCard className="p-8">
  <div className="space-y-4">
    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
      <Icon className="text-primary" size={24} />
    </div>
    <h3 className="text-2xl font-semibold">Title</h3>
    <p className="text-muted-foreground leading-relaxed">
      Descriptive text that explains the feature or benefit
      in clear, concise language.
    </p>
    <Button variant="link" className="p-0">
      Learn more →
    </Button>
  </div>
</SpotlightCard>
```

**What makes it professional**:
- Icon container with subtle background
- Larger, bold heading
- Generous spacing
- Muted description text
- Optional action link
- SpotlightCard for interactivity

---

## 🎯 Brand Guidelines

### Logo Usage

**Always**:
- Place logo in top left or centered in hero
- Use appropriate size (32-48px in nav, 80-120px in hero)
- Maintain clear space around logo
- Keep on brand-appropriate background

**Never**:
- Stretch or distort logo
- Place on busy backgrounds
- Use too small (< 24px)
- Add effects (shadows, gradients) unless part of brand

### Example:
```tsx
// Header
<img src="/anyx-logo.png" className="w-10 h-10" alt="AnyX" />

// Hero
<img src="/anyx-logo.png" className="w-32 h-32 drop-shadow-2xl" alt="AnyX" />

// Footer
<img src="/anyx-logo.png" className="w-12 h-12 opacity-50" alt="AnyX" />
```

---

## 📊 Real Example: Transform Mockup to Professional

### Before (Simple Mockup)

```tsx
function Features() {
  return (
    <div>
      <h2>Features</h2>
      <div>
        <div>
          <h3>Fast</h3>
          <p>Quick performance</p>
        </div>
        <div>
          <h3>Secure</h3>
          <p>Data protection</p>
        </div>
      </div>
    </div>
  )
}
```

### After (Professional Design)

```tsx
function Features() {
  const features = [
    { 
      icon: '⚡', 
      title: 'Lightning Fast Performance', 
      description: 'Optimized for speed with lazy loading, code splitting, and efficient rendering. Your users will love the instant response times.'
    },
    { 
      icon: '🔒', 
      title: 'Enterprise-Grade Security', 
      description: 'Built with security best practices. Includes authentication, authorization, CSRF protection, and encrypted data transmission.'
    },
    { 
      icon: '🎨', 
      title: 'Beautiful by Default', 
      description: '10 professionally designed themes and 50+ polished components. Create stunning interfaces without design skills.'
    },
  ]

  return (
    <section className="py-24 px-4 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 space-y-4"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Everything You Need to Build Fast
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Production-ready features that help you ship in days, not months
          </p>
        </motion.div>

        {/* Feature Grid */}
        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {features.map((feature, idx) => (
            <motion.div key={idx} variants={staggerItem}>
              <SpotlightCard className="p-8 h-full">
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-3xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-semibold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </SpotlightCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
```

**Improvements**:
1. ✅ Section padding (`py-24`) and background gradient
2. ✅ Centered header with engaging copy
3. ✅ Descriptive, benefit-focused text
4. ✅ Icon containers with subtle backgrounds
5. ✅ SpotlightCard for interactivity
6. ✅ Stagger animations
7. ✅ Responsive grid
8. ✅ Consistent spacing
9. ✅ Professional typography scale
10. ✅ Proper semantic tokens

---

## 🚀 AI Prompting Best Practices

### ❌ Vague Prompts

"Create a features section"

### ✅ Detailed Prompts

"Create a features section with:
- Section header: 'Why Developers Love Us' with subtitle
- 3-column grid of SpotlightCards
- Each card has: icon, title, 2-sentence description
- Use stagger animations on scroll
- Background: subtle gradient
- Spacing: py-20, max-w-7xl container
- Style: Professional, not playful"

### ✅ Even Better Prompts

"Create a features section following the Professional Design Checklist:
- Hero: Use FeatureGrid recipe with 6 features
- Features: Fast, Secure, Beautiful, TypeScript, Responsive, Accessible
- Each feature: Icon (emoji), bold title, 1-2 sentence benefit-focused description
- Layout: 3 columns on desktop, 1 on mobile
- Animation: Stagger entrance on scroll
- Spacing: Generous (py-24, gap-8)
- Colors: Muted descriptions, icons in primary/10 backgrounds
- Brand: Professional and trustworthy tone"

---

## 📋 Quick Decision Tree

**For AI: When generating UI, ask:**

1. **What's the section goal?**
   - Grab attention → HeroGradient
   - Explain feature → FeatureShowcase
   - List benefits → FeatureGrid/BentoGrid

2. **What's the brand personality?**
   - Bold/Innovative → Use gradients, animations
   - Professional/Trust → Minimal, clean, high contrast
   - Creative/Playful → Bright colors, fun icons

3. **What's the content density?**
   - High (lots of info) → FeatureShowcase, careful spacing
   - Medium → FeatureGrid, BentoGrid
   - Low → HeroMinimal, centered layouts

4. **What's the user action?**
   - Primary CTA → Large button, primary color
   - Explore → Links, secondary buttons
   - Read → Text-focused, minimal distractions

---

## 🎨 Theme-Aware Design

### Using Themes Strategically

Different themes communicate different messages:

- **Default**: Professional, trustworthy
- **Ocean**: Calm, tech-forward
- **Sunset**: Creative, energetic
- **Professional**: Corporate, serious
- **High-Contrast**: Accessible, clear

**AI Tip**: Suggest theme based on brand:
- FinTech → Professional
- Creative Agency → Sunset
- SaaS Tool → Ocean or Default
- Accessibility-focused → High-Contrast

---

## ✅ Final Checklist for AI

Before declaring UI complete, verify:

- [ ] Max 1 primary CTA per section (clear hierarchy)
- [ ] All sections have py-20+ padding
- [ ] Text has proper max-width for readability
- [ ] Hover states on all interactive elements
- [ ] Animations on key sections (not everything)
- [ ] Consistent spacing scale used throughout
- [ ] Logo prominently displayed
- [ ] Colors follow semantic token system
- [ ] Typography follows size scale
- [ ] Mobile responsive (test at 375px width)
- [ ] No orphaned text (proper line length)
- [ ] Clear visual separation between sections

---

## 🎯 Success Metrics

**Good Design** = User immediately understands:
1. What this is (clear headline)
2. Why it matters (benefit-focused copy)
3. What to do next (obvious CTA)

**Great Design** = All of above PLUS:
- Feels polished and professional
- Has distinctive brand personality
- Creates emotional response
- Memorable visual moments

---

## 📚 Resources

- Use recipes from `@/components/recipes`
- Follow patterns in `/showcase` page
- Reference `DESIGN_SYSTEM.md` for tokens
- Check `RECIPES.md` for component docs

---

**Remember**: Professional design isn't about complexity—it's about intentional composition, appropriate polish, and strategic use of effects.

