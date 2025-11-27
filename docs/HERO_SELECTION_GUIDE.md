# Hero Section Selection Guide

Stop using the same generic centered hero for every project. This guide helps you choose the perfect hero layout for your product and brand.

---

## 🎯 The Problem

**That hero in your screenshot** (centered text, two buttons, gradient background) is overused because:
- It's the default in most templates
- AI defaults to it when lacking context
- It's "safe" but generic
- Doesn't differentiate your product

**Result**: Every site looks the same.

---

## 🎨 7 Hero Variants Available

| Hero Type | Best For | Style | Conversion Focus |
|-----------|----------|-------|------------------|
| **HeroMinimal** | Clean SaaS, tools | Minimal, text-focused | Medium |
| **HeroGradient** | Startups, apps | Colorful, energetic | Medium |
| **HeroSpotlight** | Enterprise B2B | Professional, split | High |
| **HeroSplit** | Product demos | Visual + content | High |
| **HeroVideo** | Apps, games, events | Immersive video | Low-Medium |
| **HeroProduct** | E-commerce, launches | Product showcase | Very High |
| **HeroCTA** | Pricing pages, campaigns | Conversion-optimized | Very High |

---

## 📐 Detailed Hero Breakdown

### 1. HeroMinimal

**Layout**: Centered text, minimal design  
**When to use**: Clean SaaS products, developer tools, minimal brands  
**Brand flavors**: minimal, luxury, corporate  

**Characteristics**:
- Maximum whitespace
- Typography-focused
- No gradients or effects
- Simple, direct messaging

**Example use cases**:
- Productivity tools
- Note-taking apps
- API documentation sites
- Portfolio sites

```tsx
<HeroMinimal
  title="Focus on What Matters"
  subtitle="The simplest way to manage your tasks"
  primaryCta="Start Free"
  secondaryCta="Learn More"
/>
```

**Why it works**: Lets content breathe, feels premium, no visual noise competing with message.

---

### 2. HeroGradient

**Layout**: Centered with animated gradient + floating orbs  
**When to use**: Startups, modern apps, playful brands  
**Brand flavors**: bold, playful, warm  

**Characteristics**:
- Animated gradient background
- Floating orbs/shapes
- Energetic, modern feel
- Multiple colors

**Example use cases**:
- Startup landing pages
- Consumer apps
- Creative tools
- Community platforms

```tsx
<HeroGradient
  title="Build Something Amazing"
  subtitle="The platform that grows with you"
  primaryCta="Get Started"
/>
```

**Why it works**: Eye-catching, modern, conveys energy and innovation.

---

### 3. HeroSpotlight

**Layout**: Split screen with spotlight effect  
**When to use**: Enterprise software, B2B services, professional products  
**Brand flavors**: corporate, professional, tech  

**Characteristics**:
- Dramatic spotlight lighting
- Split content/visual layout
- Professional aesthetic
- Trust-building

**Example use cases**:
- Enterprise SaaS
- Financial services
- Legal tech
- Healthcare platforms

```tsx
<HeroSpotlight
  title="Enterprise-Grade Security"
  subtitle="Trusted by Fortune 500 companies"
  primaryCta="Request Demo"
  secondaryCta="View Case Studies"
/>
```

**Why it works**: Builds trust, looks expensive, perfect for B2B decision-makers.

---

### 4. HeroSplit 🆕

**Layout**: Content on one side, image/video on other  
**When to use**: Products with strong visuals, app screenshots, demos  
**Brand flavors**: tech, corporate, warm  

**Characteristics**:
- 50/50 split layout
- Product screenshot/mockup
- Clear value proposition
- Feature highlights

**Example use cases**:
- Mobile apps
- Desktop software
- Design tools
- Dashboard products

```tsx
<HeroSplit
  badge="New Release"
  title="Meet Your AI Assistant"
  subtitle="Automate your workflow with intelligent automation"
  primaryCta="Try It Free"
  image="/app-screenshot.png"
  imagePosition="right"
  features={[
    { text: "No credit card required" },
    { text: "14-day free trial" },
    { text: "Cancel anytime" },
  ]}
/>
```

**Why it works**: Shows the actual product immediately, reduces cognitive load, builds credibility.

---

### 5. HeroVideo 🆕

**Layout**: Full-width video background with overlay content  
**When to use**: Apps, games, events, creative products  
**Brand flavors**: playful, gaming, dark, creative  

**Characteristics**:
- Immersive video background
- Overlay content
- Video controls
- Dramatic, cinematic

**Example use cases**:
- Gaming platforms
- Video editing software
- Event sites
- Creative agencies
- Travel/lifestyle brands

```tsx
<HeroVideo
  title="Experience the Future"
  subtitle="Revolutionary platform that changes everything"
  primaryCta="Watch Demo"
  videoUrl="/hero-video.mp4"
  posterImage="/poster.jpg"
  overlayOpacity={50}
  contentPosition="center"
/>
```

