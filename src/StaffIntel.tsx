import * as React from "react";
import { Staff } from "./Staff";
import { StaffPerformance } from "./StaffPerformance";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SHIFT_TYPES = {
  M: { label: "Lunch", color: "#b5862a", bg: "#fdfcf8" },
  E: { label: "Dinner", color: "#1a1612", bg: "#f5f5f5" },
  N: { label: "Night", color: "#3a5a40", bg: "#e8f5e9" },
  X: { label: "Off", color: "#ccc", bg: "transparent" },
};

const ATTENDANCE_TYPES = {
  P: { label: "Present", color: "#2d7a5f", bg: "#e8f5e9" },
  A: { label: "Absent", color: "#b84040", bg: "#ffebee" },
  L: { label: "Late", color: "#f59e0b", bg: "#fff7ed" },
  "-": { label: "Pending", color: "#999", bg: "transparent" },
};

export const StaffIntel = ({
  staff,
  setStaff,
  onSync,
  reports = [],
  onArchive,
  onResetPlanner,
  initialView,
  incomingStrategy, // Strategy packet from AURA
  onStrategyComplete, // Cleanup signal
}) => {
  const [view, setView] = React.useState("planner");
  const [selectedReport, setSelectedReport] = React.useState(null);

  // --- AURA PRECISION LANDING & MULTI-STEP STRATEGY SYNC ---
  React.useEffect(() => {
    if (initialView) {
      setView(initialView);
    }

    if (incomingStrategy && incomingStrategy.type === "RESET_REBUILD") {
      handleResetAndRebuild(incomingStrategy);
    } else if (incomingStrategy && incomingStrategy.type === "AUTO_GENERATE") {
      executeAuraStrategy(incomingStrategy);
    }
  }, [initialView, incomingStrategy]);

  // --- SECURITY & EDIT STATE ---
  const [isUnlocked, setIsUnlocked] = React.useState(false);
  const [passInput, setPassInput] = React.useState("");
  const [isEditing, setIsEditing] = React.useState(false);
  const [editBuffer, setEditBuffer] = React.useState(null);
  const [securityAction, setSecurityAction] = React.useState(null);
  const [confirmPass, setConfirmPass] = React.useState("");

  // --- AI PLANNER ASSISTANT STATE ---
  const [aiActive, setAiActive] = React.useState(false);
  const [aiStep, setAiStep] = React.useState(0);
  const [aiAnswers, setAiAnswers] = React.useState({});

  const QUESTIONS = [
    {
      id: "intensity",
      q: "How heavy is the expected crowd this week?",
      options: ["Standard", "High Traffic", "Festival/Event"],
    },
    {
      id: "priority",
      q: "Which shift needs more coverage?",
      options: ["Lunch Shift (M)", "Dinner Shift (E)", "Balanced"],
    },
    {
      id: "offDays",
      q: "How should we handle staff off-days?",
      options: [
        "Rotating (Fairness)",
        "Weekdays Only",
        "Minimal (Max Coverage)",
      ],
    },
  ];

  // --- AURA AUTOMATED EXECUTION ENGINE (MODIFIED FOR WEEKEND PRIORITY) ---
  const handleResetAndRebuild = (strat) => {
    const clearedStaff = staff.map((s) => ({
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
    }));

    if (!strat.shouldRebuild) {
      setStaff(clearedStaff);
      if (strat.shouldSync) onSync(clearedStaff);
      onStrategyComplete();
      return;
    }

    const sorted = [...clearedStaff].sort(
      (a, b) =>
        (parseFloat(b.performance) || 0) - (parseFloat(a.performance) || 0)
    );
    const topPerformers = sorted
      .slice(0, Math.ceil(staff.length / 2))
      .map((s) => s.id);

    const newStaffList = clearedStaff.map((member) => {
      const isTopTier = topPerformers.includes(member.id);
      const newShifts = {};
      let shiftsCount = 0;

      // 1. HIGH PRIORITY: WEEKEND ASSIGNMENT (Ensures they work Fri-Sun first)
      ["Fri", "Sat", "Sun"].forEach((day) => {
        const isHighTraffic = strat.intensity === "High Traffic";
        // Logic: 90% chance on weekends if High Traffic, 70% if Elite/Top Tier, 20% otherwise
        const workProbability = isHighTraffic
          ? 0.9
          : strat.rank === "Elite" && isTopTier
          ? 0.8
          : isTopTier
          ? 0.6
          : 0.2;

        if (Math.random() < workProbability && shiftsCount < 5) {
          // Weekend Bias: 70% chance of Dinner (E) shift
          newShifts[day] = Math.random() > 0.3 ? "E" : "M";
          shiftsCount++;
        } else {
          newShifts[day] = "X";
        }
      });

      // 2. FILLER: WEEKDAY ASSIGNMENT (Shuffled to randomize off-days)
      const weekDays = ["Mon", "Tue", "Wed", "Thu"].sort(
        () => Math.random() - 0.5
      );
      weekDays.forEach((day) => {
        if (shiftsCount < 5) {
          const weekdayProb = strat.intensity === "High Traffic" ? 0.7 : 0.4;
          if (Math.random() < weekdayProb) {
            newShifts[day] = Math.random() > 0.5 ? "M" : "E";
            shiftsCount++;
          } else {
            newShifts[day] = "X";
          }
        } else {
          newShifts[day] = "X";
        }
      });

      DAYS.forEach((d) => {
        if (!newShifts[d]) newShifts[d] = "X";
      });
      return { ...member, weeklyShifts: newShifts };
    });

    setStaff(newStaffList);
    if (strat.shouldSync) onSync(newStaffList);
    onStrategyComplete();
  };

  const executeAuraStrategy = (strat) => {
    const intensity = strat.intensity;
    const sortedByPerformance = [...staff].sort(
      (a, b) =>
        (parseFloat(b.performance) || 0) - (parseFloat(a.performance) || 0)
    );
    const topPerformers = sortedByPerformance
      .slice(0, Math.ceil(staff.length / 2))
      .map((s) => s.id);

    const newStaffList = staff.map((member) => {
      const isTopTier = topPerformers.includes(member.id);
      const newShifts = {};
      let shiftsCount = 0;

      // WEEKEND FIRST
      ["Fri", "Sat", "Sun"].forEach((day) => {
        const prob =
          intensity === "High Traffic" ? 0.85 : isTopTier ? 0.7 : 0.3;
        if (Math.random() < prob && shiftsCount < 5) {
          newShifts[day] = Math.random() > 0.4 ? "E" : "M";
          shiftsCount++;
        } else {
          newShifts[day] = "X";
        }
      });

      // WEEKDAYS SECOND
      const weekDays = ["Mon", "Tue", "Wed", "Thu"].sort(
        () => Math.random() - 0.5
      );
      weekDays.forEach((day) => {
        if (shiftsCount < 5) {
          const prob = intensity === "High Traffic" ? 0.6 : 0.4;
          if (Math.random() < prob) {
            newShifts[day] = Math.random() > 0.5 ? "M" : "E";
            shiftsCount++;
          } else {
            newShifts[day] = "X";
          }
        } else {
          newShifts[day] = "X";
        }
      });

      DAYS.forEach((d) => {
        if (!newShifts[d]) newShifts[d] = "X";
      });
      return { ...member, weeklyShifts: newShifts };
    });

    setStaff(newStaffList);
    onSync(newStaffList);
    onStrategyComplete();
  };

  const handleAiAssignment = () => {
    const sortedByPerformance = [...staff].sort(
      (a, b) =>
        (parseFloat(b.performance) || 0) - (parseFloat(a.performance) || 0)
    );
    const topPerformers = sortedByPerformance
      .slice(0, Math.ceil(staff.length / 2))
      .map((s) => s.id);

    setStaff((prev) =>
      prev.map((member) => {
        const isTopTier = topPerformers.includes(member.id);
        const newShifts = {};
        let shiftsCount = 0;

        // WEEKEND FIRST
        ["Fri", "Sat", "Sun"].forEach((day) => {
          if (isTopTier && shiftsCount < 5) {
            newShifts[day] = Math.random() > 0.5 ? "E" : "M";
            shiftsCount++;
          } else {
            newShifts[day] = "X";
          }
        });

        const shuffledWeekdays = ["Mon", "Tue", "Wed", "Thu"].sort(
          () => 0.5 - Math.random()
        );
        shuffledWeekdays.forEach((day) => {
          if (shiftsCount < 5) {
            if (aiAnswers.priority === "Lunch Shift (M)") newShifts[day] = "M";
            else if (aiAnswers.priority === "Dinner Shift (E)")
              newShifts[day] = "E";
            else newShifts[day] = Math.random() > 0.5 ? "M" : "E";
            shiftsCount++;
          } else {
            newShifts[day] = "X";
          }
        });

        DAYS.forEach((day) => {
          if (!newShifts[day]) newShifts[day] = "X";
        });
        return { ...member, weeklyShifts: newShifts };
      })
    );
    setAiActive(false);
    setAiStep(0);
  };

  const triggerSecurity = (action, data = null) => {
    setSecurityAction(action);
    if (data) setEditBuffer(data);
  };

  const handleSecurityConfirm = (e) => {
    e.preventDefault();
    if (confirmPass === "Patel") {
      if (securityAction === "DELETE") {
        const updated = reports.filter(
          (r) => r.archiveDate !== editBuffer.archiveDate
        );
        localStorage.setItem(
          "spice_garden_staff_reports",
          JSON.stringify(updated)
        );
        window.location.reload();
      }
      if (securityAction === "SAVE") {
        const updated = reports.map((r) =>
          r.archiveDate === editBuffer.archiveDate ? editBuffer : r
        );
        localStorage.setItem(
          "spice_garden_staff_reports",
          JSON.stringify(updated)
        );
        setSelectedReport(editBuffer);
        setIsEditing(false);
        alert("Modifications Saved Successfully.");
      }
      setSecurityAction(null);
      setConfirmPass("");
    } else {
      alert("Unauthorized Access Key.");
      setConfirmPass("");
    }
  };

  const updateEditBuffer = (memberId, day) => {
    const seq = ["P", "A", "L", "-"];
    const newSnap = editBuffer.rawSnap.map((m) => {
      if (m.id === memberId) {
        const current = m.attendance?.[day] || "-";
        const next = seq[(seq.indexOf(current) + 1) % seq.length];
        return { ...m, attendance: { ...m.attendance, [day]: next } };
      }
      return m;
    });
    setEditBuffer({ ...editBuffer, rawSnap: newSnap });
  };

  const enrichedStaff = React.useMemo(() => {
    const now = new Date();
    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const currentDay = dayLabels[now.getDay()];
    const hour = now.getHours();

    return staff.map((member) => {
      const todayShift = member.weeklyShifts?.[currentDay] || "X";
      const todayAtt = member.attendance?.[currentDay] || "-";
      const isCheckedIn = todayAtt === "P" || todayAtt === "L";
      let liveStatus = "Inactive";

      if (isCheckedIn) {
        if (todayShift === "M" && hour >= 10 && hour < 16)
          liveStatus = "Active";
        if (todayShift === "E" && hour >= 18 && hour < 24)
          liveStatus = "Active";
      }
      return { ...member, status: liveStatus };
    });
  }, [staff]);

  const getStaffEarnings = (memberSnap) => {
    const shiftRate = memberSnap.basePay || 500;
    const att = memberSnap.attendance || {};
    const worked = Object.values(att).filter(
      (s) => s === "P" || s === "L"
    ).length;
    return { total: worked * shiftRate, count: worked };
  };

  const stats = React.useMemo(() => {
    const totals = { P: 0, A: 0, L: 0, "-": 0 };
    staff.forEach((member) => {
      DAYS.forEach((day) => {
        if (member.weeklyShifts?.[day] !== "X") {
          const status = member.attendance?.[day] || "-";
          if (totals[status] !== undefined) totals[status]++;
        }
      });
    });
    return totals;
  }, [staff]);

  const cycleShift = (staffId, day) => {
    const seq = ["M", "E", "X"];
    setStaff((prev) =>
      prev.map((s) =>
        s.id === staffId
          ? {
              ...s,
              weeklyShifts: {
                ...s.weeklyShifts,
                [day]:
                  seq[
                    (seq.indexOf(s.weeklyShifts?.[day] || "X") + 1) % seq.length
                  ],
              },
            }
          : s
      )
    );
  };

  const cycleAttendance = (staffId, day) => {
    setStaff((prev) =>
      prev.map((s) => {
        if (s.id === staffId) {
          if ((s.weeklyShifts?.[day] || "X") === "X") return s;
          return {
            ...s,
            attendance: {
              ...s.attendance,
              [day]: ["P", "A", "L", "-"][
                (["P", "A", "L", "-"].indexOf(s.attendance?.[day] || "-") + 1) %
                  4
              ],
            },
          };
        }
        return s;
      })
    );
  };

  return (
    <div style={{ animation: "fadeUp .4s ease", paddingBottom: "60px" }}>
      {securityAction && (
        <div style={aiOverlayStyle}>
          <div style={aiModalStyle}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🛡️</div>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.5rem",
                  marginBottom: "1rem",
                }}
              >
                Authorization Required
              </h3>
              <form onSubmit={handleSecurityConfirm}>
                <input
                  type="password"
                  autoFocus
                  placeholder="Manager Password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  style={passInputStyle}
                />
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => setSecurityAction(null)}
                    style={{ ...resetBtnStyle, flex: 1 }}
                  >
                    CANCEL
                  </button>
                  <button
                    type="submit"
                    style={{
                      ...syncBtnStyle,
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    CONFIRM
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {aiActive && (
        <div style={aiOverlayStyle}>
          <div style={aiModalStyle}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span
                style={{
                  fontSize: "0.6rem",
                  fontWeight: "900",
                  color: "#b5862a",
                  letterSpacing: "1px",
                }}
              >
                AI PLANNER ASSISTANT
              </span>
              <button
                onClick={() => setAiActive(false)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.2rem",
                  color: "#999",
                }}
              >
                ×
              </button>
            </div>
            <h3
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.8rem",
                margin: "20px 0",
                color: "#1a1612",
              }}
            >
              {QUESTIONS[aiStep].q}
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              {QUESTIONS[aiStep].options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    const newAns = {
                      ...aiAnswers,
                      [QUESTIONS[aiStep].id]: opt,
                    };
                    setAiAnswers(newAns);
                    if (aiStep < QUESTIONS.length - 1) setAiStep(aiStep + 1);
                    else handleAiAssignment();
                  }}
                  style={aiOptionBtnStyle}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "2.5rem",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: "2.4rem",
              fontWeight: 400,
              margin: 0,
            }}
          >
            Staff Intelligence
          </h2>
          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            {[
              "planner",
              "attendance",
              "profiles",
              "performance",
              "reports",
            ].map((v) => (
              <button
                key={v}
                onClick={() => {
                  setView(v);
                  setSelectedReport(null);
                  setIsUnlocked(false);
                  setIsEditing(false);
                }}
                style={{
                  background: view === v ? "#1a1612" : "transparent",
                  color: view === v ? "#b5862a" : "#999",
                  border: "none",
                  fontSize: "0.65rem",
                  fontWeight: "900",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  letterSpacing: "1px",
                }}
              >
                {" "}
                {v.toUpperCase()}{" "}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          {view === "planner" && (
            <>
              <button onClick={() => setAiActive(true)} style={aiBtnStyle}>
                🤖 AI STRATEGIST
              </button>
              <button onClick={onResetPlanner} style={resetBtnStyle}>
                🧹 RESET PLAN
              </button>
            </>
          )}
          {view !== "profiles" &&
            view !== "performance" &&
            !selectedReport &&
            view !== "reports" && (
              <button onClick={() => onSync(staff)} style={syncBtnStyle}>
                <span>💾</span> SYNC MASTER
              </button>
            )}
        </div>
      </div>

      {view === "performance" && (
        <StaffPerformance staff={staff} setStaff={setStaff} />
      )}
      {view === "reports" && (
        <div style={{ animation: "fadeUp .3s ease" }}>
          {!isUnlocked ? (
            <div
              style={{
                maxWidth: "380px",
                margin: "4rem auto",
                padding: "2.5rem",
                background: "#fff",
                borderRadius: "20px",
                border: "1px solid #eee",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🔐</div>
              <h3
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "1.6rem",
                  margin: "0 0 1.5rem",
                }}
              >
                Historical Archive Locked
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (passInput === "Khush") setIsUnlocked(true);
                  else alert("Incorrect");
                  setPassInput("");
                }}
              >
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={passInput}
                  onChange={(e) => setPassInput(e.target.value)}
                  style={passInputStyle}
                />
                <button
                  type="submit"
                  style={{
                    ...syncBtnStyle,
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  UNLOCK REPORTS
                </button>
              </form>
            </div>
          ) : !selectedReport ? (
            reports.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "5rem 2rem",
                  border: "2px dashed #eee",
                  borderRadius: "20px",
                  color: "#bbb",
                }}
              >
                📂{" "}
                <p style={{ fontSize: "0.8rem", fontWeight: "700" }}>
                  HISTORY IS EMPTY
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                  gap: "20px",
                }}
              >
                {reports.map((report, idx) => (
                  <div key={idx} style={{ position: "relative" }}>
                    <div
                      onClick={() => setSelectedReport(report)}
                      style={{ ...reportCardStyle, cursor: "pointer" }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "1rem",
                        }}
                      >
                        <span style={{ fontWeight: "900", color: "#1a1612" }}>
                          {report.weekLabel}
                        </span>
                        <span
                          style={{
                            fontSize: "0.6rem",
                            color: "#b5862a",
                            fontWeight: "800",
                          }}
                        >
                          VIEW DETAILS →
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div>
              <button
                onClick={() => {
                  setSelectedReport(null);
                  setIsEditing(false);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#b5862a",
                  fontWeight: "800",
                  fontSize: "0.7rem",
                  cursor: "pointer",
                  marginBottom: "1.5rem",
                }}
              >
                ← BACK TO ARCHIVE
              </button>
              <div
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  border: "1px solid #eee",
                  overflow: "hidden",
                }}
              >
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead style={{ background: "#fafafa" }}>
                    <tr>
                      <th style={rhStyle}>STAFF MEMBER</th>
                      <th style={rhStyle}>WEEKLY ATTENDANCE</th>
                      <th style={rhStyle}>SHIFTS</th>
                      <th style={{ ...rhStyle, textAlign: "right" }}>
                        EARNINGS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedReport.rawSnap.map((m) => {
                      const earn = getStaffEarnings(m);
                      return (
                        <tr
                          key={m.id}
                          style={{ borderBottom: "1px solid #f9f9f9" }}
                        >
                          <td style={{ padding: "1.2rem" }}>
                            <div
                              style={{ fontWeight: "800", fontSize: "0.85rem" }}
                            >
                              {m.name}
                            </div>
                            <div
                              style={{
                                fontSize: "0.6rem",
                                color: "#b5862a",
                                fontWeight: "700",
                              }}
                            >
                              {m.role?.toUpperCase()}
                            </div>
                          </td>
                          <td style={{ padding: "1.2rem" }}>
                            <div style={{ display: "flex", gap: "4px" }}>
                              {DAYS.map((d) => (
                                <div
                                  key={d}
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    borderRadius: "4px",
                                    fontSize: "0.6rem",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontWeight: "900",
                                    background:
                                      m.attendance?.[d] === "P"
                                        ? "#e8f5e9"
                                        : "#f9f9f9",
                                    color:
                                      m.attendance?.[d] === "P"
                                        ? "#2d7a5f"
                                        : "#eee",
                                  }}
                                >
                                  {m.attendance?.[d] || "X"}
                                </div>
                              ))}
                            </div>
                          </td>
                          <td
                            style={{
                              padding: "1.2rem",
                              fontWeight: "800",
                              fontSize: "0.8rem",
                            }}
                          >
                            {earn.count}
                          </td>
                          <td
                            style={{
                              padding: "1.2rem",
                              textAlign: "right",
                              fontWeight: "900",
                              fontSize: "0.85rem",
                              color: "#1a1612",
                            }}
                          >
                            ₹{earn.total}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {view === "attendance" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "15px",
            marginBottom: "2rem",
          }}
        >
          <SummaryTile
            label="WEEKLY PRESENTS"
            count={stats.P}
            color="#2d7a5f"
          />
          <SummaryTile label="WEEKLY LATE" count={stats.L} color="#f59e0b" />
          <SummaryTile label="WEEKLY ABSENT" count={stats.A} color="#b84040" />
          <SummaryTile
            label="UNMARKED SHIFTS"
            count={stats["-"]}
            color="#999"
          />
        </div>
      )}
      {view === "profiles" && (
        <div style={{ animation: "fadeUp .3s ease" }}>
          {" "}
          <Staff staff={enrichedStaff} setStaff={setStaff} />{" "}
        </div>
      )}

      {(view === "planner" || view === "attendance") && (
        <div
          style={{
            background: "#fff",
            borderRadius: "20px",
            border: "1px solid #eee",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: "#fafafa",
                  borderBottom: "1px solid #eee",
                }}
              >
                <th style={thStyle}>MEMBER</th>
                {DAYS.map((day) => (
                  <th key={day} style={thStyle}>
                    {day.toUpperCase()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {staff.map((member) => (
                <tr
                  key={member.id}
                  style={{ borderBottom: "1px solid #f9f9f9" }}
                >
                  <td
                    style={{
                      padding: "1.2rem",
                      borderRight: "1px solid #f9f9f9",
                      width: "160px",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: "800",
                        fontSize: "0.85rem",
                        color: "#1a1612",
                      }}
                    >
                      {member.name}
                    </div>
                    <div
                      style={{
                        fontSize: "0.55rem",
                        color: "#b5862a",
                        fontWeight: "800",
                      }}
                    >
                      {member.role?.toUpperCase()}
                    </div>
                  </td>
                  {DAYS.map((day) => {
                    const shiftCode = member.weeklyShifts?.[day] || "X";
                    const attCode = member.attendance?.[day] || "-";
                    const isPlanner = view === "planner";
                    const config = isPlanner
                      ? SHIFT_TYPES[shiftCode]
                      : ATTENDANCE_TYPES[attCode];
                    return (
                      <td
                        key={day}
                        onClick={() =>
                          isPlanner
                            ? cycleShift(member.id, day)
                            : cycleAttendance(member.id, day)
                        }
                        style={{
                          padding: "8px",
                          textAlign: "center",
                          cursor:
                            isPlanner || shiftCode !== "X"
                              ? "pointer"
                              : "not-allowed",
                        }}
                      >
                        <div
                          style={{
                            padding: "10px 4px",
                            borderRadius: "8px",
                            background:
                              !isPlanner && shiftCode === "X"
                                ? "#fcfcfc"
                                : config.bg,
                            border: `1.2px solid ${
                              !isPlanner && shiftCode === "X"
                                ? "#f0f0f0"
                                : config.color + "22"
                            }`,
                            color:
                              !isPlanner && shiftCode === "X"
                                ? "#eee"
                                : config.color,
                            fontSize: "0.7rem",
                            fontWeight: "900",
                            opacity: !isPlanner && shiftCode === "X" ? 0.3 : 1,
                            transition: "all 0.2s ease",
                          }}
                        >
                          {!isPlanner && shiftCode === "X"
                            ? "Ø"
                            : isPlanner
                            ? shiftCode
                            : attCode}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// Styles and Helper components below (UNCHANGED)
const SummaryTile = ({ label, count, color }) => (
  <div
    style={{
      background: "#fff",
      border: "1px solid #eee",
      padding: "18px",
      borderRadius: "15px",
      textAlign: "center",
      boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
    }}
  >
    <div
      style={{
        fontSize: "0.55rem",
        fontWeight: "900",
        color: "#bbb",
        letterSpacing: "1px",
        marginBottom: "8px",
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: "1.8rem",
        fontWeight: "900",
        color: color,
        transition: "0.3s all",
      }}
    >
      {count}
    </div>
  </div>
);
const aiOverlayStyle = {
  position: "fixed",
  inset: 0,
  background: "rgba(255,255,255,0.7)",
  backdropFilter: "blur(10px)",
  zIndex: 5000,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};
const aiModalStyle = {
  background: "#fff",
  padding: "40px",
  borderRadius: "30px",
  width: "90%",
  maxWidth: "450px",
  boxShadow: "0 30px 60px rgba(0,0,0,0.1)",
  border: "1px solid #f0f0f0",
};
const aiOptionBtnStyle = {
  width: "100%",
  padding: "16px 20px",
  background: "#fdfcf8",
  border: "1px solid #eee",
  borderRadius: "12px",
  cursor: "pointer",
  textAlign: "left",
  fontWeight: "800",
  fontSize: "0.8rem",
  color: "#1a1612",
  transition: "0.2s",
  letterSpacing: "0.5px",
};
const aiBtnStyle = {
  background: "#1a1612",
  color: "#b5862a",
  padding: "8px 16px",
  borderRadius: "8px",
  border: "1.2px solid #b5862a",
  fontWeight: "800",
  cursor: "pointer",
  fontSize: "0.65rem",
  transition: "0.2s",
};
const resetBtnStyle = {
  background: "#ffebee",
  color: "#b84040",
  padding: "8px 16px",
  borderRadius: "8px",
  border: "1px solid #ffcdd2",
  fontWeight: "800",
  cursor: "pointer",
  fontSize: "0.65rem",
  transition: "0.2s",
};
const syncBtnStyle = {
  background: "#1a1612",
  color: "#b5862a",
  padding: "8px 16px",
  borderRadius: "8px",
  border: "1.5px solid #b5862a",
  fontWeight: "800",
  cursor: "pointer",
  fontSize: "0.65rem",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
  transition: "0.2s",
};
const reportCardStyle = {
  background: "#fff",
  border: "1px solid #eee",
  borderRadius: "16px",
  padding: "1.5rem",
  boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
};
const passInputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #eee",
  background: "#fafafa",
  marginBottom: "1rem",
  textAlign: "center",
  outline: "none",
};
const thStyle = {
  padding: "1.2rem",
  fontSize: "0.6rem",
  color: "#bbb",
  fontWeight: "900",
  letterSpacing: "1.5px",
  textAlign: "left",
};
const rhStyle = {
  padding: "1.2rem",
  fontSize: "0.6rem",
  color: "#bbb",
  fontWeight: "900",
  letterSpacing: "1.5px",
  textAlign: "left",
};
