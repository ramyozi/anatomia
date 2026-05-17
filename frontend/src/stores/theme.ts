import { useEffect } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Theme manager.
 *
 * The *preference* is what the user picked and what we persist; it can be
 * a concrete theme or ``system``. The *resolved* theme is the concrete
 * one actually applied to <html data-theme> — ``system`` is resolved
 * against ``prefers-color-scheme`` and re-resolved live when the OS
 * setting changes.
 *
 * Adding a theme: extend ``ResolvedTheme`` here, add a token block in
 * ``styles/globals.css`` and an entry in ``THEME_OPTIONS`` below. No
 * other file needs to change.
 */

export type ResolvedTheme = 'light' | 'dark' | 'dark-soft'
export type ThemePreference = ResolvedTheme | 'system'

/** localStorage key — kept in sync with the anti-FOUC script in index.html. */
export const THEME_STORAGE_KEY = 'anatomia.theme'

interface ThemeState {
  preference: ThemePreference
  setPreference: (p: ThemePreference) => void
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      preference: 'system',
      setPreference: (preference) => set({ preference }),
    }),
    { name: THEME_STORAGE_KEY },
  ),
)

const DARK_QUERY = '(prefers-color-scheme: dark)'

/** Resolve a preference to the concrete theme to apply right now. */
export function resolveTheme(pref: ThemePreference): ResolvedTheme {
  if (pref !== 'system') return pref
  const prefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia(DARK_QUERY).matches
  return prefersDark ? 'dark' : 'light'
}

/** Write the resolved theme onto <html> (data-theme + native color-scheme). */
export function applyTheme(theme: ResolvedTheme): void {
  const root = document.documentElement
  root.dataset.theme = theme
  root.style.colorScheme = theme === 'light' ? 'light' : 'dark'
}

/**
 * Side-effect hook: keeps <html data-theme> in sync with the store and,
 * when the preference is ``system``, with live OS changes. Mount once
 * near the app root.
 */
export function useThemeSync(): void {
  const preference = useThemeStore((s) => s.preference)

  useEffect(() => {
    applyTheme(resolveTheme(preference))

    if (preference !== 'system') return
    // Re-resolve when the OS scheme flips while on "system".
    const mq = window.matchMedia(DARK_QUERY)
    const onChange = () => applyTheme(resolveTheme('system'))
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [preference])
}

/** Display metadata for the theme selector UI. */
export const THEME_OPTIONS: {
  value: ThemePreference
  label: string
}[] = [
  { value: 'light', label: 'Clair' },
  { value: 'dark', label: 'Sombre' },
  { value: 'dark-soft', label: 'Sombre doux' },
  { value: 'system', label: 'Système' },
]
