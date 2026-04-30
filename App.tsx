import * as React from "react";
import "./styles.css";
import { Layout } from "./Layout";
import { Dashboard } from "./Dashboard";
import { Orders } from "./Orders";
import { Kitchen } from "./Kitchen";
import { Menu } from "./Menu";
import { CustomerMenu } from "./CustomerMenu";
import { StaffIntel } from "./StaffIntel";
import { Loyalty } from "./Loyalty";
import { Reservations } from "./Reservations";
import { Analytics } from "./Analytics";
import { Settings } from "./Settings";
import { GuestDossier } from "./GuestDossier";
import { WhatsAppMenu } from "./WhatsAppMenu";
import { WhatsAppDashboard } from "./WhatsAppDashboard";
import { AiAssistant } from "./AiAssistant";
import { Inventory } from "./Inventory";
// --- NEW IMPORT ---
import { RecipeRegistry } from "./RecipeRegistry";

export const CATEGORIES = [
  "Starters",
  "Main Course",
  "Breads",
  "Desserts",
  "Beverages",
];

// --- UPDATED MASTER MENU ---
const INIT_MENU = [
  {
    id: 1,
    name: "Paneer Tikka",
    price: 250,
    available: true,
    isVeg: true,
    category: "Starters",
    img: "🍡",
  },
  {
    id: 2,
    name: "Dal Makhani",
    price: 320,
    available: true,
    isVeg: true,
    category: "Main Course",
    img: "🍲",
  },
  {
    id: 3,
    name: "Butter Naan",
    price: 40,
    available: true,
    isVeg: true,
    category: "Breads",
    img: "🫓",
  },
  {
    id: 4,
    name: "Gulab Jamun",
    price: 120,
    available: false,
    isVeg: true,
    category: "Desserts",
    img: "🍨",
  },
  {
    id: 5,
    name: "Fresh Lime Soda",
    price: 90,
    available: true,
    isVeg: true,
    category: "Beverages",
    img: "🥤",
  },
  {
    id: 6,
    name: "Paneer Chilly",
    price: 250,
    available: true,
    isVeg: true,
    category: "Starters",
    img: "🌶️",
  },
  {
    id: 7,
    name: "Mushroom Chilly",
    price: 300,
    available: true,
    isVeg: true,
    category: "Starters",
    img: "🍄",
  },
  {
    id: 8,
    name: "Mint Mojito",
    price: 240,
    available: true,
    isVeg: true,
    category: "Beverages",
    img: "🍃",
  },
  {
    id: 9,
    name: "Tandoori Aloo",
    price: 250,
    available: true,
    isVeg: true,
    category: "Starters",
    img: "🥔",
  },
  {
    id: 10,
    name: "Dal Tadka",
    price: 250,
    available: true,
    isVeg: true,
    category: "Main Course",
    img: "🥣",
  },
  {
    id: 11,
    name: "pizza",
    price: 350,
    available: true,
    isVeg: true,
    category: "Main Course",
    img: "🍕",
  },
  {
    id: 12,
    name: "Bruschetta",
    price: 300,
    available: true,
    isVeg: true,
    category: "Starters",
    img: "🥖",
  },
  {
    id: 13,
    name: "Burger",
    price: 180,
    available: true,
    isVeg: true,
    category: "Main Course",
    img: "🍔",
  },
  {
    id: 14,
    name: "Fries",
    price: 99,
    available: true,
    isVeg: true,
    category: "Starters",
    img: "🍟",
  },
  {
    id: 15,
    name: "Coke Float",
    price: 59,
    available: true,
    isVeg: true,
    category: "Beverages",
    img: "🥤",
  },
  {
    id: 16,
    name: "Fanta float",
    price: 59,
    available: true,
    isVeg: true,
    category: "Beverages",
    img: "🍊",
  },
];

