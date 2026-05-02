from sqlalchemy import JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class GlossaryEntry(Base):
    __tablename__ = "glossary"

    slug: Mapped[str] = mapped_column(String(80), primary_key=True)
    term: Mapped[str] = mapped_column(String(160), index=True)
    definition: Mapped[str] = mapped_column(Text)
    related: Mapped[list[str]] = mapped_column(JSON, default=list)
