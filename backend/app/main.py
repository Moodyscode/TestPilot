
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Import our API testing routes
from app.api.routes.tests import router as tests_router

# Initializing FastAPI
app = FastAPI(
    title="TestPilot API",
    description="Python-powered API Testing and Monitoring Platform",
    version="1.0.0"
)

# Registers API testing routes
app.include_router(tests_router)

# Configure CORS

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
    ],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)


@app.get("/")
def home():
    return {
        "message": "Welcome to TestPilot",
        "status": "running",
        "version": "1.0.0"
    }


@app.get("/api/health")
def health_check():
    return {
        "success": True,
        "message": "TestPilot backend is healthy"
    }
