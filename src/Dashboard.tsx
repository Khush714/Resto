import * as React from "react";
import { Card, Chip } from "./App";

export const Dashboard = ({
  orders,
  customers,
  staff = [],
  inventory = [],
  recipes = [],
  externalContext,
  setPage,
  onResetShift,
  onToggleAura,
  isAuraOpen,
}) => {
  const [showAudit, setShowAudit] = React.useState(false);

  // --- AURA SENTINEL LOGIC (UNTOUCHED) ---
  const lowStockItems = inventory.filter(
    (item) => item.currentStock <= (item.minThreshold || 0)
  );

  const processedOrdersForLeakage = orders.filter(
    (o) => (o.status || "").toLowerCase() === "completed"
  );
  const theoreticalUsage = {};
  processedOrdersForLeakage.forEach((order) => {
    order.items.forEach((item) => {
      const recipe = recipes.find(
        (r) => String(r.menuId) === String(item.id) || r.name === item.name
      );
      if (recipe) {
        recipe.ingredients.forEach((ing) => {
          theoreticalUsage[ing.id] =
            (theoreticalUsage[ing.id] || 0) +
            parseFloat(ing.qty) * (item.qty || 1);
        });
      }
    });
  });

  const totalLeakage = inventory.reduce((acc, item) => {
    const theory = theoreticalUsage[item.id] || 0;
    const actual = Math.max(
      0,
      (item.openingStock || 0) - (item.currentStock || 0)
    );
    const variance = Math.max(0, actual - theory);
    return acc + variance * (item.costPerUnit || 0);
  }, 0);

  const matchDayAlert = externalContext?.event?.includes("Match");
  const hasEmergency =
    lowStockItems.length > 0 || totalLeakage > 500 || matchDayAlert;

  // --- DATA ENGINE (FINANCIAL) ---
  const activeOrders = orders.filter((o) => o.status !== "Archived");
  const totalRevenue = orders.reduce(
    (sum, o) => sum + parseFloat(o.billing?.total || 0),
    0
  );
  const totalBills = orders.length;

  // --- DATA ENGINE (OPERATIONAL) ---
  const activeStaff = staff.filter((s) => s.status === "Active");
  const hourlyLaborCost = activeStaff.reduce((acc, s) => {
    const hourly = parseFloat(s.salary || 0) / 160;
    return acc + hourly;
  }, 0);

  const laborRatio =
    totalRevenue > 0 ? ((hourlyLaborCost * 8) / totalRevenue) * 100 : 0;

  const dishCounts = {};
  orders.forEach((o) =>
    o.items.forEach(
      (i) => (dishCounts[i.name] = (dishCounts[i.name] || 0) + (i.qty || 1))
    )
  );
  const starItem =
    Object.entries(dishCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None";

  const hourlySales = [4200, 5800, 3900, 7200, 8500, 6100];
  const maxSale = Math.max(...hourlySales);

  return (
    <div style={pageStyle}>
      <style>{keyframes}</style>

      {/* --- REFINED AURA SENTINEL BAR --- */}
      {hasEmergency && (
        <div style={sentinelBar}>
          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            <div style={iconContainer}>
              <div style={pulseStatusRed} />
              <div style={auraCore} />
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "2px" }}
            >
              <span style={sentinelLabel}>AURA SYSTEM INTEL</span>
              <span style={sentinelText}>
                {lowStockItems.length > 0
                  ? `CRITICAL STOCK: ${lowStockItems[0].name} and ${
                      lowStockItems.length - 1
                    } others are below safety threshold.`
                  : totalLeakage > 500
                  ? `MARGIN RISK: ₹${totalLeakage.toFixed(
                      0
                    )} variance detected. Operational handshake required.`
                  : `CONTEXT PROTOCOL: Bharuch Match Day detected. Scaled prep levels recommended.`}
              </span>
            </div>
          </div>

          <button
            onClick={() =>
              setPage(
                lowStockItems.length > 0
                  ? "inventory"
                  : totalLeakage > 500
                  ? "analytics"
                  : "kitchen"
              )
            }
            style={resolveBtn}
          >
            <span style={{ letterSpacing: "2px" }}>RESOLVE</span>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path
                d="M5 12h14M12 5l7 7-7 7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      {/* --- INTEGRATED COMMAND HEADER --- */}
      <div style={headerStyle}>
        <div>
          <span style={superLabelStyle}>Operational Intelligence</span>
          <h2 style={titleStyle}>
            The{" "}
            <span style={{ color: "#B5862A", fontWeight: "400" }}>
              Dashboard
            </span>
          </h2>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={dateStyle}>
            {new Date()
              .toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
              .toUpperCase()}
          </div>
          <div style={statusRowStyle}>
            <div style={liveStatusStyle}>● SYSTEM LIVE</div>
            <button onClick={onToggleAura} style={auraHeaderBtn(isAuraOpen)}>
              <div style={auraPulse(isAuraOpen)} />
              {isAuraOpen ? "DISCONNECT AURA" : "COMMAND AURA"}
            </button>
          </div>
        </div>
      </div>

      {/* --- KPI GRID --- */}
      <div style={kpiGridStyle}>
        <ModernCard
          label="REVENUE"
          value={`₹${totalRevenue.toLocaleString()}`}
          accent="#B5862A"
        />
        <ModernCard
          label="LABOR COST %"
          value={`${laborRatio.toFixed(1)}%`}
          accent="#111"
        />
        <ModernCard
          label="TEAM ON DUTY"
          value={activeStaff.length}
          accent="#B5862A"
        />
        <ModernCard
          label="STAR ITEM"
          value={starItem.split(" ")[0]}
          accent="#B5862A"
        />
      </div>

      {/* --- ANALYTICS --- */}
      <div style={mainGridStyle}>
        <Card style={whiteCardStyle}>
          <h3 style={sectionHeaderStyle}>SALES VELOCITY</h3>
          <div style={{ width: "100%", height: "200px" }}>
            <svg
              viewBox="0 0 600 200"
              preserveAspectRatio="none"
              style={{ width: "100%", height: "100%" }}
            >
              <path
                d={hourlySales
                  .map(
                    (val, i) =>
                      `${i === 0 ? "M" : "L"} ${i * 120} ${
                        200 - (val / maxSale) * 160
                      }`
                  )
                  .join(" ")}
                fill="none"
                stroke="#B5862A"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </Card>

        <Card style={whiteCardStyle}>
          <h3 style={sectionHeaderStyle}>STRATEGIC PULSE</h3>
          <div style={insightBoxStyle}>
            <div style={insightTagStyle}>
              {matchDayAlert ? "EXTERNAL EVENT" : "HUMAN CAPITAL"}
            </div>
            <p style={insightTextStyle}>
              {matchDayAlert
                ? `IPL Event: Delivery demand is projected to increase by 35% tonight.`
                : activeStaff.length > 0
                ? `${activeStaff[0].name} (Elite Merit) is currently anchoring the floor.`
                : "Monitoring staff registry for active anchors..."}
            </p>
          </div>
          <button onClick={() => setShowAudit(true)} style={auditBtnStyle}>
            GENERATE SHIFT AUDIT
          </button>
        </Card>
      </div>

      {/* --- SHIFT AUDIT MODAL --- */}
      {showAudit && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2rem",
              }}
            >
              Shift Summary
            </h2>
            <div style={{ marginBottom: "2rem", textAlign: "left" }}>
              <AuditRow
                label="Gross Revenue"
                val={`₹${totalRevenue.toLocaleString()}`}
              />
              <AuditRow
                label="Avg. Ticket"
                val={`₹${(totalRevenue / (totalBills || 1)).toFixed(0)}`}
              />
              <AuditRow
                label="Current Leakage"
                val={`₹${totalLeakage.toFixed(0)}`}
              />
              <AuditRow
                label="Est. Labor Cost"
                val={`₹${Math.round(hourlyLaborCost * 8)}`}
              />
            </div>
            <div style={{ display: "flex", gap: "10px" }}>
              <button onClick={() => setShowAudit(false)} style={backBtnStyle}>
                BACK
              </button>
              <button
                onClick={() => {
                  onResetShift();
                  setShowAudit(false);
                }}
                style={resetBtnStyle}
              >
                RESET SHIFT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---
const ModernCard = ({ label, value, accent }) => (
  <Card
    style={{
      background: "#FFF",
      border: "1px solid #EEE",
      padding: "1.5rem",
      position: "relative",
    }}
  >
    <div style={cardLabelStyle}>{label}</div>
    <div style={cardValueStyle}>{value}</div>
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "30px",
        height: "2px",
        background: accent,
      }}
    />
  </Card>
);

