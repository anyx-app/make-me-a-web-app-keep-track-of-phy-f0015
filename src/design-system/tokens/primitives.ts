import type { PrimitiveTokens } from './types'

// Base primitive tokens - the foundation of the design system
// All values are raw, context-free

export const primitives: PrimitiveTokens = {
  colors: {
    neutral: {
      50: '0 0% 98%',
      100: '0 0% 96%',
      200: '0 0% 90%',
      300: '0 0% 83%',
      400: '0 0% 64%',
      500: '0 0% 45%',
      600: '0 0% 32%',
      700: '0 0% 25%',
      800: '0 0% 15%',
      900: '0 0% 9%',
      950: '0 0% 4%',
    },
    primary: {
      50: '210 40% 98%',
      100: '210 40% 96%',
      200: '214 32% 91%',
      300: '213 27% 84%',
      400: '215 20% 65%',
      500: '215 16% 47%',
      600: '215 19% 35%',
      700: '215 25% 27%',
      800: '217 33% 17%',
      900: '222 47% 11%',
      950: '222 84% 5%',
    },
    success: {
      50: '138 76% 97%',
      100: '141 84% 93%',
      200: '141 79% 85%',
      300: '142 77% 73%',
      400: '142 69% 58%',
      500: '142 71% 45%',
      600: '142 76% 36%',
      700: '142 72% 29%',
      800: '143 64% 24%',
      900: '144 61% 20%',
      950: '145 80% 11%',
    },
    warning: {
      50: '48 100% 96%',
      100: '48 96% 89%',
      200: '48 97% 77%',
      300: '46 97% 65%',
      400: '43 96% 56%',
      500: '38 92% 50%',
      600: '32 95% 44%',
      700: '26 90% 37%',
      800: '23 83% 31%',
      900: '22 78% 26%',
      950: '21 92% 14%',
    },
    danger: {
      50: '0 86% 97%',
      100: '0 93% 94%',
      200: '0 96% 89%',
      300: '0 94% 82%',
      400: '0 91% 71%',
      500: '0 84% 60%',
      600: '0 72% 51%',
      700: '0 74% 42%',
      800: '0 70% 35%',
      900: '0 63% 31%',
      950: '0 75% 15%',
    },
  },
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
    '4xl': '6rem',    // 96px
    '5xl': '8rem',    // 128px
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  letterSpacing: {
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
  },
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    base: '0.25rem',  // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    full: '9999px',
  },
  shadow: {
    xs: '0 1px 2px 0 hsl(0 0% 0% / 0.05)',
    sm: '0 1px 3px 0 hsl(0 0% 0% / 0.1), 0 1px 2px -1px hsl(0 0% 0% / 0.1)',
    md: '0 4px 6px -1px hsl(0 0% 0% / 0.1), 0 2px 4px -2px hsl(0 0% 0% / 0.1)',
    lg: '0 10px 15px -3px hsl(0 0% 0% / 0.1), 0 4px 6px -4px hsl(0 0% 0% / 0.1)',
    xl: '0 20px 25px -5px hsl(0 0% 0% / 0.1), 0 8px 10px -6px hsl(0 0% 0% / 0.1)',
  },
  transition: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
    slower: '500ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
}

