# Creating Brand-Aware Components

Complete guide to building new recipes and layouts that automatically adapt to your brand configuration.

---

## 🎯 Core Principle

**Every component should:**
1. Read brand configuration via `useBrand()` hook
2. Adapt styling based on `config` values
3. Use brand classes instead of hardcoded values
4. Support all 8 brand flavors automatically

---

## 🔧 Essential Imports

Every brand-aware component needs these:

```tsx
import { cn } from '@/lib/utils'
import { useBrand } from '@/hooks/useBrand'
import { motion } from 'framer-motion'  // For animations
```

---

## 📝 Component Template

### Basic Structure

```tsx
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useBrand } from '@/hooks/useBrand'
import { ReactNode } from 'react'

export interface YourComponentProps {
  // Content props
  title: string
  description?: string
  
  // Optional customization
  className?: string
  children?: ReactNode
}

/**
 * YourComponent - Brief description
 * 
 * Perfect for: Use cases
 * Features: Key features
 * 
 * @example
 * ```tsx
 * <YourComponent
 *   title="Example"
 *   description="Description"
 * />
 * ```
 */
export function YourComponent({
  title,
  description,
  className,
  children,
}: YourComponentProps) {
  // 1. Get brand configuration
  const { config, classes } = useBrand()
  
  // 2. Use brand config to make decisions
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        // 3. Apply brand classes
        classes.sectionPadding,
        
        // 4. Conditional styling based on config
        config.backgroundTreatment === 'gradient' && 'bg-gradient-to-br from-background to-muted/20',
        config.preferredCardStyle === 'elevated' && classes.shadow,
        config.preferredCardStyle === 'glass' && 'bg-background/50 backdrop-blur',
        config.preferredCardStyle === 'bordered' && 'border-2',
        
        // 5. Allow customization
        className
      )}
    >
      <div className={classes.container}>
        <h2 className={cn(
          'text-3xl font-bold',
          classes.headingTracking  // Brand-aware typography
        )}>
          {title}
        </h2>
        
        {description && (
          <p className="text-muted-foreground">{description}</p>
        )}
        
        {children}
      </div>
    </motion.section>
  )
}
```

---

## 🎨 Brand Configuration Reference

### Available Config Properties

```typescript
const { config, classes } = useBrand()

// Flavor & Identity
config.flavor                    // 'minimal' | 'bold' | 'playful' | etc.
config.industry                  // 'saas' | 'ecommerce' | 'finance' | etc.
config.audience                  // 'b2b' | 'b2c' | 'developer' | etc.

// Visual Style
config.colorVibrancy             // 'muted' | 'balanced' | 'vibrant'
config.borderRadius              // 'none' | 'sm' | 'md' | 'lg' | 'full'
config.shadowIntensity           // 'none' | 'subtle' | 'normal' | 'dramatic'

// Layout
config.spacing                   // 'tight' | 'comfortable' | 'spacious'
config.containerWidth            // 'narrow' | 'normal' | 'wide' | 'full'

// Animations
config.animations                // 'subtle' | 'moderate' | 'playful'
config.transitionSpeed           // 'fast' | 'normal' | 'slow'

// Component Preferences
config.preferredHero             // 'minimal' | 'gradient' | 'spotlight' | etc.
config.preferredFeatureLayout    // 'grid' | 'bento' | 'showcase'
config.preferredCardStyle        // 'flat' | 'elevated' | 'bordered' | 'glass'

// Background
config.backgroundTreatment       // 'solid' | 'gradient' | 'pattern' | 'mesh'

// Theme
config.theme                     // 'default-light' | 'tech-dark' | etc.
```

### Available Brand Classes

