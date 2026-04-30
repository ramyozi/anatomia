import { Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { Fragment } from 'react'

interface Crumb {
  to: string
  label: string
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-ink-mute flex-wrap">
      <Link to="/" className="hover:text-ink inline-flex items-center gap-1">
        <Home className="w-3.5 h-3.5" />
      </Link>
      {items.map((c, i) => (
        <Fragment key={c.to}>
          <ChevronRight className="w-3 h-3 text-ink-dim" />
          {i === items.length - 1 ? (
            <span className="text-ink">{c.label}</span>
          ) : (
            <Link to={c.to} className="hover:text-ink">
              {c.label}
            </Link>
          )}
        </Fragment>
      ))}
    </nav>
  )
}
