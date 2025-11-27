import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { GradientBackground } from '../effects/GradientBackground'
import { staggerContainer, staggerItem } from '../animations'

interface HeroGradientProps {
  title: string
  subtitle: string
  primaryCta?: string
  secondaryCta?: string
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
}

export function HeroGradient({
  title,
  subtitle,
  primaryCta = 'Get Started',
  secondaryCta = 'Learn More',
  onPrimaryClick,
  onSecondaryClick,
}: HeroGradientProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
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
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl"
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

      <motion.div
        className="relative z-10 max-w-5xl mx-auto text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400"
          variants={staggerItem}
        >
          {title}
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto"
          variants={staggerItem}
        >
          {subtitle}
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          variants={staggerItem}
        >
          <Button 
            size="lg" 
            onClick={onPrimaryClick}
            className="text-lg px-8"
          >
            {primaryCta}
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            onClick={onSecondaryClick}
            className="text-lg px-8"
          >
            {secondaryCta}
          </Button>
        </motion.div>
      </motion.div>
    </section>
  )
}

