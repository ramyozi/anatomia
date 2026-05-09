from datetime import datetime

from sqlalchemy import JSON, DateTime, Integer, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class IngestionRun(Base):
    """Audit log of every external-source ingestion job."""

    __tablename__ = "ingestion_runs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    source: Mapped[str] = mapped_column(String(40), index=True)  # who, owid, wikipedia, ...
    target: Mapped[str] = mapped_column(String(80))  # disease/<slug>, country/<code>, ...
    status: Mapped[str] = mapped_column(String(20))  # ok, failed, skipped
    rows_inserted: Mapped[int] = mapped_column(Integer, default=0)
    rows_updated: Mapped[int] = mapped_column(Integer, default=0)
    error: Mapped[str | None] = mapped_column(String(500), nullable=True)
    started_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    finished_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    payload_meta: Mapped[dict] = mapped_column(JSON, default=dict)


class ExternalCache(Base):
    """Generic caching table for upstream API responses.

    We use this for Wikipedia summaries, OpenFDA labels, MedlinePlus
    snippets — anything that has an HTTP(s) URL we want to throttle.
    """

    __tablename__ = "external_cache"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    source: Mapped[str] = mapped_column(String(40), index=True)
    key: Mapped[str] = mapped_column(String(280), index=True)
    payload: Mapped[dict] = mapped_column(JSON, default=dict)
    fetched_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
    ttl_seconds: Mapped[int] = mapped_column(Integer, default=86400)
