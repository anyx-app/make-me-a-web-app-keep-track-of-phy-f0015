import type { ComponentTokens } from './types'

// Component-specific tokens
// These can be overridden per-theme for fine-grained control

export const lightComponentTokens: ComponentTokens = {
  button: {
    defaultBg: 'var(--primary)',
    defaultHoverBg: 'var(--primary)',
    defaultActiveBg: 'var(--primary)',
  },
  input: {
    borderColor: 'var(--border)',
    focusBorderColor: 'var(--ring)',
    disabledBg: 'var(--muted)',
  },
  card: {
    borderColor: 'var(--border)',
    hoverBorderColor: 'var(--accent)',
  },
}

export const darkComponentTokens: ComponentTokens = {
  button: {
    defaultBg: 'var(--primary)',
    defaultHoverBg: 'var(--primary)',
    defaultActiveBg: 'var(--primary)',
  },
  input: {
    borderColor: 'var(--border)',
    focusBorderColor: 'var(--ring)',
    disabledBg: 'var(--muted)',
  },
  card: {
    borderColor: 'var(--border)',
    hoverBorderColor: 'var(--accent)',
  },
}

