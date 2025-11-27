import { motion } from 'framer-motion'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useBrand } from '@/hooks/useBrand'
import { ensureArray, ensureString } from '@/lib/component-guards'
import { Search, Download, Filter } from 'lucide-react'
import { ReactNode, useState } from 'react'

export interface DataTableColumn<T> {
  key?: keyof T | string
  accessorKey?: string  // Support TanStack Table format
  header: string
  cell?: (row: T | { row: { original: T } }) => ReactNode  // Support both formats
  sortable?: boolean
  className?: string
}

export interface DataTableProps<T> {
  title?: string
  description?: string
  columns: DataTableColumn<T>[]
  data: T[]
  searchable?: boolean
  searchPlaceholder?: string
  actions?: ReactNode
  loading?: boolean
  emptyMessage?: string
  className?: string
}

/**
 * DataTable - Professional data table component
 * 
 * Perfect for: Admin panels, data management, lists
 * 
 * @example
 * ```tsx
 * const columns = [
 *   { key: 'name', header: 'Name', sortable: true },
 *   { key: 'email', header: 'Email' },
 *   { 
 *     key: 'status', 
 *     header: 'Status',
 *     cell: (row) => (
 *       <Badge variant={row.status === 'active' ? 'default' : 'secondary'}>
 *         {row.status}
 *       </Badge>
 *     )
 *   },
 * ]
 * 
 * <DataTable
 *   title="Users"
 *   columns={columns}
 *   data={users}
 *   searchable
 * />
 * ```
 */
export function DataTable<T extends Record<string, unknown>>({
  title,
  description,
  columns,
  data,
  searchable = false,
  searchPlaceholder = 'Search...',
  actions,
  loading = false,
  emptyMessage = 'No data available',
  className,
}: DataTableProps<T>) {
  const { classes, config } = useBrand()
  const [searchQuery, setSearchQuery] = useState('')

  // Guard: Ensure data is always an array
  const safeData = ensureArray<T>(data)
  const safeTitle = ensureString(title, '')
  const safeDescription = ensureString(description, '')
  const safeSearchPlaceholder = ensureString(searchPlaceholder, 'Search...')
  const safeEmptyMessage = ensureString(emptyMessage, 'No data available')

  // Simple client-side search
  const filteredData = searchQuery
    ? safeData.filter((row) =>
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    : safeData

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
    >
      <Card className={cn(
        'relative overflow-hidden',
        config.preferredCardStyle === 'glass' && 'bg-background/50 backdrop-blur-sm',
        config.preferredCardStyle === 'elevated' && classes.shadow,
        config.preferredCardStyle === 'bordered' && 'border-2',
      )}>
        {/* Header */}
        {(title || searchable || actions) && (
          <div className={cn('border-b', classes.cardPadding)}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                {safeTitle && (
                  <h3 className="text-lg font-semibold">{safeTitle}</h3>
                )}
                {safeDescription && (
                  <p className="text-sm text-muted-foreground">{safeDescription}</p>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {searchable && (
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder={safeSearchPlaceholder}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 w-64"
                    />
                  </div>
                )}
                {actions}
              </div>
            </div>
          </div>
        )}
        
        {/* Table */}
        <div className="relative overflow-x-auto">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : filteredData.length === 0 ? (
            <div className="flex h-64 flex-col items-center justify-center gap-2">
              <p className="text-muted-foreground">{safeEmptyMessage}</p>
              {searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column, index) => (
                    <TableHead
                      key={index}
                      className={cn(
                        column.className,
                        column.sortable && 'cursor-pointer hover:text-foreground'
                      )}
                    >
                      {column.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row, rowIndex) => {
                  // Guard: Ensure row exists
                  if (!row) return null
                  
                  return (
                    <motion.tr
                      key={rowIndex}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: rowIndex * 0.05 }}
                      className="group hover:bg-muted/50"
                    >
                      {columns.map((column, colIndex) => {
                        const columnKey = column.accessorKey || column.key
                        let cellContent: ReactNode = null

                        try {
                          if (column.cell) {
                            // Support both formats: TanStack Table and simple
                            // Try TanStack format first: { row: { original: row } }
                            cellContent = column.cell({ row: { original: row } } as T & { row: { original: T } })
                          } else if (columnKey) {
                            // Fallback to direct key access
                            cellContent = row[columnKey as keyof T] as ReactNode
                          }
                        } catch (error) {
                          // If TanStack format fails, try simple format
                          try {
                            if (column.cell) {
                              cellContent = column.cell(row)
                            }
                          } catch {
                            // Last resort: show error placeholder
                            if (process.env.NODE_ENV === 'development') {
                              console.error('[DataTable] Cell render error:', error, { row, column })
                            }
                            cellContent = <span className="text-destructive">Error</span>
                          }
                        }

                        return (
                          <TableCell key={colIndex} className={column.className}>
                            {cellContent}
                          </TableCell>
                        )
                      })}
                    </motion.tr>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

/**
 * Quick action buttons for data tables
 */
export function DataTableActions() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        <Filter className="mr-2 h-4 w-4" />
        Filter
      </Button>
      <Button variant="outline" size="sm">
        <Download className="mr-2 h-4 w-4" />
        Export
      </Button>
    </div>
  )
}

