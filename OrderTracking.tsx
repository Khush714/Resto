import * as React from "react";

/**
 * INTERNAL UI COMPONENTS
 * Defined here to prevent circular dependency errors with App.tsx
 */
const TrackingCard = ({ children, style = {} }) => (
  <div
    style={{
      background: "#fff",
      border: "1px solid #eee",
      borderRadius: "16px",
      padding: "1.5rem",
      boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
      ...style,
    }}
  >
    {children}
  </div>
);

export const OrderTracking = ({ order }) => {
  // Defensive check for when the order is being retrieved
  if (!order) {
    return (
      <div
        style={{
          padding: "5rem 2rem",
          textAlign: "center",
          animation: "fadeUp 0.5s ease",
        }}
      >
        <div style={{ fontSize: "2.5rem", marginBottom: "1.5rem" }}>⌛</div>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "2rem",
            fontWeight: 400,
          }}
        >
          Syncing with Spice Garden...
        </h2>
        <p style={{ fontSize: "0.8rem", color: "#999", letterSpacing: "1px" }}>
          RETRIEVING LIVE ORDER DATA
        </p>
      </div>
    );
  }

  // Tracking Timeline Steps
  const steps = [
    { label: "Order Confirmed", status: "Preparing", icon: "📋" },
    { label: "Kitchen is Preparing", status: "Preparing", icon: "👨‍🍳" },
    {
      label:
        order.orderType === "delivery"
          ? "Out for Delivery"
          : "Ready for Pickup",
      status: order.orderType === "delivery" ? "Out for Delivery" : "Ready",
      icon: order.orderType === "delivery" ? "🛵" : "🛍️",
    },
    { label: "Order Fulfilled", status: "Completed", icon: "✨" },
  ];

  // Map backend status to timeline index
  const getStepIndex = () => {
    if (order.status === "Preparing") return 1;
    if (order.status === "Ready" || order.status === "Out for Delivery")
      return 2;
    if (order.status === "Completed") return 3;
    return 0;
  };

  const currentStep = getStepIndex();

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "0 auto",
        animation: "fadeUp 0.6s ease",
        padding: "1rem",
        paddingBottom: "100px",
      }}
    >
      {/* --- HEADER --- */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "3.5rem",
          marginTop: "2rem",
        }}
      >
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "2.6rem",
            margin: "0 0 0.5rem",
            fontWeight: "400",
          }}
        >
          {order.status === "Completed" ? "Bon Appétit" : "Service Live"}
        </h2>
        <div
          style={{
            display: "inline-block",
            background: "#fdfcf8",
            border: "1px solid #e5d5b5",
            padding: "4px 12px",
            borderRadius: "20px",
          }}
        >
          <span
            style={{
              fontSize: "0.65rem",
              color: "#b5862a",
              fontWeight: "900",
              letterSpacing: "1px",
            }}
          >
            ORDER ID: {order.id}
          </span>
        </div>
      </div>

      {/* --- TIMELINE --- */}
      <div
        style={{
          position: "relative",
          marginBottom: "4rem",
          paddingLeft: "45px",
        }}
      >
        {/* The connecting vertical line */}
        <div
          style={{
            position: "absolute",
            left: "21px",
            top: "10px",
            bottom: "10px",
            width: "2px",
            background: "#f0f0f0",
          }}
        />

        {steps.map((step, idx) => {
          const isPast = idx < currentStep;
          const isCurrent = idx === currentStep;

          return (
            <div
              key={idx}
              style={{
                position: "relative",
                marginBottom: "3rem",
                opacity: isPast || isCurrent ? 1 : 0.25,
                transition: "0.4s all ease",
              }}
            >
              {/* Status Dot */}
              <div
                style={{
                  position: "absolute",
                  left: "-30px",
                  top: "4px",
                  width: "14px",
                  height: "14px",
                  borderRadius: "50%",
                  background: isPast || isCurrent ? "#b5862a" : "#ddd",
                  border: isCurrent ? "4px solid #fff" : "none",
                  boxShadow: isCurrent ? "0 0 0 2px #b5862a" : "none",
                  zIndex: 2,
                }}
              />

              <div
                style={{ display: "flex", gap: "20px", alignItems: "center" }}
              >
                <span style={{ fontSize: "1.4rem" }}>{step.icon}</span>
                <div>
                  <div
                    style={{
                      fontSize: "0.95rem",
                      fontWeight: isCurrent ? "900" : "600",
                      color: isCurrent ? "#1a1612" : "#888",
                    }}
                  >
                    {step.label}
                  </div>
                  {isCurrent && (
                    <div
                      style={{
                        fontSize: "0.7rem",
                        color: "#b5862a",
                        fontWeight: "800",
                        marginTop: "4px",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {order.status === "Preparing"
                        ? "Hand-crafting your selection"
                        : "Our team is en route"}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- SUMMARY CARD --- */}
      <TrackingCard>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.2rem",
            borderBottom: "1px solid #f5f5f5",
            paddingBottom: "0.8rem",
          }}
        >
          <h4
            style={{
              fontSize: "0.75rem",
              fontWeight: "900",
              letterSpacing: "1.5px",
              margin: 0,
              color: "#1a1612",
            }}
          >
            MANIFEST
          </h4>
          <span
            style={{ fontSize: "0.65rem", fontWeight: "800", color: "#b5862a" }}
          >
            {order.orderType?.toUpperCase()}
          </span>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          {order.items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.9rem",
                marginBottom: "10px",
                color: "#444",
              }}
            >
              <span>
                <span
                  style={{
                    fontWeight: "800",
                    color: "#b5862a",
                    marginRight: "8px",
                  }}
                >
                  {item.qty}x
                </span>{" "}
                {item.name}
              </span>
              <span style={{ fontWeight: "600" }}>
                ₹{item.price * item.qty}
              </span>
            </div>
          ))}
        </div>

        <div
          style={{
            paddingTop: "1rem",
            borderTop: "1px dashed #eee",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <span
            style={{ fontSize: "0.7rem", color: "#999", fontWeight: "700" }}
          >
            TOTAL AMOUNT PAID
          </span>
          <span
            style={{ fontSize: "1.4rem", fontWeight: "900", color: "#1a1612" }}
          >
            ₹{order.billing?.total}
          </span>
        </div>
      </TrackingCard>

      <div style={{ textAlign: "center", marginTop: "3rem" }}>
        <p style={{ fontSize: "0.7rem", color: "#bbb" }}>
          Thank you for choosing Spice Garden
        </p>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};
