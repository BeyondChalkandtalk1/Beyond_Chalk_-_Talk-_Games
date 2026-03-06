import { useState, useEffect, useCallback, useMemo } from "react";
import { MONTH_MCQ, enableMCQ } from "../data/calendarMCQ";
import HintBubble from "./HintBubble";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const MONTH_EMOJIS = ["❄️","🌿","🌸","🌧️","🌻","☀️","🌈","🌾","📚","🎃","🍂","🎄"];

const MONTH_COLORS = [
  { bg: "hsl(210, 70%, 94%)", border: "hsl(210, 60%, 75%)", header: "hsl(210, 60%, 40%)" },
  { bg: "hsl(340, 70%, 94%)", border: "hsl(340, 60%, 75%)", header: "hsl(340, 60%, 40%)" },
  { bg: "hsl(150, 60%, 92%)", border: "hsl(150, 50%, 70%)", header: "hsl(150, 50%, 35%)" },
  { bg: "hsl(200, 60%, 92%)", border: "hsl(200, 50%, 72%)", header: "hsl(200, 50%, 38%)" },
  { bg: "hsl(50, 80%, 90%)",  border: "hsl(50, 70%, 65%)",  header: "hsl(50, 70%, 35%)" },
  { bg: "hsl(30, 80%, 92%)",  border: "hsl(30, 70%, 68%)",  header: "hsl(30, 70%, 38%)" },
  { bg: "hsl(280, 50%, 93%)", border: "hsl(280, 45%, 72%)", header: "hsl(280, 45%, 40%)" },
  { bg: "hsl(45, 60%, 90%)",  border: "hsl(45, 55%, 65%)",  header: "hsl(45, 55%, 35%)" },
  { bg: "hsl(25, 60%, 92%)",  border: "hsl(25, 50%, 70%)",  header: "hsl(25, 50%, 38%)" },
  { bg: "hsl(20, 70%, 92%)",  border: "hsl(20, 65%, 68%)",  header: "hsl(20, 65%, 38%)" },
  { bg: "hsl(35, 60%, 90%)",  border: "hsl(35, 55%, 65%)",  header: "hsl(35, 55%, 35%)" },
  { bg: "hsl(0, 65%, 93%)",   border: "hsl(0, 55%, 72%)",   header: "hsl(0, 55%, 40%)" },
];