```typescript
// Pre-computed Tailwind classes based on brand config
classes.sectionPadding           // 'py-12' | 'py-20' | 'py-32'
classes.cardPadding              // 'p-4' | 'p-6' | 'p-8'
classes.container                // 'max-w-4xl' | 'max-w-6xl' | 'max-w-7xl' | 'max-w-full'
classes.borderRadius             // 'rounded-sm' | 'rounded-md' | etc.
classes.shadow                   // 'shadow-sm' | 'shadow-md' | 'shadow-xl'
classes.headingTracking          // 'tracking-tight' | 'tracking-normal' | 'tracking-wide'
classes.bodySize                 // 'text-sm' | 'text-base' | 'text-lg'
classes.transition               // 'transition-all duration-150' | etc.
```

---

## 🎨 Common Patterns

### Pattern 1: Card Styling

```tsx
function YourCard({ children }: { children: ReactNode }) {
  const { config, classes } = useBrand()
  
  return (
    <div className={cn(
      'relative overflow-hidden',
      classes.cardPadding,
      classes.borderRadius,
      
      // Adapt card style to brand
      config.preferredCardStyle === 'flat' && 'bg-background',
      config.preferredCardStyle === 'elevated' && cn('bg-background', classes.shadow),
      config.preferredCardStyle === 'bordered' && 'border-2 border-border',
      config.preferredCardStyle === 'glass' && 'bg-background/50 backdrop-blur border border-border/50',
    )}>
      {children}
    </div>
  )
}
```

### Pattern 2: Spacing

```tsx
function YourSection({ children }: { children: ReactNode }) {
  const { classes } = useBrand()
  
  return (
    <section className={classes.sectionPadding}>
      <div className={classes.container}>
        {children}
      </div>
    </section>
  )
}
```

### Pattern 3: Background Treatment

```tsx
function YourHero({ children }: { children: ReactNode }) {
  const { config } = useBrand()
  
  return (
    <div className={cn(
      'relative',
      config.backgroundTreatment === 'solid' && 'bg-background',
      config.backgroundTreatment === 'gradient' && 'bg-gradient-to-br from-background via-muted/20 to-background',
      config.backgroundTreatment === 'mesh' && 'bg-background',
      // Add mesh pattern overlay if needed
    )}>
      {config.backgroundTreatment === 'mesh' && (
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      )}
      {children}
    </div>
  )
}
```

### Pattern 4: Color Vibrancy

```tsx
function YourIconBox({ icon: Icon }: { icon: LucideIcon }) {
  const { config } = useBrand()
  
  return (
    <div className={cn(
      'flex items-center justify-center rounded-lg p-3',
      
      // Adapt color intensity to brand
      config.colorVibrancy === 'muted' && 'bg-muted text-muted-foreground',
      config.colorVibrancy === 'balanced' && 'bg-primary/10 text-primary',
      config.colorVibrancy === 'vibrant' && 'bg-gradient-to-br from-primary to-accent text-white',
    )}>
      <Icon className="h-6 w-6" />
    </div>
  )
}
```

### Pattern 5: Animations

```tsx
import { useBrandAnimations } from '@/hooks/useBrand'

function YourAnimatedComponent({ children }: { children: ReactNode }) {
  const animations = useBrandAnimations()
  
  return (
    <motion.div {...animations.fadeInUp}>
      {children}
    </motion.div>
  )
}
```

### Pattern 6: Typography

```tsx
function YourHeading({ children }: { children: ReactNode }) {
  const { classes } = useBrand()
  
  return (
    <h2 className={cn(
      'text-4xl font-bold',
      classes.headingTracking  // 'tracking-tight' | 'tracking-normal' | 'tracking-wide'
    )}>
      {children}
    </h2>
  )
}
```

---

## 🎯 Decision Trees

### When to Show Different Variants

```tsx
function SmartComponent() {
  const { config } = useBrand()
  
  // Decision based on brand flavor
  if (config.flavor === 'minimal' || config.flavor === 'luxury') {
    return <MinimalVariant />
  }
  
  if (config.flavor === 'bold' || config.flavor === 'playful') {
    return <BoldVariant />
  }
  
  if (config.flavor === 'corporate' || config.flavor === 'professional') {
    return <CorporateVariant />
  }
  
  return <DefaultVariant />
}
```

### Component Selection Based on Config

