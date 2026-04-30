import * as React from "react";
import { Card, Chip } from "./App";

export const StaffPerformance = ({ staff, setStaff }) => {
  const [selectedMember, setSelectedMember] = React.useState(null);
  const [showVault, setShowVault] = React.useState(false);
  const [managerPass, setManagerPass] = React.useState("");

  const [reviewData, setReviewData] = React.useState({
    reliability: 90,
    service: 90,
    financial: 80,
    conduct: 95,
  });

  const calculateFinalScore = (data) => {
    const score =
      data.reliability * 0.3 +
      data.service * 0.4 +
      data.financial * 0.2 +
      data.conduct * 0.1;
    return Math.round(score);
  };

  const handleFinalize = (e) => {
    e.preventDefault();
    if (managerPass === "Patel") {
      const finalScore = `${calculateFinalScore(reviewData)}%`;
      setStaff((prev) =>
        prev.map((s) =>
          s.id === selectedMember.id ? { ...s, performance: finalScore } : s
        )
      );
      alert(`✓ Performance Cache Updated: ${selectedMember.name}`);
      setSelectedMember(null);
      setManagerPass("");
      setShowVault(false);
    } else {
      alert("Unauthorized Management Key.");
    }
  };

  const saveToDatabase = () => {
    localStorage.setItem("spice_garden_staff", JSON.stringify(staff));
    alert("💾 SYNC COMPLETE: Performance registry written to database.");
  };

  const leaderboard = [...staff].sort(
    (a, b) => parseFloat(b.performance) - parseFloat(a.performance)
  );

  return (
    <div style={{ animation: "fadeUp .4s ease" }}>
      {/* --- AUDIT MODAL --- */}
      {selectedMember && (
        <div
          style={modalOverlay}
          onClick={() => {
            setSelectedMember(null);
            setShowVault(false);
          }}
        >
          <div style={reviewModal} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: 900,
                  color: "#b5862a",
                  letterSpacing: "2px",
                }}
              >
                PERSONNEL AUDIT
              </span>
              <button onClick={() => setSelectedMember(null)} style={closeBtn}>
                ×
              </button>
            </div>

            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2.2rem",
                margin: "10px 0",
              }}
            >
              {selectedMember.name}
            </h3>

            <Slider
              label="Operational Reliability"
              val={reviewData.reliability}
              color="#2d7a5f"
              onChange={(v) => setReviewData({ ...reviewData, reliability: v })}
            />
            <Slider
              label="Service Quality"
              val={reviewData.service}
              color="#b5862a"
              onChange={(v) => setReviewData({ ...reviewData, service: v })}
            />
            <Slider
              label="Financial Impact"
              val={reviewData.financial}
              color="#1a1612"
              onChange={(v) => setReviewData({ ...reviewData, financial: v })}
            />
            <Slider
              label="Professional Conduct"
              val={reviewData.conduct}
              color="#3a5a40"
              onChange={(v) => setReviewData({ ...reviewData, conduct: v })}
            />

            <div style={scorePreview}>
              <span
                style={{ fontSize: "0.6rem", fontWeight: 900, color: "#999" }}
              >
                PROJECTED MERIT INDEX
              </span>
              <div
                style={{
                  fontSize: "2.5rem",
                  fontWeight: 300,
                  color: "#b5862a",
                }}
              >
                {calculateFinalScore(reviewData)}%
              </div>
            </div>

            {!showVault ? (
              <button onClick={() => setShowVault(true)} style={btnPrimary}>
                COMMIT TO CACHE
              </button>
            ) : (
              <form onSubmit={handleFinalize} style={{ marginTop: "15px" }}>
                <input
                  type="password"
                  placeholder="Enter 'Patel' to authorize"
                  value={managerPass}
                  onChange={(e) => setManagerPass(e.target.value)}
                  style={passInput}
                  autoFocus
                />
                <button type="submit" style={btnPrimary}>
                  AUTHORIZE CHANGES
                </button>
              </form>
            )}
            <button
              onClick={() => {
                setSelectedMember(null);
                setShowVault(false);
              }}
              style={btnCancel}
            >
              DISMISS
            </button>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <div style={headerStyle}>
        <div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.4rem",
              fontWeight: 400,
              margin: 0,
            }}
          >
            Performance <span style={{ color: "#b5862a" }}>Intelligence</span>
          </h2>
          <Chip color="gold">Live Merit Mode</Chip>
        </div>
        {/* --- RENAMED BUTTON --- */}
        <button onClick={saveToDatabase} style={syncPerfBtnStyle}>
          <span>💾</span> SYNC PERFORMANCE
        </button>
      </div>

      {/* --- TOP 3 CARDS --- */}
      <div style={statsGrid}>
        {leaderboard.slice(0, 3).map((hero, idx) => (
          <Card
            key={hero.id}
            onClick={() => {
              setSelectedMember(hero);
              const base = parseFloat(hero.performance) || 85;
              setReviewData({
                reliability: base,
                service: base,
                financial: base,
                conduct: base,
              });
            }}
            style={{
              ...heroCardStyle(idx === 0),
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.transform = "translateY(-5px)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.transform = "translateY(0)")
            }
          >
            <div style={rankBadge}>{idx + 1}</div>
            <div
              style={{
                fontSize: "0.6rem",
                fontWeight: 900,
                color: idx === 0 ? "#b5862a" : "#999",
                marginBottom: "5px",
              }}
            >
              RANKING
            </div>
            <div style={{ fontSize: "1.2rem", fontWeight: 800 }}>
              {hero.name}
            </div>
            <div style={scoreLarge}>{hero.performance}</div>
            <div
              style={{
                fontSize: "0.55rem",
                fontWeight: 900,
                color: "#bbb",
                marginTop: "10px",
              }}
            >
              TAP TO AUDIT
            </div>
          </Card>
        ))}
      </div>

      {/* --- TABLE --- */}
      <div style={tableContainer}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={tableHeader}>
              <th style={thStyle}>STAFF MEMBER</th>
              <th style={thStyle}>LATEST MERIT</th>
              <th style={thStyle}>STATUS</th>
              <th style={{ ...thStyle, textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((m) => (
              <tr key={m.id} style={trStyle}>
                <td style={tdStyle}>
                  <div style={{ fontWeight: 800 }}>{m.name}</div>
                  <div style={{ fontSize: "0.6rem", color: "#999" }}>
                    {m.role}
                  </div>
                </td>
                <td style={tdStyle}>
                  <span style={scoreBadge(parseFloat(m.performance))}>
                    {m.performance}
                  </span>
                </td>
                <td style={tdStyle}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      fontSize: "0.65rem",
                      fontWeight: 800,
                    }}
                  >
                    <div
                      style={{
                        width: "6px",
                        height: "6px",
                        borderRadius: "50%",
                        background:
                          parseFloat(m.performance) > 90
                            ? "#2d7a5f"
                            : "#f59e0b",
                      }}
                    />
                    {parseFloat(m.performance) > 90 ? "ELITE" : "STANDARD"}
                  </div>
                </td>
                <td style={{ ...tdStyle, textAlign: "right" }}>
                  <button
                    onClick={() => {
                      setSelectedMember(m);
                      const base = parseFloat(m.performance) || 85;
                      setReviewData({
                        reliability: base,
                        service: base,
                        financial: base,
                        conduct: base,
                      });
                    }}
                    style={auditBtn}
                  >
                    AUDIT MERIT
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTS & STYLES ---
const Slider = ({ label, val, onChange, color }) => (
  <div style={{ margin: "15px 0" }}>
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        fontSize: "0.6rem",
        fontWeight: 900,
        color: "#999",
        marginBottom: "5px",
      }}
    >
      <span>{label.toUpperCase()}</span>
      <span style={{ color: color }}>{val}%</span>
    </div>
    <input
      type="range"
      min="0"
      max="100"
      value={val}
      onChange={(e) => onChange(parseInt(e.target.value))}
      style={{ width: "100%", accentColor: color, cursor: "pointer" }}
    />
  </div>
);

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(255,255,255,0.85)",
  backdropFilter: "blur(12px)",
  zIndex: 6000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const reviewModal = {
  background: "#fff",
  padding: "3rem",
  borderRadius: "30px",
  width: "90%",
  maxWidth: "450px",
  border: "1.5px solid #b5862a",
  boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
};
const scorePreview = {
  background: "#fdfcf8",
  padding: "20px",
  borderRadius: "15px",
  textAlign: "center",
  margin: "20px 0",
  border: "1px dashed #eee",
};
const passInput = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #eee",
  marginBottom: "10px",
  textAlign: "center",
  outline: "none",
  background: "#fafafa",
};
const btnPrimary = {
  width: "100%",
  padding: "14px",
  background: "#1a1612",
  color: "#b5862a",
  border: "none",
  borderRadius: "8px",
  fontWeight: 900,
  cursor: "pointer",
  fontSize: "0.75rem",
  letterSpacing: "1px",
};
const btnCancel = {
  width: "100%",
  background: "none",
  border: "none",
  color: "#999",
  marginTop: "15px",
  cursor: "pointer",
  fontSize: "0.65rem",
  fontWeight: 800,
};
const closeBtn = {
  background: "none",
  border: "none",
  fontSize: "1.8rem",
  cursor: "pointer",
  color: "#999",
};
const auditBtn = {
  padding: "6px 12px",
  background: "#1a1612",
  border: "none",
  borderRadius: "5px",
  fontSize: "0.55rem",
  fontWeight: 900,
  color: "#b5862a",
  cursor: "pointer",
};
const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  marginBottom: "2rem",
};

