import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { AppLayout } from './components/layout/AppLayout'
import { PageTransition } from './components/layout/PageTransition'
import { HomePage } from './pages/HomePage'
import { BodyExplorerPage } from './pages/BodyExplorerPage'
import { OrganDetailPage } from './pages/OrganDetailPage'
import { DiseasesPage } from './pages/DiseasesPage'
import { DiseaseDetailPage } from './pages/DiseaseDetailPage'
import { WorldMapPage } from './pages/WorldMapPage'
import { CountryDetailPage } from './pages/CountryDetailPage'
import { StatsPage } from './pages/StatsPage'
import { GlossaryPage } from './pages/GlossaryPage'
import { QuizPage } from './pages/QuizPage'
import { CompareDiseasesPage } from './pages/CompareDiseasesPage'
import { BrainExplorerPage } from './pages/BrainExplorerPage'
import { SystemsPage } from './pages/SystemsPage'
import { NotFoundPage } from './pages/NotFoundPage'

export function App() {
  const location = useLocation()
  return (
    <AppLayout>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
          <Route path="/corps" element={<PageTransition><BodyExplorerPage /></PageTransition>} />
          <Route path="/corps/cerveau/explorer" element={<PageTransition><BrainExplorerPage /></PageTransition>} />
          <Route path="/corps/systemes/:system" element={<PageTransition><SystemsPage /></PageTransition>} />
          <Route path="/corps/:organSlug" element={<PageTransition><OrganDetailPage /></PageTransition>} />
          <Route path="/corps/:organSlug/:subSlug" element={<PageTransition><OrganDetailPage /></PageTransition>} />
          <Route path="/maladies" element={<PageTransition><DiseasesPage /></PageTransition>} />
          <Route path="/maladies/:slug" element={<PageTransition><DiseaseDetailPage /></PageTransition>} />
          <Route path="/comparer" element={<PageTransition><CompareDiseasesPage /></PageTransition>} />
          <Route path="/monde" element={<PageTransition><WorldMapPage /></PageTransition>} />
          <Route path="/monde/:countryCode" element={<PageTransition><CountryDetailPage /></PageTransition>} />
          <Route path="/statistiques" element={<PageTransition><StatsPage /></PageTransition>} />
          <Route path="/glossaire" element={<PageTransition><GlossaryPage /></PageTransition>} />
          <Route path="/quiz" element={<PageTransition><QuizPage /></PageTransition>} />
          <Route path="*" element={<PageTransition><NotFoundPage /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </AppLayout>
  )
}
