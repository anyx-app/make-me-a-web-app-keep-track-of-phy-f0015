import { useState } from 'react'
import { motion } from 'framer-motion'
import { HeroGradient, HeroSpotlight, HeroMinimal } from '@/components/recipes/heroes'
import { BentoGrid, FeatureGrid, FeatureShowcase } from '@/components/recipes/features'
import { SpotlightCard, GlowingCard } from '@/components/recipes/effects'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { fadeInUp } from '@/components/recipes/animations'

export default function Recipes() {
  const [heroVariant, setHeroVariant] = useState<'gradient' | 'spotlight' | 'minimal'>('gradient')

  const bentoItems = [
    { title: 'Fast Performance', description: 'Lightning-fast load times with optimized rendering', icon: '⚡', span: 'col' as const },
    { title: 'Secure', description: 'Enterprise-grade security built-in', icon: '🔒' },
    { title: 'Scalable', description: 'Grows with your needs', icon: '📈' },
    { title: 'Beautiful Design', description: 'Stunning UI components that make your app stand out', icon: '🎨', span: 'row' as const },
    { title: 'Developer Friendly', description: 'Built with DX in mind', icon: '💻' },
  ]

  const features = [
    { title: 'Component Library', description: 'Pre-built components ready to use', icon: '🧩' },
    { title: 'Theme System', description: 'Comprehensive theming with 10 presets', icon: '🎨' },
    { title: 'Animations', description: 'Smooth animations powered by Framer Motion', icon: '✨' },
    { title: 'TypeScript', description: 'Full type safety across your codebase', icon: '📘' },
    { title: 'Responsive', description: 'Mobile-first responsive design', icon: '📱' },
    { title: 'Accessible', description: 'WCAG AAA compliant components', icon: '♿' },
  ]

  const showcaseFeatures = [
    { title: 'Drag & Drop', description: 'Intuitive drag and drop interface' },
    { title: 'Real-time Sync', description: 'Changes sync instantly across devices' },
    { title: 'Smart Search', description: 'AI-powered search finds anything in seconds' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section Switcher */}
      <div className="relative">
        {heroVariant === 'gradient' && (
          <HeroGradient
            title="Mind-Blowing UI Recipes"
            subtitle="Pre-built, animated components that make building beautiful interfaces effortless"
            primaryCta="Explore Recipes"
            secondaryCta="View Code"
          />
        )}
        {heroVariant === 'spotlight' && (
          <HeroSpotlight
            title="Build Faster"
            subtitle="Use pre-designed recipes to create stunning UIs in minutes, not hours"
            primaryCta="Get Started"
            secondaryCta="Documentation"
          />
        )}
        {heroVariant === 'minimal' && (
          <HeroMinimal
            title="Simply Beautiful"
            subtitle="Clean, minimal recipes that focus on what matters - your content"
            primaryCta="Start Building"
          />
        )}

        {/* Hero Variant Selector */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="flex gap-2 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-2">
            <Button
              size="sm"
              variant={heroVariant === 'gradient' ? 'default' : 'ghost'}
              onClick={() => setHeroVariant('gradient')}
            >
              Gradient
            </Button>
            <Button
              size="sm"
              variant={heroVariant === 'spotlight' ? 'default' : 'ghost'}
              onClick={() => setHeroVariant('spotlight')}
            >
              Spotlight
            </Button>
            <Button
              size="sm"
              variant={heroVariant === 'minimal' ? 'default' : 'ghost'}
              onClick={() => setHeroVariant('minimal')}
            >
              Minimal
            </Button>
          </div>
        </div>
      </div>

      {/* Feature Sections */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl font-bold mb-4">Bento Grid Layout</h2>
            <p className="text-xl text-muted-foreground">
              Modern card layouts with variable sizing
            </p>
          </motion.div>

          <BentoGrid items={bentoItems} />
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl font-bold mb-4">Spotlight Feature Grid</h2>
            <p className="text-xl text-muted-foreground">
              Interactive cards with spotlight hover effects
            </p>
          </motion.div>

          <FeatureGrid features={features} columns={3} />
        </div>
      </section>

      {/* Feature Showcase */}
      <FeatureShowcase
        title="Built for Modern Teams"
        description="Everything you need to collaborate effectively and ship faster"
        features={showcaseFeatures}
        imageSide="right"
      />

      {/* Effect Cards */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl font-bold mb-4">Interactive Effects</h2>
            <p className="text-xl text-muted-foreground">
              Hover over cards to see effects
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <SpotlightCard>
              <h3 className="text-2xl font-bold mb-3">Spotlight Card</h3>
              <p className="text-muted-foreground">
                Move your mouse over this card to see a dynamic spotlight effect
                that follows your cursor. Perfect for highlighting important content.
              </p>
            </SpotlightCard>

            <GlowingCard intensity="high" glowColor="139, 92, 246">
              <h3 className="text-2xl font-bold mb-3">Glowing Card</h3>
              <p className="text-muted-foreground">
                This card glows on hover with a customizable color and intensity.
                Great for call-to-action sections and important features.
              </p>
            </GlowingCard>
          </div>
        </div>
      </section>

      {/* Code Examples */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="text-5xl font-bold mb-4">Easy to Use</h2>
            <p className="text-xl text-muted-foreground">
              Import and use recipes in seconds
            </p>
          </motion.div>

          <Card>
            <CardHeader>
              <CardTitle>Usage Examples</CardTitle>
              <CardDescription>
                Copy and paste these examples into your code
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="hero">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="hero">Hero</TabsTrigger>
                  <TabsTrigger value="features">Features</TabsTrigger>
                  <TabsTrigger value="effects">Effects</TabsTrigger>
                </TabsList>

                <TabsContent value="hero" className="mt-4">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`import { HeroGradient } from '@/components/recipes/heroes'

<HeroGradient
  title="Your Amazing Title"
  subtitle="Compelling subtitle that converts"
  primaryCta="Get Started"
  secondaryCta="Learn More"
/>`}</code>
                  </pre>
                </TabsContent>

                <TabsContent value="features" className="mt-4">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`import { FeatureGrid } from '@/components/recipes/features'

<FeatureGrid
  features={[
    { title: 'Fast', description: 'Lightning fast', icon: '⚡' },
    { title: 'Secure', description: 'Bank-grade security', icon: '🔒' },
  ]}
  columns={3}
/>`}</code>
                  </pre>
                </TabsContent>

                <TabsContent value="effects" className="mt-4">
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{`import { SpotlightCard } from '@/components/recipes/effects'

<SpotlightCard>
  <h3>Your Content</h3>
  <p>Spotlight follows cursor</p>
</SpotlightCard>`}</code>
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}

