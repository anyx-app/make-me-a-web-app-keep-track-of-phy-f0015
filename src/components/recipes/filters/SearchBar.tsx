import { motion } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useBrand } from '@/hooks/useBrand'
import { Search, X, Sliders } from 'lucide-react'
import { useState } from 'react'

export interface SearchBarProps {
  placeholder?: string
  onSearch: (query: string) => void
  onFilter?: () => void
  recentSearches?: string[]
  suggestions?: string[]
  showFilters?: boolean
  activeFilters?: number
  className?: string
}

/**
 * SearchBar - Advanced search component with suggestions
 * 
 * Perfect for: E-commerce, content discovery, data filtering
 * 
 * @example
 * ```tsx
 * <SearchBar
 *   placeholder="Search products..."
 *   onSearch={(q) => handleSearch(q)}
 *   onFilter={() => openFilters()}
 *   recentSearches={["React", "TypeScript"]}
 *   activeFilters={3}
 * />
 * ```
 */
export function SearchBar({
  placeholder = 'Search...',
  onSearch,
  onFilter,
  recentSearches,
  suggestions,
  showFilters = false,
  activeFilters = 0,
  className,
}: SearchBarProps) {
  const { classes } = useBrand()
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSearch = () => {
    if (query.trim()) {
      onSearch(query)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleClear = () => {
    setQuery('')
    onSearch('')
  }

  return (
    <div className={cn('relative', className)}>
      {/* Search input */}
      <div className={cn(
        'flex items-center gap-2 rounded-lg border bg-background p-2',
        isFocused && 'ring-2 ring-ring',
        classes.transition
      )}>
        <Search className="h-5 w-5 text-muted-foreground" />
        
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          placeholder={placeholder}
          className="border-0 bg-transparent p-0 focus-visible:ring-0"
        />
        
        {query && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="h-6 w-6 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        {showFilters && onFilter && (
          <Button
            variant="outline"
            size="sm"
            onClick={onFilter}
            className="relative"
          >
            <Sliders className="h-4 w-4" />
            {activeFilters > 0 && (
              <Badge 
                variant="destructive" 
                className="absolute -right-1 -top-1 h-4 w-4 p-0 text-[10px]"
              >
                {activeFilters}
              </Badge>
            )}
          </Button>
        )}
        
        <Button size="sm" onClick={handleSearch}>
          Search
        </Button>
      </div>
      
      {/* Suggestions dropdown */}
      {isFocused && (recentSearches?.length || suggestions?.length) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'absolute top-full mt-2 w-full rounded-lg border bg-background p-2 shadow-lg z-50',
            classes.borderRadius
          )}
        >
          {recentSearches && recentSearches.length > 0 && (
            <div className="mb-2">
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
                Recent searches
              </p>
              <div className="space-y-1">
                {recentSearches.map((search, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(search)
                      onSearch(search)
                    }}
                    className="w-full rounded px-2 py-1 text-left text-sm hover:bg-muted"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {suggestions && suggestions.length > 0 && (
            <div>
              <p className="px-2 py-1 text-xs font-medium text-muted-foreground">
                Suggestions
              </p>
              <div className="space-y-1">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setQuery(suggestion)
                      onSearch(suggestion)
                    }}
                    className="w-full rounded px-2 py-1 text-left text-sm hover:bg-muted"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  )
}

