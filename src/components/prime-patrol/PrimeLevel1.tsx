import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/contexts/SoundContext";
import TimerSound from "@/assets/TimerSound.mpeg";
import howtoplaySound from "@/assets/howToPlaySound.mpeg";
import correctSound from "@/assets/correctDargSound.mpeg";
import incorrectSound from "@/assets/inCorrectDragSound.mpeg";
import generalSound from "@/assets/general-sound.mpeg";
import Level1CompleteVideo from "../../assets/game2level1complete.mp4";
import NextPossibleSound from "../../assets/NextPossibleArragementsSound.mpeg";
import OnCongratulationsSound from "../../assets/OnCongratulations.mpeg";

interface PrimeLevel1Props {
  luckyNumber: number;
  onComplete: () => void;
  onSpinAgain: () => void;
}

const EMOJIS = ["⭐", "💎", "🎯", "🌈"];
const MAX_DIM = 99;

function getFactorPairs(n: number): [number, number][] {
  const pairs: [number, number][] = [];
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      const j = n / i;
      if (i <= MAX_DIM && j <= MAX_DIM) pairs.push([i, j]);
    }
  }
  return pairs;
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function detectRectangle(cells: Set<string>): [number, number] | null {
  if (cells.size === 0) return null;
  const positions = Array.from(cells).map((k) => {
    const [r, c] = k.split(",").map(Number);
    return [r, c] as [number, number];
  });
  const rows = positions.map((p) => p[0]);
  const cols = positions.map((p) => p[1]);
  const minR = Math.min(...rows),
    maxR = Math.max(...rows);
  const minC = Math.min(...cols),
    maxC = Math.max(...cols);
  const h = maxR - minR + 1,
    w = maxC - minC + 1;
  if (h * w !== cells.size) return null;
  for (let r = minR; r <= maxR; r++)
    for (let c = minC; c <= maxC; c++) if (!cells.has(`${r},${c}`)) return null;
  return [h, w];
}

type Phase =
  | "howtoplay"
  | "timerStart"
  | "countdown"
  | "playing"
  | "rectFound"
  | "congrats"
  | "inputPair"
  | "primeCongrats"
  | "complete"
  | "quiz1"
  | "quiz2";

