from uuid import UUID
from fastapi import APIRouter, Depends, UploadFile, File, Form, status
from sqlalchemy.orm import Session

from app.api.router.dependencies import get_db
from app.services.disease_detectionService import DiseaseService
from app.schemas.disease_detectionSchema import DiseaseDetectionResponse

router = APIRouter(prefix="/diseases", tags=["Disease Detections"])

@router.post("/detect", response_model=DiseaseDetectionResponse, status_code=status.HTTP_201_CREATED)
async def detect_disease(
    plant_id: UUID = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Upload an image for a plant, run custom YOLO detection, save the annotated file, 
    and return the detection metadata and path.
    """
    service = DiseaseService(db)
    detection = service.process_and_detect(plant_id, file)
    return detection