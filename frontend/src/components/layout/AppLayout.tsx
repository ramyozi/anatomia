import type { PropsWithChildren } from 'react'
import { TopBar } from './TopBar'
import { Footer } from './Footer'
import { ScrollToTop } from './ScrollToTop'
import { useThemeSync } from '@/stores/theme'

export function AppLayout({ children }: PropsWithChildren) {
  // Keeps <html data-theme> in sync with the persisted preference and
  // live OS changes (when the preference is "system").
  useThemeSync()

  return (
    <div className="grain min-h-screen flex flex-col">
      <ScrollToTop />
      <TopBar />
      <main className="flex-1 relative z-0">{children}</main>
      <Footer />
    </div>
  )
}
