import * as React from "react";
import { Card } from "./App";

// --- PREMIUM EDIT ICON ---
const EditIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

export const GuestDossier = ({ customers = [], onUpdateCustomers }) => {
  const [showModal, setShowModal] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(null);
  const [viewingGuest, setViewingGuest] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  const [formData, setFormData] = React.useState({
    name: "",
    phone: "",
    tier: "Silver",
    dietary: "",
    preferences: "",
    notes: "",
    points: 0,
  });

  // --- HANDSHAKE NORMALIZATION ---
  const clean = (num) => String(num || "").replace(/\D/g, "");

  const openEditModal = (guest) => {
    setFormData(guest);
    setIsEditing(guest.id);
    setShowModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const sanitizedPhone = clean(formData.phone);

    // Auto-calculate points/tier handshake if needed
    const pointsValue =
      formData.points ||
      (formData.tier === "Platinum"
        ? 1000
        : formData.tier === "Gold"
        ? 500
        : 0);

    const guestEntry = {
      ...formData,
      phone: sanitizedPhone,
      points: pointsValue,
    };

    let updatedList;
    if (isEditing) {
      updatedList = customers.map((g) =>
        g.id === isEditing ? { ...g, ...guestEntry } : g
      );
    } else {
      const newGuest = {
        ...guestEntry,
        id: Date.now(),
        visits: 1,
        totalSpend: 0,
        lastVisit: new Date().toISOString().split("T")[0],
      };
      updatedList = [newGuest, ...customers];
    }

    onUpdateCustomers(updatedList); // BRIDGE TO APP.TSX
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(null);
    setFormData({
      name: "",
      phone: "",
      tier: "Silver",
      dietary: "",
      preferences: "",
      notes: "",
      points: 0,
    });
  };

  const filteredGuests = customers.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clean(g.phone).includes(clean(searchQuery))
  );

  return (
    <div
      style={{
        animation: "fadeUp .5s ease",
        paddingBottom: "4rem",
        backgroundColor: "#F9FAFB",
        minHeight: "100vh",
        padding: "2rem",
      }}
    >
      {/* --- HEADER --- */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          marginBottom: "2.5rem",
          paddingBottom: "1rem",
          borderBottom: "1px solid #EEE",
        }}
      >
        <div>
          <span
            style={{
              letterSpacing: "4px",
              fontSize: "0.55rem",
              fontWeight: "900",
              color: "#B5862A",
              textTransform: "uppercase",
            }}
          >
            Patron Management
          </span>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.6rem",
              margin: "5px 0 0",
              fontWeight: "300",
            }}
          >
            The <span style={{ color: "#B5862A" }}>Guest Dossier</span>
          </h2>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            placeholder="SEARCH NAME OR PHONE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInputStyle}
          />
          <button onClick={() => setShowModal(true)} style={btnStylePrimary}>
            + NEW PATRON
          </button>
        </div>
      </div>

      {/* --- GRID --- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredGuests.map((guest) => (
          <Card
            key={guest.id}
            style={{
              background: "#FFF",
              border: "1px solid #EEE",
              padding: "1.8rem 1.5rem",
              position: "relative",
              boxShadow: "0 8px 30px rgba(0,0,0,0.02)",
            }}
          >
            <button onClick={() => openEditModal(guest)} style={editBtnStyle}>
              <EditIcon />
            </button>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "30px",
                height: "3px",
                background:
                  guest.points >= 1000 || guest.tier === "Platinum"
                    ? "#B5862A"
                    : "#DDD",
              }}
            />

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "1.5rem",
              }}
            >
              <div>
                <div
                  style={{ fontWeight: "700", fontSize: "1rem", color: "#111" }}
                >
                  {guest.name}
                </div>
                <div
                  style={{
                    fontSize: "0.7rem",
                    color: "#999",
                    marginTop: "2px",
                  }}
                >
                  {guest.phone}
                </div>
                <div
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: "800",
                    color: "#B5862A",
                    letterSpacing: "1px",
                    marginTop: "4px",
                  }}
                >
                  {guest.tier?.toUpperCase() || "MEMBER"} • {guest.points || 0}{" "}
                  PTS
                </div>
              </div>
              <div style={visitBadgeStyle}>{guest.visits || 0} VISITS</div>
            </div>

            <div style={dataRowStyle}>
              <div>
                <div style={smallLabel}>LIFETIME VALUE</div>
                {/* --- FIX: CRASH PREVENTION ADDED HERE --- */}
                <div style={dataVal}>
                  ₹{(Number(guest.totalSpend) || 0).toLocaleString()}
                </div>
              </div>
              <div>
                <div style={smallLabel}>LAST VISIT</div>
                <div style={dataVal}>
                  {guest.lastVisit
                    ? guest.lastVisit.split("-").slice(1).join("/")
                    : "N/A"}
                </div>
              </div>
            </div>

            <button
              onClick={() => setViewingGuest(guest)}
              style={viewDossierBtn}
            >
              VIEW DOSSIER
            </button>
          </Card>
        ))}
      </div>

      {/* --- DOSSIER MODAL (READ ONLY) --- */}
      {viewingGuest && (
        <div style={overlayStyle} onClick={() => setViewingGuest(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "2rem",
              }}
            >
              <div>
                <span style={labelStyle}>ESTATE PATRON RECORD</span>
                <h3
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "2.4rem",
                    margin: 0,
                  }}
                >
                  {viewingGuest.name}
                </h3>
              </div>
              <button
                onClick={() => setViewingGuest(null)}
                style={closeBtnStyle}
              >
                ×
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "25px",
              }}
            >
              <div style={intelBoxStyle}>
                <div style={smallLabel}>GUEST INTELLIGENCE SUMMARY</div>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#111",
                    lineHeight: "1.6",
                    marginTop: "10px",
                  }}
                >
                  <b>Mobile:</b> {viewingGuest.phone} <br />
                  <b>Dietary:</b> {viewingGuest.dietary || "None"} <br />
                  <b>Preferences:</b> {viewingGuest.preferences || "None"}{" "}
                  <br />
                  <b>Notes:</b> {viewingGuest.notes || "None"}
                </div>
              </div>
              <ProfileItem label="MEMBERSHIP TIER" value={viewingGuest.tier} />
              <ProfileItem label="TOTAL VISITS" value={viewingGuest.visits} />
              <ProfileItem
                label="LIFETIME SPEND"
                value={`₹${(
                  Number(viewingGuest.totalSpend) || 0
                ).toLocaleString()}`}
              />
              <ProfileItem
                label="LOYALTY BALANCE"
                value={`${viewingGuest.points || 0} PTS`}
              />
            </div>
          </div>
        </div>
      )}

      {/* --- FORM MODAL (ADD / EDIT) --- */}
      {showModal && (
        <div style={overlayStyle}>
          <div style={modalStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "2rem",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "2rem",
                  margin: 0,
                }}
              >
                {isEditing ? "Modify Intelligence" : "Onboard Patron"}
              </h3>
              <button onClick={closeModal} style={closeBtnStyle}>
                ×
              </button>
            </div>
            <form
              onSubmit={handleFormSubmit}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
              }}
            >
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>FULL NAME</label>
                <input
                  required
                  style={inputStyle}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>MOBILE NUMBER</label>
                <input
                  required
                  style={inputStyle}
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>TIER</label>
                <select
                  style={inputStyle}
                  value={formData.tier}
                  onChange={(e) =>
                    setFormData({ ...formData, tier: e.target.value })
                  }
                >
                  <option>Platinum</option>
                  <option>Gold</option>
                  <option>Silver</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>DIETARY</label>
                <input
                  style={inputStyle}
                  value={formData.dietary}
                  onChange={(e) =>
                    setFormData({ ...formData, dietary: e.target.value })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>PREFERENCES</label>
                <input
                  style={inputStyle}
                  value={formData.preferences}
                  onChange={(e) =>
                    setFormData({ ...formData, preferences: e.target.value })
                  }
                />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>PRIVATE NOTES</label>
                <textarea
                  style={{ ...inputStyle, height: "60px" }}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <button
                  type="submit"
                  style={{ ...btnStylePrimary, width: "100%", padding: "14px" }}
                >
                  {isEditing ? "UPDATE INTELLIGENCE" : "CREATE PATRON RECORD"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- STYLES ---
const searchInputStyle = {
  padding: "10px",
  border: "1px solid #EEE",
  borderRadius: "4px",
  fontSize: "0.7rem",
  width: "200px",
  outline: "none",
};
const editBtnStyle = {
  position: "absolute",
  top: "15px",
  right: "15px",
  background: "none",
  border: "none",
  cursor: "pointer",
  color: "#B5862A",
  opacity: 0.4,
};
const visitBadgeStyle = {
  fontSize: "0.5rem",
  padding: "4px 8px",
  background: "#111",
  color: "#FFF",
  borderRadius: "2px",
  fontWeight: "800",
};
const dataRowStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "10px",
  padding: "1rem 0",
  borderTop: "1px solid #F5F5F5",
  borderBottom: "1px solid #F5F5F5",
};
const smallLabel = {
  fontSize: "0.5rem",
  color: "#BBB",
  fontWeight: "900",
  letterSpacing: "1px",
  marginBottom: "4px",
};
const dataVal = {
  fontSize: "1.1rem",
  color: "#111",
  fontFamily: "'Cormorant Garamond', serif",
};
const btnStylePrimary = {
  padding: "10px 20px",
  background: "#111",
  color: "#FFF",
  border: "none",
  borderRadius: "4px",
  fontSize: "0.6rem",
  fontWeight: "800",
  cursor: "pointer",
  letterSpacing: "1px",
};
const viewDossierBtn = {
  padding: "8px",
  background: "transparent",
  border: "1px solid #B5862A",
  color: "#B5862A",
  fontSize: "0.6rem",
  fontWeight: "800",
  cursor: "pointer",
  width: "100%",
  marginTop: "1.5rem",
};
const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(255,255,255,0.8)",
  backdropFilter: "blur(10px)",
  zIndex: 3000,
  display: "flex",
  alignItems: "center",
  justifyCenter: "center",
};
const modalStyle = {
  background: "#FFF",
  width: "90%",
  maxWidth: "550px",
  border: "1px solid #B5862A",
  padding: "2.5rem",
  boxShadow: "0 30px 60px rgba(0,0,0,0.05)",
  margin: "auto",
};
const labelStyle = {
  display: "block",
  fontSize: "0.55rem",
  fontWeight: "900",
  color: "#BBB",
  letterSpacing: "1.5px",
  marginBottom: "6px",
};
const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "1px solid #EEE",
  background: "#FAFAFA",
  fontSize: "0.85rem",
  boxSizing: "border-box",
  outline: "none",
};
const closeBtnStyle = {
  background: "none",
  border: "none",
  fontSize: "1.8rem",
  cursor: "pointer",
  color: "#B5862A",
};
const intelBoxStyle = {
  gridColumn: "span 2",
  background: "#FDFCF8",
  padding: "20px",
  borderLeft: "4px solid #B5862A",
};

const ProfileItem = ({ label, value }) => (
  <div>
    <div style={smallLabel}>{label}</div>
    <div
      style={{
        fontSize: "1.1rem",
        color: "#111",
        fontFamily: "'Cormorant Garamond', serif",
      }}
    >
      {value || "—"}
    </div>
  </div>
);
