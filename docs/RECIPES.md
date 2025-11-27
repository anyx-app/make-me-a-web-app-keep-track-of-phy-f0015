# UI Recipes - Mind-Blowing Components

Pre-built, animated UI recipes powered by Framer Motion that enable rapid development of stunning interfaces.

## 🎯 Overview

The recipe system provides production-ready components with:
- **Stunning animations** via Framer Motion
- **Interactive effects** (spotlight, glow, gradients)
- **Responsive by default** - mobile-first design
- **Type-safe** - Full TypeScript support
- **Customizable** - Easy to adapt to your needs

## 📦 Installation

Already included! Just import and use.

Required dependencies (already installed):
```bash
pnpm add framer-motion @formkit/auto-animate
```

## 🚀 Quick Start

```tsx
import { HeroGradient } from '@/components/recipes/heroes'

function LandingPage() {
  return (
    <HeroGradient
      title="Welcome to the Future"
      subtitle="Build amazing things"
      primaryCta="Get Started"
      secondaryCta="Learn More"
    />
  )
}
```

## 🎨 Hero Sections

### HeroGradient
Animated gradient background with floating orbs.

```tsx
import { HeroGradient } from '@/components/recipes/heroes'

<HeroGradient
  title="Your Amazing Product"
  subtitle="The subtitle that converts visitors"
  primaryCta="Start Free Trial"
  secondaryCta="Watch Demo"
  onPrimaryClick={() => navigate('/signup')}
  onSecondaryClick={() => setShowDemo(true)}
/>
```

**Features**:
- Animated aurora gradient background
- Floating animated orbs
- Gradient text effect on title
- Stagger animation on content
- Fully responsive

---

### HeroSpotlight
Split layout with spotlight effect and grid pattern.

```tsx
import { HeroSpotlight } from '@/components/recipes/heroes'

<HeroSpotlight
  title="Build Faster"
  subtitle="Ship products in days, not months"
  primaryCta="Get Started"
  secondaryCta="Documentation"
/>
```

**Features**:
- Radial spotlight effect
- Grid pattern background
- Split layout (text + visual)
- Animated glow effect
- Perfect for SaaS products

---

### HeroMinimal
Clean, minimal hero with badge and features.

```tsx
import { HeroMinimal } from '@/components/recipes/heroes'

<HeroMinimal
  title="Simply Beautiful"
  subtitle="Focus on what matters"
  primaryCta="Start Building →"
/>
```

**Features**:
- Clean, minimalist design
- Announcement badge
- Feature pills at bottom
- Centered layout
- Fast, lightweight

---

## 🎯 Feature Sections

### BentoGrid
Modern card grid with variable sizing.

```tsx
import { BentoGrid } from '@/components/recipes/features'

const items = [
  { 
    title: 'Fast Performance', 
    description: 'Lightning-fast load times',
    icon: '⚡',
    span: 'col' // spans 2 columns
  },
  { 
    title: 'Secure', 
    description: 'Enterprise-grade security',
    icon: '🔒'
  },
  {
    title: 'Beautiful',
    description: 'Stunning UI components',
    icon: '🎨',
    span: 'row' // spans 2 rows
  },
]

<BentoGrid items={items} />
```

**Props**:
- `items`: Array of { title, description, icon?, className?, span? }
- `span`: 'col' | 'row' | 'both' - Controls card size
- `className`: Additional classes

**Features**:
- Responsive grid layout
- Variable card sizing
- Hover glow effect
- Stagger animation on scroll

---

### FeatureGrid
Spotlight cards in a grid layout.

```tsx
import { FeatureGrid } from '@/components/recipes/features'

const features = [
  { title: 'Component Library', description: 'Pre-built components', icon: '🧩' },
  { title: 'Theme System', description: 'Multiple themes', icon: '🎨' },
  { title: 'TypeScript', description: 'Full type safety', icon: '📘' },
]

<FeatureGrid features={features} columns={3} />
```

**Props**:
- `features`: Array of { title, description, icon? }
- `columns`: 2 | 3 | 4
- `className`: Additional classes

**Features**:
- Spotlight hover effect
- Responsive columns
- Animated on scroll
- Icon support

---

### FeatureShowcase
Side-by-side feature presentation with image.

