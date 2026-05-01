from sqlalchemy import JSON, Float, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Country(Base):
    __tablename__ = "countries"

    code: Mapped[str] = mapped_column(String(3), primary_key=True)  # ISO-3
    name: Mapped[str] = mapped_column(String(120), index=True)
    region: Mapped[str] = mapped_column(String(80))
    continent: Mapped[str] = mapped_column(String(40), index=True)
    population: Mapped[int] = mapped_column(Integer)
    life_expectancy: Mapped[float] = mapped_column(Float)
    healthcare_index: Mapped[float | None] = mapped_column(Float, nullable=True)
    hospitals_per_capita: Mapped[float | None] = mapped_column(Float, nullable=True)
    climate: Mapped[str | None] = mapped_column(String(160), nullable=True)
    notes: Mapped[str | None] = mapped_column(String(500), nullable=True)
    top_diseases: Mapped[list[str]] = mapped_column(JSON, default=list)

    prevalences: Mapped[list["CountryDiseasePrevalence"]] = relationship(
        back_populates="country", cascade="all, delete-orphan"
    )


class CountryDiseasePrevalence(Base):
    __tablename__ = "country_disease_prevalence"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    country_code: Mapped[str] = mapped_column(
        ForeignKey("countries.code", ondelete="CASCADE"), index=True
    )
    disease_slug: Mapped[str] = mapped_column(
        ForeignKey("diseases.slug", ondelete="CASCADE"), index=True
    )
    per_100k: Mapped[float] = mapped_column(Float)

    country: Mapped[Country] = relationship(back_populates="prevalences")
