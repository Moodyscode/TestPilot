
import time

import httpx

from app.schemas.test_schema import APITestRequest, APITestResult


ALLOWED_HOST = "jsonplaceholder.typicode.com"


async def run_api_test(test: APITestRequest) -> APITestResult:
    url = str(test.url)

    # Restrict requests to our approved testing API.
    if (
        test.url.scheme != "https"
        or test.url.host != ALLOWED_HOST
        or test.url.port not in (None, 443)
        or test.url.username is not None
        or test.url.password is not None
    ):
        raise ValueError("This API host is not approved for testing.")

    start_time = time.perf_counter()

    try:
        async with httpx.AsyncClient(
            timeout=10.0,
            follow_redirects=False,
            trust_env=False,
        ) as client:
            response = await client.get(url)

        elapsed_ms = round(
            (time.perf_counter() - start_time) * 1000, 2
        )

        try:
            response_body = response.json()
        except ValueError:
            response_body = response.text[:2000]

        return APITestResult(
            url=url,
            method="GET",
            expected_status=test.expected_status,
            actual_status=response.status_code,
            passed=response.status_code == test.expected_status,
            response_time_ms=elapsed_ms,
            response_body=response_body,
        )

    except httpx.RequestError as exc:
        return APITestResult(
            url=url,
            method="GET",
            expected_status=test.expected_status,
            actual_status=None,
            passed=False,
            response_time_ms=round(
                (time.perf_counter() - start_time) * 1000, 2
            ),
            error=f"Request failed: {type(exc).__name__}",
        )
