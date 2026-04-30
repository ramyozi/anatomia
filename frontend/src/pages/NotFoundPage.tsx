import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-32 text-center">
      <div className="text-[clamp(5rem,16vw,12rem)] font-display leading-none text-gradient">
        404
      </div>
      <p className="text-ink-mute mt-4 max-w-md mx-auto">
        Cette page semble manquer à l'anatomie de notre plateforme. Reviens à
        l'accueil pour reprendre l'exploration.
      </p>
      <Link to="/" className="btn-primary mt-8 inline-flex">
        <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
      </Link>
    </div>
  )
}
