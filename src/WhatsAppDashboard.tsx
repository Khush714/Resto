import * as React from "react";
import { Card } from "./App";

export const WhatsAppDashboard = () => {
  const [logs, setLogs] = React.useState([]);

  // Live Refresh
  React.useEffect(() => {
    const fetchLogs = () => {
      const data = JSON.parse(localStorage.getItem("wa_logs") || "[]");
      setLogs(data);
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 2000); // Poll every 2 seconds
    return () => clearInterval(interval);
  }, []);

  const stats = {
    total: logs.length,
    confirmations: logs.filter((l) => l.type === "CONFIRMATION").length,
    ready: logs.filter((l) => l.type === "READY").length,
  };

  return (
    <div style={{ animation: "fadeUp .4s ease" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
          marginBottom: "2.5rem",
        }}
      >
        <StatBox label="MESSAGES SENT" value={stats.total} color="#25D366" />
        <StatBox
          label="ORDER CONFIRMS"
          value={stats.confirmations}
          color="#b5862a"
        />
        <StatBox label="STATUS UPDATES" value={stats.ready} color="#111" />
      </div>

      <Card style={{ padding: 0, overflow: "hidden" }}>
        <div
          style={{
            padding: "1.5rem",
            borderBottom: "1px solid #eee",
            background: "#fcfcfc",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "0.9rem",
              fontWeight: "800",
              letterSpacing: "1px",
            }}
          >
            AUTOMATION LOGS
          </h3>
        </div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                textAlign: "left",
                background: "#fafafa",
                fontSize: "0.65rem",
                color: "#999",
              }}
            >
              <th style={{ padding: "15px" }}>TIME</th>
              <th>CUSTOMER</th>
              <th>MESSAGE TYPE</th>
              <th>PREVIEW</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                style={{ borderBottom: "1px solid #eee", fontSize: "0.8rem" }}
              >
                <td style={{ padding: "15px", color: "#999" }}>{log.time}</td>
                <td>
                  <b>{log.customer}</b>
                  <br />
                  <span style={{ fontSize: "0.7rem", opacity: 0.5 }}>
                    {log.phone}
                  </span>
                </td>
                <td>
                  <span
                    style={{
                      fontSize: "0.6rem",
                      fontWeight: "900",
                      color: "#b5862a",
                    }}
                  >
                    {log.type}
                  </span>
                </td>
                <td
                  style={{
                    maxWidth: "300px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    color: "#666",
                    fontStyle: "italic",
                  }}
                >
                  "{log.content}"
                </td>
                <td
                  style={{
                    color: "#25D366",
                    fontWeight: "900",
                    fontSize: "0.7rem",
                  }}
                >
                  {log.status}
                </td>
              </tr>
            ))}
            {logs.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#999",
                  }}
                >
                  No automated messages sent yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

const StatBox = ({ label, value, color }) => (
  <Card style={{ borderTop: `4px solid ${color}` }}>
    <div
      style={{
        fontSize: "0.6rem",
        fontWeight: "900",
        color: "#aaa",
        marginBottom: "5px",
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: "1.8rem",
        fontWeight: "400",
        fontFamily: "'Cormorant Garamond', serif",
      }}
    >
      {value}
    </div>
  </Card>
);
