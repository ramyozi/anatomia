from typing import Literal

from pydantic import BaseModel, Field

from app.schemas.source import SourceLink

Severity = Literal["mild", "moderate", "severe", "critical"]


class DiseaseSummary(BaseModel):
    slug: str
    name: str
    shortDescription: str
    severity: Severity
    prevalencePer100k: float | None = None
    category: str
    organs: list[str] = Field(default_factory=list)


class Epidemiology(BaseModel):
    globalCases: int
    yearlyDeaths: int | None = None
    mostAffectedAgeGroup: str | None = None
    sexRatio: str | None = None
    notes: str | None = None


class HistoryItem(BaseModel):
    year: int
    event: str


class TimelinePoint(BaseModel):
    year: int
    cases: int


class WorldDistributionItem(BaseModel):
    countryCode: str
    per100k: float


class Disease(DiseaseSummary):
    description: str
    symptoms: list[str] = Field(default_factory=list)
    causes: list[str] = Field(default_factory=list)
    riskFactors: list[str] = Field(default_factory=list)
    treatments: list[str] = Field(default_factory=list)
    prevention: list[str] = Field(default_factory=list)
    epidemiology: Epidemiology
    history: list[HistoryItem] | None = None
    worldDistribution: list[WorldDistributionItem] = Field(default_factory=list)
    timeline: list[TimelinePoint] | None = None
    relatedDiseases: list[str] = Field(default_factory=list)
    sources: list[SourceLink] = Field(default_factory=list)
