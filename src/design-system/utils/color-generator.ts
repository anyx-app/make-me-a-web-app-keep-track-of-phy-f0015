// Utility functions for generating color scales from base HSL values

export interface HSL {
  h: number // 0-360
  s: number // 0-100
  l: number // 0-100
}

/**
 * Parse HSL string (e.g., "210 40% 98%") to HSL object
 */
export function parseHSL(hsl: string): HSL {
  const parts = hsl.trim().split(/\s+/)
  if (parts.length !== 3) {
    throw new Error(`Invalid HSL format: ${hsl}`)
  }
  return {
    h: parseFloat(parts[0]),
    s: parseFloat(parts[1].replace('%', '')),
    l: parseFloat(parts[2].replace('%', '')),
  }
}

/**
 * Convert HSL object to CSS HSL string
 */
export function hslToString(hsl: HSL): string {
  return `${hsl.h} ${hsl.s}% ${hsl.l}%`
}

/**
 * Generate a color scale from a base color
 * @param baseHsl - Base HSL string (e.g., "210 40% 50%")
 * @returns Object with shades 50-950
 */
export function generateColorScale(baseHsl: string) {
  const base = parseHSL(baseHsl)
  
  // Define lightness values for each shade
  const lightnessMap = {
    50: 98,
    100: 96,
    200: 91,
    300: 84,
    400: 65,
    500: base.l, // Use base lightness
    600: Math.max(base.l - 15, 35),
    700: Math.max(base.l - 23, 27),
    800: Math.max(base.l - 33, 17),
    900: Math.max(base.l - 39, 11),
    950: Math.max(base.l - 45, 5),
  }

  const scale: Record<string, string> = {}
  
  Object.entries(lightnessMap).forEach(([shade, lightness]) => {
    // Adjust saturation slightly for very light and very dark shades
    let saturation = base.s
    if (lightness > 90) {
      saturation = Math.max(base.s - 20, 0)
    } else if (lightness < 20) {
      saturation = Math.min(base.s + 10, 100)
    }
    
    scale[shade] = hslToString({
      h: base.h,
      s: saturation,
      l: lightness,
    })
  })
  
  return scale
}

/**
 * Lighten a color by a percentage
 */
export function lighten(hsl: string, amount: number): string {
  const color = parseHSL(hsl)
  return hslToString({
    ...color,
    l: Math.min(color.l + amount, 100),
  })
}

/**
 * Darken a color by a percentage
 */
export function darken(hsl: string, amount: number): string {
  const color = parseHSL(hsl)
  return hslToString({
    ...color,
    l: Math.max(color.l - amount, 0),
  })
}

/**
 * Adjust saturation of a color
 */
export function saturate(hsl: string, amount: number): string {
  const color = parseHSL(hsl)
  return hslToString({
    ...color,
    s: Math.min(Math.max(color.s + amount, 0), 100),
  })
}

/**
 * Generate complementary color (opposite on color wheel)
 */
export function complementary(hsl: string): string {
  const color = parseHSL(hsl)
  return hslToString({
    ...color,
    h: (color.h + 180) % 360,
  })
}

/**
 * Generate analogous colors (adjacent on color wheel)
 */
export function analogous(hsl: string, degrees = 30): [string, string] {
  const color = parseHSL(hsl)
  return [
    hslToString({ ...color, h: (color.h - degrees + 360) % 360 }),
    hslToString({ ...color, h: (color.h + degrees) % 360 }),
  ]
}

/**
 * Calculate contrast ratio between two colors
 * Useful for accessibility checking
 */
export function getContrastRatio(hsl1: string, hsl2: string): number {
  const getLuminance = (hsl: HSL): number => {
    // Simplified luminance calculation
    return hsl.l / 100
  }
  
  const color1 = parseHSL(hsl1)
  const color2 = parseHSL(hsl2)
  
  const lum1 = getLuminance(color1)
  const lum2 = getLuminance(color2)
  
  const lighter = Math.max(lum1, lum2)
  const darker = Math.min(lum1, lum2)
  
  return (lighter + 0.05) / (darker + 0.05)
}

/**
 * Check if a color combination meets WCAG contrast requirements
 */
export function meetsContrastRequirement(
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean {
  const ratio = getContrastRatio(foreground, background)
  
  if (level === 'AAA') {
    return size === 'large' ? ratio >= 4.5 : ratio >= 7
  }
  return size === 'large' ? ratio >= 3 : ratio >= 4.5
}

