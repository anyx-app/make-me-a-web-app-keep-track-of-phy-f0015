import { ThemeSelector } from '@/components/theme/ThemeSelector'
import { ThemeCustomizer } from '@/components/theme/ThemeCustomizer'
import { useTheme } from '@/theme/ThemeProvider'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default function Themes() {
  const { theme } = useTheme()

  return (
    <div className="container mx-auto py-8 px-4 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Design System & Themes</h1>
          <p className="text-muted-foreground">
            Explore and customize the robust theme system with multiple presets
          </p>
        </div>
        <ThemeSelector />
      </div>

      {/* Current Theme Info */}
      {theme && (
        <Card>
          <CardHeader>
            <CardTitle>Current Theme: {theme.metadata.name}</CardTitle>
            <CardDescription>{theme.metadata.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 items-center">
              <Badge variant={theme.metadata.category === 'dark' ? 'secondary' : 'default'}>
                {theme.metadata.category}
              </Badge>
              <span className="text-sm text-muted-foreground">ID: {theme.metadata.id}</span>
            </div>
            {theme.preview && (
              <div className="flex gap-4">
                <div className="space-y-2">
                  <p className="text-sm font-medium">Color Preview</p>
                  <div className="flex gap-2">
                    <div
                      className="w-16 h-16 rounded border"
                      style={{ backgroundColor: `hsl(${theme.preview.primary})` }}
                    />
                    <div
                      className="w-16 h-16 rounded border"
                      style={{ backgroundColor: `hsl(${theme.preview.secondary})` }}
                    />
                    <div
                      className="w-16 h-16 rounded border"
                      style={{ backgroundColor: `hsl(${theme.preview.accent})` }}
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Component Showcase */}
      <Card>
        <CardHeader>
          <CardTitle>Component Showcase</CardTitle>
          <CardDescription>
            See how components look with the current theme
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Buttons */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Buttons</h3>
            <div className="flex flex-wrap gap-2">
              <Button>Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </div>

          {/* Inputs */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Inputs</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
              <Input placeholder="Default input" />
              <Input placeholder="Disabled input" disabled />
            </div>
          </div>

          {/* Alerts */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Alerts</h3>
            <div className="space-y-4 max-w-2xl">
              <Alert>
                <AlertTitle>Info</AlertTitle>
                <AlertDescription>
                  This is an informational alert using theme colors.
                </AlertDescription>
              </Alert>
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                  This is a destructive alert showing error states.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Badges */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Badges</h3>
            <div className="flex flex-wrap gap-2">
              <Badge>Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="outline">Outline</Badge>
            </div>
          </div>

          {/* Cards */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Cards</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Card Title</CardTitle>
                  <CardDescription>Card description</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Card content goes here.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Another Card</CardTitle>
                  <CardDescription>With different content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">More content here.</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Third Card</CardTitle>
                  <CardDescription>Even more content</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Additional content.</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Tabs */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Tabs</h3>
            <Tabs defaultValue="tab1" className="max-w-md">
              <TabsList>
                <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                <TabsTrigger value="tab2">Tab 2</TabsTrigger>
                <TabsTrigger value="tab3">Tab 3</TabsTrigger>
              </TabsList>
              <TabsContent value="tab1">Content for Tab 1</TabsContent>
              <TabsContent value="tab2">Content for Tab 2</TabsContent>
              <TabsContent value="tab3">Content for Tab 3</TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Theme Customizer */}
      <ThemeCustomizer />

      {/* Design Tokens Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Design Tokens</CardTitle>
          <CardDescription>
            CSS variables available throughout the application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Spacing Scale</h4>
              <div className="space-y-1 text-xs font-mono">
                <div>--spacing-xs: 4px</div>
                <div>--spacing-sm: 8px</div>
                <div>--spacing-md: 16px</div>
                <div>--spacing-lg: 24px</div>
                <div>--spacing-xl: 32px</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Typography</h4>
              <div className="space-y-1 text-xs font-mono">
                <div>--font-size-xs: 12px</div>
                <div>--font-size-sm: 14px</div>
                <div>--font-size-base: 16px</div>
                <div>--font-size-lg: 18px</div>
                <div>--font-size-xl: 20px</div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm">Shadows</h4>
              <div className="space-y-2">
                <div className="w-full h-8 rounded shadow-design-sm bg-card border">xs</div>
                <div className="w-full h-8 rounded shadow-design-md bg-card border">md</div>
                <div className="w-full h-8 rounded shadow-design-lg bg-card border">lg</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

