import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { staggerContainer, staggerItem } from '../animations'

interface HeroMinimalProps {
  title: string
  subtitle: string
  primaryCta?: string
  onPrimaryClick?: () => void
}

export function HeroMinimal({
  title,
  subtitle,
  primaryCta = 'Get Started',
  onPrimaryClick,
}: HeroMinimalProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      <motion.div
        className="relative z-10 max-w-4xl mx-auto text-center"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="mb-8" variants={staggerItem}>
          <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            ✨ Now Available
          </span>
        </motion.div>

        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-8 tracking-tight"
          variants={staggerItem}
        >
          {title}
        </motion.h1>
        
        <motion.p
          className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto"
          variants={staggerItem}
        >
          {subtitle}
        </motion.p>

        <motion.div variants={staggerItem}>
          <Button 
            size="lg" 
            onClick={onPrimaryClick}
            className="text-lg px-12 h-14"
          >
            {primaryCta} →
          </Button>
        </motion.div>

        <motion.div
          className="mt-20 flex justify-center gap-8 text-sm text-muted-foreground"
          variants={staggerItem}
        >
          <div>⚡ Fast</div>
          <div>🔒 Secure</div>
          <div>🎨 Beautiful</div>
        </motion.div>
      </motion.div>
    </section>
  )
}