```tsx
import { FeatureShowcase } from '@/components/recipes/features'

<FeatureShowcase
  title="Built for Modern Teams"
  description="Everything you need to collaborate"
  features={[
    { title: 'Drag & Drop', description: 'Intuitive interface' },
    { title: 'Real-time Sync', description: 'Instant updates' },
  ]}
  imageSide="right"
/>
```

**Props**:
- `title`: Main heading
- `description`: Supporting text
- `features`: Array of { title, description }
- `imageSide`: 'left' | 'right'
- `className`: Additional classes

**Features**:
- Split layout
- Numbered feature list
- Animated entrance
- Placeholder for image/component

---

## ✨ Interactive Effects

### SpotlightCard
Card with cursor-following spotlight effect.

```tsx
import { SpotlightCard } from '@/components/recipes/effects'

<SpotlightCard spotlightColor="255, 255, 255">
  <h3>Your Content</h3>
  <p>Spotlight follows your cursor</p>
</SpotlightCard>
```

**Props**:
- `spotlightColor`: RGB string (default: '255, 255, 255')
- `className`: Additional classes

**Features**:
- Cursor-tracking spotlight
- Smooth gradient effect
- Hover border highlight
- Customizable colors

---

### GlowingCard
Card with hover glow effect.

```tsx
import { GlowingCard } from '@/components/recipes/effects'

<GlowingCard 
  glowColor="139, 92, 246" 
  intensity="high"
>
  <h3>Glowing Content</h3>
  <p>Hover to see the glow</p>
</GlowingCard>
```

**Props**:
- `glowColor`: RGB string (default: '139, 92, 246')
- `intensity`: 'low' | 'medium' | 'high'
- `className`: Additional classes

**Features**:
- Hover glow effect
- Subtle scale on hover
- Customizable color and intensity
- Smooth transitions

---

### GradientBackground
Animated gradient backgrounds.

```tsx
import { GradientBackground } from '@/components/recipes/effects'

<div className="relative">
  <GradientBackground variant="aurora" animate={true} />
  {/* Your content */}
</div>
```

**Props**:
- `variant`: 'aurora' | 'mesh' | 'radial' | 'conic'
- `animate`: boolean (default: true)
- `className`: Additional classes

**Variants**:
- **aurora**: Purple, pink, blue gradient
- **mesh**: Radial gradient mesh
- **radial**: Centered radial gradient
- **conic**: Rotating conic gradient

---

## 🎬 Animation Presets

Use pre-configured Framer Motion variants:

```tsx
import { fadeInUp, staggerContainer, staggerItem } from '@/components/recipes/animations'
import { motion } from 'framer-motion'

// Single element
<motion.div variants={fadeInUp} initial="hidden" animate="visible">
  Content
</motion.div>

// Stagger children
<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  <motion.div variants={staggerItem}>Item 1</motion.div>
  <motion.div variants={staggerItem}>Item 2</motion.div>
  <motion.div variants={staggerItem}>Item 3</motion.div>
</motion.div>
```

### Available Presets

**Entrance Animations**:
- `fadeIn` - Simple fade in
- `fadeInUp` - Fade in from below
- `fadeInDown` - Fade in from above
- `fadeInLeft` - Fade in from left
- `fadeInRight` - Fade in from right
- `scaleIn` - Scale up fade in
- `slideInUp` - Slide up entrance
- `slideInDown` - Slide down entrance

**List Animations**:
- `staggerContainer` - Container for staggered children
- `staggerItem` - Individual staggered item

**Hover Effects**:
- `hoverLift` - Lift on hover
- `hoverScale` - Scale on hover
- `hoverGlow` - Glow on hover

**Scroll Animations**:
- `scrollFadeIn` - Fade in when scrolling into view
- `scrollScale` - Scale when scrolling into view

**Continuous Animations**:
- `float` - Floating animation
- `pulse` - Pulsing animation
- `rotate` - Rotating animation

**Page Transitions**:
- `pageTransition` - For page route transitions

---

## 🎯 Complete Example

Building a landing page with recipes:

