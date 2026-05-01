import * as React from "react";

etype AiAssistantProps = {
  staff: any;
  orders: any[];
  setPage: (page: string) => void;
  setSubPage: (subPage: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onExecuteStrategy?: (strategy: any) => void;
};

export const AiAssistant = ({
  staff,
  orders,
  setPage,
  setSubPage,
  isOpen,
  setIsOpen,
  onExecuteStrategy,
}: AiAssistantProps) => {
  const [query, setQuery] = React.useState("");
  const [response, setResponse] = React.useState(
    "Welcome, Sanjay. How shall we optimize Spice Garden today?"
  );
  const [isListening, setIsListening] = React.useState(false);

  // --- VOICE RECOGNITION LOGIC ---
  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      // Pass raw transcript to preserve quotes for the extraction engine
      executeCommand(transcript);
    };

    recognition.start();
  };

  const executeCommand = (input) => {
    const cmd = input.toLowerCase().trim();
    if (!cmd) return;

    // --- 1. ACTION: ONBOARDING ---
    if (cmd.includes("onboard") || cmd.includes("add staff")) {
      const nameMatch = cmd.match(/named?\s+(\w+)/i);
      const roleMatch = cmd.match(/(server|chef|manager|cleaner)/i);

      const strategyPackage = {
        type: "ONBOARD_STAFF",
        name: nameMatch ? nameMatch[1] : "New Staff",
        role: roleMatch ? roleMatch[1] : "Staff",
        details: cmd,
      };

      setPage("staff");
      setSubPage("profiles");
      if (onExecuteStrategy) onExecuteStrategy(strategyPackage);
      setResponse(
        `Initiating onboarding protocols for ${strategyPackage.name}.`
      );
      setTimeout(() => {
        if (isOpen) setIsOpen(false);
      }, 3000);
      return;
    }

    // --- 2. ACTION: SMART QUOTED MENU EXTRACTION ---
    if (
      cmd.includes("add") &&
      (cmd.includes("dish") || cmd.includes("item") || cmd.includes("menu"))
    ) {
      const priceMatch = cmd.match(/(\d+)/);
      const extractedPrice = priceMatch ? priceMatch[0] : "0";
      const catMatch = cmd.match(
        /(starter|main course|main|bread|dessert|beverage)/i
      );
      const extractedCategory = catMatch ? catMatch[0] : "Main Course";

      const quoteMatch = input.match(/["'“‘]([^"'”’]+)["'”’]/);
      let finalName = "";

      if (quoteMatch) {
        finalName = quoteMatch[1].trim();
      } else {
        // Fallback: Strip noise words if quotes are missing
        let cleanName = cmd
          .replace(/add a dish to the menu/g, "")
          .replace(/add a dish/g, "")
          .replace(/add item/g, "")
          .replace(/add/g, "")
          .replace(/named|name/g, "")
          .replace(/rupees|rupee|rs|price/g, "")
          .replace(/for|in|the/g, "")
          .replace(extractedPrice, "")
          .replace(extractedCategory, "")
          .replace(/\s+/g, " ")
          .trim();
        finalName = cleanName.replace(/\b\w/g, (l) => l.toUpperCase());
      }

      const strategyPackage = {
        type: "ADD_MENU_ITEM",
        name: finalName || "New Dish",
        price: extractedPrice,
        category: extractedCategory,
      };
      setPage("menu");
      if (onExecuteStrategy) onExecuteStrategy(strategyPackage);
      setResponse(
        `Syncing "${strategyPackage.name}" to ${strategyPackage.category} at ₹${strategyPackage.price}.`
      );
      setTimeout(() => {
        if (isOpen) setIsOpen(false);
      }, 3000);
      return;
    }

    // --- 3. ACTION: AUTOMATIC SHIFT PLANNER ---
    if (
      cmd.includes("plan") ||
      cmd.includes("build") ||
      cmd.includes("generate")
    ) {
      if (
        cmd.includes("shift") ||
        cmd.includes("roster") ||
        cmd.includes("schedule") ||
        cmd.includes("auto")
      ) {
        const strategyPackage = {
          type: "RESET_REBUILD",
          shouldRebuild: true,
          shouldSync: true,
          intensity:
            cmd.includes("busy") ||
            cmd.includes("rush") ||
            cmd.includes("heavy")
              ? "High Traffic"
              : "Standard",
          rank:
            cmd.includes("best") || cmd.includes("elite") || cmd.includes("top")
              ? "Elite"
              : "Standard",
        };
        setPage("staff");
        setSubPage("planner");
        if (onExecuteStrategy) onExecuteStrategy(strategyPackage);
        setResponse(
          "AURA Strategist: Constructing optimized roster and synchronizing with database..."
        );
        setTimeout(() => {
          if (isOpen) setIsOpen(false);
        }, 3000);
        return;
      }
    }

    // --- 4. ACTION: RESET PLANNER ---
    if (
      cmd.includes("reset") ||
      cmd.includes("clear") ||
      cmd.includes("wipe")
    ) {
      if (
        cmd.includes("planner") ||
        cmd.includes("roster") ||
        cmd.includes("shift") ||
        cmd.includes("schedule")
      ) {
        const strategyPackage = {
          type: "RESET_REBUILD",
          shouldRebuild: false,
          shouldSync: true,
        };
        setPage("staff");
        setSubPage("planner");
        if (onExecuteStrategy) onExecuteStrategy(strategyPackage);
        setResponse(
          "Action Confirmed: Wiping roster and resetting all shifts to Inactive."
        );
        setTimeout(() => {
          if (isOpen) setIsOpen(false);
        }, 3000);
        return;
      }
    }

    // --- 4.5. ACTION: SMART 3-KEY RESERVATION ---
    if (
      cmd.includes("reserve") ||
      cmd.includes("book") ||
      (cmd.includes("people") && (cmd.includes("pm") || cmd.includes("am")))
    ) {
      const guestMatch = cmd.match(/(\d+)\s*(?:people|guests|pax|persons)/i);
      const timeMatch =
        cmd.match(/(?:at|@|for)\s*(\d+[:\s]*(?:pm|am|evening|night)?)/i) ||
        cmd.match(/(\d+(?::\d+)?\s*(?:pm|am))/i);
      const nameMatch =
        input.match(
          /(?:under name|name|for|under)\s+["'“‘]([^"'”’]+)["'”’]/i
        ) || input.match(/(?:under name|name|for|under)\s+([a-z]+)(?:\s|$)/i);

      if (guestMatch || timeMatch || nameMatch) {
        const strategyPackage = {
          type: "MAKE_RESERVATION",
          guests: guestMatch ? parseInt(guestMatch[1]) : 2,
          customer: nameMatch
            ? (nameMatch[1] || nameMatch[2]).trim()
            : "Walk-in Guest",
          time: timeMatch ? timeMatch[1].toUpperCase().trim() : "7:00 PM",
          date: "Today",
        };
        setPage("reservations");
        if (onExecuteStrategy) onExecuteStrategy(strategyPackage);
        setResponse(
          `AURA Handshake: Securing table for ${strategyPackage.guests} under "${strategyPackage.customer}" for ${strategyPackage.time}.`
        );
        setTimeout(() => {
          if (isOpen) setIsOpen(false);
        }, 3000);
        return;
      }
    }

    // --- 4.6. ACTION: CANCEL RESERVATION (NAME ENFORCED) ---
    if (cmd.includes("cancel") || cmd.includes("remove")) {
      const nameMatch =
        input.match(/(?:for|name|under)\s+["'“‘]?([^"'”’\s]+)["'”’]?/i) ||
        input.match(
          /(?:cancel|remove)\s+(?:reservation\s+for\s+)?["'“‘]?([^"'”’\s]+)["'”’]?/i
        );

      if (nameMatch) {
        const strategyPackage = {
          type: "CANCEL_RESERVATION",
          customer: nameMatch[1].trim(),
        };
        setPage("reservations");
        if (onExecuteStrategy) onExecuteStrategy(strategyPackage);
        setResponse(
          `AURA: Purge protocol active for ${strategyPackage.customer}.`
        );
        setTimeout(() => {
          if (isOpen) setIsOpen(false);
        }, 3000);
        return;
      } else {
        setResponse(
          "AURA: Identity required. Please specify the name to cancel."
        );
        return;
      }
    }

    // --- 4.7. ACTION: MODIFY RESERVATION (NAME ENFORCED + TARGETED UPDATE) ---
    if (
      cmd.includes("modify") ||
      cmd.includes("change") ||
      cmd.includes("update")
    ) {
      const nameMatch =
        input.match(/(?:for|name|under)\s+["'“‘]?([^"'”’\s]+)["'”’]?/i) ||
        input.match(
          /(?:modify|change|update)\s+["'\"“‘]?([^"'\"”’\s]+)["'\"”’]?/i
        );

      if (!nameMatch) {
        setResponse(
          "AURA: Modification requires Patron identification. Whose booking?"
        );
        return;
      }

      const timeMatch = cmd.match(/to\s+(\d+[:\s]*(?:pm|am|evening|night)?)/i);
      const guestMatch = cmd.match(
        /to\s+(\d+)\s*(?:guests|people|pax|person)?/i
      );

      if (timeMatch || guestMatch) {
        const strategyPackage = {
          type: "MODIFY_RESERVATION",
          customer: nameMatch[1].trim(),
          newTime: timeMatch ? timeMatch[1].toUpperCase().trim() : null,
          newGuests: guestMatch ? parseInt(guestMatch[1]) : null,
        };
        setPage("reservations");
        if (onExecuteStrategy) onExecuteStrategy(strategyPackage);
        setResponse(
          `AURA: Re-syncing ${strategyPackage.customer}'s reservation parameters.`
        );
        setTimeout(() => {
          if (isOpen) setIsOpen(false);
        }, 3000);
        return;
      }
    }

    // --- 5. NAVIGATION ENGINE (TARGETED SUB-PAGES) ---

    // KITCHEN & 86 LIST
    if (
      cmd.includes("kitchen") ||
      cmd.includes("86") ||
      cmd.includes("stock") ||
      cmd.includes("unavailable")
    ) {
      setPage("kitchen");
      if (cmd.includes("86") || cmd.includes("stock") || cmd.includes("list")) {
        setSubPage("86list");
        setResponse("Accessing Kitchen 86 List: Inventory Availability.");
      } else {
        setSubPage("live");
        setResponse("Opening Kitchen.");
      }
      return;
    }

    // ORDERS & SETTLED RECORDS
    if (
      cmd.includes("order") ||
      cmd.includes("billing") ||
      cmd.includes("settle") ||
      cmd.includes("record") ||
      cmd.includes("paid")
    ) {
      setPage("orders");
      if (
        cmd.includes("settle") ||
        cmd.includes("record") ||
        cmd.includes("history") ||
        cmd.includes("paid")
      ) {
        setSubPage("settled");
        setResponse("Reviewing Settled Records and Finalized Billing.");
      } else {
        setSubPage("active");
        setResponse("Opening Active Orders Dashboard.");
      }
      return;
    }

    // WHATSAPP NAVIGATION
    if (
      cmd.includes("whatsapp command") ||
      cmd.includes("wa command") ||
      cmd.includes("whatsapp dashboard") ||
      cmd.includes("wa dash")
    ) {
      setPage("whatsapp");
      setResponse("Accessing WhatsApp Command Center.");
      return;
    }
    if (
      cmd.includes("whatsapp menu") ||
      cmd.includes("wa menu") ||
      cmd.includes("whatsapp storefront") ||
      cmd.includes("wa storefront") ||
      cmd.includes("wa delivery")
    ) {
      setPage("delivery");
      setResponse("Opening WhatsApp Storefront & Delivery Menu.");
      return;
    }

    // STAFF NAVIGATION
    if (
      cmd.includes("staff") ||
      cmd.includes("roster") ||
      cmd.includes("performance") ||
      cmd.includes("planner") ||
      cmd.includes("attendance") ||
      cmd.includes("report")
    ) {
      setPage("staff");
      if (
        cmd.includes("performance") ||
        cmd.includes("merit") ||
        cmd.includes("ranking")
      ) {
        setSubPage("performance");
        setResponse("Analyzing Staff Performance & Merit.");
      } else if (
        cmd.includes("planner") ||
        cmd.includes("schedule") ||
        cmd.includes("shifts")
      ) {
        setSubPage("planner");
        setResponse("Opening the Duty Roster Planner.");
      } else if (
        cmd.includes("attendance") ||
        cmd.includes("presence") ||
        cmd.includes("login")
      ) {
        setSubPage("attendance");
        setResponse("Reviewing Live Staff Attendance.");
      } else if (
        cmd.includes("report") ||
        cmd.includes("archive") ||
        cmd.includes("history")
      ) {
        setSubPage("reports");
        setResponse("Accessing Staff Roster Archives and Reports.");
      } else {
        setSubPage("profiles");
        setResponse("Opening Staff Intelligence Profiles.");
      }
      return;
    }

    // CORE MODULES
    if (
      cmd.includes("dashboard") ||
      cmd.includes("home") ||
      cmd.includes("center")
    ) {
      setPage("dashboard");
      setResponse("Returning home.");
      return;
    }
    if (cmd.includes("dossier") || cmd.includes("patron")) {
      setPage("dossier");
      setResponse("Opening Dossier.");
      return;
    }
    if (cmd.includes("menu")) {
      setPage("menu");
      setResponse("Opening Menu Registry.");
      return;
    }
    if (cmd.includes("analytics") || cmd.includes("stats")) {
      setPage("analytics");
      setResponse("Opening Analytics.");
      return;
    }
    if (cmd.includes("reservation") || cmd.includes("table")) {
      setPage("reservations");
      setResponse("Opening Reservations.");
      return;
    }
    if (cmd.includes("loyalty") || cmd.includes("point")) {
      setPage("loyalty");
      setResponse("Opening Loyalty Rewards.");
      return;
    }
    if (cmd.includes("qr") || cmd.includes("customer")) {
      setPage("qr");
      setResponse("Opening QR Ordering View.");
      return;
    }
    if (cmd.includes("settings")) {
      setPage("settings");
      setResponse("Opening System Settings.");
      return;
    }

    if (
      cmd.includes("revenue") ||
      cmd.includes("sales") ||
      cmd.includes("earn")
    ) {
      const total = orders.reduce(
        (sum, o) => sum + parseFloat(o.billing?.total || 0),
        0
      );
      setResponse(`Live Revenue is currently ₹${total.toLocaleString()}.`);
      return;
    }

    setResponse("Instruction received. Department updated.");
    setQuery("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    executeCommand(query);
    setQuery("");
  };

  if (!isOpen) return null;

  return (
    <div style={assistantPanel}>
      <div style={panelHeader}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={headerPulse} />
          <span style={botTag}>AURA COMMAND CENTER</span>
        </div>
        <button onClick={() => setIsOpen(false)} style={closeBtnStyle}>
          ×
        </button>
      </div>
      <div style={chatBody}>
        <div style={botBubble}>{response}</div>
        {query && <div style={userGhostText}>"{query}"</div>}
      </div>
      <div style={inputContainer}>
        <form onSubmit={handleSubmit} style={{ flex: 1 }}>
          <input
            type="text"
            placeholder={isListening ? "Listening..." : "Type instruction..."}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={chatInput}
            autoFocus
          />
        </form>
        <button onClick={handleVoiceInput} style={spectralBtn(isListening)}>
          {isListening ? (
            <div style={waveContainer}>
              <div style={waveBar} />
              <div style={waveBar} />
              <div style={waveBar} />
            </div>
          ) : (
            <div style={micOrbit}>
              <div style={micCenter} />
            </div>
          )}
        </button>
      </div>
      <div style={shortcutGrid}>
        <button onClick={() => executeCommand("revenue")} style={chipBtn}>
          REVENUE
        </button>
        <button onClick={() => executeCommand("performance")} style={chipBtn}>
          MERIT
        </button>
        <button onClick={() => executeCommand("dashboard")} style={chipBtn}>
          HOME
        </button>
      </div>
    </div>
  );
};

// --- STYLES (UNTOUCHED) ---
const assistantPanel = {
  position: "fixed",
  bottom: "90px",
  right: "30px",
  width: "360px",
  background: "#fff",
  borderRadius: "20px",
  boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
  zIndex: 9998,
  overflow: "hidden",
  border: "1px solid #f0f0f0",
  animation: "fadeUp 0.4s ease",
};
const panelHeader = {
  padding: "15px 20px",
  background: "#1a1612",
  borderBottom: "1px solid #222",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};
const closeBtnStyle = {
  background: "none",
  border: "none",
  color: "#666",
  fontSize: "1.5rem",
  cursor: "pointer",
  lineHeight: "1",
  padding: "0 5px",
};
const headerPulse = {
  width: "6px",
  height: "6px",
  background: "#2d7a5f",
  borderRadius: "50%",
  boxShadow: "0 0 8px #2d7a5f",
};
const botTag = {
  color: "#b5862a",
  fontSize: "0.65rem",
  fontWeight: 900,
  letterSpacing: "3px",
};
const chatBody = { padding: "25px", minHeight: "100px", background: "#fcfcfc" };
const botBubble = {
  fontSize: "0.9rem",
  fontWeight: "500",
  color: "#1a1612",
  lineHeight: "1.5",
  fontFamily: "'Cormorant Garamond', serif",
  fontStyle: "italic",
};
const userGhostText = {
  fontSize: "0.7rem",
  color: "#bbb",
  fontWeight: "700",
  marginTop: "8px",
};
const inputContainer = {
  padding: "15px 20px",
  borderTop: "1px solid #f5f5f5",
  display: "flex",
  gap: "12px",
  alignItems: "center",
};
const chatInput = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #eee",
  background: "#f8f8f8",
  outline: "none",
  fontSize: "0.8rem",
  fontWeight: "600",
  color: "#1a1612",
};
const spectralBtn = (listening) => ({
  width: "50px",
  height: "50px",
  borderRadius: "12px",
  background: listening ? "#b5862a" : "#1a1612",
  border: listening ? "2px solid #fff" : "1px solid #b5862a",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  transition: "0.3s all",
  boxShadow: listening ? "0 0 20px rgba(181, 134, 42, 0.4)" : "none",
});
const micOrbit = {
  width: "20px",
  height: "20px",
  border: "2px solid #b5862a",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const micCenter = {
  width: "8px",
  height: "8px",
  background: "#b5862a",
  borderRadius: "50%",
};
const waveContainer = { display: "flex", gap: "2px", alignItems: "center" };
const waveBar = {
  width: "2px",
  height: "12px",
  background: "#fff",
  borderRadius: "2px",
};
const shortcutGrid = { padding: "0 20px 20px", display: "flex", gap: "8px" };
const chipBtn = {
  background: "none",
  border: "1px solid #eee",
  padding: "6px 12px",
  borderRadius: "6px",
  fontSize: "0.55rem",
  fontWeight: "900",
  color: "#bbb",
  cursor: "pointer",
};
