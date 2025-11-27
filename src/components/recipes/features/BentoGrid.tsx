import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { staggerContainer, staggerItem } from '../animations'

interface BentoItem {
  title: string
  description: string
  icon?: React.ReactNode
  className?: string
  span?: 'col' | 'row' | 'both'
}

interface BentoGridProps {
  items: BentoItem[]
  className?: string
}

export function BentoGrid({ items, className }: BentoGridProps) {
  return (
    <motion.div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
        className
      )}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {items.map((item, idx) => (
        <motion.div
          key={idx}
          className={cn(
            'group relative rounded-xl border border-border bg-card p-6 hover:border-primary/50 transition-colors',
            item.span === 'col' && 'md:col-span-2',
            item.span === 'row' && 'md:row-span-2',
            item.span === 'both' && 'md:col-span-2 md:row-span-2',
            item.className
          )}
          variants={staggerItem}
          whileHover={{ y: -4 }}
        >
          {item.icon && (
            <div className="mb-4 text-4xl">{item.icon}</div>
          )}
          <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
          <p className="text-muted-foreground">{item.description}</p>
          
          {/* Glow effect on hover */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/0 via-primary/0 to-primary/0 group-hover:from-primary/10 group-hover:via-primary/5 group-hover:to-primary/10 transition-all duration-500" />
        </motion.div>
      ))}
    </motion.div>
  )
}

