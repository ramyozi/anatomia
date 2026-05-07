"""Reusable model -> schema mappers, used by multiple routes."""

from app.models import Disease
from app.schemas import DiseaseSummary


def disease_summary(d: Disease) -> DiseaseSummary:
    return DiseaseSummary(
        slug=d.slug,
        name=d.name,
        shortDescription=d.short_description,
        severity=d.severity,  # type: ignore[arg-type]
        prevalencePer100k=d.prevalence_per_100k,
        category=d.category,
        organs=d.organs or [],
    )
