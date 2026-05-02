from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db import Base


class Source(Base):
    """A reusable citation source attached to organs, diseases or countries."""

    __tablename__ = "sources"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    owner_kind: Mapped[str] = mapped_column(String(16), index=True)  # organ|disease|country
    owner_slug: Mapped[str] = mapped_column(String(120), index=True)
    label: Mapped[str] = mapped_column(String(280))
    url: Mapped[str] = mapped_column(String(500))
    type: Mapped[str] = mapped_column(String(20))  # who|cdc|nih|pubmed|wikipedia|owid|other
