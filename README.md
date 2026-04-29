# Anatomia

Plateforme interactive d'exploration du corps humain, des maladies et de leur répartition mondiale.

## Stack

- **Front** : React + TypeScript + Vite + TailwindCSS + Framer Motion + Three.js / R3F + D3
- **Back** : FastAPI + SQLAlchemy + Pydantic
- **Data** : PostgreSQL
- **Infra** : Docker + docker-compose

## Lancer en local

```bash
# Tout en une commande
docker-compose up --build

# Ou séparément
cd backend && uvicorn app.main:app --reload --port 8000
cd frontend && pnpm install && pnpm dev
```

Front : http://localhost:5173 — API : http://localhost:8000/docs

## Structure

```
anatomia/
├── frontend/   # React + Vite
├── backend/    # FastAPI
├── docs/       # Schémas et architecture
└── docker-compose.yml
```

## Commandes utiles

```bash
# Tests back
cd backend && pytest

# Lint front
cd frontend && pnpm lint

# Seed DB
cd backend && python -m app.scripts.seed
```
