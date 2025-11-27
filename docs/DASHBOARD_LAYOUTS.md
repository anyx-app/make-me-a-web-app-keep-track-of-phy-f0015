# Dashboard Layouts Guide

Complete guide to creating professional dashboards with side navigation, optimized for different use cases.

---

## 🎯 Dashboard Layout System

### Components

1. **DashboardSidebar** - Collapsible side navigation
2. **DashboardHeader** - Top bar with search, notifications, user menu
3. **DashboardLayout** - Complete layout wrapper
4. **DashboardContainer** - Content container with padding
5. **DashboardSection** - Section wrapper with title/actions

---

## 📐 Layout Anatomy

```
┌─────────────────────────────────────────────────────────┐
│ ┌────┐ Logo              [Search]   🔔 👤              │ Header
├─┼────┼─────────────────────────────────────────────────┤
│ │    │                                                  │
│ │ 🏠 │ Dashboard Title                    [+ New]      │
│ │    │                                                  │
│ │ 📊 │ ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐       │
│ │    │ │Stats │  │Stats │  │Stats │  │Stats │       │ Content
│ │ 👥 │ └──────┘  └──────┘  └──────┘  └──────┘       │
│ │    │                                                  │
│ │ ⚙️  │ ┌────────────────────────────────────┐        │
│ │    │ │         Chart/Table Area            │        │
│ └────┘ └────────────────────────────────────┘        │
└─────────────────────────────────────────────────────────┘
  Sidebar
```

---

## 🎨 Complete Example

```tsx
import {
  DashboardLayout,
  DashboardContainer,
  DashboardSection,
  StatGrid,
  ChartCard,
  DataTable
} from '@/components/recipes'
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  const navItems = [
    { label: 'Dashboard', icon: Home, href: '/' },
    { label: 'Analytics', icon: BarChart3, href: '/analytics' },
    { label: 'Users', icon: Users, href: '/users', badge: 12 },
    { label: 'Settings', icon: Settings, href: '/settings' },
  ]

  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/avatar.jpg'
  }

  const notifications = [
    { id: '1', title: 'New user registered', unread: true },
    { id: '2', title: 'Server health check completed', unread: false },
  ]

  return (
    <DashboardLayout
      sidebar={{
        user,
        navItems,
        onLogout: () => handleLogout(),
      }}
      header={{
        title: 'Dashboard',
        subtitle: 'Welcome back, John!',
        showSearch: true,
        notifications,
        user,
        actions: <Button>+ New Project</Button>
      }}
    >
      <DashboardContainer>
        {/* Stats Section */}
        <DashboardSection>
          <StatGrid
            stats={[
              { 
                title: 'Total Revenue', 
                value: '$45,231', 
                change: { value: 12.5, isPositive: true },
                icon: DollarSign
              },
              { 
                title: 'Active Users', 
                value: '2,345', 
                change: { value: 5.2, isPositive: true },
                icon: Users
              },
              { 
                title: 'Conversion Rate', 
                value: '3.2%', 
                change: { value: 0.8, isPositive: false },
                icon: TrendingUp
              },
              { 
                title: 'Server Uptime', 
                value: '99.9%', 
                icon: Activity
              },
            ]}
            columns={4}
          />
        </DashboardSection>

        {/* Charts Section */}
        <DashboardSection 
          title="Analytics"
          description="Revenue and user growth over time"
        >
          <div className="grid gap-6 lg:grid-cols-2">
            <ChartCard
              title="Revenue Growth"
              description="Last 30 days"
              value="$45,231"
              change={{ value: 12.5, isPositive: true }}
            >
              {/* Your chart component */}
              <YourChartComponent data={revenueData} />
            </ChartCard>

            <ChartCard
              title="User Growth"
              description="Last 30 days"
              value="2,345"
              change={{ value: 5.2, isPositive: true }}
            >
              <YourChartComponent data={userData} />
            </ChartCard>
          </div>
        </DashboardSection>

        {/* Table Section */}
        <DashboardSection
          title="Recent Orders"
          actions={
            <>
              <Button variant="outline">Export</Button>
              <Button>View All</Button>
            </>
          }
        >
          <DataTable
            columns={orderColumns}
            data={orders}
            searchable
          />
        </DashboardSection>
      </DashboardContainer>
    </DashboardLayout>
  )
}
```

---

## 🎨 Sidebar Features

### Collapsible

```tsx
<DashboardSidebar
  defaultCollapsed={false}  // Start expanded
  // User can click chevron to collapse
/>
```

