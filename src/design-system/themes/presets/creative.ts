import type { ThemePreset } from '../types'

/**
 * Creative/Agency Theme Family
 * 
 * Bold, expressive, artistic
 * Perfect for: Design agencies, portfolios, creative studios, fashion
 * Vibes: Vibrant colors, strong contrasts, experimental
 */

export const creativeLight: ThemePreset = {
  metadata: {
    id: 'creative-light',
    name: 'Creative Light',
    description: 'Bold and expressive with vibrant colors',
    category: 'light',
    author: 'AnyX Design System',
    tags: ['creative', 'bold', 'artistic', 'vibrant'],
  },
  tokens: {
    background: '0 0% 100%',
    foreground: '270 50% 10%',
    
    card: '0 0% 100%',
    cardForeground: '270 50% 10%',
    
    popover: '0 0% 100%',
    popoverForeground: '270 50% 10%',
    
    primary: '330 85% 55%',            // Hot pink/magenta
    primaryForeground: '0 0% 100%',
    
    secondary: '270 20% 95%',
    secondaryForeground: '270 50% 10%',
    
    muted: '270 20% 95%',
    mutedForeground: '270 30% 40%',
    
    accent: '45 100% 55%',             // Bright yellow
    accentForeground: '270 50% 10%',
    
    destructive: '0 90% 55%',
    destructiveForeground: '0 0% 100%',
    
    success: '145 75% 45%',
    successForeground: '0 0% 100%',
    
    warning: '25 100% 50%',
    warningForeground: '0 0% 100%',
    
    border: '270 15% 88%',
    input: '270 15% 88%',
    ring: '330 85% 55%',
    
    radius: '1rem',
  },
  preview: {
    background: '#ffffff',
    primary: '#e91e63',
    accent: '#ffd500',
  },
}

export const creativeDark: ThemePreset = {
  metadata: {
    id: 'creative-dark',
    name: 'Creative Dark',
    description: 'Dramatic dark mode for creative work',
    category: 'dark',
    author: 'AnyX Design System',
    tags: ['creative', 'dark', 'dramatic', 'bold'],
  },
  tokens: {
    background: '270 35% 8%',
    foreground: '270 15% 95%',
    
    card: '270 30% 12%',
    cardForeground: '270 15% 95%',
    
    popover: '270 30% 12%',
    popoverForeground: '270 15% 95%',
    
    primary: '330 90% 65%',            // Bright magenta
    primaryForeground: '0 0% 100%',
    
    secondary: '270 30% 16%',
    secondaryForeground: '270 15% 95%',
    
    muted: '270 30% 16%',
    mutedForeground: '270 15% 65%',
    
    accent: '45 100% 60%',             // Vibrant yellow
    accentForeground: '270 35% 8%',
    
    destructive: '0 85% 65%',
    destructiveForeground: '0 0% 100%',
    
    success: '145 75% 55%',
    successForeground: '270 35% 8%',
    
    warning: '25 100% 55%',
    warningForeground: '270 35% 8%',
    
    border: '270 25% 20%',
    input: '270 25% 20%',
    ring: '330 90% 65%',
    
    radius: '1rem',
  },
  preview: {
    background: '#120a1a',
    primary: '#f472b6',
    accent: '#ffd500',
  },
}

