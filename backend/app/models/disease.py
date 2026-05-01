from sqlalchemy import JSON, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Disease(Base):
    __tablename__ = "diseases"

    slug: Mapped[str] = mapped_column(String(80), primary_key=True)
    name: Mapped[str] = mapped_column(String(160), index=True)
    short_description: Mapped[str] = mapped_column(String(280))
    description: Mapped[str] = mapped_column(Text)
    severity: Mapped[str] = mapped_column(String(16), index=True)  # mild|moderate|severe|critical
    category: Mapped[str] = mapped_column(String(40), index=True)
    prevalence_per_100k: Mapped[float | None] = mapped_column(nullable=True)

    symptoms: Mapped[list[str]] = mapped_column(JSON, default=list)
    causes: Mapped[list[str]] = mapped_column(JSON, default=list)
    risk_factors: Mapped[list[str]] = mapped_column(JSON, default=list)
    treatments: Mapped[list[str]] = mapped_column(JSON, default=list)
    prevention: Mapped[list[str]] = mapped_column(JSON, default=list)

    organs: Mapped[list[str]] = mapped_column(JSON, default=list)
    sub_organs: Mapped[list[str]] = mapped_column(JSON, default=list)
    related_diseases: Mapped[list[str]] = mapped_column(JSON, default=list)

    epidemiology: Mapped[dict] = mapped_column(JSON, default=dict)

    history: Mapped[list["DiseaseHistoryItem"]] = relationship(
        back_populates="disease", cascade="all, delete-orphan", order_by="DiseaseHistoryItem.year"
    )
    timeline: Mapped[list["DiseaseTimelinePoint"]] = relationship(
        back_populates="disease", cascade="all, delete-orphan", order_by="DiseaseTimelinePoint.year"
    )


class DiseaseHistoryItem(Base):
    __tablename__ = "disease_history"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    disease_slug: Mapped[str] = mapped_column(
        ForeignKey("diseases.slug", ondelete="CASCADE"), index=True
    )
    year: Mapped[int] = mapped_column(Integer)
    event: Mapped[str] = mapped_column(Text)

    disease: Mapped[Disease] = relationship(back_populates="history")


class DiseaseTimelinePoint(Base):
    __tablename__ = "disease_timeline"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    disease_slug: Mapped[str] = mapped_column(
        ForeignKey("diseases.slug", ondelete="CASCADE"), index=True
    )
    year: Mapped[int] = mapped_column(Integer)
    cases: Mapped[int] = mapped_column(Integer)

    disease: Mapped[Disease] = relationship(back_populates="timeline")
