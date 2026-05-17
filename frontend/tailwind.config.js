/** @type {import('tailwindcss').Config} */

// Colour tokens are driven by CSS custom properties so the whole UI can
// switch theme (light / dark / dark-soft / system) at runtime without a
// rebuild. Each variable holds a SPACE-SEPARATED RGB triplet (eg
// "16 21 31") so Tailwind's ``<alpha-value>`` slot keeps every opacity
// modifier working — ``bg-bg-panel/60``, ``border-line/70`` etc.
//
// The actual values per theme live in ``src/styles/globals.css``.
const token = (name) => `rgb(var(${name}) / <alpha-value>)`

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: token('--c-bg'),
          soft: token('--c-bg-soft'),
          panel: token('--c-bg-panel'),
          elev: token('--c-bg-elev'),
        },
        ink: {
          DEFAULT: token('--c-ink'),
          mute: token('--c-ink-mute'),
          dim: token('--c-ink-dim'),
        },
        accent: {
          DEFAULT: token('--c-accent'),
          glow: token('--c-accent-glow'),
          deep: token('--c-accent-deep'),
        },
        coral: {
          DEFAULT: token('--c-coral'),
          soft: token('--c-coral-soft'),
        },
        gold: {
          DEFAULT: token('--c-gold'),
        },
        line: token('--c-line'),
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Space Grotesk"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 40px rgb(var(--c-accent) / 0.18)',
        panel:
          '0 1px 0 rgb(var(--c-shadow-inset) / 0.06) inset, 0 30px 60px -30px rgb(var(--c-shadow) / 0.6)',
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(circle at 50% 0%, rgb(var(--c-accent) / 0.08), transparent 60%)',
        'noise':
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3CfeColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.04 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: 0.5, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.05)' },
        },
        floatY: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        pulseSoft: 'pulseSoft 4s ease-in-out infinite',
        floatY: 'floatY 6s ease-in-out infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
    },
  },
  plugins: [],
}
