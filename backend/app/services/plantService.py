from typing import List, Optional
from uuid import UUID
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from app.models.plantModel import Plant
from app.models.usersModel import User
from app.schemas.plantSchema import PlantCreate, PlantUpdate

class PlantService:
    def __init__(self, db: Session):
        self.db = db

    def create(self, plant_in: PlantCreate, user_id: UUID) -> Plant:
        # Verify user exists
        user = self.db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )

        db_plant = Plant(**plant_in.model_dump(), user_id=user_id)
        self.db.add(db_plant)
        self.db.commit()
        self.db.refresh(db_plant)
        return db_plant

    def get_by_id(self, plant_id: UUID) -> Optional[Plant]:
        return self.db.query(Plant).filter(Plant.id == plant_id).first()

    def get_by_user(
        self,
        user_id: UUID,
        skip: int = 0,
        limit: int | None = 100,
    ) -> List[Plant]:
        query = (
            self.db.query(Plant)
            .filter(Plant.user_id == user_id)
            .order_by(Plant.created_at.desc())
            .offset(skip)
        )
        if limit is not None:
            query = query.limit(limit)
        return query.all()

    def update(self, plant_id: UUID, plant_in: PlantUpdate) -> Plant:
        db_plant = self.get_by_id(plant_id)
        if not db_plant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plant not found"
            )

        update_data = plant_in.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_plant, field, value)

        self.db.commit()
        self.db.refresh(db_plant)
        return db_plant

    def delete(self, plant_id: UUID) -> Plant:
        db_plant = self.get_by_id(plant_id)
        if not db_plant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plant not found"
            )

        self.db.delete(db_plant)
        self.db.commit()
        return db_plant