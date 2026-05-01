import * as React from "react";
import { Card } from "./App";

// --- PREMIUM SVG ICONS ---
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

export const Staff = ({
  staff: team,
  setStaff: setTeam,
  incomingStrategy, // Handshake from AURA
  onStrategyComplete, // Cleanup signal
}) => {
  const BASE_HOURS = 160;

  const ROLES = [
    "Executive Chef",
    "Head Chef",
    "Sous Chef",
    "Line Cook",
    "Commis Chef",
    "Restaurant Manager",
    "Floor Captain",
    "Lead Server",
    "Server",
    "Hostess",
    "Bartender",
    "Sommelier",
    "Runner",
    "Dishwasher",
  ];

  // --- AURA GHOST ONBOARDING LOGIC ---
  React.useEffect(() => {
    if (incomingStrategy?.type === "ONBOARD_STAFF") {
      const { name, role, details } = incomingStrategy;

      // Extract optional metadata from natural language (age/contact)
      const contactMatch = details.match(
        /(?:contact|number|phone)\s*(?:is|:)?\s*([\d\s\+]+)/i
      );
      const ageMatch = details.match(/age\s*(?:is|:)?\s*(\d+)/i);

      const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();

      const newProfessional = {
        id: Date.now(),
        name: name,
        role:
          ROLES.find((r) => r.toLowerCase().includes(role.toLowerCase())) ||
          "Server",
        age: ageMatch ? ageMatch[1] : "24",
        contact: contactMatch ? contactMatch[1].trim() : "Pending",
        email: `${name.toLowerCase()}@spicegarden.com`,
        address: "Pending Registry",
        emergency: "Pending",
        joiningDate: new Date().toISOString().split("T")[0],
        salary: "25000", // Default base
        status: "Inactive",
        totalHours: 0,
        lastClockIn: null,
        performance: "100%",
        pin: generatedPin,
        weeklyShifts: {
          Mon: "X",
          Tue: "X",
          Wed: "X",
          Thu: "X",
          Fri: "X",
          Sat: "X",
          Sun: "X",
        },
        attendance: {},
      };

      setTeam((prev) => [newProfessional, ...prev]);

      // Auto-sync confirmation
      alert(
        `AURA: ${newProfessional.name} has been onboarded as ${newProfessional.role}. Credentials generated and synced.`
      );

      onStrategyComplete();
    }
  }, [incomingStrategy]);

  const [showModal, setShowModal] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(null);
  const [viewingProfile, setViewingProfile] = React.useState(null);
  const [viewingPin, setViewingPin] = React.useState(null);

  const [formData, setFormData] = React.useState({
    name: "",
    age: "",
    contact: "",
    role: "Server",
    email: "",
    address: "",
    emergency: "",
    joiningDate: "",
    salary: "",
  });

  const calculateEarnings = (salary, hours) => {
    const hourlyRate = parseFloat(salary || 0) / BASE_HOURS;
    return (hourlyRate * (hours || 0)).toLocaleString("en-IN", {
      maximumFractionDigits: 0,
      style: "currency",
      currency: "INR",
    });
  };

  const saveToDatabase = () => {
    localStorage.setItem("spice_garden_staff", JSON.stringify(team));
    alert("Estate Registry Synchronized.");
  };

  const openEditModal = (member) => {
    setFormData(member);
    setIsEditing(member.id);
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditing) {
      setTeam((prev) =>
        prev.map((m) => (m.id === isEditing ? { ...m, ...formData } : m))
      );
    } else {
      const generatedPin = Math.floor(1000 + Math.random() * 9000).toString();
      setTeam((prev) => [
        {
          ...formData,
          id: Date.now(),
          status: "Inactive",
          totalHours: 0,
          lastClockIn: null,
          performance: "100%",
          pin: generatedPin,
        },
        ...prev,
      ]);
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(null);
    setFormData({
      name: "",
      age: "",
      contact: "",
      role: "Server",
      email: "",
      address: "",
      emergency: "",
      joiningDate: "",
      salary: "",
    });
  };

  const deleteStaff = (id) => {
    if (window.confirm("Terminate contract? This action is permanent.")) {
      setTeam((prev) => prev.filter((m) => m.id !== id));
      setViewingProfile(null);
    }
  };

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
            Personnel
          </span>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.8rem",
              margin: "5px 0 0",
              fontWeight: "300",
            }}
          >
            The <span style={{ color: "#B5862A" }}>Staff Registry</span>
          </h2>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={saveToDatabase} style={btnStyleSecondary}>
            SAVE SYNC
          </button>
          <button onClick={() => setShowModal(true)} style={btnStylePrimary}>
            + ONBOARDING
          </button>
        </div>
      </div>

      {/* --- COMPACT STAFF GRID --- */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {team.map((member) => (
          <Card
            key={member.id}
            style={{
              background: "#FFF",
              border: "1px solid #EEE",
              padding: "1.8rem 1.5rem",
              position: "relative",
              boxShadow: "0 8px 30px rgba(0,0,0,0.02)",
            }}
          >
            <button onClick={() => openEditModal(member)} style={editBtnStyle}>
              <EditIcon />
            </button>
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "30px",
                height: "3px",
                background: "#B5862A",
              }}
            />
            <div
              style={{
                display: "flex",
                gap: "12px",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <div style={avatarStyle}>{member.name.charAt(0)}</div>
              <div>
                <div
                  style={{ fontWeight: "600", fontSize: "1rem", color: "#111" }}
                >
                  {member.name}
                </div>
                <div
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: "800",
                    color: "#B5862A",
                    letterSpacing: "1px",
                  }}
                >
                  {member.role.toUpperCase()}
                </div>
              </div>
            </div>
            <div
              style={{
                ...shiftToggleStyle,
                textAlign: "center",
                background: member.status === "Active" ? "#2d7a5f" : "#F1F1F1",
                color: member.status === "Active" ? "#FFF" : "#999",
                cursor: "default",
              }}
            >
              {member.status === "Active" ? "● ON DUTY" : "OFF DUTY"}
            </div>
            <div style={dataRowStyle}>
              <div>
                <div style={smallLabel}>HOURS</div>
                <div style={dataVal}>{member.totalHours || 0}</div>
              </div>
              <div>
                <div style={smallLabel}>EARNED</div>
                <div style={{ ...dataVal, color: "#B5862A" }}>
                  {calculateEarnings(member.salary, member.totalHours)}
                </div>
              </div>
            </div>
            <div style={{ display: "flex", gap: "8px", marginTop: "1.5rem" }}>
              <button
                onClick={() => setViewingProfile(member)}
                style={btnStyleAction}
              >
                PROFILE
              </button>
              <button
                onClick={() => setViewingPin(member)}
                style={btnStyleAction}
              >
                PIN
              </button>
            </div>
          </Card>
        ))}
      </div>

      {/* --- MODALS --- */}

      {/* 1. SECURITY PIN MODAL */}
      {viewingPin && (
        <div style={overlayStyle} onClick={() => setViewingPin(null)}>
          <div
            style={{
              ...modalStyle,
              maxWidth: "320px",
              textAlign: "center",
              position: "relative",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setViewingPin(null)}
              style={{
                ...closeBtnStyle,
                position: "absolute",
                top: "15px",
                right: "15px",
              }}
            >
              ×
            </button>
            <span style={labelStyle}>SECURITY AUTHENTICATION</span>
            <div style={pinBoxStyle}>{viewingPin.pin}</div>
            <button
              onClick={() => setViewingPin(null)}
              style={{ ...btnStylePrimary, width: "100%" }}
            >
              DISMISS
            </button>
          </div>
        </div>
      )}

      {/* 2. PROFILE MODAL */}
      {viewingProfile && (
        <div style={overlayStyle} onClick={() => setViewingProfile(null)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "2rem",
                alignItems: "center",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "2.2rem",
                  margin: 0,
                }}
              >
                {viewingProfile.name}
              </h3>
              <button
                onClick={() => setViewingProfile(null)}
                style={closeBtnStyle}
              >
                ×
              </button>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div
                style={{
                  gridColumn: "span 2",
                  background: "#FDFCF8",
                  padding: "20px",
                  borderLeft: "4px solid #B5862A",
                  boxShadow: "inset 0 0 10px rgba(0,0,0,0.02)",
                  marginBottom: "10px",
                }}
              >
                <div style={smallLabel}>ESTATE AUDIT DOSSIER</div>
                <div
                  style={{
                    fontSize: "0.6rem",
                    fontWeight: "900",
                    color: "#B5862A",
                    letterSpacing: "1px",
                    marginBottom: "5px",
                  }}
                >
                  PAYROLL DISBURSEMENT AUDIT
                </div>
                <div
                  style={{
                    fontSize: "1.8rem",
                    fontFamily: "'Cormorant Garamond', serif",
                    color: "#111",
                    lineHeight: "1",
                  }}
                >
                  {calculateEarnings(
                    viewingProfile.salary,
                    viewingProfile.totalHours
                  )}
                </div>
                <div
                  style={{
                    fontSize: "0.6rem",
                    color: "#999",
                    marginTop: "8px",
                    fontStyle: "italic",
                  }}
                >
                  Total lifetime earnings computed based on{" "}
                  {viewingProfile.totalHours || 0} service hours.
                </div>
              </div>
              <ProfileItem label="EMAIL" value={viewingProfile.email} />
              <ProfileItem label="CONTACT" value={viewingProfile.contact} />
              <ProfileItem
                label="MONTHLY BASE"
                value={`₹${viewingProfile.salary}`}
              />
              <ProfileItem label="JOINING" value={viewingProfile.joiningDate} />
              <div style={{ gridColumn: "span 2" }}>
                <ProfileItem label="ADDRESS" value={viewingProfile.address} />
              </div>
            </div>
            <button
              onClick={() => deleteStaff(viewingProfile.id)}
              style={btnTerminate}
            >
              TERMINATE CONTRACT
            </button>
          </div>
        </div>
      )}

      {/* 3. ONBOARDING / EDIT MODAL */}
      {showModal && (
        <div style={overlayStyle} onClick={closeModal}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "2rem",
                alignItems: "center",
              }}
            >
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "2rem",
                  margin: 0,
                }}
              >
                {isEditing ? "Modify Personnel" : "Onboard Professional"}
              </h3>
              <button onClick={closeModal} style={closeBtnStyle}>
                ×
              </button>
            </div>
            <form
              onSubmit={handleSubmit}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "20px",
              }}
            >
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>FULL LEGAL NAME</label>
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
                <label style={labelStyle}>PRIMARY CONTACT</label>
                <input
                  required
                  style={inputStyle}
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>ROLE</label>
                <select
                  style={inputStyle}
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <label style={labelStyle}>EMAIL ADDRESS</label>
                <input
                  required
                  type="email"
                  style={inputStyle}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>MONTHLY SALARY</label>
                <input
                  required
                  type="number"
                  style={inputStyle}
                  value={formData.salary}
                  onChange={(e) =>
                    setFormData({ ...formData, salary: e.target.value })
                  }
                />
              </div>
              <div>
                <label style={labelStyle}>JOINING DATE</label>
                <input
                  required
                  type="date"
                  style={inputStyle}
                  value={formData.joiningDate}
                  onChange={(e) =>
                    setFormData({ ...formData, joiningDate: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                style={{
                  ...btnStylePrimary,
                  gridColumn: "span 2",
                  padding: "15px",
                  marginTop: "10px",
                }}
              >
                {isEditing ? "SYNCHRONIZE RECORDS" : "CONFIRM ONBOARDING"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// --- STYLES ---
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
const avatarStyle = {
  width: "45px",
  height: "45px",
  borderRadius: "50%",
  background: "#FDFCF8",
  color: "#B5862A",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.2rem",
  fontFamily: "'Cormorant Garamond', serif",
  border: "1px solid #EEE",
};
const shiftToggleStyle = {
  width: "100%",
  padding: "10px",
  border: "none",
  borderRadius: "4px",
  fontSize: "0.6rem",
  fontWeight: "900",
  letterSpacing: "1.5px",
  marginBottom: "1.2rem",
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
  fontWeight: "300",
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
const btnStyleSecondary = {
  padding: "10px 20px",
  background: "transparent",
  color: "#B5862A",
  border: "1px solid #B5862A",
  borderRadius: "4px",
  fontSize: "0.6rem",
  fontWeight: "800",
  cursor: "pointer",
  letterSpacing: "1px",
};
const btnStyleAction = {
  flex: 1,
  padding: "8px",
  background: "transparent",
  border: "1px solid #EEE",
  color: "#666",
  fontSize: "0.6rem",
  fontWeight: "800",
  cursor: "pointer",
};
const overlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(255,255,255,0.8)",
  backdropFilter: "blur(10px)",
  zIndex: 3000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const modalStyle = {
  background: "#FFF",
  width: "90%",
  maxWidth: "550px",
  border: "1px solid #B5862A",
  padding: "2.5rem",
  boxShadow: "0 30px 60px rgba(0,0,0,0.05)",
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
  color: "#111",
  outline: "none",
  boxSizing: "border-box",
};
const pinBoxStyle = {
  background: "#111",
  color: "#B5862A",
  padding: "20px",
  fontSize: "2.5rem",
  letterSpacing: "15px",
  borderRadius: "8px",
  margin: "20px 0",
  fontFamily: "monospace",
};
const closeBtnStyle = {
  background: "none",
  border: "none",
  fontSize: "1.8rem",
  cursor: "pointer",
  color: "#B5862A",
  fontWeight: "200",
};
const btnTerminate = {
  width: "100%",
  marginTop: "2rem",
  padding: "12px",
  background: "transparent",
  border: "1px solid #ef4444",
  color: "#ef4444",
  fontSize: "0.6rem",
  fontWeight: "900",
  cursor: "pointer",
};

const ProfileItem = ({ label, value }) => (
  <div>
    <div
      style={{
        fontSize: "0.55rem",
        fontWeight: "900",
        color: "#BBB",
        letterSpacing: "1.5px",
        marginBottom: "4px",
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: "0.9rem", color: "#111" }}>{value || "—"}</div>
  </div>
);
