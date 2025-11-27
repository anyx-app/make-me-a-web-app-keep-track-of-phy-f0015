import type { ThemePreset } from '../types'

/**
 * Finance Theme Family
 * 
 * Trust, stability, professionalism
 * Perfect for: Banking, fintech, insurance, legal, B2B SaaS
 * Vibes: Navy blue, gold accents, serious but approachable
 */

export const financeLight: ThemePreset = {
  metadata: {
    id: 'finance-light',
    name: 'Finance Light',
    description: 'Professional and trustworthy with navy and gold',
    category: 'light',
    author: 'AnyX Design System',
    tags: ['finance', 'corporate', 'professional', 'trust'],
  },
  tokens: {
    background: '0 0% 100%',
    foreground: '220 40% 15%',         // Dark navy blue
    
    card: '0 0% 100%',
    cardForeground: '220 40% 15%',
    
    popover: '0 0% 100%',
    popoverForeground: '220 40% 15%',
    
    primary: '220 60% 35%',            // Deep navy blue
    primaryForeground: '0 0% 100%',
    
    secondary: '220 15% 95%',
    secondaryForeground: '220 40% 15%',
    
    muted: '220 15% 95%',
    mutedForeground: '220 20% 45%',
    
    accent: '40 85% 50%',              // Gold accent
    accentForeground: '220 40% 15%',
    
    destructive: '0 70% 50%',
    destructiveForeground: '0 0% 100%',
    
    success: '145 65% 40%',
    successForeground: '0 0% 100%',
    
    warning: '38 92% 50%',
    warningForeground: '0 0% 100%',
    
    border: '220 13% 91%',
    input: '220 13% 91%',
    ring: '220 60% 35%',
    
    radius: '0.375rem',
  },
  preview: {
    background: '#ffffff',
    primary: '#1e3a8a',
    accent: '#f59e0b',
  },
}

export const financeDark: ThemePreset = {
  metadata: {
    id: 'finance-dark',
    name: 'Finance Dark',
    description: 'Premium dark mode for financial applications',
    category: 'dark',
    author: 'AnyX Design System',
    tags: ['finance', 'dark', 'premium', 'professional'],
  },
  tokens: {
    background: '220 40% 8%',
    foreground: '220 15% 95%',
    
    card: '220 35% 12%',
    cardForeground: '220 15% 95%',
    
    popover: '220 35% 12%',
    popoverForeground: '220 15% 95%',
    
    primary: '220 70% 55%',            // Bright blue
    primaryForeground: '0 0% 100%',
    
    secondary: '220 35% 16%',
    secondaryForeground: '220 15% 95%',
    
    muted: '220 35% 16%',
    mutedForeground: '220 15% 65%',
    
    accent: '40 90% 55%',              // Gold
    accentForeground: '220 40% 8%',
    
    destructive: '0 70% 60%',
    destructiveForeground: '0 0% 100%',
    
    success: '145 65% 50%',
    successForeground: '220 40% 8%',
    
    warning: '38 92% 55%',
    warningForeground: '220 40% 8%',
    
    border: '220 30% 20%',
    input: '220 30% 20%',
    ring: '220 70% 55%',
    
    radius: '0.375rem',
  },
  preview: {
    background: '#0a1220',
    primary: '#3b82f6',
    accent: '#fbbf24',
  },
}

