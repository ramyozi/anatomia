from typing import Literal

from pydantic import BaseModel


class SearchResult(BaseModel):
    type: Literal["organ", "disease", "country", "glossary"]
    slug: str
    title: str
    subtitle: str | None = None
    score: float
