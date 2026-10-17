from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from uuid import UUID
from app.models.sensor_readingsModel import SensorReading
from app.models.plantModel import Plant
from app.schemas.sensor_readingsSchema import SensorReadingCreate

class SensorReadingService:
    def __init__(self, db: Session):
        self.db = db

    def create_reading(self, reading_in: SensorReadingCreate, user_id: UUID) -> SensorReading:
        plant = (
            self.db.query(Plant)
            .filter(Plant.id == reading_in.plant_id, Plant.user_id == user_id)
            .first()
        )
        if not plant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plant not found for the authenticated user"
            )

        db_reading = SensorReading(**reading_in.model_dump())
        self.db.add(db_reading)
        self.db.commit()
        self.db.refresh(db_reading)
        return db_reading

    def get_readings_by_plant(
        self,
        plant_id: UUID,
        user_id: UUID,
        skip: int = 0,
        limit: int = 100,
    ):
        plant = (
            self.db.query(Plant)
            .filter(Plant.id == plant_id, Plant.user_id == user_id)
            .first()
        )
        if not plant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plant not found for the authenticated user",
            )

        return (
            self.db.query(SensorReading)
            .filter(SensorReading.plant_id == plant_id)
            .order_by(SensorReading.recorded_at.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )