import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getTheme, applyTheme, legacyThemeMap } from '@/design-system/themes/theme-registry'
import type { ThemePreset } from '@/design-system/themes/types'

// Support both legacy ('light'|'dark') and new theme IDs
type ThemeId = string

interface ThemeContextValue {
  themeId: ThemeId
  theme: ThemePreset | undefined
  setTheme: (id: ThemeId) => void
  availableThemes: string[]
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
const STORAGE_KEY = 'theme'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeIdState] = useState<ThemeId>('default-light')

  const theme = useMemo(() => getTheme(themeId), [themeId])

  useEffect(() => {
    // Force default-light theme
    localStorage.setItem(STORAGE_KEY, 'default-light')
    const themeObj = getTheme('default-light')
    if (themeObj) {
      applyTheme(themeObj)
    }
  }, [])

  const setTheme = (newThemeId: ThemeId) => {
    // Map legacy names if needed
    const mappedId = legacyThemeMap[newThemeId] || newThemeId
    
    const themeObj = getTheme(mappedId)
    if (themeObj) {
      localStorage.setItem(STORAGE_KEY, mappedId)
      applyTheme(themeObj)
      setThemeIdState(mappedId)
    } else {
      console.error(`Theme "${mappedId}" not found`)
    }
  }

  // Get list of available themes (for UI components)
  const availableThemes = useMemo(() => {
    return Object.keys(getTheme('default-light') ? {} : {})
  }, [])

  const value = useMemo(
    () => ({ themeId, theme, setTheme, availableThemes }),
    [themeId, theme, availableThemes]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>')
  return ctx
}

// Legacy hook for backward compatibility
export function useLegacyTheme(): { theme: 'light' | 'dark'; setTheme: (t: 'light' | 'dark') => void } {
  const { themeId, setTheme } = useTheme()
  
  // Determine if current theme is light or dark
  const legacyTheme = themeId.includes('dark') ? 'dark' : 'light'
  
  const setLegacyTheme = (t: 'light' | 'dark') => {
    setTheme(t) // Will be mapped via legacyThemeMap
  }
  
  return { theme: legacyTheme, setTheme: setLegacyTheme }
}
