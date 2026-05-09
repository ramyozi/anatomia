from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy import desc, select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import IngestionRun

router = APIRouter()


@router.get("/ingestion")
def recent_runs(db: Session = Depends(get_db), limit: int = 50) -> list[dict]:
    rows = (
        db.execute(
            select(IngestionRun).order_by(desc(IngestionRun.started_at)).limit(limit)
        )
        .scalars()
        .all()
    )
    return [
        {
            "id": r.id,
            "source": r.source,
            "target": r.target,
            "status": r.status,
            "rowsInserted": r.rows_inserted,
            "rowsUpdated": r.rows_updated,
            "error": r.error,
            "startedAt": _iso(r.started_at),
            "finishedAt": _iso(r.finished_at),
        }
        for r in rows
    ]


def _iso(dt: datetime | None) -> str | None:
    return dt.isoformat() if dt else None
