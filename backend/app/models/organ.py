from sqlalchemy import JSON, ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Organ(Base):
    __tablename__ = "organs"

    slug: Mapped[str] = mapped_column(String(64), primary_key=True)
    name: Mapped[str] = mapped_column(String(120), index=True)
    system: Mapped[str] = mapped_column(String(40), index=True)
    short_description: Mapped[str] = mapped_column(String(280))
    description: Mapped[str] = mapped_column(Text)
    functions: Mapped[list[str]] = mapped_column(JSON, default=list)
    position: Mapped[dict] = mapped_column(JSON, default=dict)
    image_url: Mapped[str | None] = mapped_column(String(500), nullable=True)
    stats: Mapped[dict] = mapped_column(JSON, default=dict)

    sub_organs: Mapped[list["SubOrgan"]] = relationship(
        back_populates="organ", cascade="all, delete-orphan", order_by="SubOrgan.slug"
    )


class SubOrgan(Base):
    __tablename__ = "sub_organs"

    slug: Mapped[str] = mapped_column(String(64), primary_key=True)
    organ_slug: Mapped[str] = mapped_column(
        ForeignKey("organs.slug", ondelete="CASCADE"), index=True
    )
    name: Mapped[str] = mapped_column(String(120))
    description: Mapped[str] = mapped_column(Text)

    organ: Mapped[Organ] = relationship(back_populates="sub_organs")
