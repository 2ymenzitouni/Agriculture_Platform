import os
import shutil
import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException, status
from sqlalchemy.orm import Session
from ultralytics import YOLO
import cv2

from app.models.disease_detectionModel import DiseaseDetection
from app.models.plantModel import Plant

UPLOAD_DIR = "static/detections"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class DiseaseService:
    def __init__(self, db: Session):
        self.db = db

    def process_and_detect(
        self,
        plant_id: uuid.UUID,
        file: UploadFile,
        user_id: uuid.UUID,
    ) -> DiseaseDetection:
        # 1. Verify plant exists and retrieve its crop type
        plant = (
            self.db.query(Plant)
            .filter(Plant.id == plant_id, Plant.user_id == user_id)
            .first()
        )
        if not plant:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Plant not found for the authenticated user"
            )

        # 2. Save incoming uploaded image temporarily
        file_extension = Path(file.filename or "").suffix.lower()
        if file_extension not in {".jpg", ".jpeg", ".png", ".webp"}:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported image type. Upload a JPG, JPEG, PNG, or WEBP image.",
            )

        unique_filename = f"{uuid.uuid4()}{file_extension}"
        temp_input_path = os.path.join(UPLOAD_DIR, f"temp_{unique_filename}")
        
        with open(temp_input_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        try:
            # 3. Run YOLO Model Inference using custom weights
            model = YOLO("app/ai/vision/best.pt")
            results = model(temp_input_path)

            detected_disease = "Healthy"
            confidence_score = 1.0

            if not results:
                raise RuntimeError("The detection model returned no results.")

            for r in results:
                boxes = r.boxes
                if boxes is not None and len(boxes) > 0:
                    cls_id = int(boxes[0].cls[0])
                    detected_disease = model.names[cls_id]
                    confidence_score = float(boxes[0].conf[0])

                # 4. Save annotated image with bounding boxes
                output_filename = f"detected_{unique_filename}"
                output_filepath = os.path.join(UPLOAD_DIR, output_filename)
                
                res_plotted = r.plot()
                if not cv2.imwrite(output_filepath, res_plotted):
                    raise RuntimeError("Unable to save the annotated image.")

            if os.path.exists(temp_input_path):
                os.remove(temp_input_path)

        except Exception as e:
            if os.path.exists(temp_input_path):
                os.remove(temp_input_path)
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Error processing image with YOLO: {str(e)}"
            )

        # 5. Save record to PostgreSQL
        image_relative_path = f"/static/detections/{output_filename}"
        db_detection = DiseaseDetection(
            plant_id=plant_id,
            crop=plant.crop,
            disease=detected_disease,
            confidence=round(confidence_score, 4),
            image_path=image_relative_path
        )
        self.db.add(db_detection)
        self.db.commit()
        self.db.refresh(db_detection)

        return db_detection