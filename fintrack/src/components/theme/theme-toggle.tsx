import { Moon, Sun } from 'lucide-react'

import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'

export function ThemeToggle() {
  const { resolvedTheme, setTheme } =
    useTheme()

  const isDark = resolvedTheme === 'dark'

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() =>
        setTheme(isDark ? 'light' : 'dark')
      }
      className="
        border-border
        bg-card
        hover:bg-accent
      "
    >
      {isDark ? (
        <Sun className="size-4" />
      ) : (
        <Moon className="size-4" />
      )}
    </Button>
  )
}