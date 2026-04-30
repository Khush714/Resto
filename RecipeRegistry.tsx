import * as React from "react";
import { Card } from "./App";

export const RecipeRegistry = ({ menu, inventory, recipes, setRecipes }) => {
  const [selectedDish, setSelectedDish] = React.useState(null);

  const addIngredientToRecipe = (ing) => {
    if (!selectedDish) return;
    const qty = prompt(
      `Quantity of ${ing.name} per serving (${ing.unit}):`,
      "0.1"
    );
    if (!qty) return;

    const newMapping = {
      id: ing.id,
      name: ing.name,
      qty: parseFloat(qty),
      unit: ing.unit,
    };

    const existingRecipe = recipes.find((r) => r.menuId === selectedDish.id);
    let updatedRecipes;

    if (existingRecipe) {
      updatedRecipes = recipes.map((r) =>
        r.menuId === selectedDish.id
          ? { ...r, ingredients: [...r.ingredients, newMapping] }
          : r
      );
    } else {
      updatedRecipes = [
        ...recipes,
        { menuId: selectedDish.id, ingredients: [newMapping] },
      ];
    }
    setRecipes(updatedRecipes);
  };

  const currentRecipe =
    recipes.find((r) => r.menuId === selectedDish?.id)?.ingredients || [];

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        gap: "20px",
        animation: "fadeUp 0.4s ease",
      }}
    >
      {/* LEFT: DISH SELECTOR */}
      <div style={sidebarStyle}>
        <h3 style={sectionLabel}>Select Dish</h3>
        {menu.map((dish) => (
          <div
            key={dish.id}
            onClick={() => setSelectedDish(dish)}
            style={dishItemStyle(selectedDish?.id === dish.id)}
          >
            {dish.name}
          </div>
        ))}
      </div>

      {/* RIGHT: MAPPING ZONE */}
      <div>
        {selectedDish ? (
          <Card style={{ minHeight: "500px" }}>
            <div style={headerRow}>
              <h2 style={dishTitle}>Bill of Materials: {selectedDish.name}</h2>
              <Chip color="gold">Theoretical Scaling</Chip>
            </div>

            <div style={mappingGrid}>
              {/* CURRENT COMPONENTS */}
              <div style={column}>
                <h4 style={columnTitle}>Mapped Ingredients</h4>
                {currentRecipe.length > 0 ? (
                  currentRecipe.map((ing) => (
                    <div key={ing.id} style={mappedRow}>
                      <span>{ing.name}</span>
                      <span style={qtyTag}>
                        {ing.qty} {ing.unit}
                      </span>
                    </div>
                  ))
                ) : (
                  <div style={emptyState}>No ingredients mapped yet.</div>
                )}
              </div>

              {/* PANTRY PICKER */}
              <div style={column}>
                <h4 style={columnTitle}>Add from Pantry</h4>
                <div style={pantryList}>
                  {inventory.map((ing) => (
                    <button
                      key={ing.id}
                      onClick={() => addIngredientToRecipe(ing)}
                      style={pantryBtn}
                    >
                      + {ing.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        ) : (
          <div style={placeholderState}>
            Select a dish to begin mapping raw materials.
          </div>
        )}
      </div>
    </div>
  );
};

// --- STYLES ---
const sidebarStyle = {
  background: "var(--surface)",
  padding: "1.5rem",
  borderRadius: "12px",
  border: "1px solid var(--border)",
  height: "fit-content",
};
const sectionLabel = {
  fontSize: "0.6rem",
  fontWeight: "900",
  letterSpacing: "2px",
  color: "var(--ink3)",
  textTransform: "uppercase",
  marginBottom: "1rem",
};
const dishItemStyle = (active) => ({
  padding: "12px 15px",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "0.85rem",
  fontWeight: active ? "700" : "500",
  background: active ? "var(--s2)" : "transparent",
  color: active ? "var(--gold)" : "var(--ink)",
  marginBottom: "5px",
  transition: "0.2s",
});
const headerRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid var(--border)",
  paddingBottom: "1rem",
  marginBottom: "1.5rem",
};
const dishTitle = {
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: "2rem",
  margin: 0,
};
const mappingGrid = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "40px",
};
const column = { display: "flex", flexDirection: "column" };
const columnTitle = {
  fontSize: "0.7rem",
  fontWeight: "800",
  color: "#aaa",
  marginBottom: "1rem",
};
const mappedRow = {
  display: "flex",
  justifyContent: "space-between",
  padding: "12px 0",
  borderBottom: "1px solid #f5f5f5",
  fontSize: "0.9rem",
  fontWeight: "600",
};
const qtyTag = { color: "var(--gold)", fontWeight: "800" };
const pantryList = { display: "flex", flexWrap: "wrap", gap: "8px" };
const pantryBtn = {
  background: "#f9f9f9",
  border: "1px solid var(--border)",
  padding: "8px 12px",
  borderRadius: "6px",
  fontSize: "0.7rem",
  fontWeight: "700",
  cursor: "pointer",
};
const emptyState = {
  padding: "40px",
  textAlign: "center",
  color: "#ccc",
  fontSize: "0.8rem",
  border: "2px dashed #f5f5f5",
  borderRadius: "12px",
};
const placeholderState = {
  height: "400px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#ccc",
  border: "2px dashed #eee",
  borderRadius: "12px",
  fontSize: "1.1rem",
  fontFamily: "'Cormorant Garamond', serif",
};
