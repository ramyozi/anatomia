from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import GlossaryEntry
from app.schemas import GlossaryEntrySchema

router = APIRouter()


@router.get("", response_model=list[GlossaryEntrySchema])
def list_glossary(db: Session = Depends(get_db)) -> list[GlossaryEntrySchema]:
    rows = db.execute(select(GlossaryEntry).order_by(GlossaryEntry.term)).scalars().all()
    return [
        GlossaryEntrySchema(
            slug=g.slug,
            term=g.term,
            definition=g.definition,
            related=g.related or [],
        )
        for g in rows
    ]
