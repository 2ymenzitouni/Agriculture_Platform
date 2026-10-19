from fastapi import APIRouter

# Feature routers
# Import them here as you create them.
#
from app.routes.authRoute import router as auth_router
from app.routes.disease_detectionRoute import router as disease_router
# from app.routes.dashboard import router as dashboard_router
# from app.routes.farms import router as farms_router
from app.routes.sensor_readingsRoute import router as sensors_router
from app.routes.plantRoute import router as plants_router
# from app.routes.devices import router as devices_router
# from app.routes.disease_detectionRoute import router as diseases_router
# from app.routes.detection import router as detection_router
from app.routes.chatRoute import router as chat_router
from app.routes.documentRoute import router as documents_router
# from app.routes.weather import router as weather_router
# from app.routes.analytics import router as analytics_router
# from app.routes.notifications import router as notifications_router


# --------------------------------------------------
# Main API Router
# --------------------------------------------------

api_router = APIRouter()


# --------------------------------------------------
# Feature Routers
# --------------------------------------------------
#
# Uncomment these as the corresponding routers
# are implemented.
#
api_router.include_router(
    auth_router,
    prefix="/auth",
    tags=["Authentication"],
)
#
# api_router.include_router(
#     dashboard_router,
#     prefix="/dashboard",
#     tags=["Dashboard"],
# )
#
# api_router.include_router(
#     farms_router,
#     prefix="/farms",
#     tags=["Farms"],
# )
#
api_router.include_router(
    sensors_router,
    prefix="/sensors",
    tags=["Sensors"],
)
#
# api_router.include_router(
#     devices_router,
#     prefix="/devices",
#     tags=["Devices"],
# )
#
api_router.include_router(
    plants_router,
    prefix="",  # Prefix is already defined as "/plants" inside plantRoute.py
)
#
# Disease detection routes
api_router.include_router(
    disease_router,
    prefix="",  # Prefix is already defined as "/diseases" inside diseaseRoute.py
)
# api_router.include_router(
#     diseases_router,
#     prefix="/diseases",
#     tags=["Diseases"],
# )
#
# api_router.include_router(
#     detection_router,
#     prefix="/detections",
#     tags=["Disease Detection"],
# )
#
api_router.include_router(
    chat_router,
    prefix="",
    tags=["AI Assistant"],
)
#

api_router.include_router(
    documents_router,
    prefix="",
    tags=["RAG Documents"],
)
#
# api_router.include_router(
#     weather_router,
#     prefix="/weather",
#     tags=["Weather"],
# )
#
# api_router.include_router(
#     analytics_router,
#     prefix="/analytics",
#     tags=["Analytics"],
# )
#
# api_router.include_router(
#     notifications_router,
#     prefix="/notifications",
#     tags=["Notifications"],
# )


# --------------------------------------------------
# Temporary Test Endpoint
# --------------------------------------------------

@api_router.get("/test", tags=["System"])
async def test_api():
    return {
        "message": "AgriAI API is working",
        "status": "success",
    }