from pydantic import BaseModel, Field


class GlossaryEntrySchema(BaseModel):
    slug: str
    term: str
    definition: str
    related: list[str] = Field(default_factory=list)
