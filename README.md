# Anatomia

Plateforme interactive — corps humain en 3D, maladies, santé mondiale.

## Stack

- **Front** : React + TS + Vite + Tailwind + Framer Motion + R3F + D3 + Zustand + React Query
- **Back** : FastAPI + SQLAlchemy 2 + Pydantic v2
- **Data** : PostgreSQL (SQLite en fallback dev)
- **Infra** : Docker + docker-compose + Nginx

## Lancer

```bash
# Tout-en-un
docker compose up --build

# Ou en local
make front     # Vite sur :5173
make back      # FastAPI sur :8000
make seed      # remplit la DB
```

Front : http://localhost:5173 — API : http://localhost:8000/docs

## Structure

```
anatomia/
├── frontend/   # React + Vite + R3F
├── backend/    # FastAPI + SQLAlchemy
├── docs/       # Architecture & cas d'usage (Mermaid)
├── docker-compose.yml
└── Makefile
```

## Commandes

```bash
make front          # dev server
make back           # API + reload
make seed           # seed catalogue
make test           # pytest
make build          # vite build
make up / make down # docker
```
