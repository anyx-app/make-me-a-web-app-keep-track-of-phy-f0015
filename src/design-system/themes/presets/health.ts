import type { ThemePreset } from '../types'

/**
 * Health & Wellness Theme Family
 * 
 * Calming, trustworthy, caring
 * Perfect for: Healthcare apps, wellness platforms, fitness, meditation
 * Vibes: Soft greens and blues, organic, approachable
 */

export const healthLight: ThemePreset = {
  metadata: {
    id: 'health-light',
    name: 'Health Light',
    description: 'Calming and trustworthy with soft greens',
    category: 'light',
    author: 'AnyX Design System',
    tags: ['health', 'wellness', 'calm', 'organic'],
  },
  tokens: {
    background: '0 0% 100%',
    foreground: '160 30% 15%',
    
    card: '0 0% 100%',
    cardForeground: '160 30% 15%',
    
    popover: '0 0% 100%',
    popoverForeground: '160 30% 15%',
    
    primary: '160 60% 45%',            // Soft teal/green
    primaryForeground: '0 0% 100%',
    
    secondary: '160 20% 95%',
    secondaryForeground: '160 30% 15%',
    
    muted: '160 20% 95%',
    mutedForeground: '160 20% 40%',
    
    accent: '200 70% 55%',             // Calm blue
    accentForeground: '0 0% 100%',
    
    destructive: '0 70% 55%',
    destructiveForeground: '0 0% 100%',
    
    success: '145 70% 45%',
    successForeground: '0 0% 100%',
    
    warning: '38 92% 50%',
    warningForeground: '0 0% 100%',
    
    border: '160 15% 90%',
    input: '160 15% 90%',
    ring: '160 60% 45%',
    
    radius: '0.75rem',
  },
  preview: {
    background: '#ffffff',
    primary: '#2d9d8c',
    accent: '#3b9fd4',
  },
}

export const healthDark: ThemePreset = {
  metadata: {
    id: 'health-dark',
    name: 'Health Dark',
    description: 'Restful dark mode with natural tones',
    category: 'dark',
    author: 'AnyX Design System',
    tags: ['health', 'dark', 'calm', 'rest'],
  },
  tokens: {
    background: '160 25% 10%',
    foreground: '160 15% 92%',
    
    card: '160 20% 14%',
    cardForeground: '160 15% 92%',
    
    popover: '160 20% 14%',
    popoverForeground: '160 15% 92%',
    
    primary: '160 65% 50%',
    primaryForeground: '160 25% 10%',
    
    secondary: '160 20% 18%',
    secondaryForeground: '160 15% 92%',
    
    muted: '160 20% 18%',
    mutedForeground: '160 15% 65%',
    
    accent: '200 70% 55%',
    accentForeground: '160 25% 10%',
    
    destructive: '0 70% 60%',
    destructiveForeground: '0 0% 100%',
    
    success: '145 70% 50%',
    successForeground: '160 25% 10%',
    
    warning: '38 92% 55%',
    warningForeground: '160 25% 10%',
    
    border: '160 20% 22%',
    input: '160 20% 22%',
    ring: '160 65% 50%',
    
    radius: '0.75rem',
  },
  preview: {
    background: '#141f1d',
    primary: '#34d399',
    accent: '#3b9fd4',
  },
}

