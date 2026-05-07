from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Disease, Organ, Source
from app.schemas import OrganSummary, SourceLink, SubOrganSchema
from app.schemas.organ import Organ as OrganOut, OrganStats, OrganStatsMetric
from app.services.mappers import disease_summary as _disease_summary

router = APIRouter()


@router.get("", response_model=list[OrganSummary])
def list_organs(
    db: Session = Depends(get_db),
    system: str | None = Query(default=None),
) -> list[OrganSummary]:
    stmt = select(Organ)
    if system:
        stmt = stmt.where(Organ.system == system)
    organs = db.execute(stmt).scalars().all()

    # disease counts: an organ owns a disease if its slug appears in disease.organs JSON list
    diseases = db.execute(select(Disease.slug, Disease.organs)).all()

    def count_for(slug: str) -> int:
        return sum(1 for _, organs_list in diseases if slug in (organs_list or []))

    return [
        OrganSummary(
            slug=o.slug,
            name=o.name,
            system=o.system,
            shortDescription=o.short_description,
            diseaseCount=count_for(o.slug),
        )
        for o in organs
    ]


@router.get("/{slug}", response_model=OrganOut)
def get_organ(slug: str, db: Session = Depends(get_db)) -> OrganOut:
    organ = db.get(Organ, slug)
    if not organ:
        raise HTTPException(status_code=404, detail="organ not found")

    all_diseases = db.execute(select(Disease)).scalars().all()
    related_diseases = [d for d in all_diseases if slug in (d.organs or [])]

    diseases_summaries = [_disease_summary(d) for d in related_diseases]

    sub_summaries: list[SubOrganSchema] = []
    for sub in organ.sub_organs:
        sub_diseases = [d for d in related_diseases if sub.slug in (d.sub_organs or [])]
        sub_summaries.append(
            SubOrganSchema(
                slug=sub.slug,
                name=sub.name,
                description=sub.description,
                diseases=[_disease_summary(d) for d in sub_diseases],
            )
        )

    sources = (
        db.execute(
            select(Source).where(Source.owner_kind == "organ", Source.owner_slug == slug)
        ).scalars().all()
    )

    stats_dict = organ.stats or {}
    metrics_raw = stats_dict.get("metrics", [])
    return OrganOut(
        slug=organ.slug,
        name=organ.name,
        system=organ.system,
        shortDescription=organ.short_description,
        description=organ.description,
        functions=organ.functions or [],
        position=organ.position or {},
        imageUrl=organ.image_url,
        diseaseCount=len(diseases_summaries),
        diseases=diseases_summaries,
        subOrgans=sub_summaries,
        stats=OrganStats(
            weight=stats_dict.get("weight"),
            size=stats_dict.get("size"),
            averageLifespan=stats_dict.get("averageLifespan"),
            bloodFlow=stats_dict.get("bloodFlow"),
            cellCount=stats_dict.get("cellCount"),
            metrics=[OrganStatsMetric(**m) for m in metrics_raw],
        ),
        sources=[
            SourceLink(label=s.label, url=s.url, type=s.type)  # type: ignore[arg-type]
            for s in sources
        ],
    )


