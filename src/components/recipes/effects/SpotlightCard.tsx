import { motion, useMotionValue, useMotionTemplate } from 'framer-motion'
import { MouseEvent } from 'react'
import { cn } from '@/lib/utils'

interface SpotlightCardProps {
  children: React.ReactNode
  className?: string
  spotlightColor?: string
}

export function SpotlightCard({ 
  children, 
  className,
  spotlightColor = '255, 255, 255'
}: SpotlightCardProps) {
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect()
    mouseX.set(clientX - left)
    mouseY.set(clientY - top)
  }

  const spotlightStyle = useMotionTemplate`
    radial-gradient(
      350px circle at ${mouseX}px ${mouseY}px,
      rgba(${spotlightColor}, 0.15),
      transparent 80%
    )
  `

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      className={cn(
        'group relative rounded-xl border border-border/50 bg-card p-8 transition-colors hover:border-border',
        className
      )}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{ background: spotlightStyle }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

