import { NavLink } from 'react-router-dom'
import { useUserSettings } from '@/features/settings/hooks/use-user-settings'
import { useAuth } from '@/providers/auth-context'
import { navItems } from './nav-items'

export function AppSidebar() {
  const { data: settings } = useUserSettings()
  const { user } = useAuth()

  const displayName =
    settings?.display_name ??
    user?.email?.split('@')[0] ??
    'Usuário'

  return (
    <aside
      className="
        hidden
        lg:flex
        sticky
        top-0
        flex
        h-screen
        w-[280px]
        flex-col
        border-r
        border-border
        bg-card
        px-6
        py-6
      "
    >
      {/* Logo */}
      <div className="mb-10">
        <h1
          className="
            text-2xl
            font-medium
            tracking-tight
          "
        >
          Fintrack
        </h1>

        <p
          className="
            mt-1
            text-sm
            text-muted-foreground
          "
        >
          Controle financeiro inteligente
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => {
          const Icon = item.icon

          return (
            <NavLink
              key={item.label}
              to={item.href}
              className={({ isActive }) =>
                `
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition-colors
                  ${
                    isActive
                      ? `
                        bg-primary/10
                        text-primary
                      `
                      : `
                        text-muted-foreground
                        hover:bg-accent
                        hover:text-foreground
                      `
                  }
                `
              }
            >
              <Icon className="size-5" />

              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>

      {/* Bottom */}
      <div
        className="
          mt-auto
          border-t
          border-border
          pt-4
        "
      >
        <div>
          <p className="text-sm font-medium">
            {displayName}
          </p>
 
          <p
            className="
              mt-1
              text-xs
              text-muted-foreground
            "
          >
            {user?.email ?? 'Fintrack User'}
          </p>
        </div>
      </div>
    </aside>
  )
}