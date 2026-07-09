import { Moon, Sun } from 'lucide-react'

import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme()

  const activeTheme =
    theme === 'system'
      ? resolvedTheme ?? 'dark'
      : theme ?? 'dark'
  const isDark = activeTheme === 'dark'

  function handleToggle() {
    setTheme(isDark ? 'light' : 'dark')
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleToggle}
      className="
        border-border
        bg-card
        hover:bg-accent
      "
      aria-label={isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro'}
    >
      {isDark ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  )
}