import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { fadeInLeft, fadeInRight } from '../animations'

interface HeroSpotlightProps {
  title: string
  subtitle: string
  primaryCta?: string
  secondaryCta?: string
  onPrimaryClick?: () => void
  onSecondaryClick?: () => void
}

export function HeroSpotlight({
  title,
  subtitle,
  primaryCta = 'Get Started',
  secondaryCta = 'Learn More',
  onPrimaryClick,
  onSecondaryClick,
}: HeroSpotlightProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Spotlight effect */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f12_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f12_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInLeft}
        >
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            {title}
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-10">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={onPrimaryClick} className="text-lg px-8">
              {primaryCta}
            </Button>
            <Button size="lg" variant="outline" onClick={onSecondaryClick} className="text-lg px-8">
              {secondaryCta}
            </Button>
          </div>
        </motion.div>

        <motion.div
          className="relative"
          initial="hidden"
          animate="visible"
          variants={fadeInRight}
        >
          <div className="relative w-full h-[500px] rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-sm border border-border" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-purple-500/50 to-pink-500/50 rounded-2xl blur-3xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      </div>
    </section>
  )
}

