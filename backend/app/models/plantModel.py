from datetime import datetime, date
import uuid
from sqlalchemy import Column, String, Date, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base

class Plant(Base):
    __tablename__ = "plants"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(255), nullable=False)
    crop = Column(String(255), nullable=False)
    variety = Column(String(255), nullable=True)
    growth_stage = Column(String(100), nullable=True)
    planted_at = Column(Date, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="plants")
    sensor_readings = relationship("SensorReading", back_populates="plant", cascade="all, delete-orphan")
    disease_detections = relationship("DiseaseDetection", back_populates="plant", cascade="all, delete-orphan")