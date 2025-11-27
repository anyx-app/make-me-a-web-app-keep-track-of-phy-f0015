import type { SemanticTokens } from './types'
import { primitives } from './primitives'

// Semantic tokens - contextual mappings that reference primitives
// These provide meaning and intent to the raw primitive values

export const lightSemanticTokens: SemanticTokens = {
  background: primitives.colors.neutral[50],
  foreground: primitives.colors.neutral[950],
  
  card: primitives.colors.neutral[50],
  cardForeground: primitives.colors.neutral[950],
  
  popover: primitives.colors.neutral[50],
  popoverForeground: primitives.colors.neutral[950],
  
  primary: primitives.colors.primary[900],
  primaryForeground: primitives.colors.neutral[50],
  
  secondary: primitives.colors.neutral[100],
  secondaryForeground: primitives.colors.primary[900],
  
  muted: primitives.colors.neutral[100],
  mutedForeground: primitives.colors.neutral[600],
  
  accent: primitives.colors.neutral[100],
  accentForeground: primitives.colors.primary[900],
  
  destructive: primitives.colors.danger[500],
  destructiveForeground: primitives.colors.neutral[50],
  
  border: primitives.colors.neutral[200],
  input: primitives.colors.neutral[200],
  ring: primitives.colors.neutral[950],
  
  success: primitives.colors.success[500],
  successForeground: primitives.colors.neutral[50],
  
  warning: primitives.colors.warning[500],
  warningForeground: primitives.colors.neutral[50],
}

export const darkSemanticTokens: SemanticTokens = {
  background: primitives.colors.neutral[950],
  foreground: primitives.colors.neutral[50],
  
  card: primitives.colors.neutral[950],
  cardForeground: primitives.colors.neutral[50],
  
  popover: primitives.colors.neutral[950],
  popoverForeground: primitives.colors.neutral[50],
  
  primary: primitives.colors.neutral[50],
  primaryForeground: primitives.colors.primary[900],
  
  secondary: primitives.colors.neutral[800],
  secondaryForeground: primitives.colors.neutral[50],
  
  muted: primitives.colors.neutral[800],
  mutedForeground: primitives.colors.neutral[400],
  
  accent: primitives.colors.neutral[800],
  accentForeground: primitives.colors.neutral[50],
  
  destructive: primitives.colors.danger[700],
  destructiveForeground: primitives.colors.neutral[50],
  
  border: primitives.colors.neutral[800],
  input: primitives.colors.neutral[800],
  ring: primitives.colors.neutral[300],
  
  success: primitives.colors.success[600],
  successForeground: primitives.colors.neutral[50],
  
  warning: primitives.colors.warning[600],
  warningForeground: primitives.colors.neutral[50],
}

