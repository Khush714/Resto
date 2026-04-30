import * as React from "react";
import { Card, Chip } from "./App";

export const Loyalty = ({ customers, onSaveCustomers }) => {
  const [search, setSearch] = React.useState("");
  const [localCustomers, setLocalCustomers] = React.useState(customers);
  const [showModal, setShowModal] = React.useState(false);
  const [editId, setEditId] = React.useState(null);
  const [newCust, setNewCust] = React.useState({
    name: "",
    phone: "",
    email: "",
    points: 0,
    lifetimePoints: 0,
  });

  const clean = (num) => String(num || "").replace(/\D/g, "");

  React.useEffect(() => {
    setLocalCustomers(customers);
  }, [customers]);

  const handleUpdateField = (id, field, value) => {
    setLocalCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const openEditModal = (guest) => {
    setEditId(guest.id);
    setNewCust({ ...guest });
    setShowModal(true);
  };

  const handleSaveGuest = () => {
    if (!newCust.name || !newCust.phone) return alert("Required: Name & Phone");
    const sanitizedPhone = clean(newCust.phone);

    if (editId) {
      setLocalCustomers((prev) =>
        prev.map((c) =>
          c.id === editId ? { ...c, ...newCust, phone: sanitizedPhone } : c
        )
      );
    } else {
      // --- STRICTURE SG-XXX ID GENERATION ---
      const lastNum = localCustomers.reduce((max, c) => {
        const match = String(c.id).match(/SG-(\d+)/);
        const num = match ? parseInt(match[1]) : 0;
        return num > max ? num : max;
      }, 0);

      const added = {
        ...newCust,
        phone: sanitizedPhone,
        id: `SG-${(lastNum + 1).toString().padStart(3, "0")}`,
        visits: 1,
        points: Number(newCust.points),
        lifetimePoints: Number(newCust.points),
        totalSpend: 0,
        ledger:
          newCust.points > 0
            ? [
                {
                  amount: Number(newCust.points),
                  earnedAt: new Date().toISOString(),
                  expiresAt: new Date(
                    new Date().setMonth(new Date().getMonth() + 6)
                  ).toISOString(),
                },
              ]
            : [],
      };
      setLocalCustomers([added, ...localCustomers]);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditId(null);
    setNewCust({
      name: "",
      phone: "",
      email: "",
      points: 0,
      lifetimePoints: 0,
    });
  };

  const getTier = (c) => {
    const pts = Number(c.lifetimePoints || c.points) || 0;
    if (c.tier === "Platinum" || pts >= 1000)
      return {
        label: "PLATINUM",
        color: "#1a1612",
        bg: "#e2e8f0",
        border: "#cbd5e1",
      };
    if (c.tier === "Gold" || pts >= 500)
      return {
        label: "GOLD",
        color: "#7a5c12",
        bg: "#fdfcf8",
        border: "#e9d8a6",
      };
    return {
      label: "SILVER",
      color: "#94a3b8",
      bg: "#f8fafc",
      border: "#f1f5f9",
    };
  };

  const filtered = localCustomers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      clean(c.phone).includes(clean(search)) ||
      c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={containerStyle}>
      {/* HEADER SECTION */}
      <div style={headerWrapper}>
        <div>
          <span style={superLabel}>ESTATE MANAGEMENT</span>
          <h2 style={brandTitle}>
            Patron <span style={{ fontWeight: 100 }}>Registry</span>
          </h2>
        </div>
        <div style={{ display: "flex", gap: "15px" }}>
          <button onClick={() => setShowModal(true)} style={btnOutline}>
            ENROLL GUEST
          </button>
          <button
            onClick={() => {
              onSaveCustomers(localCustomers);
              alert("Cloud Data Synchronized.");
            }}
            style={btnSolid}
          >
            SYNC DATABASE
          </button>
        </div>
      </div>

      {/* SEARCH BAR */}
      <div style={searchSection}>
        <div style={searchIcon}>🔍</div>
        <input
          placeholder="Filter by Identity, Mobile or Member ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={searchInputStyle}
        />
      </div>

      {/* DIRECTORY GRID */}
      <div style={listContainer}>
        <div style={gridHeader}>
          <span style={colLabel}>IDENTITY</span>
          <span style={colLabel}>MEMBERSHIP</span>
          <span style={colLabel}>WALLET BALANCE</span>
          <span style={colLabel}>REWARDS EXPIRY</span>
          <span style={{ ...colLabel, textAlign: "right" }}>MANAGEMENT</span>
        </div>

        {filtered.map((c) => {
          const tier = getTier(c);
          const activeLedger = (c.ledger || []).filter(
            (l) => new Date(l.expiresAt) > new Date()
          );
          const soonestExpiry =
            activeLedger.length > 0
              ? activeLedger.sort(
                  (a, b) => new Date(a.expiresAt) - new Date(b.expiresAt)
                )[0]
              : null;

          return (
            <div key={c.id} style={gridRow}>
              <div style={colContent}>
                <div style={nameLabel}>{c.name}</div>
                <div style={subIdentity}>
                  <span style={memberIdTag}>{c.id}</span>
                  <span style={phoneDisplay}>{c.phone}</span>
                </div>
              </div>

              <div style={colContent}>
                <div
                  style={{
                    ...tierPill,
                    background: tier.bg,
                    color: tier.color,
                    border: `1px solid ${tier.border}`,
                  }}
                >
                  {tier.label}
                </div>
              </div>

              <div style={colContent}>
                <div style={walletFlex}>
                  <span style={currency}>₹</span>
                  <span style={pointsDisplay}>{c.points}</span>
                </div>
                <span style={lifetimeValue}>
                  LIFETIME: {c.lifetimePoints || c.points}
                </span>
              </div>

              <div style={colContent}>
                {soonestExpiry ? (
                  <div style={expiryBox}>
                    <span style={expiryAmt}>{soonestExpiry.amount} PTS</span>
                    <span style={expiryDate}>
                      DUE{" "}
                      {new Date(soonestExpiry.expiresAt)
                        .toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                        })
                        .toUpperCase()}
                    </span>
                  </div>
                ) : (
                  <span style={stableLabel}>PERMANENT</span>
                )}
              </div>

              <div style={actionsCol}>
                <button onClick={() => openEditModal(c)} style={editAction}>
                  EDIT
                </button>
                <div style={actionDivider}></div>
                <button
                  onClick={() =>
                    setLocalCustomers((prev) =>
                      prev.filter((x) => x.id !== c.id)
                    )
                  }
                  style={removeAction}
                >
                  REMOVE
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={modalOverlay}>
          <div style={modalBox}>
            <h3 style={modalHeading}>{editId ? "Modify" : "Onboard"} Member</h3>
            <div style={formStack}>
              <div style={fieldGroup}>
                <label style={minimalLabel}>FULL IDENTITY NAME</label>
                <input
                  value={newCust.name}
                  onChange={(e) =>
                    setNewCust({ ...newCust, name: e.target.value })
                  }
                  style={minimalInput}
                  placeholder="e.g. Sanjay Patel"
                />
              </div>
              <div style={fieldGroup}>
                <label style={minimalLabel}>PRIMARY CONTACT</label>
                <input
                  value={newCust.phone}
                  onChange={(e) =>
                    setNewCust({ ...newCust, phone: e.target.value })
                  }
                  style={minimalInput}
                  placeholder="e.g. +91 98XXX XXXXX"
                />
              </div>
              <button onClick={handleSaveGuest} style={authorizeBtn}>
                {editId ? "UPDATE RECORD" : "AUTHORIZE ENROLLMENT"}
              </button>
              <button onClick={closeModal} style={cancelBtn}>
                DISCARD
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- ELEGANT & CLEAN STYLES ---
const containerStyle = {
  animation: "fadeUp .6s ease",
  maxWidth: "1350px",
  margin: "0 auto",
  padding: "60px 40px",
  backgroundColor: "#fff",
};
const headerWrapper = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "80px",
};
const superLabel = {
  letterSpacing: "6px",
  fontSize: "0.55rem",
  fontWeight: "900",
  color: "#b5862a",
  display: "block",
  marginBottom: "8px",
};
const brandTitle = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "3.5rem",
  margin: 0,
  fontWeight: "300",
  color: "#1a1612",
  lineHeight: 1,
};
const btnSolid = {
  background: "#1a1612",
  color: "white",
  border: "none",
  padding: "14px 28px",
  fontWeight: "700",
  fontSize: "0.6rem",
  letterSpacing: "2px",
  cursor: "pointer",
};
const btnOutline = {
  background: "transparent",
  color: "#1a1612",
  border: "1px solid #1a1612",
  padding: "13px 28px",
  fontWeight: "700",
  fontSize: "0.6rem",
  letterSpacing: "2px",
  cursor: "pointer",
};

const searchSection = {
  marginBottom: "60px",
  position: "relative",
  display: "flex",
  alignItems: "center",
};
const searchIcon = {
  position: "absolute",
  left: "0",
  fontSize: "1.2rem",
  opacity: 0.3,
};
const searchInputStyle = {
  width: "100%",
  padding: "15px 0 15px 40px",
  fontSize: "1.1rem",
  border: "none",
  borderBottom: "1px solid #f0f0f0",
  outline: "none",
  background: "transparent",
  fontWeight: "300",
  color: "#1a1612",
  letterSpacing: "0.5px",
};

const listContainer = { marginTop: "20px" };
const gridHeader = {
  display: "grid",
  gridTemplateColumns: "1.8fr 1fr 1fr 1.2fr 0.8fr",
  padding: "0 20px 20px 20px",
  borderBottom: "1.5px solid #1a1612",
};
const colLabel = {
  fontSize: "0.5rem",
  fontWeight: "900",
  color: "#1a1612",
  letterSpacing: "3px",
};
const gridRow = {
  display: "grid",
  gridTemplateColumns: "1.8fr 1fr 1fr 1.2fr 0.8fr",
  padding: "35px 20px",
  borderBottom: "1px solid #f8f8f8",
  alignItems: "center",
};
const colContent = { display: "flex", flexDirection: "column" };

const nameLabel = {
  fontSize: "1.2rem",
  fontWeight: "500",
  color: "#1a1612",
  marginBottom: "4px",
};
const subIdentity = { display: "flex", alignItems: "center", gap: "15px" };
const memberIdTag = {
  fontSize: "0.6rem",
  fontWeight: "800",
  color: "#ccc",
  letterSpacing: "1px",
};
const phoneDisplay = {
  fontSize: "0.8rem",
  color: "#b5862a",
  fontWeight: "500",
};

const tierPill = {
  fontSize: "0.5rem",
  fontWeight: "900",
  padding: "6px 16px",
  letterSpacing: "2px",
  width: "fit-content",
  borderRadius: "100px",
};
const walletFlex = { display: "flex", alignItems: "center", gap: "5px" };
const currency = { fontSize: "0.8rem", color: "#ccc", fontWeight: "500" };
const pointsDisplay = {
  fontSize: "1.6rem",
  fontWeight: "300",
  color: "#1a1612",
};
const lifetimeValue = {
  fontSize: "0.55rem",
  color: "#bbb",
  fontWeight: "700",
  letterSpacing: "1px",
};

const expiryBox = { display: "flex", flexDirection: "column", gap: "2px" };
const expiryAmt = { fontSize: "0.85rem", color: "#b84040", fontWeight: "600" };
const expiryDate = {
  fontSize: "0.55rem",
  color: "#999",
  fontWeight: "800",
  letterSpacing: "0.5px",
};
const stableLabel = {
  fontSize: "0.6rem",
  color: "#eee",
  fontWeight: "900",
  letterSpacing: "1px",
};

const actionsCol = {
  textAlign: "right",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "15px",
};
const actionDivider = { width: "1px", height: "12px", backgroundColor: "#eee" };
const editAction = {
  background: "none",
  border: "none",
  color: "#1a1612",
  cursor: "pointer",
  fontSize: "0.6rem",
  fontWeight: "800",
  letterSpacing: "1.5px",
  opacity: 0.4,
};
const removeAction = {
  background: "none",
  border: "none",
  color: "#b84040",
  cursor: "pointer",
  fontSize: "0.6rem",
  fontWeight: "900",
  letterSpacing: "1.5px",
};

const modalOverlay = {
  position: "fixed",
  inset: 0,
  background: "rgba(255,255,255,0.98)",
  backdropFilter: "blur(20px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 3000,
};
const modalBox = {
  background: "white",
  width: "100%",
  maxWidth: "450px",
  padding: "60px",
  textAlign: "center",
};
const modalHeading = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "2.8rem",
  marginBottom: "50px",
  fontWeight: "300",
  color: "#1a1612",
};
const formStack = { display: "flex", flexDirection: "column", gap: "40px" };
const fieldGroup = { textAlign: "left" };
const minimalLabel = {
  fontSize: "0.5rem",
  fontWeight: "900",
  color: "#bbb",
  letterSpacing: "3px",
  display: "block",
  marginBottom: "12px",
};
const minimalInput = {
  width: "100%",
  padding: "10px 0",
  border: "none",
  borderBottom: "1px solid #eee",
  fontSize: "1.3rem",
  outline: "none",
  fontWeight: "200",
  color: "#1a1612",
};
const authorizeBtn = {
  background: "#1a1612",
  color: "white",
  border: "none",
  padding: "20px",
  fontSize: "0.7rem",
  fontWeight: "800",
  letterSpacing: "4px",
  cursor: "pointer",
};
const cancelBtn = {
  background: "none",
  border: "none",
  color: "#999",
  fontSize: "0.6rem",
  cursor: "pointer",
  fontWeight: "700",
  letterSpacing: "2px",
};