**Why it works**: Immersive, emotional impact, shows product in action, memorable.

---

### 6. HeroProduct 🆕

**Layout**: Product showcase with pricing and social proof  
**When to use**: E-commerce, product launches, physical products  
**Brand flavors**: warm, playful, bold  

**Characteristics**:
- Product images prominently displayed
- Pricing visible
- Star ratings
- Trust badges
- "Buy now" focused

**Example use cases**:
- E-commerce products
- SaaS product launches
- Physical products
- Course sales pages

```tsx
<HeroProduct
  badge="Limited Edition"
  title="Premium Wireless Headphones"
  subtitle="Studio-quality sound meets modern design"
  price={{ amount: "$299", originalPrice: "$399" }}
  rating={{ score: 4.8, count: 1234 }}
  primaryCta="Buy Now"
  productImage="/product.png"
  keyFeatures={[
    "Free shipping worldwide",
    "2-year warranty",
    "30-day money-back guarantee"
  ]}
  trustBadges={[
    { text: "Secure Checkout" },
    { text: "Free Returns" }
  ]}
/>
```

**Why it works**: Addresses purchase objections immediately, builds trust, optimized for conversion.

---

### 7. HeroCTA 🆕

**Layout**: Conversion-focused with pricing tiers or email capture  
**When to use**: Pricing pages, campaigns, lead generation  
**Brand flavors**: bold, corporate, professional  

**Characteristics**:
- Clear pricing tiers
- Email capture form
- Social proof (logos, testimonials)
- Guarantee text
- Optimized for conversions

**Example use cases**:
- SaaS pricing pages
- Product launch campaigns
- Webinar signups
- Newsletter subscriptions

```tsx
<HeroCTA
  badge="Limited Time Offer"
  title="Start Building Today"
  subtitle="Choose the perfect plan for your needs"
  showEmailCapture
  emailCta="Start Free Trial"
  pricingTiers={[
    {
      name: "Starter",
      price: "$29",
      period: "/ month",
      features: ["10 projects", "5GB storage", "Email support"],
      cta: "Start Free Trial",
      highlighted: true
    }
  ]}
  guaranteeText="No credit card required. Cancel anytime."
  customerLogos={["/logo1.png", "/logo2.png"]}
/>
```

**Why it works**: Removes friction, shows options clearly, builds trust, focused on single goal (conversion).

---

## 🤖 AI Agent Decision Tree

When AI generates a hero, it should follow this logic:

### Step 1: Determine Industry/Product Type

```typescript
if (industry === 'ecommerce' || productType === 'physical') {
  return <HeroProduct />
}

if (industry === 'gaming' || industry === 'entertainment') {
  return <HeroVideo />
}

if (goal === 'conversion' || page === 'pricing') {
  return <HeroCTA />
}

if (needsProductDemo || hasStrongVisuals) {
  return <HeroSplit />
}

if (audience === 'enterprise' || industry === 'finance') {
  return <HeroSpotlight />
}

if (brandFlavor === 'minimal' || brandFlavor === 'luxury') {
  return <HeroMinimal />
}

// Default for modern startups
return <HeroGradient />
```

### Step 2: Check Brand Flavor

```typescript
const { config } = useBrand()

// Brand flavor influences which hero variant to use
switch (config.flavor) {
  case 'minimal':
  case 'luxury':
    return <HeroMinimal />
  
  case 'corporate':
  case 'professional':
    return config.industry === 'finance' ? <HeroSplit /> : <HeroSpotlight />
  
  case 'playful':
  case 'bold':
    return <HeroGradient />
  
  case 'tech':
    return <HeroSplit /> // Show the product
  
  case 'gaming':
  case 'dark':
    return <HeroVideo />
  
  case 'warm':
    return <HeroProduct /> // E-commerce friendly
  
  default:
    return <HeroGradient />
}
```

### Step 3: Consider Page Context

```typescript
// Different heroes for different pages
const heroByPage = {
  '/': brandFlavor === 'minimal' ? <HeroMinimal /> : <HeroGradient />,
  '/pricing': <HeroCTA />,
  '/product': <HeroProduct />,
  '/demo': <HeroVideo />,
  '/enterprise': <HeroSpotlight />,
  '/features': <HeroSplit />,
}
```

---

## 📊 Quick Selection Matrix

| Your Goal | Recommended Hero | Alternative |
|-----------|------------------|-------------|
| **Show product/app** | HeroSplit | HeroVideo |
| **Generate leads** | HeroCTA | HeroSplit |
| **Sell physical product** | HeroProduct | HeroSplit |
| **Enterprise credibility** | HeroSpotlight | HeroSplit |
| **Immersive experience** | HeroVideo | HeroGradient |
| **Clean, minimal** | HeroMinimal | HeroSplit |
| **Modern startup** | HeroGradient | HeroSplit |
| **Pricing page** | HeroCTA | HeroMinimal |