```tsx
function SmartHero({ title, subtitle }: HeroProps) {
  const { config } = useBrand()
  
  // Let brand config choose the hero type
  switch (config.preferredHero) {
    case 'minimal':
      return <HeroMinimal title={title} subtitle={subtitle} />
    case 'gradient':
      return <HeroGradient title={title} subtitle={subtitle} />
    case 'spotlight':
      return <HeroSpotlight title={title} subtitle={subtitle} />
    case 'split':
      return <HeroSplit title={title} subtitle={subtitle} />
    default:
      return <HeroGradient title={title} subtitle={subtitle} />
  }
}
```

---

## 📚 Real-World Examples

### Example 1: Pricing Card

```tsx
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBrand } from '@/hooks/useBrand'

export interface PricingCardProps {
  name: string
  price: string
  period?: string
  features: string[]
  cta: string
  highlighted?: boolean
  onCtaClick?: () => void
}

export function PricingCard({
  name,
  price,
  period,
  features,
  cta,
  highlighted = false,
  onCtaClick,
}: PricingCardProps) {
  const { config, classes } = useBrand()
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <Card className={cn(
        'relative p-8',
        classes.transition,
        
        // Highlight treatment
        highlighted && 'border-primary border-2',
        highlighted && config.preferredCardStyle === 'elevated' && 'shadow-xl',
        
        // Card style based on brand
        config.preferredCardStyle === 'glass' && 'bg-background/50 backdrop-blur',
        config.preferredCardStyle === 'elevated' && !highlighted && classes.shadow,
        config.preferredCardStyle === 'bordered' && 'border-2',
      )}>
        {/* Popular badge */}
        {highlighted && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <Badge className={cn(
              config.colorVibrancy === 'vibrant' 
                ? 'bg-gradient-to-r from-primary to-accent'
                : 'bg-primary'
            )}>
              Most Popular
            </Badge>
          </div>
        )}
        
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className={cn('text-2xl font-bold', classes.headingTracking)}>
            {name}
          </h3>
        </div>
        
        {/* Price */}
        <div className="text-center mb-6">
          <span className="text-5xl font-bold">{price}</span>
          {period && (
            <span className="text-muted-foreground ml-2">{period}</span>
          )}
        </div>
        
        {/* CTA */}
        <Button
          onClick={onCtaClick}
          className="w-full mb-6"
          size="lg"
          variant={highlighted ? 'default' : 'outline'}
        >
          {cta}
        </Button>
        
        {/* Features */}
        <div className={cn(
          'space-y-3',
          config.spacing === 'spacious' && 'space-y-4'
        )}>
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-2">
              <Check className={cn(
                'h-5 w-5 flex-shrink-0 mt-0.5',
                config.colorVibrancy === 'vibrant' ? 'text-primary' : 'text-muted-foreground'
              )} />
              <span className={classes.bodySize}>{feature}</span>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  )
}
```

### Example 2: Testimonial Section

