import * as React from "react";
import { Card, Chip } from "./App";

export const ForecastIntelligence = ({ inventory, orders, context }) => {
  // Logic: Predict if Paneer and Maida need a 'Contextual Bump'
  const needsBreadBoost = context.event.includes("Match");
  const needsDeliveryPrep = context.weather === "Rainy";

  return (
    <div style={{ animation: "fadeUp 0.4s ease" }}>
      <div style={header}>
        <span style={superLabel}>Bharuch Local Pulse</span>
        <h2 style={title}>Contextual Forecast</h2>
      </div>

      <div style={forecastGrid}>
        {/* WEATHER TRIGGER */}
        <Card
          style={{
            borderLeft: `5px solid ${
              context.weather === "Rainy" ? "#3a6ea8" : "#b5862a"
            }`,
          }}
        >
          <div style={kpiLabel}>WEATHER IMPACT</div>
          <div style={kpiValue}>
            {context.weather === "Rainy" ? "🌧️ RAINY" : "☀️ CLEAR"}
          </div>
          <p style={impactNote}>
            {context.weather === "Rainy"
              ? "Expected 25% surge in Delivery & Dal orders."
              : "Stable walk-in traffic predicted."}
          </p>
        </Card>

        {/* EVENT TRIGGER */}
        <Card
          style={{
            borderLeft: `5px solid ${
              context.event !== "None" ? "#b5862a" : "#eee"
            }`,
          }}
        >
          <div style={kpiLabel}>LOCAL EVENTS</div>
          <div style={kpiValue}>
            {context.event !== "None" ? "🏏 IPL MATCH" : "NONE"}
          </div>
          <p style={impactNote}>
            {context.event !== "None"
              ? "Group orders for Starters & Breads likely to peak between 8 PM - 10 PM."
              : "Standard evening volume expected."}
          </p>
        </Card>
      </div>

      {/* SMART ORDERING SUGGESTIONS */}
      <Card style={strategyCard}>
        <h3 style={sectionTitle}>STRATEGY BRIEF: WEEKEND PREP</h3>
        <div style={strategyRow}>
          <div style={{ flex: 1 }}>
            <strong>Paneer & Maida Optimization</strong>
            <p style={desc}>
              Based on the IPL schedule, increase stock by 15kg to prevent
              mid-shift stock-outs.
            </p>
          </div>
          <button style={actionBtn}>ADJUST PO</button>
        </div>
      </Card>
    </div>
  );
};

// --- STYLES ---
const header = { marginBottom: "2rem" };
const superLabel = {
  fontSize: "0.6rem",
  fontWeight: "800",
  color: "#b5862a",
  letterSpacing: "2px",
};
const title = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "2.5rem",
  margin: "5px 0",
};
const forecastGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "20px",
  marginBottom: "2.5rem",
};
const kpiLabel = { fontSize: "0.6rem", color: "#999", fontWeight: "800" };
const kpiValue = { fontSize: "1.8rem", fontWeight: "300", marginTop: "5px" };
const impactNote = {
  fontSize: "0.75rem",
  color: "#666",
  marginTop: "10px",
  lineHeight: "1.4",
};
const strategyCard = { background: "#1a1612", color: "#fff" };
const sectionTitle = {
  fontSize: "0.8rem",
  fontWeight: "900",
  letterSpacing: "1px",
  marginBottom: "1.5rem",
  color: "#b5862a",
};
const strategyRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
const desc = { fontSize: "0.8rem", color: "#aaa", margin: "5px 0 0" };
const actionBtn = {
  background: "#b5862a",
  color: "#1a1612",
  border: "none",
  padding: "10px 20px",
  borderRadius: "5px",
  fontWeight: "900",
  fontSize: "0.7rem",
};
