
import httpx
import pytest

from app.schemas.test_schema import APITestRequest
from app.services.api_tester import run_api_test


@pytest.mark.anyio
async def test_successful_api_request(mocker):
    mock_response = httpx.Response(
        200,
        json={"id": 1, "title": "Test Post"},
        request=httpx.Request(
            "GET",
            "https://jsonplaceholder.typicode.com/posts/1"
        )
    )

    mocker.patch(
        "httpx.AsyncClient.get",
        return_value=mock_response
    )

    test = APITestRequest(
        url="https://jsonplaceholder.typicode.com/posts/1",
        expected_status=200
    )

    result = await run_api_test(test)

    assert result.passed is True
    assert result.actual_status == 200
    assert result.response_time_ms >= 0


@pytest.mark.anyio
async def test_failed_status_assertion(mocker):
    mock_response = httpx.Response(
        200,
        json={"id": 1},
        request=httpx.Request(
            "GET",
            "https://jsonplaceholder.typicode.com/posts/1"
        )
    )

    mocker.patch(
        "httpx.AsyncClient.get",
        return_value=mock_response
    )

    test = APITestRequest(
        url="https://jsonplaceholder.typicode.com/posts/1",
        expected_status=404
    )

    result = await run_api_test(test)

    assert result.passed is False
    assert result.expected_status == 404
    assert result.actual_status == 200


@pytest.mark.anyio
async def test_blocked_url():
    test = APITestRequest(
        url="https://example.com",
        expected_status=200
    )

    with pytest.raises(ValueError):
        await run_api_test(test)


@pytest.mark.anyio
async def test_network_failure(mocker):
    mocker.patch(
        "httpx.AsyncClient.get",
        side_effect=httpx.ConnectError(
            "Connection failed"
        )
    )

    test = APITestRequest(
        url="https://jsonplaceholder.typicode.com/posts/1",
        expected_status=200
    )

    result = await run_api_test(test)

    assert result.passed is False
    assert result.actual_status is None
    assert result.error is not None
