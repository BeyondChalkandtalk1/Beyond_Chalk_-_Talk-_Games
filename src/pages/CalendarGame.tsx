import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ConfettiAnimation from "../components/ConfettiAnimation";
import ResultModal from "../components/ResultModal";
import { saveGameResult } from "../components/GameHistory";
import CalendarStoryIntro from "../components/CalendarStoryIntro";
import CalendarLeafGame from "../components/CalendarLeafGame";
import DiceLayout from "../components/layouts/DiceLayout";
import ZodiacLayout from "../components/layouts/ZodiacLayout";
import HintBubble from "../components/HintBubble";


const MONTHS = [
  { name: "January", short: "Jan", emoji: "❄️", color: "hsl(200 70% 60%)" },
  { name: "February", short: "Feb", emoji: "🌿", color: "hsl(340 70% 60%)" },
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
      { line1: "Winter 🧣", line2: "End winter" },
      { line1: "Spring 🌸", line2: "Phool" },
      { line1: "Spring 📚", line2: "School" },
      { line1: "Summer 🌻", line2: "Garmi" },
      { line1: "Summer ☀️", line2: "Dhoop" },
      { line1: "Monsoon 🌈", line2: "Sawan" },
      { line1: "Monsoon 🌾", line2: "Fasal" },
      { line1: "Autumn 🍂", line2: "Colorful Season" },
      { line1: "Autumn 🎃", line2: "Tyohaar" },
      { line1: "Pre-Winter 🍂", line2: "Patjhad" },
      { line1: "Winter 🎄", line2: "Zeus" },
    ],
  },
  festival: {
    label: "Festival",
    emoji: "🎉",
    data: [
      { line1: "Lohri 🔥", line2: "Makkar Sankranti" },
      { line1: "Valentine 🌿", line2: "Basant Panchami" },
      { line1: "Holi 🎨", line2: "Rang Barse" },
      { line1: "Baisakhi 🌾", line2: "Naya Saal" },
      { line1: "Buddha Purnima 🪷", line2: "Enlightenment" },
      { line1: "Eid ☪️", line2: "Chand Raat" },
      { line1: "Guru Purnima 🙏", line2: "Teacher's Day" },
      { line1: "Raksha Bandhan 🧵", line2: "Bhai-Behen" },
      { line1: "Ganesh Chaturthi 🐘", line2: "Ganapati Bappa" },
      { line1: "Dussehra ⚔️", line2: "Ravan Dahan" },
      { line1: "Diwali 🪔", line2: "Festival of Lights" },
      { line1: "Christmas 🎄", line2: "Jingle Bells" },
    ],
  },
};

const CARD_STYLE_OPTIONS = [
  { type: "week", label: "Week & Day", emoji: "📆" },
  // { type: "date", label: "Date & Day", emoji: "📅" },
  // { type: "season", label: "Season", emoji: "🌤️" },
  // { type: "festival", label: "Festival", emoji: "🎉" },
];

const LAYOUT_OPTIONS = [
  { type: "dice", label: "Dice", emoji: "🎲" },
  // { type: "zodiac", label: "Zodiac", emoji: "♈" },
];

const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// ──────────────────────────────────────────────
// Level 2: Dice / Zodiac month-matching game
// ──────────────────────────────────────────────
const LEVEL2_HINTS = [
  {
    emoji: "📅",
    clue: "Each month usually has about 4 weeks. Use Repeated Addition to find the month!",
  },
  {
    emoji: "🔢",
    clue: "Use Multiplication — Week Number ÷ 4 ≈ Month Number!",
  },
];

