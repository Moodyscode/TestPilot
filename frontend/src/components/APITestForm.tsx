
import { useState } from "react";
import type { FormEvent } from "react";
import { Play, LoaderCircle } from "lucide-react";

import { runAPITest } from "../services/api";
import type { APITestResult } from "../types/api";

interface APITestFormProps {
  onTestComplete: (result: APITestResult) => void;
}

export default function APITestForm({
  onTestComplete,
}: APITestFormProps) {
  const [url, setUrl] = useState(
    "https://jsonplaceholder.typicode.com/posts/1"
  );

  const [expectedStatus, setExpectedStatus] = useState(200);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const result = await runAPITest({
        url,
        expected_status: expectedStatus,
      });

      onTestComplete(result);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>API Testing Console</h2>
          <p>Execute and validate requests using Python.</p>
        </div>
        <span className="method-badge">GET</span>
      </div>

      <form className="test-form" onSubmit={handleSubmit}>
        <label htmlFor="api-url">API Endpoint</label>

        <input
          id="api-url"
          type="url"
          value={url}
          onChange={(event) => setUrl(event.target.value)}
          placeholder="https://api.example.com/endpoint"
          required
        />

        <label htmlFor="expected-status">
          Expected Status Code
        </label>

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

        <button
          type="submit"
          className="primary-button"
          disabled={loading}
        >
          {loading ? (
            <>
              <LoaderCircle size={17} className="spin" />
              Running Test...
            </>
          ) : (
            <>
              <Play size={17} />
              Run API Test
            </>
          )}
        </button>
      </form>

      <p className="form-hint">
        Current approved target: jsonplaceholder.typicode.com
      </p>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
    </section>
  );
}
