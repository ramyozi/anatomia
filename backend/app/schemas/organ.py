from pydantic import BaseModel, Field

from app.schemas.disease import DiseaseSummary
from app.schemas.source import SourceLink


class OrganStatsMetric(BaseModel):
    label: str
    value: str


class OrganStats(BaseModel):
    weight: dict | None = None
    size: str | None = None
    averageLifespan: str | None = None
    bloodFlow: str | None = None
    cellCount: str | None = None
    metrics: list[OrganStatsMetric] = Field(default_factory=list)


class OrganSummary(BaseModel):
    slug: str
    name: str
    system: str
    shortDescription: str
    diseaseCount: int = 0


class SubOrganSchema(BaseModel):
    slug: str
    name: str
    description: str
    diseases: list[DiseaseSummary] = Field(default_factory=list)


class Organ(OrganSummary):
    description: str
    functions: list[str] = Field(default_factory=list)
    position: dict = Field(default_factory=dict)
    imageUrl: str | None = None
    subOrgans: list[SubOrganSchema] = Field(default_factory=list)
    diseases: list[DiseaseSummary] = Field(default_factory=list)
    stats: OrganStats = Field(default_factory=OrganStats)
    sources: list[SourceLink] = Field(default_factory=list)
