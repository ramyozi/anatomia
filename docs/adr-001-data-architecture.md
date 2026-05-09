# ADR 001 — Architecture des données médicales

> Status : décidé · Date : 2026-05-17

## Contexte

Le projet a besoin d'une base médicale fiable (maladies, prévalences, statistiques pays). Deux options principales :

| Option | Pros | Cons |
|---|---|---|
| **A. API externes en live** (WHO GHO, OWID, Wikipedia) | Toujours à jour, peu de données stockées | Latence imprévisible, rate limits, breaking changes amont, offline impossible, coût d'API à long terme |
| **B. Ingestion locale** (scripts batch + Postgres) | Latence stable, offline-friendly, contrat de données stable, requêtes complexes faciles | Données figées entre runs, pipeline à maintenir |
| **C. Hybride** (B + cache des appels live ciblés) | Stable + frais ciblé pour les enrichissements | Plus de complexité |

## Décision

On choisit l'option **C — Hybride**, avec ces règles :

1. **Source de vérité locale** — Tout ce qui est central pour l'application (catalogue de maladies, organes, prévalences pays) vit dans PostgreSQL et est peuplé par des scripts d'ingestion versionnés (`backend/app/scripts/ingest/`).
2. **Cache HTTP** — Les appels aux APIs externes lecture-seule (Wikipedia summaries, OpenFDA, MedlinePlus) passent par la table `external_cache` avec TTL configurable. Pas de dépendance live obligatoire pour servir une page.
3. **Audit log** — Chaque exécution d'ingestion écrit une ligne dans `ingestion_runs` (source, status, lignes insérées/mises à jour, payload_meta) pour tracer la qualité dans le temps.
4. **Re-runs idempotents** — Les scripts d'ingestion utilisent `upsert` (slug/code primary key). Un re-run ne duplique pas et ne casse pas les données existantes.
5. **Freshness signaux** — Une route `/api/admin/ingestion` expose les dernières runs pour pouvoir déclencher un rafraîchissement manuel et détecter une dérive.

## Sources médicales

- **WHO Global Health Observatory** — prévalence par pays, mortalité (`scripts/ingest/who_gho.py`)
- **Our World in Data** — séries temporelles long-terme (`scripts/ingest/owid.py`)
- **Wikipedia REST** — résumé encyclopédique court (cache 7 jours)
- **OpenFDA / MedlinePlus** — labels de médicaments, vulgarisation grand public (cache 30 jours)
- **PubMed** — citations scientifiques par maladie (cache 30 jours)

## Conséquences

- L'application reste fonctionnelle hors-ligne après une seed initiale.
- La performance est prévisible (toutes les requêtes hot-path tapent Postgres).
- Le risque "rate limit en prod" est contenu au strict minimum.
- Le pipeline d'ingestion est un projet à part entière (tests, monitoring, scheduling). Il est démarré ici avec WHO + Wikipedia ; OWID, OpenFDA, PubMed suivent dans des PRs ultérieures.