const INIT_STAFF = [
  {
    id: 1,
    name: "Arjun Mehta",
    role: "Head Chef",
    salary: 45000,
    performance: "94%",
    phone: "98250 12345",
    email: "arjun.m@spicegarden.com",
    joiningDate: "12/01/2026",
    status: "Inactive",
    weeklyShifts: {
      Mon: "M",
      Tue: "M",
      Wed: "M",
      Thu: "X",
      Fri: "E",
      Sat: "N",
      Sun: "N",
    },
    attendance: { Mon: "P", Tue: "L", Wed: "P" },
  },
  {
    id: 2,
    name: "Priya Shah",
    role: "Floor Manager",
    salary: 38000,
    performance: "98%",
    phone: "99040 54321",
    email: "priya.s@spicegarden.com",
    joiningDate: "15/02/2026",
    status: "Inactive",
    weeklyShifts: {
      Mon: "E",
      Tue: "E",
      Wed: "E",
      Thu: "E",
      Fri: "E",
      Sat: "X",
      Sun: "X",
    },
    attendance: { Mon: "P", Tue: "P", Wed: "A" },
  },
];

const INIT_INVENTORY = [
  {
    id: "ING01",
    name: "Paneer",
    openingStock: 20,
    currentStock: 20,
    unit: "kg",
    costPerUnit: 450,
    minThreshold: 5,
  },
  {
    id: "ING02",
    name: "Chicken",
    openingStock: 50,
    currentStock: 50,
    unit: "kg",
    costPerUnit: 320,
    minThreshold: 10,
  },
  {
    id: "ING03",
    name: "Heavy Cream",
    openingStock: 10,
    currentStock: 10,
    unit: "L",
    costPerUnit: 210,
    minThreshold: 3,
  },
  {
    id: "ING04",
    name: "Milk",
    openingStock: 30,
    currentStock: 30,
    unit: "L",
    costPerUnit: 60,
    minThreshold: 8,
  },
  {
    id: "ING05",
    name: "Red Onion",
    openingStock: 100,
    currentStock: 100,
    unit: "kg",
    costPerUnit: 35,
    minThreshold: 20,
  },
  {
    id: "ING06",
    name: "Ginger/Garlic Paste",
    openingStock: 10,
    currentStock: 10,
    unit: "kg",
    costPerUnit: 180,
    minThreshold: 2,
  },
  {
    id: "ING08",
    name: "Tomato",
    openingStock: 60,
    currentStock: 60,
    unit: "kg",
    costPerUnit: 40,
    minThreshold: 15,
  },
  {
    id: "ING09",
    name: "Basmati Rice",
    openingStock: 50,
    currentStock: 50,
    unit: "kg",
    costPerUnit: 95,
    minThreshold: 10,
  },
  {
    id: "ING10",
    name: "Maida/Atta (Wheat)",
    openingStock: 100,
    currentStock: 100,
    unit: "kg",
    costPerUnit: 45,
    minThreshold: 25,
  },
  {
    id: "ING11",
    name: "Sunflower Oil",
    openingStock: 45,
    currentStock: 45,
    unit: "L",
    costPerUnit: 115,
    minThreshold: 10,
  },
  {
    id: "ING12",
    name: "Moong/Arhar Dal",
    openingStock: 25,
    currentStock: 25,
    unit: "kg",
    costPerUnit: 120,
    minThreshold: 5,
  },
  {
    id: "ING13",
    name: "Turmeric Powder",
    openingStock: 5,
    currentStock: 5,
    unit: "kg",
    costPerUnit: 240,
    minThreshold: 1,
  },
  {
    id: "ING14",
    name: "Red Chilli Powder",
    openingStock: 8,
    currentStock: 8,
    unit: "kg",
    costPerUnit: 380,
    minThreshold: 1,
  },
  {
    id: "ING15",
    name: "Garam Masala",
    openingStock: 3,
    currentStock: 3,
    unit: "kg",
    costPerUnit: 550,
    minThreshold: 0.5,
  },
  {
    id: "ING16",
    name: "Sugar",
    openingStock: 50,
    currentStock: 50,
    unit: "kg",
    costPerUnit: 42,
    minThreshold: 10,
  },
  {
    id: "ING17",
    name: "Lemons",
    openingStock: 100,
    currentStock: 100,
    unit: "unit",
    costPerUnit: 5,
    minThreshold: 20,
  },
  {
    id: "ING18",
    name: "Club Soda",
    openingStock: 48,
    currentStock: 48,
    unit: "L",
    costPerUnit: 35,
    minThreshold: 12,
  },
  {
    id: "ING19",
    name: "Cheese/Mozzarella",
    openingStock: 10,
    currentStock: 10,
    unit: "kg",
    costPerUnit: 650,
    minThreshold: 4,
  },
  {
    id: "ING20",
    name: "Potatoes",
    openingStock: 50,
    currentStock: 50,
    unit: "kg",
    costPerUnit: 25,
    minThreshold: 15,
  },
  {
    id: "ING21",
    name: "Burger Buns",
    openingStock: 40,
    currentStock: 40,
    unit: "unit",
    costPerUnit: 12,
    minThreshold: 12,
  },
  {
    id: "ING22",
    name: "Mushrooms",
    openingStock: 10,
    currentStock: 10,
    unit: "kg",
    costPerUnit: 240,
    minThreshold: 3,
  },
  {
    id: "ING23",
    name: "Fresh Mint",
    openingStock: 5,
    currentStock: 5,
    unit: "kg",
    costPerUnit: 60,
    minThreshold: 1,
  },
  {
    id: "ING24",
    name: "Soft Drink (Coke/Fanta)",
    openingStock: 50,
    currentStock: 50,
    unit: "L",
    costPerUnit: 40,
    minThreshold: 15,
  },
  {
    id: "ING25",
    name: "Vanilla Ice Cream",
    openingStock: 10,
    currentStock: 10,
    unit: "kg",
    costPerUnit: 180,
    minThreshold: 3,
  },
];

