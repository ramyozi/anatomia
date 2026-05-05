import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Search } from 'lucide-react'
import { api } from '@/lib/api'

interface GlossaryEntry {
  slug: string
  term: string
  definition: string
  related?: string[]
}

export function GlossaryPage() {
  const [q, setQ] = useState('')
  const { data } = useQuery({
    queryKey: ['glossary'],
    queryFn: () => api.get<GlossaryEntry[]>('/glossary'),
  })

  const filtered = (data ?? []).filter(
    e =>
      !q ||
      e.term.toLowerCase().includes(q.toLowerCase()) ||
      e.definition.toLowerCase().includes(q.toLowerCase()),
  )

  const grouped = new Map<string, GlossaryEntry[]>()
  filtered.forEach(e => {
    const letter = e.term[0].toUpperCase()
    if (!grouped.has(letter)) grouped.set(letter, [])
    grouped.get(letter)!.push(e)
  })

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <div className="text-xs uppercase tracking-[0.25em] text-accent mb-2">
        Lexique
      </div>
      <h1 className="heading text-4xl md:text-5xl mb-3">Glossaire médical</h1>
      <p className="text-ink-mute mb-6">
        Définitions courtes des termes utilisés sur les fiches.
      </p>

      <div className="panel p-3 flex items-center gap-2 mb-6">
        <Search className="w-4 h-4 text-ink-mute" />
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Filtrer le glossaire..."
          className="flex-1 bg-transparent outline-none text-ink placeholder:text-ink-dim text-sm"
        />
      </div>

      <div className="space-y-8">
        {[...grouped.entries()]
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([letter, entries]) => (
            <section key={letter}>
              <h2 className="font-display text-2xl text-accent mb-3 sticky top-16 bg-bg/80 backdrop-blur py-1">
                {letter}
              </h2>
              <dl className="space-y-3">
                {entries.map(e => (
                  <div
                    id={e.slug}
                    key={e.slug}
                    className="panel p-4 scroll-mt-20"
                  >
                    <dt className="font-display text-ink mb-1">{e.term}</dt>
                    <dd className="text-sm text-ink-mute leading-relaxed">
                      {e.definition}
                    </dd>
                    {e.related && e.related.length > 0 && (
                      <div className="mt-2 flex gap-1.5 flex-wrap">
                        {e.related.map(r => (
                          <span key={r} className="chip text-[10px]">
                            ↪ {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </dl>
            </section>
          ))}
      </div>
    </div>
  )
}
