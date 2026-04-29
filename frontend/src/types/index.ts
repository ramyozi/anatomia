export type Severity = 'mild' | 'moderate' | 'severe' | 'critical'

export interface SystemRef {
  slug: string
  name: string
}

export interface OrganSummary {
  slug: string
  name: string
  system: string
  shortDescription: string
  diseaseCount: number
}

export interface Organ extends OrganSummary {
  description: string
  functions: string[]
  position: { x: number; y: number; z?: number }
  imageUrl?: string
  subOrgans: SubOrgan[]
  diseases: DiseaseSummary[]
  stats: OrganStats
  sources: SourceLink[]
}

export interface SubOrgan {
  slug: string
  name: string
  description: string
  diseases: DiseaseSummary[]
}

export interface OrganStats {
  weight?: { value: number; unit: string }
  size?: string
  averageLifespan?: string
  bloodFlow?: string
  cellCount?: string
  metrics: { label: string; value: string }[]
}

export interface DiseaseSummary {
  slug: string
  name: string
  shortDescription: string
  severity: Severity
  prevalencePer100k?: number
  category: string
  organs: string[]
}

export interface Disease extends DiseaseSummary {
  description: string
  symptoms: string[]
  causes: string[]
  riskFactors: string[]
  treatments: string[]
  prevention: string[]
  epidemiology: {
    globalCases: number
    yearlyDeaths?: number
    mostAffectedAgeGroup?: string
    sexRatio?: string
    notes?: string
  }
  history?: { year: number; event: string }[]
  worldDistribution: { countryCode: string; per100k: number }[]
  timeline?: { year: number; cases: number }[]
  relatedDiseases: string[]
  sources: SourceLink[]
}

export interface SourceLink {
  label: string
  url: string
  type: 'who' | 'cdc' | 'nih' | 'pubmed' | 'wikipedia' | 'ourworldindata' | 'other'
}

export interface CountrySummary {
  code: string
  name: string
  region: string
  continent: string
  population: number
  lifeExpectancy: number
  topDiseases: string[]
}

export interface CountryDetail extends CountrySummary {
  healthcareIndex?: number
  hospitalsPerCapita?: number
  diseasePrevalence: { diseaseSlug: string; per100k: number }[]
  climate?: string
  notes?: string
  sources: SourceLink[]
}

export interface SearchResult {
  type: 'organ' | 'disease' | 'country' | 'glossary'
  slug: string
  title: string
  subtitle?: string
  score: number
}
