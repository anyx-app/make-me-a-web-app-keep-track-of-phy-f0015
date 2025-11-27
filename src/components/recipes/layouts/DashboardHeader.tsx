import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useBrand } from '@/hooks/useBrand'
import { 
  Search, 
  Bell, 
  Settings, 
  User, 
  LogOut,
  Menu
} from 'lucide-react'
import { ReactNode, useState } from 'react'

export interface DashboardHeaderProps {
  title?: string
  subtitle?: string
  showSearch?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  actions?: ReactNode
  notifications?: Array<{
    id: string
    title: string
    description?: string
    unread?: boolean
  }>
  user?: {
    name: string
    email: string
    avatar?: string
  }
  onUserAction?: (action: string) => void
  onMobileMenuClick?: () => void
  className?: string
}

/**
 * DashboardHeader - Top navigation bar for dashboards
 * 
 * Perfect for: Dashboard pages, admin panels
 * Features: Search, notifications, user menu
 * 
 * @example
 * ```tsx
 * <DashboardHeader
 *   title="Dashboard"
 *   subtitle="Welcome back!"
 *   showSearch
 *   notifications={notifications}
 *   user={currentUser}
 *   actions={<Button>New Project</Button>}
 * />
 * ```
 */
export function DashboardHeader({
  title,
  subtitle,
  showSearch = true,
  searchPlaceholder = 'Search...',
  onSearch,
  actions,
  notifications = [],
  user,
  onUserAction,
  onMobileMenuClick,
  className,
}: DashboardHeaderProps) {
  const { config } = useBrand()
  const [searchQuery, setSearchQuery] = useState('')

  const unreadCount = notifications.filter(n => n.unread).length

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (onSearch) {
      onSearch(searchQuery)
    }
  }

  return (
    <header className={cn(
      'flex h-16 items-center gap-4 border-b bg-background px-6',
      config.preferredCardStyle === 'elevated' && 'shadow-sm',
      className
    )}>
      {/* Mobile menu button */}
      {onMobileMenuClick && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onMobileMenuClick}
          className="md:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      {/* Title */}
      {(title || subtitle) && (
        <div className="hidden md:block">
          {title && (
            <h1 className="text-lg font-semibold">{title}</h1>
          )}
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      )}

      {/* Search */}
      {showSearch && (
        <form onSubmit={handleSearch} className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </form>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      {actions && (
        <div className="flex items-center gap-2">
          {actions}
        </div>
      )}

      {/* Notifications */}
      {notifications.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge 
                  variant="destructive" 
                  className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem key={notification.id} className="flex flex-col items-start gap-1 p-3">
                  <div className="flex items-start gap-2 w-full">
                    <div className="flex-1">
                      <p className="text-sm font-medium">{notification.title}</p>
                      {notification.description && (
                        <p className="text-xs text-muted-foreground">{notification.description}</p>
                      )}
                    </div>
                    {notification.unread && (
                      <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* User menu */}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <span className="hidden md:inline-block text-sm">
                {user.name}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onUserAction?.('profile')}>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onUserAction?.('settings')}>
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onUserAction?.('logout')}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  )
}

