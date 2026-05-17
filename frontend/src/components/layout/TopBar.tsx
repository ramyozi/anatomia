import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Activity } from 'lucide-react'
import { useState } from 'react'
import { GlobalSearch } from '../search/GlobalSearch'
import { ThemeToggle } from './ThemeToggle'
import { MobileNav } from './MobileNav'
import { cn } from '@/lib/cn'

const NAV = [
  { to: '/corps', label: 'Corps' },
  { to: '/maladies', label: 'Maladies' },
  { to: '/monde', label: 'Monde' },
  { to: '/statistiques', label: 'Stats' },
  { to: '/glossaire', label: 'Glossaire' },
  { to: '/quiz', label: 'Quiz' },
]

export function TopBar() {
  const [searchOpen, setSearchOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 transition-colors duration-300',
          isHome
            ? 'bg-transparent'
            : 'bg-bg/70 backdrop-blur-xl border-b border-line/60',
        )}
      >
        {/* Bar height stays 4rem — pages depend on calc(100vh-4rem). */}
        <div className="max-w-[1400px] mx-auto flex items-center gap-4 lg:gap-6 px-4 sm:px-6 h-16">
          <Link to="/" className="flex items-center gap-2.5 group">
            <motion.div
              initial={{ rotate: -10, scale: 0.9 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="relative grid place-items-center w-9 h-9 rounded-lg bg-accent/10 border border-accent/30"
            >
              <Activity className="w-[18px] h-[18px] text-accent" />
              <span className="absolute inset-0 rounded-lg bg-accent/10 blur-md group-hover:blur-lg transition-all" />
            </motion.div>
            <span className="font-display text-xl tracking-tight">
              Anatomia
            </span>
            <span className="hidden md:inline text-[10px] uppercase tracking-[0.2em] text-ink-dim ml-1.5 mt-0.5">
              v0.1
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5 text-[15px]">
            {NAV.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'relative inline-flex items-center px-3.5 min-h-[40px] rounded-md transition-colors',
                    isActive
                      ? 'text-ink'
                      : 'text-ink-mute hover:text-ink',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="relative z-10">{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="topbar-active"
                        className="absolute inset-0 rounded-md bg-accent/10 border border-accent/30"
                        transition={{ type: 'spring', bounce: 0.18, duration: 0.5 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Rechercher"
              className="flex items-center gap-2 px-2.5 sm:px-3 h-11 sm:h-auto sm:py-1.5 text-xs text-ink-mute border border-line/70 rounded-md hover:border-line hover:text-ink transition-colors"
            >
              <Search className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Rechercher</span>
              <kbd className="hidden sm:inline text-[10px] px-1.5 py-0.5 rounded bg-bg-elev border border-line/70">
                ⌘K
              </kbd>
            </button>
            {/* Theme picker: in the bar on desktop, inside the drawer on mobile. */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>
            <MobileNav items={NAV} />
          </div>
        </div>
      </header>

      <GlobalSearch open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
