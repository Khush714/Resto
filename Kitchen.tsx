import * as React from "react";

export const Kitchen = ({
  orders,
  menu,
  customers, // Linked from Guest Dossier
  onToggleAvailability,
  updateOrderStatus,
  onToggleItem,
}) => {
  const [view, setView] = React.useState("KDS");
  const [now, setNow] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const activeOrders = orders.filter(
    (o) => o.status === "Preparing" || o.status === "Ready"
  );

  // --- SMART PACE LOGIC ---
  const pendingKOTs = activeOrders.filter(
    (o) => o.status === "Preparing"
  ).length;
  const isBusy = pendingKOTs > 4;
  const estWait = 10 + pendingKOTs * 2;

  // --- CUMULATIVE BATCHING LOGIC ---
  const batchTotals = activeOrders.reduce((acc, order) => {
    if (order.status === "Preparing") {
      order.items.forEach((item) => {
        if (!item.prepared) {
          acc[item.name] = (acc[item.name] || 0) + Number(item.qty);
        }
      });
    }
    return acc;
  }, {});

  const batchItems = Object.entries(batchTotals);

  return (
    <div
      style={{
        background: "#0a0a0a",
        minHeight: "92vh",
        padding: "1.5rem",
        color: "#fff",
        animation: "fadeUp .4s ease",
      }}
    >
      {/* 1. TOP COMMAND BAR */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          borderBottom: "1px solid #222",
          paddingBottom: "1rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "25px" }}>
          <div>
            <span
              style={{
                letterSpacing: "3px",
                fontSize: "0.6rem",
                color: "#b5862a",
                fontWeight: "800",
              }}
            >
              EXECUTIVE PASS
            </span>
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2.4rem",
                margin: 0,
              }}
            >
              {view === "KDS" ? "Production Line" : "Inventory Control"}
            </h2>
          </div>
          <div
            style={{
              display: "flex",
              background: "#1a1a1a",
              padding: "4px",
              borderRadius: "10px",
              gap: "5px",
            }}
          >
            <button
              onClick={() => setView("KDS")}
              style={{
                background: view === "KDS" ? "#b5862a" : "transparent",
                color: view === "KDS" ? "#000" : "#666",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "0.7rem",
                fontWeight: "900",
                cursor: "pointer",
              }}
            >
              LIVE KOTs
            </button>
            <button
              onClick={() => setView("INVENTORY")}
              style={{
                background: view === "INVENTORY" ? "#b84040" : "transparent",
                color: view === "INVENTORY" ? "#fff" : "#666",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                fontSize: "0.7rem",
                fontWeight: "900",
                cursor: "pointer",
              }}
            >
              86 LIST
            </button>
          </div>
        </div>

        {view === "KDS" && (
          <div style={{ display: "flex", alignItems: "center", gap: "30px" }}>
            <div
              style={{
                textAlign: "right",
                borderRight: "1px solid #333",
                paddingRight: "30px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  justifyContent: "flex-end",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: isBusy ? "#f59e0b" : "#10b981",
                    animation: isBusy ? "pulse 2s infinite" : "none",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.65rem",
                    fontWeight: "900",
                    color: isBusy ? "#f59e0b" : "#10b981",
                  }}
                >
                  SYSTEM PACE: {isBusy ? "BUSY" : "OPTIMAL"}
                </span>
              </div>
              <div style={{ fontSize: "0.55rem", opacity: 0.5 }}>
                GUESTS SEEING {estWait}m WAIT
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: "1.5rem",
                  color: "#b5862a",
                  fontWeight: "700",
                }}
              >
                {activeOrders.length}
              </div>
              <div style={{ fontSize: "0.5rem", opacity: 0.5 }}>
                ACTIVE TICKETS
              </div>
            </div>
          </div>
        )}
      </div>

      {view === "KDS" ? (
        <>
          {/* BATCH PRODUCTION SUMMARY */}
          {batchItems.length > 0 && (
            <div
              style={{
                marginBottom: "2.5rem",
                background: "rgba(181, 134, 42, 0.05)",
                border: "1px solid #b5862a",
                borderRadius: "12px",
                padding: "1.5rem",
              }}
            >
              <h3
                style={{
                  margin: "0 0 1.2rem",
                  fontSize: "0.75rem",
                  fontWeight: "900",
                  letterSpacing: "2px",
                  color: "#b5862a",
                  textTransform: "uppercase",
                }}
              >
                🔥 Live Batch Summary
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                {batchItems.map(([name, qty]) => (
                  <div
                    key={name}
                    style={{
                      background: "#1a1612",
                      border: "1.5px solid #b5862a",
                      borderRadius: "8px",
                      padding: "12px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "15px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "1.8rem",
                        fontWeight: "900",
                        color: "#b5862a",
                      }}
                    >
                      {qty}
                    </span>
                    <span
                      style={{
                        fontSize: "0.9rem",
                        fontWeight: "800",
                        color: "#fff",
                      }}
                    >
                      {name.toUpperCase()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
              gap: "20px",
            }}
          >
            {activeOrders.map((order) => {
              const elapsedMins = Math.floor(
                (now - new Date(order.timestamp || Date.now())) / 60000
              );

              const guest = customers?.find(
                (c) =>
                  c.phone?.replace(/\D/g, "") ===
                  order.phone?.replace(/\D/g, "")
              );

              // --- ENHANCED TIER LOGIC ---
              const isPlatinum =
                guest && (guest.points >= 1000 || guest.tier === "Platinum");
              const isGold =
                guest &&
                ((guest.points >= 500 && guest.points < 1000) ||
                  guest.tier === "Gold");
              const isAnyVIP = isPlatinum || isGold;

              let currentAnimation = "none";
              let borderStyle = isPlatinum
                ? "3px solid #e2e8f0"
                : isGold
                ? "3px solid #b5862a"
                : "1.5px solid #2a2a2a";
              let timerColor = isPlatinum
                ? "#e2e8f0"
                : isGold
                ? "#b5862a"
                : "#fff";

              if (order.status !== "Ready") {
                if (elapsedMins >= 12) {
                  borderStyle = "2px solid #ff4d4d";
                  currentAnimation = "blinkRed 1s infinite";
                  timerColor = "#ff4d4d";
                } else if (elapsedMins >= 8) {
                  borderStyle = isAnyVIP ? borderStyle : "2px solid #ffd700";
                  currentAnimation = "blinkYellow 2s infinite";
                  timerColor = "#ffd700";
                } else if (isAnyVIP) {
                  currentAnimation = isPlatinum
                    ? "pulseSilver 2s infinite"
                    : "pulseGold 2s infinite";
                }
              }

              const allChecked = order.items.every((i) => i.prepared);
              const isReady = order.status === "Ready";

              return (
                <div
                  key={order.id}
                  style={{
                    background: isAnyVIP ? "#141210" : "#141414",
                    border: borderStyle,
                    borderRadius: "12px",
                    overflow: "hidden",
                    animation: isReady ? "none" : currentAnimation,
                    boxShadow: isPlatinum
                      ? "0 15px 40px rgba(226, 232, 240, 0.2)"
                      : isGold
                      ? "0 15px 40px rgba(181, 134, 42, 0.3)"
                      : "none",
                    transform: isAnyVIP ? "scale(1.02)" : "none",
                    zIndex: isAnyVIP ? 10 : 1,
                  }}
                >
                  {isAnyVIP && (
                    <div
                      style={{
                        background: isPlatinum ? "#e2e8f0" : "#b5862a",
                        color: "#000",
                        textAlign: "center",
                        padding: "6px",
                        fontSize: "0.6rem",
                        fontWeight: "900",
                        letterSpacing: "2px",
                      }}
                    >
                      ✨ {isPlatinum ? "PLATINUM" : "GOLD"} PATRON SERVICE
                    </div>
                  )}

                  <div
                    style={{
                      padding: "0.8rem 1rem",
                      background: isReady
                        ? "#1a2a24"
                        : isPlatinum
                        ? "#1f2226"
                        : isGold
                        ? "#24211a"
                        : "#1f1f1f",
                      display: "flex",
                      justifyContent: "space-between",
                      borderBottom: isAnyVIP
                        ? `1px solid ${isPlatinum ? "#333b45" : "#332d21"}`
                        : "none",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "0.9rem",
                          fontWeight: "900",
                          color: isReady
                            ? "#4ade80"
                            : isPlatinum
                            ? "#fff"
                            : "#b5862a",
                        }}
                      >
                        {order.table || "TAKEAWAY"}
                      </div>
                      <div
                        style={{
                          fontSize: "0.6rem",
                          color: isAnyVIP ? "#999" : "#555",
                        }}
                      >
                        {order.customer}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: "1.1rem",
                          fontWeight: "900",
                          color: timerColor,
                        }}
                      >
                        {elapsedMins}m
                      </div>
                      <div style={{ fontSize: "0.5rem", opacity: 0.5 }}>
                        WAIT TIME
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: "1.2rem", flexGrow: 1 }}>
                    {/* VIP PREP BRIEFING */}
                    {isAnyVIP &&
                      (guest.dietary ||
                        guest.preferences ||
                        guest.water ||
                        guest.notes) && (
                        <div
                          style={{
                            marginBottom: "15px",
                            background: isPlatinum
                              ? "rgba(226, 232, 240, 0.05)"
                              : "rgba(181,134,42,0.08)",
                            padding: "10px",
                            borderRadius: "6px",
                            borderLeft: `3px solid ${
                              isPlatinum ? "#e2e8f0" : "#b5862a"
                            }`,
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: "5px",
                              marginBottom: "6px",
                            }}
                          >
                            {guest.dietary && (
                              <span
                                style={{
                                  background: "#b84040",
                                  color: "#fff",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  fontSize: "0.55rem",
                                  fontWeight: "900",
                                }}
                              >
                                ⚠️ {guest.dietary.toUpperCase()}
                              </span>
                            )}
                            {guest.water && (
                              <span
                                style={{
                                  background: isPlatinum ? "#334155" : "#444",
                                  color: "#fff",
                                  padding: "2px 6px",
                                  borderRadius: "4px",
                                  fontSize: "0.55rem",
                                  fontWeight: "900",
                                }}
                              >
                                💧 {guest.water.toUpperCase()}
                              </span>
                            )}
                          </div>
                          {(guest.preferences || guest.notes) && (
                            <div
                              style={{
                                color: "#eee",
                                fontSize: "0.7rem",
                                fontStyle: "italic",
                                lineHeight: "1.4",
                              }}
                            >
                              <b>CHEF'S BRIEF:</b>
                              <br />"{guest.preferences || guest.notes}"
                            </div>
                          )}
                        </div>
                      )}

                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => onToggleItem(order.id, idx)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "12px",
                          marginBottom: "12px",
                          cursor: "pointer",
                          opacity: item.prepared ? 0.3 : 1,
                        }}
                      >
                        <div
                          style={{
                            width: "20px",
                            height: "20px",
                            border: `2px solid ${
                              isPlatinum
                                ? "#e2e8f0"
                                : isGold
                                ? "#b5862a"
                                : "#444"
                            }`,
                            borderRadius: "4px",
                            background: item.prepared
                              ? isPlatinum
                                ? "#e2e8f0"
                                : "#b5862a"
                              : "transparent",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {item.prepared && (
                            <span
                              style={{
                                color: "#000",
                                fontSize: "12px",
                                fontWeight: "900",
                              }}
                            >
                              ✓
                            </span>
                          )}
                        </div>
                        <span
                          style={{
                            fontSize: "1.1rem",
                            textDecoration: item.prepared
                              ? "line-through"
                              : "none",
                            color: "#eee",
                          }}
                        >
                          <b
                            style={{
                              color: isPlatinum ? "#e2e8f0" : "#b5862a",
                              marginRight: "8px",
                            }}
                          >
                            {item.qty}x
                          </b>{" "}
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div style={{ padding: "0.8rem", background: "#0f0f0f" }}>
                    {!isReady ? (
                      <button
                        onClick={() => updateOrderStatus(order.id, "Ready")}
                        disabled={!allChecked}
                        style={{
                          width: "100%",
                          padding: "14px",
                          borderRadius: "4px",
                          border: "none",
                          fontWeight: "900",
                          background: allChecked
                            ? isPlatinum
                              ? "#e2e8f0"
                              : "#b5862a"
                            : "#222",
                          color: allChecked ? "#000" : "#666",
                          cursor: allChecked ? "pointer" : "not-allowed",
                        }}
                      >
                        MARK READY
                      </button>
                    ) : (
                      <div
                        style={{
                          textAlign: "center",
                          color: "#4ade80",
                          fontWeight: "900",
                          fontSize: "0.7rem",
                          padding: "10px",
                        }}
                      >
                        ✓ SENT TO PASS
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* --- INVENTORY CONTROL --- */
        <div
          style={{
            background: "#111",
            padding: "2rem",
            borderRadius: "15px",
            border: "1px solid #222",
            animation: "fadeUp .4s ease",
          }}
        >
          <div style={{ marginBottom: "2.5rem" }}>
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: "800",
                color: "#b84040",
                letterSpacing: "1px",
              }}
            >
              86 LIST: STOCK CONTROL
            </h3>
            <p style={{ color: "#666", fontSize: "0.8rem" }}>
              Switch items to red to immediately 86 them from all active menus.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "15px",
            }}
          >
            {menu.map((item) => (
              <div
                key={item.id}
                onClick={() => onToggleAvailability(item.id)}
                style={{
                  padding: "1.5rem",
                  borderRadius: "12px",
                  cursor: "pointer",
                  transition: "0.3s all",
                  background: item.available
                    ? "#1a1a1a"
                    : "rgba(184, 64, 64, 0.05)",
                  border: `1px solid ${item.available ? "#333" : "#b84040"}`,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div>
                  <span
                    style={{
                      fontWeight: "700",
                      fontSize: "1.1rem",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    {item.name}
                  </span>
                  <span
                    style={{
                      fontSize: "0.6rem",
                      color: item.available ? "#10b981" : "#ff4d4d",
                      fontWeight: "900",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.available ? "● In Stock" : "○ 86'd (Sold Out)"}
                  </span>
                </div>

                <div
                  style={{
                    width: "50px",
                    height: "26px",
                    background: item.available ? "#10b981" : "#b84040",
                    borderRadius: "20px",
                    padding: "3px",
                    position: "relative",
                    transition: "0.3s",
                    boxShadow: item.available
                      ? "0 0 10px rgba(16, 185, 129, 0.2)"
                      : "0 0 10px rgba(184, 64, 64, 0.2)",
                  }}
                >
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      background: "#fff",
                      borderRadius: "50%",
                      position: "absolute",
                      right: item.available ? "3px" : "27px",
                      transition: "0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
                      boxShadow: "0 2px 5px rgba(0,0,0,0.4)",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style>{`
        @keyframes blinkYellow { 0% { border-color: #7a5c12; } 50% { border-color: #ffd700; } 100% { border-color: #7a5c12; } }
        @keyframes blinkRed { 0% { border-color: #b84040; } 50% { border-color: #ff0000; } 100% { border-color: #b84040; } }
        @keyframes pulseGold { 0% { box-shadow: 0 0 0px rgba(181, 134, 42, 0); } 50% { box-shadow: 0 0 15px rgba(181, 134, 42, 0.4); } 100% { box-shadow: 0 0 0px rgba(181, 134, 42, 0); } }
        @keyframes pulseSilver { 0% { box-shadow: 0 0 0px rgba(226, 232, 240, 0); } 50% { box-shadow: 0 0 15px rgba(226, 232, 240, 0.4); } 100% { box-shadow: 0 0 0px rgba(226, 232, 240, 0); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.5; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
};
