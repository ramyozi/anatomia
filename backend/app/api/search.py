from fastapi import APIRouter, Depends, Query
from rapidfuzz import fuzz
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Country, Disease, GlossaryEntry, Organ
from app.schemas import SearchResult

router = APIRouter()


@router.get("", response_model=list[SearchResult])
def search(
    q: str = Query(..., min_length=2, max_length=80),
    db: Session = Depends(get_db),
    limit: int = 10,
) -> list[SearchResult]:
    q_lc = q.lower()

    candidates: list[tuple[float, SearchResult]] = []

    for o in db.execute(select(Organ)).scalars():
        score = fuzz.WRatio(q_lc, o.name.lower())
        if score > 50:
            candidates.append(
                (
                    score,
                    SearchResult(
                        type="organ",
                        slug=o.slug,
                        title=o.name,
                        subtitle=o.system,
                        score=score / 100,
                    ),
                )
            )

    for d in db.execute(select(Disease)).scalars():
        score = max(
            fuzz.WRatio(q_lc, d.name.lower()),
            fuzz.partial_ratio(q_lc, (d.short_description or "").lower()) - 10,
        )
        if score > 50:
            candidates.append(
                (
                    score,
                    SearchResult(
                        type="disease",
                        slug=d.slug,
                        title=d.name,
                        subtitle=d.category,
                        score=score / 100,
                    ),
                )
            )

    for c in db.execute(select(Country)).scalars():
        score = fuzz.WRatio(q_lc, c.name.lower())
        if score > 65:
            candidates.append(
                (
                    score,
                    SearchResult(
                        type="country",
                        slug=c.code,
                        title=c.name,
                        subtitle=c.continent,
                        score=score / 100,
                    ),
                )
            )

    for g in db.execute(select(GlossaryEntry)).scalars():
        score = fuzz.WRatio(q_lc, g.term.lower())
        if score > 70:
            candidates.append(
                (
                    score,
                    SearchResult(
                        type="glossary",
                        slug=g.slug,
                        title=g.term,
                        subtitle=g.definition[:90] + ("..." if len(g.definition) > 90 else ""),
                        score=score / 100,
                    ),
                )
            )

    candidates.sort(key=lambda x: -x[0])
    return [r for _, r in candidates[:limit]]
