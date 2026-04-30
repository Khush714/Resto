import * as React from "react";
import { DietIcon, CATEGORIES } from "./App";

// SIMULATED QR CONTEXT: Change this value to simulate scanning a different table QR
const CURRENT_TABLE = "TABLE 05";

export const CustomerMenu = ({
  menu,
  onCallServer,
  onPlaceOrder,
  customers,
  activeOrders = [], // Added for Option 3
}) => {
  const [orderType, setOrderType] = React.useState("dine-in");
  const [cart, setCart] = React.useState({});
  const [showCheckout, setShowCheckout] = React.useState(false);
  const [serverCalled, setServerCalled] = React.useState(false);

  // New: Session Tracking for the live progress bar
  const [placedOrderID, setPlacedOrderID] = React.useState(null);

  // Simulated Payment State
  const [isProcessing, setIsProcessing] = React.useState(false);

  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    email: "",
    paymentMethod: "upi",
  });
  const [pointsToUse, setPointsToUse] = React.useState(0);
  const [userBalance, setUserBalance] = React.useState(0);
  const [matchedID, setMatchedID] = React.useState(null);

  // NEW: VIP Recognition State
  const [vipData, setVipData] = React.useState(null);

  // --- OPTION 3: SMART CALCULATION ---
  const pendingKOTs = activeOrders.filter(
    (o) => o.status === "Preparing"
  ).length;
  const isBusy = pendingKOTs > 4;
  const estWait = 10 + pendingKOTs * 2;
  const currentLiveOrder = activeOrders.find((o) => o.id === placedOrderID);

  // --- FIXED VIP HANDSHAKE EFFECT (With Guard Clauses) ---
  React.useEffect(() => {
    const phoneInput = formData.phone.trim();
    const nameInput = formData.name.trim().toLowerCase();

    // GUARD: Only attempt recognition if phone is at least 10 digits and name is present
    if (phoneInput.length < 10 || !nameInput) {
      setVipData(null);
      return;
    }

    const rawCRM = localStorage.getItem("spice_garden_crm");
    const dossier = JSON.parse(rawCRM || "[]");
    const normalize = (val) => String(val || "").replace(/\D/g, "");
    const normalizedInput = normalize(phoneInput);

    const vipMatch = dossier.find(
      (g) =>
        normalize(g.phone) === normalizedInput &&
        g.name.toLowerCase() === nameInput
    );

    setVipData(vipMatch || null);
  }, [formData.phone, formData.name]);

  React.useEffect(() => {
    const match = customers.find(
      (c) =>
        formData.name &&
        formData.phone &&
        c.name.toLowerCase() === formData.name.toLowerCase() &&
        c.phone === formData.phone
    );
    if (match) {
      setUserBalance(match.points);
      setMatchedID(match.id);
    } else {
      setUserBalance(0);
      setMatchedID(null);
      setPointsToUse(0);
    }
  }, [formData.name, formData.phone, customers]);

  const subtotal = menu.reduce((s, i) => s + i.price * (cart[i.id] || 0), 0);
  const discount = Math.min(pointsToUse, subtotal);
  const taxable = subtotal - discount;
  const gst = taxable * 0.05;
  const total = taxable + gst;

  const handleQtyChange = (id, delta) => {
    setCart((prev) => {
      const q = (prev[id] || 0) + delta;
      if (q <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: q };
    });
  };

  const handleFinalSubmit = () => {
    if (!formData.name.trim() || !formData.phone.trim())
      return alert("Required: Name & Phone");

    setIsProcessing(true);
    const newID = "ORD-" + Math.floor(Math.random() * 1000);

    setTimeout(() => {
      onPlaceOrder({
        id: newID,
        table: orderType === "dine-in" ? CURRENT_TABLE : "TAKEAWAY",
        customer: formData.name,
        phone: formData.phone,
        email: formData.email,
        items: menu
          .filter((i) => cart[i.id])
          .map((i) => ({
            name: i.name,
            qty: cart[i.id],
            price: i.price,
            prepared: false, // Ensure prepared state is passed for the progress bar
          })),
        billing: {
          total: total.toFixed(2),
          subtotal: subtotal.toFixed(2),
          gst: gst.toFixed(2),
          discount: discount.toFixed(2),
        },
        paymentStatus: "PAID",
        paymentMethod: formData.paymentMethod,
        time: new Date().toLocaleTimeString(),
      });

      setPlacedOrderID(newID); // Track the order ID for the status bar
      setCart({});
      setIsProcessing(false);
      setShowCheckout(false);
    }, 2500);
  };

  return (
    <div
      style={{
        maxWidth: "450px",
        margin: "0 auto",
        background: "#fff",
        minHeight: "100vh",
        position: "relative",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* OPTION 3: LIVE TRACKING BAR (Sticky at Top) */}
      {currentLiveOrder && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            background: "#1a1612",
            color: "#fff",
            zIndex: 1000,
            padding: "1rem 1.5rem",
            borderRadius: "0 0 20px 20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
            animation: "slideDown 0.4s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "0.55rem",
                  color: "#b5862a",
                  fontWeight: "900",
                  letterSpacing: "1px",
                }}
              >
                LIVE ORDER TRACKER
              </span>
              <div style={{ fontSize: "0.95rem", fontWeight: "700" }}>
                {currentLiveOrder.status === "Ready"
                  ? "✅ ORDER IS READY!"
                  : "🔥 KITCHEN IS COOKING"}
              </div>
            </div>
            <button
              onClick={() => setPlacedOrderID(null)}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: "1.2rem",
              }}
            >
              ×
            </button>
          </div>

          <div
            style={{
              background: "#333",
              height: "6px",
              borderRadius: "3px",
              overflow: "hidden",
              marginBottom: "6px",
            }}
          >
            <div
              style={{
                width:
                  currentLiveOrder.status === "Ready"
                    ? "100%"
                    : currentLiveOrder.items.some((i) => i.prepared)
                    ? "65%"
                    : "25%",
                height: "100%",
                background: "#b5862a",
                transition: "1.5s all ease",
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: "0.55rem",
              color: "#888",
              fontWeight: "800",
            }}
          >
            <span style={{ color: "#fff" }}>RECEIVED</span>
            <span
              style={{
                color: currentLiveOrder.items.some((i) => i.prepared)
                  ? "#b5862a"
                  : "#888",
              }}
            >
              PREPARING
            </span>
            <span
              style={{
                color: currentLiveOrder.status === "Ready" ? "#b5862a" : "#888",
              }}
            >
              READY
            </span>
          </div>
        </div>
      )}

      {isProcessing && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(255,255,255,0.95)",
            zIndex: 2000,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div
            className="payment-spinner"
            style={{
              width: "50px",
              height: "50px",
              border: "3px solid #eee",
              borderTop: "3px solid #b5862a",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
            }}
          />
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.5rem",
              marginTop: "2rem",
              fontWeight: "400",
              letterSpacing: "1px",
            }}
          >
            Securing Transaction
          </h2>
          <p
            style={{
              fontSize: "0.7rem",
              color: "#999",
              letterSpacing: "2px",
              textTransform: "uppercase",
            }}
          >
            Please do not refresh or close this window
          </p>
        </div>
      )}

      {/* HEADER */}
      <div
        style={{
          padding: "2rem 1.5rem",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "1.5rem",
          }}
        >
          <div>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2rem",
                margin: 0,
              }}
            >
              Spice Garden
            </h1>

            {/* OPTION 3: PACE INDICATOR */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                marginTop: "5px",
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
                  fontWeight: "800",
                  color: isBusy ? "#b5862a" : "#2d7a5f",
                }}
              >
                KITCHEN {isBusy ? "BUSY" : "NORMAL"} • ~{estWait} MINS
              </span>
            </div>

            <span
              style={{
                fontSize: "0.55rem",
                color: "#999",
                fontWeight: "700",
                letterSpacing: "1px",
                display: "block",
                marginTop: "4px",
              }}
            >
              {orderType === "dine-in"
                ? `SCANNER ACTIVE: ${CURRENT_TABLE}`
                : "MODE: TAKEAWAY"}
            </span>
          </div>
          <button
            onClick={() => {
              setServerCalled(true);
              onCallServer(CURRENT_TABLE);
            }}
            disabled={serverCalled}
            style={{
              background: serverCalled ? "#2d7a5f" : "white",
              color: serverCalled ? "white" : "#1a1612",
              border: "1.5px solid #1a1612",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "0.6rem",
              fontWeight: "900",
              transition: "0.3s",
            }}
          >
            {serverCalled ? "✓ REQUEST SENT" : "CALL SERVER"}
          </button>
        </div>
        <div
          style={{
            display: "flex",
            background: "#f2f2f2",
            padding: "4px",
            borderRadius: "14px",
          }}
        >
          {["Dine-In", "Takeaway"].map((t) => (
            <button
              key={t}
              onClick={() => setOrderType(t.toLowerCase())}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                fontSize: "0.8rem",
                fontWeight: "700",
                background:
                  orderType === t.toLowerCase() ? "white" : "transparent",
                color: orderType === t.toLowerCase() ? "#1a1612" : "#888",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* CATEGORIZED MENU */}
      <div style={{ padding: "0 1.5rem 150px" }}>
        {CATEGORIES.map((cat) => {
          const items = menu.filter((i) => i.category === cat);
          if (items.length === 0) return null;
          return (
            <div key={cat} style={{ marginBottom: "2.5rem" }}>
              <h3
                style={{
                  fontSize: "1.1rem",
                  fontWeight: "800",
                  color: "#b5862a",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  marginBottom: "1.5rem",
                  borderBottom: "2px solid #b5862a",
                  display: "inline-block",
                  paddingRight: "15px",
                }}
              >
                {cat}
              </h3>
              {items.map((item) => {
                const qty = cart[item.id] || 0;
                const isSoldOut = item.available === false;

                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start", // Changed to flex-start for multi-line description
                      marginBottom: "1.8rem",
                      opacity: isSoldOut ? 0.5 : 1,
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                        }}
                      >
                        <DietIcon isVeg={item.isVeg} />
                        <span
                          style={{
                            fontSize: "1.05rem",
                            fontWeight: "600",
                            textDecoration: isSoldOut ? "line-through" : "none",
                          }}
                        >
                          {item.name}
                        </span>
                      </div>

                      {/* AI-Generated Luxury Copy Integration */}
                      {item.description && (
                        <p
                          style={{
                            margin: "4px 0 0",
                            fontSize: "0.75rem",
                            color: "#888",
                            fontStyle: "italic",
                            lineHeight: "1.4",
                            fontFamily: "'Cormorant Garamond', serif",
                            maxWidth: "85%",
                          }}
                        >
                          {item.description}
                        </p>
                      )}

                      <span
                        style={{
                          fontSize: "0.85rem",
                          color: "#999",
                          display: "block",
                          marginTop: "4px",
                        }}
                      >
                        ₹{item.price}
                      </span>
                    </div>

                    {isSoldOut ? (
                      <span
                        style={{
                          color: "#b84040",
                          fontWeight: "900",
                          fontSize: "0.7rem",
                          letterSpacing: "1px",
                          padding: "8px 0",
                        }}
                      >
                        SOLD OUT
                      </span>
                    ) : qty === 0 ? (
                      <button
                        onClick={() => handleQtyChange(item.id, 1)}
                        style={{
                          background: "white",
                          color: "#1a1612",
                          border: "1.5px solid #1a1612",
                          width: "85px",
                          height: "34px",
                          borderRadius: "8px",
                          fontWeight: "800",
                          fontSize: "0.7rem",
                        }}
                      >
                        ADD
                      </button>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          background: "#1a1612",
                          color: "white",
                          width: "85px",
                          height: "34px",
                          borderRadius: "8px",
                        }}
                      >
                        <button
                          onClick={() => handleQtyChange(item.id, -1)}
                          style={{
                            flex: 1,
                            border: "none",
                            background: "none",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          -
                        </button>
                        <span
                          style={{
                            flex: 1,
                            textAlign: "center",
                            fontWeight: "800",
                          }}
                        >
                          {qty}
                        </span>
                        <button
                          onClick={() => handleQtyChange(item.id, 1)}
                          style={{
                            flex: 1,
                            border: "none",
                            background: "none",
                            color: "white",
                            fontWeight: "bold",
                          }}
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* FOOTER BAR */}
      {subtotal > 0 && !placedOrderID && (
        <div
          style={{
            position: "fixed",
            bottom: "30px",
            left: "20px",
            right: "20px",
            background: "#1a1612",
            color: "white",
            padding: "1.2rem",
            borderRadius: "20px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 15px 35px rgba(0,0,0,0.3)",
            zIndex: 100,
          }}
        >
          <div>
            <div style={{ fontSize: "0.6rem", opacity: 0.6 }}>SUBTOTAL</div>
            <div style={{ fontSize: "1.2rem", fontWeight: "800" }}>
              ₹{subtotal.toFixed(2)}
            </div>
          </div>
          <button
            onClick={() => setShowCheckout(true)}
            style={{
              background: "#b5862a",
              color: "white",
              border: "none",
              padding: "12px 25px",
              borderRadius: "12px",
              fontWeight: "800",
            }}
          >
            Review Order →
          </button>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {showCheckout && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(255,255,255,0.98)",
            zIndex: 1000,
            display: "flex",
            flexDirection: "column",
            padding: "2rem 1.5rem",
            overflowY: "auto",
          }}
        >
          <button
            onClick={() => setShowCheckout(false)}
            style={{
              background: "none",
              border: "none",
              fontSize: "2rem",
              textAlign: "left",
              marginBottom: "1rem",
            }}
          >
            ×
          </button>

          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.2rem",
              marginBottom: "1.5rem",
            }}
          >
            Order Details
          </h2>

          {/* RED CARPET BANNER (Only shows when Name & 10-digit Phone Match Dossier) */}
          {vipData && (
            <div
              style={{
                background: "linear-gradient(135deg, #1a1612 0%, #b5862a 100%)",
                padding: "20px",
                borderRadius: "15px",
                marginBottom: "20px",
                color: "#fff",
                animation: "slideDown 0.5s ease",
                boxShadow: "0 10px 20px rgba(181, 134, 42, 0.3)",
                textAlign: "center",
                border: "1px solid rgba(255,255,255,0.2)",
              }}
            >
              <div
                style={{
                  fontSize: "0.6rem",
                  letterSpacing: "2px",
                  fontWeight: "900",
                }}
              >
                ESTATE RECOGNITION
              </div>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.6rem",
                  margin: "5px 0",
                }}
              >
                Welcome Back, {vipData.name}
              </h3>
              <div style={{ fontSize: "0.7rem", opacity: 0.9 }}>
                {vipData.tier.toUpperCase()} STATUS ACTIVE • YOUR PREFERENCES
                SYNCED
              </div>
            </div>
          )}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              marginBottom: "2rem",
            }}
          >
            <input
              placeholder="Full Name*"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              style={{
                border: "none",
                borderBottom: "1.5px solid #eee",
                padding: "10px 0",
                fontSize: "1rem",
                outline: "none",
              }}
            />
            <input
              placeholder="Mobile Number*"
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              style={{
                border: "none",
                borderBottom: "1.5px solid #eee",
                padding: "10px 0",
                fontSize: "1rem",
                outline: "none",
              }}
            />
          </div>

          {/* Loyalty Section */}
          <div
            style={{
              background: "#f0f7ff",
              padding: "1rem",
              borderRadius: "14px",
              marginBottom: "1.5rem",
              border: "1px solid #d0e3ff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: "800",
                    color: "#0056b3",
                    display: "block",
                  }}
                >
                  {matchedID ? "MEMBER: " + matchedID : "NEW GUEST"}
                </span>
                <span
                  style={{
                    fontSize: "1rem",
                    fontWeight: "800",
                    color: "#0056b3",
                  }}
                >
                  {userBalance} PTS
                </span>
              </div>
              <input
                type="number"
                placeholder="Redeem"
                value={pointsToUse || ""}
                onChange={(e) =>
                  setPointsToUse(
                    Math.min(Number(e.target.value), userBalance, subtotal)
                  )
                }
                style={{
                  width: "80px",
                  padding: "6px",
                  borderRadius: "8px",
                  border: "1px solid #b6d4fe",
                  textAlign: "center",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: "5px" }}>
              {[25, 50, 75, 100].map((p) => (
                <button
                  key={p}
                  onClick={() =>
                    setPointsToUse(Math.floor((userBalance * p) / 100))
                  }
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "8px",
                    border: "1px solid #b6d4fe",
                    background: "#fff",
                    fontSize: "0.6rem",
                    fontWeight: "800",
                    color: "#0056b3",
                  }}
                >
                  {p}%
                </button>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "#fdfaf4",
              padding: "1.5rem",
              borderRadius: "14px",
              marginBottom: "1.5rem",
              border: "1px solid #f1e9d6",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.9rem",
                marginBottom: "6px",
              }}
            >
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "0.9rem",
                  color: "#2d7a5f",
                  fontWeight: "700",
                }}
              >
                <span>Loyalty Discount</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div
              style={{ height: "1px", background: "#eee", margin: "10px 0" }}
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.75rem",
                color: "#999",
              }}
            >
              <span>CGST / SGST (2.5% ea.)</span>
              <span>₹{gst.toFixed(2)}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "1.3rem",
                fontWeight: "700",
                borderTop: "2px solid #1a1612",
                paddingTop: "12px",
                marginTop: "10px",
              }}
            >
              <span>Total Payable</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "2rem" }}>
            {["UPI", "Card", "Cash"].map((m) => (
              <button
                key={m}
                onClick={() =>
                  setFormData({ ...formData, paymentMethod: m.toLowerCase() })
                }
                style={{
                  flex: 1,
                  padding: "14px",
                  borderRadius: "10px",
                  border: "2px solid #1a1612",
                  fontSize: "0.75rem",
                  fontWeight: "800",
                  transition: "0.2s",
                  background:
                    formData.paymentMethod === m.toLowerCase()
                      ? "#1a1612"
                      : "white",
                  color:
                    formData.paymentMethod === m.toLowerCase()
                      ? "white"
                      : "#1a1612",
                }}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            onClick={handleFinalSubmit}
            style={{
              background: "#1a1612",
              color: "white",
              padding: "20px",
              borderRadius: "14px",
              border: "none",
              fontSize: "1.1rem",
              fontWeight: "700",
            }}
          >
            Proceed to Payment
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        @keyframes slideDown { from { transform: translateY(-100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.6; } 100% { opacity: 1; } }
      `}</style>
    </div>
  );
};
