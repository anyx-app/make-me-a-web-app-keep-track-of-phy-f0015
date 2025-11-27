import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { useBrand } from '@/hooks/useBrand'
import { ReactNode } from 'react'

export interface ChartCardProps {
  title: string
  description?: string
  value?: string | number
  change?: {
    value: number
    isPositive?: boolean
  }
  children: ReactNode
  actions?: ReactNode
  loading?: boolean
  className?: string
}

/**
 * ChartCard - Professional chart container
 * 
 * Perfect for: Analytics dashboards, data visualization
 * Works with: Any chart library (Recharts, Chart.js, etc.)
 * 
 * @example
 * ```tsx
 * import { LineChart } from 'recharts'
 * 
 * <ChartCard
 *   title="Revenue Growth"
 *   description="Last 30 days"
 *   value="$45,231"
 *   change={{ value: 12.5, isPositive: true }}
 * >
 *   <LineChart data={data}>...</LineChart>
 * </ChartCard>
 * ```
 */
export function ChartCard({
  title,
  description,
  value,
  change,
  children,
  actions,
  loading = false,
  className,
}: ChartCardProps) {
  const { classes, config } = useBrand()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className={cn(
        'relative overflow-hidden',
        config.preferredCardStyle === 'glass' && 'bg-background/50 backdrop-blur-sm',
        config.preferredCardStyle === 'elevated' && classes.shadow,
        config.preferredCardStyle === 'bordered' && 'border-2',
        className
      )}>
        {/* Background decoration */}
        {config.backgroundTreatment === 'gradient' && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-transparent" />
        )}
        
        <CardHeader className="relative pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg">{title}</CardTitle>
              {description && (
                <CardDescription className="mt-1">{description}</CardDescription>
              )}
              
              {value && (
                <div className="mt-3 flex items-baseline gap-3">
                  {loading ? (
                    <div className="h-8 w-32 animate-pulse rounded bg-muted" />
                  ) : (
                    <>
                      <span className="text-2xl font-bold tracking-tight">
                        {value}
                      </span>
                      {change && (
                        <span className={cn(
                          'text-sm font-medium',
                          change.isPositive ? 'text-success' : 'text-destructive'
                        )}>
                          {change.isPositive ? '+' : ''}{change.value}%
                        </span>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
            
            {actions && (
              <div className="flex items-center gap-2">
                {actions}
              </div>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="relative">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-32 w-32 animate-pulse rounded-lg bg-muted" />
            </div>
          ) : (
            children
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

/**
 * ChartGrid - Layout for multiple charts
 */
export interface ChartGridProps {
  charts: ChartCardProps[]
  columns?: 1 | 2 | 3
  className?: string
}

export function ChartGrid({ charts, columns = 2, className }: ChartGridProps) {
  return (
    <motion.div
      className={cn(
        'grid gap-6',
        {
          1: 'grid-cols-1',
          2: 'grid-cols-1 lg:grid-cols-2',
          3: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',
        }[columns],
        className
      )}
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      {charts.map((chart, index) => (
        <ChartCard key={index} {...chart} />
      ))}
    </motion.div>
  )
}

