import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConfettiAnimation from "../components/ConfettiAnimation";
import ResultModal from "../components/ResultModal";
import { saveGameResult } from "../components/GameHistory";
import CalendarStoryIntro from "../components/CalendarStoryIntro";
import CalendarLeafGame from "../components/CalendarLeafGame";
import DiceLayout from "../components/layouts/DiceLayout";
import ZodiacLayout from "../components/layouts/ZodiacLayout";
import HintBubble from "../components/HintBubble";
import howtoplaySound from "../assets/howToPlaySound.mpeg";
import TimerSound from "../assets/TimerSound.mpeg";
import { useSound } from "@/contexts/SoundContext";
import correctDragSound from "../assets/correctDargSound.mpeg";
import inCorrectDragSound from "../assets/inCorrectDragSound.mpeg";
import Level2CompleteVideo from "../assets/Level2CompleteVideo.mp4";
import generalSound from "../assets/general-sound.mpeg";

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

const WEEK_OPTIONS = [
  ["Week 1", "Week 2", "Week 3"], // January
  ["Week 5", "Week 6", "Week 7"], // February
  ["Week 9", "Week 10", "Week 11"], // March
  ["Week 14", "Week 15", "Week 16"], // April
  ["Week 18", "Week 19", "Week 20"], // May
  ["Week 23", "Week 24", "Week 25"], // June
  ["Week 27", "Week 28", "Week 29"], // July
  ["Week 31", "Week 32", "Week 33"], // August
  ["Week 36", "Week 37", "Week 38"], // September
  ["Week 40", "Week 41", "Week 42"], // October
  ["Week 44", "Week 45", "Week 46"], // November
  ["Week 49", "Week 50", "Week 51"], // December
];

