from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class SensorReadingCreate(BaseModel):
    plant_id: UUID
    temperature: float | None = None
    humidity: float | None = None
    water_temperature: float | None = None
    water_level: float | None = None
    ph: float | None = None
    tds: float | None = None
    light: float | None = None

class SensorReadingResponse(SensorReadingCreate):
    id: int
    recorded_at: datetime
    model_config = ConfigDict(from_attributes=True)