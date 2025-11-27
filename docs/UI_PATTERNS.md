# UI Patterns Library - Copy-Paste Ready

Professional UI patterns ready to use. Each pattern follows the design principles from `AI_DESIGN_GUIDE.md`.

## 🎯 Hero Sections

### Pattern 1: Bold Product Launch

```tsx
import { HeroGradient } from '@/components/recipes/heroes'
import { Button } from '@/components/ui/button'

<HeroGradient
  title="Ship Products 10x Faster"
  subtitle="The all-in-one platform that helps teams build, launch, and scale modern applications without the complexity"
  primaryCta="Start Free Trial"
  secondaryCta="Watch Demo"
  onPrimaryClick={() => navigate('/signup')}
  onSecondaryClick={() => setShowVideo(true)}
/>
```

### Pattern 2: Professional Service

```tsx
import { HeroMinimal } from '@/components/recipes/heroes'

<HeroMinimal
  title="Enterprise Solutions Built Right"
  subtitle="Trusted by 10,000+ companies worldwide"
  primaryCta="Get Started"
/>
```

### Pattern 3: Product Feature

```tsx
import { HeroSpotlight } from '@/components/recipes/heroes'

<HeroSpotlight
  title="Real-time Collaboration"
  subtitle="Work together seamlessly with your team, no matter where they are"
  primaryCta="Try It Free"
  secondaryCta="Learn More"
/>
```

---

## 📊 Feature Sections

### Pattern 1: Benefits Grid (3 columns)

```tsx
import { FeatureGrid } from '@/components/recipes/features'

const features = [
  { 
    icon: '⚡', 
    title: 'Lightning Fast', 
    description: 'Sub-second response times with optimized architecture and smart caching' 
  },
  { 
    icon: '🔒', 
    title: 'Bank-Grade Security', 
    description: 'Enterprise security with SOC 2 compliance and end-to-end encryption' 
  },
  { 
    icon: '🌍', 
    title: 'Global Scale', 
    description: 'Deploy to 200+ edge locations worldwide for minimal latency' 
  },
  { 
    icon: '🤖', 
    title: 'AI-Powered', 
    description: 'Smart automation that learns from your workflow and suggests improvements' 
  },
  { 
    icon: '📊', 
    title: 'Real-time Analytics', 
    description: 'Live dashboards with actionable insights and custom reporting' 
  },
  { 
    icon: '🔧', 
    title: 'Easy Integration', 
    description: 'Connect with 100+ tools via REST API, webhooks, and native integrations' 
  },
]

<section className="py-20 px-4">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16 space-y-4">
      <h2 className="text-4xl md:text-5xl font-bold">
        Built for Modern Teams
      </h2>
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
        Everything you need to build, ship, and scale your applications
      </p>
    </div>
    <FeatureGrid features={features} columns={3} />
  </div>
</section>
```

### Pattern 2: Bento Grid (Mixed sizes)

```tsx
import { BentoGrid } from '@/components/recipes/features'

const items = [
  { 
    title: 'Instant Deployment', 
    description: 'Push to production in seconds with zero-downtime deployments', 
    icon: '🚀',
    span: 'col' // Takes 2 columns
  },
  { 
    title: '99.99% Uptime', 
    description: 'Guaranteed availability with automated failover', 
    icon: '✅'
  },
  { 
    title: '24/7 Support', 
    description: 'Expert help whenever you need it', 
    icon: '💬'
  },
  { 
    title: 'Developer Experience', 
    description: 'Built by developers, for developers. Intuitive APIs, comprehensive docs, and helpful error messages that actually make sense.', 
    icon: '👨‍💻',
    span: 'row' // Takes 2 rows
  },
  { 
    title: 'Auto-Scaling', 
    description: 'Handles traffic spikes automatically', 
    icon: '📈'
  },
]

<section className="py-20 px-4 bg-muted/20">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-4xl font-bold text-center mb-12">
      Why Teams Choose Us
    </h2>
    <BentoGrid items={items} />
  </div>
</section>
```

### Pattern 3: Feature Showcase (Detailed)

```tsx
import { FeatureShowcase } from '@/components/recipes/features'

<FeatureShowcase
  title="Collaborate in Real-Time"
  description="See changes as they happen. No more refresh, no more conflicts, no more confusion."
  features={[
    { 
      title: 'Live Cursor Tracking', 
      description: 'See exactly where your teammates are working' 
    },
    { 
      title: 'Instant Sync', 
      description: 'Changes appear in milliseconds across all devices' 
    },
    { 
      title: 'Conflict Resolution', 
      description: 'Smart merging handles simultaneous edits automatically' 
    },
  ]}
  imageSide="right"
/>
```

---

## 💼 Pricing Sections

### Pattern: 3-Tier Pricing

```tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const plans = [
  {
    name: 'Starter',
    price: '$9',
    description: 'Perfect for side projects',
    features: ['5 projects', '10GB storage', 'Basic support', 'Community access'],
    cta: 'Start Free Trial'
  },
  {
    name: 'Pro',
    price: '$29',
    description: 'For professional developers',
    features: ['Unlimited projects', '100GB storage', 'Priority support', 'Advanced analytics', 'Custom domains'],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large teams',
    features: ['Everything in Pro', 'Unlimited storage', '24/7 phone support', 'SLA guarantee', 'Dedicated account manager'],
    cta: 'Contact Sales'
  },
]

<section className="py-20 px-4">
  <div className="max-w-7xl mx-auto">
    <div className="text-center mb-16">
      <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
      <p className="text-xl text-muted-foreground">
        Start free, upgrade as you grow
      </p>
    </div>
    
    <div className="grid md:grid-cols-3 gap-8">
      {plans.map((plan) => (
        <Card key={plan.name} className={plan.popular ? 'border-primary shadow-lg scale-105' : ''}>
          <CardHeader>
            {plan.popular && (
              <Badge className="w-fit mb-2">Most Popular</Badge>
            )}
            <CardTitle className="text-2xl">{plan.name}</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
            <div className="mt-4">
              <span className="text-4xl font-bold">{plan.price}</span>
              {plan.price !== 'Custom' && <span className="text-muted-foreground">/month</span>}
            </div>
          </CardHeader>
          <CardContent>
            <Button className="w-full mb-6" variant={plan.popular ? 'default' : 'outline'}>
              {plan.cta}
            </Button>
            <ul className="space-y-3">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <span className="text-primary">✓</span>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>
```

---

## 🎯 CTA Sections

### Pattern 1: Centered with Background

```tsx
<section className="py-20 px-4 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
  <div className="max-w-4xl mx-auto text-center space-y-8">
    <h2 className="text-4xl md:text-5xl font-bold">
      Ready to Build Something Amazing?
    </h2>
    <p className="text-xl text-muted-foreground">
      Join 10,000+ developers shipping faster with our platform
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Button size="lg" className="text-lg px-8">
        Start Free Trial
      </Button>
      <Button size="lg" variant="outline" className="text-lg px-8">
        Schedule Demo
      </Button>
    </div>
    <p className="text-sm text-muted-foreground">
      No credit card required • 14-day free trial • Cancel anytime
    </p>
  </div>
</section>
```

### Pattern 2: Split with Image

```tsx
<section className="py-20 px-4">
  <div className="max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <h2 className="text-4xl font-bold">
          Start Shipping Today
        </h2>
        <p className="text-xl text-muted-foreground">
          Everything you need to build modern applications. 
          No complex setup, no hidden costs.
        </p>
        <div className="flex gap-4">
          <Button size="lg">Get Started</Button>
          <Button size="lg" variant="outline">View Docs</Button>
        </div>
        <div className="flex items-center gap-8 pt-4">
          <div>
            <div className="text-3xl font-bold">10k+</div>
            <div className="text-sm text-muted-foreground">Developers</div>
          </div>
          <div>
            <div className="text-3xl font-bold">99.9%</div>
            <div className="text-sm text-muted-foreground">Uptime</div>
          </div>
          <div>
            <div className="text-3xl font-bold">24/7</div>
            <div className="text-sm text-muted-foreground">Support</div>
          </div>
        </div>
      </div>
      <div className="relative h-[400px] rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border" />
    </div>
  </div>
</section>
```

---

## 📝 Form Patterns

### Pattern: Newsletter Signup

```tsx
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

<section className="py-16 px-4 bg-muted/30">
  <div className="max-w-2xl mx-auto text-center space-y-6">
    <h3 className="text-3xl font-bold">Stay in the Loop</h3>
    <p className="text-muted-foreground">
      Get the latest updates, tips, and exclusive content delivered to your inbox
    </p>
    <form className="flex gap-4 max-w-md mx-auto">
      <Input 
        type="email" 
        placeholder="your@email.com" 
        className="flex-1"
      />
      <Button type="submit">Subscribe</Button>
    </form>
    <p className="text-xs text-muted-foreground">
      We respect your privacy. Unsubscribe anytime.
    </p>
  </div>
</section>
```

---

## 🏢 Company Logos / Social Proof

### Pattern: Logo Grid

```tsx
<section className="py-16 px-4 bg-muted/20">
  <div className="max-w-7xl mx-auto">
    <p className="text-center text-sm text-muted-foreground mb-8">
      Trusted by industry leaders
    </p>
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
      {/* Replace with actual logos */}
      {['Company A', 'Company B', 'Company C', 'Company D', 'Company E', 'Company F'].map((company) => (
        <div key={company} className="text-center text-2xl font-bold">
          {company}
        </div>
      ))}
    </div>
  </div>
</section>
```

---

## 💬 Testimonials

### Pattern: Card Grid

