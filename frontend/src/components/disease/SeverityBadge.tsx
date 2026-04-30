import { cn } from '@/lib/cn'
import type { Severity } from '@/types'

const STYLES: Record<Severity, string> = {
  mild: 'bg-accent/10 text-accent border-accent/30',
  moderate: 'bg-gold/10 text-gold border-gold/30',
  severe: 'bg-coral/10 text-coral border-coral/30',
  critical: 'bg-coral/20 text-coral border-coral/40 ring-1 ring-coral/30',
}

const LABELS: Record<Severity, string> = {
  mild: 'Légère',
  moderate: 'Modérée',
  severe: 'Sévère',
  critical: 'Critique',
}

export function SeverityBadge({
  severity,
  className,
}: {
  severity: Severity
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider border',
        STYLES[severity],
        className,
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulseSoft" />
      {LABELS[severity]}
    </span>
  )
}
