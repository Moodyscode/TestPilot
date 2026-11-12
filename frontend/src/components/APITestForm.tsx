
import { useState } from "react";
import type { FormEvent } from "react";
import { runAPITest } from "../services/api";
import type { APITestResult } from "../types/api";

export default function APITestForm() {
  const [url, setUrl] = useState(
    "https://jsonplaceholder.typicode.com/posts/1"
  );
  const [expectedStatus, setExpectedStatus] = useState(200);
  const [result, setResult] = useState<APITestResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await runAPITest({
        url,
        expected_status: expectedStatus,
      });

      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="api-tester">
      <h2>API Testing Console</h2>
      <p>Send requests and validate API responses using Python.</p>

      <form onSubmit={handleSubmit}>
        <label htmlFor="api-url">API Endpoint</label>
        <input
          id="api-url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          required
        />

        <label htmlFor="expected-status">Expected Status Code</label>
        <input
          id="expected-status"
          type="number"
          min="100"
          max="599"
          value={expectedStatus}
          onChange={(event) =>
            setExpectedStatus(Number(event.target.value))
          }
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Running Test..." : "Run API Test"}
        </button>
      </form>

      {error && <p role="alert" className="error">{error}</p>}

      {result && (
        <div className="test-result">
          <h3>Test Results</h3>
          <p>
            Status: <strong>{result.passed ? "PASSED" : "FAILED"}</strong>
          </p>
          <p>Expected: {result.expected_status}</p>
          <p>Actual: {result.actual_status ?? "No response"}</p>
          <p>Response Time: {result.response_time_ms ?? "N/A"} ms</p>

          {result.error && <p role="alert">{result.error}</p>}

          <h4>Response Body</h4>
          <pre>{JSON.stringify(result.response_body, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
