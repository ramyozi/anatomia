"""Shared infrastructure for ingestion scripts.

Each ingestion script subclasses ``Ingestor``, implements ``run()`` and gets
- a transactional session,
- automatic ``IngestionRun`` audit log,
- a typed cache helper that hits ``ExternalCache`` then falls back to HTTP.
"""

from __future__ import annotations

import json
from contextlib import contextmanager
from dataclasses import dataclass
from datetime import datetime, timedelta, timezone
from typing import Any

import httpx
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import SessionLocal
from app.models import ExternalCache, IngestionRun


@dataclass
class RunStats:
    inserted: int = 0
    updated: int = 0
    skipped: int = 0


class Ingestor:
    source_name: str = "unknown"

    def __init__(self) -> None:
        self.client = httpx.Client(
            timeout=15.0,
            headers={
                "User-Agent": "anatomia-ingestor/0.1 (research/portfolio)",
                "Accept": "application/json",
            },
        )

    # -------------------------- caching helpers -------------------------- #

    def cached_json(
        self, session: Session, key: str, url: str, ttl_seconds: int = 7 * 86400
    ) -> dict[str, Any] | None:
        """Return parsed JSON either from the cache or from a live HTTP fetch.

        Network failures are tolerated — they bubble up as ``None`` so the
        caller can decide to fall back to seeded data.
        """
        cached = session.execute(
            select(ExternalCache).where(
                ExternalCache.source == self.source_name,
                ExternalCache.key == key,
            )
        ).scalar_one_or_none()

        if cached:
            now = datetime.now(timezone.utc)
            fetched_at = cached.fetched_at
            if fetched_at.tzinfo is None:
                fetched_at = fetched_at.replace(tzinfo=timezone.utc)
            age = (now - fetched_at).total_seconds()
            if age < cached.ttl_seconds:
                return cached.payload

        try:
            res = self.client.get(url)
            res.raise_for_status()
            payload = res.json()
        except Exception:
            return cached.payload if cached else None

        if cached:
            cached.payload = payload
            cached.ttl_seconds = ttl_seconds
            cached.fetched_at = datetime.now(timezone.utc)
        else:
            session.add(
                ExternalCache(
                    source=self.source_name,
                    key=key,
                    payload=payload,
                    ttl_seconds=ttl_seconds,
                )
            )
        session.commit()
        return payload

    # -------------------------- run wrapper ------------------------------ #

    @contextmanager
    def _audit_run(self, session: Session, target: str):
        run = IngestionRun(
            source=self.source_name,
            target=target,
            status="running",
        )
        session.add(run)
        session.commit()
        stats = RunStats()
        try:
            yield stats
            run.status = "ok"
        except Exception as exc:  # noqa: BLE001
            run.status = "failed"
            run.error = repr(exc)[:500]
            raise
        finally:
            run.rows_inserted = stats.inserted
            run.rows_updated = stats.updated
            run.finished_at = datetime.now(timezone.utc)
            session.commit()

    def run(self, target: str, session: Session | None = None) -> RunStats:
        own_session = session is None
        s = session or SessionLocal()
        try:
            with self._audit_run(s, target) as stats:
                self.execute(target, s, stats)
                return stats
        finally:
            if own_session:
                s.close()

    def execute(self, target: str, session: Session, stats: RunStats) -> None:  # noqa: D401
        raise NotImplementedError
