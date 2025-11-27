import type { SemanticTokens } from '../tokens/types'

export interface ThemeMetadata {
  id: string
  name: string
  description: string
  category: 'light' | 'dark' | 'auto'
  author?: string
  version?: string
}

export interface Theme {
  metadata: ThemeMetadata
  tokens: SemanticTokens
}

export interface ThemePreset extends Theme {
  preview?: {
    primary: string
    secondary: string
    accent: string
  }
}

