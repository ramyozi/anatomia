import { create } from 'zustand'

interface CompareState {
  slugs: string[]
  add: (slug: string) => void
  remove: (slug: string) => void
  clear: () => void
}

export const useCompare = create<CompareState>(set => ({
  slugs: [],
  add: slug =>
    set(state => {
      if (state.slugs.includes(slug)) return state
      if (state.slugs.length >= 4) return state
      return { slugs: [...state.slugs, slug] }
    }),
  remove: slug =>
    set(state => ({ slugs: state.slugs.filter(s => s !== slug) })),
  clear: () => set({ slugs: [] }),
}))