const AuditRow = ({ label, val }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 0",
      borderBottom: "1px solid #F5F5F5",
    }}
  >
    <span style={{ color: "#666", fontSize: "0.8rem" }}>{label}</span>
    <span style={{ fontWeight: "700" }}>{val}</span>
  </div>
);

// --- ARCHITECTURAL STYLES ---
const sentinelBar = {
  background: "rgba(26, 22, 18, 0.95)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(181, 134, 42, 0.3)",
  borderLeft: "4px solid #b5862a",
  padding: "18px 30px",
  borderRadius: "4px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "3rem",
  boxShadow:
    "0 20px 40px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.1)",
  animation: "slideIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
};

const iconContainer = {
  position: "relative",
  width: "32px",
  height: "32px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const auraCore = {
  width: "12px",
  height: "12px",
  border: "1px solid #b5862a",
  borderRadius: "2px",
  transform: "rotate(45deg)",
};

const pulseStatusRed = {
  position: "absolute",
  width: "100%",
  height: "100%",
  border: "1px solid #b84040",
  borderRadius: "50%",
  animation: "pulseGlow 2s infinite",
  opacity: 0.5,
};

const sentinelLabel = {
  fontSize: "0.5rem",
  fontWeight: "900",
  color: "#b5862a",
  letterSpacing: "3px",
  textTransform: "uppercase",
};