export default function PrimeLevel1({
  luckyNumber,
  onComplete,
  onSpinAgain,
}: PrimeLevel1Props) {
  const { playSound, isSoundEnabled } = useSound();

  const [phase, setPhase] = useState<Phase>("howtoplay");
  const [emoji, setEmoji] = useState("⭐");
  const [cells, setCells] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState<
    {
      rows: number;
      cols: number;
      snapshot: Set<string>;
      gRows: number;
      gCols: number;
    }[]
  >([]);
  const [currentRect, setCurrentRect] = useState<[number, number] | null>(null);
  const [timer, setTimer] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [inputR, setInputR] = useState("");
  const [inputC, setInputC] = useState("");
  const [inputError, setInputError] = useState("");
  const [noRectMsg, setNoRectMsg] = useState("");
  const [highlightRect, setHighlightRect] = useState(false);
  const [congratsError, setCongratsError] = useState("");
  const [wrongCells, setWrongCells] = useState<Set<string>>(new Set());
  const [isDragging, setIsDragging] = useState(false);
  const [dragMode, setDragMode] = useState<"add" | "remove">("add");

  // ── Quiz state ──────────────────────────────────────────────────────────────
  const [quiz1Answer, setQuiz1Answer] = useState<"yes" | "no" | null>(null);
  const [quiz1Wrong, setQuiz1Wrong] = useState(false);
  const [quiz2InputR, setQuiz2InputR] = useState("");
  const [quiz2InputC, setQuiz2InputC] = useState("");
  const [quiz2Error, setQuiz2Error] = useState("");
  const [quiz2AnsweredPairs, setQuiz2AnsweredPairs] = useState<
    [number, number][]
  >([]);
  const [quiz2Done, setQuiz2Done] = useState(false);
  const [showEmptyGrid, setShowEmptyGrid] = useState(true);
const [quiz2FactorsInput, setQuiz2FactorsInput] = useState("");
const [quiz2HintVisible, setQuiz2HintVisible] = useState(false);

  const completedRef = useRef(completed);
  const gridRef = useRef<HTMLDivElement>(null);
  completedRef.current = completed;

  const primeNum = useMemo(() => isPrime(luckyNumber), [luckyNumber]);
  const allPairs = useMemo(() => getFactorPairs(luckyNumber), [luckyNumber]);

  const { gridRows, gridCols } = useMemo(() => {
    if (allPairs.length === 0) {
      const sq = Math.ceil(Math.sqrt(luckyNumber)) + 2;
      return { gridRows: Math.min(sq, 12), gridCols: Math.min(sq, 12) };
    }
    const maxA = Math.max(...allPairs.map(([a]) => a));
    const maxB = Math.max(...allPairs.map(([, b]) => b));
    return {
      gridRows: Math.min(maxA + 2, 20),
      gridCols: Math.min(maxB + 2, 72),
    };
  }, [allPairs, luckyNumber]);

  const cellSize = useMemo(() => {
    const screenW = Math.min(window.innerWidth * 0.94, 680);
    return Math.max(Math.floor(screenW / Math.min(gridCols, 18)), 34);
  }, [gridCols]);

  const remaining = useMemo(
    () =>
      allPairs.filter(
        ([a, b]) => !completed.some((c) => c.rows === a && c.cols === b),
      ),
    [allPairs, completed],
  );

  // Timer
  useEffect(() => {
    if (phase !== "playing" && phase !== "rectFound") return;
    const iv = setInterval(() => setTimer((t) => t + 1), 1000);
    return () => clearInterval(iv);
  }, [phase]);

  // Countdown
  useEffect(() => {
    if (phase !== "countdown") return;
    if (countdown < 0) {
      setPhase("playing");
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  const handleStartTimer = () => setPhase("countdown");

  useEffect(() => {
    if (phase !== "playing" || !isSoundEnabled) return;
    const audio = new Audio(TimerSound);
    audio.loop = true;
    audio.volume = 0.3;
    audio.play().catch(() => {});
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [phase, isSoundEnabled]);

  // Congrats sound
  useEffect(() => {
    if (phase !== "congrats") return;
    playSound(OnCongratulationsSound);
  }, [phase]);

  // InputPair sound
  useEffect(() => {
    if (phase !== "inputPair") return;
    playSound(NextPossibleSound);
  }, [phase]);

  useEffect(() => {
    if (phase === "howtoplay" || showHowToPlay) playSound(howtoplaySound);
  }, [phase, showHowToPlay]);

  useEffect(() => {
    if (phase !== "complete" || !isSoundEnabled) return;
    const audio = new Audio(generalSound);
    audio.play().catch(() => {});
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [phase, isSoundEnabled]);

  useEffect(() => {
    if (phase !== "playing") return;
    if (cells.size < luckyNumber) {
      setNoRectMsg("");
      setWrongCells(new Set());
      return;
    }
    if (cells.size !== luckyNumber) return;

    const rect = detectRectangle(cells);
    if (rect) {
      const norm: [number, number] =
        rect[0] <= rect[1] ? [rect[0], rect[1]] : [rect[1], rect[0]];
      const alreadyDone = completedRef.current.some(
        (c) => c.rows === norm[0] && c.cols === norm[1],
      );
      if (alreadyDone) {
        setNoRectMsg(
          `You already found ${norm[0]} × ${norm[1]}! Try a different arrangement! 😊`,
        );
        return;
      }
      setCurrentRect(norm);
      setHighlightRect(true);
      setPhase("rectFound");
      setNoRectMsg("");
      playSound(correctSound);
      const cellsSnapshot = new Set(cells);
      setTimeout(() => {
        setCompleted((prev) => [
          ...prev,
          {
            rows: norm[0],
            cols: norm[1],
            snapshot: cellsSnapshot,
            gRows: gridRows,
            gCols: gridCols,
          },
        ]);
        setHighlightRect(false);
        setPhase("congrats");
        setCongratsError("");
      }, 2000);
    } else {
      setWrongCells(new Set(cells));
      setNoRectMsg("");
      setTimeout(() => {
        setWrongCells(new Set());
        if (primeNum) {
          playSound(correctSound);
          setPhase("primeCongrats");
        } else {
          playSound(incorrectSound);
          setNoRectMsg(
            "Not a perfect rectangle! Try a different arrangement! 🤔",
          );
          setCells(new Set());
        }
      }, 1500);
    }
  }, [cells.size, phase]);

  const handleCellClick = useCallback(
    (r: number, c: number) => {
      if (phase !== "playing") return;
      const key = `${r},${c}`;
      setCells((prev) => {
        const next = new Set(prev);
        if (next.has(key)) next.delete(key);
        else if (next.size < luckyNumber) next.add(key);
        return next;
      });
    },
    [phase, luckyNumber],
  );

  const handleClear = () => {
    setCells(new Set());
    setWrongCells(new Set());
    setNoRectMsg("");
  };

  const handlePrimeGuess = () => {
    if (primeNum) {
      playSound(correctSound);
      setPhase("primeCongrats");
    } else {
      playSound(incorrectSound);
      setNoRectMsg(
        `Not prime! ${luckyNumber} is composite. Try to form a rectangle! 💪`,
      );
      setCells(new Set());
    }
  };

  const handleMoreYes = () => {
    setPhase("inputPair");
    setInputR("");
    setInputC("");
    setInputError("");
  };

  const handleMoreNo = () => {
    const currentRemaining = allPairs.filter(
      ([a, b]) =>
        !completedRef.current.some((c) => c.rows === a && c.cols === b),
    );
    if (currentRemaining.length > 0) {
      setCongratsError(
        `Oops! There are still ${currentRemaining.length} more arrangement(s) possible! Think again! 🤔`,
      );
    } else {
      // Instead of going directly to "complete", go to quiz1
      setPhase("quiz1");
      setQuiz1Answer(null);
      setQuiz1Wrong(false);
    }
  };

  const handleSubmitPair = () => {
    const r = parseInt(inputR),
      c = parseInt(inputC);
    if (isNaN(r) || isNaN(c) || r <= 0 || c <= 0) {
      setInputError("Please enter valid numbers!");
      return;
    }
    if (r * c !== luckyNumber) {
      setInputError(
        `${r} × ${c} = ${r * c}, but we need ${luckyNumber}! Try again! 🤔`,
      );
      return;
    }
    const norm: [number, number] = r <= c ? [r, c] : [c, r];
    if (completed.some((c) => c.rows === norm[0] && c.cols === norm[1])) {
      setInputError(`Already found ${norm[0]} × ${norm[1]}! Try another!`);
      return;
    }
    if (r > MAX_DIM || c > MAX_DIM) {
      setInputError(`Too big! Both numbers must be ≤ ${MAX_DIM}`);
      return;
    }
    setCells(new Set());
    setNoRectMsg("");
    setPhase("playing");
  };

  // ── Quiz 1: Is it a perfect rectangle? ─────────────────────────────────────
  // Correct answer: composite => YES (it IS a rectangle / composite), prime => NO
  const handleQuiz1Answer = (answer: "yes" | "no") => {
    setQuiz1Answer(answer);
    const correctAnswer = primeNum ? "no" : "yes";
    if (answer === correctAnswer) {
      playSound(correctSound);
      setQuiz1Wrong(false);
      // Delay then move to quiz2
      setTimeout(() => {
        setPhase("quiz2");
        setQuiz2InputR("");
        setQuiz2InputC("");
        setQuiz2Error("");
        setQuiz2AnsweredPairs([]);
        setQuiz2Done(false);
      }, 1200);
    } else {
      playSound(incorrectSound);
      setQuiz1Wrong(true);
      setQuiz1Answer(null);
    }
  };

  // ── Quiz 2: What are the factors? ──────────────────────────────────────────
const handleQuiz2Submit = () => {
  const entered = quiz2FactorsInput
    .split(/[\s,،]+/)
    .map((s) => parseInt(s.trim()))
    .filter((n) => !isNaN(n) && n > 0);

  if (entered.length === 0) {
    setQuiz2Error("Please enter the factors separated by commas!");
    return;
  }

  const correctFactors: number[] = [];
  for (let i = 1; i <= luckyNumber; i++) {
    if (luckyNumber % i === 0) correctFactors.push(i);
  }

  const enteredUnique = [...new Set(entered)].sort((a, b) => a - b);
  const correctSorted = [...correctFactors].sort((a, b) => a - b);

  const wrong = enteredUnique.filter((n) => luckyNumber % n !== 0);
  if (wrong.length > 0) {
    setQuiz2Error(`${wrong.join(", ")} ${wrong.length === 1 ? "is" : "are"} not a factor of ${luckyNumber}! Try again.`);
    playSound(incorrectSound);
    return;
  }

  const missing = correctSorted.filter((f) => !enteredUnique.includes(f));
  if (missing.length > 0) {
    setQuiz2Error(`You're missing some factors! Check your arrangements again.`);
    playSound(incorrectSound);
    return;
  }

  playSound(correctSound);
  setQuiz2Error("");
  setQuiz2Done(true);
};
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key === "L") setPhase("complete");
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  const formatTime = (s: number) =>
    s < 60
      ? `${s}s`
      : `${Math.floor(s / 60)}m ${(s % 60).toString().padStart(2, "0")}s`;

  // ─── Quiz 1 Screen ─────────────────────────────────────────────────────────
  // if (phase === "quiz1") {
  //   return (
  //     <div
  //       className="min-h-screen flex flex-col items-center justify-center p-6"
  //       style={{
  //         background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
  //       }}
  //     >
  //       <motion.div
  //         className="w-full max-w-lg"
  //         initial={{ opacity: 0, y: 40 }}
  //         animate={{ opacity: 1, y: 0 }}
  //         transition={{ type: "spring", stiffness: 180 }}
  //       >
  //         {/* Question card */}
  //         <div
  //           className="rounded-3xl p-8 text-center shadow-2xl border-2"
  //           style={{
  //             background: "linear-gradient(135deg, #1e293b, #0f172a)",
  //             borderColor: "#FFD700",
  //             boxShadow: "0 0 60px rgba(255,215,0,0.2)",
  //           }}
  //         >
  //           <div className="text-5xl mb-4">🤔</div>
  //           <p className="text-yellow-300 text-lg font-semibold mb-2 tracking-widest uppercase">
  //             Question 1
  //           </p>
  //           <h2
  //             className="text-3xl font-bold text-white mb-2"
  //             style={{ fontFamily: "var(--font-display)" }}
  //           >
  //             Is <span className="text-yellow-400">{luckyNumber}</span> a
  //             perfect rectangle number?
  //           </h2>
  //           <p className="text-gray-400 text-lg mb-8">
  //             Can {luckyNumber} icons be arranged into a perfect rectangle
  //             (other than 1 × {luckyNumber})?
  //           </p>

  //           {quiz1Wrong && (
  //             <motion.p
  //               className="text-red-400 font-bold mb-4 text-lg"
  //               initial={{ opacity: 0, scale: 0.8 }}
  //               animate={{ opacity: 1, scale: 1 }}
  //             >
  //               ❌ Oops! That's not right. Try again! 🤔
  //             </motion.p>
  //           )}

  //           <div className="flex gap-6 justify-center">
  //             <motion.button
  //               onClick={() => handleQuiz1Answer("yes")}
  //               className="px-10 py-4 rounded-2xl font-bold text-xl text-white shadow-xl"
  //               style={{
  //                 background: "linear-gradient(135deg, #16a34a, #4ade80)",
  //               }}
  //               whileHover={{ scale: 1.08 }}
  //               whileTap={{ scale: 0.95 }}
  //             >
  //               ✅ Yes
  //             </motion.button>
  //             <motion.button
  //               onClick={() => handleQuiz1Answer("no")}
  //               className="px-10 py-4 rounded-2xl font-bold text-xl text-white shadow-xl"
  //               style={{
  //                 background: "linear-gradient(135deg, #dc2626, #f97316)",
  //               }}
  //               whileHover={{ scale: 1.08 }}
  //               whileTap={{ scale: 0.95 }}
  //             >
  //               ❌ No
  //             </motion.button>
  //           </div>
  //         </div>

  //         {/* Arrangements found hint */}
  //         {/* {completed.length > 0 && (
  //           <div className="mt-6 text-center">
  //             <p className="text-gray-400 text-sm mb-2">
  //               Arrangements you found:
  //             </p>
  //             <div className="flex flex-wrap justify-center gap-2">
  //               {completed.map((c, i) => (
  //                 <span
  //                   key={i}
  //                   className="bg-yellow-400/20 border border-yellow-400/40 text-yellow-300 font-bold px-4 py-1.5 rounded-full text-lg"
  //                 >
  //                   {c.rows} × {c.cols}
  //                 </span>
  //               ))}
  //             </div>
  //           </div>
  //         )} */}
  //       </motion.div>
  //     </div>
  //   );
  // }
  if (phase === "quiz1") {
  const lastArr = completed.length > 0
    ? completed[completed.length - 1]
    : { rows: allPairs[0]?.[0] ?? 1, cols: allPairs[0]?.[1] ?? luckyNumber };
  const R = lastArr.rows;
  const C = lastArr.cols;

  const correctLabel = `${R} rows and ${C} columns`;

  const rawOptions: string[] = [
    correctLabel,
    `${C} rows and ${R} columns`,
    `${luckyNumber} rows and 1 column`,
    `1 row and ${luckyNumber} columns`,
  ];

  const seen = new Set<string>();
  const uniqueOptions: string[] = [];
  for (const o of rawOptions) {
    if (!seen.has(o)) { seen.add(o); uniqueOptions.push(o); }
  }
  while (uniqueOptions.length < 4) uniqueOptions.push(`${uniqueOptions.length} rows and ? columns`);

  const shuffled = [...uniqueOptions].sort((a, b) => {
    const seed = luckyNumber % 3;
    return (a.charCodeAt(seed % a.length) - b.charCodeAt(seed % b.length));
  });

  const optionLetters = ["A", "B", "C", "D"];

  const handleMCQ = (chosen: string) => {
    if (chosen === correctLabel) {
      playSound(correctSound);
      setQuiz1Wrong(false);
      setTimeout(() => {
        setPhase("quiz2");
        setQuiz2InputR("");
        setQuiz2InputC("");
        setQuiz2Error("");
        setQuiz2AnsweredPairs([]);
        setQuiz2Done(false);
        setQuiz2FactorsInput("");
        setQuiz2HintVisible(false);
      }, 1200);
    } else {
      playSound(incorrectSound);
      setQuiz1Wrong(true);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)" }}
    >
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 180 }}
      >
        <div
          className="rounded-3xl p-8 shadow-2xl border-2"
          style={{
            background: "linear-gradient(135deg, #1e293b, #0f172a)",
            borderColor: "#FFD700",
            boxShadow: "0 0 60px rgba(255,215,0,0.2)",
          }}
        >
          <div className="text-5xl mb-3 text-center">🤔</div>
          <p className="text-yellow-300 text-base font-bold tracking-widest uppercase text-center mb-4">
            Question 1
          </p>
          <p className="text-white text-xl md:text-2xl font-semibold text-center mb-2 leading-relaxed">
            You have arranged{" "}
            <span className="text-yellow-400 font-bold">{luckyNumber}</span>{" "}
            counters in a rectangular arrangement with{" "}
            <span className="text-yellow-400 font-bold">{R}</span>{" "}
            horizontal line{R !== 1 ? "s" : ""} and{" "}
            <span className="text-yellow-400 font-bold">{C}</span>{" "}
            counter{C !== 1 ? "s" : ""} in each line.
          </p>
          <p className="text-gray-300 text-lg text-center mb-6">
            Which combination correctly describes your array?
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            {shuffled.map((option, i) => (
              <motion.button
                key={option}
                onClick={() => handleMCQ(option)}
                className="flex items-center gap-3 px-5 py-4 rounded-2xl text-left font-semibold text-lg border-2 transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  borderColor: "rgba(255,255,255,0.15)",
                  color: "#fff",
                }}
                whileHover={{ scale: 1.03, borderColor: "#FFD700", background: "rgba(255,215,0,0.1)" }}
                whileTap={{ scale: 0.97 }}
              >
                <span
                  className="text-base font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,215,0,0.2)", color: "#FFD700" }}
                >
                  {optionLetters[i]}
                </span>
                {option}
              </motion.button>
            ))}
          </div>

          <AnimatePresence>
            {quiz1Wrong && (
              <motion.p
                className="text-red-400 font-bold text-center text-lg mt-2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                ❌ Oops! That's not right. Try again! 🤔
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

  // ─── Quiz 2 Screen — FULL PAGE (no modal) ─────────────────────────────────
  if (phase === "quiz2") {
    const remainingQ2 = allPairs.filter(
      ([a, b]) => !quiz2AnsweredPairs.some(([qa, qb]) => qa === a && qb === b),
    );

    // Left panel = 70vw, cell size based on that
    const leftPanelPx = Math.floor(window.innerWidth * 0.7) - 64;
    const rightPanelPx = Math.floor(window.innerWidth * 0.28) - 32;

    // Helper to render a grid with snapshot
    const renderGrid = (
      item: {
        rows: number;
        cols: number;
        snapshot: Set<string>;
        gRows: number;
        gCols: number;
      },
      panelW: number,
      fillColor: string,
      fillBorder: string,
      labelColor: string,
    ) => {
      const { rows, cols, snapshot, gRows, gCols } = item;
      const cs = showEmptyGrid
        ? Math.max(28, Math.min(52, Math.floor(panelW / gCols)))
        : Math.max(28, Math.min(52, Math.floor(panelW / cols)));
      const displayGRows = showEmptyGrid ? gRows : rows;
      const displayGCols = showEmptyGrid ? gCols : cols;

      return (
        <div
          key={`${rows}-${cols}`}
          className="flex flex-col items-start gap-2 w-full"
        >
          {/* <p style={{ color: labelColor }} className="font-bold text-base pl-1">
            {rows} × {cols}
          </p> */}
          {/* Horizontally scrollable wrapper */}
          <div
            style={{
              overflowX: "auto",
              overflowY: "hidden",
              width: "100%",
              paddingBottom: "4px",
            }}
            className="hide-scrollbar"
          >
            <div
              style={{
                display: "inline-grid",
                gridTemplateColumns: `repeat(${displayGCols}, ${cs}px)`,
                gridTemplateRows: `repeat(${displayGRows}, ${cs}px)`,
                gap: "3px",
              }}
            >
              {Array.from({ length: displayGRows * displayGCols }).map(
                (_, idx) => {
                  const r = Math.floor(idx / displayGCols);
                  const c = idx % displayGCols;
                  const key = `${r},${c}`;
                  const isFilled = showEmptyGrid ? snapshot.has(key) : true;
                  return (
                    <div
                      key={idx}
                      style={{
                        width: cs,
                        height: cs,
                        fontSize: cs * 0.72,
                        lineHeight: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: isFilled ? fillColor : "#ffffff",
                        borderRadius: 6,
                        border: isFilled
                          ? `1.5px solid ${fillBorder}`
                          : "1.5px solid #d1d5db",
                        flexShrink: 0,
                      }}
                    >
                      {isFilled ? emoji : ""}
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </div>
      );
    };

    return (
      <motion.div
        className="min-h-screen flex flex-col"
        style={{
          background: "linear-gradient(135deg, #0f172a, #1e1b4b, #0c1a3a)",
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* ── Top Header ── */}
        <div className="text-center pt-5 pb-3 px-6">
          <p className="text-yellow-300 text-sm font-bold tracking-[0.2em] uppercase mb-1">
            Question 2
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-snug"
    style={{ fontFamily: "var(--font-display)" }}
  >
    You have arranged <span className="text-yellow-400">{luckyNumber}</span> counters into rectangular arrangements.
    <br />
    <span className="text-gray-300 text-xl font-normal">
      In each arrangement, the number of rows and columns are factors of{" "}
      <span className="text-yellow-400 font-bold">{luckyNumber}</span>.
    </span>
  </h1>
    <p className="text-gray-300 text-lg mt-1">
    Using the rectangular arrangements you made, write all the factors of{" "}
    <span className="text-yellow-400 font-bold">{luckyNumber}</span>.
  </p>
          {/* Toggle + Progress in one row */}
          <div className="flex items-center justify-center gap-6 mt-3">
            {/* <button
              onClick={() => setShowEmptyGrid((v) => !v)}
              className="px-4 py-1.5 rounded-full font-bold text-sm border-2 transition-all"
              style={{
                background: showEmptyGrid
                  ? "rgba(255,255,255,0.15)"
                  : "transparent",
                borderColor: showEmptyGrid ? "#fff" : "rgba(255,255,255,0.3)",
                color: showEmptyGrid ? "#fff" : "rgba(255,255,255,0.5)",
              }}
            >
              {showEmptyGrid ? "⬜ Show Only Filled" : "⬜ Show Full Grid"}
            </button> */}
            <div className="flex items-center gap-3">
              <div className="w-40 bg-white/10 rounded-full h-2">
                <motion.div
                  className="h-2 rounded-full"
                  style={{
                    background: "linear-gradient(90deg, #4CAF50, #8BC34A)",
                  }}
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(quiz2AnsweredPairs.length / allPairs.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-gray-400 text-sm whitespace-nowrap">
                {quiz2AnsweredPairs.length} / {allPairs.length} done
              </p>
            </div>
          </div>
        </div>

        {/* ── 70 / 30 split ── */}
        <div
          className="flex flex-1 gap-3 px-3 pb-4 min-h-0 "
          style={{ overflow: "hidden" }}
        >
          {/* LEFT 70% — Your Arrangements */}
          <div
            className="rounded-2xl p-5 border border-indigo-500/30 overflow-y-auto hide-scrollbar"
            style={{ width: "70%", background: "rgba(255,255,255,0.04)" }}
          >
            <p className="text-indigo-300 text-xl font-bold mb-4 uppercase tracking-widest text-center">
              🎮 Your Arrangements
            </p>
            {completed.length === 0 && (
              <p className="text-gray-500 text-center text-sm mt-8">
                None recorded
              </p>
            )}
            <div className="flex flex-col gap-8 ">
              {completed.map((item) =>
                renderGrid(
                  item,
                  leftPanelPx,
                  "rgba(99,102,241,0.30)",
                  "rgba(139,92,246,0.55)",
                  "#fde047",
                ),
              )}
            </div>
          </div>

          {/* RIGHT 30% — Input on top, Answered below */}
          <div className="flex flex-col gap-3" style={{ width: "30%" }}>
            {/* Input box */}
            <div
              className="rounded-2xl px-4 py-5 border border-yellow-500/30 flex flex-col items-center gap-3"
              style={{ background: "rgba(255,215,0,0.06)" }}
            >
              <p className="text-yellow-300 font-bold text-xl text-center">
                Enter a factor pair:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={quiz2InputR}
                  onChange={(e) => setQuiz2InputR(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleQuiz2Submit()}
                  placeholder="rows"
                  className="w-28 px-2 py-2 rounded-xl text-center text-lg font-bold bg-white/10 text-white border-2 border-white/20 focus:border-yellow-400 focus:outline-none"
                />
                <span className="text-2xl text-yellow-400 font-bold">×</span>
                <input
                  type="number"
                  value={quiz2InputC}
                  onChange={(e) => setQuiz2InputC(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleQuiz2Submit()}
                  placeholder="cols"
                  className="w-28 px-2 py-2 rounded-xl text-center text-lg font-bold bg-white/10 text-white border-2 border-white/20 focus:border-yellow-400 focus:outline-none"
                />
              </div>
              <AnimatePresence>
                {quiz2Error && (
                  <motion.p
                    className="text-red-400 text-xs text-center font-semibold"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    {quiz2Error}
                  </motion.p>
                )}
              </AnimatePresence>
                 <div className="flex flex-col gap-2">
      <motion.button
        onClick={() => setQuiz2HintVisible((v) => !v)}
        className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border-2 w-fit"
        style={{
          background: quiz2HintVisible ? "rgba(251,191,36,0.15)" : "transparent",
          borderColor: quiz2HintVisible ? "#fbbf24" : "rgba(251,191,36,0.4)",
          color: "#fbbf24",
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
      >
        💡 Hint
      </motion.button>

      <AnimatePresence>
        {quiz2HintVisible && (
          <motion.div
            className="rounded-xl px-4 py-3 text-sm text-amber-200 leading-relaxed"
            style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.3)" }}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
          >
            👀 Look at the numbers that appear as <strong>rows</strong> and <strong>columns</strong> in your arrangements.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
              <motion.button
                onClick={handleQuiz2Submit}
                className="px-6 py-2 rounded-xl font-bold text-white text-base shadow-lg w-full"
                style={{
                  background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ✅ Submit
              </motion.button>
              <p className="text-gray-500 text-xs text-center">
                {remainingQ2.length} pair(s) left
              </p>
              <AnimatePresence>
                {quiz2Done && (
                  <motion.div
                    className="text-center w-full"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring" }}
                  >
                    <p className="text-base font-bold text-yellow-400 mb-2">
                      🎉 All found!
                    </p>
                    <motion.button
                      onClick={() => setPhase("complete")}
                      className="px-5 py-2 rounded-full font-bold text-sm text-white shadow-xl w-full"
                      style={{
                        background: "linear-gradient(135deg, #f59e0b, #ef4444)",
                      }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Continue →
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Answered pairs */}
            <div
              className="flex-1 rounded-2xl p-4 border border-green-500/30 overflow-y-auto"
              style={{ background: "rgba(255,255,255,0.04)" }}
            >
              <p className="text-green-300 text-sm font-bold mb-3 uppercase tracking-widest">
                ✅ Answered
              </p>
              {quiz2AnsweredPairs.length === 0 && (
                <p className="text-gray-500 text-center text-sm mt-4">
                  None yet
                </p>
              )}
              <div className="flex flex-col gap-5">
                {quiz2AnsweredPairs.map(([rows, cols], i) => {
                  const item = completed.find(
                    (c) => c.rows === rows && c.cols === cols,
                  );
                  if (!item) return null;
                  return (
                    <motion.div
                      key={i}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring" }}
                    >
                      {renderGrid(
                        item,
                        rightPanelPx,
                        "rgba(34,197,94,0.25)",
                        "rgba(74,222,128,0.5)",
                        "#86efac",
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  // ─── Complete Screen ───────────────────────────────────────────────────────
  if (phase === "complete") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{
          background: "linear-gradient(135deg, #fef3c7, #fce7f3, #dbeafe)",
        }}
      >
        <motion.div
          className="text-center space-y-4"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="text-6xl">🎉🏆🎊</div>
          <h1
            className="text-4xl font-bold text-secondary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Level 1 Complete!
          </h1>
          <div className="bg-white/80 rounded-2xl p-6 shadow-lg max-w-md mx-auto space-y-3">
            <p
              className="text-2xl font-bold"
              style={{ color: primeNum ? "#16a34a" : "#ea580c" }}
            >
              {luckyNumber} is a{" "}
              {primeNum ? "Prime Number! 🌟" : "Composite Number! 🎯"}
            </p>
            {primeNum ? (
              <p className="text-muted-foreground">
                {luckyNumber} can only be divided by 1 and itself. No
                rectangular arrangement other than 1 × {luckyNumber} is
                possible!
              </p>
            ) : (
              <div>
                <p className="text-2xl font-semibold mb-2">
                  Arrangements found:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {completed.map((c, i) => (
                    <span
                      key={i}
                      className="inline-block bg-primary/10 text-2xl text-primary font-bold px-3 py-1 rounded-full"
                    >
                      {c.rows} × {c.cols}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <p className="text-muted-foreground text-2xl">
              ⏱️ Time: {formatTime(timer)}
            </p>
            <button
              onClick={onSpinAgain}
              className="px-10 py-4 rounded-full font-bold text-xl shadow-xl text-white hover:scale-105 transition-transform"
              style={{
                background: "#8F2424",
                fontFamily: "var(--font-display)",
              }}
            >
              Do you want to spin the wheel again?
            </button>
          </div>
          <button
            onClick={onComplete}
            className="px-10 py-4 rounded-full font-bold text-xl shadow-xl text-white hover:scale-105 transition-transform"
            style={{
              background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
              fontFamily: "var(--font-display)",
            }}
          >
            Continue to Level 2 →
          </button>
          <div className="flex justify-center">
            <video
              src={Level1CompleteVideo}
              autoPlay
              loop
              muted
              className="w-full max-w-xl rounded-xl shadow-lg"
            />
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Main Game ─────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen flex flex-col p-3"
      style={{
        background: "linear-gradient(135deg, #f0f4ff, #fdf2f8, #f0fdf4)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex flex-col gap-2">
          <span className="text-2xl font-bold bg-white px-4 py-2 rounded-full shadow-md text-center">
            ⏱️ {formatTime(timer)}
          </span>
          <button
            onClick={() => setShowHowToPlay(true)}
            className="px-3 py-1.5 text-white text-2xl bg-slate-500 font-bold rounded-full hover:scale-105 transition-transform"
          >
            📖 How to Play
          </button>
        </div>
        <h2
          className="text-2xl md:text-4xl font-bold text-secondary text-center"
          style={{ fontFamily: "var(--font-display)" }}
        >
          🔍 Level 1 — Prime Patrol and Combo Detectives
        </h2>
        <span className="text-lg font-bold bg-white px-4 py-2 rounded-full shadow-md">
          ✅ {completed.length}/{allPairs.length}
        </span>
      </div>

      {/* Lucky number + remaining clicks */}
      <div className="text-center mb-2 flex flex-wrap items-center justify-center gap-3">
        <span className="bg-white/80 px-4 py-1.5 rounded-full shadow text-2xl font-bold">
          Your number:{" "}
          <span
            className="text-2xl font-bold text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {luckyNumber}
          </span>
        </span>
        <span className="bg-white/80 px-4 py-1.5 rounded-full shadow text-2xl font-bold">
          Remaining clicks:{" "}
          <span className="text-2xl font-bold text-secondary">
            {luckyNumber - cells.size}
          </span>
        </span>
      </div>

      {/* Grid info hint */}
      {/* <div className="text-center text-base text-gray-500 mb-1">
        Grid:{" "}
        <span className="font-semibold">
          {gridRows} rows × {gridCols} cols
        </span>
        {gridCols > 18 && (
          <span className="ml-2 text-primary font-semibold">
            ← scroll horizontally to see full grid →
          </span>
        )}
      </div> */}

      <div className="flex justify-center text-center text-2xl font-bold py-2 text-golden">
        <h1>Select an icon</h1>
      </div>

      {/* Emoji selector */}
      <div className="flex justify-center gap-2 mb-3">
        {EMOJIS.map((e) => (
          <button
            key={e}
            onClick={() => setEmoji(e)}
            className={`text-2xl p-1.5 rounded-lg transition-all ${emoji === e ? "bg-primary/20 scale-110 ring-2 ring-primary" : "hover:bg-muted"}`}
          >
            {e}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex justify-center mb-3">
        <div
          style={{ maxWidth: "98vw", maxHeight: "62vh", overflow: "auto" }}
          className="rounded-2xl shadow-lg"
        >
          <div
            ref={gridRef}
            className="inline-grid p-2 bg-white/70"
            style={{
              gridTemplateColumns: `repeat(${gridCols}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${gridRows}, ${cellSize}px)`,
              gap: "2px",
              width: `${gridCols * cellSize + (gridCols - 1) * 2 + 16}px`,
              touchAction: "none",
            }}
            onPointerLeave={() => setIsDragging(false)}
            onPointerUp={() => setIsDragging(false)}
            onPointerMove={(e) => {
              if (!isDragging || phase !== "playing") return;
              const grid = gridRef.current;
              if (!grid) return;
              const rect = grid.getBoundingClientRect();
              const padding = 8;
              const gap = 2;
              const col = Math.floor(
                (e.clientX - rect.left - padding) / (cellSize + gap),
              );
              const row = Math.floor(
                (e.clientY - rect.top - padding) / (cellSize + gap),
              );
              if (row < 0 || row >= gridRows || col < 0 || col >= gridCols)
                return;
              const key = `${row},${col}`;
              setCells((prev) => {
                const next = new Set(prev);
                if (
                  dragMode === "add" &&
                  !next.has(key) &&
                  next.size < luckyNumber
                )
                  next.add(key);
                else if (dragMode === "remove" && next.has(key))
                  next.delete(key);
                return next;
              });
            }}
          >
            {Array.from({ length: gridRows * gridCols }, (_, idx) => {
              const r = Math.floor(idx / gridCols);
              const c = idx % gridCols;
              const key = `${r},${c}`;
              const isSelected = cells.has(key);
              const isHighlighted = highlightRect && isSelected;
              const isWrong = wrongCells.has(key);

              return (
                <div
                  key={key}
                  className={`rounded-md border-2 transition-colors flex items-center justify-center select-none cursor-pointer
                    ${
                      isSelected
                        ? isHighlighted
                          ? "border-yellow-400 bg-yellow-100 shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                          : isWrong
                            ? "border-red-500 bg-red-100"
                            : "border-primary bg-primary/10"
                        : "border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5"
                    }`}
                  style={{
                    width: `${cellSize}px`,
                    height: `${cellSize}px`,
                    fontSize: `${Math.max(10, cellSize * 0.52)}px`,
                    lineHeight: 1,
                  }}
                  onPointerDown={() => {
                    if (phase !== "playing") return;
                    setIsDragging(true);
                    if (isSelected) {
                      setDragMode("remove");
                      handleCellClick(r, c);
                    } else {
                      setDragMode("add");
                      handleCellClick(r, c);
                    }
                  }}
                >
                  {isSelected ? (isWrong ? "❌" : emoji) : ""}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-2">
        <button
          onClick={handleClear}
          className="px-6 py-2 rounded-full bg-destructive text-destructive-foreground font-bold shadow-md hover:scale-105 transition-transform"
        >
          🗑️ Clear All
        </button>
        {cells.size === luckyNumber && noRectMsg && (
          <motion.button
            onClick={handlePrimeGuess}
            className="px-6 py-2 rounded-full bg-amber-500 text-white font-bold shadow-md hover:scale-105 transition-transform"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            🤔 It's Prime!
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {noRectMsg && (
          <motion.p
            className="text-center text-sm font-semibold text-amber-600 mb-2 px-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {noRectMsg}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ===== MODALS ===== */}

      {/* How to Play */}
      <AnimatePresence>
        {(phase === "howtoplay" || showHowToPlay) && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <motion.div
              className="relative bg-[#FBF5EF] rounded-3xl shadow-2xl p-6 max-w-[600px] w-full max-h-[90vh] overflow-y-auto hide-scrollbar"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <h2 className="text-3xl font-bold text-center mb-4 text-[#8F2424]">
                📖 How to Play — Level 1
              </h2>
              <ul className="space-y-3 text-gray-700 text-2xl leading-relaxed">
                <li className="flex gap-2">
                  <span>🎰</span> Arrange the same number of icons on the grid.
                </li>
                <li className="flex gap-2">
                  <span>🎨</span> Try to organise the icons into rectangular
                  arrays with equal rows and columns.
                </li>
                <li className="flex gap-2">
                  <span>📐</span> Explore different possible arrangements on the
                  grid.
                </li>
                <li className="flex gap-2">
                  <span>🔄</span> If icons can form one or more rectangles, the
                  number is composite.
                </li>
                <li className="flex gap-2">
                  <span>🤔</span> If no rectangle is possible (other than 1×N),
                  the number is prime.
                </li>
              </ul>
              <div className="mt-5 text-center">
                <button
                  onClick={() => {
                    if (phase === "howtoplay") setPhase("timerStart");
                    setShowHowToPlay(false);
                  }}
                  className="bg-[#8F2424] text-white text-xl font-bold px-6 py-2 rounded-full shadow-md hover:scale-105 transition"
                >
                  Let's Play! 🎉
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer Start */}
      <AnimatePresence>
        {phase === "timerStart" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <motion.div
              className="relative bg-[#FBF5EF] rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="text-6xl mb-4">⏱️</div>
              <h3
                className="text-2xl font-bold text-[#8F2424] mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Ready to Start?
              </h3>
              <p className="text-gray-600 mb-6 text-xl">
                Timer will begin as soon as you click the button below!
              </p>
              <button
                onClick={handleStartTimer}
                className="px-8 py-3 rounded-full text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform"
                style={{
                  background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
                  fontFamily: "var(--font-display)",
                }}
              >
                ▶️ Start Timer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Congrats Modal */}
      <AnimatePresence>
        {phase === "congrats" && currentRect && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className="relative rounded-2xl p-8 border-2 text-center max-w-md w-full"
              style={{
                background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                borderColor: "#FFD700",
                boxShadow: "0 0 40px rgba(255,215,0,0.3)",
              }}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="text-5xl mb-3">🎉</div>
              <h3
                className="text-2xl font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Congratulations!
              </h3>
              <p className="text-lg text-gray-200 mb-4">
                You made an array of{" "}
                <span className="text-yellow-400 font-bold text-2xl">
                  {currentRect[0]} row and {currentRect[1]} columns.
                </span>{" "}
              </p>
              <p className="text-white text-lg mb-4">
                Are more arrangements possible?
              </p>
              {congratsError && (
                <p className="text-amber-400 text-sm mb-3 animate-pulse">
                  {congratsError}
                </p>
              )}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleMoreYes}
                  className="px-8 py-3 rounded-full font-bold text-lg text-white shadow-lg hover:scale-105 transition-transform"
                  style={{
                    background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
                  }}
                >
                  ✅ Yes!
                </button>
                <button
                  onClick={handleMoreNo}
                  className="px-8 py-3 rounded-full font-bold text-lg text-white shadow-lg hover:scale-105 transition-transform"
                  style={{
                    background: "linear-gradient(135deg, #ef4444, #f97316)",
                  }}
                >
                  ❌ No
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prime Congrats Modal */}
      <AnimatePresence>
        {phase === "primeCongrats" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className="relative rounded-2xl p-8 border-2 text-center max-w-md w-full"
              style={{
                background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                borderColor: "#FFD700",
                boxShadow: "0 0 40px rgba(255,215,0,0.3)",
              }}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="text-5xl mb-3">🌟🎉🌟</div>
              <h3
                className="text-2xl font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Congratulations!
              </h3>
              <p className="text-lg text-gray-200 mb-2">
                You correctly identified that
              </p>
              <p
                className="text-3xl font-bold text-yellow-400 mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {luckyNumber} is a Prime Number!
              </p>
              <p className="text-gray-300 mb-6">
                It can only be divided by 1 and {luckyNumber}. No rectangular
                arrangement other than 1 × {luckyNumber} is possible! 🧠
              </p>
              <button
                onClick={() => {
                  // Prime number — skip quiz2, go directly to complete
                  setPhase("quiz1");
                  setQuiz1Answer(null);
                  setQuiz1Wrong(false);
                }}
                className="px-8 py-3 rounded-full font-bold text-lg text-white shadow-lg hover:scale-105 transition-transform"
                style={{
                  background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
                }}
              >
                Continue →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Pair Modal */}
      <AnimatePresence>
        {phase === "inputPair" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className="relative rounded-2xl p-8 border-2 text-center max-w-md w-full"
              style={{
                background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                borderColor: "#FFD700",
              }}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <button
                onClick={() => setPhase("congrats")}
                className="absolute top-3 right-4 text-xl font-bold text-white hover:text-red-400 transition"
              >
                ✖
              </button>
              <h3
                className="text-2xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                What is the next possible arrangement?
              </h3>

              <div className="flex items-center justify-center gap-3 mb-4">
                <input
                  type="number"
                  value={inputR}
                  onChange={(e) => setInputR(e.target.value)}
                  placeholder="No of rows: "
                  className="w-52 px-3 py-2 rounded-lg text-center text-lg font-bold bg-white/10 text-white border border-white/30 focus:border-yellow-400 focus:outline-none"
                />
                {/* <span className="text-2xl text-yellow-400 font-bold">×</span> */}
                <input
                  type="number"
                  value={inputC}
                  onChange={(e) => setInputC(e.target.value)}
                  placeholder="No of columns:"
                  className="w-52 px-3 py-2 rounded-lg text-center text-lg font-bold bg-white/10 text-white border border-white/30 focus:border-yellow-400 focus:outline-none"
                />
              </div>
              {inputError && (
                <p className="text-amber-400 text-sm mb-3 animate-pulse">
                  {inputError}
                </p>
              )}
              <button
                onClick={handleSubmitPair}
                className="px-8 py-3 rounded-full font-bold text-lg text-white shadow-lg hover:scale-105 transition-transform"
                style={{
                  background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
                }}
              >
                ✅ Submit
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// import React, {
//   useState,
//   useEffect,
//   useCallback,
//   useMemo,
//   useRef,
// } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useSound } from "@/contexts/SoundContext";
// import TimerSound from "@/assets/TimerSound.mpeg";
// import howtoplaySound from "@/assets/howToPlaySound.mpeg";
// import correctSound from "@/assets/correctDargSound.mpeg";
// import incorrectSound from "@/assets/inCorrectDragSound.mpeg";
// import generalSound from "@/assets/general-sound.mpeg";
// import Level1CompleteVideo from "../../assets/game2level1complete.mp4";

// interface PrimeLevel1Props {
//   luckyNumber: number;
//   onComplete: () => void;
//   onSpinAgain: () => void;
// }

// const EMOJIS = ["⭐", "💎", "🎯", "🌈"];
// const MAX_DIM = 99;

// function getFactorPairs(n: number): [number, number][] {
//   const pairs: [number, number][] = [];
//   for (let i = 1; i <= Math.sqrt(n); i++) {
//     if (n % i === 0) {
//       const j = n / i;
//       if (i <= MAX_DIM && j <= MAX_DIM) pairs.push([i, j]);
//     }
//   }
//   return pairs;
// }

// function isPrime(n: number): boolean {
//   if (n < 2) return false;
//   for (let i = 2; i <= Math.sqrt(n); i++) {
//     if (n % i === 0) return false;
//   }
//   return true;
// }

// function detectRectangle(cells: Set<string>): [number, number] | null {
//   if (cells.size === 0) return null;
//   const positions = Array.from(cells).map((k) => {
//     const [r, c] = k.split(",").map(Number);
//     return [r, c] as [number, number];
//   });
//   const rows = positions.map((p) => p[0]);
//   const cols = positions.map((p) => p[1]);
//   const minR = Math.min(...rows),
//     maxR = Math.max(...rows);
//   const minC = Math.min(...cols),
//     maxC = Math.max(...cols);
//   const h = maxR - minR + 1,
//     w = maxC - minC + 1;
//   if (h * w !== cells.size) return null;
//   for (let r = minR; r <= maxR; r++)
//     for (let c = minC; c <= maxC; c++) if (!cells.has(`${r},${c}`)) return null;
//   return [h, w];
// }

// type Phase =
//   | "howtoplay"
//   | "timerStart"
//   | "countdown"
//   | "playing"
//   | "rectFound"
//   | "congrats"
//   | "inputPair"
//   | "primeCongrats"
//   | "complete"
//   | "quiz1"
//   | "quiz2";

// export default function PrimeLevel1({
//   luckyNumber,
//   onComplete,
//   onSpinAgain,
// }: PrimeLevel1Props) {
//   const { playSound, isSoundEnabled } = useSound();

//   const [phase, setPhase] = useState<Phase>("howtoplay");
//   const [emoji, setEmoji] = useState("⭐");
//   const [cells, setCells] = useState<Set<string>>(new Set());
//   const [completed, setCompleted] = useState<
//     {
//       rows: number;
//       cols: number;
//       snapshot: Set<string>;
//       gRows: number;
//       gCols: number;
//     }[]
//   >([]);
//   const [currentRect, setCurrentRect] = useState<[number, number] | null>(null);
//   const [timer, setTimer] = useState(0);
//   const [countdown, setCountdown] = useState(3);
//   const [showHowToPlay, setShowHowToPlay] = useState(false);
//   const [inputR, setInputR] = useState("");
//   const [inputC, setInputC] = useState("");
//   const [inputError, setInputError] = useState("");
//   const [noRectMsg, setNoRectMsg] = useState("");
//   const [highlightRect, setHighlightRect] = useState(false);
//   const [congratsError, setCongratsError] = useState("");
//   const [wrongCells, setWrongCells] = useState<Set<string>>(new Set());
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragMode, setDragMode] = useState<"add" | "remove">("add");

//   // ── Quiz state ──────────────────────────────────────────────────────────────
//   const [quiz1Answer, setQuiz1Answer] = useState<"yes" | "no" | null>(null);
//   const [quiz1Wrong, setQuiz1Wrong] = useState(false);
//   const [quiz2InputR, setQuiz2InputR] = useState("");
//   const [quiz2InputC, setQuiz2InputC] = useState("");
//   const [quiz2Error, setQuiz2Error] = useState("");
//   const [quiz2AnsweredPairs, setQuiz2AnsweredPairs] = useState<
//     [number, number][]
//   >([]);
//   const [quiz2Done, setQuiz2Done] = useState(false);
//   const [quiz2FactorsInput, setQuiz2FactorsInput] = useState("");
//   const [quiz2HintVisible, setQuiz2HintVisible] = useState(false);
//   const [showEmptyGrid, setShowEmptyGrid] = useState(false);

//   const completedRef = useRef(completed);
//   const gridRef = useRef<HTMLDivElement>(null);
//   completedRef.current = completed;

//   const primeNum = useMemo(() => isPrime(luckyNumber), [luckyNumber]);
//   const allPairs = useMemo(() => getFactorPairs(luckyNumber), [luckyNumber]);

//   const { gridRows, gridCols } = useMemo(() => {
//     if (allPairs.length === 0) {
//       const sq = Math.ceil(Math.sqrt(luckyNumber)) + 2;
//       return { gridRows: Math.min(sq, 12), gridCols: Math.min(sq, 12) };
//     }
//     const maxA = Math.max(...allPairs.map(([a]) => a));
//     const maxB = Math.max(...allPairs.map(([, b]) => b));
//     return {
//       gridRows: Math.min(maxA + 2, 20),
//       gridCols: Math.min(maxB + 2, 72),
//     };
//   }, [allPairs, luckyNumber]);

//   const cellSize = useMemo(() => {
//     const screenW = Math.min(window.innerWidth * 0.94, 680);
//     return Math.max(Math.floor(screenW / Math.min(gridCols, 18)), 34);
//   }, [gridCols]);

//   const remaining = useMemo(
//     () =>
//       allPairs.filter(
//         ([a, b]) => !completed.some((c) => c.rows === a && c.cols === b),
//       ),
//     [allPairs, completed],
//   );

//   // Timer
//   useEffect(() => {
//     if (phase !== "playing" && phase !== "rectFound") return;
//     const iv = setInterval(() => setTimer((t) => t + 1), 1000);
//     return () => clearInterval(iv);
//   }, [phase]);

//   // Countdown
//   useEffect(() => {
//     if (phase !== "countdown") return;
//     if (countdown < 0) {
//       setPhase("playing");
//       return;
//     }
//     const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
//     return () => clearTimeout(t);
//   }, [phase, countdown]);

//   const handleStartTimer = () => setPhase("countdown");

//   useEffect(() => {
//     if (phase !== "playing" || !isSoundEnabled) return;
//     const audio = new Audio(TimerSound);
//     audio.loop = true;
//     audio.volume = 0.3;
//     audio.play().catch(() => {});
//     return () => {
//       audio.pause();
//       audio.currentTime = 0;
//     };
//   }, [phase, isSoundEnabled]);

//   useEffect(() => {
//     if (phase === "howtoplay" || showHowToPlay) playSound(howtoplaySound);
//   }, [phase, showHowToPlay]);

//   useEffect(() => {
//     if (phase !== "complete" || !isSoundEnabled) return;
//     const audio = new Audio(generalSound);
//     audio.play().catch(() => {});
//     return () => {
//       audio.pause();
//       audio.currentTime = 0;
//     };
//   }, [phase, isSoundEnabled]);

//   useEffect(() => {
//     if (phase !== "playing") return;
//     if (cells.size < luckyNumber) {
//       setNoRectMsg("");
//       setWrongCells(new Set());
//       return;
//     }
//     if (cells.size !== luckyNumber) return;

//     const rect = detectRectangle(cells);
//     if (rect) {
//       const norm: [number, number] =
//         rect[0] <= rect[1] ? [rect[0], rect[1]] : [rect[1], rect[0]];
//       const alreadyDone = completedRef.current.some(
//         (c) => c.rows === norm[0] && c.cols === norm[1],
//       );
//       if (alreadyDone) {
//         setNoRectMsg(
//           `You already found ${norm[0]} × ${norm[1]}! Try a different arrangement! 😊`,
//         );
//         return;
//       }
//       setCurrentRect(norm);
//       setHighlightRect(true);
//       setPhase("rectFound");
//       setNoRectMsg("");
//       playSound(correctSound);
//       const cellsSnapshot = new Set(cells);
//       setTimeout(() => {
//         setCompleted((prev) => [
//           ...prev,
//           {
//             rows: norm[0],
//             cols: norm[1],
//             snapshot: cellsSnapshot,
//             gRows: gridRows,
//             gCols: gridCols,
//           },
//         ]);
//         setHighlightRect(false);
//         setPhase("congrats");
//         setCongratsError("");
//       }, 2000);
//     } else {
//       setWrongCells(new Set(cells));
//       setNoRectMsg("");
//       setTimeout(() => {
//         setWrongCells(new Set());
//         if (primeNum) {
//           playSound(correctSound);
//           setPhase("primeCongrats");
//         } else {
//           playSound(incorrectSound);
//           setNoRectMsg(
//             "Not a perfect rectangle! Try a different arrangement! 🤔",
//           );
//           setCells(new Set());
//         }
//       }, 1500);
//     }
//   }, [cells.size, phase]);

//   const handleCellClick = useCallback(
//     (r: number, c: number) => {
//       if (phase !== "playing") return;
//       const key = `${r},${c}`;
//       setCells((prev) => {
//         const next = new Set(prev);
//         if (next.has(key)) next.delete(key);
//         else if (next.size < luckyNumber) next.add(key);
//         return next;
//       });
//     },
//     [phase, luckyNumber],
//   );

//   const handleClear = () => {
//     setCells(new Set());
//     setWrongCells(new Set());
//     setNoRectMsg("");
//   };

//   const handlePrimeGuess = () => {
//     if (primeNum) {
//       playSound(correctSound);
//       setPhase("primeCongrats");
//     } else {
//       playSound(incorrectSound);
//       setNoRectMsg(
//         `Not prime! ${luckyNumber} is composite. Try to form a rectangle! 💪`,
//       );
//       setCells(new Set());
//     }
//   };

//   const handleMoreYes = () => {
//     setPhase("inputPair");
//     setInputR("");
//     setInputC("");
//     setInputError("");
//   };

//   const handleMoreNo = () => {
//     const currentRemaining = allPairs.filter(
//       ([a, b]) =>
//         !completedRef.current.some((c) => c.rows === a && c.cols === b),
//     );
//     if (currentRemaining.length > 0) {
//       setCongratsError(
//         `Oops! There are still ${currentRemaining.length} more arrangement(s) possible! Think again! 🤔`,
//       );
//     } else {
//       // Instead of going directly to "complete", go to quiz1
//       setPhase("quiz1");
//       setQuiz1Answer(null);
//       setQuiz1Wrong(false);
//     }
//   };

//   const handleSubmitPair = () => {
//     const r = parseInt(inputR),
//       c = parseInt(inputC);
//     if (isNaN(r) || isNaN(c) || r <= 0 || c <= 0) {
//       setInputError("Please enter valid numbers!");
//       return;
//     }
//     if (r * c !== luckyNumber) {
//       setInputError(
//         `${r} × ${c} = ${r * c}, but we need ${luckyNumber}! Try again! 🤔`,
//       );
//       return;
//     }
//     const norm: [number, number] = r <= c ? [r, c] : [c, r];
//     if (completed.some((c) => c.rows === norm[0] && c.cols === norm[1])) {
//       setInputError(`Already found ${norm[0]} × ${norm[1]}! Try another!`);
//       return;
//     }
//     if (r > MAX_DIM || c > MAX_DIM) {
//       setInputError(`Too big! Both numbers must be ≤ ${MAX_DIM}`);
//       return;
//     }
//     setCells(new Set());
//     setNoRectMsg("");
//     setPhase("playing");
//   };

//   // ── Quiz 2: Write all factors ──────────────────────────────────────────────
//   const handleQuiz2Submit = () => {
//     const entered = quiz2FactorsInput
//       .split(/[\s,،]+/)
//       .map((s) => parseInt(s.trim()))
//       .filter((n) => !isNaN(n) && n > 0);

//     if (entered.length === 0) {
//       setQuiz2Error("Please enter the factors separated by commas!");
//       return;
//     }

//     const correctFactors: number[] = [];
//     for (let i = 1; i <= luckyNumber; i++) {
//       if (luckyNumber % i === 0) correctFactors.push(i);
//     }

//     const enteredUnique = [...new Set(entered)].sort((a, b) => a - b);
//     const correctSorted = [...correctFactors].sort((a, b) => a - b);

//     const wrong = enteredUnique.filter((n) => luckyNumber % n !== 0);
//     if (wrong.length > 0) {
//       setQuiz2Error(
//         `${wrong.join(", ")} ${wrong.length === 1 ? "is" : "are"} not a factor of ${luckyNumber}! Try again.`,
//       );
//       playSound(incorrectSound);
//       return;
//     }

//     const missing = correctSorted.filter((f) => !enteredUnique.includes(f));
//     if (missing.length > 0) {
//       setQuiz2Error(
//         `You're missing some factors! Check your arrangements again.`,
//       );
//       playSound(incorrectSound);
//       return;
//     }

//     playSound(correctSound);
//     setQuiz2Error("");
//     setQuiz2Done(true);
//   };

//   useEffect(() => {
//     const handleKey = (e: KeyboardEvent) => {
//       if (e.shiftKey && e.key === "L") setPhase("complete");
//     };
//     window.addEventListener("keydown", handleKey);
//     return () => window.removeEventListener("keydown", handleKey);
//   }, []);

//   const formatTime = (s: number) =>
//     s < 60
//       ? `${s}s`
//       : `${Math.floor(s / 60)}m ${(s % 60).toString().padStart(2, "0")}s`;

//   // ─── Quiz 1 Screen ─────────────────────────────────────────────────────────
//   if (phase === "quiz1") {
//     // Use last completed arrangement, fallback to first allPair
//     const lastArr =
//       completed.length > 0
//         ? completed[completed.length - 1]
//         : {
//             rows: allPairs[0]?.[0] ?? 1,
//             cols: allPairs[0]?.[1] ?? luckyNumber,
//           };
//     const R = lastArr.rows;
//     const C = lastArr.cols;

//     // Correct answer label: "R rows and C columns"
//     const correctLabel = `${R} rows and ${C} columns`;

//     // Generate 4 MCQ options — always include correct + 3 distractors
//     // Distractors: swapped (C rows R cols), (luckyNumber rows 1 col), (1 row luckyNumber cols)
//     // Deduplicate and shuffle
//     const rawOptions: string[] = [
//       correctLabel,
//       `${C} rows and ${R} columns`,
//       `${luckyNumber} rows and 1 column`,
//       `1 row and ${luckyNumber} columns`,
//     ];
//     // Remove duplicates (e.g. if R=1, C=luckyNumber)
//     const seen = new Set<string>();
//     const uniqueOptions: string[] = [];
//     for (const o of rawOptions) {
//       if (!seen.has(o)) {
//         seen.add(o);
//         uniqueOptions.push(o);
//       }
//     }
//     // Pad if less than 4 (edge case)
//     while (uniqueOptions.length < 4)
//       uniqueOptions.push(`${uniqueOptions.length} rows and ? columns`);

//     // Shuffle with seeded-ish order based on luckyNumber
//     const shuffled = [...uniqueOptions].sort((a, b) => {
//       const seed = luckyNumber % 3;
//       return a.charCodeAt(seed % a.length) - b.charCodeAt(seed % b.length);
//     });

//     const optionLetters = ["A", "B", "C", "D"];

//     const handleMCQ = (chosen: string) => {
//       if (chosen === correctLabel) {
//         playSound(correctSound);
//         setQuiz1Wrong(false);
//         setTimeout(() => {
//           setPhase("quiz2");
//           setQuiz2InputR("");
//           setQuiz2InputC("");
//           setQuiz2Error("");
//           setQuiz2AnsweredPairs([]);
//           setQuiz2Done(false);
//         }, 1200);
//       } else {
//         playSound(incorrectSound);
//         setQuiz1Wrong(true);
//       }
//     };

//     return (
//       <div
//         className="min-h-screen flex flex-col items-center justify-center p-6"
//         style={{
//           background: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
//         }}
//       >
//         <motion.div
//           className="w-full max-w-2xl"
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ type: "spring", stiffness: 180 }}
//         >
//           <div
//             className="rounded-3xl p-8 shadow-2xl border-2"
//             style={{
//               background: "linear-gradient(135deg, #1e293b, #0f172a)",
//               borderColor: "#FFD700",
//               boxShadow: "0 0 60px rgba(255,215,0,0.2)",
//             }}
//           >
//             <div className="text-5xl mb-3 text-center">🤔</div>
//             <p className="text-yellow-300 text-base font-bold tracking-widest uppercase text-center mb-4">
//               Question 1
//             </p>

//             {/* Question text */}
//             <p className="text-white text-xl md:text-2xl font-semibold text-center mb-6 leading-relaxed">
//               You have arranged{" "}
//               <span className="text-yellow-400 font-bold">{luckyNumber}</span>{" "}
//               counters in a rectangular arrangement with{" "}
//               <span className="text-yellow-400 font-bold">{R}</span> horizontal
//               line{R !== 1 ? "s" : ""} and{" "}
//               <span className="text-yellow-400 font-bold">{C}</span> counter
//               {C !== 1 ? "s" : ""} in each line.
//               <br />
//               <span className="text-gray-300 text-lg">
//                 Which combination correctly describes your array?
//               </span>
//             </p>

//             {/* MCQ Options */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
//               {shuffled.map((option, i) => (
//                 <motion.button
//                   key={option}
//                   onClick={() => handleMCQ(option)}
//                   className="flex items-center gap-3 px-5 py-4 rounded-2xl text-left font-semibold text-lg border-2 transition-all"
//                   style={{
//                     background: "rgba(255,255,255,0.06)",
//                     borderColor: "rgba(255,255,255,0.15)",
//                     color: "#fff",
//                   }}
//                   whileHover={{
//                     scale: 1.03,
//                     borderColor: "#FFD700",
//                     background: "rgba(255,215,0,0.1)",
//                   }}
//                   whileTap={{ scale: 0.97 }}
//                 >
//                   <span
//                     className="text-base font-bold rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0"
//                     style={{
//                       background: "rgba(255,215,0,0.2)",
//                       color: "#FFD700",
//                     }}
//                   >
//                     {optionLetters[i]}
//                   </span>
//                   {option}
//                 </motion.button>
//               ))}
//             </div>

//             {/* Wrong answer feedback */}
//             <AnimatePresence>
//               {quiz1Wrong && (
//                 <motion.p
//                   className="text-red-400 font-bold text-center text-lg mt-2"
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0 }}
//                 >
//                   ❌ Oops! That's not right. Try again! 🤔
//                 </motion.p>
//               )}
//             </AnimatePresence>
//           </div>
//         </motion.div>
//       </div>
//     );
//   }

//   // ─── Quiz 2 Screen — FULL PAGE (no modal) ─────────────────────────────────
//   if (phase === "quiz2") {
//     const remainingQ2 = allPairs.filter(
//       ([a, b]) => !quiz2AnsweredPairs.some(([qa, qb]) => qa === a && qb === b),
//     );

//     // Left panel = 70vw, cell size based on that
//     const leftPanelPx = Math.floor(window.innerWidth * 0.7) - 64;
//     const rightPanelPx = Math.floor(window.innerWidth * 0.28) - 32;

//     // Helper to render a grid with snapshot
//     const renderGrid = (
//       item: {
//         rows: number;
//         cols: number;
//         snapshot: Set<string>;
//         gRows: number;
//         gCols: number;
//       },
//       panelW: number,
//       fillColor: string,
//       fillBorder: string,
//       labelColor: string,
//     ) => {
//       const { rows, cols, snapshot, gRows, gCols } = item;
//       const cs = showEmptyGrid
//         ? Math.max(28, Math.min(52, Math.floor(panelW / gCols)))
//         : Math.max(28, Math.min(52, Math.floor(panelW / cols)));
//       const displayGRows = showEmptyGrid ? gRows : rows;
//       const displayGCols = showEmptyGrid ? gCols : cols;

//       return (
//         <div
//           key={`${rows}-${cols}`}
//           className="flex flex-col items-start gap-2 w-full"
//         >
//           <p style={{ color: labelColor }} className="font-bold text-base pl-1">
//             {rows} × {cols}
//           </p>
//           {/* Horizontally scrollable wrapper */}
//           <div
//             style={{
//               overflowX: "auto",
//               overflowY: "hidden",
//               width: "100%",
//               paddingBottom: "4px",
//             }}
//           >
//             <div
//               style={{
//                 display: "inline-grid",
//                 gridTemplateColumns: `repeat(${displayGCols}, ${cs}px)`,
//                 gridTemplateRows: `repeat(${displayGRows}, ${cs}px)`,
//                 gap: "3px",
//               }}
//             >
//               {Array.from({ length: displayGRows * displayGCols }).map(
//                 (_, idx) => {
//                   const r = Math.floor(idx / displayGCols);
//                   const c = idx % displayGCols;
//                   const key = `${r},${c}`;
//                   const isFilled = showEmptyGrid ? snapshot.has(key) : true;
//                   return (
//                     <div
//                       key={idx}
//                       style={{
//                         width: cs,
//                         height: cs,
//                         fontSize: cs * 0.72,
//                         lineHeight: 1,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         background: isFilled ? fillColor : "#ffffff",
//                         borderRadius: 6,
//                         border: isFilled
//                           ? `1.5px solid ${fillBorder}`
//                           : "1.5px solid #d1d5db",
//                         flexShrink: 0,
//                       }}
//                     >
//                       {isFilled ? emoji : ""}
//                     </div>
//                   );
//                 },
//               )}
//             </div>
//           </div>
//         </div>
//       );
//     };

//     return (
//       <motion.div
//         className="min-h-screen flex flex-col"
//         style={{
//           background: "linear-gradient(135deg, #0f172a, #1e1b4b, #0c1a3a)",
//         }}
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 0.4 }}
//       >
//         {/* ── Top Header ── */}
//         <div className="text-center pt-5 pb-3 px-6">
//           <p className="text-yellow-300 text-sm font-bold tracking-[0.2em] uppercase mb-1">
//             Question 2
//           </p>
//           <h1
//             className="text-2xl md:text-3xl font-bold text-white leading-snug"
//             style={{ fontFamily: "var(--font-display)" }}
//           >
//             You have arranged{" "}
//             <span className="text-yellow-400">{luckyNumber}</span> counters into
//             rectangular arrangements.
//             <br />
//             <span className="text-gray-300 text-xl font-normal">
//               In each arrangement, the number of rows and the number of columns
//               are factors of{" "}
//               <span className="text-yellow-400 font-bold">{luckyNumber}</span>.
//             </span>
//           </h1>
//           <p className="text-gray-300 text-lg mt-2">
//             Using the rectangular arrangements you made, write all the factors
//             of <span className="text-yellow-400 font-bold">{luckyNumber}</span>.
//           </p>

//           {/* Toggle */}
//           <div className="flex items-center justify-center gap-4 mt-3">
//             <button
//               onClick={() => setShowEmptyGrid((v) => !v)}
//               className="px-4 py-1.5 rounded-full font-bold text-sm border-2 transition-all"
//               style={{
//                 background: showEmptyGrid
//                   ? "rgba(255,255,255,0.15)"
//                   : "transparent",
//                 borderColor: showEmptyGrid ? "#fff" : "rgba(255,255,255,0.3)",
//                 color: showEmptyGrid ? "#fff" : "rgba(255,255,255,0.5)",
//               }}
//             >
//               {showEmptyGrid ? "⬜ Show Only Filled" : "⬜ Show Full Grid"}
//             </button>
//           </div>
//         </div>

//         {/* ── 70 / 30 split ── */}
//         <div
//           className="flex flex-1 gap-3 px-3 pb-4 min-h-0"
//           style={{ overflow: "hidden" }}
//         >
//           {/* LEFT 70% — Your Arrangements */}
//           <div
//             className="rounded-2xl p-5 border border-indigo-500/30 overflow-y-auto"
//             style={{ width: "70%", background: "rgba(255,255,255,0.04)" }}
//           >
//             <p className="text-indigo-300 text-sm font-bold mb-4 uppercase tracking-widest">
//               🎮 Your Arrangements
//             </p>
//             {completed.length === 0 && (
//               <p className="text-gray-500 text-center text-sm mt-8">
//                 None recorded
//               </p>
//             )}
//             <div className="flex flex-col gap-8">
//               {completed.map((item) =>
//                 renderGrid(
//                   item,
//                   leftPanelPx,
//                   "rgba(99,102,241,0.30)",
//                   "rgba(139,92,246,0.55)",
//                   "#fde047",
//                 ),
//               )}
//             </div>
//           </div>

//           {/* RIGHT 30% */}
//           <div className="flex flex-col gap-3" style={{ width: "30%" }}>
//             {/* Input box */}
//             <div
//               className="rounded-2xl px-5 py-6 border border-yellow-500/30 flex flex-col gap-4"
//               style={{ background: "rgba(255,215,0,0.06)" }}
//             >
//               <p className="text-white font-bold text-lg leading-snug">
//                 Enter the factors of{" "}
//                 <span className="text-yellow-400">{luckyNumber}</span>:
//               </p>

//               {/* Single text input */}
//               <input
//                 type="text"
//                 value={quiz2FactorsInput}
//                 onChange={(e) => {
//                   setQuiz2FactorsInput(e.target.value);
//                   setQuiz2Error("");
//                 }}
//                 onKeyDown={(e) => e.key === "Enter" && handleQuiz2Submit()}
//                 placeholder="e.g. 1, 3, 17, 51"
//                 className="w-full px-4 py-3 rounded-xl text-lg font-bold bg-white/10 text-white border-2 border-white/20 focus:border-yellow-400 focus:outline-none placeholder:text-gray-500"
//               />

//               <AnimatePresence>
//                 {quiz2Error && (
//                   <motion.p
//                     className="text-red-400 text-sm font-semibold"
//                     initial={{ opacity: 0, y: -4 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     exit={{ opacity: 0 }}
//                   >
//                     ❌ {quiz2Error}
//                   </motion.p>
//                 )}
//               </AnimatePresence>

//               {/* Hint button */}
//               <div className="flex flex-col gap-2">
//                 <motion.button
//                   onClick={() => setQuiz2HintVisible((v) => !v)}
//                   className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm border-2 w-fit transition-all"
//                   style={{
//                     background: quiz2HintVisible
//                       ? "rgba(251,191,36,0.15)"
//                       : "transparent",
//                     borderColor: quiz2HintVisible
//                       ? "#fbbf24"
//                       : "rgba(251,191,36,0.4)",
//                     color: "#fbbf24",
//                   }}
//                   whileHover={{ scale: 1.04 }}
//                   whileTap={{ scale: 0.96 }}
//                 >
//                   💡 Hint
//                 </motion.button>

//                 <AnimatePresence>
//                   {quiz2HintVisible && (
//                     <motion.div
//                       className="rounded-xl px-4 py-3 text-sm text-amber-200 leading-relaxed"
//                       style={{
//                         background: "rgba(251,191,36,0.1)",
//                         border: "1px solid rgba(251,191,36,0.3)",
//                       }}
//                       initial={{ opacity: 0, height: 0 }}
//                       animate={{ opacity: 1, height: "auto" }}
//                       exit={{ opacity: 0, height: 0 }}
//                       transition={{ duration: 0.25 }}
//                     >
//                       👀 Look at the numbers that appear as{" "}
//                       <strong>rows</strong> and <strong>columns</strong> in your
//                       arrangements.
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </div>

//               <motion.button
//                 onClick={handleQuiz2Submit}
//                 className="px-6 py-3 rounded-xl font-bold text-white text-base shadow-lg w-full"
//                 style={{
//                   background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
//                 }}
//                 whileHover={{ scale: 1.05 }}
//                 whileTap={{ scale: 0.95 }}
//               >
//                 ✅ Submit
//               </motion.button>

//               <AnimatePresence>
//                 {quiz2Done && (
//                   <motion.div
//                     className="text-center"
//                     initial={{ opacity: 0, scale: 0.8 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     transition={{ type: "spring" }}
//                   >
//                     <p className="text-base font-bold text-yellow-400 mb-3">
//                       🎉 Correct! All factors found!
//                     </p>
//                     <motion.button
//                       onClick={() => setPhase("complete")}
//                       className="px-5 py-2 rounded-full font-bold text-sm text-white shadow-xl w-full"
//                       style={{
//                         background: "linear-gradient(135deg, #f59e0b, #ef4444)",
//                       }}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       Continue →
//                     </motion.button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>

//             {/* Answered factors display */}
//             {quiz2Done && (
//               <motion.div
//                 className="rounded-2xl p-4 border border-green-500/30"
//                 style={{ background: "rgba(255,255,255,0.04)" }}
//                 initial={{ opacity: 0, y: 10 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ type: "spring" }}
//               >
//                 <p className="text-green-300 text-sm font-bold mb-3 uppercase tracking-widest">
//                   ✅ Factors of {luckyNumber}
//                 </p>
//                 <div className="flex flex-wrap gap-2">
//                   {(() => {
//                     const factors: number[] = [];
//                     for (let i = 1; i <= luckyNumber; i++) {
//                       if (luckyNumber % i === 0) factors.push(i);
//                     }
//                     return factors.map((f) => (
//                       <motion.span
//                         key={f}
//                         className="px-3 py-1 rounded-full font-bold text-sm"
//                         style={{
//                           background: "rgba(34,197,94,0.25)",
//                           color: "#86efac",
//                           border: "1px solid rgba(74,222,128,0.4)",
//                         }}
//                         initial={{ scale: 0 }}
//                         animate={{ scale: 1 }}
//                         transition={{
//                           type: "spring",
//                           delay: 0.05 * factors.indexOf(f),
//                         }}
//                       >
//                         {f}
//                       </motion.span>
//                     ));
//                   })()}
//                 </div>
//               </motion.div>
//             )}
//           </div>
//         </div>
//       </motion.div>
//     );
//   }

//   // ─── Complete Screen ───────────────────────────────────────────────────────
//   if (phase === "complete") {
//     return (
//       <div
//         className="min-h-screen flex flex-col items-center justify-center p-6"
//         style={{
//           background: "linear-gradient(135deg, #fef3c7, #fce7f3, #dbeafe)",
//         }}
//       >
//         <motion.div
//           className="text-center space-y-4"
//           initial={{ scale: 0.5, opacity: 0 }}
//           animate={{ scale: 1, opacity: 1 }}
//         >
//           <div className="text-6xl">🎉🏆🎊</div>
//           <h1
//             className="text-4xl font-bold text-secondary"
//             style={{ fontFamily: "var(--font-display)" }}
//           >
//             Level 1 Complete!
//           </h1>
//           <div className="bg-white/80 rounded-2xl p-6 shadow-lg max-w-md mx-auto space-y-3">
//             <p
//               className="text-2xl font-bold"
//               style={{ color: primeNum ? "#16a34a" : "#ea580c" }}
//             >
//               {luckyNumber} is a{" "}
//               {primeNum ? "Prime Number! 🌟" : "Composite Number! 🎯"}
//             </p>
//             {primeNum ? (
//               <p className="text-muted-foreground">
//                 {luckyNumber} can only be divided by 1 and itself. No
//                 rectangular arrangement other than 1 × {luckyNumber} is
//                 possible!
//               </p>
//             ) : (
//               <div>
//                 <p className="text-2xl font-semibold mb-2">
//                   Arrangements found:
//                 </p>
//                 <div className="flex flex-wrap justify-center gap-2">
//                   {completed.map((c, i) => (
//                     <span
//                       key={i}
//                       className="inline-block bg-primary/10 text-2xl text-primary font-bold px-3 py-1 rounded-full"
//                     >
//                       {c.rows} × {c.cols}
//                     </span>
//                   ))}
//                 </div>
//               </div>
//             )}
//             <p className="text-muted-foreground text-2xl">
//               ⏱️ Time: {formatTime(timer)}
//             </p>
//             <button
//               onClick={onSpinAgain}
//               className="px-10 py-4 rounded-full font-bold text-xl shadow-xl text-white hover:scale-105 transition-transform"
//               style={{
//                 background: "#8F2424",
//                 fontFamily: "var(--font-display)",
//               }}
//             >
//               Do you want to spin the wheel again?
//             </button>
//           </div>
//           <button
//             onClick={onComplete}
//             className="px-10 py-4 rounded-full font-bold text-xl shadow-xl text-white hover:scale-105 transition-transform"
//             style={{
//               background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
//               fontFamily: "var(--font-display)",
//             }}
//           >
//             Continue to Level 2 →
//           </button>
//           <div className="flex justify-center">
//             <video
//               src={Level1CompleteVideo}
//               autoPlay
//               loop
//               muted
//               className="w-full max-w-xl rounded-xl shadow-lg"
//             />
//           </div>
//         </motion.div>
//       </div>
//     );
//   }

//   // ─── Main Game ─────────────────────────────────────────────────────────────
//   return (
//     <div
//       className="min-h-screen flex flex-col p-3"
//       style={{
//         background: "linear-gradient(135deg, #f0f4ff, #fdf2f8, #f0fdf4)",
//       }}
//     >
//       {/* Header */}
//       <div className="flex items-center justify-between mb-3 px-2">
//         <div className="flex flex-col gap-2">
//           <span className="text-2xl font-bold bg-white px-4 py-2 rounded-full shadow-md text-center">
//             ⏱️ {formatTime(timer)}
//           </span>
//           <button
//             onClick={() => setShowHowToPlay(true)}
//             className="px-3 py-1.5 text-white text-2xl bg-slate-500 font-bold rounded-full hover:scale-105 transition-transform"
//           >
//             📖 How to Play
//           </button>
//         </div>
//         <h2
//           className="text-2xl md:text-4xl font-bold text-secondary text-center"
//           style={{ fontFamily: "var(--font-display)" }}
//         >
//           🔍 Level 1 — Prime Patrol and Combo Detectives
//         </h2>
//         <span className="text-lg font-bold bg-white px-4 py-2 rounded-full shadow-md">
//           ✅ {completed.length}/{allPairs.length}
//         </span>
//       </div>

//       {/* Lucky number + remaining clicks */}
//       <div className="text-center mb-2 flex flex-wrap items-center justify-center gap-3">
//         <span className="bg-white/80 px-4 py-1.5 rounded-full shadow text-2xl font-bold">
//           Your number:{" "}
//           <span
//             className="text-2xl font-bold text-primary"
//             style={{ fontFamily: "var(--font-display)" }}
//           >
//             {luckyNumber}
//           </span>
//         </span>
//         <span className="bg-white/80 px-4 py-1.5 rounded-full shadow text-2xl font-bold">
//           Remaining clicks:{" "}
//           <span className="text-2xl font-bold text-secondary">
//             {luckyNumber - cells.size}
//           </span>
//         </span>
//       </div>

//       {/* Grid info hint */}
//       <div className="text-center text-base text-gray-500 mb-1">
//         Grid:{" "}
//         <span className="font-semibold">
//           {gridRows} rows × {gridCols} cols
//         </span>
//         {gridCols > 18 && (
//           <span className="ml-2 text-primary font-semibold">
//             ← scroll horizontally to see full grid →
//           </span>
//         )}
//       </div>

//       <div className="flex justify-center text-center text-2xl font-bold py-2 text-golden">
//         <h1>Select an icon</h1>
//       </div>

//       {/* Emoji selector */}
//       <div className="flex justify-center gap-2 mb-3">
//         {EMOJIS.map((e) => (
//           <button
//             key={e}
//             onClick={() => setEmoji(e)}
//             className={`text-2xl p-1.5 rounded-lg transition-all ${emoji === e ? "bg-primary/20 scale-110 ring-2 ring-primary" : "hover:bg-muted"}`}
//           >
//             {e}
//           </button>
//         ))}
//       </div>

//       {/* Grid */}
//       <div className="flex justify-center mb-3">
//         <div
//           style={{ maxWidth: "98vw", maxHeight: "62vh", overflow: "auto" }}
//           className="rounded-2xl shadow-lg"
//         >
//           <div
//             ref={gridRef}
//             className="inline-grid p-2 bg-white/70"
//             style={{
//               gridTemplateColumns: `repeat(${gridCols}, ${cellSize}px)`,
//               gridTemplateRows: `repeat(${gridRows}, ${cellSize}px)`,
//               gap: "2px",
//               width: `${gridCols * cellSize + (gridCols - 1) * 2 + 16}px`,
//               touchAction: "none",
//             }}
//             onPointerLeave={() => setIsDragging(false)}
//             onPointerUp={() => setIsDragging(false)}
//             onPointerMove={(e) => {
//               if (!isDragging || phase !== "playing") return;
//               const grid = gridRef.current;
//               if (!grid) return;
//               const rect = grid.getBoundingClientRect();
//               const padding = 8;
//               const gap = 2;
//               const col = Math.floor(
//                 (e.clientX - rect.left - padding) / (cellSize + gap),
//               );
//               const row = Math.floor(
//                 (e.clientY - rect.top - padding) / (cellSize + gap),
//               );
//               if (row < 0 || row >= gridRows || col < 0 || col >= gridCols)
//                 return;
//               const key = `${row},${col}`;
//               setCells((prev) => {
//                 const next = new Set(prev);
//                 if (
//                   dragMode === "add" &&
//                   !next.has(key) &&
//                   next.size < luckyNumber
//                 )
//                   next.add(key);
//                 else if (dragMode === "remove" && next.has(key))
//                   next.delete(key);
//                 return next;
//               });
//             }}
//           >
//             {Array.from({ length: gridRows * gridCols }, (_, idx) => {
//               const r = Math.floor(idx / gridCols);
//               const c = idx % gridCols;
//               const key = `${r},${c}`;
//               const isSelected = cells.has(key);
//               const isHighlighted = highlightRect && isSelected;
//               const isWrong = wrongCells.has(key);

//               return (
//                 <div
//                   key={key}
//                   className={`rounded-md border-2 transition-colors flex items-center justify-center select-none cursor-pointer
//                     ${
//                       isSelected
//                         ? isHighlighted
//                           ? "border-yellow-400 bg-yellow-100 shadow-[0_0_8px_rgba(250,204,21,0.6)]"
//                           : isWrong
//                             ? "border-red-500 bg-red-100"
//                             : "border-primary bg-primary/10"
//                         : "border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5"
//                     }`}
//                   style={{
//                     width: `${cellSize}px`,
//                     height: `${cellSize}px`,
//                     fontSize: `${Math.max(10, cellSize * 0.52)}px`,
//                     lineHeight: 1,
//                   }}
//                   onPointerDown={() => {
//                     if (phase !== "playing") return;
//                     setIsDragging(true);
//                     if (isSelected) {
//                       setDragMode("remove");
//                       handleCellClick(r, c);
//                     } else {
//                       setDragMode("add");
//                       handleCellClick(r, c);
//                     }
//                   }}
//                 >
//                   {isSelected ? (isWrong ? "❌" : emoji) : ""}
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       </div>

//       {/* Controls */}
//       <div className="flex justify-center gap-4 mb-2">
//         <button
//           onClick={handleClear}
//           className="px-6 py-2 rounded-full bg-destructive text-destructive-foreground font-bold shadow-md hover:scale-105 transition-transform"
//         >
//           🗑️ Clear All
//         </button>
//         {cells.size === luckyNumber && noRectMsg && (
//           <motion.button
//             onClick={handlePrimeGuess}
//             className="px-6 py-2 rounded-full bg-amber-500 text-white font-bold shadow-md hover:scale-105 transition-transform"
//             animate={{ scale: [1, 1.05, 1] }}
//             transition={{ duration: 1, repeat: Infinity }}
//           >
//             🤔 It's Prime!
//           </motion.button>
//         )}
//       </div>

//       <AnimatePresence>
//         {noRectMsg && (
//           <motion.p
//             className="text-center text-sm font-semibold text-amber-600 mb-2 px-4"
//             initial={{ opacity: 0, y: -10 }}
//             animate={{ opacity: 1, y: 0 }}
//             exit={{ opacity: 0 }}
//           >
//             {noRectMsg}
//           </motion.p>
//         )}
//       </AnimatePresence>

//       {/* ===== MODALS ===== */}

//       {/* How to Play */}
//       <AnimatePresence>
//         {(phase === "howtoplay" || showHowToPlay) && (
//           <motion.div
//             className="fixed inset-0 z-50 flex items-center justify-center p-4"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <div className="absolute inset-0 bg-black/50" />
//             <motion.div
//               className="relative bg-[#FBF5EF] rounded-3xl shadow-2xl p-6 max-w-[600px] w-full max-h-[90vh] overflow-y-auto hide-scrollbar"
//               initial={{ scale: 0.8 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.8 }}
//               transition={{ type: "spring", stiffness: 200 }}
//             >
//               <h2 className="text-3xl font-bold text-center mb-4 text-[#8F2424]">
//                 📖 How to Play — Level 1
//               </h2>
//               <ul className="space-y-3 text-gray-700 text-2xl leading-relaxed">
//                 <li className="flex gap-2">
//                   <span>🎰</span> Arrange the same number of icons on the grid.
//                 </li>
//                 <li className="flex gap-2">
//                   <span>🎨</span> Try to organise the icons into rectangular
//                   arrays with equal rows and columns.
//                 </li>
//                 <li className="flex gap-2">
//                   <span>📐</span> Explore different possible arrangements on the
//                   grid.
//                 </li>
//                 <li className="flex gap-2">
//                   <span>🔄</span> If icons can form one or more rectangles, the
//                   number is composite.
//                 </li>
//                 <li className="flex gap-2">
//                   <span>🤔</span> If no rectangle is possible (other than 1×N),
//                   the number is prime.
//                 </li>
//               </ul>
//               <div className="mt-5 text-center">
//                 <button
//                   onClick={() => {
//                     if (phase === "howtoplay") setPhase("timerStart");
//                     setShowHowToPlay(false);
//                   }}
//                   className="bg-[#8F2424] text-white text-xl font-bold px-6 py-2 rounded-full shadow-md hover:scale-105 transition"
//                 >
//                   Let's Play! 🎉
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Timer Start */}
//       <AnimatePresence>
//         {phase === "timerStart" && (
//           <motion.div
//             className="fixed inset-0 z-50 flex items-center justify-center p-4"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <div className="absolute inset-0 bg-black/50" />
//             <motion.div
//               className="relative bg-[#FBF5EF] rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
//               initial={{ scale: 0.8 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.8 }}
//               transition={{ type: "spring", stiffness: 200 }}
//             >
//               <div className="text-6xl mb-4">⏱️</div>
//               <h3
//                 className="text-2xl font-bold text-[#8F2424] mb-3"
//                 style={{ fontFamily: "var(--font-display)" }}
//               >
//                 Ready to Start?
//               </h3>
//               <p className="text-gray-600 mb-6 text-xl">
//                 Timer will begin as soon as you click the button below!
//               </p>
//               <button
//                 onClick={handleStartTimer}
//                 className="px-8 py-3 rounded-full text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform"
//                 style={{
//                   background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
//                   fontFamily: "var(--font-display)",
//                 }}
//               >
//                 ▶️ Start Timer
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Congrats Modal */}
//       <AnimatePresence>
//         {phase === "congrats" && currentRect && (
//           <motion.div
//             className="fixed inset-0 z-50 flex items-center justify-center p-4"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
//             <motion.div
//               className="relative rounded-2xl p-8 border-2 text-center max-w-md w-full"
//               style={{
//                 background: "linear-gradient(135deg, #1a1a2e, #16213e)",
//                 borderColor: "#FFD700",
//                 boxShadow: "0 0 40px rgba(255,215,0,0.3)",
//               }}
//               initial={{ scale: 0.5 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.5 }}
//               transition={{ type: "spring", damping: 20 }}
//             >
//               <div className="text-5xl mb-3">🎉</div>
//               <h3
//                 className="text-2xl font-bold text-white mb-2"
//                 style={{ fontFamily: "var(--font-display)" }}
//               >
//                 Congratulations!
//               </h3>
//               <p className="text-lg text-gray-200 mb-4">
//                 You made a{" "}
//                 <span className="text-yellow-400 font-bold text-2xl">
//                   {currentRect[0]} × {currentRect[1]}
//                 </span>{" "}
//                 rectangle!
//               </p>
//               <p className="text-white text-lg mb-4">
//                 Are more arrangements possible?
//               </p>
//               {congratsError && (
//                 <p className="text-amber-400 text-sm mb-3 animate-pulse">
//                   {congratsError}
//                 </p>
//               )}
//               <div className="flex gap-4 justify-center">
//                 <button
//                   onClick={handleMoreYes}
//                   className="px-8 py-3 rounded-full font-bold text-lg text-white shadow-lg hover:scale-105 transition-transform"
//                   style={{
//                     background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
//                   }}
//                 >
//                   ✅ Yes!
//                 </button>
//                 <button
//                   onClick={handleMoreNo}
//                   className="px-8 py-3 rounded-full font-bold text-lg text-white shadow-lg hover:scale-105 transition-transform"
//                   style={{
//                     background: "linear-gradient(135deg, #ef4444, #f97316)",
//                   }}
//                 >
//                   ❌ No
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Prime Congrats Modal */}
//       <AnimatePresence>
//         {phase === "primeCongrats" && (
//           <motion.div
//             className="fixed inset-0 z-50 flex items-center justify-center p-4"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
//             <motion.div
//               className="relative rounded-2xl p-8 border-2 text-center max-w-md w-full"
//               style={{
//                 background: "linear-gradient(135deg, #1a1a2e, #16213e)",
//                 borderColor: "#FFD700",
//                 boxShadow: "0 0 40px rgba(255,215,0,0.3)",
//               }}
//               initial={{ scale: 0.5 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.5 }}
//               transition={{ type: "spring", damping: 20 }}
//             >
//               <div className="text-5xl mb-3">🌟🎉🌟</div>
//               <h3
//                 className="text-2xl font-bold text-white mb-2"
//                 style={{ fontFamily: "var(--font-display)" }}
//               >
//                 Congratulations!
//               </h3>
//               <p className="text-lg text-gray-200 mb-2">
//                 You correctly identified that
//               </p>
//               <p
//                 className="text-3xl font-bold text-yellow-400 mb-2"
//                 style={{ fontFamily: "var(--font-display)" }}
//               >
//                 {luckyNumber} is a Prime Number!
//               </p>
//               <p className="text-gray-300 mb-6">
//                 It can only be divided by 1 and {luckyNumber}. No rectangular
//                 arrangement other than 1 × {luckyNumber} is possible! 🧠
//               </p>
//               <button
//                 onClick={() => {
//                   // Prime number — skip quiz2, go directly to complete
//                   setPhase("quiz1");
//                   setQuiz1Answer(null);
//                   setQuiz1Wrong(false);
//                 }}
//                 className="px-8 py-3 rounded-full font-bold text-lg text-white shadow-lg hover:scale-105 transition-transform"
//                 style={{
//                   background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
//                 }}
//               >
//                 Continue →
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Input Pair Modal */}
//       <AnimatePresence>
//         {phase === "inputPair" && (
//           <motion.div
//             className="fixed inset-0 z-50 flex items-center justify-center p-4"
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//           >
//             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
//             <motion.div
//               className="relative rounded-2xl p-8 border-2 text-center max-w-md w-full"
//               style={{
//                 background: "linear-gradient(135deg, #1a1a2e, #16213e)",
//                 borderColor: "#FFD700",
//               }}
//               initial={{ scale: 0.5 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.5 }}
//               transition={{ type: "spring", damping: 20 }}
//             >
//               <button
//                 onClick={() => setPhase("congrats")}
//                 className="absolute top-3 right-4 text-xl font-bold text-white hover:text-red-400 transition"
//               >
//                 ✖
//               </button>
//               <h3
//                 className="text-2xl font-bold text-white mb-4"
//                 style={{ fontFamily: "var(--font-display)" }}
//               >
//                 What's the next arrangement?
//               </h3>
//               <p className="text-gray-300 mb-4 text-xl">
//                 Enter the dimensions: ___ × ___ = {luckyNumber}
//               </p>
//               <div className="flex items-center justify-center gap-3 mb-4">
//                 <input
//                   type="number"
//                   value={inputR}
//                   onChange={(e) => setInputR(e.target.value)}
//                   placeholder="rows"
//                   className="w-20 px-3 py-2 rounded-lg text-center text-lg font-bold bg-white/10 text-white border border-white/30 focus:border-yellow-400 focus:outline-none"
//                 />
//                 <span className="text-2xl text-yellow-400 font-bold">×</span>
//                 <input
//                   type="number"
//                   value={inputC}
//                   onChange={(e) => setInputC(e.target.value)}
//                   placeholder="cols"
//                   className="w-20 px-3 py-2 rounded-lg text-center text-lg font-bold bg-white/10 text-white border border-white/30 focus:border-yellow-400 focus:outline-none"
//                 />
//               </div>
//               {inputError && (
//                 <p className="text-amber-400 text-sm mb-3 animate-pulse">
//                   {inputError}
//                 </p>
//               )}
//               <button
//                 onClick={handleSubmitPair}
//                 className="px-8 py-3 rounded-full font-bold text-lg text-white shadow-lg hover:scale-105 transition-transform"
//                 style={{
//                   background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
//                 }}
//               >
//                 ✅ Submit
//               </button>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }