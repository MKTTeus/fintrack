import { NavLink } from 'react-router-dom'

import { navItems } from './nav-items'

export function AppBottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-t-3xl border-t border-border bg-card/95 px-4 py-3 backdrop-blur-xl shadow-[0_-10px_30px_rgba(15,23,42,0.3)]">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.label}
            to={item.href}
            className={({ isActive }) =>
              `flex min-w-[0] flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-xs font-medium transition-colors duration-150 ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`
            }
          >
            <item.icon className="size-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
