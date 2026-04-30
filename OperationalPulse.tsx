import * as React from "react";
import { Card, Chip } from "./App";

export const OperationalPulse = ({ staff }) => {
  const now = new Date();
  const hour = now.getHours();

  // --- PULSE LOGIC ---
  const activeStaff = staff.filter((s) => s.status === "Active");
  const onDutyCount = activeStaff.length;

  // Dynamic Shift Label
  const currentShift =
    hour >= 10 && hour < 16
      ? "LUNCH SERVICE"
      : hour >= 18 && hour < 24
      ? "DINNER SERVICE"
      : "PREP/CLOSE";

  // Real-time Labor Cost Calculation (Approx. Hourly)
  const hourlyLaborCost = activeStaff.reduce((acc, member) => {
    const hourly = parseFloat(member.salary || 0) / 160;
    return acc + hourly;
  }, 0);

  return (
    <div style={{ animation: "fadeUp .4s ease" }}>
      {/* --- LIVE STATUS HEADER --- */}
      <div style={headerStyle}>
        <div>
          <div style={liveIndicator}>
            <div style={pulseDot} />
            LIVE SYSTEM PULSE
          </div>
          <h2 style={titleStyle}>
            Operational <span style={{ color: "#b5862a" }}>Command</span>
          </h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={timeLabel}>
            {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
          <Chip color={onDutyCount > 0 ? "gold" : "blue"}>{currentShift}</Chip>
        </div>
      </div>

      {/* --- TOP METRICS GRID --- */}
      <div style={metricsGrid}>
        <PulseCard
          label="TEAM ON DUTY"
          val={onDutyCount}
          sub={`${staff.length - onDutyCount} members off`}
          icon="👥"
        />
        <PulseCard
          label="EST. HOURLY COST"
          val={`₹${Math.round(hourlyLaborCost)}`}
          sub="Based on active registry"
          icon="💰"
        />
        <PulseCard
          label="SHIFT CAPACITY"
          val={`${Math.round((onDutyCount / (staff.length / 2)) * 100)}%`}
          sub="Current vs. Optimal"
          icon="⚡"
        />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {/* --- ACTIVE PERSONNEL ROSTER --- */}
        <div style={containerStyle}>
          <div style={sectionHeader}>
            <span>ACTIVE PERSONNEL</span>
            <span style={countBadge}>{onDutyCount}</span>
          </div>
          <div style={listScroll}>
            {onDutyCount === 0 ? (
              <div style={emptyState}>
                System standby. No active shifts detected.
              </div>
            ) : (
              activeStaff.map((s) => (
                <div key={s.id} style={staffRow}>
                  <div style={avatarSmall}>{s.name.charAt(0)}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>
                      {s.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.6rem",
                        color: "#b5862a",
                        fontWeight: 700,
                      }}
                    >
                      {s.role.toUpperCase()}
                    </div>
                  </div>
                  <div style={meritBadge}>{s.performance}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* --- AI STRATEGIST FEED --- */}
        <div style={containerStyle}>
          <div style={sectionHeader}>AI STRATEGIC INSIGHTS</div>
          <div style={{ padding: "20px" }}>
            <AiAlert
              type="info"
              msg={
                onDutyCount < 3
                  ? "Low staffing detected for current window. Ensure backup is on standby."
                  : "Staffing levels optimal for standard traffic."
              }
            />
            <AiAlert
              type="success"
              msg="High-merit anchors detected on current shift. Service quality expected to be 'Elite'."
            />
            <div style={dataInsight}>
              <div style={smallLabel}>NEXT SHIFT TRANSITION</div>
              <div style={{ fontWeight: 700 }}>
                {hour < 16 ? "06:00 PM (Dinner)" : "10:00 AM (Lunch)"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS ---
const PulseCard = ({ label, val, sub, icon }) => (
  <Card
    style={{
      padding: "25px",
      display: "flex",
      alignItems: "center",
      gap: "20px",
    }}
  >
    <div style={iconBox}>{icon}</div>
    <div>
      <div style={smallLabel}>{label}</div>
      <div
        style={{
          fontSize: "1.8rem",
          fontWeight: 300,
          fontFamily: "'Cormorant Garamond', serif",
        }}
      >
        {val}
      </div>
      <div style={{ fontSize: "0.55rem", color: "#999", fontWeight: 800 }}>
        {sub.toUpperCase()}
      </div>
    </div>
  </Card>
);

const AiAlert = ({ type, msg }) => (
  <div
    style={{
      ...alertBox,
      borderLeft: `3px solid ${type === "info" ? "#b5862a" : "#2d7a5f"}`,
    }}
  >
    <div style={{ fontSize: "0.65rem", fontWeight: 800, color: "#111" }}>
      {msg}
    </div>
  </div>
);

// --- STYLES ---
const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  marginBottom: "2.5rem",
};
const titleStyle = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "2.8rem",
  fontWeight: 300,
  margin: 0,
};
const liveIndicator = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  fontSize: "0.6rem",
  fontWeight: 900,
  color: "#999",
  letterSpacing: "2px",
  marginBottom: "5px",
};
const pulseDot = {
  width: "8px",
  height: "8px",
  background: "#2d7a5f",
  borderRadius: "50%",
  boxShadow: "0 0 10px #2d7a5f",
};
const timeLabel = {
  fontSize: "1.2rem",
  fontWeight: 300,
  fontFamily: "'Cormorant Garamond', serif",
  color: "#111",
};
const metricsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "20px",
};
const iconBox = {
  width: "50px",
  height: "50px",
  borderRadius: "12px",
  background: "#fdfcf8",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.5rem",
  border: "1px solid #eee",
};
const smallLabel = {
  fontSize: "0.55rem",
  fontWeight: 900,
  color: "#bbb",
  letterSpacing: "1px",
};
const containerStyle = {
  background: "#fff",
  borderRadius: "20px",
  border: "1px solid #eee",
  overflow: "hidden",
};
const sectionHeader = {
  padding: "15px 20px",
  background: "#fafafa",
  borderBottom: "1px solid #eee",
  fontSize: "0.6rem",
  fontWeight: 900,
  letterSpacing: "1.5px",
  color: "#999",
  display: "flex",
  justifyContent: "space-between",
};
const listScroll = { padding: "10px", maxHeight: "300px", overflowY: "auto" };
const staffRow = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  padding: "12px",
  borderRadius: "10px",
  borderBottom: "1px solid #f9f9f9",
};
const avatarSmall = {
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  background: "#1a1612",
  color: "#b5862a",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.7rem",
  fontWeight: 900,
};
const meritBadge = { fontSize: "0.75rem", fontWeight: 900, color: "#2d7a5f" };
const countBadge = {
  background: "#1a1612",
  color: "#b5862a",
  padding: "2px 8px",
  borderRadius: "10px",
  fontSize: "0.6rem",
};
const alertBox = {
  padding: "15px",
  background: "#fdfcf8",
  borderRadius: "8px",
  marginBottom: "10px",
};
const dataInsight = {
  marginTop: "20px",
  padding: "15px",
  borderTop: "1px solid #eee",
};
const emptyState = {
  padding: "40px",
  textAlign: "center",
  color: "#bbb",
  fontSize: "0.7rem",
  fontWeight: 700,
};
