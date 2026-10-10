from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict

class DiseaseDetectionCreate(BaseModel):
    plant_id: UUID
    crop: str
    disease: str
    confidence: float
    image_path: str | None = None

class DiseaseDetectionResponse(DiseaseDetectionCreate):
    id: UUID
    detected_at: datetime
    model_config = ConfigDict(from_attributes=True)