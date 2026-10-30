import { NavLink } from 'react-router-dom'

import { navItems } from './nav-items'

export function AppBottomNavigation() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="mx-auto flex max-w-7xl items-stretch justify-between rounded-t-2xl border-t border-border bg-card/95 px-1 py-2 sm:px-4 sm:py-3 backdrop-blur-xl shadow-[0_-10px_30px_rgba(15,23,42,0.3)]">
        {navItems.filter(item => item.href !== '/reports' && item.href !== '/settings').slice(0, 5).map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            className={({ isActive }) =>
              `flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-0.5 py-2 text-[10px] sm:rounded-2xl sm:px-2 sm:text-xs font-medium transition-colors duration-150 ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <item.icon className="size-5" />
            <span className="w-full truncate text-center leading-tight">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
