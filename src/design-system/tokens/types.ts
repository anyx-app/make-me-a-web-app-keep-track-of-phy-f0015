// Core token types for the design system

export interface ColorScale {
  50: string
  100: string
  200: string
  300: string
  400: string
  500: string
  600: string
  700: string
  800: string
  900: string
  950: string
}

export interface SpacingScale {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  '4xl': string
  '5xl': string
}

export interface TypographyScale {
  xs: string
  sm: string
  base: string
  lg: string
  xl: string
  '2xl': string
  '3xl': string
  '4xl': string
  '5xl': string
}

export interface ShadowScale {
  xs: string
  sm: string
  md: string
  lg: string
  xl: string
}

export interface TransitionScale {
  fast: string
  base: string
  slow: string
  slower: string
}

export interface PrimitiveTokens {
  colors: {
    neutral: ColorScale
    primary: ColorScale
    success: ColorScale
    warning: ColorScale
    danger: ColorScale
  }
  spacing: SpacingScale
  fontSize: TypographyScale
  lineHeight: {
    tight: string
    normal: string
    relaxed: string
    loose: string
  }
  fontWeight: {
    light: string
    normal: string
    medium: string
    semibold: string
    bold: string
  }
  letterSpacing: {
    tight: string
    normal: string
    wide: string
  }
  borderRadius: {
    none: string
    sm: string
    base: string
    md: string
    lg: string
    xl: string
    full: string
  }
  shadow: ShadowScale
  transition: TransitionScale
}

export interface SemanticTokens {
  background: string
  foreground: string
  card: string
  cardForeground: string
  popover: string
  popoverForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  destructive: string
  destructiveForeground: string
  border: string
  input: string
  ring: string
  success: string
  successForeground: string
  warning: string
  warningForeground: string
}

export interface ComponentTokens {
  button: {
    defaultBg: string
    defaultHoverBg: string
    defaultActiveBg: string
  }
  input: {
    borderColor: string
    focusBorderColor: string
    disabledBg: string
  }
  card: {
    borderColor: string
    hoverBorderColor: string
  }
}

