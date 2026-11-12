import type {
  APITestRequest,
  APITestResult,
} from "../types/api";

const API_BASE_URL = "http://127.0.0.1:8000";

export async function runAPITest(
  test: APITestRequest
): Promise<APITestResult> {
  const response = await fetch(
    `${API_BASE_URL}/api/tests/run`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(test),
    }
  );

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    throw new Error(
      error?.detail
        ? String(error.detail)
        : `API request failed: ${response.status}`
    );
  }

  return response.json() as Promise<APITestResult>;
}