**Collapsed view:**
- Icons only
- 80px wide
- Tooltips on hover
- Compact user avatar

**Expanded view:**
- Full labels
- 280px wide
- Badges visible
- User name/email

### Navigation Items

```tsx
const navItems = [
  {
    label: 'Dashboard',
    icon: Home,
    href: '/',
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    href: '/analytics',
    badge: 'New'  // String badge
  },
  {
    label: 'Users',
    icon: Users,
    href: '/users',
    badge: 12  // Number badge
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    subItems: [  // Sub-navigation
      { label: 'Profile', href: '/settings/profile' },
      { label: 'Billing', href: '/settings/billing' },
    ]
  },
]
```

### User Profile Section

```tsx
<DashboardSidebar
  user={{
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/avatar.jpg'
  }}
  onLogout={() => handleLogout()}
/>
```

---

## 🎨 Header Features

### Search Bar

```tsx
<DashboardHeader
  showSearch
  searchPlaceholder="Search anything..."
  onSearch={(query) => handleSearch(query)}
/>
```

### Notifications

```tsx
<DashboardHeader
  notifications={[
    {
      id: '1',
      title: 'New user registered',
      description: 'john@example.com just signed up',
      unread: true
    },
    {
      id: '2',
      title: 'Server health check',
      description: 'All systems operational',
      unread: false
    }
  ]}
/>
```

**Features:**
- Badge with unread count
- Dropdown menu
- Unread indicator dot
- Scrollable list

### User Menu

```tsx
<DashboardHeader
  user={{
    name: 'John Doe',
    email: 'john@example.com',
    avatar: '/avatar.jpg'
  }}
  onUserAction={(action) => {
    if (action === 'profile') navigateToProfile()
    if (action === 'settings') navigateToSettings()
    if (action === 'logout') handleLogout()
  }}
/>
```

**Menu items:**
- Profile
- Settings
- Log out

---

## 📱 Responsive Behavior

### Desktop (>= 1024px)
- Sidebar visible
- Full header with search
- Multi-column layouts

### Tablet (768px - 1023px)
- Sidebar collapsible
- Header with search
- 2-column layouts

### Mobile (< 768px)
- Sidebar hidden (drawer)
- Mobile menu button
- Single column
- Compact header

```tsx
<DashboardLayout
  sidebar={{
    defaultCollapsed: true,  // Start collapsed on mobile
    // ...
  }}
  header={{
    onMobileMenuClick: () => openDrawer(),  // Mobile menu handler
  }}
/>
```

---

## 🎨 Brand-Aware Styling

The dashboard adapts to your brand configuration:

### Minimal Brand
```typescript
// config.flavor === 'minimal'
```
- Flat cards (no shadows)
- Spacious padding
- Clean, no gradients
- Subtle animations

### Bold Brand
```typescript
// config.flavor === 'bold'
```
- Elevated cards (strong shadows)
- Tight, dense layout
- Gradient backgrounds
- Playful animations

### Corporate Brand
```typescript
// config.flavor === 'corporate'
```
- Bordered cards
- Comfortable spacing
- Solid backgrounds
- Subtle animations

### Tech Brand
```typescript
// config.flavor === 'tech'
```
- Glass morphism cards
- Comfortable spacing
- Mesh backgrounds
- Moderate animations

---

## 🎯 Layout Variants

### 1. Analytics Dashboard

**Focus**: Data visualization, charts, metrics

```tsx
<DashboardLayout>
  <DashboardContainer>
    <StatGrid stats={kpis} columns={4} />
    <ChartGrid charts={analyticsCharts} columns={2} />
  </DashboardContainer>
</DashboardLayout>
```

**Best for**: Analytics tools, BI dashboards, monitoring

---

### 2. CRM Dashboard

**Focus**: Lists, tables, user data

```tsx
<DashboardLayout>
  <DashboardContainer>
    <StatGrid stats={crmStats} columns={3} />
    <DataTable 
      title="Contacts"
      columns={contactColumns}
      data={contacts}
      searchable
    />
    <DataTable 
      title="Deals"
      columns={dealColumns}
      data={deals}
    />
  </DashboardContainer>
</DashboardLayout>
```

**Best for**: CRM, sales tools, customer management

---

### 3. Content Dashboard

**Focus**: Content management, media, posts

```tsx
<DashboardLayout>
  <DashboardContainer>
    <DashboardSection 
      title="Recent Posts"
      actions={<Button>New Post</Button>}
    >
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map(post => (
          <Card key={post.id}>
            <img src={post.image} />
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
          </Card>
        ))}
      </div>
    </DashboardSection>
  </DashboardContainer>
</DashboardLayout>
```

