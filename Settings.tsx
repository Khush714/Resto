import * as React from "react";
import { Card } from "./App";

export const Settings = () => {
  return (
    <div style={{ animation: "fadeUp .3s ease", maxWidth: "800px" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2
          style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.8rem",
          }}
        >
          System Settings
        </h2>
        <p style={{ fontSize: "0.75rem", color: "var(--ink3)" }}>
          Configure your brand identity and tax rules
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {/* BRANDING SECTION */}
        <Card>
          <h3
            style={{
              fontSize: "1rem",
              marginBottom: "1.5rem",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "10px",
            }}
          >
            Restaurant Identity
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <label
                style={{
                  fontSize: "0.7rem",
                  fontWeight: "700",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                RESTAURANT NAME
              </label>
              <input
                defaultValue="Spice Garden"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border2)",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "0.7rem",
                  fontWeight: "700",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                CURRENCY SYMBOL
              </label>
              <input
                defaultValue="₹"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border2)",
                }}
              />
            </div>
          </div>
        </Card>

        {/* TAX & BILLING SECTION */}
        <Card>
          <h3
            style={{
              fontSize: "1rem",
              marginBottom: "1.5rem",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "10px",
            }}
          >
            Tax & Billing
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "20px",
            }}
          >
            <div>
              <label
                style={{
                  fontSize: "0.7rem",
                  fontWeight: "700",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                GST / TAX RATE (%)
              </label>
              <input
                defaultValue="5"
                type="number"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border2)",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  fontSize: "0.7rem",
                  fontWeight: "700",
                  display: "block",
                  marginBottom: "8px",
                }}
              >
                SERVICE CHARGE (%)
              </label>
              <input
                defaultValue="0"
                type="number"
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  border: "1px solid var(--border2)",
                }}
              />
            </div>
          </div>
        </Card>

        {/* FEATURE TOGGLES */}
        <Card>
          <h3
            style={{
              fontSize: "1rem",
              marginBottom: "1.5rem",
              borderBottom: "1px solid var(--border)",
              paddingBottom: "10px",
            }}
          >
            Feature Controls
          </h3>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 0",
            }}
          >
            <div>
              <div style={{ fontWeight: "600", fontSize: "0.9rem" }}>
                Enable QR Ordering
              </div>
              <div style={{ fontSize: "0.7rem", color: "var(--ink3)" }}>
                Allow customers to place orders from their table
              </div>
            </div>
            <div
              style={{
                width: "40px",
                height: "20px",
                background: "var(--green)",
                borderRadius: "10px",
                position: "relative",
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  background: "white",
                  borderRadius: "50%",
                  position: "absolute",
                  right: "2px",
                  top: "2px",
                }}
              />
            </div>
          </div>
        </Card>

        <button
          style={{
            background: "var(--gold)",
            color: "white",
            border: "none",
            padding: "15px",
            borderRadius: "10px",
            fontWeight: "700",
            cursor: "pointer",
            marginTop: "1rem",
          }}
        >
          SAVE ALL CHANGES
        </button>
      </div>
    </div>
  );
};
