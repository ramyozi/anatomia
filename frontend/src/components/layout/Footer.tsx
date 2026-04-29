import { Link } from 'react-router-dom'
import { Github, ExternalLink } from 'lucide-react'

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line/60 bg-bg-soft/50 mt-20">
      <div className="max-w-[1400px] mx-auto px-6 py-10 grid gap-8 md:grid-cols-4 text-sm">
        <div>
          <h4 className="font-display text-ink mb-3">Anatomia</h4>
          <p className="text-ink-mute leading-relaxed">
            Plateforme libre pour explorer le corps humain, les maladies et leur
            répartition mondiale. Données issues de sources publiques.
          </p>
        </div>
        <div>
          <h5 className="text-ink-dim text-xs uppercase tracking-wider mb-3">
            Explorer
          </h5>
          <ul className="space-y-1.5 text-ink-mute">
            <li><Link to="/corps" className="hover:text-ink">Corps humain</Link></li>
            <li><Link to="/maladies" className="hover:text-ink">Maladies</Link></li>
            <li><Link to="/monde" className="hover:text-ink">Monde</Link></li>
            <li><Link to="/statistiques" className="hover:text-ink">Statistiques</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-ink-dim text-xs uppercase tracking-wider mb-3">
            Apprendre
          </h5>
          <ul className="space-y-1.5 text-ink-mute">
            <li><Link to="/glossaire" className="hover:text-ink">Glossaire</Link></li>
            <li><Link to="/quiz" className="hover:text-ink">Quiz</Link></li>
            <li><Link to="/comparer" className="hover:text-ink">Comparer</Link></li>
          </ul>
        </div>
        <div>
          <h5 className="text-ink-dim text-xs uppercase tracking-wider mb-3">
            Sources
          </h5>
          <ul className="space-y-1.5 text-ink-mute">
            <li>
              <a href="https://www.who.int" className="inline-flex items-center gap-1 hover:text-ink" target="_blank" rel="noopener">
                WHO <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a href="https://ourworldindata.org" className="inline-flex items-center gap-1 hover:text-ink" target="_blank" rel="noopener">
                Our World in Data <ExternalLink className="w-3 h-3" />
              </a>
            </li>
            <li>
              <a href="https://pubmed.ncbi.nlm.nih.gov" className="inline-flex items-center gap-1 hover:text-ink" target="_blank" rel="noopener">
                PubMed <ExternalLink className="w-3 h-3" />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line/60">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex flex-wrap gap-3 items-center justify-between text-xs text-ink-dim">
          <span>© {new Date().getFullYear()} Anatomia · usage éducatif uniquement</span>
          <a
            href="https://github.com"
            className="inline-flex items-center gap-1.5 hover:text-ink"
            target="_blank"
            rel="noopener"
          >
            <Github className="w-3.5 h-3.5" /> Source
          </a>
        </div>
      </div>
    </footer>
  )
}
