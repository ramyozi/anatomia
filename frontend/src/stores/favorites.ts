import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface FavoritesState {
  diseases: string[]
  organs: string[]
  toggleDisease: (slug: string) => void
  toggleOrgan: (slug: string) => void
  isFavorite: (kind: 'disease' | 'organ', slug: string) => boolean
}

export const useFavorites = create<FavoritesState>()(
  persist(
    (set, get) => ({
      diseases: [],
      organs: [],
      toggleDisease: slug =>
        set(state => ({
          diseases: state.diseases.includes(slug)
            ? state.diseases.filter(s => s !== slug)
            : [...state.diseases, slug],
        })),
      toggleOrgan: slug =>
        set(state => ({
          organs: state.organs.includes(slug)
            ? state.organs.filter(s => s !== slug)
            : [...state.organs, slug],
        })),
      isFavorite: (kind, slug) =>
        kind === 'disease'
          ? get().diseases.includes(slug)
          : get().organs.includes(slug),
    }),
    { name: 'anatomia.favorites' },
  ),
)
