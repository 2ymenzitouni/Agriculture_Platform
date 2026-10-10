from datetime import datetime
from sqlalchemy import Column, BigInteger, Numeric, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.core.database import Base

class SensorReading(Base):
    __tablename__ = "sensor_readings"

    id = Column(BigInteger, primary_key=True, index=True, autoincrement=True)
    plant_id = Column(UUID(as_uuid=True), ForeignKey("plants.id", ondelete="CASCADE"), nullable=False, index=True)
    
    temperature = Column(Numeric(5, 2), nullable=True)
    humidity = Column(Numeric(5, 2), nullable=True)
    water_temperature = Column(Numeric(5, 2), nullable=True)
    water_level = Column(Numeric(5, 2), nullable=True)
    ph = Column(Numeric(4, 2), nullable=True)
    tds = Column(Numeric(6, 2), nullable=True)
    light = Column(Numeric(8, 2), nullable=True)
    
    recorded_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    plant = relationship("Plant", back_populates="sensor_readings")