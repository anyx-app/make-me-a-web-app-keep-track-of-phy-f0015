import type { ThemePreset } from '../types'

/**
 * Tech/AI Theme Family
 * 
 * Futuristic, cutting-edge, high-tech aesthetic
 * Perfect for: AI products, dev tools, fintech, crypto
 * Vibes: Neon accents, dark mode friendly, electric blue
 */

export const techLight: ThemePreset = {
  metadata: {
    id: 'tech-light',
    name: 'Tech Light',
    description: 'Futuristic and clean with electric blue accents',
    category: 'light',
    author: 'AnyX Design System',
    tags: ['tech', 'ai', 'modern', 'futuristic'],
  },
  tokens: {
    background: '0 0% 100%',           // Pure white
    foreground: '220 15% 10%',         // Near black with blue tint
    
    card: '0 0% 100%',
    cardForeground: '220 15% 10%',
    
    popover: '0 0% 100%',
    popoverForeground: '220 15% 10%',
    
    primary: '210 100% 50%',           // Electric blue
    primaryForeground: '0 0% 100%',
    
    secondary: '220 14% 96%',
    secondaryForeground: '220 15% 10%',
    
    muted: '220 14% 96%',
    mutedForeground: '220 10% 40%',
    
    accent: '280 100% 65%',            // Purple/violet accent
    accentForeground: '0 0% 100%',
    
    destructive: '0 84% 60%',
    destructiveForeground: '0 0% 100%',
    
    success: '142 76% 45%',
    successForeground: '0 0% 100%',
    
    warning: '38 92% 50%',
    warningForeground: '0 0% 100%',
    
    border: '220 13% 91%',
    input: '220 13% 91%',
    ring: '210 100% 50%',
    
    radius: '0.75rem',
  },
  preview: {
    background: '#ffffff',
    primary: '#0080ff',
    accent: '#a855f7',
  },
}

export const techDark: ThemePreset = {
  metadata: {
    id: 'tech-dark',
    name: 'Tech Dark',
    description: 'Cyberpunk-inspired dark theme with neon accents',
    category: 'dark',
    author: 'AnyX Design System',
    tags: ['tech', 'ai', 'dark', 'neon', 'cyberpunk'],
  },
  tokens: {
    background: '220 25% 8%',          // Very dark blue-gray
    foreground: '210 40% 98%',
    
    card: '220 20% 12%',
    cardForeground: '210 40% 98%',
    
    popover: '220 20% 12%',
    popoverForeground: '210 40% 98%',
    
    primary: '195 100% 50%',           // Cyan/electric blue
    primaryForeground: '220 25% 8%',
    
    secondary: '220 20% 16%',
    secondaryForeground: '210 40% 98%',
    
    muted: '220 20% 16%',
    mutedForeground: '210 20% 60%',
    
    accent: '280 90% 60%',             // Vibrant purple
    accentForeground: '220 25% 8%',
    
    destructive: '0 80% 65%',
    destructiveForeground: '220 25% 8%',
    
    success: '142 70% 50%',
    successForeground: '220 25% 8%',
    
    warning: '38 92% 50%',
    warningForeground: '220 25% 8%',
    
    border: '220 20% 20%',
    input: '220 20% 20%',
    ring: '195 100% 50%',
    
    radius: '0.75rem',
  },
  preview: {
    background: '#0f1419',
    primary: '#00ccff',
    accent: '#b366ff',
  },
}