const INIT_RECIPES = [
  {
    menuId: 1,
    name: "Paneer Tikka",
    ingredients: [
      { id: "ING01", name: "Paneer", qty: 0.2, unit: "kg" },
      { id: "ING03", name: "Heavy Cream", qty: 0.05, unit: "L" },
      { id: "ING06", name: "Ginger", qty: 0.01, unit: "kg" },
      { id: "ING07", name: "Garlic", qty: 0.01, unit: "kg" },
      { id: "ING14", name: "Red Chilli Powder", qty: 0.005, unit: "kg" },
    ],
  },
  {
    menuId: 2,
    name: "Dal Makhani",
    ingredients: [
      { id: "ING12", name: "Moong Dal", qty: 0.15, unit: "kg" },
      { id: "ING03", name: "Heavy Cream", qty: 0.08, unit: "L" },
      { id: "ING08", name: "Tomato", qty: 0.1, unit: "kg" },
      { id: "ING11", name: "Sunflower Oil", qty: 0.02, unit: "L" },
      { id: "ING15", name: "Garam Masala", qty: 0.005, unit: "kg" },
    ],
  },
  {
    menuId: 3,
    name: "Butter Naan",
    ingredients: [
      { id: "ING10", name: "Atta", qty: 0.12, unit: "kg" },
      { id: "ING04", name: "Milk", qty: 0.02, unit: "L" },
      { id: "ING11", name: "Oil", qty: 0.015, unit: "L" },
    ],
  },
  {
    menuId: 4,
    name: "Gulab Jamun",
    ingredients: [
      { id: "ING04", name: "Milk", qty: 0.1, unit: "L" },
      { id: "ING16", name: "Sugar", qty: 0.08, unit: "kg" },
      { id: "ING11", name: "Sunflower Oil", qty: 0.02, unit: "L" },
    ],
  },
  {
    menuId: 5,
    name: "Fresh Lime Soda",
    ingredients: [
      { id: "ING17", name: "Lemons", qty: 1, unit: "unit" },
      { id: "ING18", name: "Soda", qty: 0.3, unit: "L" },
      { id: "ING16", name: "Sugar", qty: 0.03, unit: "kg" },
    ],
  },
  {
    menuId: 6,
    name: "Paneer Chilly",
    ingredients: [
      { id: "ING01", name: "Paneer", qty: 0.15, unit: "kg" },
      { id: "ING05", name: "Onion", qty: 0.05, unit: "kg" },
    ],
  },
  {
    menuId: 7,
    name: "Mushroom Chilly",
    ingredients: [
      { id: "ING22", name: "Mushrooms", qty: 0.15, unit: "kg" },
      { id: "ING05", name: "Onion", qty: 0.05, unit: "kg" },
    ],
  },
  {
    menuId: 8,
    name: "Mint Mojito",
    ingredients: [
      { id: "ING23", name: "Mint", qty: 0.02, unit: "kg" },
      { id: "ING17", name: "Lemons", qty: 1, unit: "unit" },
      { id: "ING18", name: "Soda", qty: 0.3, unit: "L" },
    ],
  },
  {
    menuId: 9,
    name: "Tandoori Aloo",
    ingredients: [
      { id: "ING20", name: "Potatoes", qty: 0.25, unit: "kg" },
      { id: "ING11", name: "Oil", qty: 0.01, unit: "L" },
    ],
  },
  {
    menuId: 10,
    name: "Dal Tadka",
    ingredients: [
      { id: "ING12", name: "Dal", qty: 0.15, unit: "kg" },
      { id: "ING08", name: "Tomato", qty: 0.05, unit: "kg" },
    ],
  },
  {
    menuId: 11,
    name: "pizza",
    ingredients: [
      { id: "ING10", name: "Maida", qty: 0.2, unit: "kg" },
      { id: "ING19", name: "Cheese", qty: 0.15, unit: "kg" },
      { id: "ING08", name: "Tomato", qty: 0.08, unit: "kg" },
    ],
  },
  {
    menuId: 12,
    name: "Bruschetta",
    ingredients: [
      { id: "ING10", name: "Maida", qty: 0.1, unit: "kg" },
      { id: "ING19", name: "Cheese", qty: 0.05, unit: "kg" },
    ],
  },
  {
    menuId: 13,
    name: "Burger",
    ingredients: [
      { id: "ING21", name: "Buns", qty: 1, unit: "unit" },
      { id: "ING20", name: "Potatoes", qty: 0.12, unit: "kg" },
    ],
  },
  {
    menuId: 14,
    name: "Fries",
    ingredients: [
      { id: "ING20", name: "Potatoes", qty: 0.2, unit: "kg" },
      { id: "ING11", name: "Oil", qty: 0.05, unit: "L" },
    ],
  },
  {
    menuId: 15,
    name: "Coke Float",
    ingredients: [
      { id: "ING24", name: "Coke", qty: 0.3, unit: "L" },
      { id: "ING25", name: "Ice Cream", qty: 0.05, unit: "kg" },
    ],
  },
  {
    menuId: 16,
    name: "Fanta float",
    ingredients: [
      { id: "ING24", name: "Fanta", qty: 0.3, unit: "L" },
      { id: "ING25", name: "Ice Cream", qty: 0.05, unit: "kg" },
    ],
  },
];

