import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useBrand } from '@/hooks/useBrand'
import { LucideIcon } from 'lucide-react'

export interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    label?: string
    isPositive?: boolean
  }
  icon?: LucideIcon
  trend?: Array<number>
  loading?: boolean
  className?: string
}

/**
 * StatCard - Professional metric display card
 * 
 * Perfect for: KPIs, analytics dashboards, admin panels
 * 
 * @example
 * ```tsx
 * import { TrendingUp } from 'lucide-react'
 * 
 * <StatCard
 *   title="Total Revenue"
 *   value="$45,231"
 *   change={{ value: 12.5, isPositive: true }}
 *   icon={TrendingUp}
 * />
 * ```
 */
export function StatCard({
  title,
  value,
  change,
  icon: Icon,
  trend,
  loading = false,
  className,
}: StatCardProps) {
  const { classes, config } = useBrand()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        classes.cardPadding,
        'relative overflow-hidden',
        config.preferredCardStyle === 'glass' && 'bg-background/50 backdrop-blur-sm',
        config.preferredCardStyle === 'elevated' && classes.shadow,
        config.preferredCardStyle === 'bordered' && 'border-2',
        className
      )}>
        {/* Background decoration */}
        {config.backgroundTreatment === 'gradient' && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent" />
        )}
        
        <div className="relative flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">
              {title}
            </p>
            
            {loading ? (
              <div className="mt-2 h-8 w-32 animate-pulse rounded bg-muted" />
            ) : (
              <p className="mt-2 text-3xl font-bold tracking-tight">
                {value}
              </p>
            )}
            
            {change && !loading && (
              <div className="mt-2 flex items-center gap-1 text-sm">
                <span className={cn(
                  'font-medium',
                  change.isPositive ? 'text-success' : 'text-destructive'
                )}>
                  {change.isPositive ? '+' : ''}{change.value}%
                </span>
                {change.label && (
                  <span className="text-muted-foreground">{change.label}</span>
                )}
              </div>
            )}
          </div>
          
          {Icon && (
            <div className={cn(
              'flex items-center justify-center rounded-lg p-3',
              config.colorVibrancy === 'vibrant' 
                ? 'bg-primary/20 text-primary' 
                : 'bg-muted text-muted-foreground'
            )}>
              <Icon className="h-6 w-6" />
            </div>
          )}
        </div>
        
        {/* Mini trend line */}
        {trend && !loading && (
          <div className="relative mt-4 h-12 w-full">
            <svg
              className="h-full w-full"
              viewBox="0 0 100 40"
              preserveAspectRatio="none"
            >
              <polyline
                points={trend.map((val, i) => 
                  `${(i / (trend.length - 1)) * 100},${40 - (val / Math.max(...trend)) * 35}`
                ).join(' ')}
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-primary"
                opacity="0.5"
              />
            </svg>
          </div>
        )}
      </Card>
    </motion.div>
  )
}

/**
 * StatGrid - Layout for multiple stat cards
 */
export interface StatGridProps {
  stats: StatCardProps[]
  columns?: 2 | 3 | 4
  className?: string
}

export function StatGrid({ stats, columns = 4, className }: StatGridProps) {
  
  return (
    <motion.div
      className={cn(
        'grid gap-6',
        {
          2: 'grid-cols-1 md:grid-cols-2',
          3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
          4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
        }[columns],
        className
      )}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </motion.div>
  )
}

