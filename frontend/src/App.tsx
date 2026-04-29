import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './components/layout/AppLayout'
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
import { NotFoundPage } from './pages/NotFoundPage'

export function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/corps" element={<BodyExplorerPage />} />
        <Route path="/corps/:organSlug" element={<OrganDetailPage />} />
        <Route path="/corps/:organSlug/:subSlug" element={<OrganDetailPage />} />
        <Route path="/maladies" element={<DiseasesPage />} />
        <Route path="/maladies/:slug" element={<DiseaseDetailPage />} />
        <Route path="/comparer" element={<CompareDiseasesPage />} />
        <Route path="/monde" element={<WorldMapPage />} />
        <Route path="/monde/:countryCode" element={<CountryDetailPage />} />
        <Route path="/statistiques" element={<StatsPage />} />
        <Route path="/glossaire" element={<GlossaryPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </AppLayout>
  )
}