```tsx
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBrand, useBrandAnimations } from '@/hooks/useBrand'

export interface Testimonial {
  id: string
  quote: string
  author: string
  role: string
  avatar?: string
  rating?: number
}

export interface TestimonialSectionProps {
  title?: string
  subtitle?: string
  testimonials: Testimonial[]
}

export function TestimonialSection({
  title = "What our customers say",
  subtitle,
  testimonials,
}: TestimonialSectionProps) {
  const { config, classes } = useBrand()
  const animations = useBrandAnimations()
  
  return (
    <section className={cn(
      classes.sectionPadding,
      config.backgroundTreatment === 'gradient' && 'bg-gradient-to-b from-muted/20 to-background'
    )}>
      <div className={classes.container}>
        {/* Header */}
        <motion.div 
          {...animations.fadeInUp}
          className="text-center mb-12"
        >
          <h2 className={cn(
            'text-4xl font-bold mb-4',
            classes.headingTracking
          )}>
            {title}
          </h2>
          {subtitle && (
            <p className={cn('text-muted-foreground', classes.bodySize)}>
              {subtitle}
            </p>
          )}
        </motion.div>
        
        {/* Testimonials Grid */}
        <motion.div
          variants={animations.staggerContainer}
          initial="hidden"
          whileInView="animate"
          viewport={{ once: true }}
          className={cn(
            'grid gap-6',
            testimonials.length === 1 && 'max-w-2xl mx-auto',
            testimonials.length === 2 && 'md:grid-cols-2',
            testimonials.length >= 3 && 'md:grid-cols-2 lg:grid-cols-3',
          )}
        >
          {testimonials.map((testimonial) => (
            <motion.div key={testimonial.id} {...animations.fadeInUp}>
              <Card className={cn(
                classes.cardPadding,
                config.preferredCardStyle === 'elevated' && classes.shadow,
                config.preferredCardStyle === 'glass' && 'bg-background/50 backdrop-blur',
                config.preferredCardStyle === 'bordered' && 'border-2',
                'h-full flex flex-col'
              )}>
                {/* Rating */}
                {testimonial.rating && (
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          'h-4 w-4',
                          i < testimonial.rating!
                            ? 'fill-primary text-primary'
                            : 'text-muted-foreground'
                        )}
                      />
                    ))}
                  </div>
                )}
                
                {/* Quote */}
                <blockquote className={cn(
                  'flex-1 mb-6',
                  classes.bodySize
                )}>
                  "{testimonial.quote}"
                </blockquote>
                
                {/* Author */}
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={testimonial.avatar} />
                    <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{testimonial.author}</p>
                    <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
```

### Example 3: Call-to-Action Banner

```tsx
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBrand } from '@/hooks/useBrand'

export interface CTABannerProps {
  title: string
  description: string
  primaryCta: string
  onPrimaryClick?: () => void
  secondaryCta?: string
  onSecondaryClick?: () => void
}

export function CTABanner({
  title,
  description,
  primaryCta,
  onPrimaryClick,
  secondaryCta,
  onSecondaryClick,
}: CTABannerProps) {
  const { config, classes } = useBrand()
  
  return (
    <section className={cn(
      classes.sectionPadding,
      'relative overflow-hidden'
    )}>
      {/* Background treatment */}
      {config.backgroundTreatment === 'gradient' && (
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10" />
      )}
      
      {/* Decorative elements for vibrant brands */}
      {config.colorVibrancy === 'vibrant' && (
        <>
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
        </>
      )}
      
      <div className={cn(classes.container, 'relative z-10')}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className={cn(
            'text-center max-w-3xl mx-auto',
            classes.cardPadding,
            config.preferredCardStyle === 'elevated' && cn('bg-background', classes.shadow, classes.borderRadius),
            config.preferredCardStyle === 'glass' && cn('bg-background/80 backdrop-blur', classes.borderRadius, 'border border-border'),
            config.preferredCardStyle === 'bordered' && cn('bg-background border-2 border-primary/20', classes.borderRadius),
          )}
        >
          <h2 className={cn(
            'text-3xl md:text-4xl font-bold mb-4',
            classes.headingTracking
          )}>
            {title}
          </h2>
          
          <p className={cn(
            'text-muted-foreground mb-8',
            classes.bodySize
          )}>
            {description}
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center">
            <Button 
              size="lg" 
              onClick={onPrimaryClick}
              className={cn(
                classes.shadow,
                config.colorVibrancy === 'vibrant' && 'bg-gradient-to-r from-primary to-accent'
              )}
            >
              {primaryCta}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            
            {secondaryCta && (
              <Button 
                size="lg" 
                variant="outline"
                onClick={onSecondaryClick}
              >
                {secondaryCta}
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
```

---

## ✅ Checklist for Brand-Aware Components

When creating a new component, ensure:

### Required
- [ ] Imports `useBrand()` hook
- [ ] Destructures `config` and/or `classes`
- [ ] Uses `classes.sectionPadding` for sections
- [ ] Uses `classes.container` for content wrappers
- [ ] Uses `classes.cardPadding` for card interiors
- [ ] Applies conditional styling based on `config.preferredCardStyle`
- [ ] Respects `config.backgroundTreatment`
- [ ] Allows custom `className` prop for overrides

