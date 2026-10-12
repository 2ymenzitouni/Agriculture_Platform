from datetime import datetime
import uuid
from sqlalchemy import Column, String, Numeric, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base

class DiseaseDetection(Base):
    __tablename__ = "disease_detections"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    plant_id = Column(UUID(as_uuid=True), ForeignKey("plants.id", ondelete="CASCADE"), nullable=False, index=True)
    crop = Column(String(100), nullable=False)
    disease = Column(String(255), nullable=False)
    confidence = Column(Numeric(5, 4), nullable=False)
    image_path = Column(Text, nullable=True)
    detected_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    plant = relationship("Plant", back_populates="disease_detections")