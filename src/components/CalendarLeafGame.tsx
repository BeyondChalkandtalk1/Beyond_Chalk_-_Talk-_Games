import { useState, useEffect, useCallback } from "react";
import { MONTH_MCQ, enableMCQ } from "../data/calendarMCQ";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const MONTH_EMOJIS = ["❄️","💕","🌸","🌧️","🌻","☀️","🌈","🌾","📚","🎃","🍂","🎄"];

function generateCalendarHTML(year, monthIndex) {
  const date = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startDay = date.getDay();
  const days = ["Su","Mo","Tu","We","Th","Fr","Sa"];

  let rows = [];
  let cells = [];

  for (let i = 0; i < startDay; i++) cells.push(null);

  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
    if (cells.length === 7) {
      rows.push([...cells]);
      cells = [];
    }
  }
  if (cells.length > 0) {
    while (cells.length < 7) cells.push(null);
    rows.push([...cells]);
  }

  return { days, rows, daysInMonth };
}

const CalendarCard = ({ monthIndex, small = false }) => {
  const { days, rows } = generateCalendarHTML(2026, monthIndex);
  const name = MONTHS[monthIndex];

  return (
    <div className="w-full">
      <div className={`text-center font-display font-bold mb-1 ${small ? "text-[10px]" : "text-xs"} text-primary`}>
        {/* {MONTH_EMOJIS[monthIndex]} {name} */}
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: small ? "8px" : "10px" }}>
        <thead>
          <tr>
            {days.map((d, i) => (
              <th
                key={i}
                style={{
                  padding: "1px",
                  background: "#f5f5f5",
                  color: i === 0 ? "#e53935" : i === 6 ? "#1e88e5" : "#333",
                  fontWeight: "bold",
                  textAlign: "center",
                }}
              >
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((day, ci) => (
                <td
                  key={ci}
                  style={{
                    border: "1px solid #e0e0e0",
                    padding: "1px",
                    textAlign: "center",
                    color: ci === 0 ? "#e53935" : ci === 6 ? "#1e88e5" : "#333",
                  }}
                >
                  {day || ""}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// ─────────────────────────────────────────
// MCQ Popup Component
// ─────────────────────────────────────────
const MCQPopup = ({ monthIndex, onCorrect }) => {
  const mcq = MONTH_MCQ[monthIndex];
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (idx) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === mcq.correct) {
      setTimeout(() => onCorrect(), 1800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.55)" }}>
      <div className="bg-card rounded-3xl p-6 max-w-sm w-full shadow-2xl border-4 border-primary animate-bounce-in">
        {/* Congrats header */}
        <div className="text-center mb-4">
          <div className="text-5xl mb-2 animate-bounce">🎉</div>
          <h3 className="font-display text-xl font-bold text-secondary">
            Shandaar! {MONTH_EMOJIS[monthIndex]} {MONTHS[monthIndex]}!
          </h3>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Ek sawaal aur! Sahi jawab do aur aage badho 🚀
          </p>
        </div>

        {/* Question */}
        <div className="bg-muted rounded-2xl p-3 mb-4">
          <p className="font-display font-bold text-sm text-foreground text-center">
            {mcq.question}
          </p>
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {mcq.options.map((opt, idx) => {
            const isCorrect = idx === mcq.correct;
            const isSelected = selected === idx;
            let bg = "bg-card border-border hover:border-primary";
            if (answered) {
              if (isCorrect) bg = "bg-green-100 border-green-500 scale-105";
              else if (isSelected) bg = "bg-red-100 border-red-400";
            }
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`rounded-xl border-2 p-2 font-display font-bold text-sm text-foreground transition-all ${bg} ${!answered ? "hover:scale-105 cursor-pointer" : "cursor-default"}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Fact after answering */}
        {answered && (
          <div className={`rounded-xl p-3 text-center text-xs font-body animate-fade-in ${selected === mcq.correct ? "bg-green-50 text-green-700 border border-green-300" : "bg-orange-50 text-orange-700 border border-orange-300"}`}>
            {selected === mcq.correct ? "✅ " : "❌ "}{mcq.fact}
            {selected !== mcq.correct && (
              <button
                onClick={() => { setSelected(null); setAnswered(false); }}
                className="block mx-auto mt-2 px-4 py-1 rounded-lg bg-primary text-primary-foreground font-display font-bold text-xs"
              >
                Dobara try karo 🔄
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// Main CalendarLeafGame
// ─────────────────────────────────────────
const CalendarLeafGame = ({ story, onComplete }) => {
  const [shuffledMonths, setShuffledMonths] = useState(() => shuffle([...Array(12).keys()]));
  const [placed, setPlaced] = useState({});
  const [draggedLeaf, setDraggedLeaf] = useState(null);
  const [wrongSlot, setWrongSlot] = useState(null);
  const [timer, setTimer] = useState(0);
  const [done, setDone] = useState(false);

  // MCQ state — set enableMCQ = false in calendarMCQ.ts to disable the whole feature
  const [mcqMonthIndex, setMcqMonthIndex] = useState(null); // which month's MCQ is showing
  const [pendingPlaced, setPendingPlaced] = useState(null);  // placed entry waiting MCQ confirmation

  useEffect(() => {
    const interval = setInterval(() => {
      if (!done) setTimer(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [done]);

  const placedLeafIds = new Set(Object.values(placed));
  const availableLeaves = shuffledMonths.filter(id => !placedLeafIds.has(id) && id !== pendingPlaced?.leafId);

  const confirmPlacement = useCallback((slotMonthIndex, leafId) => {
    const newPlaced = { ...placed, [slotMonthIndex]: leafId };
    setPlaced(newPlaced);
    setPendingPlaced(null);
    setMcqMonthIndex(null);
    if (Object.keys(newPlaced).length === 12) {
      setTimeout(() => setDone(true), 300);
    }
  }, [placed]);

  const handleDrop = useCallback((slotMonthIndex) => {
    if (draggedLeaf === null) return;
    if (placed[slotMonthIndex] !== undefined) return;

    if (draggedLeaf === slotMonthIndex) {
      // Correct drop!
      setDraggedLeaf(null);
      if (enableMCQ) {
        // Show MCQ before confirming placement
        setPendingPlaced({ slotMonthIndex, leafId: draggedLeaf });
        setMcqMonthIndex(slotMonthIndex);
      } else {
        confirmPlacement(slotMonthIndex, draggedLeaf);
      }
    } else {
      setWrongSlot(slotMonthIndex);
      setTimeout(() => setWrongSlot(null), 600);
      setDraggedLeaf(null);
    }
  }, [draggedLeaf, placed, confirmPlacement]);

  const correctCount = Object.keys(placed).length + (pendingPlaced ? 1 : 0);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-pink-50 px-3 py-4">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="font-display text-2xl font-bold text-secondary">
          {story?.emoji || "📅"} {story?.title || "Calendar Leaf Game"}
        </h2>
        <div className="flex justify-center gap-4 mt-1 text-sm font-body text-muted-foreground">
          <span>⏱️ {timer}s</span>
          <span>✅ {correctCount}/12</span>
        </div>
      </div>

      {/* Done banner */}
      {done ? (
        <div className="text-center py-8 animate-bounce-in">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="font-display text-3xl font-bold text-primary mb-2">Shandaar! 🌟</h3>
          <p className="font-body text-muted-foreground mb-6">Tumne {timer} seconds mein calendar complete kiya!</p>
          <button
            onClick={onComplete}
            className="px-8 py-4 rounded-2xl font-display font-bold text-lg bg-primary text-primary-foreground hover:scale-110 transition-all shadow-lg"
          >
            Next Level → 🎲
          </button>
        </div>
      ) : (
        <>
          {/* Available Leaves */}
          <div className="mb-4">
            <h3 className="font-display text-sm font-bold text-center text-foreground mb-2">
              📦 Calendar Leaves — Drag ya Click karo!
            </h3>
            {draggedLeaf !== null && (
              <p className="text-center text-xs text-primary font-bold mb-2 animate-pulse">
                ✨ Selected! Ab neeche sahi month pe drop karo!
              </p>
            )}
            <div className="flex flex-wrap gap-2 justify-center max-w-4xl mx-auto">
              {availableLeaves.map((leafIdx) => (
                <div
                  key={leafIdx}
                  draggable
                  onDragStart={() => setDraggedLeaf(leafIdx)}
                  onClick={() => setDraggedLeaf(draggedLeaf === leafIdx ? null : leafIdx)}
                  className={`cursor-grab active:cursor-grabbing rounded-xl border-2 p-2 transition-all hover:scale-105 select-none ${
                    draggedLeaf === leafIdx
                      ? "border-primary ring-2 ring-primary/40 scale-110 bg-primary/10"
                      : "border-border bg-white hover:border-primary/50"
                  }`}
                  style={{ width: "110px", boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
                >
                  <CalendarCard monthIndex={leafIdx} small />
                </div>
              ))}
            </div>
          </div>

          {/* Drop Zones Grid */}
          <div className="max-w-5xl mx-auto">
            <h3 className="font-display text-sm font-bold text-center text-foreground mb-2">
              🗓️ Sahi month pe calendar drop karo!
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
              {MONTHS.map((month, idx) => {
                const isPlaced = placed[idx] !== undefined;
                const isPending = pendingPlaced?.slotMonthIndex === idx;
                const isWrong = wrongSlot === idx;

                return (
                  <div
                    key={idx}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); handleDrop(idx); }}
                    onClick={() => { if (!isPlaced && !isPending && draggedLeaf !== null) handleDrop(idx); }}
                    className={`rounded-xl border-2 p-2 transition-all cursor-pointer min-h-[120px] flex flex-col items-center justify-center ${
                      isPlaced
                        ? "border-green-400 bg-green-50"
                        : isPending
                        ? "border-primary bg-primary/10 animate-pulse"
                        : isWrong
                        ? "border-red-400 bg-red-50 animate-shake"
                        : "border-dashed border-blue-300 bg-blue-50 hover:border-primary hover:bg-primary/5"
                    }`}
                    style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}
                  >
                    {isPlaced ? (
                      <CalendarCard monthIndex={placed[idx]} small />
                    ) : isPending ? (
                      <div className="text-center">
                        <div className="text-xl mb-1">⏳</div>
                        <div className="font-display text-xs font-bold text-primary">{month}</div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-2xl mb-1">{MONTH_EMOJIS[idx]}</div>
                        <div className="font-display text-xs font-bold text-blue-600">{month}</div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* MCQ Popup */}
      {enableMCQ && mcqMonthIndex !== null && pendingPlaced && (
        <MCQPopup
          monthIndex={mcqMonthIndex}
          onCorrect={() => confirmPlacement(pendingPlaced.slotMonthIndex, pendingPlaced.leafId)}
        />
      )}
    </div>
  );
};

export default CalendarLeafGame;
