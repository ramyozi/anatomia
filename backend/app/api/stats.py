from collections import Counter, defaultdict

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Country, CountryDiseasePrevalence, Disease, DiseaseTimelinePoint, Organ

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

    # Top diseases by prevalence (per 100k)
    top_prevalence = sorted(
        [
            {
                "label": d.name,
                "value": float(d.prevalence_per_100k or 0),
                "category": d.category,
            }
            for d in diseases
            if d.prevalence_per_100k
        ],
        key=lambda x: -x["value"],
    )[:10]

    # Organs / diseases counted per anatomical system. We count both how
    # many ORGANS belong to a system and how many DISEASES touch at least
    # one organ from that system — gives a quick read on which system is
    # both the most populated and the most clinically loaded.
    organs = db.execute(select(Organ)).scalars().all()
    organ_to_system = {o.slug: o.system for o in organs}
    organs_per_system = Counter(o.system for o in organs if o.system)
    diseases_per_system: Counter[str] = Counter()
    for d in diseases:
        sys_for_d = {organ_to_system[s] for s in (d.organs or []) if s in organ_to_system}
        for s in sys_for_d:
            diseases_per_system[s] += 1
    system_breakdown = [
        {
            "system": s,
            "organs": organs_per_system.get(s, 0),
            "diseases": diseases_per_system.get(s, 0),
        }
        for s in sorted(set(organs_per_system) | set(diseases_per_system))
    ]

    # Country burden = sum of all per-100k prevalences. Useful for the
    # heatmap on the stats dashboard.
    prev_rows = db.execute(select(CountryDiseasePrevalence)).scalars().all()
    burden_by_country: dict[str, float] = defaultdict(float)
    for p in prev_rows:
        burden_by_country[p.country_code] += p.per_100k
    country_burden = [
        {"countryCode": c, "per100k": round(v, 1)}
        for c, v in sorted(burden_by_country.items(), key=lambda x: -x[1])
    ]

    # Severity distribution
    severity_counter = Counter(d.severity for d in diseases if d.severity)
    severity_breakdown = [
        {"label": k, "value": v}
        for k, v in severity_counter.most_common()
    ]

    return {
        "totalDiseasesTracked": len(diseases),
        "totalCountries": len(countries),
        "totalDeathsAnnual": int(total_deaths),
        "averageLifeExpectancy": round(avg_life, 1),
        "diseaseByCategory": by_cat,
        "burdenTimeline": burden_timeline,
        "topKillers": top_killers,
        "topPrevalence": top_prevalence,
        "vaccinationCoverage": vaccination,
        "systemBreakdown": system_breakdown,
        "countryBurden": country_burden,
        "severityBreakdown": severity_breakdown,
    }