const sentinelText = {
  color: "rgba(255, 255, 255, 0.9)",
  fontSize: "0.8rem",
  fontWeight: "500",
  maxWidth: "600px",
  lineHeight: "1.4",
};

const resolveBtn = {
  background: "transparent",
  color: "#b5862a",
  border: "1px solid #b5862a",
  padding: "10px 20px",
  borderRadius: "2px",
  fontSize: "0.6rem",
  fontWeight: "900",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "12px",
  transition: "0.3s all ease",
  backgroundColor: "rgba(181, 134, 42, 0.05)",
};

const keyframes = `
  @keyframes pulseGlow { 0% { transform: scale(0.8); opacity: 0.8; } 100% { transform: scale(1.5); opacity: 0; } }
  @keyframes slideIn { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
`;

// --- PRE-EXISTING STYLES (UNCHANGED) ---
const pageStyle = {
  padding: "2rem",
  backgroundColor: "#F9FAFB",
  minHeight: "100vh",
};
const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  marginBottom: "3rem",
  paddingBottom: "1.5rem",
};
const superLabelStyle = {
  letterSpacing: "4px",
  fontSize: "0.6rem",
  fontWeight: "800",
  color: "#B5862A",
  textTransform: "uppercase",
};
const titleStyle = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "3rem",
  margin: "5px 0 0",
  fontWeight: "300",
};
const dateStyle = {
  fontSize: "0.7rem",
  fontWeight: "700",
  color: "#111",
  marginBottom: "8px",
};
const statusRowStyle = { display: "flex", alignItems: "center", gap: "24px" };
const liveStatusStyle = {
  color: "#2d7a5f",
  fontSize: "0.6rem",
  fontWeight: "900",
  letterSpacing: "1px",
};
const auraHeaderBtn = (active) => ({
  background: "#1a1612",
  color: "#b5862a",
  border: "1px solid #b5862a",
  padding: "8px 16px",
  borderRadius: "8px",
  fontSize: "0.6rem",
  fontWeight: "900",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
});
const auraPulse = (active) => ({
  width: "6px",
  height: "6px",
  borderRadius: "50%",
  background: active ? "#b84040" : "#b5862a",
  boxShadow: active ? "0 0 8px #b84040" : "0 0 8px #b5862a",
});
const kpiGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "25px",
  marginBottom: "2.5rem",
};
const mainGridStyle = {
  display: "grid",
  gridTemplateColumns: "1.8fr 1.2fr",
  gap: "25px",
};
const whiteCardStyle = {
  background: "#FFF",
  border: "1px solid #EEE",
  padding: "2rem",
};
const sectionHeaderStyle = {
  fontSize: "0.65rem",
  fontWeight: "800",
  letterSpacing: "2px",
  color: "#B5862A",
  marginBottom: "2rem",
};
const auditBtnStyle = {
  width: "100%",
  background: "#111",
  color: "#FFF",
  padding: "12px",
  fontSize: "0.65rem",
  fontWeight: "800",
  borderRadius: "4px",
  marginTop: "1.5rem",
  cursor: "pointer",
};
const cardLabelStyle = {
  fontSize: "0.55rem",
  fontWeight: "800",
  color: "#999",
  letterSpacing: "1.5px",
  marginBottom: "10px",
};
const cardValueStyle = {
  fontSize: "2.4rem",
  fontFamily: "'Cormorant Garamond', serif",
  color: "#111",
  fontWeight: "300",
};
const insightBoxStyle = {
  background: "#fdfcf8",
  padding: "15px",
  borderRadius: "8px",
  border: "1px solid #f0ede4",
};
const insightTagStyle = {
  fontSize: "0.5rem",
  fontWeight: "900",
  color: "#b5862a",
  marginBottom: "5px",
};
const insightTextStyle = {
  fontSize: "0.75rem",
  fontWeight: "700",
  margin: 0,
  color: "#444",
};
const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(255,255,255,0.9)",
  zIndex: 3000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backdropFilter: "blur(10px)",
};
const modalContentStyle = {
  maxWidth: "400px",
  width: "90%",
  background: "#FFF",
  border: "1px solid #EEE",
  padding: "3rem",
  textAlign: "center",
};
const backBtnStyle = {
  flex: 1,
  padding: "10px",
  background: "#EEE",
  border: "none",
  fontWeight: "700",
  cursor: "pointer",
};
const resetBtnStyle = {
  flex: 1,
  padding: "10px",
  background: "#b84040",
  color: "#FFF",
  border: "none",
  fontWeight: "700",
  cursor: "pointer",
};
