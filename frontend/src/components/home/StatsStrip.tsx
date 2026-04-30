import { motion } from 'framer-motion'
import { CountUp } from '@/components/visuals/CountUp'
import { cn } from '@/lib/cn'

const STATS = [
  { v: 78, suf: '', label: 'Organes & sous-structures' },
  { v: 124, suf: '+', label: 'Maladies documentées' },
  { v: 195, suf: '', label: 'Pays référencés' },
  { v: 6, suf: 'M', label: 'Datapoints OWID' },
]

export function StatsStrip({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.6 }}
      className={cn(
        'grid grid-cols-2 md:grid-cols-4 gap-px bg-line/40 rounded-xl overflow-hidden border border-line/60',
        className,
      )}
    >
      {STATS.map(s => (
        <div
          key={s.label}
          className="bg-bg-soft/70 backdrop-blur px-5 py-4 hover:bg-bg-elev/70 transition-colors"
        >
          <div className="stat-num">
            <CountUp end={s.v} duration={1.6} />
            <span className="text-accent">{s.suf}</span>
          </div>
          <div className="text-xs text-ink-mute uppercase tracking-wider mt-1">
            {s.label}
          </div>
        </div>
      ))}
    </motion.div>
  )
}
