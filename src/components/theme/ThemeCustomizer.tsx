import { useState } from 'react'
import { useTheme } from '@/theme/ThemeProvider'
import { exportTheme, importTheme, registerTheme } from '@/design-system/themes/theme-registry'
import type { ThemePreset, SemanticTokens } from '@/design-system/themes/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export function ThemeCustomizer() {
  const { theme, setTheme } = useTheme()
  const [customTokens, setCustomTokens] = useState<SemanticTokens | undefined>(theme?.tokens)
  const [importJson, setImportJson] = useState('')
  const [exportedJson, setExportedJson] = useState('')

  if (!theme) return null

  const handleTokenChange = (key: keyof SemanticTokens, value: string) => {
    setCustomTokens((prev) => ({
      ...(prev || theme.tokens),
      [key]: value,
    }))
  }

  const handleApplyCustomTheme = () => {
    if (!customTokens) return

    const customTheme: ThemePreset = {
      metadata: {
        id: 'custom',
        name: 'Custom Theme',
        description: 'User-customized theme',
        category: theme.metadata.category,
      },
      tokens: customTokens,
    }

    registerTheme(customTheme)
    setTheme('custom')
  }

  const handleExport = () => {
    const json = exportTheme(theme.metadata.id)
    if (json) {
      setExportedJson(json)
    }
  }

  const handleImport = () => {
    const imported = importTheme(importJson)
    if (imported) {
      setTheme(imported.metadata.id)
      setImportJson('')
      alert(`Theme "${imported.metadata.name}" imported successfully!`)
    } else {
      alert('Failed to import theme. Please check the JSON format.')
    }
  }

  const handleDownloadTheme = () => {
    const json = exportTheme(theme.metadata.id)
    if (!json) return

    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${theme.metadata.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const colorTokens: Array<keyof SemanticTokens> = [
    'background',
    'foreground',
    'primary',
    'primaryForeground',
    'secondary',
    'secondaryForeground',
    'muted',
    'mutedForeground',
    'accent',
    'accentForeground',
    'destructive',
    'destructiveForeground',
    'success',
    'successForeground',
    'warning',
    'warningForeground',
    'border',
    'input',
    'ring',
  ]

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Theme Customizer</CardTitle>
        <CardDescription>
          Customize colors and export your theme
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="customize">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="customize">Customize</TabsTrigger>
            <TabsTrigger value="export">Export</TabsTrigger>
            <TabsTrigger value="import">Import</TabsTrigger>
          </TabsList>

          <TabsContent value="customize" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto p-4 border rounded-lg">
              {colorTokens.map((token) => (
                <div key={token} className="space-y-2">
                  <Label htmlFor={token} className="text-sm font-medium capitalize">
                    {token.replace(/([A-Z])/g, ' $1').trim()}
                  </Label>
                  <div className="flex gap-2 items-center">
                    <div
                      className="w-10 h-10 rounded border flex-shrink-0"
                      style={{ backgroundColor: `hsl(${customTokens?.[token] || theme.tokens[token]})` }}
                    />
                    <Input
                      id={token}
                      value={customTokens?.[token] || theme.tokens[token]}
                      onChange={(e) => handleTokenChange(token, e.target.value)}
                      placeholder="H S% L%"
                      className="font-mono text-sm"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Button onClick={handleApplyCustomTheme}>Apply Custom Theme</Button>
              <Button variant="outline" onClick={() => setCustomTokens(theme.tokens)}>
                Reset
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="export" className="space-y-4">
            <div className="space-y-2">
              <Label>Current Theme JSON</Label>
              <Textarea
                value={exportedJson}
                readOnly
                placeholder="Click 'Export Theme' to see JSON"
                className="font-mono text-xs h-[400px]"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleExport}>Export Theme</Button>
              <Button onClick={handleDownloadTheme} variant="outline">
                Download JSON
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="import" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="import-json">Paste Theme JSON</Label>
              <Textarea
                id="import-json"
                value={importJson}
                onChange={(e) => setImportJson(e.target.value)}
                placeholder="Paste theme JSON here..."
                className="font-mono text-xs h-[400px]"
              />
            </div>
            <Button onClick={handleImport}>Import Theme</Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

