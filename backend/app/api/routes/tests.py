
from fastapi import APIRouter, HTTPException

from app.schemas.test_schema import APITestRequest, APITestResult
from app.services.api_tester import run_api_test

router = APIRouter(prefix="/api/tests", tags=["API Testing"])


@router.post("/run", response_model=APITestResult)
async def execute_api_test(test: APITestRequest):
    try:
        return await run_api_test(test)
    except ValueError as exc:
        raise HTTPException(
            status_code=400,
            detail=str(exc)
        ) from exc
