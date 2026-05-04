from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import CountryDiseasePrevalence, Disease, Source
from app.schemas import (
    Disease as DiseaseOut,
    DiseaseSummary,
    Epidemiology,
    HistoryItem,
    SourceLink,
    TimelinePoint,
)
from app.schemas.disease import WorldDistributionItem

router = APIRouter()


@router.get("", response_model=list[DiseaseSummary])
def list_diseases(
    db: Session = Depends(get_db),
    category: str | None = None,
    severity: str | None = None,
    organ: str | None = None,
    limit: int | None = None,
    sort: str | None = Query(default=None, description="prevalence|name|severity"),
) -> list[DiseaseSummary]:
    stmt = select(Disease)
    if category and category.lower() != "toutes":
        stmt = stmt.where(Disease.category == category)
    if severity and severity != "all":
        stmt = stmt.where(Disease.severity == severity)
    diseases = db.execute(stmt).scalars().all()
    if organ:
        diseases = [d for d in diseases if organ in (d.organs or [])]

    if sort == "prevalence":
        diseases.sort(key=lambda d: d.prevalence_per_100k or 0, reverse=True)
    elif sort == "name":
        diseases.sort(key=lambda d: d.name.lower())
    elif sort == "severity":
        order = {"critical": 0, "severe": 1, "moderate": 2, "mild": 3}
        diseases.sort(key=lambda d: order.get(d.severity, 99))

    if limit:
        diseases = diseases[:limit]

    return [
        DiseaseSummary(
            slug=d.slug,
            name=d.name,
            shortDescription=d.short_description,
            severity=d.severity,  # type: ignore[arg-type]
            prevalencePer100k=d.prevalence_per_100k,
            category=d.category,
            organs=d.organs or [],
        )
        for d in diseases
    ]


@router.get("/{slug}", response_model=DiseaseOut)
def get_disease(slug: str, db: Session = Depends(get_db)) -> DiseaseOut:
    d = db.get(Disease, slug)
    if not d:
        raise HTTPException(status_code=404, detail="disease not found")

    distribution = (
        db.execute(
            select(CountryDiseasePrevalence).where(
                CountryDiseasePrevalence.disease_slug == slug
            )
        )
        .scalars()
        .all()
    )
    sources = (
        db.execute(
            select(Source).where(Source.owner_kind == "disease", Source.owner_slug == slug)
        )
        .scalars()
        .all()
    )

    epi = d.epidemiology or {}
    return DiseaseOut(
        slug=d.slug,
        name=d.name,
        shortDescription=d.short_description,
        description=d.description,
        severity=d.severity,  # type: ignore[arg-type]
        prevalencePer100k=d.prevalence_per_100k,
        category=d.category,
        organs=d.organs or [],
        symptoms=d.symptoms or [],
        causes=d.causes or [],
        riskFactors=d.risk_factors or [],
        treatments=d.treatments or [],
        prevention=d.prevention or [],
        epidemiology=Epidemiology(
            globalCases=int(epi.get("globalCases", 0)),
            yearlyDeaths=epi.get("yearlyDeaths"),
            mostAffectedAgeGroup=epi.get("mostAffectedAgeGroup"),
            sexRatio=epi.get("sexRatio"),
            notes=epi.get("notes"),
        ),
        history=[HistoryItem(year=h.year, event=h.event) for h in d.history],
        timeline=[TimelinePoint(year=t.year, cases=t.cases) for t in d.timeline],
        worldDistribution=[
            WorldDistributionItem(countryCode=p.country_code, per100k=p.per_100k)
            for p in distribution
        ],
        relatedDiseases=d.related_diseases or [],
        sources=[
            SourceLink(label=s.label, url=s.url, type=s.type)  # type: ignore[arg-type]
            for s in sources
        ],
    )
