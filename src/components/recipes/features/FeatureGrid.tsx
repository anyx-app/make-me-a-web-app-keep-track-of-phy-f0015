import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { SpotlightCard } from '../effects/SpotlightCard'
import { staggerContainer, staggerItem } from '../animations'

interface Feature {
  title: string
  description: string
  icon?: React.ReactNode
}

interface FeatureGridProps {
  features: Feature[]
  columns?: 2 | 3 | 4
  className?: string
}

export function FeatureGrid({ features, columns = 3, className }: FeatureGridProps) {
  return (
    <motion.div
      className={cn(
        'grid gap-6',
        columns === 2 && 'grid-cols-1 md:grid-cols-2',
        columns === 3 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        columns === 4 && 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        className
      )}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {features.map((feature, idx) => (
        <motion.div key={idx} variants={staggerItem}>
          <SpotlightCard>
            {feature.icon && (
              <div className="mb-4 text-5xl">{feature.icon}</div>
            )}
            <h3 className="text-2xl font-semibold mb-3">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </SpotlightCard>
        </motion.div>
      ))}
    </motion.div>
  )
}

