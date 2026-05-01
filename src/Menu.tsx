import * as React from "react";
import { Card, Chip, DietIcon, CATEGORIES } from "./App";

export const Menu = ({
  menu,
  setMenu,
  onSave,
  incomingStrategy, // Handshake from AURA
  onStrategyComplete, // Cleanup signal
}) => {
  const [editingItem, setEditingItem] = React.useState(null);
  const [activeCategory, setActiveCategory] = React.useState("All");
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [newItem, setNewItem] = React.useState({
    name: "",
    price: "",
    isVeg: true,
    category: "Starters",
    description: "",
  });

  // --- AURA GHOST MENU LOGIC ---
  React.useEffect(() => {
    if (incomingStrategy?.type === "ADD_MENU_ITEM") {
      const { name, price, category } = incomingStrategy;

      const matchedCategory =
        CATEGORIES.find((cat) =>
          cat.toLowerCase().includes(category.toLowerCase())
        ) || "Main Course";

      const ghostItem = {
        id: Date.now(),
        name: name,
        price: Number(price) || 0,
        isVeg: true,
        category: matchedCategory,
        description: `Signature ${name} added via AURA Intelligence.`,
        available: true,
        img: "🍽️",
      };

      const updatedMenu = [...menu, ghostItem];
      setMenu(updatedMenu);

      if (onSave) onSave();
      alert(`AURA: ${ghostItem.name} has been added and synced.`);
      onStrategyComplete();
    }
  }, [incomingStrategy]);

  const filteredMenu = menu.filter(
    (i) => activeCategory === "All" || i.category === activeCategory
  );

  // --- DELETE LOGIC ---
  const handleDeleteItem = (id) => {
    if (
      window.confirm("Are you sure you want to permanently remove this dish?")
    ) {
      const updatedMenu = menu.filter((item) => item.id !== id);
      setMenu(updatedMenu);
      if (onSave) onSave(); // Sync immediately after deletion
      setEditingItem(null); // Close modal if open
    }
  };

  // --- AI ORCHESTRATION ENGINE ---
  const generateAIDescription = async (item, isNew = false) => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const highEndAdjectives = [
      "Artisanal",
      "Hand-crafted",
      "Signature",
      "Oak-smoked",
      "Infused",
      "Slow-simmered",
    ];
    const descriptions = {
      Starters: `A minimalist expression of ${item.name}, highlighting pure textures and subtle spice notes.`,
      "Main Course": `Our definitive ${item.name}. Meticulously prepared using traditional techniques.`,
      Desserts: `A velvet-textured ${item.name} providing a sophisticated, indulgent conclusion.`,
      Breads: `Freshly fired and lightly brushed with gold-standard ghee.`,
      Beverages: `Crisp and artfully balanced refreshing sensory lift.`,
    };

    const adj =
      highEndAdjectives[Math.floor(Math.random() * highEndAdjectives.length)];
    const result = `${adj}: ${
      descriptions[item.category] || `The quintessential ${item.name}.`
    }`;

    if (isNew) setNewItem({ ...newItem, description: result });
    else setEditingItem({ ...editingItem, description: result });
    setIsGenerating(false);
  };

  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) return;
    setMenu([
      ...menu,
      {
        ...newItem,
        id: Date.now(),
        available: true,
        price: Number(newItem.price),
        img: "🍽️",
      },
    ]);
    setNewItem({
      name: "",
      price: "",
      isVeg: true,
      category: "Starters",
      description: "",
    });
  };

  return (
    <div style={{ animation: "fadeUp .3s ease", paddingBottom: "50px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.2rem",
              fontWeight: "400",
              margin: 0,
            }}
          >
            Menu Architecture
          </h2>
          <p
            style={{
              color: "#888",
              fontSize: "0.65rem",
              letterSpacing: "1px",
              fontWeight: "700",
            }}
          >
            INVENTORY & CONTENT CONTROL
          </p>
        </div>
        <button onClick={onSave} style={syncBtnStyle}>
          💾 SAVE MASTER SYNC
        </button>
      </div>

      {/* QUICK ADD */}
      <Card
        style={{
          marginBottom: "2rem",
          border: "1px dashed #ccc",
          background: "#fafafa",
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <input
            placeholder="Dish Name"
            value={newItem.name}
            onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
            style={inputFieldStyle}
          />
          <input
            placeholder="₹"
            type="number"
            value={newItem.price}
            onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
            style={{ ...inputFieldStyle, width: "90px" }}
          />
          <select
            value={newItem.category}
            onChange={(e) =>
              setNewItem({ ...newItem, category: e.target.value })
            }
            style={{ ...inputFieldStyle, flex: 1, background: "#fff" }}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <button onClick={handleAddItem} style={addBtnStyle}>
            + ADD DISH
          </button>
        </div>
      </Card>

      {/* CATEGORY NAV */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "2rem",
          overflowX: "auto",
          paddingBottom: "10px",
        }}
      >
        {["All", ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: "10px 22px",
              borderRadius: "25px",
              border: "1px solid #1a1612",
              fontSize: "0.7rem",
              fontWeight: "800",
              cursor: "pointer",
              background: activeCategory === cat ? "#1a1612" : "#fff",
              color: activeCategory === cat ? "#fff" : "#1a1612",
            }}
          >
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* INVENTORY TABLE */}
      <div style={tableContainerStyle}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
          }}
        >
          <thead>
            <tr
              style={{ background: "#fafafa", borderBottom: "1px solid #eee" }}
            >
              <th style={thStyle}>DISH</th>
              <th style={thStyle}>CATEGORY</th>
              <th style={thStyle}>STATUS</th>
              <th style={thStyle}>PRICE</th>
              <th style={{ ...thStyle, textAlign: "right" }}>CONTROL</th>
            </tr>
          </thead>
          <tbody>
            {filteredMenu.map((item) => (
              <tr
                key={item.id}
                style={{
                  borderBottom: "1px solid #f9f9f9",
                  opacity: item.available ? 1 : 0.6,
                }}
              >
                <td style={{ padding: "1.2rem" }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <DietIcon isVeg={item.isVeg} />
                    <div>
                      <b style={{ color: "#1a1612", fontSize: "0.9rem" }}>
                        {item.name}
                      </b>
                    </div>
                  </div>
                </td>
                <td style={{ padding: "1.2rem" }}>
                  <span style={categoryTagStyle}>
                    {item.category.toUpperCase()}
                  </span>
                </td>
                <td style={{ padding: "1.2rem" }}>
                  {item.available ? (
                    <StatusBadge color="#2d7a5f" bg="#e8f5e9" label="ACTIVE" />
                  ) : (
                    <StatusBadge color="#b84040" bg="#ffebee" label="86'D" />
                  )}
                </td>
                <td style={{ padding: "1.2rem", fontWeight: "700" }}>
                  ₹{item.price}
                </td>
                <td style={{ padding: "1.2rem", textAlign: "right" }}>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                      justifyContent: "flex-end",
                    }}
                  >
                    <button
                      onClick={() => setEditingItem(item)}
                      style={editBtnStyle}
                    >
                      EDIT
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      style={deleteIconBtnStyle}
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* EDIT MODAL */}
      {editingItem && (
        <div style={modalOverlayStyle}>
          <Card
            style={{
              width: "90%",
              maxWidth: "450px",
              border: "none",
              padding: "2rem",
              animation: "fadeUp .3s ease",
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
              <h3
                style={{
                  margin: 0,
                  fontWeight: "500",
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.8rem",
                }}
              >
                Modify Selection
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                style={closeBtnStyle}
              >
                ×
              </button>
            </div>

            <div
              style={{ display: "flex", flexDirection: "column", gap: "18px" }}
            >
              <div>
                <label style={labelStyle}>DISH NAME</label>
                <input
                  value={editingItem.name}
                  onChange={(e) =>
                    setEditingItem({ ...editingItem, name: e.target.value })
                  }
                  style={modalInputStyle}
                />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>PRICE</label>
                  <input
                    type="number"
                    value={editingItem.price}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        price: Number(e.target.value),
                      })
                    }
                    style={modalInputStyle}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>CATEGORY</label>
                  <select
                    value={editingItem.category}
                    onChange={(e) =>
                      setEditingItem({
                        ...editingItem,
                        category: e.target.value,
                      })
                    }
                    style={{ ...modalInputStyle, background: "white" }}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <label style={labelStyle}>LUXURY DESCRIPTION</label>
                  <button
                    onClick={() => generateAIDescription(editingItem)}
                    disabled={isGenerating}
                    style={aiBtnStyle}
                  >
                    {isGenerating ? "ORCHESTRATING..." : "✨ AI WRITE"}
                  </button>
                </div>
                <textarea
                  placeholder="Generate a premium description..."
                  value={editingItem.description || ""}
                  onChange={(e) =>
                    setEditingItem({
                      ...editingItem,
                      description: e.target.value,
                    })
                  }
                  style={textareaStyle}
                />
              </div>

              <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                <ToggleButton
                  active={editingItem.isVeg}
                  onClick={() =>
                    setEditingItem({
                      ...editingItem,
                      isVeg: !editingItem.isVeg,
                    })
                  }
                  labels={["VEGETARIAN", "NON-VEG"]}
                />
                <ToggleButton
                  active={editingItem.available}
                  onClick={() =>
                    setEditingItem({
                      ...editingItem,
                      available: !editingItem.available,
                    })
                  }
                  labels={["STOCK: LIVE", "STOCK: 86'D"]}
                />
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  marginTop: "10px",
                }}
              >
                <button
                  onClick={() => {
                    setMenu(
                      menu.map((i) =>
                        i.id === editingItem.id ? editingItem : i
                      )
                    );
                    setEditingItem(null);
                    if (onSave) onSave();
                  }}
                  style={updateBtnStyle}
                >
                  Confirm Update
                </button>
                <button
                  onClick={() => handleDeleteItem(editingItem.id)}
                  style={deleteFullBtnStyle}
                >
                  Delete Dish Permanently
                </button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

