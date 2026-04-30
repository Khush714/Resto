import * as React from "react";
import { Card, Chip } from "./App";

export const Inventory = ({
  inventory,
  setInventory,
  incomingStrategy,
  onStrategyComplete,
}) => {
  // --- AURA HANDSHAKE ---
  React.useEffect(() => {
    if (!incomingStrategy) return;

    if (incomingStrategy.type === "UPDATE_STOCK") {
      const { name, quantity } = incomingStrategy;
      const updated = inventory.map((item) =>
        item.name.toLowerCase().includes(name.toLowerCase())
          ? { ...item, currentStock: quantity }
          : item
      );
      setInventory(updated);
      onStrategyComplete();
    }
  }, [incomingStrategy, inventory, setInventory, onStrategyComplete]);

  // --- ANALYST CALCULATIONS ---
  const totalAssetValue = inventory.reduce(
    (acc, item) => acc + item.currentStock * item.costPerUnit,
    0
  );

  const dailyCogs = inventory.reduce((acc, item) => {
    const consumed = Math.max(0, item.openingStock - item.currentStock);
    return acc + consumed * item.costPerUnit;
  }, 0);

  // --- NEW: WHATSAPP PO GENERATOR ---
  const generateWhatsAppPO = () => {
    // Filter for items that have hit or dropped below their safety threshold
    const lowStockItems = inventory.filter(
      (item) => item.currentStock <= (item.minThreshold || 0)
    );

    if (lowStockItems.length === 0) {
      return alert("All stock levels are healthy! No order needed.");
    }

    let message = `*SPICE GARDEN - PURCHASE ORDER*\n`;
    message += `Date: ${new Date().toLocaleDateString("en-IN")}\n`;
    message += `--------------------------\n`;

    lowStockItems.forEach((item) => {
      // Logic: Restock enough to reach 3x the threshold
      const orderQty = item.minThreshold * 3 - item.currentStock;
      message += `• ${item.name}: ${orderQty.toFixed(1)} ${item.unit}\n`;
    });

    message += `--------------------------\n`;
    message += `_Generated via Spice Garden BI_`;

    const encodedMsg = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMsg}`, "_blank");
  };

  const handleAddItem = () => {
    const name = prompt("Enter Ingredient Name:");
    if (!name) return;
    const unit = prompt("Enter Unit (e.g., kg, L, pkt):", "kg");
    const cost = prompt("Enter Cost Per Unit (₹):", "0");
    const stock = prompt("Enter Initial Opening Stock:", "0");
    const threshold = prompt("Enter Safety Threshold (Min Stock):", "5");

    const newItem = {
      id: `ING-${Date.now().toString().slice(-4)}`,
      name,
      unit,
      costPerUnit: parseFloat(cost || 0),
      openingStock: parseFloat(stock || 0),
      currentStock: parseFloat(stock || 0),
      minThreshold: parseFloat(threshold || 5),
    };

    setInventory([...inventory, newItem]);
  };

  const handleDeleteItem = (id, name) => {
    if (window.confirm(`Permanently remove ${name} from inventory?`)) {
      setInventory(inventory.filter((item) => item.id !== id));
    }
  };

  const handleManualAudit = (id, currentVal) => {
    const newVal = prompt("Physical Count Adjustment:", currentVal);
    if (newVal !== null && !isNaN(newVal)) {
      const updated = inventory.map((item) =>
        item.id === id ? { ...item, currentStock: parseFloat(newVal) } : item
      );
      setInventory(updated);
    }
  };

  return (
    <div style={inventoryPageWrapper}>
      {/* TOP ANALYTICS BAR */}
      <div style={supplyHeader}>
        <div style={{ display: "flex", gap: "40px" }}>
          <div style={assetBrief}>
            <span style={briefLabel}>TOTAL ASSET VALUE</span>
            <span style={briefValue}>₹{totalAssetValue.toLocaleString()}</span>
          </div>

          <div style={assetBrief}>
            <span style={{ ...briefLabel, color: "#b84040" }}>
              ACTUAL COGS (BURN)
            </span>
            <span style={{ ...briefValue, color: "#b84040" }}>
              ₹{dailyCogs.toLocaleString()}
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {/* NEW PO BUTTON */}
          <button onClick={generateWhatsAppPO} style={poBtn}>
            📱 WHATSAPP PO
          </button>
          <button onClick={handleAddItem} style={addItemBtn}>
            + ADD ASSET
          </button>
        </div>
      </div>

      {/* THE LEDGER TABLE */}
      <div style={ledgerContainer}>
        <table style={ledgerTable}>
          <thead>
            <tr style={tableHeaderRow}>
              <th style={thStyle}>INGREDIENT</th>
              <th style={thStyle}>UNIT COST</th>
              <th style={thStyle}>CURRENT STOCK</th>
              <th style={thStyle}>ORDER STATUS</th>
              <th style={{ ...thStyle, textAlign: "right" }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => {
              const isLow = item.currentStock <= (item.minThreshold || 0);
              const stockRatio = (item.currentStock / item.openingStock) * 100;

              return (
                <tr key={item.id} style={tableRowStyle}>
                  <td style={tdStyle}>
                    <div style={itemName}>{item.name}</div>
                    <div style={itemId}>{item.id}</div>
                  </td>
                  <td style={tdStyle}>
                    ₹{item.costPerUnit} / {item.unit}
                  </td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        fontWeight: "900",
                        color: isLow ? "#b84040" : "#1a1612",
                      }}
                    >
                      {item.currentStock} {item.unit}
                    </span>
                  </td>
                  <td style={tdStyle}>
                    {isLow ? (
                      <Chip color="red">RE-ORDER NOW</Chip>
                    ) : (
                      <Chip color="green">STABLE</Chip>
                    )}
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "8px",
                        justifyContent: "flex-end",
                      }}
                    >
                      <button
                        onClick={() =>
                          handleManualAudit(item.id, item.currentStock)
                        }
                        style={actionBtn}
                      >
                        AUDIT
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id, item.name)}
                        style={deleteBtn}
                      >
                        ✕
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

// --- STYLES ---
const inventoryPageWrapper = { animation: "fadeUp 0.4s ease" };
const supplyHeader = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "2rem",
  padding: "1.5rem",
  background: "#fff",
  borderRadius: "12px",
  border: "1px solid #eee",
};
const assetBrief = { display: "flex", flexDirection: "column", gap: "4px" };
const briefLabel = {
  fontSize: "0.6rem",
  fontWeight: "800",
  color: "#999",
  letterSpacing: "1px",
};
const briefValue = {
  fontSize: "1.8rem",
  fontWeight: "600",
  fontFamily: "'Cormorant Garamond', serif",
};
const poBtn = {
  background: "#25D366",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  fontSize: "0.7rem",
  fontWeight: "800",
  cursor: "pointer",
  letterSpacing: "1px",
};
const addItemBtn = {
  background: "#1a1612",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "8px",
  fontSize: "0.7rem",
  fontWeight: "700",
  cursor: "pointer",
};
const ledgerContainer = {
  background: "#fff",
  borderRadius: "12px",
  border: "1px solid #eee",
  overflow: "hidden",
};
const ledgerTable = { width: "100%", borderCollapse: "collapse" };
const tableHeaderRow = {
  background: "#f9f9f9",
  borderBottom: "1px solid #eee",
};
const thStyle = {
  padding: "15px 25px",
  textAlign: "left",
  fontSize: "0.65rem",
  fontWeight: "900",
  color: "#aaa",
  textTransform: "uppercase",
};
const tableRowStyle = { borderBottom: "1px solid #eee" };
const tdStyle = {
  padding: "20px 25px",
  fontSize: "0.85rem",
  verticalAlign: "middle",
};
const itemName = { fontWeight: "700" };
const itemId = { fontSize: "0.65rem", color: "#999", marginTop: "2px" };
const actionBtn = {
  background: "transparent",
  border: "1px solid #eee",
  padding: "6px 16px",
  borderRadius: "6px",
  fontSize: "0.7rem",
  fontWeight: "700",
  cursor: "pointer",
};
const deleteBtn = {
  background: "rgba(184, 64, 64, 0.1)",
  border: "none",
  color: "#b84040",
  width: "30px",
  height: "30px",
  borderRadius: "6px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
};
