import * as React from "react";
import { Card, Chip } from "./App";

export const Reservations = ({
  orders,
  setOrders,
  updateOrderStatus,
  customers = [],
  incomingStrategy,
  onStrategyComplete,
}) => {
  const tables = Array.from({ length: 12 }, (_, i) => ({
    id: `TABLE ${(i + 1).toString().padStart(2, "0")}`,
    size: i < 4 ? 2 : i < 10 ? 4 : 6,
  }));

  // --- AURA INTELLIGENT RESERVATION HANDSHAKE ---
  React.useEffect(() => {
    if (!incomingStrategy) return;

    // 1. ACTION: MAKE RESERVATION (NAME, GUESTS, TIME)
    if (incomingStrategy.type === "MAKE_RESERVATION") {
      const { time, guests, table, customer } = incomingStrategy;
      let targetTableId = "";

      if (table) {
        const num = String(table).replace(/\D/g, "");
        targetTableId = `TABLE ${num.padStart(2, "0")}`;
      } else {
        const available = tables.find((t) => {
          const isOccupied = orders.some(
            (o) =>
              String(o.table).replace(/\D/g, "") === t.id.replace(/\D/g, "") &&
              o.status === "Reserved" &&
              !o.released
          );
          return !isOccupied && t.size >= (guests || 2);
        });
        if (available) targetTableId = available.id;
      }

      const isCurrentlyReserved = orders.some(
        (o) =>
          o.table === targetTableId && o.status === "Reserved" && !o.released
      );

      if (!targetTableId || isCurrentlyReserved) {
        alert(`AURA: Table ${targetTableId || "Selection"} unavailable.`);
        onStrategyComplete();
        return;
      }

      const reservationEntry = {
        id: `RES-${Date.now()}`,
        customer: customer ? customer.trim() : "AURA Guest",
        phone: "99999 00000",
        table: targetTableId,
        guestCount: guests || 2,
        status: "Reserved",
        timestamp: Date.now(),
        reservationTime: time || "7:00 PM",
        items: [],
        billing: { total: 0 },
        released: false,
      };

      setOrders((prev) => {
        const updated = [...prev, reservationEntry];
        localStorage.setItem("spice_garden_orders", JSON.stringify(updated));
        return updated;
      });

      alert(
        `AURA: Secure. ${reservationEntry.customer} (${
          reservationEntry.guestCount
        } Pax) @ ${reservationEntry.reservationTime} on ${
          targetTableId.split(" ")[1]
        }.`
      );
      onStrategyComplete();
    }

    // 2. ACTION: CANCEL RESERVATION
    if (incomingStrategy.type === "CANCEL_RESERVATION") {
      const { customer, table } = incomingStrategy;
      setOrders((prev) => {
        const updated = prev.filter((o) => {
          const isTargetStatus = o.status === "Reserved";
          const nameMatch =
            customer &&
            o.customer.toLowerCase().includes(customer.toLowerCase());
          const tableMatch =
            table && String(o.table).includes(String(table).padStart(2, "0"));
          return !(isTargetStatus && (nameMatch || tableMatch));
        });
        localStorage.setItem("spice_garden_orders", JSON.stringify(updated));
        return updated;
      });
      onStrategyComplete();
    }

    // 3. ACTION: MODIFY RESERVATION
    if (incomingStrategy.type === "MODIFY_RESERVATION") {
      const { customer, newGuests, newTime } = incomingStrategy;
      setOrders((prev) => {
        const updated = prev.map((o) => {
          if (
            o.status === "Reserved" &&
            o.customer.toLowerCase().includes(customer.toLowerCase())
          ) {
            return {
              ...o,
              guestCount: newGuests || o.guestCount,
              reservationTime: newTime || o.reservationTime,
            };
          }
          return o;
        });
        localStorage.setItem("spice_garden_orders", JSON.stringify(updated));
        return updated;
      });
      onStrategyComplete();
    }
  }, [incomingStrategy, orders, tables, setOrders, onStrategyComplete]);

  // --- MANUAL ACTIONS ---
  const handleManualCancel = (id) => {
    if (window.confirm("Purge this reservation record?")) {
      const updated = orders.filter((o) => o.id !== id);
      setOrders(updated);
      localStorage.setItem("spice_garden_orders", JSON.stringify(updated));
    }
  };

  const handleManualEdit = (res) => {
    const newTime = prompt("Update Time (e.g. 8:30 PM):", res.reservationTime);
    const newGuests = prompt("Update Pax Count:", res.guestCount);
    if (newTime || newGuests) {
      const updated = orders.map((o) =>
        o.id === res.id
          ? {
              ...o,
              reservationTime: newTime || o.reservationTime,
              guestCount: newGuests ? parseInt(newGuests) : o.guestCount,
            }
          : o
      );
      setOrders(updated);
      localStorage.setItem("spice_garden_orders", JSON.stringify(updated));
    }
  };

  const handleTableClick = (tableId, diningOrder) => {
    if (diningOrder) return;
    const name = prompt(`Seat guest at ${tableId}? Enter Name:`);
    if (name) {
      const newOrder = {
        id: `SG-${Date.now().toString().slice(-4)}`,
        customer: name,
        table: tableId,
        status: "Preparing",
        timestamp: Date.now(),
        items: [],
        billing: { total: 0 },
        released: false,
      };
      const updated = [...orders, newOrder];
      setOrders(updated);
      localStorage.setItem("spice_garden_orders", JSON.stringify(updated));
    }
  };

  return (
    <div style={{ animation: "fadeUp .4s ease", paddingBottom: "3rem" }}>
      {/* HEADER SECTION */}
      <div style={headerSectionStyle}>
        <div>
          <span style={superLabelStyle}>Front of House</span>
          <h2 style={brandTitleStyle}>Floor Management</h2>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <div style={legendItem}>
            <div style={{ ...dot, background: "#e2e8f0" }} /> PLATINUM
          </div>
          <div style={legendItem}>
            <div style={{ ...dot, background: "#b5862a" }} /> GOLD
          </div>
          <div style={legendItem}>
            <div style={{ ...dot, background: "#3a6ea8" }} /> DINING
          </div>
          <div style={legendItem}>
            <div style={{ ...dot, background: "#f59e0b" }} /> AWAITED
          </div>
        </div>
      </div>

      <div style={gridStyle}>
        {tables.map((table) => {
          const tNum = String(table.id).replace(/\D/g, "");
          const diningOrder = [...orders]
            .reverse()
            .find(
              (o) =>
                String(o.table || "").replace(/\D/g, "") === tNum &&
                ["Preparing", "Ready", "Completed"].includes(o.status) &&
                !o.released
            );
          const reservedOrder = [...orders]
            .reverse()
            .find(
              (o) =>
                String(o.table || "").replace(/\D/g, "") === tNum &&
                o.status === "Reserved" &&
                !o.released
            );
          const mainDisplayOrder = diningOrder || reservedOrder;

          const clean = (num) => String(num || "").replace(/\D/g, "");
          const profile = customers?.find(
            (c) => clean(c.phone) === clean(mainDisplayOrder?.phone)
          );
          const isPlat =
            mainDisplayOrder &&
            (profile?.tier === "Platinum" || profile?.points >= 1000);
          const isGold =
            mainDisplayOrder &&
            !isPlat &&
            (profile?.tier === "Gold" || profile?.points >= 500);
          const duration = diningOrder
            ? Math.floor(
                (Date.now() - (diningOrder.timestamp || Date.now())) / 60000
              )
            : 0;

          let statusBg = "#f9f9f9";
          let statusLabel = "AVAILABLE";
          let labelColor = "#999";

          if (diningOrder) {
            statusBg =
              diningOrder.status === "Ready"
                ? "rgba(45, 122, 95, 0.1)"
                : "#f0fdf4";
            statusLabel = diningOrder.status.toUpperCase();
            labelColor = diningOrder.status === "Ready" ? "#2d7a5f" : "#1a1612";
          } else if (reservedOrder) {
            statusBg = "#fffcf0";
            statusLabel = `RESERVED @ ${reservedOrder.reservationTime}`;
            labelColor = "#f59e0b";
          }

          return (
            <Card
              key={table.id}
              onClick={() => handleTableClick(table.id, diningOrder)}
              style={{
                background: isPlat ? "#1a1612" : isGold ? "#FDFCF8" : statusBg,
                border: isPlat
                  ? "2px solid #e2e8f0"
                  : isGold
                  ? "2px solid #b5862a"
                  : reservedOrder && !diningOrder
                  ? "1px solid #f59e0b"
                  : "1px solid #eee",
                textAlign: "center",
                padding: "2.2rem 1rem",
                position: "relative",
                cursor: diningOrder ? "default" : "pointer",
                overflow: "hidden",
                color: isPlat ? "#fff" : "#1a1612",
              }}
            >
              {diningOrder && reservedOrder && (
                <div style={awaitedBannerStyle}>
                  ⚠️ AWAITED: {reservedOrder.customer} @{" "}
                  {reservedOrder.reservationTime}
                </div>
              )}

              {(isPlat || isGold) && (
                <div style={vipBadgeStyle(isPlat)}>
                  ✨ {isPlat ? "PLATINUM" : "GOLD"} PATRON
                </div>
              )}

              <div
                style={{
                  fontSize: "0.6rem",
                  fontWeight: "900",
                  color: isPlat ? "#999" : "#aaa",
                  marginBottom: "5px",
                }}
              >
                {table.size} SEATER{" "}
                {mainDisplayOrder?.guestCount
                  ? `• ${mainDisplayOrder.guestCount} G`
                  : ""}
              </div>

              <div
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "2.2rem",
                  lineHeight: 1,
                }}
              >
                {table.id.split(" ")[1]}
              </div>

              <div
                style={{
                  fontSize: "0.55rem",
                  fontWeight: "900",
                  marginTop: "12px",
                  color: isPlat ? "#e2e8f0" : labelColor,
                  letterSpacing: "1.5px",
                }}
              >
                {statusLabel}
              </div>

              {mainDisplayOrder && (
                <div
                  style={{
                    marginTop: "15px",
                    borderTop: "1px solid rgba(0,0,0,0.05)",
                    paddingTop: "12px",
                  }}
                >
                  <div style={{ fontSize: "0.75rem", fontWeight: "800" }}>
                    {mainDisplayOrder.customer}
                  </div>
                  <div style={{ fontSize: "0.5rem", opacity: 0.5 }}>
                    {diningOrder
                      ? `Seated: ${duration}m ago`
                      : "UPCOMING GUEST"}
                  </div>
                </div>
              )}

              {/* PREMIUM ACTION BUTTONS */}
              {!diningOrder && reservedOrder && (
                <div style={{ display: "flex", gap: "6px", marginTop: "15px" }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleManualEdit(reservedOrder);
                    }}
                    style={editBtnStyle}
                  >
                    EDIT
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleManualCancel(reservedOrder.id);
                    }}
                    style={cancelBtnStyle}
                  >
                    CANCEL
                  </button>
                </div>
              )}

              {diningOrder?.status === "Completed" && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const updated = orders.map((o) =>
                      o.id === diningOrder.id ? { ...o, released: true } : o
                    );
                    setOrders(updated);
                    localStorage.setItem(
                      "spice_garden_orders",
                      JSON.stringify(updated)
                    );
                  }}
                  style={releaseBtnStyle(isPlat, isGold)}
                >
                  RELEASE TABLE
                </button>
              )}
            </Card>
          );
        })}
      </div>

      <style>{`
        @keyframes platinumAura { 0% { box-shadow: 0 10px 30px rgba(226, 232, 240, 0.1); } 50% { box-shadow: 0 15px 40px rgba(226, 232, 240, 0.3); } 100% { box-shadow: 0 10px 30px rgba(226, 232, 240, 0.1); } }
        @keyframes goldAura { 0% { box-shadow: 0 10px 30px rgba(181, 134, 42, 0.15); } 50% { box-shadow: 0 10px 40px rgba(181, 134, 42, 0.3); } 100% { box-shadow: 0 10px 30px rgba(181, 134, 42, 0.15); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

// --- STYLES ---
const editBtnStyle = {
  flex: 1,
  padding: "6px 2px",
  background: "none",
  border: "1px solid #b5862a",
  color: "#b5862a",
  fontSize: "0.45rem",
  fontWeight: "900",
  letterSpacing: "1.5px",
  borderRadius: "2px",
  cursor: "pointer",
  textTransform: "uppercase",
  transition: "0.2s all",
};
const cancelBtnStyle = {
  flex: 1,
  padding: "6px 2px",
  background: "none",
  border: "1px solid #eee",
  color: "#aaa",
  fontSize: "0.45rem",
  fontWeight: "900",
  letterSpacing: "1.5px",
  borderRadius: "2px",
  cursor: "pointer",
  textTransform: "uppercase",
  transition: "0.2s all",
};
const awaitedBannerStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  right: 0,
  background: "#f59e0b",
  color: "#fff",
  fontSize: "0.55rem",
  fontWeight: "900",
  padding: "5px",
  textAlign: "center",
  letterSpacing: "0.5px",
  zIndex: 10,
};
const headerSectionStyle = {
  marginBottom: "2.5rem",
  borderBottom: "1px solid #eee",
  paddingBottom: "1rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
};
const superLabelStyle = {
  letterSpacing: "3px",
  fontSize: "0.6rem",
  fontWeight: "800",
  color: "#b5862a",
  textTransform: "uppercase",
};
const brandTitleStyle = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "2.8rem",
  margin: "5px 0 0",
  fontWeight: "400",
};
const legendItem = {
  display: "flex",
  alignItems: "center",
  gap: "5px",
  fontSize: "0.6rem",
  fontWeight: "800",
};
const dot = {
  width: "8px",
  height: "8px",
  borderRadius: "50%",
  background: "#eee",
};
const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: "20px",
};
const vipBadgeStyle = (isPlat) => ({
  position: "absolute",
  top: "-10px",
  left: "50%",
  transform: "translateX(-50%)",
  background: isPlat ? "#e2e8f0" : "#1a1612",
  color: isPlat ? "#1a1612" : "#b5862a",
  padding: "3px 12px",
  borderRadius: "20px",
  fontSize: "0.5rem",
  fontWeight: "900",
  border: `1px solid ${isPlat ? "#fff" : "#b5862a"}`,
  letterSpacing: "1px",
  zIndex: 5,
  whiteSpace: "nowrap",
});
const releaseBtnStyle = (p, g) => ({
  marginTop: "18px",
  width: "100%",
  padding: "10px",
  background: p ? "#e2e8f0" : g ? "#1a1612" : "#3a6ea8",
  color: p ? "#1a1612" : g ? "#b5862a" : "#fff",
  border: "none",
  borderRadius: "6px",
  fontSize: "0.6rem",
  fontWeight: "900",
  cursor: "pointer",
});
