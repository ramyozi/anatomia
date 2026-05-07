# Architecture

## Vue d'ensemble

```mermaid
flowchart LR
    user([Utilisateur])
    subgraph Frontend["Frontend · React + Vite"]
      pages[Pages\nHome / Corps / Maladies / Monde / Stats]
      components[Composants R3F · D3 · Framer Motion]
      query[React Query]
      stores[Zustand stores\nfavoris · comparateur]
    end
    subgraph Backend["Backend · FastAPI"]
      api[Routes API]
      services[Services\nseed · search]
      schemas[Pydantic v2]
    end
    subgraph Data["Données"]
      db[(PostgreSQL)]
      static[Static catalogues\norganes · maladies · pays]
    end

    user --> pages --> components
    components --> query --> api
    stores --> components
    api --> schemas --> services --> db
    static --> services
    services --> db
```

## Modules backend

| Route prefix    | Description |
|-----------------|-------------|
| `/api/organs`   | Catalogue d'organes, sous-structures, maladies liées |
| `/api/diseases` | Catalogue des maladies, filtres et tri |
| `/api/countries`| Pays + indicateurs santé |
| `/api/world`    | Agrégats géographiques (burden global, par maladie) |
| `/api/stats`    | KPIs santé mondiale, timelines |
| `/api/glossary` | Lexique médical |
| `/api/quiz`     | Génération dynamique de questions |
| `/api/search`   | Recherche fuzzy multi-entités |

## Modèles principaux

```mermaid
erDiagram
    ORGAN ||--o{ SUB_ORGAN : "contient"
    ORGAN ||--o{ SOURCE : "documenté par"
    DISEASE ||--o{ DISEASE_HISTORY : "a"
    DISEASE ||--o{ DISEASE_TIMELINE : "a"
    DISEASE ||--o{ SOURCE : "documentée par"
    COUNTRY ||--o{ PREVALENCE : "présente"
    DISEASE ||--o{ PREVALENCE : "touche"
    DISEASE }o--o{ ORGAN : "concerne (JSON list)"
```

## Navigation utilisateur

```mermaid
flowchart TD
    home[Accueil]
    corps[Atlas du corps]
    organ[Détail organe]
    sub[Sous-structure]
    diseases[Catalogue maladies]
    disease[Fiche maladie]
    monde[Atlas mondial]
    pays[Fiche pays]
    stats[Stats mondiales]
    home --> corps --> organ --> sub
    organ --> disease
    sub --> disease
    home --> diseases --> disease
    home --> monde --> pays
    pays --> disease
    home --> stats
```
