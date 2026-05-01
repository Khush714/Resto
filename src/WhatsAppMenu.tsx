import * as React from "react";
import { DietIcon, CATEGORIES } from "./App";

export const WhatsAppMenu = ({ menu, onPlaceOrder, customers = [] }) => {
  const [orderType, setOrderType] = React.useState("delivery");
  const [cart, setCart] = React.useState({});
  const [showCheckout, setShowCheckout] = React.useState(false);
  const [isProcessing, setIsProcessing] = React.useState(false);

  // FORM & PAYMENT STATE
  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    address: "",
  });
  const [paymentMethod, setPaymentMethod] = React.useState("upi");
  const [useLoyalty, setUseLoyalty] = React.useState(false);
  const [distance, setDistance] = React.useState(2);

  // --- REFINED LOYALTY LOOKUP (NORMALIZED) ---
  const normalize = (num) => String(num || "").replace(/\D/g, "");

  const patron = React.useMemo(() => {
    const cleanInput = normalize(formData.phone);
    if (cleanInput.length < 10) return null;
    return customers.find((c) => normalize(c.phone) === cleanInput);
  }, [formData.phone, customers]);

  const availablePoints = patron ? patron.points : 0;

  const subtotal = menu.reduce((s, i) => s + i.price * (cart[i.id] || 0), 0);

  // --- LOGISTICS & BILLING ENGINE ---
  const isEligibleForWaiver = subtotal >= 600 && distance <= 5;
  const deliveryFee =
    orderType === "delivery" ? (isEligibleForWaiver ? 0 : 40) : 0;

  const discount = useLoyalty ? Math.min(availablePoints, subtotal) : 0;
  const taxable = subtotal - discount;
  const gst = taxable * 0.05;
  const total = taxable + gst + deliveryFee;

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
    if (!formData.name.trim() || !formData.phone.trim()) {
      return alert("Compulsory: Name and WhatsApp Number are required.");
    }
    if (
      orderType === "delivery" &&
      (!formData.address || formData.address.length < 10)
    ) {
      return alert("Compulsory: A proper delivery address is required.");
    }

    setIsProcessing(true);

    // Simulated SSL Handshake / Gateway Initializing
    setTimeout(() => {
      onPlaceOrder({
        id: "WA-" + Math.floor(1000 + Math.random() * 9000),
        orderSource: "WhatsApp", // TRIGGER FOR STAGE 1 MESSAGE
        orderType: orderType, // DETERMINES 2-STAGE DISPATCH IN ORDERS.TSX
        customer: formData.name,
        phone: normalize(formData.phone),
        paymentMethod: paymentMethod.toUpperCase(),
        address:
          orderType === "delivery"
            ? formData.address
            : "SELF-PICKUP AT RESTAURANT",
        items: menu
          .filter((i) => cart[i.id])
          .map((i) => ({
            name: i.name,
            qty: cart[i.id],
            price: i.price,
            prepared: false,
          })),
        billing: {
          subtotal: subtotal.toFixed(2),
          discount: discount.toFixed(2),
          gst: gst.toFixed(2),
          deliveryFee: deliveryFee.toFixed(2),
          total: total.toFixed(2),
        },
        status: "Preparing",
        timestamp: Date.now(),
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

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
      {/* HEADER */}
      <div
        style={{
          padding: "2rem 1.5rem",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 10,
          borderBottom: "1px solid #eee",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h1
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.2rem",
              margin: 0,
            }}
          >
            Spice Garden
          </h1>
          <span
            style={{
              fontSize: "0.6rem",
              background: "#25D366",
              color: "#fff",
              padding: "4px 12px",
              borderRadius: "20px",
              fontWeight: "900",
            }}
          >
            WHATSAPP STORE
          </span>
        </div>

        <div
          style={{
            display: "flex",
            background: "#f2f2f2",
            padding: "4px",
            borderRadius: "14px",
          }}
        >
          {["Delivery", "Takeaway"].map((t) => (
            <button
              key={t}
              onClick={() => setOrderType(t.toLowerCase())}
              style={{
                flex: 1,
                padding: "12px",
                borderRadius: "10px",
                border: "none",
                fontSize: "0.85rem",
                fontWeight: "700",
                background:
                  orderType === t.toLowerCase() ? "#1a1612" : "transparent",
                color: orderType === t.toLowerCase() ? "white" : "#888",
                transition: "0.3s",
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* MENU LISTING */}
      <div style={{ padding: "1.5rem 1.5rem 150px" }}>
        {CATEGORIES.map((cat) => {
          const items = menu.filter((i) => i.category === cat);
          if (items.length === 0) return null;
          return (
            <div key={cat} style={{ marginBottom: "2.5rem" }}>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: "800",
                  color: "#b5862a",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                  marginBottom: "1.2rem",
                  borderBottom: "2px solid #b5862a",
                  display: "inline-block",
                }}
              >
                {cat}
              </h3>
              {items.map((item) => {
                const qty = cart[item.id] || 0;
                const isOutOfStock = item.available === false;
                return (
                  <div
                    key={item.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "2rem",
                      opacity: isOutOfStock ? 0.5 : 1,
                    }}
                  >
                    <div style={{ flex: 1, paddingRight: "15px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "4px",
                        }}
                      >
                        <DietIcon isVeg={item.isVeg} />
                        <span
                          style={{
                            fontSize: "1rem",
                            fontWeight: "700",
                            color: isOutOfStock ? "#999" : "#111",
                            textDecoration: isOutOfStock
                              ? "line-through"
                              : "none",
                          }}
                        >
                          {item.name}
                        </span>
                      </div>
                      {item.description && (
                        <div
                          style={{
                            fontSize: "0.7rem",
                            color: "#999",
                            lineHeight: "1.3",
                            marginBottom: "6px",
                            fontWeight: "400",
                          }}
                        >
                          {item.description}
                        </div>
                      )}
                      <span
                        style={{
                          fontSize: "0.85rem",
                          fontWeight: "800",
                          color: "#b5862a",
                        }}
                      >
                        ₹{item.price}
                      </span>
                    </div>

                    <div style={{ paddingTop: "4px" }}>
                      {isOutOfStock ? (
                        <div
                          style={{
                            fontSize: "0.6rem",
                            fontWeight: "900",
                            color: "#b84040",
                            border: "1px solid #b84040",
                            padding: "4px 8px",
                            borderRadius: "4px",
                          }}
                        >
                          SOLD OUT
                        </div>
                      ) : qty === 0 ? (
                        <button
                          onClick={() => handleQtyChange(item.id, 1)}
                          style={addBtnStyle}
                        >
                          +
                        </button>
                      ) : (
                        <div style={qtyToggleStyle}>
                          <button
                            onClick={() => handleQtyChange(item.id, -1)}
                            style={innerQtyBtn}
                          >
                            -
                          </button>
                          <span>{qty}</span>
                          <button
                            onClick={() => handleQtyChange(item.id, 1)}
                            style={innerQtyBtn}
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* CHECKOUT MODAL */}
      {showCheckout && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#fff",
            zIndex: 1000,
            padding: "2rem",
            overflowY: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem",
            }}
          >
            <h2
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "2.2rem",
                margin: 0,
              }}
            >
              Secure Checkout
            </h2>
            <button
              onClick={() => setShowCheckout(false)}
              style={{
                border: "none",
                background: "#f2f2f2",
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                fontSize: "1.2rem",
              }}
            >
              ×
            </button>
          </div>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "20px" }}
          >
            <input
              placeholder="Name (Compulsory)*"
              style={inputStyle}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
            />
            <input
              placeholder="WhatsApp Number (Compulsory)*"
              type="tel"
              style={inputStyle}
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
            />

            {orderType === "delivery" && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "15px",
                }}
              >
                <textarea
                  placeholder="Delivery Address (Flat No, Landmark, Area)*"
                  style={{
                    ...inputStyle,
                    height: "100px",
                    border: "1px solid #eee",
                    borderRadius: "12px",
                    padding: "15px",
                  }}
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                />
                <div
                  style={{
                    padding: "15px",
                    background: "#fdfcf8",
                    border: "1px solid #e5d5b5",
                    borderRadius: "12px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "10px",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "0.7rem",
                        fontWeight: "900",
                        color: "#b5862a",
                      }}
                    >
                      DELIVERY DISTANCE
                    </label>
                    <span style={{ fontSize: "0.7rem", fontWeight: "900" }}>
                      {distance} KM
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={distance}
                    onChange={(e) => setDistance(e.target.value)}
                    style={{ width: "100%", accentColor: "#b5862a" }}
                  />
                </div>
              </div>
            )}
          </div>

          {availablePoints > 0 && (
            <div
              style={{
                marginTop: "2rem",
                padding: "15px",
                background: "rgba(45, 122, 95, 0.05)",
                border: "1.5px solid #2d7a5f",
                borderRadius: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    fontWeight: "800",
                    color: "#2d7a5f",
                  }}
                >
                  Redeem {availablePoints} Points?
                </div>
                <div style={{ fontSize: "0.65rem", color: "#666" }}>
                  Save ₹{availablePoints} on this order
                </div>
              </div>
              <input
                type="checkbox"
                checked={useLoyalty}
                onChange={() => setUseLoyalty(!useLoyalty)}
                style={{
                  width: "22px",
                  height: "22px",
                  accentColor: "#2d7a5f",
                }}
              />
            </div>
          )}

          <div style={{ marginTop: "2.5rem" }}>
            <h4
              style={{
                fontSize: "0.75rem",
                fontWeight: "800",
                letterSpacing: "1px",
                marginBottom: "15px",
              }}
            >
              CHOOSE PAYMENT METHOD
            </h4>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "10px",
              }}
            >
              <div
                onClick={() => setPaymentMethod("upi")}
                style={{
                  ...paymentTile,
                  borderColor: paymentMethod === "upi" ? "#b5862a" : "#eee",
                  background: paymentMethod === "upi" ? "#fdfcf8" : "#fff",
                }}
              >
                <div style={{ fontSize: "1.2rem" }}>📱</div>
                <div style={{ fontSize: "0.7rem", fontWeight: "800" }}>
                  UPI / G-PAY
                </div>
              </div>
              <div
                onClick={() => setPaymentMethod("card")}
                style={{
                  ...paymentTile,
                  borderColor: paymentMethod === "card" ? "#b5862a" : "#eee",
                  background: paymentMethod === "card" ? "#fdfcf8" : "#fff",
                }}
              >
                <div style={{ fontSize: "1.2rem" }}>💳</div>
                <div style={{ fontSize: "0.7rem", fontWeight: "800" }}>
                  CREDIT CARD
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: "2.5rem",
              padding: "1.5rem",
              background: "#f9f9f9",
              borderRadius: "15px",
            }}
          >
            <BillRow label="Items Subtotal" value={`₹${subtotal}`} />
            {discount > 0 && (
              <BillRow
                label="Loyalty Discount"
                value={`-₹${discount}`}
                color="#2d7a5f"
              />
            )}
            <BillRow label="GST (5%)" value={`₹${gst.toFixed(2)}`} />
            {orderType === "delivery" && (
              <BillRow
                label="Delivery Charge"
                value={deliveryFee === 0 ? "WAIVED" : `₹${deliveryFee}`}
                color={deliveryFee === 0 ? "#2d7a5f" : "#111"}
              />
            )}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "15px",
                paddingTop: "15px",
                borderTop: "2px solid #111",
                fontSize: "1.4rem",
                fontWeight: "900",
              }}
            >
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleFinalSubmit}
            disabled={isProcessing}
            style={primaryBtnStyle}
          >
            {isProcessing
              ? "INITIALIZING GATEWAY..."
              : `Pay ₹${total.toFixed(2)} with ${paymentMethod.toUpperCase()}`}
          </button>
        </div>
      )}

      {/* STICKY FOOTER */}
      {subtotal > 0 && (
        <div style={footerStyle}>
          <div>
            <div style={{ fontSize: "0.6rem", opacity: 0.7 }}>
              TOTAL PAYABLE
            </div>
            <div style={{ fontSize: "1.3rem", fontWeight: "900" }}>
              ₹{total.toFixed(2)}
            </div>
          </div>
          <button
            onClick={() => setShowCheckout(true)}
            style={checkoutBtnStyle}
          >
            Review Order →
          </button>
        </div>
      )}
    </div>
  );
};

