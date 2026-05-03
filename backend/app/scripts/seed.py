"""Seed the database from the static data modules.

Run with: `python -m app.scripts.seed`.
Idempotent: bails out early if any organ already exists.
"""

from __future__ import annotations

import math
import random
from collections.abc import Iterable

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.data.countries import COUNTRIES
from app.data.diseases import DISEASES
from app.data.glossary import GLOSSARY
from app.data.organs import ORGANS
from app.models import (
    Country,
    CountryDiseasePrevalence,
    Disease,
    DiseaseHistoryItem,
    DiseaseTimelinePoint,
    GlossaryEntry,
    Organ,
    Source,
    SubOrgan,
)


def seed_if_empty(session: Session) -> None:
    if session.execute(select(Organ).limit(1)).first():
        return
    seed_all(session)


def seed_all(session: Session) -> None:
    seed_organs(session)
    seed_diseases(session)
    seed_countries(session)
    seed_glossary(session)
    seed_country_prevalences(session)
    session.commit()


def seed_organs(session: Session) -> None:
    for o in ORGANS:
        organ = Organ(
            slug=o["slug"],
            name=o["name"],
            system=o["system"],
            short_description=o["short_description"],
            description=o["description"],
            functions=o.get("functions", []),
            position=o.get("position", {}),
            stats=o.get("stats", {}),
        )
        session.add(organ)
        for sub_slug, sub_name, sub_desc in o.get("sub_organs", []):
            session.add(
                SubOrgan(
                    slug=sub_slug,
                    organ_slug=o["slug"],
                    name=sub_name,
                    description=sub_desc,
                )
            )
        for label, url, type_ in o.get("sources", []):
            session.add(
                Source(
                    owner_kind="organ",
                    owner_slug=o["slug"],
                    label=label,
                    url=url,
                    type=type_,
                )
            )


def seed_diseases(session: Session) -> None:
    for d in DISEASES:
        disease = Disease(
            slug=d["slug"],
            name=d["name"],
            short_description=d["short_description"],
            description=d["description"],
            severity=d["severity"],
            category=d["category"],
            prevalence_per_100k=d.get("prevalence_per_100k"),
            symptoms=d.get("symptoms", []),
            causes=d.get("causes", []),
            risk_factors=d.get("risk_factors", []),
            treatments=d.get("treatments", []),
            prevention=d.get("prevention", []),
            organs=d.get("organs", []),
            sub_organs=d.get("sub_organs", []),
            related_diseases=d.get("related_diseases", []),
            epidemiology=d.get("epidemiology", {}),
        )
        session.add(disease)
        for year, event in d.get("history", []):
            session.add(
                DiseaseHistoryItem(disease_slug=d["slug"], year=year, event=event)
            )
        # Generate timeline from base growth model
        base = d.get("timeline_base")
        if base:
            start_year, start_cases, growth = base
            for offset in range(0, 36):
                year = start_year + offset
                cases = int(start_cases * math.exp(growth * offset))
                session.add(
                    DiseaseTimelinePoint(
                        disease_slug=d["slug"], year=year, cases=cases
                    )
                )
        for label, url, type_ in d.get("sources", []):
            session.add(
                Source(
                    owner_kind="disease",
                    owner_slug=d["slug"],
                    label=label,
                    url=url,
                    type=type_,
                )
            )


def seed_countries(session: Session) -> None:
    for code, name, region, continent, pop, life, hci, hosp, climate in COUNTRIES:
        session.add(
            Country(
                code=code,
                name=name,
                region=region,
                continent=continent,
                population=pop,
                life_expectancy=life,
                healthcare_index=hci,
                hospitals_per_capita=hosp,
                climate=climate,
                top_diseases=[],  # filled at the end of country prevalences
            )
        )
        session.add(
            Source(
                owner_kind="country",
                owner_slug=code,
                label="WHO Global Health Observatory",
                url="https://www.who.int/data/gho",
                type="who",
            )
        )
        session.add(
            Source(
                owner_kind="country",
                owner_slug=code,
                label="World Bank Open Data",
                url="https://data.worldbank.org",
                type="other",
            )
        )


def seed_glossary(session: Session) -> None:
    for slug, term, definition, related in GLOSSARY:
        session.add(
            GlossaryEntry(slug=slug, term=term, definition=definition, related=related)
        )


# ---- prevalence generation ----

