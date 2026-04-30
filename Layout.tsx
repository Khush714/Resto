import * as React from "react";

const NAV = [
  { id: "dashboard", icon: "⊞", label: "Dashboard" },
  { id: "orders", icon: "≡", label: "Orders" },
  { id: "kot", icon: "◈", label: "Kitchen" },
  { id: "inventory", icon: "📦", label: "Inventory" },
  { id: "qr", icon: "▦", label: "QR Ordering" },
  { id: "whatsapp", icon: "◎", label: "WA Command" },
  { id: "delivery", icon: "🛵", label: "WA Storefront" },
  { id: "menu", icon: "☰", label: "Menu" },
  { id: "reservations", icon: "◷", label: "Reservations" },
  { id: "dossier", icon: "⧉", label: "Guest Dossier" },
  { id: "loyalty", icon: "◇", label: "Loyalty & Points" },
  { id: "analytics", icon: "↗", label: "Analytics" },
  { id: "staff", icon: "○", label: "Staff" },
  { id: "settings", icon: "⊙", label: "Settings" },
];

export const Layout = ({ children, page, setPage }) => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
      }}
    >
      {/* SIDEBAR - THE ENTIRE UNIT SCROLLS */}
      <aside
        style={{
          width: 220,
          height: "100vh",
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          overflowY: "auto", // This allows the header + nav to scroll together
          flexShrink: 0,
          scrollbarWidth: "none", // Optional: hides scrollbar on Firefox
        }}
      >
        {/* BRAND HEADER - Inside the scrollable area */}
        <div
          style={{
            height: 60,
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            padding: "0 1.5rem",
            fontWeight: 600,
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "1.4rem",
            letterSpacing: "1px",
          }}
        >
          Tablz POS
        </div>

        {/* NAVIGATION LIST */}
        <nav style={{ padding: "0.5rem 0" }}>
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setPage(n.id)}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 1.5rem",
                border: "none",
                background: page === n.id ? "var(--s2)" : "transparent",
                color: page === n.id ? "var(--ink)" : "var(--ink3)",
                fontSize: "0.8rem",
                cursor: "pointer",
                borderLeft: `3px solid ${
                  page === n.id ? "var(--gold)" : "transparent"
                }`,
                textAlign: "left",
                transition: "0.2s",
              }}
            >
              <span
                style={{
                  fontSize: "1.1rem",
                  width: "20px",
                  textAlign: "center",
                }}
              >
                {n.icon}
              </span>
              <span style={{ fontWeight: page === n.id ? "600" : "400" }}>
                {n.label}
              </span>
            </button>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          background: "var(--bg)",
          minWidth: 0, // Prevents content from pushing sidebar out
        }}
      >
        {/* FIXED TOP BAR */}
        <header
          style={{
            height: 60,
            background: "var(--surface)",
            borderBottom: "1px solid var(--border)",
            display: "flex",
            alignItems: "center",
            padding: "0 2rem",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "1.3rem",
              fontWeight: 600,
              flex: 1,
              textTransform: "capitalize",
            }}
          >
            {page === "dossier"
              ? "Patron Intelligence"
              : page === "whatsapp"
              ? "WhatsApp Command Center"
              : page === "delivery"
              ? "Customer Storefront (WhatsApp)"
              : page === "inventory"
              ? "Supply Chain Intelligence"
              : page}
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "var(--green)",
                boxShadow: "0 0 8px var(--green)",
              }}
            />
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: "0.7rem",
                color: "var(--ink3)",
              }}
            >
              SYSTEM LIVE
            </span>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div style={{ flex: 1, overflowY: "auto", padding: "2rem" }}>
          {children}
        </div>
      </div>
    </div>
  );
};