const Level2Game = ({ story, onFinish }) => {
  const navigate = useNavigate();
  const [layout, setLayout] = useState("dice");
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
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [showHowToPlay, setShowHowToPlay] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);

  const trackInteraction = useCallback(() => setLastInteraction(Date.now()), []);

  const availableCalendars = calendars.filter(
    (c) => !Object.values(placed).includes(c.id)
  );

  const handleDrop = useCallback(
    (slotIndex) => {
      if (draggedId === null) return;
      trackInteraction();
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
    [draggedId, placed, results, trackInteraction]
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
        className={`w-16 h-16 md:w-20 md:h-20 rounded-2xl border-2 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
          isPlaced
            ? result === "correct"
              ? "bg-green-100 border-green-500"
              : "bg-red-100 border-red-500"
            : "bg-card border-border hover:border-primary"
        } ${isShaking ? "animate-shake" : ""} ${
          isPlaced && result === "correct" ? "animate-bounce-in" : ""
        }`}
        style={{ boxShadow: isPlaced ? undefined : "var(--shadow-card)" }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (!isPlaced) handleDrop(index);
        }}
        onClick={() => {
          if (!isPlaced && draggedId !== null) handleDrop(index);
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
  const LayoutComponent = layout === "zodiac" ? ZodiacLayout : DiceLayout;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Level badge */}
      <div className="flex justify-center mb-3">
        <span className="px-4 py-1 rounded-full bg-secondary text-secondary-foreground font-display font-bold text-sm">
          🎮 Level 2 — Month Matching
        </span>
      </div>
      <div className="text-center mb-4">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-secondary mb-2">
          📅 The Paw Patch Puzzles
        </h2>
        <p className="text-muted-foreground font-bold text-3xl">
          Drag and drop the calendar to the correct month! 🎯
        </p>
      </div>
      {/* Layout switcher */}
      <div className="flex justify-center gap-2 mb-4 flex-wrap">
        {LAYOUT_OPTIONS.map((opt) => (
          <button
            key={opt.type}
            onClick={() => setLayout(opt.type)}
            className={`px-4 py-2 rounded-xl font-display font-bold text-xl transition-all ${
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
      <div className="max-w-4xl mx-auto">
        <h3 className="font-display text-3xl font-bold text-foreground text-center mb-3">
          📦 Calendars — Drag! (or Click)
        </h3>

        {/* Card style switcher */}
        <div className="flex justify-center gap-2 mb-4 flex-wrap">
          {CARD_STYLE_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              onClick={() => setCardStyle(opt.type)}
              className={`px-3 py-1.5 rounded-xl font-display font-bold text-2xl transition-all ${
                cardStyle === opt.type
                  ? "bg-secondary text-secondary-foreground scale-105"
                  : "bg-card border-2 border-border text-foreground hover:border-secondary"
              }`}
            >
              {opt.emoji} {opt.label}
            </button>
          ))}
        </div>

        {draggedId !== null && (
          <p className="text-center text-sm text-primary font-display font-bold mb-2 animate-pulse">
            ✨ Selected — ab upar month pe click karo!
          </p>
        )}

        <div className="grid grid-cols-4 gap-3 justify-center">
          {availableCalendars.map((cal) => {
            const info = CARD_STYLES[cardStyle].data[cal.id];
            return (
              <div
                key={cal.id}
                draggable
                onDragStart={() => {
                  setDraggedId(cal.id);
                  trackInteraction();
                }}
                onTouchStart={() => {
                  setDraggedId(cal.id);
                  trackInteraction();
                }}
                onClick={() => {
                  setDraggedId(draggedId === cal.id ? null : cal.id);
                  trackInteraction();
                }}
                className={`px-4 py-3 rounded-xl cursor-grab active:cursor-grabbing transition-all duration-200 hover:scale-105 select-none border-2 min-w-[150px] ${
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
                <div className="text-[24px] font-display font-bold text-center mt-1 text-foreground">
                  {info.line1}
                </div>
                <div className="text-[20px] font-body text-center text-muted-foreground">
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
      {/* Hint after 60s inactivity */}
      {/* {!showResult && (
        <HintBubble
          unplacedMonths={[...Array(12).keys()].filter(i => placed[i] === undefined)}
          lastInteraction={lastInteraction}
          delay={60000}
        />
      )} */}
      {!showResult && !showHowToPlay && (
        <HintBubble
          unplacedMonths={[...Array(12).keys()].filter(
            (i) => placed[i] === undefined,
          )}
          lastInteraction={lastInteraction}
          delay={60000}
          maxHints={2}
          customHints={LEVEL2_HINTS}
        />
      )}
      {showHowToPlay && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div
            className="w-[90%] max-w-xl p-6 rounded-2xl shadow-xl"
            style={{ backgroundColor: "#FBF5EF" }}
          >
            <h2
              className="text-2xl font-bold text-center mb-4"
              style={{ color: "#8F2424" }}
            >
              📖 How to Play — Level 2
            </h2>

            <ul
              className="text-gray-700 space-y-2 text-2xl font-semibold leading-relaxed"
              style={{ fontFamily: "'Times New Roman', var(--font-body)" }}
            >
              <li>
                🔢 Look carefully at the <strong>week number</strong> on the
                card. (e.g. Week 8, Week 39)
              </li>
              <li>
                🧠 Think about which <strong>month of the year</strong> that
                week falls in.
              </li>
              <li>
                🗓️ Find the correct <strong>month tile</strong> on the board.
              </li>
              <li>
                🖱️ <strong>Drag and drop</strong> the card onto that month.
              </li>
              <li>
                ✅ If correct, the calendar patch gets <strong>fixed!</strong>
              </li>
            </ul>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => {
                  setShowHowToPlay(false);
                  setGameStarted(true);
                  trackInteraction(); // ← yahan se 60s hint timer shuru hoga
                }}
                className="px-6 py-2 rounded-full text-white font-semibold text-xl"
                style={{ backgroundColor: "#8F2424" }}
              >
                Start Playing 🚀
              </button>
            </div>
          </div>
        </div>
      )}
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


// ──────────────────────────────────────────────
// Main CalendarGame — orchestrates all screens
// ──────────────────────────────────────────────
const CalendarGame = () => {
  // screen: "intro" | "level1" | "level2"
  const [screen, setScreen] = useState("intro");
  const [selectedStory, setSelectedStory] = useState(null);

  const handleStoryStart = (story) => {
    setSelectedStory(story);
    setScreen("level1");
  };

  const handleLevel1Complete = () => {
    setScreen("level2");
  };

  if (screen === "intro") {
    return <CalendarStoryIntro onStart={handleStoryStart} />;
  }

  if (screen === "level1") {
    return <CalendarLeafGame story={selectedStory} onComplete={handleLevel1Complete} />;
  }

  return <Level2Game story={selectedStory} onFinish={() => setScreen("intro")} />;
};

export default CalendarGame;
