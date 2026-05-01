import * as React from "react";
import { Card, Chip } from "./App";

// --- PREMIUM PALETTE DEFINITION ---
const PREMIUM_COLORS = [
  "#1a1612",
  "#b5862a",
  "#3d3d3d",
  "#8e7d5a",
  "#5e5e5e",
  "#c5a059",
];
const ALERT_RED = "#b84040";
const SUCCESS_GREEN = "#2d7a5f";
const GOLD_ACCENT = "#b5862a";

export const Analytics = ({
  orders = [],
  recipes = [],
  inventory = [],
  menu = [],
}) => {
  const [selectedDish, setSelectedDish] = React.useState(null);
  const [hoveredIng, setHoveredIng] = React.useState(null);

  // --- NEW: PRICING SIMULATION STATE ---
  const [simPrice, setSimPrice] = React.useState(0);

  // Sync simulation price when a dish is selected
  React.useEffect(() => {
    if (selectedDish) setSimPrice(selectedDish.price);
  }, [selectedDish]);

  // --- 1. DATA ENGINE: ROBUST FILTERING ---
  const processedOrders = orders.filter((o) => {
    const status = (o.status || "").toLowerCase().trim();
    return status === "completed" || status === "archived";
  });

  const totalRevenue = processedOrders.reduce(
    (sum, o) => sum + parseFloat(o.billing?.total || 0),
    0
  );

  const theoreticalUsage = {};
  const handshakeLog = [];

  // --- 2. UNIVERSAL HANDSHAKE ENGINE ---
  processedOrders.forEach((order) => {
    order.items.forEach((item) => {
      const itemID = String(item.id || item.menuId || "").trim();
      const itemName = String(item.name || "")
        .toLowerCase()
        .trim();

      const recipe = recipes.find((r) => {
        const recipeID = String(r.menuId || r.id || "").trim();
        const recipeName = String(r.name || "")
          .toLowerCase()
          .trim();
        return (
          (itemID !== "" && itemID === recipeID) ||
          (itemName !== "" && itemName === recipeName)
        );
      });

      if (recipe) {
        handshakeLog.push({ name: item.name, success: true });
        recipe.ingredients.forEach((ing) => {
          const ingID = String(ing.id).trim();
          if (!theoreticalUsage[ingID]) theoreticalUsage[ingID] = 0;
          const qtySold = parseFloat(item.qty || item.quantity || 1);
          const weightPerServing = parseFloat(ing.qty || 0);
          theoreticalUsage[ingID] += weightPerServing * qtySold;
        });
      } else {
        handshakeLog.push({ name: item.name, success: false });
      }
    });
  });

  // --- 3. VARIANCE LEAK ANALYSIS ENGINE ---
  let grandTotalLeakage = 0;
  const finalReport = inventory.map((item) => {
    const theory = theoreticalUsage[String(item.id).trim()] || 0;
    const actualMovement = Math.max(
      0,
      parseFloat(item.openingStock || 0) - parseFloat(item.currentStock || 0)
    );
    const variance = actualMovement - theory;
    const loss = variance * parseFloat(item.costPerUnit || 0);
    grandTotalLeakage += loss;
    return { ...item, theory, actualMovement, variance, loss };
  });

  // --- 4. ENHANCED: MENU PROFITABILITY ENGINE ---
  const menuPerformance = (menu || []).map((dish) => {
    const recipe = recipes.find(
      (r) =>
        String(r.menuId || "").trim() === String(dish.id || "").trim() ||
        String(r.name || "")
          .toLowerCase()
          .trim() ===
          String(dish.name || "")
            .toLowerCase()
            .trim()
    );

    const breakdown = recipe
      ? recipe.ingredients.map((ing, idx) => {
          const invItem = inventory.find(
            (i) => String(i.id).trim() === String(ing.id).trim()
          );
          const unitCost = parseFloat(invItem?.costPerUnit || 0);
          return {
            id: ing.id || idx,
            name: invItem?.name || "Unknown",
            qty: ing.qty,
            unit: invItem?.unit || "",
            cost: parseFloat(ing.qty || 0) * unitCost,
          };
        })
      : [];

    const rawCost = breakdown.reduce((sum, item) => sum + item.cost, 0);
    const profit = parseFloat(dish.price || 0) - rawCost;
    const margin = dish.price > 0 ? (profit / dish.price) * 100 : 0;

    return { ...dish, rawCost, profit, margin, breakdown };
  });

  // --- SIMULATION CALCULATIONS ---
  const simProfit = simPrice - (selectedDish?.rawCost || 0);
  const simMargin = simPrice > 0 ? (simProfit / simPrice) * 100 : 0;

  // --- 5. 3D SVG VECTOR POP-OUT LOGIC ---
  const render3DSlices = (breakdown) => {
    const total = breakdown.reduce((s, i) => s + i.cost, 0);
    let cumulativePercent = 0;

    return breakdown.map((ing, i) => {
      const percent = ing.cost / total;
      const startAngle = cumulativePercent * 2 * Math.PI;
      const endAngle = (cumulativePercent + percent) * 2 * Math.PI;
      const midAngle = (startAngle + endAngle) / 2 - Math.PI / 2;

      const isPop = hoveredIng?.id === ing.id;
      const ox = Math.cos(midAngle) * (isPop ? 15 : 0);
      const oy = Math.sin(midAngle) * (isPop ? 15 : 0);

      const x1 = Math.cos(startAngle - Math.PI / 2) * 90;
      const y1 = Math.sin(startAngle - Math.PI / 2) * 90;
      const x2 = Math.cos(endAngle - Math.PI / 2) * 90;
      const y2 = Math.sin(endAngle - Math.PI / 2) * 90;
      const pathData = `M 0 0 L ${x1} ${y1} A 90 90 0 ${
        percent > 0.5 ? 1 : 0
      } 1 ${x2} ${y2} Z`;

      cumulativePercent += percent;

      return (
        <g
          key={ing.id}
          style={{
            transform: `translate(${ox}px, ${oy}px)`,
            transition: "0.4s cubic-bezier(0.17, 0.67, 0.83, 1.2)",
          }}
        >
          <path
            d={pathData}
            fill="#000"
            transform="translate(0, 8)"
            opacity="0.25"
          />
          <path
            d={pathData}
            fill={PREMIUM_COLORS[i % PREMIUM_COLORS.length]}
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="0.5"
          />
        </g>
      );
    });
  };

  return (
    <div style={{ animation: "fadeUp .4s ease", paddingBottom: "4rem" }}>
      {/* HEADER & KPIs */}
      <div style={headerWrapper}>
        <div>
          <span style={superLabel}>Spice Garden HQ</span>
          <h2 style={titleStyle}>Operational Analytics</h2>
        </div>
        <div style={auditStatus}>
          <div
            style={{
              ...pulseDot,
              background: finalReport.some((i) => i.loss > 100)
                ? ALERT_RED
                : SUCCESS_GREEN,
            }}
          />
          <span
            style={{
              ...statusText,
              color: finalReport.some((i) => i.loss > 100)
                ? ALERT_RED
                : SUCCESS_GREEN,
            }}
          >
            {finalReport.some((i) => i.loss > 100)
              ? "LOSS ALERT ACTIVE"
              : "STOCKS OPTIMIZED"}
          </span>
        </div>
      </div>

      <div style={kpiGrid}>
        <Card style={{ borderTop: `4px solid ${GOLD_ACCENT}` }}>
          <div style={kpiLabel}>SHIFT REVENUE</div>
          <div style={kpiValue}>₹{totalRevenue.toLocaleString()}</div>
        </Card>
        <Card
          style={{
            borderTop: `4px solid ${
              grandTotalLeakage > 1 ? ALERT_RED : "#1a1612"
            }`,
          }}
        >
          <div style={kpiLabel}>TOTAL FINANCIAL LEAKAGE</div>
          <div
            style={{
              ...kpiValue,
              color: grandTotalLeakage > 1 ? ALERT_RED : "#1a1612",
            }}
          >
            ₹{grandTotalLeakage.toLocaleString()}
          </div>
        </Card>
        <Card style={{ borderTop: "4px solid #3d3d3d" }}>
          <div style={kpiLabel}>TOTAL BILLS</div>
          <div style={kpiValue}>{processedOrders.length}</div>
        </Card>
      </div>

      {/* VARIANCE LEAK ANALYSIS */}
      <Card style={{ marginBottom: "30px" }}>
        <h3 style={sectionTitle}>VARIANCE LEAK ANALYSIS</h3>
        <div style={tableContainer}>
          <table style={varianceTable}>
            <thead>
              <tr style={thRow}>
                <th style={thStyle}>INGREDIENT</th>
                <th style={thStyle}>THEORETICAL</th>
                <th style={thStyle}>ACTUAL</th>
                <th style={thStyle}>VARIANCE</th>
                <th style={{ ...thStyle, textAlign: "right" }}>LOSS VALUE</th>
              </tr>
            </thead>
            <tbody>
              {finalReport.map((item) => (
                <tr key={item.id} style={trRow}>
                  <td style={tdStyle}>
                    <strong>{item.name}</strong>
                  </td>
                  <td style={tdStyle}>
                    {item.theory.toFixed(2)} {item.unit}
                  </td>
                  <td style={tdStyle}>
                    {item.actualMovement.toFixed(2)} {item.unit}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      color: item.variance > 0.01 ? ALERT_RED : SUCCESS_GREEN,
                      fontWeight: "bold",
                    }}
                  >
                    {item.variance > 0
                      ? `+${item.variance.toFixed(2)}`
                      : item.variance.toFixed(2)}
                  </td>
                  <td
                    style={{
                      ...tdStyle,
                      textAlign: "right",
                      fontWeight: "900",
                      color: item.loss > 1 ? ALERT_RED : SUCCESS_GREEN,
                    }}
                  >
                    {item.loss > 1 ? `₹${item.loss.toLocaleString()}` : "OK"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* PROFITABILITY TABLE */}
      <Card style={{ marginBottom: "30px" }}>
        <h3 style={sectionTitle}>MENU PROFITABILITY (TAP FOR 3D BREAKDOWN)</h3>
        <div style={tableContainer}>
          <table style={varianceTable}>
            <thead>
              <tr style={thRow}>
                <th style={thStyle}>DISH</th>
                <th style={thStyle}>PRICE</th>
                <th style={thStyle}>RAW COST</th>
                <th style={{ ...thStyle, textAlign: "right" }}>MARGIN</th>
              </tr>
            </thead>
            <tbody>
              {menuPerformance.map((item) => (
                <tr
                  key={item.id}
                  style={{ ...trRow, cursor: "pointer" }}
                  onClick={() => setSelectedDish(item)}
                >
                  <td style={tdStyle}>
                    <strong>{item.name}</strong>
                  </td>
                  <td style={tdStyle}>₹{item.price}</td>
                  <td style={tdStyle}>₹{item.rawCost.toFixed(2)}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <Chip color={item.margin > 65 ? "green" : "gold"}>
                      {item.margin.toFixed(0)}%
                    </Chip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 3D POP-OUT MODAL WITH PRICING SIMULATOR */}
      {selectedDish && (
        <div style={modalOverlay} onClick={() => setSelectedDish(null)}>
          <Card style={modalContent} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "2rem",
              }}
            >
              <div>
                <h2
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    margin: 0,
                    fontSize: "2rem",
                    color: "#1a1612",
                  }}
                >
                  {selectedDish.name}
                </h2>
                <Chip color="gold">Pricing Intelligence</Chip>
              </div>
              <button onClick={() => setSelectedDish(null)} style={closeBtn}>
                ✕
              </button>
            </div>
            <div style={modalGrid}>
              <div style={chartStage}>
                <div style={perspectiveContainer}>
                  <svg
                    width="240"
                    height="240"
                    viewBox="-120 -120 240 240"
                    style={svgPerspective}
                  >
                    {render3DSlices(selectedDish.breakdown)}
                  </svg>
                  <div style={chartShadow} />
                </div>

                {/* PRICING SLIDER BOX */}
                <div style={simulatorBox}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <span style={kpiLabel}>SIMULATED PRICE</span>
                    <span style={{ fontWeight: "900", color: GOLD_ACCENT }}>
                      ₹{simPrice}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={Math.floor(selectedDish.rawCost)}
                    max={selectedDish.price * 2}
                    step="5"
                    value={simPrice}
                    onChange={(e) => setSimPrice(Number(e.target.value))}
                    style={sliderStyle}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: "15px",
                    }}
                  >
                    <div style={{ textAlign: "center", flex: 1 }}>
                      <div style={kpiLabel}>NEW MARGIN</div>
                      <div
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          color: simMargin > 70 ? SUCCESS_GREEN : GOLD_ACCENT,
                        }}
                      >
                        {simMargin.toFixed(1)}%
                      </div>
                    </div>
                    <div
                      style={{
                        width: "1px",
                        background: "#eee",
                        margin: "0 10px",
                      }}
                    />
                    <div style={{ textAlign: "center", flex: 1 }}>
                      <div style={kpiLabel}>PROFIT DELTA</div>
                      <div
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          color:
                            simPrice >= selectedDish.price
                              ? SUCCESS_GREEN
                              : ALERT_RED,
                        }}
                      >
                        {simPrice >= selectedDish.price ? "+" : ""}₹
                        {(simPrice - selectedDish.price).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h4 style={sectionTitle}>INGREDIENT COSTING</h4>
                {selectedDish.breakdown.map((ing, i) => (
                  <div
                    key={ing.id}
                    style={{
                      ...ingRow,
                      background:
                        hoveredIng?.id === ing.id ? "#fcfaf4" : "transparent",
                    }}
                    onMouseEnter={() => setHoveredIng(ing)}
                    onMouseLeave={() => setHoveredIng(null)}
                    onTouchStart={() => setHoveredIng(ing)}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <div
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: PREMIUM_COLORS[i % PREMIUM_COLORS.length],
                        }}
                      />
                      <span>
                        {ing.name}{" "}
                        <small style={{ color: "#999" }}>
                          ({ing.qty}
                          {ing.unit})
                        </small>
                      </span>
                    </div>
                    <span style={{ fontWeight: "bold" }}>
                      ₹{ing.cost.toFixed(2)}
                    </span>
                  </div>
                ))}
                <div style={profitSummary}>
                  <span style={kpiLabel}>PROJECTED UNIT PROFIT</span>
                  <span
                    style={{
                      fontSize: "1.8rem",
                      fontWeight: "bold",
                      color: SUCCESS_GREEN,
                    }}
                  >
                    ₹{simProfit.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// --- STYLES ---
const sliderStyle = {
  width: "100%",
  accentColor: GOLD_ACCENT,
  cursor: "pointer",
};
const simulatorBox = {
  marginTop: "40px",
  padding: "20px",
  background: "#fcfcfc",
  borderRadius: "15px",
  width: "100%",
  border: "1px solid #eee",
};
const headerWrapper = {
  marginBottom: "2.5rem",
  borderBottom: "1px solid #eee",
  paddingBottom: "1rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
};
const superLabel = {
  letterSpacing: "3px",
  fontSize: "0.6rem",
  fontWeight: "800",
  color: GOLD_ACCENT,
  textTransform: "uppercase",
};
const titleStyle = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "2.8rem",
  margin: "5px 0 0",
  fontWeight: "400",
};
const kpiGrid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
  gap: "25px",
  marginBottom: "3rem",
};
const kpiLabel = {
  fontSize: "0.7rem",
  color: "#999",
  fontWeight: "800",
  letterSpacing: "1px",
  textTransform: "uppercase",
};
const kpiValue = {
  fontSize: "2.2rem",
  fontWeight: "300",
  fontFamily: "'Cormorant Garamond', serif",
  marginTop: "10px",
};
const sectionTitle = {
  fontSize: "0.8rem",
  fontWeight: "900",
  letterSpacing: "2px",
  margin: "0 0 1rem 0",
  color: "#1a1612",
};
const varianceTable = { width: "100%", borderCollapse: "collapse" };
const thRow = { borderBottom: "1px solid #eee" };
const thStyle = {
  textAlign: "left",
  padding: "12px 10px",
  fontSize: "0.6rem",
  color: "#aaa",
  fontWeight: "900",
  textTransform: "uppercase",
};
const trRow = { borderBottom: "1px solid #f9f9f9" };
const tdStyle = { padding: "15px 10px", fontSize: "0.85rem" };
const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.85)",
  zIndex: 2000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  backdropFilter: "blur(10px)",
};
const modalContent = {
  maxWidth: "950px",
  width: "100%",
  background: "#fff",
  borderRadius: "25px",
  padding: "40px",
  animation: "fadeUp 0.3s ease",
};
const modalGrid = {
  display: "grid",
  gridTemplateColumns: "1.2fr 1fr",
  gap: "60px",
};
const perspectiveContainer = { perspective: "1000px", position: "relative" };
const svgPerspective = {
  transform: "rotateX(55deg) rotateZ(0deg)",
  overflow: "visible",
  filter: "drop-shadow(0 15px 5px rgba(0,0,0,0.1))",
};
const chartShadow = {
  position: "absolute",
  width: "180px",
  height: "90px",
  background: "rgba(0,0,0,0.1)",
  filter: "blur(15px)",
  borderRadius: "50%",
  bottom: "-30px",
  left: "30px",
  transform: "rotateX(55deg)",
  zIndex: -1,
};
const chartStage = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
};
const ingRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "14px 15px",
  borderRadius: "10px",
  borderBottom: "1px solid #f2f2f2",
  fontSize: "0.95rem",
  cursor: "pointer",
};
const profitSummary = {
  marginTop: "30px",
  padding: "25px",
  background: "#f6fbf9",
  borderRadius: "15px",
  display: "flex",
  flexDirection: "column",
  gap: "5px",
};
const closeBtn = {
  background: "none",
  border: "none",
  fontSize: "1.8rem",
  cursor: "pointer",
  color: "#ccc",
};
const tableContainer = { overflowX: "auto" };
const auditStatus = {
  display: "flex",
  alignItems: "center",
  gap: "8px",
  padding: "5px 12px",
  borderRadius: "20px",
  background: "#fcfcfc",
  border: "1px solid #eee",
};
const pulseDot = { width: "6px", height: "6px", borderRadius: "50%" };
const statusText = {
  fontSize: "0.55rem",
  fontWeight: "900",
  letterSpacing: "1px",
};
