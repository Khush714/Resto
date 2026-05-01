import * as React from "react";

/* ================= TYPES ================= /

type StrategyPackage =
  | { type: "ONBOARD_STAFF"; name: string; role: string; details: string }
  | { type: "ADD_MENU_ITEM"; name: string; price: string; category: string }
  | {
      type: "RESET_REBUILD";
      shouldRebuild: boolean;
      shouldSync: boolean;
      intensity?: string;
      rank?: string;
    }
  | {
      type: "MAKE_RESERVATION";
      guests: number;
      customer: string;
      time: string;
      date: string;
    }
  | { type: "CANCEL_RESERVATION"; customer: string }
  | {
      type: "MODIFY_RESERVATION";
      customer: string;
      newTime: string | null;
      newGuests: number | null;
    };

type Order = {
  billing?: { total?: number | string };
  [key: string]: any;
};

type AiAssistantProps = {
  staff: any;
  orders: Order[];
  setPage: (page: string) => void;
  setSubPage: (subPage: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onExecuteStrategy?: (strategy: StrategyPackage) => void;
};

/ ===== Speech Recognition Typing Fix ===== /

type SpeechRecognitionType = {
  lang: string;
  interimResults: boolean;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: any) => void) | null;
  start: () => void;
};

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognitionType;
    SpeechRecognition?: new () => SpeechRecognitionType;
  }
}

/ ================= COMPONENT ================= /

export const AiAssistant = ({
  staff,
  orders,
  setPage,
  setSubPage,
  isOpen,
  setIsOpen,
  onExecuteStrategy,
}: AiAssistantProps) => {
  const [query, setQuery] = React.useState<string>("");
  const [response, setResponse] = React.useState<string>(
    "Welcome, Sanjay. How shall we optimize Spice Garden today?"
  );
  const [isListening, setIsListening] = React.useState<boolean>(false);

  / ---------- VOICE INPUT ---------- /

  const handleVoiceInput = () => {
    const SpeechRecognition =
      window.webkitSpeechRecognition || window.SpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript: string = event.results[0][0].transcript;
      setQuery(transcript);
      executeCommand(transcript);
    };

    recognition.start();
  };

  / ---------- CORE COMMAND ENGINE ---------- /

  const executeCommand = (input: string) => {
    const cmd = input.toLowerCase().trim();
    if (!cmd) return;

    // ONBOARD STAFF
    if (cmd.includes("onboard") || cmd.includes("add staff")) {
      const nameMatch = cmd.match(/named?\s+(\w+)/i);
      const roleMatch = cmd.match(/(server|chef|manager|cleaner)/i);

      const strategyPackage: StrategyPackage = {
        type: "ONBOARD_STAFF",
        name: nameMatch ? nameMatch[1] : "New Staff",
        role: roleMatch ? roleMatch[1] : "Staff",
        details: cmd,
      };

      setPage("staff");
      setSubPage("profiles");
      onExecuteStrategy?.(strategyPackage);

      setResponse(
        Initiating onboarding protocols for ${strategyPackage.name}.
      );
      setTimeout(() => {
        if (isOpen) setIsOpen(false);
      }, 3000);
      return;
    }

    // ADD MENU ITEM
    if (cmd.includes("add") && cmd.includes("dish")) {
      const priceMatch = cmd.match(/(\d+)/);
      const extractedPrice = priceMatch ? priceMatch[0] : "0";

      const strategyPackage: StrategyPackage = {
        type: "ADD_MENU_ITEM",
        name: "New Dish",
        price: extractedPrice,
        category: "Main Course",
      };

      setPage("menu");
      onExecuteStrategy?.(strategyPackage);

      setResponse(Syncing item at ₹${extractedPrice}.);
      return;
    }

    // NAVIGATION
    if (cmd.includes("dashboard")) {
      setPage("dashboard");
      setResponse("Returning home.");
      return;
    }

    if (cmd.includes("menu")) {
      setPage("menu");
      setResponse("Opening Menu.");
      return;
    }

    if (cmd.includes("orders")) {
      setPage("orders");
      setResponse("Opening Orders.");
      return;
    }

    // REVENUE CALCULATION
    if (
      cmd.includes("revenue") ||
      cmd.includes("sales") ||
      cmd.includes("earn")
    ) {
      const total = orders.reduce((sum, o) => {
        return sum + Number(o.billing?.total || 0);
      }, 0);

      setResponse(Live Revenue is ₹${total.toLocaleString()}.);
      return;
    }

    setResponse("Instruction received.");
    setQuery("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(query);
    setQuery("");
  };

  if (!isOpen) return null;

  return (
    <div style={assistantPanel}>
      <div style={panelHeader}>
        <span style={botTag}>AURA COMMAND CENTER</span>
        <button onClick={() => setIsOpen(false)} style={closeBtnStyle}>
          ×
        </button>
      </div>

      <div style={chatBody}>
        <div style={botBubble}>{response}</div>
      </div>

      <div style={inputContainer}>
        <form onSubmit={handleSubmit} style={{ flex: 1 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={chatInput}
            placeholder={isListening ? "Listening..." : "Type instruction..."}
          />
        </form>

        <button onClick={handleVoiceInput} style={spectralBtn(isListening)}>
          🎤
        </button>
      </div>
    </div>
  );
};

/ ================= STYLES ================= */

const assistantPanel: React.CSSProperties = {
  position: "fixed",
  bottom: "90px",
  right: "30px",
  width: "360px",
  background: "#fff",
  borderRadius: "20px",
  boxShadow: "0 30px 60px rgba(0,0,0,0.2)",
  zIndex: 9998,
};

const panelHeader: React.CSSProperties = {
  padding: "15px",
  background: "#1a1612",
  color: "#fff",
};

const closeBtnStyle: React.CSSProperties = {
  background: "none",
  border: "none",
  color: "#fff",
  fontSize: "20px",
  cursor: "pointer",
};

const botTag: React.CSSProperties = {
  fontWeight: "bold",
};

const chatBody: React.CSSProperties = {
  padding: "20px",
};

const botBubble: React.CSSProperties = {
  fontStyle: "italic",
};

const inputContainer: React.CSSProperties = {
  display: "flex",
  padding: "10px",
};

const chatInput: React.CSSProperties = {
  width: "100%",
  padding: "10px",
};

const spectralBtn = (_: boolean): React.CSSProperties => ({
  padding: "10px",
  cursor: "pointer",
});