from collections import defaultdict

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import CountryDiseasePrevalence, Disease

router = APIRouter()


@router.get("/burden")
def world_burden(db: Session = Depends(get_db)) -> list[dict]:
    """Aggregate prevalence across all diseases per country."""
    rows = db.execute(select(CountryDiseasePrevalence)).scalars().all()
    by_country: dict[str, float] = defaultdict(float)
    for r in rows:
        by_country[r.country_code] += r.per_100k
    return [
        {"countryCode": code, "per100k": round(value, 2)}
        for code, value in sorted(by_country.items(), key=lambda x: -x[1])
    ]


@router.get("/disease/{slug}")
def world_for_disease(slug: str, db: Session = Depends(get_db)) -> list[dict]:
    if not db.get(Disease, slug):
        raise HTTPException(status_code=404, detail="disease not found")
    rows = (
        db.execute(
            select(CountryDiseasePrevalence).where(
                CountryDiseasePrevalence.disease_slug == slug
            )
        )
        .scalars()
        .all()
    )
    return [
        {"countryCode": r.country_code, "per100k": round(r.per_100k, 2)} for r in rows
    ]
