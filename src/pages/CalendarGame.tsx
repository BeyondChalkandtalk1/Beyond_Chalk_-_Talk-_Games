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

const CARD_STYLES = {
  week: {
    label: "Week & Day",
    emoji: "📆",
    data: [
      { line1: "Monday", line2: "Week 1 • 1st" },
      { line1: "Tuesday", line2: "Week 5 • 14th" },
      { line1: "Wednesday", line2: "Week 9 • 8th" },
      { line1: "Thursday", line2: "Week 14 • 3rd" },
      { line1: "Friday", line2: "Week 18 • 22nd" },
      { line1: "Saturday", line2: "Week 23 • 10th" },
      { line1: "Sunday", line2: "Week 27 • 4th" },
      { line1: "Monday", line2: "Week 31 • 15th" },
      { line1: "Tuesday", line2: "Week 36 • 5th" },
      { line1: "Wednesday", line2: "Week 40 • 12th" },
      { line1: "Thursday", line2: "Week 44 • 7th" },
      { line1: "Friday", line2: "Week 49 • 25th" },
    ],
  },
  date: {
    label: "Date & Day",
    emoji: "📅",
    data: [
      { line1: "1 Jan", line2: "Wednesday" },
      { line1: "14 Feb", line2: "Friday" },
      { line1: "8 Mar", line2: "Saturday" },
      { line1: "3 Apr", line2: "Thursday" },
      { line1: "22 May", line2: "Thursday" },
      { line1: "10 Jun", line2: "Tuesday" },
      { line1: "4 Jul", line2: "Friday" },
      { line1: "15 Aug", line2: "Friday" },
      { line1: "5 Sep", line2: "Friday" },
      { line1: "12 Oct", line2: "Sunday" },
      { line1: "7 Nov", line2: "Friday" },
      { line1: "25 Dec", line2: "Thursday" },
    ],
  },
  season: {
    label: "Season",
    emoji: "🌤️",
    data: [
      { line1: "Winter ❄️", line2: "Thandi" },
      { line1: "Winter 🧣", line2: "Pyaar" },
      { line1: "Spring 🌸", line2: "Phool" },
      { line1: "Spring 🌧️", line2: "Baarish" },
      { line1: "Summer 🌻", line2: "Garmi" },
      { line1: "Summer ☀️", line2: "Dhoop" },
      { line1: "Monsoon 🌈", line2: "Sawan" },
      { line1: "Monsoon 🌾", line2: "Fasal" },
      { line1: "Autumn 📚", line2: "School" },
      { line1: "Autumn 🎃", line2: "Tyohaar" },
      { line1: "Pre-Winter 🍂", line2: "Patjhad" },
      { line1: "Winter 🎄", line2: "Jashn" },
    ],
  },
  festival: {
    label: "Festival",
    emoji: "🎉",
    data: [
      { line1: "Lohri 🔥", line2: "Makar Sankranti" },
      { line1: "Valentine 💕", line2: "Basant Panchami" },
      { line1: "Holi 🎨", line2: "Rang Barse" },
      { line1: "Baisakhi 🌾", line2: "Nav Varsh" },
      { line1: "Buddha 🙏", line2: "Purnima" },
      { line1: "Eid 🌙", line2: "Mubarak" },
      { line1: "Guru Purnima 📖", line2: "Independence" },
      { line1: "Raksha 🧵", line2: "Bandhan" },
      { line1: "Ganesh 🐘", line2: "Chaturthi" },
      { line1: "Navratri 💃", line2: "Dussehra" },
      { line1: "Diwali 🪔", line2: "Deepavali" },
      { line1: "Christmas 🎄", line2: "New Year" },
    ],
  },
};

const CARD_STYLE_OPTIONS = [
  { type: "week", label: "Week & Day", emoji: "📆" },
  { type: "date", label: "Date & Day", emoji: "📅" },
  { type: "season", label: "Season", emoji: "🌤️" },
  { type: "festival", label: "Festival", emoji: "🎉" },
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
  const [cardStyle, setCardStyle] = useState("week");
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

        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {CARD_STYLE_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              onClick={() => setCardStyle(opt.type)}
              className={`px-3 py-1.5 rounded-xl font-display font-bold text-xs transition-all ${
                cardStyle === opt.type
                  ? "bg-secondary text-secondary-foreground scale-105"
                  : "bg-card border-2 border-border text-foreground hover:border-secondary"
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
              const info = CARD_STYLES[cardStyle].data[cal.id];
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
                    {info.line1}
                  </div>
                  <div className="text-[9px] font-body text-center text-muted-foreground">
                    {info.line2}
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
