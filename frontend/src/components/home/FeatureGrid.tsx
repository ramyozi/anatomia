import { motion } from 'framer-motion'
import {
  Layers3,
  Activity,
  MapPinned,
  LineChart,
  Search,
  GraduationCap,
} from 'lucide-react'

const FEATURES = [
  {
    icon: <Layers3 className="w-4 h-4" />,
    title: 'Zoom hiérarchique',
    desc: 'Du corps entier au lobe frontal en quatre clics. La caméra te suit, l\'interface se reconfigure.',
  },
  {
    icon: <Activity className="w-4 h-4" />,
    title: 'Maladies vivantes',
    desc: 'Symptômes, causes, traitements, prévalence. Chaque fiche est sourcée et reliée à ses organes.',
  },
  {
    icon: <MapPinned className="w-4 h-4" />,
    title: 'Atlas mondial',
    desc: 'Choroplèthes par maladie, drill-down continent → pays → région, comparaisons inter-pays.',
  },
  {
    icon: <LineChart className="w-4 h-4" />,
    title: 'Données dans le temps',
    desc: 'Timelines historiques, tendances épidémiologiques, comparateurs OWID & WHO.',
  },
  {
    icon: <Search className="w-4 h-4" />,
    title: 'Recherche unifiée',
    desc: 'Une seule barre pour trouver un organe, une pathologie, un pays ou un terme du glossaire.',
  },
  {
    icon: <GraduationCap className="w-4 h-4" />,
    title: 'Pédagogique',
    desc: 'Glossaire médical, quiz d\'anatomie, comparaisons de maladies. Apprends en explorant.',
  },
]

export function FeatureGrid() {
  return (
    <section className="border-y border-line/60 bg-bg-soft/40">
      <div className="max-w-[1400px] mx-auto px-6 py-16 grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-line/30">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            className="bg-bg-soft p-6 hover:bg-bg-elev/60 transition-colors"
          >
            <div className="w-9 h-9 grid place-items-center rounded-lg bg-bg-elev border border-line/70 text-accent mb-3">
              {f.icon}
            </div>
            <h4 className="font-display text-ink mb-1.5">{f.title}</h4>
            <p className="text-sm text-ink-mute leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