**Best for**: CMS, blogging platforms, social media tools

---

### 4. E-commerce Dashboard

**Focus**: Orders, inventory, sales

```tsx
<DashboardLayout>
  <DashboardContainer>
    <StatGrid 
      stats={[
        { title: 'Revenue', value: '$45K' },
        { title: 'Orders', value: '234' },
        { title: 'Customers', value: '1.2K' },
        { title: 'Products', value: '567' },
      ]}
      columns={4}
    />
    
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Sales">
        <SalesChart />
      </ChartCard>
      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
        </CardHeader>
        <CardContent>
          <TopProductsList />
        </CardContent>
      </Card>
    </div>
    
    <DataTable
      title="Recent Orders"
      columns={orderColumns}
      data={orders}
    />
  </DashboardContainer>
</DashboardLayout>
```

**Best for**: E-commerce admin panels, inventory systems

---

## 💡 Best Practices

### DO ✅

1. **Use DashboardContainer** for consistent padding
   ```tsx
   <DashboardContainer>
     {/* Your content */}
   </DashboardContainer>
   ```

2. **Group related content** with DashboardSection
   ```tsx
   <DashboardSection title="Analytics">
     <ChartGrid charts={charts} />
   </DashboardSection>
   ```

3. **Provide user feedback**
   - Loading states on data tables
   - Skeleton loaders for charts
   - Toast notifications for actions

4. **Make it responsive**
   - Use grid with breakpoints
   - Stack on mobile
   - Collapse sidebar

5. **Add actions to sections**
   ```tsx
   <DashboardSection 
     title="Users"
     actions={<Button>Add User</Button>}
   >
   ```

### DON'T ❌

1. **Don't skip the layout wrapper**
   - Always use DashboardLayout
   - Ensures consistent structure

2. **Don't hardcode widths**
   - Use grid system
   - Responsive breakpoints

3. **Don't overcrowd**
   - Use whitespace
   - Group related items
   - Don't show everything at once

4. **Don't ignore mobile**
   - Test on small screens
   - Provide mobile menu
   - Stack content vertically

---

## 🎨 Customization

### Custom Sidebar Colors

```tsx
<DashboardSidebar
  className="bg-primary text-primary-foreground"
  // Active items automatically adapt
/>
```

### Custom Header Height

```tsx
<DashboardHeader
  className="h-20"  // Default is h-16
/>
```

### Custom Container Width

```tsx
<DashboardContainer className="max-w-screen-2xl">
  {/* Wider content */}
</DashboardContainer>
```

---

## 🚀 Quick Start Templates

### Minimal Dashboard

```tsx
<DashboardLayout
  sidebar={{ navItems: basicNav }}
  header={{ title: 'Dashboard' }}
>
  <DashboardContainer>
    <h1>Your Content Here</h1>
  </DashboardContainer>
</DashboardLayout>
```

### Full-Featured Dashboard

```tsx
<DashboardLayout
  sidebar={{
    user,
    navItems,
    bottomItems,
    onLogout,
  }}
  header={{
    title: 'Dashboard',
    showSearch: true,
    notifications,
    user,
    actions: <Button>+ New</Button>,
    onUserAction,
  }}
>
  <DashboardContainer>
    <StatGrid stats={stats} />
    <ChartGrid charts={charts} />
    <DataTable data={data} columns={columns} />
  </DashboardContainer>
</DashboardLayout>
```

---

## 📊 Performance Tips

1. **Lazy load charts**
   ```tsx
   const Chart = lazy(() => import('./Chart'))
   ```

2. **Virtualize long lists**
   - Use react-virtual for tables
   - Paginate data

3. **Optimize images**
   - Use next/image or similar
   - Lazy load avatars

4. **Debounce search**
   ```tsx
   const debouncedSearch = useDe bounce(handleSearch, 300)
   ```

---

## ✅ Summary

**DashboardLayout provides:**
- ✅ Collapsible sidebar with navigation
- ✅ Search header with notifications
- ✅ User profile menu
- ✅ Brand-aware styling
- ✅ Responsive design
- ✅ TypeScript types
- ✅ Accessibility built-in

**Perfect for:**
- Admin panels
- SaaS dashboards
- Analytics tools
- CRM systems
- E-commerce backends
- Content management

**Result:** Professional dashboards that adapt to your brand and look modern out of the box.