# Each disease has a "regional bias" — a multiplier per continent so
# the choropleth makes geographic sense.
REGION_BIAS: dict[str, dict[str, float]] = {
    "infarctus-myocarde": {"Europe": 1.4, "Amériques": 1.3, "Asie": 1.0, "Afrique": 0.6, "Océanie": 1.1},
    "diabete-type-2": {"Asie": 1.4, "Amériques": 1.3, "Moyen-Orient": 1.6, "Europe": 1.0, "Afrique": 0.6, "Océanie": 1.0},
    "alzheimer": {"Europe": 1.5, "Amériques": 1.3, "Asie": 1.0, "Afrique": 0.5, "Océanie": 1.2},
    "asthme": {"Amériques": 1.4, "Europe": 1.2, "Océanie": 1.5, "Asie": 0.9, "Afrique": 0.7},
    "bpco": {"Asie": 1.5, "Amériques": 1.1, "Europe": 1.1, "Afrique": 0.8, "Océanie": 0.9},
    "cancer-poumon": {"Europe": 1.3, "Amériques": 1.3, "Asie": 1.1, "Afrique": 0.5, "Océanie": 1.2},
    "avc": {"Asie": 1.3, "Europe": 1.1, "Afrique": 1.2, "Amériques": 1.0, "Océanie": 1.0},
    "hypertension": {"Afrique": 1.5, "Asie": 1.2, "Europe": 1.1, "Amériques": 1.1, "Océanie": 1.0},
    "tuberculose": {"Afrique": 4.0, "Asie": 2.5, "Amériques": 0.5, "Europe": 0.4, "Océanie": 0.6},
    "covid-19": {"Europe": 1.2, "Amériques": 1.4, "Asie": 0.9, "Afrique": 0.6, "Océanie": 0.9},
    "depression": {"Amériques": 1.2, "Europe": 1.2, "Océanie": 1.1, "Asie": 0.9, "Afrique": 0.8},
    "obesite": {"Amériques": 1.7, "Océanie": 1.6, "Europe": 1.2, "Moyen-Orient": 1.5, "Asie": 0.8, "Afrique": 0.7},
    "paludisme": {"Afrique": 8.0, "Asie": 1.4, "Amériques": 0.6, "Europe": 0.05, "Océanie": 0.4},
    "vih": {"Afrique": 4.5, "Amériques": 0.9, "Europe": 0.6, "Asie": 0.7, "Océanie": 0.7},
    "grippe": {"Europe": 1.1, "Amériques": 1.1, "Asie": 1.0, "Afrique": 0.9, "Océanie": 0.9},
    "parkinson": {"Europe": 1.5, "Amériques": 1.2, "Asie": 1.0, "Afrique": 0.5, "Océanie": 1.1},
    "insuffisance-renale": {"Amériques": 1.2, "Asie": 1.1, "Europe": 1.0, "Afrique": 1.1, "Océanie": 1.0},
    "hepatite-b": {"Asie": 2.4, "Afrique": 2.7, "Amériques": 0.5, "Europe": 0.5, "Océanie": 0.6},
    "cancer-sein": {"Europe": 1.4, "Amériques": 1.3, "Océanie": 1.3, "Asie": 0.9, "Afrique": 0.6},
    "anxiete": {"Amériques": 1.3, "Europe": 1.2, "Océanie": 1.2, "Asie": 0.9, "Afrique": 0.7},
}


def seed_country_prevalences(session: Session) -> None:
    rng = random.Random(2026_05_10)
    countries = session.execute(select(Country)).scalars().all()
    diseases = session.execute(select(Disease)).scalars().all()

    by_country_top: dict[str, list[tuple[float, str]]] = {}

    for d in diseases:
        base = d.prevalence_per_100k or 100
        bias_map = REGION_BIAS.get(d.slug, {})
        for c in countries:
            bias = bias_map.get(c.continent, bias_map.get(c.region, 1.0))
            # life expectancy modulates: lower life-exp slightly increases burden
            life_factor = 1 + (78 - c.life_expectancy) * 0.012
            jitter = rng.uniform(0.7, 1.3)
            value = max(0.0, base * bias * life_factor * jitter)
            session.add(
                CountryDiseasePrevalence(
                    country_code=c.code,
                    disease_slug=d.slug,
                    per_100k=round(value, 2),
                )
            )
            by_country_top.setdefault(c.code, []).append((value, d.slug))

    # Persist top diseases per country
    for c in countries:
        top = [
            slug
            for _, slug in sorted(by_country_top.get(c.code, []), reverse=True)[:5]
        ]
        c.top_diseases = top


def main() -> None:
    from app.db import SessionLocal, engine
    from app.db import Base

    Base.metadata.create_all(bind=engine)
    with SessionLocal() as session:
        if session.execute(select(Organ).limit(1)).first():
            print("DB already seeded — skipping.")
            return
        seed_all(session)
        print(
            f"Seeded "
            f"{session.execute(select(Organ)).scalars().all().__len__()} organs, "
            f"{session.execute(select(Disease)).scalars().all().__len__()} diseases, "
            f"{session.execute(select(Country)).scalars().all().__len__()} countries."
        )


def _len(it: Iterable) -> int:
    return sum(1 for _ in it)


if __name__ == "__main__":
    main()