const CARD_STYLES = {
  week: {
    label: "Week & Day",
    emoji: "📆",
    data: [
      { line1: "Monday", line2: "Week 1" },
      { line1: "Tuesday", line2: "Week 5" },
      { line1: "Wednesday", line2: "Week 9" },
      { line1: "Thursday", line2: "Week 14" },
      { line1: "Friday", line2: "Week 18" },
      { line1: "Saturday", line2: "Week 23" },
      { line1: "Sunday", line2: "Week 27" },
      { line1: "Monday", line2: "Week 31" },
      { line1: "Tuesday", line2: "Week 36" },
      { line1: "Wednesday", line2: "Week 40" },
      { line1: "Thursday", line2: "Week 44" },
      { line1: "Friday", line2: "Week 49" },
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

];

const LAYOUT_OPTIONS = [
  { type: "dice", label: "Dice", emoji: "🎲" },
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
    clue: "Use Multiplication :-  Week number divided by 4 = ",
  },
];

const Level2Game = ({ story, onFinish }) => {
  const navigate = useNavigate();
  const [layout, setLayout] = useState("dice");
  const [cardStyle, setCardStyle] = useState("week");
  const [selectedWeeks] = useState(() =>
    WEEK_OPTIONS.map(
      (options) => options[Math.floor(Math.random() * options.length)],
    ),
  );
  const [calendars, setCalendars] = useState(() =>
    shuffleArray(MONTHS.map((m, i) => ({ ...m, id: i }))),
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
  const { playSound, isSoundEnabled } = useSound();
  const [timer, setTimer] = useState(0);

  const formatTime = (totalSeconds) => {
    if (totalSeconds < 60) return `${totalSeconds}s`;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}m ${seconds.toString().padStart(2, "0")}s`;
  };

  const trackInteraction = useCallback(
    () => setLastInteraction(Date.now()),
    [],
  );

  const availableCalendars = calendars.filter(
    (c) => !Object.values(placed).includes(c.id),
  );

  const handleDrop = useCallback(
    (slotIndex) => {
      if (draggedId === null) return;
      trackInteraction();
      const isCorrect = draggedId === slotIndex;

      playSound(isCorrect ? correctDragSound : inCorrectDragSound);
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

          saveGameResult(
            "Calendar Game 📅",
            isWin ? "win" : "loss",
            correctCount,
          );
          setShowResult(true);
        }, 600);
      }
    },
    [draggedId, placed, results, trackInteraction, playSound],
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

  const weekCardData = selectedWeeks.map((week) => ({
    line1: "",
    line2: week,
  }));

  const buildSlotConfig = (index) => {
    const isPlaced = placed[index] !== undefined;
    const result = results[index];
    return {
      isPlaced,
      result,
      isShaking: shakeSlot === index,
      placedMonth: isPlaced ? MONTHS[placed[index]] : null,
      onDragOver: (e) => e.preventDefault(),
      onDrop: (e) => {
        e.preventDefault();
        if (!isPlaced) handleDrop(index);
      },
      onClick: () => {
        if (!isPlaced && draggedId !== null) handleDrop(index);
      },
    };
  };
  // const slotElements = MONTHS.map((_, i) => buildSlot(i));
  const slotConfigs = MONTHS.map((_, i) => buildSlotConfig(i));
  const LayoutComponent = layout === "zodiac" ? ZodiacLayout : DiceLayout;

  useEffect(() => {
    if (!gameStarted || showResult || showHowToPlay) return;
    const interval = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, [gameStarted, showResult, showHowToPlay]);

  useEffect(() => {
    if (showHowToPlay) {
      playSound(howtoplaySound);
    }
  }, [showHowToPlay]);

  useEffect(() => {
    if (!gameStarted || showResult || showHowToPlay || !isSoundEnabled) return;

    const audio = new Audio(TimerSound);
    audio.loop = true;
    audio.volume = 0.3;
    audio.play().catch(() => {});

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [gameStarted, showResult, showHowToPlay, isSoundEnabled]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      // Ctrl + Shift + S dabao = skip
      if (e.shiftKey && e.key === "L") {
        setShowConfetti(true);
        setShowResult(true);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

    useEffect(() => {
      if (!showResult) return;
      if (!isSoundEnabled) return; // ✅ sound off ho toh mat bajao

      const audio = new Audio(generalSound);
      audio.play().catch(() => {});

      return () => {
        audio.pause(); // ✅ component unmount pe band
        audio.currentTime = 0;
      };
    }, [showResult, isSoundEnabled]);

  // showResult true hone pe poora component yeh return kare
  if (showResult) {
    return (
      <div className="bg-gradient-to-br from-blue-50 to-pink-50 px-3 py-4 min-h-screen flex flex-col items-center justify-center">
        <div className="text-center animate-bounce-in">
          <div className="text-6xl mb-2">🏆</div>
          <h3 className="font-display text-3xl font-bold text-primary mb-1">
            {gameResult === "win" ? "Level 2 Complete! 🌟" : "Well tried!! 😊"}
          </h3>
          <p className="text-muted-foreground font-bold mb-3 text-xl">
            {gameResult === "win"
              ? "You got it right! You're a champion! 🏆"
              : "You can try again! 🎉"}
          </p>
          <div
            className={`inline-block px-6 py-3 rounded-2xl font-display text-2xl font-bold mb-4 ${
              gameResult === "win"
                ? "bg-success text-success-foreground"
                : "bg-destructive text-destructive-foreground"
            }`}
          >
            Score: {gameScore}/{12}
          </div>

          <div className="flex gap-4 justify-center mb-6">
            <button
              onClick={resetGame}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-xl hover:scale-105 transition-all shadow-lg"
            >
              🔄 Try again
            </button>
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 rounded-xl bg-muted text-muted-foreground font-display font-bold text-xl hover:scale-105 transition-all shadow-lg"
            >
              🏠 Home
            </button>
          </div>

          {gameResult === "win" && (
            <div className="flex justify-center">
              <video
                src={Level2CompleteVideo}
                autoPlay
                loop
                muted
                className="w-full max-w-xl rounded-xl shadow-lg"
              />
            </div>
          )}
        </div>
        {showConfetti && <ConfettiAnimation />}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Level badge */}
      <div className="flex justify-center mb-3">
        <span className="px-4 py-1 rounded-full bg-secondary text-secondary-foreground font-display font-bold text-4xl">
          🎮 Level 2
        </span>
      </div>
      {/* <div className="text-center mb-4">
        <h2 className="font-display text-3xl md:text-5xl font-bold text-secondary mb-2">
          📅 The Paw Patch Puzzles
        </h2>
      </div> */}
      {/* Timer + Count Header — Level 1 jaisa */}
      <div className="grid grid-cols-3 items-center mb-4 max-w-11xl mx-20">
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
        <div className="flex justify-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-secondary whitespace-nowrap">
            📅 The Paw Patch Puzzles
          </h2>
        </div>

        {/* Correct Count - Right */}
        <div className="flex justify-end">
          <span className="text-lg font-bold bg-white px-4 py-2 rounded-full shadow-md">
            ✅ {Object.values(results).filter((v) => v === "correct").length}/12
          </span>
        </div>
      </div>
      <LayoutComponent slotConfigs={slotConfigs} centerContent={undefined} slots={slotConfigs} />
      <div className="max-w-4xl mx-auto">
        {draggedId !== null && (
          <p className="text-center text-2xl text-primary font-display font-bold mb-2 animate-pulse">
            ✨ Selected- Now click on the month in which the selected week will
            fall
          </p>
        )}

        <div className="grid grid-cols-6 gap-3 justify-center">
          {availableCalendars.map((cal) => {
            const info =
              cardStyle === "week"
                ? weekCardData[cal.id]
                : CARD_STYLES[cardStyle].data[cal.id];
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
                {/* <div className="text-2xl text-center">{cal.emoji}</div> */}
                <div className="text-[24px] font-display font-bold text-center mt-1 text-foreground">
                  {/* {info.line1} */}
                  {info.line2}
                </div>
                {/* <div className="text-[20px] font-body text-center text-muted-foreground">
                  {info.line2}
                </div> */}
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
      {/* <ResultModal
        isOpen={showResult}
        result={gameResult}
        score={gameScore}
        total={12}
        onClose={() => navigate("/")}
        onPlayAgain={resetGame}
      /> */}
    </div>
  );
};;


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
