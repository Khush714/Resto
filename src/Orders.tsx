import * as React from "react";
import { Chip } from "./App";

export const Orders = ({
  orders,
  updateOrderStatus,
  alerts,
  onDismiss,
  customers,
}) => {
  const [viewTab, setViewTab] = React.useState("active"); // 'active' or 'settled'
  const [selectedReceipt, setSelectedReceipt] = React.useState(null);

  // --- PERSISTENT FILTERING ---
  const activeOrders = orders.filter(
    (o) => o.status !== "Completed" && o.status !== "Archived"
  );

  const settledOrders = orders.filter((o) => o.status === "Completed");

  return (
    <div
      style={{
        animation: "fadeUp .3s ease",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* --- HEADER --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          borderBottom: "1px solid #eee",
          paddingBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div>
            <span
              style={{
                letterSpacing: "3px",
                fontSize: "0.6rem",
                fontWeight: "900",
                color: "#b5862a",
                textTransform: "uppercase",
              }}
            >
              Estate Service Monitor
            </span>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2.5rem",
                margin: 0,
                fontWeight: "300",
              }}
            >
              Front of House
            </h2>
          </div>

          {/* --- PREMIUM NAVIGATION TABS --- */}
          <div style={{ display: "flex", gap: "25px", marginLeft: "40px" }}>
            <button
              onClick={() => setViewTab("active")}
              style={viewTab === "active" ? activeTabStyle : inactiveTabStyle}
            >
              LIVE SERVICE ({activeOrders.length})
            </button>
            <button
              onClick={() => setViewTab("settled")}
              style={viewTab === "settled" ? activeTabStyle : inactiveTabStyle}
            >
              SETTLED RECORDS ({settledOrders.length})
            </button>
          </div>
        </div>
      </div>

      {/* --- ALERTS SECTION (Only Active) --- */}
      {viewTab === "active" && alerts && alerts.length > 0 && (
        <div style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "1rem",
            }}
          >
            <span style={{ fontSize: "1.2rem" }}>🛎️</span>
            <h3
              style={{
                margin: 0,
                fontSize: "0.75rem",
                fontWeight: "900",
                letterSpacing: "1px",
                color: "#b84040",
                textTransform: "uppercase",
              }}
            >
              Priority Assistance Required ({alerts.length})
            </h3>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "12px",
            }}
          >
            {alerts.map((alert) => (
              <div key={alert.id} style={alertCardStyle}>
                <div
                  style={{ display: "flex", gap: "15px", alignItems: "center" }}
                >
                  <div style={alertTableStyle}>{alert.table}</div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: "700",
                      color: "#7b2c2c",
                    }}
                  >
                    {alert.type}
                  </div>
                </div>
                <button
                  onClick={() => onDismiss(alert.id)}
                  style={alertBtnStyle}
                >
                  ACKNOWLEDGE
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --- ORDERS GRID --- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))",
          gap: "25px",
        }}
      >
        {(viewTab === "active" ? activeOrders : settledOrders).length > 0 ? (
          (viewTab === "active" ? activeOrders : settledOrders).map((order) => {
            const isReady = order.status === "Ready";
            const isOutForDelivery = order.status === "Out for Delivery";
            const isWA = order.orderSource === "WhatsApp";
            const clean = (num) => String(num || "").replace(/\D/g, "");
            const dossierProfile = customers?.find(
              (c) => clean(c.phone) === clean(order.phone)
            );

            const isPlatinum =
              dossierProfile?.tier === "Platinum" ||
              dossierProfile?.points >= 1000 ||
              order.vipTier === "Platinum";
            const isGold =
              !isPlatinum &&
              (dossierProfile?.tier === "Gold" ||
                dossierProfile?.points >= 500 ||
                order.vipTier === "Gold");
            const isVIP = isPlatinum || isGold;

            const platinumTheme = {
              background: "#1a1612",
              border: "1px solid #333",
              color: "#fff",
              shadow: "0 20px 40px rgba(0,0,0,0.3)",
            };
            const goldTheme = {
              background: "#fffdf5",
              border: "1px solid #e9d8a6",
              color: "#1a1612",
              shadow: "0 10px 30px rgba(181, 134, 42, 0.08)",
            };
            const standardTheme = {
              background: isReady || isOutForDelivery ? "#f0fdf4" : "#fff",
              border: `1.5px solid ${
                isReady || isOutForDelivery ? "#2d7a5f" : "#eee"
              }`,
              color: "#1a1612",
              shadow: "0 4px 12px rgba(0,0,0,0.02)",
            };

            const theme = isPlatinum
              ? platinumTheme
              : isGold
              ? goldTheme
              : standardTheme;

            return (
              <div
                key={order.id}
                style={{
                  ...theme,
                  borderRadius: "12px",
                  padding: "1.5rem",
                  transition: "0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: theme.shadow,
                  position: "relative",
                  animation:
                    isVIP && viewTab === "active"
                      ? "managerVIPPulse 3s infinite"
                      : "none",
                  opacity: viewTab === "settled" ? 0.95 : 1,
                }}
              >
                {isVIP && (
                  <div
                    style={{
                      ...vipBadgeStyle,
                      background: isPlatinum ? "#e2e8f0" : "#1a1612",
                      color: isPlatinum ? "#1a1612" : "#b5862a",
                      border: `1px solid ${isPlatinum ? "#fff" : "#b5862a"}`,
                    }}
                  >
                    ✨ {isPlatinum ? "PLATINUM" : "GOLD"} PATRON
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "1.2rem",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: "900",
                        color: isPlatinum
                          ? "#fff"
                          : isReady || isOutForDelivery
                          ? "#2d7a5f"
                          : "#1a1612",
                        fontSize: "1.2rem",
                        letterSpacing: "-0.5px",
                      }}
                    >
                      {order.table ||
                        (isWA ? order.orderType.toUpperCase() : "TAKEAWAY")}
                    </div>
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: isPlatinum ? "#999" : "#aaa",
                        marginTop: "2px",
                      }}
                    >
                      {order.customer}{" "}
                      {isVIP && dossierProfile
                        ? `• ${dossierProfile.visits} VISITS`
                        : ""}
                    </div>
                  </div>
                  <Chip
                    color={
                      order.status === "Completed"
                        ? "green"
                        : isReady || isOutForDelivery
                        ? "green"
                        : isPlatinum
                        ? "blue"
                        : "gold"
                    }
                  >
                    {order.status}
                  </Chip>
                </div>

                {/* VIP INTEL */}
                {isVIP && dossierProfile && viewTab === "active" && (
                  <div
                    style={{
                      background: isPlatinum
                        ? "rgba(255,255,255,0.05)"
                        : "#f9f6ef",
                      padding: "12px",
                      borderRadius: "8px",
                      marginBottom: "15px",
                      borderLeft: `4px solid ${
                        isPlatinum ? "#e2e8f0" : "#b5862a"
                      }`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.55rem",
                        fontWeight: "900",
                        color: isPlatinum ? "#e2e8f0" : "#b5862a",
                        letterSpacing: "1px",
                        marginBottom: "6px",
                      }}
                    >
                      VIP PROTOCOL
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: isPlatinum ? "#ccc" : "#444",
                        fontStyle: "italic",
                      }}
                    >
                      "
                      {dossierProfile.preferences ||
                        dossierProfile.notes ||
                        "Standard VIP Service"}
                      "
                    </div>
                  </div>
                )}

                {/* ITEMS SECTION */}
                <div
                  style={{
                    marginBottom: "1.5rem",
                    padding: "12px",
                    background: isPlatinum
                      ? "rgba(255,255,255,0.02)"
                      : "rgba(0,0,0,0.02)",
                    borderRadius: "8px",
                  }}
                >
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "8px",
                        opacity: item.prepared ? 1 : 0.4,
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: "600",
                          textDecoration: item.prepared
                            ? "line-through"
                            : "none",
                        }}
                      >
                        <span
                          style={{
                            color: isPlatinum ? "#e2e8f0" : "#b5862a",
                            marginRight: "10px",
                          }}
                        >
                          {item.qty}x
                        </span>
                        {item.name}
                        {item.prepared && (
                          <span
                            style={{
                              color: "#2d7a5f",
                              marginLeft: "8px",
                              textDecoration: "none",
                              display: "inline-block",
                            }}
                          >
                            ✓
                          </span>
                        )}
                      </span>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: isPlatinum ? "#888" : "#666",
                        }}
                      >
                        ₹{item.price}
                      </span>
                    </div>
                  ))}
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    borderTop: `1px solid ${isPlatinum ? "#333" : "#eee"}`,
                    paddingTop: "1rem",
                  }}
                >
                  <span
                    style={{
                      fontSize: "0.7rem",
                      color: "#999",
                      fontWeight: "600",
                    }}
                  >
                    {order.time}
                  </span>
                  <b style={{ fontSize: "1.2rem", fontWeight: "900" }}>
                    ₹{order.billing?.total}
                  </b>
                </div>

                {/* ACTIONS */}
                <div style={{ marginTop: "1.2rem" }}>
                  {viewTab === "active" ? (
                    <div style={{ display: "flex", gap: "10px" }}>
                      {isWA ? (
                        <>
                          {isReady && order.orderType === "delivery" && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "Out for Delivery")
                              }
                              style={primaryActionBtnStyle(isPlatinum)}
                            >
                              SEND FOR DELIVERY 🛵
                            </button>
                          )}
                          {(isOutForDelivery ||
                            (isReady && order.orderType === "takeaway")) && (
                            <button
                              onClick={() =>
                                updateOrderStatus(order.id, "Completed")
                              }
                              style={completeActionBtnStyle}
                            >
                              SETTLE & COMPLETE ✅
                            </button>
                          )}
                        </>
                      ) : (
                        isReady && (
                          <button
                            onClick={() =>
                              updateOrderStatus(order.id, "Completed")
                            }
                            style={primaryActionBtnStyle(isPlatinum)}
                          >
                            SETTLE & COMPLETE ✅
                          </button>
                        )
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setSelectedReceipt(order)}
                      style={receiptActionBtnStyle}
                    >
                      VIEW FINAL RECEIPT 📄
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div style={emptyStateWrapper}>
            <div style={emptyStateIcon}>
              {viewTab === "active" ? "🍽️" : "📜"}
            </div>
            <div style={emptyStateText}>
              {viewTab === "active"
                ? "No active orders in service queue."
                : "No settled records found in the database."}
            </div>
          </div>
        )}
      </div>

      {/* --- PROFESSIONAL FISCAL RECEIPT MODAL (MATH FIX APPLIED) --- */}
      {selectedReceipt && (
        <div style={receiptOverlay} onClick={() => setSelectedReceipt(null)}>
          <div style={receiptBox} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: "25px" }}>
              <h2
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "2.4rem",
                  margin: 0,
                  fontWeight: "300",
                }}
              >
                SPICE GARDEN
              </h2>
              <div
                style={{
                  fontSize: "0.65rem",
                  lineHeight: "1.5",
                  color: "#666",
                  marginTop: "5px",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                Estate Dining & Bistro
                <br />
                Plot 14, Civil Lines, Bharuch, GJ
                <br />
                <strong>GSTIN: 24AAACS1234A1Z5</strong>
                <br />
                Ph: +91 98250 12345
              </div>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "8px",
                fontSize: "0.7rem",
                margin: "20px 0",
                fontFamily: "monospace",
              }}
            >
              <div>
                <strong>INV:</strong> {selectedReceipt.id}
              </div>
              <div style={{ textAlign: "right" }}>
                <strong>DATE:</strong> {new Date().toLocaleDateString("en-IN")}
              </div>
              <div>
                <strong>TAB:</strong> {selectedReceipt.table || "TAKEAWAY"}
              </div>
              <div style={{ textAlign: "right" }}>
                <strong>TIME:</strong> {selectedReceipt.time || "N/A"}
              </div>
              <div style={{ gridColumn: "1 / span 2" }}>
                <strong>GUEST:</strong> {selectedReceipt.customer}
              </div>
            </div>

            <div
              style={{ borderBottom: "1px dashed #ccc", margin: "15px 0" }}
            />

            <table
              style={{
                width: "100%",
                fontSize: "0.75rem",
                borderCollapse: "collapse",
                fontFamily: "monospace",
              }}
            >
              <thead>
                <tr style={{ borderBottom: "1px solid #eee" }}>
                  <th style={{ textAlign: "left", paddingBottom: "8px" }}>
                    ITEM
                  </th>
                  <th style={{ textAlign: "center", paddingBottom: "8px" }}>
                    QTY
                  </th>
                  <th style={{ textAlign: "right", paddingBottom: "8px" }}>
                    RATE
                  </th>
                  <th style={{ textAlign: "right", paddingBottom: "8px" }}>
                    AMT
                  </th>
                </tr>
              </thead>
              <tbody>
                {(selectedReceipt.items || []).map((item, i) => {
                  const rate = Number(item.price || 0);
                  const qty = Number(item.qty || 0);
                  return (
                    <tr key={i}>
                      <td style={{ padding: "6px 0", verticalAlign: "top" }}>
                        {item.name}
                      </td>
                      <td style={{ padding: "6px 0", textAlign: "center" }}>
                        {qty}
                      </td>
                      <td style={{ padding: "6px 0", textAlign: "right" }}>
                        {rate.toFixed(2)}
                      </td>
                      <td style={{ padding: "6px 0", textAlign: "right" }}>
                        {(qty * rate).toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div
              style={{ borderBottom: "1px dashed #ccc", margin: "15px 0" }}
            />

            {/* DEFENSIVE CALCULATION BLOCK */}
            {(() => {
              const items = selectedReceipt.items || [];
              const subtotal = items.reduce(
                (sum, item) =>
                  sum + Number(item.price || 0) * Number(item.qty || 0),
                0
              );
              const discount = Number(selectedReceipt.billing?.discount || 0);
              const pointsRedeemed = Number(
                selectedReceipt.billing?.pointsRedeemed || 0
              );

              // Ensure math always produces valid numbers
              const taxableValue = Math.max(
                0,
                subtotal - discount - pointsRedeemed
              );
              const cgst = taxableValue * 0.025;
              const sgst = taxableValue * 0.025;
              const totalTax = cgst + sgst;
              const grandTotal = taxableValue + totalTax;

              return (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                    fontFamily: "monospace",
                  }}
                >
                  <div style={summaryRowStyle}>
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div style={summaryRowStyle}>
                      <span>Offer Discount</span>
                      <span style={{ color: "#b84040" }}>
                        -₹{discount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {pointsRedeemed > 0 && (
                    <div style={summaryRowStyle}>
                      <span>Loyalty Redeemed</span>
                      <span style={{ color: "#b84040" }}>
                        -₹{pointsRedeemed.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div
                    style={{
                      ...summaryRowStyle,
                      borderTop: "1px solid #eee",
                      paddingTop: "6px",
                      fontWeight: "bold",
                    }}
                  >
                    <span>Taxable Value</span>
                    <span>₹{taxableValue.toFixed(2)}</span>
                  </div>
                  <div style={summaryRowStyle}>
                    <span>CGST (2.5%)</span>
                    <span>₹{cgst.toFixed(2)}</span>
                  </div>
                  <div style={summaryRowStyle}>
                    <span>SGST (2.5%)</span>
                    <span>₹{sgst.toFixed(2)}</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontWeight: "900",
                      fontSize: "1.3rem",
                      color: "#1a1612",
                      marginTop: "10px",
                      borderTop: "2px solid #1a1612",
                      paddingTop: "10px",
                    }}
                  >
                    <span>TOTAL</span>
                    <span>₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              );
            })()}

            <div
              style={{
                marginTop: "25px",
                textAlign: "center",
                background: "#f9f9f9",
                padding: "12px",
                borderRadius: "4px",
                fontSize: "0.7rem",
                fontFamily: "monospace",
              }}
            >
              <div>
                Points Earned:{" "}
                <strong>
                  {Math.floor(
                    Number(selectedReceipt.billing?.total || 0) * 0.05
                  )}
                </strong>
              </div>
              <div
                style={{ fontSize: "0.6rem", color: "#999", marginTop: "4px" }}
              >
                Verified Estate Dining Record
              </div>
            </div>

            <div
              style={{
                marginTop: "40px",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              }}
              className="no-print"
            >
              <button onClick={() => window.print()} style={modalPrintBtn}>
                PRINT FISCAL INVOICE
              </button>
              <button
                onClick={() => setSelectedReceipt(null)}
                style={modalCloseBtn}
              >
                CLOSE ARCHIVE
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulseAlert { 0% { box-shadow: 0 0 0 0 rgba(184, 64, 64, 0.3); } 70% { box-shadow: 0 0 0 8px rgba(184, 64, 64, 0); } 100% { box-shadow: 0 0 0 0 rgba(184, 64, 64, 0); } }
        @keyframes managerVIPPulse { 0% { box-shadow: 0 0 0 0 rgba(181, 134, 42, 0.1); } 70% { box-shadow: 0 0 0 20px rgba(181, 134, 42, 0); } 100% { box-shadow: 0 0 0 0 rgba(181, 134, 42, 0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @media print { .no-print { display: none !important; } }
      `}</style>
    </div>
  );
};

// --- STYLES ---
const summaryRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  fontSize: "0.75rem",
};
const activeTabStyle = {
  background: "none",
  border: "none",
  fontSize: "0.75rem",
  fontWeight: "900",
  letterSpacing: "2px",
  color: "#1a1612",
  borderBottom: "2px solid #1a1612",
  padding: "12px 0",
  cursor: "pointer",
  transition: "0.3s",
};
const inactiveTabStyle = {
  background: "none",
  border: "none",
  fontSize: "0.75rem",
  fontWeight: "900",
  letterSpacing: "2px",
  color: "#ccc",
  padding: "12px 0",
  cursor: "pointer",
  transition: "0.3s",
};
const alertCardStyle = {
  background: "#fff5f5",
  border: "1px solid #feb2b2",
  borderRadius: "10px",
  padding: "10px 15px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  animation: "pulseAlert 2s infinite",
};
const alertTableStyle = {
  fontWeight: "900",
  color: "#b84040",
  fontSize: "1rem",
  minWidth: "80px",
  borderRight: "1px solid #feb2b2",
};
const alertBtnStyle = {
  background: "#b84040",
  color: "#fff",
  border: "none",
  padding: "4px 10px",
  borderRadius: "4px",
  fontWeight: "800",
  cursor: "pointer",
  fontSize: "0.65rem",
};
const vipBadgeStyle = {
  position: "absolute",
  top: "-15px",
  left: "50%",
  transform: "translateX(-50%)",
  padding: "5px 18px",
  borderRadius: "30px",
  fontSize: "0.6rem",
  fontWeight: "900",
  whiteSpace: "nowrap",
  zIndex: 10,
  boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
  letterSpacing: "1px",
};
const platinumTheme = {
  background: "#1a1612",
  border: "1px solid #333",
  color: "#fff",
  shadow: "0 20px 40px rgba(0,0,0,0.3)",
};
const goldTheme = {
  background: "#fffdf5",
  border: "1px solid #e9d8a6",
  color: "#1a1612",
  shadow: "0 10px 30px rgba(181, 134, 42, 0.08)",
};
const standardTheme = (highlight) => ({
  background: highlight ? "#f0fdf4" : "#fff",
  border: `1px solid ${highlight ? "#2d7a5f" : "#eee"}`,
  color: "#1a1612",
  shadow: "0 4px 12px rgba(0,0,0,0.02)",
});
const primaryActionBtnStyle = (isPlatinum) => ({
  width: "100%",
  padding: "15px",
  background: isPlatinum ? "#e2e8f0" : "#1a1612",
  color: isPlatinum ? "#1a1612" : "#b5862a",
  border: isPlatinum ? "1px solid #fff" : "none",
  borderRadius: "8px",
  fontWeight: "900",
  cursor: "pointer",
  fontSize: "0.75rem",
  letterSpacing: "1px",
});
const completeActionBtnStyle = {
  width: "100%",
  padding: "15px",
  background: "#2d7a5f",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontWeight: "900",
  cursor: "pointer",
  fontSize: "0.75rem",
  letterSpacing: "1px",
};
const receiptActionBtnStyle = {
  width: "100%",
  padding: "15px",
  background: "#1a1612",
  color: "#fff",
  border: "none",
  borderRadius: "8px",
  fontWeight: "900",
  cursor: "pointer",
  fontSize: "0.75rem",
  letterSpacing: "1px",
};
const emptyStateWrapper = {
  gridColumn: "1/-1",
  textAlign: "center",
  padding: "120px 0",
  opacity: 0.3,
};
const emptyStateIcon = { fontSize: "3rem", marginBottom: "20px" };
const emptyStateText = {
  fontSize: "0.9rem",
  fontWeight: "600",
  letterSpacing: "2px",
  textTransform: "uppercase",
};
const receiptOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(255,255,255,0.98)",
  backdropFilter: "blur(12px)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 5000,
};
const receiptBox = {
  background: "white",
  width: "380px",
  padding: "50px 40px",
  border: "1px solid #eee",
  boxShadow: "0 30px 60px rgba(0,0,0,0.06)",
};
const modalPrintBtn = {
  background: "#1a1612",
  color: "white",
  border: "none",
  width: "100%",
  padding: "18px",
  fontWeight: "900",
  letterSpacing: "2px",
  cursor: "pointer",
  fontSize: "0.75rem",
};
const modalCloseBtn = {
  background: "none",
  border: "none",
  width: "100%",
  marginTop: "10px",
  color: "#ccc",
  fontSize: "0.7rem",
  fontWeight: "700",
  cursor: "pointer",
  letterSpacing: "1px",
};
