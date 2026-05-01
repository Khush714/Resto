import * as React from "react";
import { Card, Chip } from "./App";

export const AuraStudio = ({ menu, orders, customers, recipes, inventory }) => {
  const [isSending, setIsSending] = React.useState(false);

  // --- AI LOGIC: IDENTIFY THE "STAR DISH" (High Margin + High Volume) ---
  const starDish = React.useMemo(() => {
    return menu
      .map((dish) => {
        const recipe = recipes.find(
          (r) => String(r.menuId) === String(dish.id)
        );
        const rawCost = recipe
          ? recipe.ingredients.reduce((sum, ing) => {
              const invItem = inventory.find((i) => i.id === ing.id);
              return sum + parseFloat(ing.qty) * (invItem?.costPerUnit || 0);
            }, 0)
          : 0;
        const margin = ((dish.price - rawCost) / dish.price) * 100;
        const salesVolume = orders.filter((o) =>
          o.items.some((i) => i.name === dish.name)
        ).length;
        return { ...dish, margin, salesVolume, score: margin * salesVolume };
      })
      .sort((a, b) => b.score - a.score)[0];
  }, [menu, orders, recipes, inventory]);

  const handleCommandSend = () => {
    setIsSending(true);
    // Targeting top Elite customers (First 5 for prototype)
    const targets = customers.slice(0, 5);

    const campaignMessage =
      `*SPICE GARDEN EXCLUSIVE*\n\n` +
      `Our Signature ${starDish.name} is the talk of Bharuch this week! 🌟\n\n` +
      `Experience the perfect blend of premium ingredients and heritage spice.\n\n` +
      `*Price:* ₹${starDish.price}\n` +
      `*Order Now:* spicegarden.com/menu`;

    targets.forEach((guest, index) => {
      setTimeout(() => {
        const url = `https://wa.me/${guest.phone}?text=${encodeURIComponent(
          campaignMessage
        )}`;
        window.open(url, "_blank");
        if (index === targets.length - 1) setIsSending(false);
      }, index * 1200);
    });
  };

  return (
    <div style={studioWrapper}>
      <div style={header}>
        <span style={superLabel}>Aura Design Studio</span>
        <h2 style={title}>Campaign Creator</h2>
      </div>

      <div style={mainGrid}>
        {/* BROCHURE PREVIEW (Architectural Design) */}
        <div style={flyerPreview}>
          <div style={flyerContent}>
            <div style={flyerOverlay}>
              <span style={flyerTag}>PREMIUM RECOMMENDATION</span>
              <h1 style={flyerDishName}>{starDish.name.toUpperCase()}</h1>
              <div style={flyerDivider} />
              <p style={flyerDesc}>
                A masterclass in culinary texture and heritage spice, curated
                for Bharuch's elite palate.
              </p>
              <div style={flyerPrice}>₹{starDish.price}</div>
            </div>
          </div>
        </div>

        {/* CAMPAIGN CONTROLS */}
        <div style={sidebar}>
          <Card style={intelCard}>
            <h3 style={sectionTitle}>STRATEGIC ASSET INTEL</h3>
            <div style={statRow}>
              <span>PROFIT MARGIN</span>
              <span style={goldValue}>{starDish.margin.toFixed(0)}%</span>
            </div>
            <div style={statRow}>
              <span>REACH TARGET</span>
              <span style={goldValue}>{customers.length} Contacts</span>
            </div>
            <p style={analystNote}>
              Aura has identified **{starDish.name}** as your highest performing
              asset. Launching this campaign will optimize weekend yield.
            </p>

            <button
              onClick={handleCommandSend}
              style={sendBtn(isSending)}
              disabled={isSending}
            >
              {isSending ? "DISPATCHING..." : "COMMAND SEND (WHATSAPP)"}
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

// --- STYLES ---
const studioWrapper = { animation: "fadeUp 0.6s ease", padding: "2rem" };
const header = { marginBottom: "3rem" };
const superLabel = {
  fontSize: "0.6rem",
  fontWeight: "800",
  color: "#b5862a",
  letterSpacing: "4px",
  textTransform: "uppercase",
};
const title = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "3rem",
  fontWeight: "300",
  margin: "10px 0",
};
const mainGrid = {
  display: "grid",
  gridTemplateColumns: "1.5fr 1fr",
  gap: "40px",
};
const flyerPreview = {
  background: "#1a1612",
  height: "520px",
  borderRadius: "4px",
  padding: "40px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(181, 134, 42, 0.4)",
  boxShadow: "0 30px 60px rgba(0,0,0,0.4)",
};
const flyerContent = {
  border: "1px solid rgba(181, 134, 42, 0.2)",
  width: "100%",
  height: "100%",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  padding: "40px",
  textAlign: "center",
};
const flyerDishName = {
  fontFamily: "'Cormorant Garamond', serif",
  color: "#fff",
  fontSize: "3.5rem",
  margin: "20px 0",
  letterSpacing: "5px",
};
const flyerTag = {
  color: "#b5862a",
  fontSize: "0.6rem",
  letterSpacing: "4px",
  fontWeight: "900",
};
const flyerDivider = {
  width: "40px",
  height: "2px",
  background: "#b5862a",
  margin: "0 auto 20px",
};
const flyerDesc = {
  color: "rgba(255,255,255,0.6)",
  fontSize: "0.9rem",
  maxWidth: "300px",
  margin: "0 auto",
  lineHeight: "1.6",
};
const flyerPrice = {
  color: "#fff",
  fontSize: "1.5rem",
  marginTop: "30px",
  fontWeight: "300",
  letterSpacing: "3px",
};
const intelCard = { background: "#fff", padding: "30px", borderRadius: "4px" };
const sectionTitle = {
  fontSize: "0.7rem",
  fontWeight: "900",
  letterSpacing: "2px",
  marginBottom: "20px",
};
const statRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "15px 0",
  borderBottom: "1px solid #f9f9f9",
  fontSize: "0.8rem",
};
const goldValue = { fontWeight: "900", color: "#b5862a" };
const analystNote = {
  fontSize: "0.8rem",
  color: "#666",
  lineHeight: "1.5",
  margin: "25px 0",
};
const sendBtn = (active) => ({
  width: "100%",
  background: active ? "#333" : "#1a1612",
  color: "#b5862a",
  border: "1px solid #b5862a",
  padding: "15px",
  borderRadius: "2px",
  fontWeight: "900",
  fontSize: "0.7rem",
  cursor: active ? "default" : "pointer",
  letterSpacing: "2px",
});
