import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GradientBackgroundProps {
  variant?: 'aurora' | 'mesh' | 'radial' | 'conic'
  animate?: boolean
  className?: string
  children?: React.ReactNode
}

export function GradientBackground({ 
  variant = 'aurora', 
  animate = true, 
  className,
  children 
}: GradientBackgroundProps) {
  const variants = {
    aurora: 'bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20',
    mesh: 'bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-900/20 via-purple-500/10 to-transparent',
    radial: 'bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500/20 via-purple-500/20 to-transparent',
    conic: 'bg-[conic-gradient(at_center,_var(--tw-gradient-stops))] from-purple-500/20 via-pink-500/20 to-blue-500/20',
  }

  const AnimatedGradient = animate ? motion.div : 'div'

  return (
    <AnimatedGradient
      className={cn(
        'absolute inset-0 -z-10',
        variants[variant],
        className
      )}
      {...(animate && {
        animate: {
          backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
        },
        transition: {
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        },
      })}
    >
      {children}
    </AnimatedGradient>
  )
}

