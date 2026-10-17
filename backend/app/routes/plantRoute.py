from typing import List
from uuid import UUID
from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.orm import Session

from app.api.router.dependencies import get_current_user, get_db
from app.models.usersModel import User
from app.schemas.plantSchema import PlantCreate, PlantUpdate, PlantResponse
from app.services.plantService import PlantService

router = APIRouter(prefix="/plants", tags=["Plants"])

@router.post("/", response_model=PlantResponse, status_code=status.HTTP_201_CREATED)
def create_plant(
    plant_in: PlantCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = PlantService(db)
    return service.create(plant_in, current_user.id)

@router.get("/mine", response_model=List[PlantResponse])
def get_my_plants(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    service = PlantService(db)
    return service.get_by_user(current_user.id, limit=None)

@router.get("/user/{user_id}", response_model=List[PlantResponse])
def get_user_plants(user_id: UUID, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    service = PlantService(db)
    return service.get_by_user(user_id, skip=skip, limit=limit)

@router.get("/{plant_id}", response_model=PlantResponse)
def get_plant(plant_id: UUID, db: Session = Depends(get_db)):
    service = PlantService(db)
    plant = service.get_by_id(plant_id)
    if not plant:
        raise HTTPException(status_code=404, detail="Plant not found")
    return plant

@router.put("/{plant_id}", response_model=PlantResponse)
def update_plant(plant_id: UUID, plant_in: PlantUpdate, db: Session = Depends(get_db)):
    service = PlantService(db)
    return service.update(plant_id, plant_in)

@router.delete("/{plant_id}", response_model=PlantResponse)
def delete_plant(plant_id: UUID, db: Session = Depends(get_db)):
    service = PlantService(db)
    return service.delete(plant_id)