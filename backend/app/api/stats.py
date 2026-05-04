from collections import Counter, defaultdict

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Country, Disease, DiseaseTimelinePoint

router = APIRouter()


@router.get("/global")
def global_stats(db: Session = Depends(get_db)) -> dict:
    diseases = db.execute(select(Disease)).scalars().all()
    countries = db.execute(select(Country)).scalars().all()

    total_deaths = sum(
        (d.epidemiology or {}).get("yearlyDeaths", 0) or 0 for d in diseases
    )

    avg_life = (
        sum(c.life_expectancy * c.population for c in countries)
        / max(sum(c.population for c in countries), 1)
    )

    cat_counter = Counter(d.category for d in diseases)
    by_cat = [
        {"label": k, "value": v}
        for k, v in sorted(cat_counter.items(), key=lambda x: -x[1])
    ]

    timeline_pts = db.execute(
        select(DiseaseTimelinePoint)
    ).scalars().all()
    by_year: dict[int, int] = defaultdict(int)
    for t in timeline_pts:
        by_year[t.year] += t.cases
    burden_timeline = [
        {"year": y, "cases": v} for y, v in sorted(by_year.items())
    ][-30:]

    top_killers = sorted(
        [
            {
                "label": d.name,
                "value": (d.epidemiology or {}).get("yearlyDeaths", 0) or 0,
            }
            for d in diseases
        ],
        key=lambda x: -x["value"],
    )[:8]

    # synthetic vaccination coverage curve (1980 -> 2024)
    vaccination = [
        {"year": y, "cases": int(20 + (y - 1980) * 1.6 + (y - 1980) ** 0.5)}
        for y in range(1980, 2025)
    ]

    return {
        "totalDiseasesTracked": len(diseases),
        "totalCountries": len(countries),
        "totalDeathsAnnual": int(total_deaths),
        "averageLifeExpectancy": round(avg_life, 1),
        "diseaseByCategory": by_cat,
        "burdenTimeline": burden_timeline,
        "topKillers": top_killers,
        "vaccinationCoverage": vaccination,
    }
