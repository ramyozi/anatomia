import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  Globe2,
  HeartPulse,
  Microscope,
  Sparkles,
} from 'lucide-react'
import { HeroBody } from '@/components/home/HeroBody'
import { StatsStrip } from '@/components/home/StatsStrip'
import { FeatureGrid } from '@/components/home/FeatureGrid'
import { LiveDataPreview } from '@/components/home/LiveDataPreview'

export function HomePage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-fade pointer-events-none" />
        <div className="max-w-[1400px] mx-auto px-6 pt-16 pb-24 grid lg:grid-cols-[1.1fr_1fr] gap-10 items-center">
          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 chip-accent"
            >
              <Sparkles className="w-3 h-3" />
              Plateforme scientifique interactive · v0.1
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
              className="heading text-[clamp(2.6rem,5.6vw,5.2rem)] leading-[1.02] mt-5 text-balance"
            >
              Le corps humain,{' '}
              <span className="text-gradient">comme tu ne l'as jamais</span>{' '}
              exploré.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12 }}
              className="mt-6 text-lg text-ink-mute max-w-xl"
            >
              Plonge dans l'anatomie en 3D, suis les maladies à travers le monde
              et découvre comment la santé évolue au fil du temps. Données
              issues de l'OMS, du CDC et d'Our World in Data.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-8 flex flex-wrap gap-3"
            >
              <Link to="/corps" className="btn-primary">
                Explorer le corps <ArrowRight className="w-4 h-4" />
              </Link>
              <Link to="/maladies" className="btn-ghost">
                Catalogue de maladies
              </Link>
              <Link to="/monde" className="btn-ghost">
                <Globe2 className="w-4 h-4" /> Vue mondiale
              </Link>
            </motion.div>

            <StatsStrip className="mt-12" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.1 }}
            className="relative h-[540px] lg:h-[640px]"
          >
            <HeroBody />
          </motion.div>
        </div>
      </section>

      <FeatureGrid />

      {/* Pillars */}
      <section className="max-w-[1400px] mx-auto px-6 py-20 grid md:grid-cols-3 gap-6">
        <Pillar
          to="/corps"
          icon={<HeartPulse className="w-5 h-5" />}
          title="Atlas anatomique"
          desc="Navigue de la silhouette à la cellule. Chaque organe, chaque sous-structure, chaque pathologie associée."
          accent="accent"
        />
        <Pillar
          to="/maladies"
          icon={<Microscope className="w-5 h-5" />}
          title="Bibliothèque de maladies"
          desc="Symptômes, causes, traitements, prévalence — sourcés et annotés. De l'asthme à la maladie de Lyme."
          accent="coral"
        />
        <Pillar
          to="/monde"
          icon={<Globe2 className="w-5 h-5" />}
          title="Atlas mondial"
          desc="Suis les maladies à travers les continents, pays et régions. Choroplèthes, heatmaps, comparaisons."
          accent="gold"
        />
      </section>

      <LiveDataPreview />
    </div>
  )
}

function Pillar({
  to,
  icon,
  title,
  desc,
  accent,
}: {
  to: string
  icon: React.ReactNode
  title: string
  desc: string
  accent: 'accent' | 'coral' | 'gold'
}) {
  const accentClass =
    accent === 'accent'
      ? 'group-hover:border-accent/50 group-hover:shadow-glow text-accent'
      : accent === 'coral'
        ? 'group-hover:border-coral/40 text-coral'
        : 'group-hover:border-gold/40 text-gold'

  return (
    <Link
      to={to}
      className={`group panel p-6 transition-all duration-300 hover:-translate-y-0.5 ${accentClass}`}
    >
      <div className="w-10 h-10 grid place-items-center rounded-lg bg-bg-elev border border-line/70 mb-4">
        {icon}
      </div>
      <h3 className="font-display text-xl text-ink mb-1.5">{title}</h3>
      <p className="text-sm text-ink-mute leading-relaxed">{desc}</p>
      <div className="mt-5 inline-flex items-center gap-1.5 text-sm group-hover:gap-2.5 transition-all">
        Ouvrir <ArrowRight className="w-4 h-4" />
      </div>
    </Link>
  )
}
