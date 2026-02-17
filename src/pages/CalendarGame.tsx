import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ConfettiAnimation from "../components/ConfettiAnimation";
import ResultModal from "../components/ResultModal";
import { saveGameResult } from "../components/GameHistory";
import ClockLayout from "../components/layouts/ClockLayout";
import DiceLayout from "../components/layouts/DiceLayout";
import ZodiacLayout from "../components/layouts/ZodiacLayout";
import PizzaLayout from "../components/layouts/PizzaLayout";

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

const CARD_INFO = [
  { day: "Monday", week: "Week 1", date: "1st" },
  { day: "Tuesday", week: "Week 5", date: "14th" },
  { day: "Wednesday", week: "Week 9", date: "8th" },
  { day: "Thursday", week: "Week 14", date: "3rd" },
  { day: "Friday", week: "Week 18", date: "22nd" },
  { day: "Saturday", week: "Week 23", date: "10th" },
  { day: "Sunday", week: "Week 27", date: "4th" },
  { day: "Monday", week: "Week 31", date: "15th" },
  { day: "Tuesday", week: "Week 36", date: "5th" },
  { day: "Wednesday", week: "Week 40", date: "12th" },
  { day: "Thursday", week: "Week 44", date: "7th" },
  { day: "Friday", week: "Week 49", date: "25th" },
];

const LAYOUT_OPTIONS = [
  { type: "clock", label: "Clock", emoji: "🕐" },
  { type: "dice", label: "Dice", emoji: "🎲" },
  { type: "zodiac", label: "Zodiac", emoji: "♈" },
  { type: "pizza", label: "Pizza", emoji: "🍕" },
];

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const CalendarGame = () => {
  const navigate = useNavigate();
  const [layout, setLayout] = useState("clock");
  const [calendars, setCalendars] = useState(() =>
    shuffleArray(MONTHS.map((m, i) => ({ ...m, id: i })))
  );
  const [placed, setPlaced] = useState({});
  const [draggedId, setDraggedId] = useState(null);
  const [results, setResults] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [gameResult, setGameResult] = useState("win");
  const [shakeSlot, setShakeSlot] = useState(null);

  const availableCalendars = calendars.filter(
    (c) => !Object.values(placed).includes(c.id)
  );

  const handleDragStart = (id) => {
    setDraggedId(id);
  };

  const handleDrop = useCallback(
    (slotIndex) => {
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

  const resetGame = () => {
    setCalendars(shuffleArray(MONTHS.map((m, i) => ({ ...m, id: i }))));
    setPlaced({});
    setResults({});
    setShowResult(false);
    setShowConfetti(false);
    setDraggedId(null);
    setGameScore(0);
  };

  const buildSlot = (index) => {
    const month = MONTHS[index];
    const isPlaced = placed[index] !== undefined;
    const result = results[index];
    const isShaking = shakeSlot === index;

    return (
      <div
        className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl border-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
          isPlaced
            ? result === "correct"
              ? "bg-success/20 border-success"
              : "bg-destructive/20 border-destructive"
            : "bg-card border-border hover:border-primary"
        } ${isShaking ? "animate-shake" : ""} ${
          isPlaced && result === "correct" ? "animate-bounce-in" : ""
        }`}
        style={{
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
            <span className="text-lg">{MONTHS[placed[index]].emoji}</span>
            <span className="text-[10px] md:text-xs font-display font-bold leading-tight">
              {MONTHS[placed[index]].short}
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
  };

  const slotElements = MONTHS.map((_, i) => buildSlot(i));

  const LayoutComponent = {
    clock: ClockLayout,
    dice: DiceLayout,
    zodiac: ZodiacLayout,
    pizza: PizzaLayout,
  }[layout];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="text-center mb-4">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-2">
            📅 Calendar Game
          </h2>
          <p className="text-muted-foreground font-body">
            Calendar ko sahi month pe drag karke drop karo! 🎯
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {LAYOUT_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              onClick={() => setLayout(opt.type)}
              className={`px-4 py-2 rounded-xl font-display font-bold text-sm transition-all ${
                layout === opt.type
                  ? "bg-primary text-primary-foreground scale-105"
                  : "bg-card border-2 border-border text-foreground hover:border-primary"
              }`}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>

        <LayoutComponent slots={slotElements} centerContent={undefined} />

        <div className="max-w-2xl mx-auto">
          <h3 className="font-display text-lg font-bold text-foreground text-center mb-3">
            📦 Calendars - Drag karo! (ya click karo)
          </h3>

          {draggedId !== null && (
            <p className="text-center text-sm text-primary font-display font-bold mb-2 animate-pulse-glow inline-block mx-auto px-4 py-1 rounded-full bg-primary/10">
              ✨ Selected — ab upar month pe click karo!
            </p>
          )}

          <div className="flex flex-wrap gap-3 justify-center">
            {availableCalendars.map((cal) => {
              const info = CARD_INFO[cal.id];
              return (
                <div
                  key={cal.id}
                  draggable
                  onDragStart={() => handleDragStart(cal.id)}
                  onTouchStart={() => handleDragStart(cal.id)}
                  onClick={() => {
                    if (draggedId === cal.id) {
                      setDraggedId(null);
                    } else {
                      setDraggedId(cal.id);
                    }
                  }}
                  className={`px-4 py-3 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-105 select-none border-2 min-w-[90px] ${
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
                  <div className="text-[10px] font-display font-bold text-center mt-1 text-foreground">
                    {info.day}
                  </div>
                  <div className="text-[9px] font-body text-center text-muted-foreground">
                    {info.week} • {info.date}
                  </div>
                </div>
              );
            })}
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
