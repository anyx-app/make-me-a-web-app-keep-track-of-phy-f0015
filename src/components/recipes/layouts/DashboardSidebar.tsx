import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import { useBrand } from '@/hooks/useBrand'
import { 
  ChevronLeft,
  ChevronRight,
  Home,
  BarChart3,
  Users,
  Settings,
  HelpCircle,
  LogOut,
  LucideIcon
} from 'lucide-react'
import { useState, ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'

export interface NavItem {
  label: string
  icon: LucideIcon
  href: string
  badge?: string | number
  subItems?: Array<{
    label: string
    href: string
  }>
}

export interface DashboardSidebarProps {
  logo?: ReactNode
  logoCollapsed?: ReactNode
  user?: {
    name: string
    email: string
    avatar?: string
  }
  navItems?: NavItem[]
  bottomItems?: NavItem[]
  defaultCollapsed?: boolean
  onLogout?: () => void
  className?: string
  
  // Mobile support
  mobileOpen?: boolean
  onMobileClose?: () => void
}

const defaultNavItems: NavItem[] = [
  { label: 'Dashboard', icon: Home, href: '/' },
  { label: 'Analytics', icon: BarChart3, href: '/analytics', badge: 'New' },
  { label: 'Users', icon: Users, href: '/users', badge: 12 },
  { label: 'Settings', icon: Settings, href: '/settings' },
]

const defaultBottomItems: NavItem[] = [
  { label: 'Help & Support', icon: HelpCircle, href: '/help' },
]

/**
 * DashboardSidebar - Modern collapsible sidebar navigation
 * 
 * Perfect for: Admin panels, dashboards, SaaS applications
 * Features: Collapsible, brand-aware, user profile, badges, **mobile-responsive**
 * 
 * @example
 * ```tsx
 * // Desktop & Mobile responsive
 * <DashboardSidebar
 *   logo={<img src="/logo.png" />}
 *   user={{ name: "John Doe", email: "john@example.com" }}
 *   navItems={navItems}
 *   onLogout={() => handleLogout()}
 *   mobileOpen={isMobileMenuOpen}
 *   onMobileClose={() => setIsMobileMenuOpen(false)}
 * />
 * ```
 */
export function DashboardSidebar({
  logo,
  logoCollapsed,
  user,
  navItems = defaultNavItems,
  bottomItems = defaultBottomItems,
  defaultCollapsed = false,
  onLogout,
  className,
  mobileOpen = false,
  onMobileClose,
}: DashboardSidebarProps) {
  const { config } = useBrand()
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)
  const location = useLocation()

  const isActive = (href: string) => location.pathname === href

  // Sidebar content component (reused for desktop & mobile)
  const SidebarContent = () => (
    <>
      {/* Header - Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b">
        <Link to="/" className="flex items-center gap-2">
          {isCollapsed ? logoCollapsed || logo : logo}
        </Link>
        
        {/* Desktop collapse button (hidden on mobile) */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={onMobileClose}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isActive(item.href)
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                isCollapsed && 'justify-center'
              )}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </>
              )}
            </Link>
          ))}
        </nav>

        {/* Bottom items */}
        {bottomItems.length > 0 && (
          <div className="mt-6 border-t pt-4 space-y-1">
            {bottomItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={onMobileClose}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                  isCollapsed && 'justify-center'
                )}
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && <span className="flex-1">{item.label}</span>}
              </Link>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* User profile */}
      {user && (
        <div className={cn(
          'border-t p-4',
          isCollapsed ? 'flex justify-center' : 'flex items-center gap-3'
        )}>
          {isCollapsed ? (
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
          ) : (
            <>
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium truncate">{user.name}</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
              {onLogout && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onLogout}
                  className="flex-shrink-0"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </>
  )

  return (
    <>
      {/* Mobile Sheet Drawer */}
      <Sheet open={mobileOpen} onOpenChange={onMobileClose}>
        <SheetContent side="left" className="w-[280px] p-0 lg:hidden">
          <div className="flex h-full flex-col">
            <SidebarContent />
          </div>
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3 }}
        className={cn(
          'hidden lg:flex relative flex-col border-r bg-background',
          config.preferredCardStyle === 'elevated' && 'shadow-lg',
          className
        )}
      >
        <SidebarContent />
      </motion.aside>
    </>
  )
}
