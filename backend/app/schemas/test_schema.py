
from typing import Any

from pydantic import BaseModel, Field, HttpUrl


class APITestRequest(BaseModel):
    url: HttpUrl
    expected_status: int = Field(default=200, ge=100, le=599)


class APITestResult(BaseModel):
    url: str
    method: str
    expected_status: int
    actual_status: int | None
    passed: bool
    response_time_ms: float | None
    response_body: Any | None = None
    error: str | None = None