### Recommended
- [ ] Uses `useBrandAnimations()` for motion
- [ ] Adapts to `config.colorVibrancy`
- [ ] Respects `config.spacing` density
- [ ] Uses `classes.headingTracking` for typography
- [ ] Considers `config.flavor` for variant selection
- [ ] Provides TypeScript types
- [ ] Includes JSDoc with examples
- [ ] Handles responsive breakpoints

### Optional
- [ ] Adapts to `config.industry` or `config.audience`
- [ ] Provides multiple variants based on flavor
- [ ] Includes loading states
- [ ] Includes error states
- [ ] Supports dark mode explicitly

---

## 🎨 Testing Your Component

Test your component with different brand flavors:

```tsx
// In your test/demo file
import { activeFlavor } from '@/config/brand'

// Try these flavors:
const flavors = [
  'minimal',      // Should be clean, spacious, no effects
  'bold',         // Should be vibrant, tight, dramatic
  'playful',      // Should be colorful, fun, animated
  'corporate',    // Should be professional, bordered, muted
  'luxury',       // Should be elegant, spacious, minimal
  'tech',         // Should be glass, futuristic, modern
  'warm',         // Should be friendly, comfortable, inviting
  'dark',         // Should be dramatic, high contrast, sleek
]

// Change activeFlavor in brand.ts and verify your component adapts
```

---

## 💡 Pro Tips

### 1. Always Start with Brand Hook

```tsx
function MyComponent() {
  const { config, classes } = useBrand()  // First line!
  // ... rest of component
}
```

### 2. Use Compound Conditions

```tsx
className={cn(
  // Base styles
  'relative overflow-hidden',
  
  // Brand-aware styles
  config.preferredCardStyle === 'elevated' && classes.shadow,
  config.preferredCardStyle === 'glass' && 'backdrop-blur',
  
  // Flavor-specific
  (config.flavor === 'bold' || config.flavor === 'playful') && 'border-2 border-primary',
  
  // Allow customization
  className
)}
```

### 3. Create Helper Functions

```tsx
function getCardClasses(config: BrandFlavorConfig) {
  return cn(
    'relative',
    config.preferredCardStyle === 'flat' && 'bg-background',
    config.preferredCardStyle === 'elevated' && 'bg-background shadow-lg',
    config.preferredCardStyle === 'bordered' && 'border-2',
    config.preferredCardStyle === 'glass' && 'bg-background/50 backdrop-blur',
  )
}
```

### 4. Document Brand Behavior

```tsx
/**
 * MyComponent - Description
 * 
 * Brand Adaptations:
 * - Minimal: Spacious padding, no shadows, clean lines
 * - Bold: Tight padding, strong shadows, vibrant colors
 * - Corporate: Bordered cards, professional spacing
 * - Tech: Glass morphism, futuristic effects
 */
```

---

## 🚀 Quick Reference

### Import This

```tsx
import { cn } from '@/lib/utils'
import { useBrand, useBrandAnimations } from '@/hooks/useBrand'
import { motion } from 'framer-motion'
```

### Start Like This

```tsx
export function YourComponent(props: YourComponentProps) {
  const { config, classes } = useBrand()
  const animations = useBrandAnimations()
  
  return (
    <motion.section className={classes.sectionPadding}>
      <div className={classes.container}>
        {/* Your content */}
      </div>
    </motion.section>
  )
}
```

### Style Like This

```tsx
<div className={cn(
  classes.cardPadding,
  classes.borderRadius,
  config.preferredCardStyle === 'elevated' && classes.shadow,
  className  // Always allow override
)}>
```

---

## ✅ Summary

**To create brand-aware components:**

1. **Import** `useBrand()` hook
2. **Destructure** `config` and `classes`
3. **Use** brand classes for spacing/typography
4. **Adapt** styling based on config properties
5. **Test** with multiple brand flavors
6. **Document** brand adaptations

**Result:** Components that automatically look perfect in any brand flavor! 🎨

