import { useTheme } from '@/theme/ThemeProvider'

export function ThemeToggle() {
  const { themeId, setTheme } = useTheme()
  const isDark = themeId.includes('dark')
  
  const handleToggle = () => {
    // Toggle between light and dark variants of the current theme family
    const family = themeId.split('-')[0]
    const newTheme = isDark ? `${family}-light` : `${family}-dark`
    setTheme(newTheme)
  }
  
  return (
    <button
      type="button"
      onClick={handleToggle}
      className="px-3 py-2 rounded border"
      aria-label="Toggle theme"
    >
      {isDark ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}