// --- STYLED SUB-COMPONENTS ---
const StatusBadge = ({ color, bg, label }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: "6px",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "0.6rem",
      fontWeight: "800",
      background: bg,
      color: color,
      border: `1px solid ${color}22`,
    }}
  >
    <span
      style={{
        width: "5px",
        height: "5px",
        borderRadius: "50%",
        background: color,
      }}
    />
    {label}
  </span>
);

const ToggleButton = ({ active, onClick, labels }) => (
  <button
    onClick={onClick}
    style={{
      flex: 1,
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #eee",
      color: active ? "#2d7a5f" : "#b84040",
      background: "none",
      fontSize: "0.65rem",
      fontWeight: "900",
      cursor: "pointer",
    }}
  >
    {active ? labels[0] : labels[1]}
  </button>
);

// --- STYLES ---
const syncBtnStyle = {
  background: "#1a1612",
  color: "#b5862a",
  padding: "12px 24px",
  borderRadius: "10px",
  border: "1px solid #b5862a",
  fontWeight: "700",
  cursor: "pointer",
  fontSize: "0.75rem",
};
const inputFieldStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #eee",
  fontSize: "0.85rem",
  outline: "none",
};
const addBtnStyle = {
  background: "#1a1612",
  color: "white",
  padding: "12px 25px",
  borderRadius: "8px",
  border: "none",
  fontWeight: "700",
  cursor: "pointer",
  fontSize: "0.75rem",
};
const tableContainerStyle = {
  background: "#fff",
  borderRadius: "16px",
  border: "1px solid #eee",
  overflow: "hidden",
  boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
};
const thStyle = {
  padding: "1.2rem",
  fontSize: "0.65rem",
  color: "#999",
  fontWeight: "800",
  letterSpacing: "1.2px",
};
const categoryTagStyle = {
  fontSize: "0.65rem",
  fontWeight: "800",
  color: "#b5862a",
  letterSpacing: "0.5px",
};
const editBtnStyle = {
  background: "none",
  border: "1px solid #eee",
  padding: "6px 15px",
  borderRadius: "6px",
  fontSize: "0.65rem",
  fontWeight: "800",
  cursor: "pointer",
  color: "#666",
};
const deleteIconBtnStyle = {
  background: "none",
  border: "1px solid #ffebee",
  padding: "6px 10px",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "0.2s",
};
const modalOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(26,22,18,0.7)",
  backdropFilter: "blur(8px)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const labelStyle = {
  fontSize: "0.6rem",
  fontWeight: "900",
  color: "#bbb",
  letterSpacing: "1px",
  display: "block",
  marginBottom: "5px",
};
const modalInputStyle = {
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #eee",
  width: "100%",
  boxSizing: "border-box",
  outline: "none",
  fontSize: "0.9rem",
};
const textareaStyle = {
  width: "100%",
  height: "90px",
  border: "1px solid #eee",
  borderRadius: "8px",
  padding: "12px",
  fontSize: "0.75rem",
  color: "#666",
  fontStyle: "italic",
  resize: "none",
  outline: "none",
  boxSizing: "border-box",
};
const aiBtnStyle = {
  background: "#1a1612",
  color: "#b5862a",
  border: "1px solid #b5862a",
  padding: "4px 10px",
  borderRadius: "4px",
  fontSize: "0.55rem",
  fontWeight: "900",
  cursor: "pointer",
};
const closeBtnStyle = {
  background: "none",
  border: "none",
  color: "#ccc",
  cursor: "pointer",
  fontSize: "1.5rem",
};
const updateBtnStyle = {
  background: "#1a1612",
  color: "#b5862a",
  padding: "14px",
  borderRadius: "10px",
  border: "1px solid #b5862a",
  fontWeight: "800",
  fontSize: "0.8rem",
  cursor: "pointer",
};
const deleteFullBtnStyle = {
  background: "#fff",
  color: "#b84040",
  padding: "12px",
  borderRadius: "10px",
  border: "1px solid #b84040",
  fontWeight: "800",
  fontSize: "0.7rem",
  cursor: "pointer",
};
