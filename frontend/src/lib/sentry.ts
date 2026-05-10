import * as Sentry from '@sentry/react'

/**
 * Boots Sentry only when ``VITE_SENTRY_DSN`` is defined at build time.
 * Without a DSN, ``Sentry.captureException`` becomes a no-op so the
 * app can ship without observability without crashing.
 *
 * Releases are tagged with the Vite-injected commit SHA when CI sets
 * ``VITE_RELEASE`` (we wire that in the Vercel pipeline).
 */
export function initSentry(): void {
  const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined
  if (!dsn) {
    console.info('[sentry] disabled (no VITE_SENTRY_DSN)')
    return
  }
  Sentry.init({
    dsn,
    release: (import.meta.env.VITE_RELEASE as string | undefined) ?? undefined,
    environment:
      (import.meta.env.VITE_SENTRY_ENV as string | undefined) ??
      (import.meta.env.PROD ? 'production' : 'development'),
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0.5,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false }),
    ],
  })
}