```tsx
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const testimonials = [
  {
    quote: "This platform cut our development time in half. We shipped our MVP in 2 weeks instead of 2 months.",
    author: "Sarah Chen",
    role: "CTO, TechStartup",
    avatar: "/avatars/sarah.jpg"
  },
  {
    quote: "The best developer experience I've had. Everything just works, and when it doesn't, support is incredible.",
    author: "Mike Rodriguez",
    role: "Lead Developer, BigCorp",
    avatar: "/avatars/mike.jpg"
  },
  {
    quote: "Switched from our old platform and never looked back. The performance improvements alone were worth it.",
    author: "Emma Thompson",
    role: "Engineering Manager, ScaleUp",
    avatar: "/avatars/emma.jpg"
  },
]

<section className="py-20 px-4">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-4xl font-bold text-center mb-16">
      Loved by Developers Worldwide
    </h2>
    <div className="grid md:grid-cols-3 gap-8">
      {testimonials.map((testimonial) => (
        <Card key={testimonial.author}>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <p className="text-lg">"{testimonial.quote}"</p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={testimonial.avatar} />
                  <AvatarFallback>{testimonial.author[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
</section>
```

---

## 📱 Mobile App Showcase

### Pattern: Feature + Phone Mockup

```tsx
<section className="py-20 px-4 overflow-hidden">
  <div className="max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="order-2 lg:order-1">
        <div className="relative h-[600px] flex items-center justify-center">
          {/* Phone mockup */}
          <div className="w-[300px] h-[600px] rounded-[3rem] border-8 border-foreground/20 bg-background shadow-2xl overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
          </div>
        </div>
      </div>
      <div className="space-y-6 order-1 lg:order-2">
        <h2 className="text-4xl font-bold">
          Your Work, Anywhere
        </h2>
        <p className="text-xl text-muted-foreground">
          Native mobile apps for iOS and Android. Stay productive on the go with offline support and instant sync.
        </p>
        <ul className="space-y-4">
          {['Offline mode with smart sync', 'Push notifications', 'Biometric authentication', 'Native performance'].map((feature) => (
            <li key={feature} className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">✓</span>
              <span>{feature}</span>
            </li>
          ))}
        </ul>
        <div className="flex gap-4 pt-4">
          <Button>Download iOS</Button>
          <Button variant="outline">Download Android</Button>
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## 📊 Stats Section

### Pattern: 4-Column Stats

```tsx
<section className="py-16 px-4 bg-muted/20">
  <div className="max-w-6xl mx-auto">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {[
        { stat: '10,000+', label: 'Active Users' },
        { stat: '99.9%', label: 'Uptime' },
        { stat: '50ms', label: 'Avg Response' },
        { stat: '24/7', label: 'Support' },
      ].map((item) => (
        <div key={item.label} className="text-center">
          <div className="text-4xl md:text-5xl font-bold mb-2">{item.stat}</div>
          <div className="text-muted-foreground">{item.label}</div>
        </div>
      ))}
    </div>
  </div>
</section>
```

---

## 🎨 Custom Sections

### Pattern: Split Content with Gradient

```tsx
<section className="py-20 px-4 relative overflow-hidden">
  {/* Background gradient blob */}
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-3xl -z-10" />
  
  <div className="max-w-7xl mx-auto">
    <div className="grid lg:grid-cols-2 gap-12 items-center">
      <div className="space-y-6">
        <Badge>New Feature</Badge>
        <h2 className="text-4xl font-bold">
          AI-Powered Insights
        </h2>
        <p className="text-xl text-muted-foreground">
          Let AI analyze your data and surface actionable insights automatically. 
          No configuration needed.
        </p>
        <Button size="lg">Learn More</Button>
      </div>
      <div className="relative h-[400px] rounded-2xl bg-card border shadow-xl p-8">
        {/* Content here */}
        <div className="space-y-4">
          <div className="h-8 bg-muted rounded animate-pulse" />
          <div className="h-8 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-8 bg-muted rounded animate-pulse w-1/2" />
        </div>
      </div>
    </div>
  </div>
</section>
```

---

## Quick Combinations

### Landing Page Structure

```tsx
// Modern SaaS Landing Page
<HeroGradient />              // Bold opener
<LogoCloud />                 // Social proof
<FeatureGrid />               // Key benefits (6 items)
<FeatureShowcase />           // Detailed feature 1
<FeatureShowcase />           // Detailed feature 2 (image opposite side)
<Stats />                     // Numbers/credibility
<Testimonials />              // Social proof
<Pricing />                   // Plans
<CTA />                       // Final push
<Footer />
```

### Product Page Structure

```tsx
// Product Feature Page
<HeroSpotlight />             // Feature introduction
<Stats />                     // Quick wins
<BentoGrid />                 // Sub-features
<FeatureShowcase />           // How it works
<Testimonials />              // User stories
<CTA />                       // Try it now
```

---

**Remember**: These are starting points. Customize content, adjust spacing, and adapt to your brand!