---

## 🎨 Customization Props

All heroes support these common props:

```typescript
interface CommonHeroProps {
  // Content
  badge?: string               // Small badge above title
  title: string               // Main headline
  subtitle: string            // Supporting text
  
  // Actions
  primaryCta: string          // Main button text
  onPrimaryClick?: () => void
  secondaryCta?: string       // Optional second button
  onSecondaryClick?: () => void
  
  // Styling
  className?: string          // Additional classes
}
```

**Hero-specific props**:
- `HeroSplit`: `imagePosition`, `features`, `image`
- `HeroVideo`: `videoUrl`, `overlayOpacity`, `contentPosition`
- `HeroProduct`: `price`, `rating`, `keyFeatures`
- `HeroCTA`: `pricingTiers`, `showEmailCapture`

---

## 💡 Best Practices

### DO ✅

1. **Match hero to product type**
   - E-commerce → HeroProduct
   - SaaS → HeroSplit or HeroSpotlight
   - Games → HeroVideo

2. **Consider brand flavor**
   - Minimal → HeroMinimal
   - Bold → HeroGradient
   - Corporate → HeroSpotlight

3. **Optimize for goal**
   - Lead gen → HeroCTA
   - Product demo → HeroSplit
   - Trust building → HeroSpotlight

4. **Test different variants**
   - A/B test hero types
   - Measure conversion rates
   - Track engagement

### DON'T ❌

1. **Don't always use HeroGradient**
   - It's overused
   - Not suitable for all brands
   - Can feel generic

2. **Don't ignore context**
   - Pricing page needs HeroCTA
   - Don't use video hero everywhere
   - Match hero to page purpose

3. **Don't overcomplicate**
   - If minimal works, use it
   - Don't add video just because you can
   - Simple often converts better

---

## 📈 Conversion Optimization Tips

### High-Converting Hero Elements

1. **Clear Value Proposition** (all heroes)
   - What problem do you solve?
   - Why are you different?
   - What's the benefit?

2. **Social Proof** (HeroProduct, HeroCTA)
   - Customer logos
   - Ratings/reviews
   - Testimonials

3. **Visual Hierarchy** (all heroes)
   - Title largest (60-72px)
   - Subtitle medium (20-24px)
   - CTA prominent

4. **Friction Reduction** (HeroCTA, HeroSplit)
   - "No credit card required"
   - "14-day free trial"
   - "Cancel anytime"

5. **Product Visibility** (HeroSplit, HeroProduct)
   - Show the actual product
   - Use real screenshots
   - Demonstrate value visually

---

## 🚀 Implementation Example

```tsx
import { useBrand } from '@/hooks/useBrand'
import {
  HeroMinimal,
  HeroGradient,
  HeroSpotlight,
  HeroSplit,
  HeroVideo,
  HeroProduct,
  HeroCTA
} from '@/components/recipes/heroes'

export default function HomePage() {
  const { config } = useBrand()
  
  // Intelligent hero selection
  const renderHero = () => {
    // For e-commerce brands
    if (config.industry === 'ecommerce') {
      return (
        <HeroProduct
          title="Premium Wireless Headphones"
          subtitle="Studio-quality sound"
          price={{ amount: "$299" }}
          rating={{ score: 4.8, count: 1234 }}
          primaryCta="Buy Now"
          productImage="/product.png"
        />
      )
    }
    
    // For SaaS products
    if (config.industry === 'saas') {
      return (
        <HeroSplit
          title="Build Faster with AI"
          subtitle="Automate your workflow"
          primaryCta="Start Free Trial"
          image="/dashboard.png"
          features={[
            { text: "No credit card required" }
          ]}
        />
      )
    }
    
    // For gaming/entertainment
    if (config.industry === 'gaming') {
      return (
        <HeroVideo
          title="Epic Adventures Await"
          subtitle="Join millions of players worldwide"
          primaryCta="Play Now"
          videoUrl="/gameplay.mp4"
        />
      )
    }
    
    // Default based on brand flavor
    if (config.flavor === 'minimal') {
      return <HeroMinimal {...props} />
    }
    
    return <HeroGradient {...props} />
  }
  
  return <>{renderHero()}</>
}
```

---

## ✅ Summary

**Stop using the same hero everywhere.** Choose based on:

1. **Product type** (SaaS, e-commerce, game)
2. **Brand flavor** (minimal, bold, corporate)
3. **Page goal** (convert, inform, showcase)
4. **Audience** (B2B, B2C, developer)

**Result**: Unique, branded heroes that convert better and differentiate your product.

---

## 📚 See Also

- [BRAND_FLAVORS.md](./BRAND_FLAVORS.md) - Brand personality guide
- [AI_DESIGN_GUIDE.md](./AI_DESIGN_GUIDE.md) - Design principles
- [UI_PATTERNS.md](./UI_PATTERNS.md) - Complete patterns

