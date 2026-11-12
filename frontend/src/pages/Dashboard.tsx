import { useMemo, useState } from "react";

import {
  Activity,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

import APITestForm from "../components/APITestForm";
import TestResult from "../components/TestResult";
import type { APITestResult } from "../types/api";

export default function Dashboard() {
  const [history, setHistory] = useState<APITestResult[]>([]);

  const latestResult = history[0] ?? null;

  const stats = useMemo(() => {
    const total = history.length;
    const passed = history.filter((test) => test.passed).length;
    const failed = total - passed;

    const responseTimes = history
      .map((test) => test.response_time_ms)
      .filter((time): time is number => time !== null);

    const averageResponse =
      responseTimes.length > 0
        ? responseTimes.reduce((sum, time) => sum + time, 0) /
          responseTimes.length
        : 0;

    return {
      total,
      passed,
      failed,
      averageResponse: averageResponse.toFixed(2),
    };
  }, [history]);

  function handleTestComplete(result: APITestResult) {
    setHistory((previous) => [result, ...previous]);
  }

  return (
    <div className="dashboard-content">
      <div className="page-heading">
        <div>
          <h1>Dashboard Overview</h1>
          <p>
            Monitor API testing activity and execution results.
          </p>
        </div>
        <span className="session-label">Current Session</span>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Tests"
          value={stats.total}
          icon={<Activity size={21} />}
          variant="purple"
        />

        <StatCard
          title="Passed Tests"
          value={stats.passed}
          icon={<CheckCircle2 size={21} />}
          variant="green"
        />

        <StatCard
          title="Failed Tests"
          value={stats.failed}
          icon={<XCircle size={21} />}
          variant="red"
        />

        <StatCard
          title="Avg. Response"
          value={`${stats.averageResponse} ms`}
          icon={<Clock3 size={21} />}
          variant="blue"
        />
      </div>

      <div className="workspace-grid">
        <APITestForm onTestComplete={handleTestComplete} />
        <TestResult result={latestResult} />
      </div>

      <section className="panel history-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent Test Executions</h2>
            <p>Tests executed during this browser session</p>
          </div>
        </div>

        {history.length === 0 ? (
          <p className="empty-state">
            No tests executed yet. Run your first API test.
          </p>
        ) : (
          <div className="table-scroll">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Endpoint</th>
                  <th>Status</th>
                  <th>Time</th>
                  <th>Result</th>
                </tr>
              </thead>

              <tbody>
                {history.slice(0, 10).map((test, index) => (
                  <tr key={index}>
                    <td>{test.method}</td>
                    <td className="endpoint-cell">{test.url}</td>
                    <td>{test.actual_status ?? "N/A"}</td>
                    <td>{test.response_time_ms ?? "N/A"} ms</td>
                    <td>
                      <span
                        className={`result-badge ${
                          test.passed ? "passed" : "failed"
                        }`}
                      >
                        {test.passed ? "PASS" : "FAIL"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  variant: string;
}

function StatCard({
  title,
  value,
  icon,
  variant,
}: StatCardProps) {
  return (
    <div className={`stat-card ${variant}`}>
      <div className="stat-card-top">
        <span>{title}</span>
        <div className="stat-icon">{icon}</div>
      </div>
      <strong>{value}</strong>
    </div>
  );
}