```tsx
import { 
  HeroGradient, 
  FeatureGrid, 
  BentoGrid, 
  FeatureShowcase 
} from '@/components/recipes'

export function LandingPage() {
  const features = [
    { title: 'Fast', description: 'Lightning fast', icon: '⚡' },
    { title: 'Secure', description: 'Bank-grade security', icon: '🔒' },
    { title: 'Beautiful', description: 'Stunning design', icon: '🎨' },
  ]

  const bentoItems = [
    { title: 'Performance', description: 'Optimized', icon: '🚀', span: 'col' },
    { title: 'Scalable', description: 'Grows with you', icon: '📈' },
    { title: 'Developer Friendly', description: 'Built for devs', icon: '💻', span: 'row' },
  ]

  return (
    <>
      <HeroGradient
        title="Build Amazing Products"
        subtitle="The fastest way to ship beautiful applications"
        primaryCta="Start Free Trial"
        secondaryCta="View Demo"
      />

      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Everything You Need
          </h2>
          <FeatureGrid features={features} columns={3} />
        </div>
      </section>

      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12">
            Powerful Features
          </h2>
          <BentoGrid items={bentoItems} />
        </div>
      </section>

      <FeatureShowcase
        title="Built for Teams"
        description="Collaborate effectively"
        features={[
          { title: 'Real-time', description: 'Sync instantly' },
          { title: 'Secure', description: 'Enterprise-grade' },
        ]}
        imageSide="right"
      />
    </>
  )
}
```

---

## 🎨 Customization

All recipes accept `className` prop for Tailwind customization:

```tsx
<HeroGradient
  className="min-h-[80vh]" // Custom height
  title="..."
/>

<FeatureGrid
  className="gap-8" // Custom gap
  features={...}
/>
```

### Custom Colors

Many components accept color props in RGB format:

```tsx
<SpotlightCard spotlightColor="255, 100, 100"> // Red spotlight
<GlowingCard glowColor="0, 255, 0"> // Green glow
```

### Custom Animations

Override animation variants:

```tsx
import { motion } from 'framer-motion'

<motion.div
  initial={{ opacity: 0, y: 50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
>
  Custom animation
</motion.div>
```

---

## 🎯 Best Practices

1. **Performance**: Recipes use `whileInView` for scroll animations - they only animate when visible
2. **Accessibility**: All recipes maintain semantic HTML and keyboard navigation
3. **Responsive**: Test on mobile - all recipes are mobile-first
4. **Theming**: Recipes use theme tokens - they adapt to your theme automatically
5. **Loading**: Large animations? Consider lazy loading for better initial page load

---

## 📊 Recipe Comparison

| Recipe | Complexity | Animation | Best For |
|--------|-----------|-----------|----------|
| HeroGradient | Medium | Heavy | Landing pages, wow factor |
| HeroSpotlight | Medium | Medium | SaaS products, apps |
| HeroMinimal | Low | Light | Content sites, blogs |
| BentoGrid | Medium | Light | Feature showcases |
| FeatureGrid | Medium | Medium | Product features |
| FeatureShowcase | Low | Light | Detailed explanations |
| SpotlightCard | Low | Medium | Interactive sections |
| GlowingCard | Low | Light | CTAs, highlights |

---

## 🚀 Demo Page

Visit `/recipes` to see all components in action with interactive examples and code snippets.

---

## 🤝 Contributing

Want to add more recipes? Follow this pattern:

1. Create component in `src/components/recipes/[category]/`
2. Use Framer Motion for animations
3. Accept standard props (title, description, className)
4. Make it responsive
5. Add to demo page
6. Document in this file

---

## 📚 Related Documentation

- [Design System](./DESIGN_SYSTEM.md) - Theme system and tokens
- [README](./README.md) - Full project documentation
- [Framer Motion Docs](https://www.framer.com/motion/) - Animation library

---

## 💡 Tips for AI Generation

When using AI to generate UIs with these recipes:

1. **Specify the recipe name**: "Use HeroGradient for the landing page"
2. **Describe the content**: "Title should be 'Build Amazing Products'"
3. **Mention layout**: "Use BentoGrid with 5 items, first one spans 2 columns"
4. **Reference effects**: "Add SpotlightCard effect to feature cards"
5. **Combine recipes**: "HeroSpotlight at top, then FeatureGrid, then FeatureShowcase"

This helps AI understand your intent and generate appropriate code quickly.

