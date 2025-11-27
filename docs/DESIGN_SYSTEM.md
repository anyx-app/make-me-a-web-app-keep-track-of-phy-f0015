# Design System Quick Reference

## Overview

This project now includes a production-ready design system with:
- 10 theme presets (5 families × light/dark variants)
- Comprehensive design tokens
- Visual theme customizer
- Theme import/export
- Full TypeScript support

## Quick Start

### Using Theme Selector
```tsx
import { ThemeSelector } from '@/components/theme/ThemeSelector'

<ThemeSelector /> // Full theme picker with previews
```

### Toggle Light/Dark
```tsx
import { ThemeToggle } from '@/components/common/ThemeToggle'

<ThemeToggle /> // Quick light/dark toggle
```

### Programmatic Theme Switching
```tsx
import { useTheme } from '@/theme/ThemeProvider'

const { themeId, setTheme } = useTheme()
setTheme('ocean-dark')
```

## Available Themes

- `default-light` / `default-dark` - Clean, neutral
- `ocean-light` / `ocean-dark` - Calming blues
- `sunset-light` / `sunset-dark` - Warm oranges/purples
- `professional-light` / `professional-dark` - Corporate gray/blue
- `high-contrast-light` / `high-contrast-dark` - WCAG AAA compliant

## Design Tokens

### Colors
Use semantic tokens in your components:
```tsx
<div className="bg-background text-foreground">
  <button className="bg-primary text-primary-foreground">
    Click me
  </button>
</div>
```

Available color tokens:
- `background`, `foreground`
- `primary`, `primary-foreground`
- `secondary`, `secondary-foreground`
- `muted`, `muted-foreground`
- `accent`, `accent-foreground`
- `destructive`, `destructive-foreground`
- `success`, `success-foreground`
- `warning`, `warning-foreground`
- `border`, `input`, `ring`

### Spacing
CSS variables: `--spacing-xs` through `--spacing-5xl`

Utility classes:
```tsx
<div className="spacing-md">    // padding: 1rem
<div className="spacing-lg">    // padding: 1.5rem
```

### Shadows
CSS variables: `--shadow-xs` through `--shadow-xl`

Utility classes:
```tsx
<div className="shadow-design-md">
<div className="shadow-design-lg">
```

### Transitions
CSS variables: `--transition-fast`, `--transition-base`, `--transition-slow`

Utility classes:
```tsx
<div className="transition-base">
```

## Theme Customization

### Visual Customizer
```tsx
import { ThemeCustomizer } from '@/components/theme/ThemeCustomizer'

<ThemeCustomizer />
```

Features:
- Live color editing
- Export theme as JSON
- Import custom themes
- Download theme files

### Programmatic Theme Creation
```tsx
import { registerTheme } from '@/design-system/themes/theme-registry'
import type { ThemePreset } from '@/design-system/themes/types'

const myTheme: ThemePreset = {
  metadata: {
    id: 'my-theme',
    name: 'My Theme',
    description: 'Custom theme',
    category: 'light',
  },
  tokens: {
    background: '0 0% 100%',
    foreground: '0 0% 0%',
    primary: '220 100% 50%',
    primaryForeground: '0 0% 100%',
    // ... other tokens
  },
}

registerTheme(myTheme)
setTheme('my-theme')
```

## Color Utilities

```tsx
import { 
  generateColorScale, 
  lighten, 
  darken, 
  complementary,
  meetsContrastRequirement 
} from '@/design-system/utils/color-generator'

// Generate full scale from base color
const scale = generateColorScale('220 100% 50%')

// Manipulate colors
const lighter = lighten('220 100% 50%', 10)
const darker = darken('220 100% 50%', 10)

// Check accessibility
const isAccessible = meetsContrastRequirement(
  '0 0% 100%', 
  '0 0% 0%', 
  'AA', 
  'normal'
)
```

## Routes

- `/themes` - Theme showcase and customizer

## File Structure

```
src/
├── design-system/
│   ├── tokens/
│   │   ├── primitives.ts      # Base values
│   │   ├── semantic.ts        # Contextual mappings
│   │   ├── component.ts       # Component tokens
│   │   └── types.ts           # TypeScript types
│   ├── themes/
│   │   ├── presets/           # 10 theme presets
│   │   ├── theme-registry.ts  # Theme management
│   │   └── types.ts
│   └── utils/
│       └── color-generator.ts # Color utilities
├── components/
│   └── theme/
│       ├── ThemeSelector.tsx  # Theme picker
│       └── ThemeCustomizer.tsx # Visual editor
└── theme/
    └── ThemeProvider.tsx      # Context provider
```

## Migration Notes

### Backward Compatibility
Old code continues to work:
```tsx
setTheme('light')  // Maps to 'default-light'
setTheme('dark')   // Maps to 'default-dark'
```

### Upgrading Components
1. Replace hard-coded colors with tokens
2. Use ThemeSelector instead of basic toggle
3. Test with multiple themes at `/themes`

## Best Practices

1. Always use semantic tokens (`--primary`) instead of raw colors
2. Test themes for accessibility with high-contrast presets
3. Export custom themes for version control
4. Use TypeScript types for autocomplete
5. Leverage the visual customizer for rapid prototyping

## Examples

### Header with Theme Controls
```tsx
import { ThemeSelector } from '@/components/theme/ThemeSelector'
import { ThemeToggle } from '@/components/common/ThemeToggle'

export function Header() {
  return (
    <header className="flex items-center justify-between p-4 bg-background border-b border-border">
      <h1 className="text-2xl font-bold">My App</h1>
      <div className="flex gap-2">
        <ThemeToggle />
        <ThemeSelector />
      </div>
    </header>
  )
}
```

### Settings Page with Customizer
```tsx
import { ThemeCustomizer } from '@/components/theme/ThemeCustomizer'

export default function Settings() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Theme Settings</h1>
      <ThemeCustomizer />
    </div>
  )
}
```

### Custom Themed Component
```tsx
import { useTheme } from '@/theme/ThemeProvider'

export function ThemedCard() {
  const { theme } = useTheme()
  
  return (
    <div className="p-4 bg-card text-card-foreground rounded-lg shadow-design-md transition-base">
      <h3 className="text-lg font-semibold mb-2">
        Using {theme?.metadata.name}
      </h3>
      <p className="text-muted-foreground">
        This card adapts to any theme automatically.
      </p>
    </div>
  )
}
```

## Troubleshooting

### Theme Not Applying
- Check that ThemeProvider wraps your app in App.tsx
- Verify theme ID is valid in theme registry
- Check browser console for errors

### Colors Not Updating
- Ensure you're using CSS variables (`hsl(var(--primary))`)
- Use semantic tokens instead of hard-coded values
- Check that component uses token classes

### Custom Theme Not Loading
- Validate theme structure with validateTheme()
- Ensure all required tokens are present
- Register theme before trying to use it

## Support

For issues or questions:
1. Check `/themes` page for live examples
2. Review theme registry in `src/design-system/themes/`
3. Inspect CSS variables in browser DevTools
4. Check README.md for detailed documentation

