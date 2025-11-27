import type { ThemePreset } from '../types'

/**
 * Gaming Theme Family
 * 
 * High energy, immersive, exciting
 * Perfect for: Gaming platforms, esports, entertainment, streaming
 * Vibes: Neon, dark mode heavy, RGB aesthetic
 */

export const gamingLight: ThemePreset = {
  metadata: {
    id: 'gaming-light',
    name: 'Gaming Light',
    description: 'High-energy theme with electric accents',
    category: 'light',
    author: 'AnyX Design System',
    tags: ['gaming', 'energy', 'neon', 'entertainment'],
  },
  tokens: {
    background: '0 0% 98%',
    foreground: '280 40% 10%',
    
    card: '0 0% 100%',
    cardForeground: '280 40% 10%',
    
    popover: '0 0% 100%',
    popoverForeground: '280 40% 10%',
    
    primary: '280 90% 55%',            // Vibrant purple
    primaryForeground: '0 0% 100%',
    
    secondary: '280 15% 94%',
    secondaryForeground: '280 40% 10%',
    
    muted: '280 15% 94%',
    mutedForeground: '280 20% 40%',
    
    accent: '165 90% 45%',             // Cyan/turquoise
    accentForeground: '0 0% 100%',
    
    destructive: '0 85% 55%',
    destructiveForeground: '0 0% 100%',
    
    success: '120 85% 45%',
    successForeground: '0 0% 100%',
    
    warning: '38 100% 50%',
    warningForeground: '0 0% 100%',
    
    border: '280 15% 89%',
    input: '280 15% 89%',
    ring: '280 90% 55%',
    
    radius: '0.5rem',
  },
  preview: {
    background: '#fafafa',
    primary: '#9333ea',
    accent: '#14b8a6',
  },
}

export const gamingDark: ThemePreset = {
  metadata: {
    id: 'gaming-dark',
    name: 'Gaming Dark',
    description: 'Immersive dark mode with RGB vibes',
    category: 'dark',
    author: 'AnyX Design System',
    tags: ['gaming', 'dark', 'neon', 'rgb', 'cyberpunk'],
  },
  tokens: {
    background: '280 30% 6%',          // Very dark purple-black
    foreground: '280 15% 96%',
    
    card: '280 25% 10%',
    cardForeground: '280 15% 96%',
    
    popover: '280 25% 10%',
    popoverForeground: '280 15% 96%',
    
    primary: '280 95% 60%',            // Neon purple
    primaryForeground: '0 0% 100%',
    
    secondary: '280 25% 14%',
    secondaryForeground: '280 15% 96%',
    
    muted: '280 25% 14%',
    mutedForeground: '280 15% 65%',
    
    accent: '165 95% 50%',             // Electric cyan
    accentForeground: '280 30% 6%',
    
    destructive: '0 90% 65%',
    destructiveForeground: '0 0% 100%',
    
    success: '120 90% 50%',
    successForeground: '280 30% 6%',
    
    warning: '38 100% 55%',
    warningForeground: '280 30% 6%',
    
    border: '280 25% 18%',
    input: '280 25% 18%',
    ring: '280 95% 60%',
    
    radius: '0.5rem',
  },
  preview: {
    background: '#0d0511',
    primary: '#a855f7',
    accent: '#14b8a6',
  },
}

