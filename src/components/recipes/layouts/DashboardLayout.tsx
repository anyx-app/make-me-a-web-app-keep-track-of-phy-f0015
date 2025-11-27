import { ReactNode, useState } from 'react'
import { cn } from '@/lib/utils'
import { useBrand } from '@/hooks/useBrand'
import { DashboardSidebar, DashboardSidebarProps } from './DashboardSidebar'
import { DashboardHeader, DashboardHeaderProps } from './DashboardHeader'

export interface DashboardLayoutProps {
  children: ReactNode
  sidebar?: DashboardSidebarProps
  header?: DashboardHeaderProps
  showSidebar?: boolean
  showHeader?: boolean
  className?: string
}

/**
 * DashboardLayout - Complete dashboard layout with sidebar and header
 * 
 * Perfect for: Admin panels, SaaS dashboards, internal tools
 * Features: Responsive, collapsible sidebar, search header
 * 
 * @example
 * ```tsx
 * <DashboardLayout
 *   sidebar={{
 *     user: currentUser,
 *     navItems: menuItems,
 *   }}
 *   header={{
 *     title: "Dashboard",
 *     actions: <Button>New</Button>
 *   }}
 * >
 *   <YourDashboardContent />
 * </DashboardLayout>
 * ```
 */
export function DashboardLayout({
  children,
  sidebar,
  header,
  showSidebar = true,
  showHeader = true,
  className,
}: DashboardLayoutProps) {
  const { config } = useBrand()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      {showSidebar && (
        <DashboardSidebar
          {...sidebar}
          mobileOpen={mobileMenuOpen}
          onMobileClose={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        {showHeader && (
          <DashboardHeader
            {...header}
            onMobileMenuClick={() => setMobileMenuOpen(true)}
          />
        )}

        {/* Page content */}
        <main className={cn(
          'flex-1 overflow-y-auto',
          config.backgroundTreatment === 'gradient' && 'bg-gradient-to-br from-background via-muted/20 to-background',
          className
        )}>
          {children}
        </main>
      </div>
    </div>
  )
}

/**
 * DashboardContainer - Content container with consistent padding
 */
export function DashboardContainer({ 
  children, 
  className 
}: { 
  children: ReactNode
  className?: string 
}) {
  const { classes } = useBrand()
  
  return (
    <div className={cn('container mx-auto', classes.cardPadding, className)}>
      {children}
    </div>
  )
}

/**
 * DashboardSection - Section wrapper with optional title
 */
export function DashboardSection({
  title,
  description,
  actions,
  children,
  className,
}: {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn('space-y-6', className)}>
      {(title || actions) && (
        <div className="flex items-center justify-between">
          <div>
            {title && (
              <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
            )}
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      {children}
    </section>
  )
}