export const Card = ({ children, style = {}, onClick }) => (
  <div
    onClick={onClick}
    style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "10px",
      padding: "1.5rem",
      boxShadow: "var(--shadow)",
      cursor: onClick ? "pointer" : "default",
      ...style,
    }}
  >
    {children}
  </div>
);

export const Chip = ({ color = "muted", children }) => {
  const colors = {
    gold: { bg: "var(--goldbg)", fg: "var(--gold)" },
    green: { bg: "var(--greenbg)", fg: "var(--green)" },
    blue: { bg: "rgba(58,110,168,.1)", fg: "var(--blue)" },
    red: { bg: "var(--redbg)", fg: "var(--red)" },
  };
  const theme = colors[color] || { bg: "#eee", fg: "#666" };
  return (
    <span
      style={{
        padding: "2px 8px",
        borderRadius: "4px",
        fontSize: "0.65rem",
        background: theme.bg,
        color: theme.fg,
        fontWeight: 600,
        textTransform: "uppercase",
      }}
    >
      {" "}
      {children}{" "}
    </span>
  );
};

export const DietIcon = ({ isVeg }) => (
  <div
    style={{
      width: "12px",
      height: "12px",
      border: `1.5px solid ${isVeg ? "#2d7a5f" : "#b84040"}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "2px",
      background: "white",
      flexShrink: 0,
    }}
  >
    <div
      style={{
        width: "6px",
        height: "6px",
        borderRadius: "50%",
        background: isVeg ? "#2d7a5f" : "#b84040",
      }}
    />
  </div>
);

const triggerWhatsAppMessage = (order, type) => {
  if (!order) return;
  const { phone, customer: name, billing } = order;
  const total = billing?.total;
  let content = order.content || "";
  if (!content) {
    if (type === "CONFIRMATION")
      content = `Hi ${name}, your Spice Garden order ${order.id} is confirmed. Total: ₹${total}.`;
    else if (type === "OUT_FOR_DELIVERY")
      content = `🚀 Hi ${name}, your order is out for delivery!`;
    else if (type === "PICKUP_READY")
      content = `🛍️ Hi ${name}, your takeaway order is ready!`;
    else if (type === "DELIVERED")
      content = `✅ Hi ${name}, your order has been delivered. Rate us here: spicegarden.com/review`;
  }
  const logEntry = {
    id: Date.now() + Math.random(),
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
    customer: name,
    phone,
    type,
    content,
    status: "SENT ✓",
  };
  const existingLogs = JSON.parse(localStorage.getItem("wa_logs") || "[]");
  localStorage.setItem(
    "wa_logs",
    JSON.stringify([logEntry, ...existingLogs].slice(0, 50))
  );
};

export default function App() {
  const [page, setPage] = React.useState("dashboard");
  const [subPage, setSubPage] = React.useState("");
  const [isAuraOpen, setIsAuraOpen] = React.useState(false);
  const [activeStrategy, setActiveStrategy] = React.useState(null);
  const [alerts, setAlerts] = React.useState([]);

  // --- STEP 2: EXTERNAL CONTEXT STATE (PULSE) ---
  const [externalContext, setExternalContext] = React.useState({
    weather: "Clear",
    event: "IPL Match Tonight",
    deliverySurge: false,
  });

  const [orders, setOrders] = React.useState(() =>
    JSON.parse(localStorage.getItem("spice_garden_orders") || "[]")
  );
  const [staff, setStaff] = React.useState(() =>
    JSON.parse(
      localStorage.getItem("spice_garden_staff") || JSON.stringify(INIT_STAFF)
    )
  );
  const [reports, setReports] = React.useState(() =>
    JSON.parse(localStorage.getItem("spice_garden_staff_reports") || "[]")
  );
  const [customers, setCustomers] = React.useState(() =>
    JSON.parse(
      localStorage.getItem("spice_garden_crm") ||
        '[{"id": "SG-001", "name": "Kush", "phone": "9876543210", "points": 700, "visits": 5}]'
    )
  );
  const [invoices, setInvoices] = React.useState(() =>
    JSON.parse(localStorage.getItem("spice_garden_invoices") || "[]")
  );
  const [menu, setMenu] = React.useState(() =>
    JSON.parse(
      localStorage.getItem("tablz_v4_checkpoint") || JSON.stringify(INIT_MENU)
    )
  );

  const [inventory, setInventory] = React.useState(() => {
    const saved = localStorage.getItem("spice_garden_inventory_v9");
    return saved ? JSON.parse(saved) : INIT_INVENTORY;
  });

  const [recipes, setRecipes] = React.useState(() => {
    const saved = localStorage.getItem("spice_garden_recipes_v9");
    return saved ? JSON.parse(saved) : INIT_RECIPES;
  });

  const saveMenu = (updatedMenu) => {
    setMenu(updatedMenu);
    localStorage.setItem("tablz_v4_checkpoint", JSON.stringify(updatedMenu));
  };
  const saveCustomers = (updatedList) => {
    setCustomers(updatedList);
    localStorage.setItem("spice_garden_crm", JSON.stringify(updatedList));
  };
  const saveStaff = (updatedStaff) => {
    setStaff(updatedStaff);
    localStorage.setItem("spice_garden_staff", JSON.stringify(updatedStaff));
  };

  const saveInventory = (updated) => {
    setInventory(updated);
    localStorage.setItem("spice_garden_inventory_v9", JSON.stringify(updated));
  };

  const saveRecipes = (updated) => {
    setRecipes(updated);
    localStorage.setItem("spice_garden_recipes_v9", JSON.stringify(updated));
  };

  const toggleMenuItem = (id) => {
    const updatedMenu = menu.map((item) =>
      item.id === id ? { ...item, available: !item.available } : item
    );
    saveMenu(updatedMenu);
  };

  const toggleItemPrepared = (orderId, itemIdx) => {
    setOrders((prev) => {
      const updated = prev.map((order) => {
        if (order.id === orderId) {
          const newItems = [...order.items];
          newItems[itemIdx] = {
            ...newItems[itemIdx],
            prepared: !newItems[itemIdx].prepared,
          };
          return { ...order, items: newItems };
        }
        return order;
      });
      localStorage.setItem("spice_garden_orders", JSON.stringify(updated));
      return updated;
    });
  };

  const resetPlanner = () => {
    if (!window.confirm("Clear all shifts for this week?")) return;
    saveStaff(
      staff.map((s) => ({
        ...s,
        weeklyShifts: {
          Mon: "X",
          Tue: "X",
          Wed: "X",
          Thu: "X",
          Fri: "X",
          Sat: "X",
          Sun: "X",
        },
      }))
    );
  };

  const archiveWeek = () => {
    if (!window.confirm("Archive and reset week?")) return;
    const newReport = {
      weekLabel: `Week ending ${new Date().toLocaleDateString("en-IN", {
        month: "short",
        day: "numeric",
      })}`,
      archiveDate: new Date().toLocaleDateString(),
      rawSnap: staff,
    };
    setReports([newReport, ...reports]);
    localStorage.setItem(
      "spice_garden_staff_reports",
      JSON.stringify([newReport, ...reports])
    );
    saveStaff(
      staff.map((s) => ({
        ...s,
        attendance: {},
        weeklyShifts: {
          Mon: "X",
          Tue: "X",
          Wed: "X",
          Thu: "X",
          Fri: "X",
          Sat: "X",
          Sun: "X",
        },
      }))
    );
  };

  const updateOrderStatus = (id, status) => {
    const targetOrder = orders.find((o) => o.id === id);
    if (!targetOrder || targetOrder.status === status) return;
    const updatedOrders = orders.map((o) =>
      o.id === id ? { ...o, status } : o
    );
    setOrders(updatedOrders);
    localStorage.setItem("spice_garden_orders", JSON.stringify(updatedOrders));

    if (status === "Completed") {
      const clean = (num) => String(num || "").replace(/\D/g, "");
      const orderTotal = parseFloat(targetOrder.billing?.total || 0);
      const invId = `INV-${
        targetOrder.id.split("-")[1] || Date.now().toString().slice(-4)
      }`;
      const invoiceRecord = {
        invoiceId: invId,
        orderId: targetOrder.id,
        customer: targetOrder.customer,
        phone: clean(targetOrder.phone),
        items: targetOrder.items,
        total: orderTotal,
        tax: (orderTotal * 0.05).toFixed(2),
        timestamp: new Date().toISOString(),
      };
      const updatedInvoices = [invoiceRecord, ...invoices];
      setInvoices(updatedInvoices);
      localStorage.setItem(
        "spice_garden_invoices",
        JSON.stringify(updatedInvoices)
      );
      const amount = Math.floor(orderTotal * 0.05);
      const now = new Date();
      const expiry = new Date();
      expiry.setMonth(now.getMonth() + 6);
      const entry = {
        amount,
        earnedAt: now.toISOString(),
        expiresAt: expiry.toISOString(),
      };
      setCustomers((prev) => {
        const phone = clean(targetOrder.phone);
        const idx = prev.findIndex((c) => clean(c.phone) === phone);
        let updatedList = [...prev];
        if (idx > -1) {
          const guest = updatedList[idx];
          updatedList[idx] = {
            ...guest,
            points: (Number(guest.points) || 0) + amount,
            lifetimePoints: (Number(guest.lifetimePoints) || 0) + amount,
            totalSpend: (Number(guest.totalSpend) || 0) + orderTotal,
            ledger: [...(guest.ledger || []), entry],
            visits: (Number(guest.visits) || 0) + 1,
            lastVisit: now.toISOString().split("T")[0],
          };
        } else {
          updatedList = [
            {
              id: `SG-${Date.now().toString().slice(-3)}`,
              name: targetOrder.customer,
              phone,
              points: amount,
              lifetimePoints: amount,
              totalSpend: orderTotal,
              ledger: [entry],
              visits: 1,
              lastVisit: now.toISOString().split("T")[0],
              tier: "Silver",
            },
            ...prev,
          ];
        }
        localStorage.setItem("spice_garden_crm", JSON.stringify(updatedList));
        return updatedList;
      });
      const receiptMsg = `*SPICE GARDEN RECEIPT*\nInvoice: ${invId}\nTotal Bill: ₹${orderTotal}\nPoints Earned: ${amount}\nThank you for dining with us!`;
      triggerWhatsAppMessage(
        { ...targetOrder, content: receiptMsg },
        "DELIVERED"
      );
    }
    if (
      targetOrder.orderSource === "WhatsApp" &&
      status === "Out for Delivery"
    ) {
      triggerWhatsAppMessage(targetOrder, "OUT_FOR_DELIVERY");
    }
  };

  const placeOrder = (o) => {
    const newOrder = {
      ...o,
      items: o.items.map((i) => ({ ...i, prepared: false })),
      status: "Preparing",
      timestamp: Date.now(),
    };
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem("spice_garden_orders", JSON.stringify(updatedOrders));
    if (newOrder.orderSource === "WhatsApp")
      triggerWhatsAppMessage(newOrder, "CONFIRMATION");
    setPage("orders");
  };

  const renderPage = () => {
    const route = page.trim().toLowerCase();
    switch (route) {
      case "dashboard":
      case "home":
        return (
          <Dashboard
            orders={orders}
            customers={customers}
            staff={staff}
            inventory={inventory} // Added for Aura Sentinel
            recipes={recipes} // Added for Aura Sentinel
            externalContext={externalContext} // Added for Step 2
            setPage={setPage} // Added for navigation
            onResetShift={() => {
              setOrders([]);
              localStorage.setItem("spice_garden_orders", "[]");
            }}
            isAuraOpen={isAuraOpen}
            onToggleAura={() => setIsAuraOpen(!isAuraOpen)}
          />
        );
      case "staff":
      case "roster":
      case "planner":
        return (
          <StaffIntel
            staff={staff}
            setStaff={setStaff}
            onSync={saveStaff}
            reports={reports}
            onArchive={archiveWeek}
            onResetPlanner={resetPlanner}
            initialView={subPage}
            incomingStrategy={activeStrategy}
            onStrategyComplete={() => setActiveStrategy(null)}
          />
        );
      case "orders":
      case "billing":
        return (
          <Orders
            orders={orders}
            updateOrderStatus={updateOrderStatus}
            alerts={alerts}
            onDismiss={(id) =>
              setAlerts((prev) => prev.filter((a) => a.id !== id))
            }
            customers={customers}
            initialView={subPage}
          />
        );
      case "menu":
      case "dishes":
        return (
          <Menu
            menu={menu}
            setMenu={saveMenu}
            onSave={() => alert("Sync Complete")}
            incomingStrategy={activeStrategy}
            onStrategyComplete={() => setActiveStrategy(null)}
          />
        );
      case "kitchen":
      case "kot":
      case "kds":
        return (
          <Kitchen
            orders={orders}
            menu={menu}
            customers={customers}
            onToggleAvailability={toggleMenuItem}
            updateOrderStatus={updateOrderStatus}
            onToggleItem={toggleItemPrepared}
            initialView={subPage}
          />
        );
      case "inventory":
      case "stock":
      case "kitchen_stock":
        return (
          <Inventory
            inventory={inventory}
            setInventory={saveInventory}
            incomingStrategy={activeStrategy}
            onStrategyComplete={() => setActiveStrategy(null)}
          />
        );
      case "recipes":
      case "recipe_registry":
        return (
          <RecipeRegistry
            menu={menu}
            inventory={inventory}
            recipes={recipes}
            setRecipes={saveRecipes}
          />
        );
      case "analytics":
      case "stats":
        return (
          <Analytics
            orders={orders}
            recipes={recipes}
            inventory={inventory}
            menu={menu}
          />
        );
      case "loyalty":
      case "crm":
        return (
          <Loyalty customers={customers} onSaveCustomers={saveCustomers} />
        );
      case "dossier":
      case "patrons":
        return (
          <GuestDossier
            orders={orders}
            customers={customers}
            onUpdateCustomers={saveCustomers}
          />
        );
      case "reservations":
      case "tables":
        return (
          <Reservations
            orders={orders}
            setOrders={setOrders}
            customers={customers}
            updateOrderStatus={updateOrderStatus}
            incomingStrategy={activeStrategy}
            onStrategyComplete={() => setActiveStrategy(null)}
          />
        );
      case "qr":
      case "ordering":
      case "customer":
        return (
          <CustomerMenu
            menu={menu}
            customers={customers}
            activeOrders={orders}
            onCallServer={(l) =>
              setAlerts([
                { id: Date.now(), table: l, type: "Server Requested" },
                ...alerts,
              ])
            }
            onPlaceOrder={placeOrder}
          />
        );
      case "whatsapp":
        return <WhatsAppDashboard />;
      case "delivery":
        return (
          <WhatsAppMenu
            menu={menu}
            onPlaceOrder={placeOrder}
            customers={customers}
          />
        );
      case "settings":
        return <Settings />;
      default:
        return (
          <Dashboard
            orders={orders}
            customers={customers}
            staff={staff}
            inventory={inventory}
            recipes={recipes}
            externalContext={externalContext}
            setPage={setPage}
            isAuraOpen={isAuraOpen}
            onToggleAura={() => setIsAuraOpen(!isAuraOpen)}
          />
        );
    }
  };

  return (
    <Layout page={page} setPage={setPage}>
      {renderPage()}
      <AiAssistant
        staff={staff}
        orders={orders}
        inventory={inventory}
        setPage={setPage}
        setSubPage={setSubPage}
        isOpen={isAuraOpen}
        setIsOpen={setIsAuraOpen}
        onExecuteStrategy={(pkg) => {
          setActiveStrategy(pkg);
          if (pkg.type === "UPDATE_STOCK") {
            const updated = inventory.map((item) =>
              item.name.toLowerCase().includes(pkg.name.toLowerCase())
                ? { ...item, currentStock: pkg.quantity }
                : item
            );
            saveInventory(updated);
          }
        }}
      />
    </Layout>
  );
}