const syncPerfBtnStyle = {
  background: "#1a1612",
  color: "#b5862a",
  padding: "8px 16px",
  borderRadius: "8px",
  border: "1.2px solid #b5862a",
  fontWeight: "800",
  cursor: "pointer",
  fontSize: "0.65rem",
  transition: "0.2s",
  display: "flex",
  alignItems: "center",
  gap: "6px",
};

const statsGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "20px",
  marginBottom: "2.5rem",
};
const heroCardStyle = (isFirst) => ({
  background: isFirst ? "#1a1612" : "#fff",
  color: isFirst ? "#fff" : "#111",
  textAlign: "center",
  position: "relative",
  border: "1px solid #eee",
});
const rankBadge = {
  position: "absolute",
  top: "15px",
  right: "15px",
  background: "#b5862a",
  color: "#fff",
  width: "20px",
  height: "20px",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "0.6rem",
  fontWeight: 900,
};
const scoreLarge = {
  fontSize: "2.2rem",
  fontWeight: 300,
  fontFamily: "'Cormorant Garamond', serif",
  marginTop: "10px",
  color: "#b5862a",
};
const tableContainer = {
  background: "#fff",
  borderRadius: "20px",
  border: "1px solid #eee",
  overflow: "hidden",
};
const tableHeader = { background: "#fafafa", borderBottom: "1px solid #eee" };
const thStyle = {
  padding: "1.2rem",
  fontSize: "0.6rem",
  color: "#bbb",
  fontWeight: "900",
  textAlign: "left",
  letterSpacing: "1.5px",
};
const tdStyle = { padding: "1.2rem", borderBottom: "1px solid #f9f9f9" };
const trStyle = { transition: "0.3s" };
const scoreBadge = (score) => ({
  padding: "4px 10px",
  borderRadius: "6px",
  background: score > 90 ? "#e8f5e9" : "#fff7ed",
  color: score > 90 ? "#2d7a5f" : "#f59e0b",
  fontSize: "0.75rem",
  fontWeight: 900,
});