// --- STYLES & HELPERS ---
const BillRow = ({ label, value, color = "#555" }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      marginBottom: "10px",
      fontSize: "0.9rem",
      color,
    }}
  >
    <span>{label}</span>
    <span style={{ fontWeight: "700" }}>{value}</span>
  </div>
);

const paymentTile = {
  border: "2px solid #eee",
  borderRadius: "12px",
  padding: "15px",
  textAlign: "center",
  cursor: "pointer",
  transition: "0.2s",
};
const addBtnStyle = {
  width: "40px",
  height: "40px",
  borderRadius: "8px",
  border: "1.5px solid #111",
  background: "#fff",
  fontWeight: "900",
  cursor: "pointer",
};
const qtyToggleStyle = {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  background: "#111",
  color: "#fff",
  padding: "5px 15px",
  borderRadius: "8px",
};
const innerQtyBtn = {
  background: "none",
  border: "none",
  color: "#fff",
  fontWeight: "900",
  cursor: "pointer",
};
const inputStyle = {
  padding: "18px 0",
  border: "none",
  borderBottom: "1.5px solid #eee",
  outline: "none",
  fontSize: "1.1rem",
  width: "100%",
  boxSizing: "border-box",
};
const footerStyle = {
  position: "fixed",
  bottom: "30px",
  left: "20px",
  right: "20px",
  background: "#1a1612",
  color: "#fff",
  padding: "1.2rem 1.8rem",
  borderRadius: "24px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
  zIndex: 100,
};
const checkoutBtnStyle = {
  background: "#b5862a",
  color: "#1a1612",
  border: "none",
  padding: "12px 24px",
  borderRadius: "12px",
  fontWeight: "900",
};
const primaryBtnStyle = {
  width: "100%",
  padding: "20px",
  background: "#1a1612",
  color: "#b5862a",
  border: "none",
  borderRadius: "14px",
  marginTop: "2.5rem",
  fontWeight: "900",
  fontSize: "1.1rem",
  cursor: "pointer",
};
