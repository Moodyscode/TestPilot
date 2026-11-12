
import { CheckCircle2, XCircle, Clock3 } from "lucide-react";
import type { APITestResult } from "../types/api";

interface TestResultProps {
  result: APITestResult | null;
}

export default function TestResult({ result }: TestResultProps) {
  if (!result) {
    return (
      <section className="panel">
        <h2>Response Viewer</h2>
        <p className="empty-state">
          Run an API test to view its response.
        </p>
      </section>
    );
  }

  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h2>Response Viewer</h2>
          <p>Latest API execution result</p>
        </div>

        <span
          className={`result-badge ${
            result.passed ? "passed" : "failed"
          }`}
        >
          {result.passed ? (
            <CheckCircle2 size={15} />
          ) : (
            <XCircle size={15} />
          )}

          {result.passed ? "PASSED" : "FAILED"}
        </span>
      </div>

      <div className="response-details">
        <div>
          <span>Expected Status</span>
          <strong>{result.expected_status}</strong>
        </div>

        <div>
          <span>Actual Status</span>
          <strong>{result.actual_status ?? "N/A"}</strong>
        </div>

        <div>
          <span>Response Time</span>
          <strong>
            <Clock3 size={15} />
            {result.response_time_ms ?? "N/A"} ms
          </strong>
        </div>
      </div>

      {result.error && (
        <div className="error-message" role="alert">
          {result.error}
        </div>
      )}

      <div className="code-heading">
        <h3>Response Body</h3>
        <span>JSON / Text</span>
      </div>

      <pre className="response-code">
        {result.response_body === null
          ? "No response body available."
          : typeof result.response_body === "string"
            ? result.response_body
            : JSON.stringify(result.response_body, null, 2)}
      </pre>
    </section>
  );
}
