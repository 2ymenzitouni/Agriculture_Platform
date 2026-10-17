from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from app.api.router.dependencies import get_current_user, get_db
from app.models.usersModel import User
from app.schemas.sensor_readingsSchema import SensorReadingCreate, SensorReadingResponse
from app.services.sensor_readingsService import SensorReadingService

router = APIRouter(prefix="/sensor-readings", tags=["Sensor Readings"])

@router.post("/", response_model=SensorReadingResponse, status_code=status.HTTP_201_CREATED)
def create_sensor_reading(
    reading_in: SensorReadingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Record new sensor metrics for a specific plant.
    """
    service = SensorReadingService(db)
    return service.create_reading(reading_in, current_user.id)

@router.get("/plant/{plant_id}", response_model=List[SensorReadingResponse])
def get_plant_sensor_readings(
    plant_id: UUID,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """
    Retrieve historical sensor readings for a given plant.
    """
    service = SensorReadingService(db)
    return service.get_readings_by_plant(
        plant_id,
        current_user.id,
        skip=skip,
        limit=limit,
    )