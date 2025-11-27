import type { Theme, ThemePreset } from './types'
import {
  defaultLightTheme,
  defaultDarkTheme,
  oceanLightTheme,
  oceanDarkTheme,
  sunsetLightTheme,
  sunsetDarkTheme,
  professionalLightTheme,
  professionalDarkTheme,
  highContrastLightTheme,
  highContrastDarkTheme,
  techLight,
  techDark,
  financeLight,
  financeDark,
  healthLight,
  healthDark,
  creativeLight,
  creativeDark,
  gamingLight,
  gamingDark,
} from './presets'

// Registry of all available themes
export const themeRegistry: Record<string, ThemePreset> = {
  'default-light': defaultLightTheme,
  'default-dark': defaultDarkTheme,
  'ocean-light': oceanLightTheme,
  'ocean-dark': oceanDarkTheme,
  'sunset-light': sunsetLightTheme,
  'sunset-dark': sunsetDarkTheme,
  'professional-light': professionalLightTheme,
  'professional-dark': professionalDarkTheme,
  'high-contrast-light': highContrastLightTheme,
  'high-contrast-dark': highContrastDarkTheme,
  'tech-light': techLight,
  'tech-dark': techDark,
  'finance-light': financeLight,
  'finance-dark': financeDark,
  'health-light': healthLight,
  'health-dark': healthDark,
  'creative-light': creativeLight,
  'creative-dark': creativeDark,
  'gaming-light': gamingLight,
  'gaming-dark': gamingDark,
}

// Legacy theme name mapping
export const legacyThemeMap: Record<string, string> = {
  light: 'default-light',
  dark: 'default-dark',
}

/**
 * Get a theme by ID
 */
export function getTheme(themeId: string): ThemePreset | undefined {
  // Check for legacy theme names
  const mappedId = legacyThemeMap[themeId] || themeId
  return themeRegistry[mappedId]
}

/**
 * Get all available themes
 */
export function getAllThemes(): ThemePreset[] {
  return Object.values(themeRegistry)
}

/**
 * Get themes by category
 */
export function getThemesByCategory(category: 'light' | 'dark' | 'auto'): ThemePreset[] {
  return getAllThemes().filter((theme) => theme.metadata.category === category)
}

/**
 * Register a custom theme
 */
export function registerTheme(theme: ThemePreset): void {
  if (themeRegistry[theme.metadata.id]) {
    console.warn(`Theme "${theme.metadata.id}" already exists and will be overwritten`)
  }
  themeRegistry[theme.metadata.id] = theme
}

/**
 * Unregister a theme
 */
export function unregisterTheme(themeId: string): boolean {
  if (themeRegistry[themeId]) {
    delete themeRegistry[themeId]
    return true
  }
  return false
}

/**
 * Apply theme tokens to CSS variables
 */
export function applyTheme(theme: Theme | ThemePreset): void {
  const root = document.documentElement
  const tokens = theme.tokens

  Object.entries(tokens).forEach(([key, value]) => {
    const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`
    root.style.setProperty(cssVar, value)
  })

  // Set data-theme attribute for theme-specific styles
  root.dataset.theme = theme.metadata.id
}

/**
 * Apply theme by ID
 */
export function applyThemeById(themeId: string): boolean {
  const theme = getTheme(themeId)
  if (theme) {
    applyTheme(theme)
    return true
  }
  console.error(`Theme "${themeId}" not found`)
  return false
}

/**
 * Validate theme structure
 */
export function validateTheme(theme: unknown): theme is ThemePreset {
  if (typeof theme !== 'object' || theme === null) {
    return false
  }

  const t = theme as Partial<ThemePreset>

  // Check metadata
  if (!t.metadata || typeof t.metadata !== 'object') {
    return false
  }

  const requiredMetadataFields = ['id', 'name', 'description', 'category']
  for (const field of requiredMetadataFields) {
    if (!(field in t.metadata)) {
      return false
    }
  }

  // Check tokens
  if (!t.tokens || typeof t.tokens !== 'object') {
    return false
  }

  const requiredTokens = [
    'background',
    'foreground',
    'primary',
    'primaryForeground',
    'secondary',
    'secondaryForeground',
  ]

  for (const token of requiredTokens) {
    if (!(token in t.tokens)) {
      return false
    }
  }

  return true
}

/**
 * Export theme as JSON
 */
export function exportTheme(themeId: string): string | null {
  const theme = getTheme(themeId)
  if (!theme) {
    return null
  }
  return JSON.stringify(theme, null, 2)
}

/**
 * Import theme from JSON
 */
export function importTheme(json: string): ThemePreset | null {
  try {
    const theme = JSON.parse(json)
    if (validateTheme(theme)) {
      registerTheme(theme)
      return theme
    }
    console.error('Invalid theme structure')
    return null
  } catch (error) {
    console.error('Failed to parse theme JSON:', error)
    return null
  }
}

/**
 * Get theme names grouped by family
 */
export function getThemeFamilies(): Record<string, ThemePreset[]> {
  const families: Record<string, ThemePreset[]> = {}

  getAllThemes().forEach((theme) => {
    const family = theme.metadata.id.split('-')[0]
    if (!families[family]) {
      families[family] = []
    }
    families[family].push(theme)
  })

  return families
}

