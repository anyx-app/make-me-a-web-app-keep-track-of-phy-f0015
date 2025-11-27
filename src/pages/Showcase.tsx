import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { GradientBackground } from '@/components/recipes/effects/GradientBackground'
import { SpotlightCard } from '@/components/recipes/effects/SpotlightCard'
import { staggerContainer, staggerItem } from '@/components/recipes/animations'
import { useNavigate } from 'react-router-dom'
import { ThemeSelector } from '@/components/theme/ThemeSelector'

export default function Showcase() {
  const navigate = useNavigate()

  const features = [
    { icon: '⚡', title: 'Lightning Fast', description: 'Optimized for performance' },
    { icon: '🎨', title: 'Beautiful Design', description: '10 stunning theme presets' },
    { icon: '🧩', title: 'Component Library', description: '50+ ready-to-use components' },
    { icon: '🎬', title: 'Smooth Animations', description: 'Powered by Framer Motion' },
    { icon: '📘', title: 'TypeScript', description: 'Full type safety built-in' },
    { icon: '♿', title: 'Accessible', description: 'WCAG AAA compliant' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
        <GradientBackground variant="aurora" />
        
        {/* Animated orbs */}
        <motion.div
          className="absolute top-1/4 -left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/30 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Theme Selector in top right */}
        <div className="absolute top-6 right-6 z-20">
          <ThemeSelector />
        </div>

        <motion.div
          className="relative z-10 max-w-5xl mx-auto text-center"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <motion.div 
            className="mb-8 flex justify-center"
            variants={staggerItem}
          >
            <motion.img
              src="/anyx-logo.png"
              alt="AnyX Logo"
              className="w-32 h-32 md:w-40 md:h-40 drop-shadow-2xl"
              animate={{
                y: [-10, 10, -10],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"
            variants={staggerItem}
          >
            AnyX React Boilerplate
          </motion.h1>
          
          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-muted-foreground mb-12 max-w-3xl mx-auto"
            variants={staggerItem}
          >
            Build stunning applications with our production-ready starter template
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            variants={staggerItem}
          >
            <Button 
              size="lg" 
              onClick={() => navigate('/recipes')}
              className="text-lg px-8 h-14"
            >
              Explore Recipes ✨
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={() => navigate('/themes')}
              className="text-lg px-8 h-14"
            >
              View Themes 🎨
            </Button>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground"
            variants={staggerItem}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              <span>50+ Components</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              <span>10 Theme Presets</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span>Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📘</span>
              <span>TypeScript Ready</span>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="text-muted-foreground text-sm">
            <div className="mb-2">Scroll to explore</div>
            <div className="flex justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-muted-foreground">
              Production-ready features for modern web applications
            </p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
          >
            {features.map((feature, idx) => (
              <motion.div key={idx} variants={staggerItem}>
                <SpotlightCard>
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </SpotlightCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Build Something Amazing?
            </h2>
            <p className="text-xl text-muted-foreground mb-10">
              Start with our recipes and themes, or build your own custom components
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate('/recipes')}
                className="text-lg px-10 h-14"
              >
                View Recipe Library
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate('/themes')}
                className="text-lg px-10 h-14"
              >
                Explore Themes
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <div className="flex justify-center mb-4">
            <img
              src="/anyx-logo.png"
              alt="AnyX Logo"
              className="w-12 h-12 opacity-50"
            />
          </div>
          <p className="mb-2">Built with ❤️ using AnyX React Boilerplate</p>
          <p className="text-sm">
            Powered by React • TypeScript • Tailwind CSS • Framer Motion
          </p>
        </div>
      </footer>
    </div>
  )
}

