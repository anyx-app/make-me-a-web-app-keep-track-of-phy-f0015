import { useTheme } from '@/theme/ThemeProvider'
import { getAllThemes, getThemeFamilies } from '@/design-system/themes/theme-registry'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeSelector() {
  const { themeId, setTheme } = useTheme()
  const families = getThemeFamilies()

  const currentTheme = getAllThemes().find((t) => t.metadata.id === themeId)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[140px] justify-start">
          <span className="flex items-center gap-2">
            {currentTheme?.preview && (
              <span
                className="w-4 h-4 rounded-sm border"
                style={{
                  background: `linear-gradient(135deg, 
                    hsl(${currentTheme.preview.primary}) 0%, 
                    hsl(${currentTheme.preview.accent}) 100%)`,
                }}
              />
            )}
            {currentTheme?.metadata.name || 'Select Theme'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[220px]">
        {Object.entries(families).map(([family, themes]) => (
          <div key={family}>
            <DropdownMenuLabel className="capitalize">
              {family}
            </DropdownMenuLabel>
            {themes.map((theme) => (
              <DropdownMenuItem
                key={theme.metadata.id}
                onClick={() => setTheme(theme.metadata.id)}
                className="flex items-center justify-between gap-2 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  {theme.preview && (
                    <span
                      className="w-4 h-4 rounded-sm border flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, 
                          hsl(${theme.preview.primary}) 0%, 
                          hsl(${theme.preview.accent}) 100%)`,
                      }}
                    />
                  )}
                  <span className="text-sm">{theme.metadata.name}</span>
                </span>
                {themeId === theme.metadata.id && (
                  <span className="text-xs">✓</span>
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

