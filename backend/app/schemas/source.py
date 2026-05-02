from typing import Literal

from pydantic import BaseModel


class SourceLink(BaseModel):
    label: str
    url: str
    type: Literal["who", "cdc", "nih", "pubmed", "wikipedia", "ourworldindata", "other"]