function generateCalendarHTML(year: number, monthIndex: number) {
  const date = new Date(year, monthIndex, 1);
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const startDay = date.getDay();
  const days = ["Su","Mo","Tu","We","Th","Fr","Sa"];

  let rows: (number | null)[][] = [];
  let cells: (number | null)[] = [];

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

const CalendarCard = ({ monthIndex, small = false }: { monthIndex: number; small?: boolean }) => {
  const { days, rows } = generateCalendarHTML(2026, monthIndex);
  const name = MONTHS[monthIndex];
  const colors = MONTH_COLORS[monthIndex];

  return (
    <div className="w-full" style={{ background: colors.bg, borderRadius: "12px", padding: small ? "6px" : "10px" }}>
      <div
        className="text-center font-display font-bold mb-1"
        style={{ fontSize: small ? "13px" : "15px", color: colors.header }}
      >
        {/* {MONTH_EMOJIS[monthIndex]} {name} */}
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: small ? "16px" : "18px" }}>
        <thead>
          <tr>
            {days.map((d, i) => (
              <th
                key={i}
                style={{
                  padding: small ? "2px 1px" : "3px 2px",
                  background: colors.border,
                  color: i === 0 ? "#e53935" : i === 6 ? "#1e88e5" : "#fff",
                  fontWeight: "bold",
                  textAlign: "center",
                  borderRadius: i === 0 ? "4px 0 0 0" : i === 6 ? "0 4px 0 0" : "0",
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
                    border: `1px solid ${colors.border}`,
                    padding: small ? "2px 1px" : "3px 2px",
                    textAlign: "center",
                    fontWeight: 600,
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

const shuffle = (arr: number[]) => {
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
const MCQPopup = ({ monthIndex, onCorrect }: { monthIndex: number; onCorrect: () => void }) => {
  const mcq = MONTH_MCQ[monthIndex];
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === mcq.correct) {
      setTimeout(() => onCorrect(), 35000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
    >
      <div className="relative  bg-card rounded-3xl p-6 max-w-[700px] max-h-[90vh] overflow-y-auto hide-scrollbar w-full shadow-2xl border-4 border-primary animate-bounce-in">
        {/* CROSS BUTTON */}
        {answered && (
          <button
            onClick={()=>{
              if(selected !== mcq.correct){
                  setSelected(null);
                  setAnswered(false);
                }else{
                   onCorrect();
                }
              }
            }
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-all text-lg font-bold z-20"
          >
            ✕
          </button>
        )}

        <div className="text-center mb-4">
          <div className="text-5xl mb-2 animate-bounce">🎉</div>

          <h3 className="font-display text-3xl font-bold text-secondary">
            Great Job! {MONTH_EMOJIS[monthIndex]} {MONTHS[monthIndex]}!
          </h3>

          <p className="text-2xl text-muted-foreground font-body mt-1">
            Answer the question to unlock the next calendar leaf to correct
            month 🚀
          </p>
        </div>
        <div className="bg-muted rounded-2xl p-3 mb-4">
          <p className="font-display font-bold text-2xl text-foreground text-center">
            {mcq.question}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {mcq.options.map((opt: string, idx: number) => {
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
                className={`rounded-xl border-2 p-2 font-display font-bold text-2xl text-foreground transition-all ${bg} ${!answered ? "hover:scale-105 cursor-pointer" : "cursor-default"}`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {answered && (
          <div
            className={`rounded-xl p-3 text-center text-2xl font-semibold font-body animate-fade-in ${selected === mcq.correct ? "bg-green-50 text-green-700 border border-green-300" : "bg-orange-50 text-orange-700 border border-orange-300"}`}
          >
            {selected === mcq.correct ? "✅ " : "❌ "}
            <p className="text-black">Did you know?</p>
            {mcq.fact}
            {selected !== mcq.correct && (
              <button
                onClick={() => {
                  setSelected(null);
                  setAnswered(false);
                }}
                className="block mx-auto mt-2 px-4 py-1 rounded-lg bg-primary text-primary-foreground font-display font-bold text-xl"
              >
                Try again 🔄
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// Timer Conversion Quiz
// ─────────────────────────────────────────
const TimerQuiz = ({ seconds, onCorrect }: { seconds: number; onCorrect: () => void }) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSecs = seconds % 60;
  const correctAnswer = remainingSecs === 0
    ? `${minutes} minute${minutes !== 1 ? "s" : ""}`
    : `${minutes} min ${remainingSecs} sec`;

  // Generate wrong options
  const generateOptions = () => {
    const options: string[] = [];
    options.push(correctAnswer);

    // Wrong options
    if (remainingSecs === 0) {
      options.push(`${minutes + 1} minutes`);
      options.push(`${minutes > 0 ? minutes - 1 : minutes + 2} minutes`);
      options.push(`${seconds} minutes`);
    } else {
      options.push(`${minutes + 1} min ${remainingSecs} sec`);
      options.push(`${minutes} min ${60 - remainingSecs} sec`);
      options.push(`${seconds} minutes`);
    }

    // Shuffle
    const shuffled = [...options];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return { options: shuffled, correctIdx: shuffled.indexOf(correctAnswer) };
  };

  const [quiz] = useState(() => generateOptions());
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === quiz.correctIdx) {
      setTimeout(() => onCorrect(), 2000);
    }
  };

  return (
    <div className="text-center py-8 animate-bounce-in max-w-md mx-auto">
      <div className="text-6xl mb-4">🎉</div>
      <h3 className="font-display text-3xl font-bold text-primary mb-2">Shandaar! 🌟</h3>
      <p className="font-body text-muted-foreground mb-2">
        Tumne <span className="font-bold text-secondary">{seconds} seconds</span> mein calendar complete kiya!
      </p>

      <div className="bg-card rounded-2xl p-5 border-2 border-primary shadow-lg mt-4">
        <div className="text-3xl mb-2">⏱️ → ⏰</div>
        <h4 className="font-display text-lg font-bold text-foreground mb-1">
          Bonus Challenge! 🧠
        </h4>
        <p className="font-body text-sm text-muted-foreground mb-4">
          <span className="font-bold text-secondary">{seconds} seconds</span> ko minutes mein convert karo!
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          {quiz.options.map((opt, idx) => {
            const isCorrect = idx === quiz.correctIdx;
            const isSelected = selected === idx;
            let style = "bg-card border-border hover:border-primary hover:scale-105";
            if (answered) {
              if (isCorrect) style = "bg-green-100 border-green-500 scale-105";
              else if (isSelected) style = "bg-red-100 border-red-400";
              else style = "bg-card border-border opacity-60";
            }
            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className={`rounded-xl border-2 p-3 font-display font-bold text-sm text-foreground transition-all cursor-pointer ${style}`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {answered && (
          <div className={`rounded-xl p-3 text-center text-sm font-body animate-slide-up ${
            selected === quiz.correctIdx
              ? "bg-green-50 text-green-700 border border-green-300"
              : "bg-orange-50 text-orange-700 border border-orange-300"
          }`}>
            {selected === quiz.correctIdx ? (
              <>✅ Bilkul sahi! {seconds} seconds = {correctAnswer}. Next level aa raha hai!</>
            ) : (
              <>
                ❌ Galat! Sahi jawab hai: <strong>{correctAnswer}</strong>
                <br />
                <span className="text-xs">💡 Yaad rakho: 1 minute = 60 seconds</span>
                <button
                  onClick={() => { setSelected(null); setAnswered(false); }}
                  className="block mx-auto mt-2 px-4 py-1 rounded-lg bg-primary text-primary-foreground font-display font-bold text-xs"
                >
                  Dobara try karo 🔄
                </button>
              </>
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
const CalendarLeafGame = ({
  story,
  onComplete,
}: {
  story?: { emoji?: string; title?: string };
  onComplete: () => void;
}) => {
  const [shuffledMonths, setShuffledMonths] = useState(() =>
    shuffle([...Array(12).keys()]),
  );
  const [placed, setPlaced] = useState<Record<number, number>>({});
  const [draggedLeaf, setDraggedLeaf] = useState<number | null>(null);
  const [wrongSlot, setWrongSlot] = useState<number | null>(null);
  const [timer, setTimer] = useState(0);
  const [done, setDone] = useState(false);
  const [timerQuizPassed, setTimerQuizPassed] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  const [showHelpVideo, setShowHelpVideo] = useState(false);

  const [mcqMonthIndex, setMcqMonthIndex] = useState<number | null>(null);
  const [pendingPlaced, setPendingPlaced] = useState<{
    slotMonthIndex: number;
    leafId: number;
  } | null>(null);
  const [lastInteraction, setLastInteraction] = useState(Date.now());

  // Track user interactions for hint system
  const trackInteraction = useCallback(
    () => setLastInteraction(Date.now()),
    [],
  );

  // useEffect(() => {
  //   if (!gameStarted) return;
  //   const interval = setInterval(() => {
  //     if (!done) setTimer((t) => t + 1);
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, [done, gameStarted]);

  useEffect(() => {
    if (!gameStarted || done || showHowToPlay) return; // ← add showHowToPlay check
    const interval = setInterval(() => {
      if (!done) setTimer((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [done, gameStarted, showHowToPlay]); // ← add showHowToPlay to deps

  const placedLeafIds = new Set(Object.values(placed));
  const availableLeaves = shuffledMonths.filter(
    (id) => !placedLeafIds.has(id) && id !== pendingPlaced?.leafId,
  );

  const confirmPlacement = useCallback(
    (slotMonthIndex: number, leafId: number) => {
      const newPlaced = { ...placed, [slotMonthIndex]: leafId };
      setPlaced(newPlaced);
      setPendingPlaced(null);
      setMcqMonthIndex(null);
      if (Object.keys(newPlaced).length === 12) {
        setTimeout(() => setDone(true), 300);
      }
    },
    [placed],
  );

  const handleDrop = useCallback(
    (slotMonthIndex: number) => {
      if (!gameStarted) return;
      if (draggedLeaf === null) return;
      if (placed[slotMonthIndex] !== undefined) return;
      trackInteraction();

      if (draggedLeaf === slotMonthIndex) {
        setDraggedLeaf(null);
        if (enableMCQ) {
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
    },
    [draggedLeaf, placed, confirmPlacement, trackInteraction],
  );

  // const unplacedMonths = [...Array(12).keys()].filter(i => placed[i] === undefined && pendingPlaced?.slotMonthIndex !== i);
  const unplacedMonths = useMemo(
    () =>
      [...Array(12).keys()].filter(
        (i) => placed[i] === undefined && pendingPlaced?.slotMonthIndex !== i,
      ),
    [placed, pendingPlaced],
  );
  const correctCount = Object.keys(placed).length + (pendingPlaced ? 1 : 0);

  const formatTime = (totalSeconds) => {
    if (totalSeconds < 60) {
      return `${totalSeconds}s`;
    }

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  };

  useEffect(() => {
    if (!gameStarted || done) return;

    const timeout = setTimeout(() => {
      console.log(
        "🕐 60 seconds se koi touch/drag/drop nahi hua! — HINT DIKHAO",
      );
    }, 60000);

    return () => clearTimeout(timeout);
  }, [lastInteraction, gameStarted, done]);

  // CalendarLeafGame mein yeh add karo (dev only)
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Ctrl + Shift + S dabao = skip
      if (e.shiftKey && e.key === "L") {
        setDone(true);
        setTimerQuizPassed(true);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-pink-50 px-3 py-4 min-h-screen">
      {/* Header */}
      {/* <div className=" flex justify-between  text-center mb-4">
        <span>⏱️ {timer}s</span>
        <h2 className="font-display text-5xl font-bold text-secondary">
          {story?.emoji || "📅"} {story?.title || "Calendar Leaf Game"}
        </h2>
        <div className="flex justify-center gap-4 mt-1 text-sm font-body text-muted-foreground">
          <span>✅ {correctCount}/12</span>
        </div>
      </div> */}
      {/* Header */}
      <div className="grid grid-cols-3 items-center mb-6 max-w-11xl mx-20">
        {/* Timer - Left */}
        <div className="flex justify-start">
          <div className="flex flex-col gap-4">
            <span className="text-lg font-bold bg-white px-4 py-2 rounded-full shadow-md">
              ⏱️ {formatTime(timer)}
            </span>
            <button
              className="px-2 py-1 text-white text-xl bg-slate-500 font-bold rounded-[19px]"
              onClick={() => setShowHowToPlay(true)}
            >
              How to play
            </button>
          </div>
        </div>

        {/* Title - Center */}
        <div className=" justify-center">
          <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary whitespace-nowrap -ml-24">
            {story?.emoji || "📅"} {story?.title || "Calendar Leaf Game"}
          </h2>
        </div>

        {/* Correct Count - Right */}
        <div className="flex justify-end">
          <span className="text-lg font-bold bg-white px-4 py-2 rounded-full shadow-md">
            ✅ {correctCount}/12
          </span>
        </div>
      </div>

      {/* Done — show timer quiz first, then next level */}
      {done ? (
        <div className="text-center py-2 animate-bounce-in">
          <div className="text-6xl mb-4">🏆</div>
          <h3 className="font-display text-3xl font-bold text-primary mb-2">
            Level 1 Complete! 🌟
          </h3>
          <button
            onClick={onComplete}
            className="px-8 py-4 rounded-2xl font-display font-bold text-lg bg-primary text-primary-foreground hover:scale-110 transition-all shadow-lg"
          >
            Next Level → 🎲
          </button>
        </div>
      ) : (
        // : (
        //   <TimerQuiz
        //     seconds={timer}
        //     onCorrect={() => setTimerQuizPassed(true)}
        //   />
        // )
        <>
          {/* Available Leaves */}
          <div className="mb-6">
            <h3 className="font-display text-2xl font-bold text-center text-foreground mb-3">
              📦 Patch the calendar by dragging/clicking the calendar leaves
            </h3>
            {draggedLeaf !== null && (
              <p className="text-center text-xl text-primary font-bold mb-2 animate-pulse">
                ✨Selected! Now drop down to the correct month!
              </p>
            )}
            <div className="flex flex-wrap gap-6 justify-center max-w-11xl mx-auto">
              {availableLeaves.map((leafIdx) => (
                <div
                  key={leafIdx}
                  draggable
                  onDragStart={() => {
                    if (!gameStarted) return;
                    setDraggedLeaf(leafIdx);
                    trackInteraction();
                  }}
                  onClick={() => {
                    if (!gameStarted) return;
                    setDraggedLeaf(draggedLeaf === leafIdx ? null : leafIdx);
                    trackInteraction();
                  }}
                  className={`cursor-grab active:cursor-grabbing rounded-2xl border-2 p-1 transition-all hover:scale-105 select-none ${
                    draggedLeaf === leafIdx
                      ? "border-primary ring-2 ring-primary/40 scale-110"
                      : "border-border hover:border-primary/50"
                  }`}
                  style={{
                    width: "320px",
                    boxShadow:
                      draggedLeaf === leafIdx
                        ? "0 6px 20px rgba(0,0,0,0.2)"
                        : "0 3px 12px rgba(0,0,0,0.1)",
                    background: MONTH_COLORS[leafIdx].bg,
                  }}
                >
                  <CalendarCard monthIndex={leafIdx} small />
                </div>
              ))}
            </div>
          </div>

          {/* Drop Zones Grid */}
          <div className="max-w-9xl mx-auto">
            <h3 className="font-display text-4xl font-bold text-center text-foreground mb-3">
              🗓️Drop the correct month calendar leaves here
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {MONTHS.map((month, idx) => {
                const isPlaced = placed[idx] !== undefined;
                const isPending = pendingPlaced?.slotMonthIndex === idx;
                const isWrong = wrongSlot === idx;
                const colors = MONTH_COLORS[idx];

                return (
                  <div
                    key={idx}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      handleDrop(idx);
                    }}
                    // onClick={() => {
                    //   if (!isPlaced && !isPending && draggedLeaf !== null)
                    //     handleDrop(idx);
                    // }}
                    // On drop zone onClick:
                    onClick={() => {
                      if (
                        !isPlaced &&
                        !isPending &&
                        draggedLeaf !== null &&
                        gameStarted
                      )
                        handleDrop(idx);
                    }}
                    className={`rounded-2xl border-2 p-1 transition-all cursor-pointer min-h-[150px] lg:min-h-[170px] flex flex-col items-center justify-center ${
                      isPlaced
                        ? "border-green-400"
                        : isPending
                          ? "border-primary animate-pulse"
                          : isWrong
                            ? "border-red-400 bg-red-50 animate-shake"
                            : "border-dashed hover:border-primary hover:scale-[1.02]"
                    }`}
                    style={{
                      boxShadow: "0 3px 10px rgba(0,0,0,0.08)",
                      background: isPlaced
                        ? undefined
                        : isPending
                          ? undefined
                          : isWrong
                            ? undefined
                            : colors.bg,
                      borderColor:
                        !isPlaced && !isPending && !isWrong
                          ? colors.border
                          : undefined,
                    }}
                  >
                    {isPlaced ? (
                      <CalendarCard monthIndex={placed[idx]} small />
                    ) : isPending ? (
                      <div className="text-center">
                        <div className="text-2xl mb-1">⏳</div>
                        <div className="font-display text-sm font-bold text-primary">
                          {month}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="text-3xl mb-1">{MONTH_EMOJIS[idx]}</div>
                        <div
                          className="font-display text-xl font-bold"
                          style={{ color: colors.header }}
                        >
                          {month}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-center mt-6 mb-4">
            <button
              onClick={() => setShowHelpVideo(true)}
              className="flex items-center gap-2 px-6 py-3 rounded-full text-white font-display font-bold text-xl shadow-xl hover:scale-105 transition-transform"
              style={{ backgroundColor: "#8F2424" }}
            >
              🎥 Do you need a solution?
            </button>
          </div>
        </>
      )}

      {/* Hint Bubble - shows after 60s inactivity */}
      {!done && (
        <HintBubble
          unplacedMonths={unplacedMonths}
          lastInteraction={lastInteraction}
          delay={60000}
        />
      )}

      {/* MCQ Popup */}
      {enableMCQ && mcqMonthIndex !== null && pendingPlaced && (
        <MCQPopup
          monthIndex={mcqMonthIndex}
          onCorrect={() =>
            confirmPlacement(pendingPlaced.slotMonthIndex, pendingPlaced.leafId)
          }
        />
      )}

      {showHowToPlay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div
            className="w-[90%] max-w-xl p-6 rounded-2xl shadow-xl"
            style={{ backgroundColor: "#FBF5EF" }}
          >
            {/* Heading */}
            <h2
              className="text-2xl font-bold text-center mb-4"
              style={{ color: "#8F2424" }}
            >
              📖 How to Play
            </h2>

            {/* Content */}
            <ul
              className="text-gray-700 space-y-2 text-2xl font-semibold leading-relaxed"
              style={{
                fontFamily: "'Times New Roman', var(--font-body)",
              }}
            >
              <li>🔎 Explore the calendar leaf on screen.</li>
              <li>🧠 Guess which month it belongs to.</li>
              <li>🖱️ Drag & drop into correct month box.</li>
              <li>✨ Correct choice unlocks next leaf.</li>
              <li>🏆 Complete all 12 months to win.</li>
            </ul>

            {/* Close Button */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowHowToPlay(false)}
                className="px-6 py-2 rounded-full text-white font-semibold"
                style={{ backgroundColor: "#8F2424" }}
              >
                Start Playing 🚀
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Start Game Popup — shown after closing How To Play */}
      {!showHowToPlay && !gameStarted && !done && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-card rounded-3xl shadow-2xl border-2 border-primary/30 p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-4 text-center animate-bounce-in">
            <div className="text-5xl">🚀</div>
            <h2 className="font-display font-bold text-2xl text-foreground">
              Ready to Play?
            </h2>
            <p className="text-muted-foreground font-display text-xl">
              The timer will start when you
              <span className="text-primary font-bold"> press</span> start!
            </p>
            <button
              onClick={() => {
                setGameStarted(true);
                trackInteraction();
              }}
              className="mt-2 px-8 py-3 rounded-full text-white font-display font-bold text-lg shadow-lg hover:scale-105 transition-transform"
              style={{ backgroundColor: "#8F2424" }}
            >
              ▶ Start Game!
            </button>
          </div>
        </div>
      )}

      {/* {!done && gameStarted && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
          <button
            onClick={() => setShowHelpVideo(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-full text-white font-display font-bold text-sm shadow-xl hover:scale-105 transition-transform"
            style={{ backgroundColor: "#8F2424" }}
          >
            🎥 Do you need help?
          </button>
        </div>
      )} */}

      {showHelpVideo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backdropFilter: "blur(6px)", background: "rgba(0,0,0,0.6)" }}
          onClick={() => setShowHelpVideo(false)} // backdrop click se bhi band ho
        >
          <div
            className="relative w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl bg-black"
            onClick={(e) => e.stopPropagation()} // modal ke andar click se band na ho
          >
            {/* Close Button */}
            <button
              onClick={() => setShowHelpVideo(false)}
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/20 hover:bg-white/40 flex items-center justify-center text-white font-bold text-lg transition-all"
            >
              ✕
            </button>

            {/* Video Title */}
            <div className="px-5 pt-5 pb-3 bg-gray-900">
              <h3 className="font-display font-bold text-white text-lg">
                🎬 Video Guide
              </h3>
            </div>

            {/* Video Player */}
            <div className="aspect-video w-full bg-black">
              <video
                src="/videos/video1.mp4" // 👈 apna video URL yahan daalo
                controls
                autoPlay
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};;

export default CalendarLeafGame;
