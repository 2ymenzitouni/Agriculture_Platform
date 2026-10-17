from datetime import datetime, date
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class PlantBase(BaseModel):
    name: str
    crop: str
    variety: str | None = None
    growth_stage: str | None = None
    planted_at: date | None = None

class PlantCreate(PlantBase):
    pass

class PlantUpdate(BaseModel):
    name: str | None = None
    crop: str | None = None
    variety: str | None = None
    growth_stage: str | None = None
    planted_at: date | None = None

class PlantResponse(PlantBase):
    id: UUID
    user_id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)