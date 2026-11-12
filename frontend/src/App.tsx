import { useState } from "react";

import {
  FlaskConical,
  LayoutDashboard,
  Terminal,
  History,
  Layers3,
  Settings,
  Menu,
  X,
} from "lucide-react";

import Dashboard from "./pages/Dashboard";
import "./App.css";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard, enabled: true },
  { name: "API Tester", icon: Terminal, enabled: false },
  { name: "Test History", icon: History, enabled: false },
  { name: "Test Suites", icon: Layers3, enabled: false },
  { name: "Settings", icon: Settings, enabled: false },
];

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="app-shell">
      {sidebarOpen && (
        <button
          className="mobile-overlay"
          aria-label="Close navigation"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <FlaskConical size={24} />
          </div>

          <div>
            <h2>TestPilot</h2>
            <span>Developer Platform</span>
          </div>

          <button
            className="close-sidebar"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        <div className="nav-label">WORKSPACE</div>

        <nav className="nav-menu">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${
                  item.name === "Dashboard" ? "active" : ""
                }`}
                disabled={!item.enabled}
                title={
                  item.enabled
                    ? item.name
                    : `${item.name} — Coming soon`
                }
              >
                <Icon size={19} />
                <span>{item.name}</span>
                {!item.enabled && (
                  <small className="coming-soon">Soon</small>
                )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="backend-indicator">
            <span className="status-dot" />
            Python Backend
          </div>
          <small>TestPilot v1.0.0</small>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button
              className="menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>

            <span>Workspace / Dashboard</span>
          </div>

          <div className="topbar-right">
            <span className="environment-tag">Development</span>
            <div className="profile-avatar">TP</div>
          </div>
        </header>

        <main className="main-content">
          <Dashboard />
        </main>
      </div>
    </div>
  );
}

export default App;
