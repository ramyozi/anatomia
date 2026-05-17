import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { resolveTheme, applyTheme, THEME_OPTIONS } from './theme'

/** Stub window.matchMedia (jsdom ships no implementation). */
function stubMatchMedia(prefersDark: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: query.includes('dark') ? prefersDark : !prefersDark,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia
}

describe('resolveTheme', () => {
  it('returns concrete themes unchanged', () => {
    expect(resolveTheme('light')).toBe('light')
    expect(resolveTheme('dark')).toBe('dark')
    expect(resolveTheme('dark-soft')).toBe('dark-soft')
  })

  it('resolves "system" to dark when the OS prefers dark', () => {
    stubMatchMedia(true)
    expect(resolveTheme('system')).toBe('dark')
  })

  it('resolves "system" to light when the OS prefers light', () => {
    stubMatchMedia(false)
    expect(resolveTheme('system')).toBe('light')
  })
})

describe('applyTheme', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.style.colorScheme = ''
  })
  afterEach(() => {
    document.documentElement.removeAttribute('data-theme')
    document.documentElement.style.colorScheme = ''
  })

  it('writes data-theme + a dark color-scheme for dark themes', () => {
    applyTheme('dark')
    expect(document.documentElement.dataset.theme).toBe('dark')
    expect(document.documentElement.style.colorScheme).toBe('dark')

    applyTheme('dark-soft')
    expect(document.documentElement.dataset.theme).toBe('dark-soft')
    expect(document.documentElement.style.colorScheme).toBe('dark')
  })

  it('writes a light color-scheme for the light theme', () => {
    applyTheme('light')
    expect(document.documentElement.dataset.theme).toBe('light')
    expect(document.documentElement.style.colorScheme).toBe('light')
  })
})

describe('THEME_OPTIONS', () => {
  it('exposes exactly the 4 supported preferences', () => {
    expect(THEME_OPTIONS.map((o) => o.value)).toEqual([
      'light',
      'dark',
      'dark-soft',
      'system',
    ])
  })
})
