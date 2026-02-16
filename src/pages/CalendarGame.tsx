import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ConfettiAnimation from "../components/ConfettiAnimation";
import ResultModal from "../components/ResultModal";
import { saveGameResult } from "../components/GameHistory";

const MONTHS = [
  { name: "January", short: "Jan", emoji: "❄️", color: "hsl(200 70% 60%)" },
  { name: "February", short: "Feb", emoji: "💕", color: "hsl(340 70% 60%)" },
  { name: "March", short: "Mar", emoji: "🌸", color: "hsl(320 60% 65%)" },
  { name: "April", short: "Apr", emoji: "🌧️", color: "hsl(210 60% 55%)" },
  { name: "May", short: "May", emoji: "🌻", color: "hsl(45 80% 55%)" },
  { name: "June", short: "Jun", emoji: "☀️", color: "hsl(36 80% 50%)" },
  { name: "July", short: "Jul", emoji: "🌈", color: "hsl(160 60% 50%)" },
  { name: "August", short: "Aug", emoji: "🌾", color: "hsl(80 50% 50%)" },
  { name: "September", short: "Sep", emoji: "📚", color: "hsl(25 70% 50%)" },
  { name: "October", short: "Oct", emoji: "🎃", color: "hsl(30 90% 50%)" },
  { name: "November", short: "Nov", emoji: "🍂", color: "hsl(20 60% 45%)" },
  { name: "December", short: "Dec", emoji: "🎄", color: "hsl(140 60% 40%)" },
];

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const CalendarGame = () => {
  const navigate = useNavigate();
  const [calendars, setCalendars] = useState(() =>
    shuffleArray(MONTHS.map((m, i) => ({ ...m, id: i })))
  );
  const [placed, setPlaced] = useState<Record<number, number | null>>({});
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [results, setResults] = useState<Record<number, "correct" | "wrong">>({});
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameResult, setGameResult] = useState<"win" | "loss">("win");
  const [shakeSlot, setShakeSlot] = useState<number | null>(null);

  const availableCalendars = calendars.filter(
    (c) => !Object.values(placed).includes(c.id)
  );

  const handleDragStart = (id: number) => {
    setDraggedId(id);
  };

  const handleDrop = useCallback(
    (slotIndex: number) => {
      if (draggedId === null) return;

      const isCorrect = draggedId === slotIndex;

      setPlaced((prev) => ({ ...prev, [slotIndex]: draggedId }));
      setResults((prev) => ({
        ...prev,
        [slotIndex]: isCorrect ? "correct" : "wrong",
      }));

      if (!isCorrect) {
        setShakeSlot(slotIndex);
        setTimeout(() => setShakeSlot(null), 500);
      }

      setDraggedId(null);

      // Check if all placed
      const newPlaced = { ...placed, [slotIndex]: draggedId };
      const filledCount = Object.keys(newPlaced).length;

      if (filledCount === 12) {
        setTimeout(() => {
          const correctCount = Object.entries({
            ...results,
            [slotIndex]: isCorrect ? "correct" : "wrong",
          }).filter(([, v]) => v === "correct").length;

          const isWin = correctCount >= 10;
          setGameScore(correctCount);
          setGameResult(isWin ? "win" : "loss");

          if (isWin) setShowConfetti(true);

          saveGameResult("Calendar Game 📅", isWin ? "win" : "loss", correctCount);
          setShowResult(true);
        }, 600);
      }
    },
    [draggedId, placed, results]
  );

  const handleTouchStart = (id: number) => {
    setDraggedId(id);
  };

  const resetGame = () => {
    setCalendars(shuffleArray(MONTHS.map((m, i) => ({ ...m, id: i }))));
    setPlaced({});
    setResults({});
    setShowResult(false);
    setShowConfetti(false);
    setDraggedId(null);
    setGameScore(0);
  };

  // Clock positions for 12 items
  const getClockPosition = (index: number) => {
    const angle = (index * 30 - 90) * (Math.PI / 180);
    const radius = 38;
    const x = 50 + radius * Math.cos(angle);
    const y = 50 + radius * Math.sin(angle);
    return { x, y };
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="text-center mb-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-2">
            📅 Calendar Game
          </h2>
          <p className="text-muted-foreground font-body">
            Calendar ko sahi month pe drag karke drop karo! 🎯
          </p>
        </div>

        {/* Clock Layout for Month Slots */}
        <div className="relative w-full max-w-lg mx-auto aspect-square mb-8">
          {/* Center decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-primary flex items-center justify-center z-10">
            <span className="text-primary-foreground font-display text-lg font-bold text-center leading-tight">
              12<br />Months
            </span>
          </div>

          {/* Clock circle outline */}
          <div className="absolute inset-[10%] rounded-full border-4 border-dashed border-border" />

          {/* Month slots on clock */}
          {MONTHS.map((month, index) => {
            const pos = getClockPosition(index);
            const isPlaced = placed[index] !== undefined;
            const result = results[index];
            const isShaking = shakeSlot === index;

            return (
              <div
                key={index}
                className={`absolute w-16 h-16 md:w-20 md:h-20 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
                  isPlaced
                    ? result === "correct"
                      ? "bg-success/20 border-success"
                      : "bg-destructive/20 border-destructive"
                    : "bg-card border-border hover:border-primary"
                } ${isShaking ? "animate-shake" : ""} ${
                  isPlaced && result === "correct" ? "animate-bounce-in" : ""
                }`}
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  boxShadow: isPlaced ? undefined : "var(--shadow-card)",
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add("drop-target-hover");
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove("drop-target-hover");
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove("drop-target-hover");
                  if (!isPlaced) handleDrop(index);
                }}
                onClick={() => {
                  if (!isPlaced && draggedId !== null) {
                    handleDrop(index);
                  }
                }}
              >
                {isPlaced ? (
                  <>
                    <span className="text-lg">{MONTHS[placed[index]!].emoji}</span>
                    <span className="text-[10px] md:text-xs font-display font-bold leading-tight">
                      {MONTHS[placed[index]!].short}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-xs font-display font-bold text-muted-foreground">
                      {index + 1}
                    </span>
                    <span className="text-[9px] md:text-[10px] text-muted-foreground font-body leading-tight">
                      {month.short}
                    </span>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* Draggable Calendars */}
        <div className="max-w-2xl mx-auto">
          <h3 className="font-display text-lg font-bold text-foreground text-center mb-3">
            📦 Calendars - Drag karo! (ya click karo)
          </h3>

          {draggedId !== null && (
            <p className="text-center text-sm text-primary font-display font-bold mb-2 animate-pulse-glow inline-block mx-auto px-4 py-1 rounded-full bg-primary/10">
              ✨ "{MONTHS[draggedId].name}" selected — ab upar clock pe month pe click karo!
            </p>
          )}

          <div className="flex flex-wrap gap-3 justify-center">
            {availableCalendars.map((cal) => (
              <div
                key={cal.id}
                draggable
                onDragStart={() => handleDragStart(cal.id)}
                onTouchStart={() => handleTouchStart(cal.id)}
                onClick={() => {
                  if (draggedId === cal.id) {
                    setDraggedId(null);
                  } else {
                    setDraggedId(cal.id);
                  }
                }}
                className={`px-4 py-3 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-105 select-none border-2 ${
                  draggedId === cal.id
                    ? "border-primary scale-110 ring-2 ring-primary/50"
                    : "border-border hover:border-primary/50"
                }`}
                style={{
                  backgroundColor: `${cal.color}20`,
                  boxShadow: "var(--shadow-card)",
                }}
              >
                <div className="text-2xl text-center">{cal.emoji}</div>
                <div
                  className="text-xs font-display font-bold text-center mt-1"
                  style={{ color: cal.color }}
                >
                  {cal.name}
                </div>
              </div>
            ))}
          </div>

          {availableCalendars.length === 0 && !showResult && (
            <p className="text-center text-muted-foreground font-body mt-4 animate-pulse">
              Calculating result... ⏳
            </p>
          )}
        </div>
      </main>

      <Footer />

      {showConfetti && <ConfettiAnimation />}

      <ResultModal
        isOpen={showResult}
        result={gameResult}
        score={gameScore}
        total={12}
        onClose={() => navigate("/")}
        onPlayAgain={resetGame}
      />
    </div>
  );
};

export default CalendarGame;
