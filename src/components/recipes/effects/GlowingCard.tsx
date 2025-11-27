import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlowingCardProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  intensity?: 'low' | 'medium' | 'high'
}

export function GlowingCard({ 
  children, 
  className,
  glowColor = '139, 92, 246',
  intensity = 'medium'
}: GlowingCardProps) {
  const intensityMap = {
    low: '0 0 20px',
    medium: '0 0 40px',
    high: '0 0 60px',
  }

  return (
    <motion.div
      className={cn(
        'rounded-xl border border-border bg-card p-6',
        className
      )}
      whileHover={{
        boxShadow: `${intensityMap[intensity]} rgba(${glowColor}, 0.3)`,
        scale: 1.02,
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  )
}

