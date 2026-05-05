import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { Check, X, Repeat, Trophy } from 'lucide-react'
import { api } from '@/lib/api'
import { cn } from '@/lib/cn'

interface QuizQuestion {
  id: string
  prompt: string
  choices: { id: string; label: string }[]
  correctChoiceId: string
  explanation: string
  topic: string
}

export function QuizPage() {
  const [seed, setSeed] = useState(0)
  const { data } = useQuery({
    queryKey: ['quiz', seed],
    queryFn: () => api.get<QuizQuestion[]>('/quiz?n=8'),
  })
  const [idx, setIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [done, setDone] = useState(false)

  useEffect(() => {
    setIdx(0)
    setAnswers({})
    setDone(false)
  }, [seed])

  const current = data?.[idx]
  const score = useMemo(() => {
    if (!data) return 0
    return data.reduce(
      (acc, q) => acc + (answers[q.id] === q.correctChoiceId ? 1 : 0),
      0,
    )
  }, [answers, data])

  if (!data) return <div className="p-12 text-center text-ink-mute">Préparation du quiz...</div>

  if (done) {
    const pct = Math.round((score / data.length) * 100)
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <Trophy className="w-12 h-12 mx-auto text-gold mb-4" />
        <h1 className="heading text-4xl">Quiz terminé</h1>
        <div className="mt-6 panel p-8">
          <div className="text-6xl font-display text-gradient">{pct}%</div>
          <div className="text-ink-mute mt-2">
            {score} / {data.length} bonnes réponses
          </div>
          <div className="mt-6 h-2 bg-bg-elev rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1 }}
              className="h-full bg-gradient-to-r from-accent to-accent-glow"
            />
          </div>
          <button
            onClick={() => setSeed(s => s + 1)}
            className="btn-primary mt-8"
          >
            <Repeat className="w-4 h-4" /> Recommencer
          </button>
        </div>
        <div className="mt-8 text-left space-y-3">
          {data.map((q, i) => {
            const ok = answers[q.id] === q.correctChoiceId
            return (
              <div key={q.id} className="panel-soft p-4">
                <div className="flex items-center gap-2 text-xs">
                  <span className={cn(ok ? 'text-accent' : 'text-coral')}>
                    {ok ? '✓' : '✗'}
                  </span>
                  <span className="text-ink-dim">Question {i + 1}</span>
                  <span className="chip text-[10px]">{q.topic}</span>
                </div>
                <p className="text-sm text-ink mt-1">{q.prompt}</p>
                <p className="text-xs text-ink-mute mt-2">{q.explanation}</p>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (!current) return null

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-[0.25em] text-accent">
          Quiz · {current.topic}
        </span>
        <span className="text-xs text-ink-mute">
          {idx + 1} / {data.length}
        </span>
      </div>
      <div className="h-1 bg-bg-elev rounded-full overflow-hidden mb-8">
        <motion.div
          animate={{ width: `${((idx + 1) / data.length) * 100}%` }}
          className="h-full bg-accent"
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="panel p-7"
        >
          <h2 className="heading text-xl text-balance mb-6">
            {current.prompt}
          </h2>
          <div className="space-y-2">
            {current.choices.map(c => {
              const picked = answers[current.id] === c.id
              const showAnswer = picked
              const isCorrect = c.id === current.correctChoiceId
              return (
                <button
                  key={c.id}
                  onClick={() => {
                    if (answers[current.id]) return
                    setAnswers(a => ({ ...a, [current.id]: c.id }))
                  }}
                  className={cn(
                    'w-full text-left p-4 rounded-lg border transition-all',
                    !answers[current.id] &&
                      'border-line/60 hover:border-accent/50 hover:bg-accent/5',
                    showAnswer && isCorrect &&
                      'border-accent/60 bg-accent/10',
                    showAnswer && !isCorrect && picked &&
                      'border-coral/60 bg-coral/10',
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm">{c.label}</span>
                    {showAnswer && isCorrect && (
                      <Check className="w-4 h-4 text-accent" />
                    )}
                    {showAnswer && !isCorrect && picked && (
                      <X className="w-4 h-4 text-coral" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {answers[current.id] && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 panel-soft p-4 text-sm text-ink-mute"
            >
              {current.explanation}
            </motion.div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => {
                if (idx + 1 >= data.length) setDone(true)
                else setIdx(i => i + 1)
              }}
              disabled={!answers[current.id]}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {idx + 1 >= data.length ? 'Voir le score' : 'Question suivante →'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
