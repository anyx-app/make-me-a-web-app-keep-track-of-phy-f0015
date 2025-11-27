import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { cn } from '@/lib/utils'
import { useBrand } from '@/hooks/useBrand'
import { ReactNode } from 'react'

export interface FilterOption {
  id: string
  label: string
  count?: number
}

export interface FilterGroup {
  id: string
  label: string
  type: 'checkbox' | 'range' | 'custom'
  options?: FilterOption[]
  range?: {
    min: number
    max: number
    value: [number, number]
    step?: number
    format?: (value: number) => string
  }
  custom?: ReactNode
}

export interface FilterPanelProps {
  groups: FilterGroup[]
  activeFilters: Record<string, unknown>
  onFilterChange: (filterId: string, value: unknown) => void
  onClearAll: () => void
  onApply?: () => void
  className?: string
}

/**
 * FilterPanel - Advanced filtering sidebar/panel
 * 
 * Perfect for: E-commerce, data tables, search results
 * 
 * @example
 * ```tsx
 * const filterGroups: FilterGroup[] = [
 *   {
 *     id: 'category',
 *     label: 'Category',
 *     type: 'checkbox',
 *     options: [
 *       { id: 'electronics', label: 'Electronics', count: 45 },
 *       { id: 'clothing', label: 'Clothing', count: 23 },
 *     ],
 *   },
 *   {
 *     id: 'price',
 *     label: 'Price Range',
 *     type: 'range',
 *     range: {
 *       min: 0,
 *       max: 1000,
 *       value: [0, 500],
 *       format: (v) => `$${v}`,
 *     },
 *   },
 * ]
 * 
 * <FilterPanel
 *   groups={filterGroups}
 *   activeFilters={filters}
 *   onFilterChange={handleFilterChange}
 *   onClearAll={clearFilters}
 * />
 * ```
 */
export function FilterPanel({
  groups,
  activeFilters,
  onFilterChange,
  onClearAll,
  onApply,
  className,
}: FilterPanelProps) {
  const { config, classes } = useBrand()

  const activeFilterCount = Object.values(activeFilters).filter(
    (value) => value !== undefined && 
    (Array.isArray(value) ? value.length > 0 : true)
  ).length

  return (
    <Card className={cn(
      'overflow-hidden',
      config.preferredCardStyle === 'glass' && 'bg-background/50 backdrop-blur-sm',
      config.preferredCardStyle === 'elevated' && classes.shadow,
      config.preferredCardStyle === 'bordered' && 'border-2',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between border-b p-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary">{activeFilterCount}</Badge>
          )}
        </div>
        
        {activeFilterCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-7 text-xs"
          >
            Clear all
          </Button>
        )}
      </div>
      
      {/* Filter groups */}
      <div className="divide-y">
        {groups.map((group) => (
          <motion.div
            key={group.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4"
          >
            <h4 className="mb-3 text-sm font-medium">{group.label}</h4>
            
            {group.type === 'checkbox' && group.options && (
              <div className="space-y-2">
                {group.options.map((option) => {
                  const isChecked = activeFilters[group.id]?.includes(option.id)
                  
                  return (
                    <div key={option.id} className="flex items-center gap-2">
                      <Checkbox
                        id={`${group.id}-${option.id}`}
                        checked={isChecked}
                        onCheckedChange={(checked) => {
                          const current = activeFilters[group.id] || []
                          const updated = checked
                            ? [...current, option.id]
                            : current.filter((id: string) => id !== option.id)
                          onFilterChange(group.id, updated)
                        }}
                      />
                      <Label
                        htmlFor={`${group.id}-${option.id}`}
                        className="flex flex-1 cursor-pointer items-center justify-between text-sm"
                      >
                        <span>{option.label}</span>
                        {option.count !== undefined && (
                          <span className="text-muted-foreground">
                            ({option.count})
                          </span>
                        )}
                      </Label>
                    </div>
                  )
                })}
              </div>
            )}
            
            {group.type === 'range' && group.range && (
              <div className="space-y-3">
                <Slider
                  min={group.range.min}
                  max={group.range.max}
                  step={group.range.step || 1}
                  value={activeFilters[group.id] || group.range.value}
                  onValueChange={(value) => onFilterChange(group.id, value)}
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>
                    {group.range.format
                      ? group.range.format((activeFilters[group.id] || group.range.value)[0])
                      : (activeFilters[group.id] || group.range.value)[0]
                    }
                  </span>
                  <span>
                    {group.range.format
                      ? group.range.format((activeFilters[group.id] || group.range.value)[1])
                      : (activeFilters[group.id] || group.range.value)[1]
                    }
                  </span>
                </div>
              </div>
            )}
            
            {group.type === 'custom' && group.custom}
          </motion.div>
        ))}
      </div>
      
      {/* Apply button (optional) */}
      {onApply && (
        <div className="border-t p-4">
          <Button onClick={onApply} className="w-full">
            Apply Filters
          </Button>
        </div>
      )}
    </Card>
  )
}

