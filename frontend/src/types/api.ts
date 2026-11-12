
export interface APITestRequest {
  url: string;
  expected_status: number;
}

export interface APITestResult {
  url: string;
  method: string;
  expected_status: number;
  actual_status: number | null;
  passed: boolean;
  response_time_ms: number | null;
  response_body: unknown;
  error: string | null;
}
