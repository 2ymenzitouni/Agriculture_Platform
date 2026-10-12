from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.router.router import api_router
from app.core.database import Base, engine
import os
#--------------------------------------------------
# Import all models here to ensure they are registered with SQLAlchemy
from app.models.usersModel import User
from app.models.plantModel import Plant
from app.models.chatModel import ChatSession
from app.models.sensor_readingsModel import SensorReading
from app.models.documentModel import Document, DocumentChunk
from app.models.disease_detectionModel import DiseaseDetection
#--------------------------------------------------
# 2. Trigger table creation in PostgreSQL
Base.metadata.create_all(bind=engine)

# --------------------------------------------------
# Application
# --------------------------------------------------

app = FastAPI(
    title="AgriAI API",
    description="Intelligent agricultural assistant and smart farm management API",
    version="0.1.0",
)


# --------------------------------------------------
# CORS
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs("static/uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="static"), name="static")
# --------------------------------------------------
# API Routes
# --------------------------------------------------

app.include_router(
    api_router,
    prefix="/api",
)


# --------------------------------------------------
# Health Check
# --------------------------------------------------

@app.get("/")
async def root():
    return {
        "name": "AgriAI API",
        "version": "0.1.0",
        "status": "running",
    }


@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
    }