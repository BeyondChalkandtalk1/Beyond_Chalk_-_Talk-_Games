import { useState, useEffect, useCallback } from "react";

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

  // Empty cells before start
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
        {MONTH_EMOJIS[monthIndex]} {name}
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

const CalendarLeafGame = ({ story, onComplete }) => {
  const [shuffledMonths, setShuffledMonths] = useState(() => shuffle([...Array(12).keys()]));
  const [placed, setPlaced] = useState({}); // { monthIndex: leafIndex }
  const [draggedLeaf, setDraggedLeaf] = useState(null);
  const [wrongSlot, setWrongSlot] = useState(null);
  const [timer, setTimer] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!done) setTimer(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [done]);

  const placedLeafIds = new Set(Object.values(placed));
  const availableLeaves = shuffledMonths.filter(id => !placedLeafIds.has(id));

  const handleDrop = useCallback((slotMonthIndex) => {
    if (draggedLeaf === null) return;
    if (placed[slotMonthIndex] !== undefined) return;

    if (draggedLeaf === slotMonthIndex) {
      const newPlaced = { ...placed, [slotMonthIndex]: draggedLeaf };
      setPlaced(newPlaced);
      setDraggedLeaf(null);
      if (Object.keys(newPlaced).length === 12) {
        setTimeout(() => setDone(true), 500);
      }
    } else {
      setWrongSlot(slotMonthIndex);
      setTimeout(() => setWrongSlot(null), 600);
      setDraggedLeaf(null);
    }
  }, [draggedLeaf, placed]);

  const correctCount = Object.keys(placed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-pink-50 px-3 py-4">
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
                const isWrong = wrongSlot === idx;

                return (
                  <div
                    key={idx}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); handleDrop(idx); }}
                    onClick={() => { if (!isPlaced && draggedLeaf !== null) handleDrop(idx); }}
                    className={`rounded-xl border-2 p-2 transition-all cursor-pointer min-h-[120px] flex flex-col items-center justify-center ${
                      isPlaced
                        ? "border-green-400 bg-green-50"
                        : isWrong
                        ? "border-red-400 bg-red-50 animate-shake"
                        : "border-dashed border-blue-300 bg-blue-50 hover:border-primary hover:bg-primary/5"
                    }`}
                    style={{ boxShadow: "0 2px 6px rgba(0,0,0,0.08)" }}
                  >
                    {isPlaced ? (
                      <CalendarCard monthIndex={placed[idx]} small />
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
    </div>
  );
};

export default CalendarLeafGame;
