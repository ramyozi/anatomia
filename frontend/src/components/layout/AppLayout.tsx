import type { PropsWithChildren } from 'react'
import { TopBar } from './TopBar'
import { Footer } from './Footer'
import { ScrollToTop } from './ScrollToTop'

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <div className="grain min-h-screen flex flex-col">
      <ScrollToTop />
      <TopBar />
      <main className="flex-1 relative z-0">{children}</main>
      <Footer />
    </div>
  )
}
