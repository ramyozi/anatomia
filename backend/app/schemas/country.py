from pydantic import BaseModel, Field

from app.schemas.source import SourceLink


class CountrySummary(BaseModel):
    code: str
    name: str
    region: str
    continent: str
    population: int
    lifeExpectancy: float
    topDiseases: list[str] = Field(default_factory=list)


class CountryDiseaseItem(BaseModel):
    diseaseSlug: str
    per100k: float


class CountryDetail(CountrySummary):
    healthcareIndex: float | None = None
    hospitalsPerCapita: float | None = None
    diseasePrevalence: list[CountryDiseaseItem] = Field(default_factory=list)
    climate: str | None = None
    notes: str | None = None
    sources: list[SourceLink] = Field(default_factory=list)
