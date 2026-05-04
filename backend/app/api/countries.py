from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Country, CountryDiseasePrevalence, Source
from app.schemas import CountryDetail, CountrySummary, SourceLink
from app.schemas.country import CountryDiseaseItem

router = APIRouter()


@router.get("", response_model=list[CountrySummary])
def list_countries(db: Session = Depends(get_db)) -> list[CountrySummary]:
    rows = db.execute(select(Country).order_by(Country.name)).scalars().all()
    return [
        CountrySummary(
            code=c.code,
            name=c.name,
            region=c.region,
            continent=c.continent,
            population=c.population,
            lifeExpectancy=c.life_expectancy,
            topDiseases=c.top_diseases or [],
        )
        for c in rows
    ]


@router.get("/{code}", response_model=CountryDetail)
def get_country(code: str, db: Session = Depends(get_db)) -> CountryDetail:
    c = db.get(Country, code.upper())
    if not c:
        raise HTTPException(status_code=404, detail="country not found")
    prevalences = (
        db.execute(
            select(CountryDiseasePrevalence).where(
                CountryDiseasePrevalence.country_code == c.code
            )
        )
        .scalars()
        .all()
    )
    sources = (
        db.execute(
            select(Source).where(Source.owner_kind == "country", Source.owner_slug == c.code)
        )
        .scalars()
        .all()
    )
    return CountryDetail(
        code=c.code,
        name=c.name,
        region=c.region,
        continent=c.continent,
        population=c.population,
        lifeExpectancy=c.life_expectancy,
        healthcareIndex=c.healthcare_index,
        hospitalsPerCapita=c.hospitals_per_capita,
        climate=c.climate,
        notes=c.notes,
        topDiseases=c.top_diseases or [],
        diseasePrevalence=[
            CountryDiseaseItem(diseaseSlug=p.disease_slug, per100k=p.per_100k)
            for p in prevalences
        ],
        sources=[
            SourceLink(label=s.label, url=s.url, type=s.type)  # type: ignore[arg-type]
            for s in sources
        ],
    )
