import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Trophy, Clock } from "lucide-react";
import For_Hundreds_grid from "@/assets/pahal/For_Hundreds_grid.png";
import For_Tens_grid from "@/assets/pahal/For_Tens_grid.png";
import For_Ones_grid from "@/assets/pahal/For_Ones_grid.png";
import For_Thousands_grid from "@/assets/pahal/For_Thousands_grid.png"; // 👈 apni thousands image add karo
import celebrationVideo from "@/assets/Level2CompleteVideo.mp4";

interface Props {
  onComplete: () => void;
  onBack: () => void;
  onPlayAgain: () => void;
}

type PlaceValue = "thousands" | "hundreds" | "tens" | "ones";

interface DropState {
  thousands: number;
  hundreds: number;
  tens: number;
  ones: number;
}

interface QuestionDef {
  text: string;
  type: "drag-input" | "choice";
  inputLabel?: string;
  inputType?: string;
  correctInput?: string;
  correctDrop?: DropState;
  choices?: string[];
  correctChoice?: string;
  fixMistake?: boolean;
  mistakeText?: string;
  // Which columns are locked (pre-filled, not draggable)
  lockedColumns?: Partial<DropState>;
}

const questions: QuestionDef[] = [
  {
    text: "Build the mystery number by dragging the correct Thousands, Hundreds, Tens, and Ones in the drop zone.\n(a) The number is greater than 4000 but less than 5000\n(b) Hundreds digit is double the Tens digit\n(c) Tens digit is 2 more than Ones\n(d) Ones digit is 2",
    type: "drag-input",
    correctDrop: { thousands: 4, hundreds: 8, tens: 4, ones: 2 },
    inputLabel: "The formed number is:",
    inputType: "number",
    correctInput: "4842",
  },
  {
    text: "Fix the broken number by dragging the correct Hundreds and Ones in the drop zone. The number shown is wrong: 6 _ 5 _\n• The thousands digit is correct\n(a) Hundreds digit should be half of Thousands\n(b) Tens digit should be 1 less than Tens\n(c) Ones digit is 6",
    type: "drag-input",
    correctDrop: { thousands: 6, hundreds: 3, tens: 5, ones: 6 },
    inputLabel: "The formed number is:",
    inputType: "number",
    correctInput: "6356",
    lockedColumns: { thousands: 6, tens: 5 }, // pre-filled, can't drag
  },
  {
    text: "A number becomes 9542 when reversed. Form the original number by dragging the correct Thousands, Hundreds, Tens, and Ones in the drop zone.",
    type: "drag-input",
    correctDrop: { thousands: 2, hundreds: 4, tens: 5, ones: 9 },
    inputLabel: "The formed number is:",
    inputType: "number",
    correctInput: "2459",
  },
  {
    text: "Form the largest possible number using the given digits: 3, 6, 1, 8 (not in order)\n(a) The digit at the Ones place must be half the digit at the Hundreds place\n(b) The digit at the Tens place must be the smallest",
    type: "drag-input",
    correctDrop: { thousands: 8, hundreds: 6, tens: 1, ones: 3 },
    inputLabel: "The formed number is:",
    inputType: "number",
    correctInput: "8613",
  },
  {
    text: "Build the number by dragging the correct Thousands, Hundreds, Tens, and Ones in the drop zone.\n(a) The thousands digit is 9\n(b) Each digit decreases by 2 as we move to the right",
    type: "drag-input",
    correctDrop: { thousands: 9, hundreds: 7, tens: 5, ones: 3 },
    inputLabel: "The formed number is:",
    inputType: "number",
    correctInput: "9753",
  },
];

const TOTAL = questions.length;

const DRAG_ITEMS: {
  type: PlaceValue;
  label: string;
  color: string;
  bgColor: string;
  borderColor: string;
  shape: string;
}[] = [
  {
    type: "thousands",
    label: "Thousand",
    color: "bg-purple-500",
    bgColor: "bg-purple-100",
    borderColor: "border-purple-400",
    shape: "rounded-xl",
  },
  {
    type: "hundreds",
    label: "Hundred",
    color: "bg-yellow-500",
    bgColor: "bg-yellow-100",
    borderColor: "border-yellow-400",
    shape: "rounded-lg",
  },
  {
    type: "tens",
    label: "Ten",
    color: "bg-green-500",
    bgColor: "bg-green-100",
    borderColor: "border-green-400",
    shape: "rounded-md",
  },
  {
    type: "ones",
    label: "One",
    color: "bg-primary",
    bgColor: "bg-blue-100",
    borderColor: "border-blue-400",
    shape: "rounded-full",
  },
];

const THTOBuildAndBreakChallenge = ({ onComplete, onBack , onPlayAgain }: Props) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const quizStartTime = useRef(Date.now());

  const [drops, setDrops] = useState<DropState[]>(() =>
    questions.map((q) => ({
      thousands: q.lockedColumns?.thousands ?? 0,
      hundreds: q.lockedColumns?.hundreds ?? 0,
      tens: q.lockedColumns?.tens ?? 0,
      ones: q.lockedColumns?.ones ?? 0,
    })),
  );

  const [inputs, setInputs] = useState<string[]>(Array(TOTAL).fill(""));
  const [feedbacks, setFeedbacks] = useState<("correct" | "wrong" | null)[]>(
    Array(TOTAL).fill(null),
  );
  const [submitted, setSubmitted] = useState<boolean[]>(
    Array(TOTAL).fill(false),
  );
  const [isFinished, setIsFinished] = useState(false);
  const [dragType, setDragType] = useState<PlaceValue | null>(null);

  const q = questions[currentQ];
  const currentDrop = drops[currentQ];
  const feedback = feedbacks[currentQ];

  const isColumnLocked = (type: PlaceValue) =>
    q.lockedColumns?.[type] !== undefined;

  const addItem = useCallback(
    (type: PlaceValue) => {
      if (submitted[currentQ]) return;
      if (questions[currentQ].lockedColumns?.[type] !== undefined) return;
      setDrops((prev) => {
        const updated = [...prev];
        updated[currentQ] = {
          ...updated[currentQ],
          [type]: updated[currentQ][type] + 1,
        };
        return updated;
      });
    },
    [currentQ, submitted],
  );

  const removeItem = useCallback(
    (type: PlaceValue) => {
      if (submitted[currentQ]) return;
      if (questions[currentQ].lockedColumns?.[type] !== undefined) return;
      setDrops((prev) => {
        const updated = [...prev];
        if (updated[currentQ][type] > 0) {
          updated[currentQ] = {
            ...updated[currentQ],
            [type]: updated[currentQ][type] - 1,
          };
        }
        return updated;
      });
    },
    [currentQ, submitted],
  );

  const handleDragStart = (e: React.DragEvent, type: PlaceValue) => {
    e.dataTransfer.setData("text/plain", type);
    e.dataTransfer.effectAllowed = "copy";
    setDragType(type);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDrop = (e: React.DragEvent, column: PlaceValue) => {
    e.preventDefault();
    const type = e.dataTransfer.getData("text/plain") as PlaceValue;
    if (type === column && !isColumnLocked(column)) {
      addItem(type);
    }
    setDragType(null);
  };

  const handleSubmit = () => {
    if (submitted[currentQ]) return;

    const dropCorrect = q.correctDrop
      ? currentDrop.thousands === q.correctDrop.thousands &&
        currentDrop.hundreds === q.correctDrop.hundreds &&
        currentDrop.tens === q.correctDrop.tens &&
        currentDrop.ones === q.correctDrop.ones
      : true;

    const inputCorrect = q.correctInput
      ? inputs[currentQ].trim().replace(/\s/g, "") === q.correctInput
      : true;

    const isCorrect = dropCorrect && inputCorrect;

    const newFeedbacks = [...feedbacks];
    newFeedbacks[currentQ] = isCorrect ? "correct" : "wrong";
    setFeedbacks(newFeedbacks);

    const newSubmitted = [...submitted];
    newSubmitted[currentQ] = isCorrect;
    setSubmitted(newSubmitted);
  };

  const handleTryAgain = () => {
    const newFeedbacks = [...feedbacks];
    newFeedbacks[currentQ] = null;
    setFeedbacks(newFeedbacks);

    // Reset non-locked drops
    setDrops((prev) => {
      const updated = [...prev];
      updated[currentQ] = {
        thousands: q.lockedColumns?.thousands ?? 0,
        hundreds: q.lockedColumns?.hundreds ?? 0,
        tens: q.lockedColumns?.tens ?? 0,
        ones: q.lockedColumns?.ones ?? 0,
      };
      return updated;
    });
    setInputs((prev) => {
      const updated = [...prev];
      updated[currentQ] = "";
      return updated;
    });
  };

  const handleNext = () => {
    if (currentQ < TOTAL - 1) setCurrentQ((c) => c + 1);
    else setIsFinished(true);
  };

  const handlePrevious = () => {
    if (currentQ > 0) setCurrentQ((c) => c - 1);
  };

  const score = feedbacks.filter((f) => f === "correct").length;

  useEffect(() => {
    if (isFinished) return;
    const timer = setInterval(() => {
      setElapsedTime(Math.round((Date.now() - quizStartTime.current) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [isFinished]);

    useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "e") {
      e.preventDefault();
      setIsFinished(true);
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, []);

  if (isFinished) {
    const totalMin = Math.floor(elapsedTime / 60);
    const totalSec = elapsedTime % 60;
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-xl border border-border p-8 mt-5 md:p-12 game-card-shadow text-center"
        >
          <Trophy className="w-16 h-16 text-game-done mx-auto mb-4" />
          <h2 className="text-3xl font-display font-bold text-primary mb-2">
            Challenge Complete!
          </h2>
          <p className="text-3xl font-display font-semibold text-foreground mb-6">
            Score: {score} / {TOTAL}
          </p>
          <div className="flex items-center justify-center gap-2 mb-5">
            <Clock size={22} className="text-muted-foreground" />
            <p className="text-2xl font-display font-semibold text-muted-foreground">
              Total Time: {totalMin > 0 ? `${totalMin}m ` : ""}
              {totalSec}s
            </p>
          </div>

          <div className="mb-6 rounded-xl overflow-hidden max-w-sm mx-auto">
            <video
              src={celebrationVideo}
              autoPlay
              loop
              muted
              playsInline
              className="w-full"
            />
          </div>

          <div className="space-y-3 text-left max-w-2xl mx-auto mb-6">
            <h3 className="text-2xl font-display font-bold text-foreground text-center mb-3">
              Summary
            </h3>
            {questions.map((ques, i) => {
              const isCorrect = feedbacks[i] === "correct";
              return (
                <div
                  key={i}
                  className={`rounded-xl p-4 ${
                    isCorrect ? "bg-green-50" : "bg-red-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl font-display font-bold text-foreground">
                      PC {i + 1}
                    </span>
                    <span
                      className={`text-xl font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}
                    >
                      {isCorrect ? "✓ Correct" : "✗ Incorrect"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-secondary text-3xl text-secondary-foreground rounded-xl font-display font-semibold hover:opacity-90 transition"
            >
              Go Back
            </button>
            <button
              onClick={onPlayAgain}
              className="px-6 py-3 bg-primary text-2xl text-primary-foreground rounded-xl font-display font-semibold hover:opacity-90 transition"
            >
              Play again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const getImageForType = (type: PlaceValue) => {
    switch (type) {
      case "thousands":
        return For_Thousands_grid;
      case "hundreds":
        return For_Hundreds_grid;
      case "tens":
        return For_Tens_grid;
      case "ones":
        return For_Ones_grid;
    }
  };

  const getDropImageSize = (type: PlaceValue) => {
    switch (type) {
      case "thousands":
        return "w-8 h-8 md:w-20 md:h-20";
      case "hundreds":
        return "w-8 h-8 md:w-20 md:h-20";
      case "tens":
        return "w-5 h-10 md:w-10 md:h-20";
      case "ones":
        return "w-6 h-6 md:w-14 md:h-14";
    }
  };

  const renderColumn = (
    type: PlaceValue,
    label: string,
    borderColor: string,
    shape: string,
    bgColor: string,
  ) => {
    const count = currentDrop[type];
    const isActive = dragType === type;
    const locked = isColumnLocked(type);

    return (
      <div
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, type)}
        onClick={() => {
          if (locked) return;
          if (dragType === type) addItem(type);
        }}
        className={`flex-1 border-2 rounded-xl p-1 min-h-[220px] transition-all flex flex-col items-center relative
          ${locked ? "bg-muted/30 border-muted cursor-not-allowed" : ""}
          ${
            !locked && feedback === "correct"
              ? "border-game-done/50 bg-game-done/5"
              : !locked && feedback === "wrong"
                ? "border-destructive/50 bg-destructive/5"
                : !locked && isActive
                  ? `${borderColor} ${bgColor} scale-[1.02]`
                  : !locked
                    ? "border-border/50 bg-card/50"
                    : ""
          }`}
      >
        {/* Lock badge for pre-filled columns */}
        {locked && (
          <span className="absolute top-1 right-1 text-xs bg-muted text-muted-foreground rounded px-1 font-display">
            🔒
          </span>
        )}

        <p className="text-xl md:text-2xl font-display font-bold text-foreground uppercase tracking-wide mb-2">
          {label}
        </p>

        <div className="flex gap-1 items-start flex-wrap justify-center w-full overflow-hidden">
          {Array.from({ length: count }).map((_, i) => (
            <motion.img
              key={`${type}-${i}`}
              src={getImageForType(type)}
              alt={type}
              initial={{ opacity: 0, scale: 0, y: -15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 400,
                damping: 15,
                delay: i * 0.03,
              }}
              onClick={(e) => {
                e.stopPropagation();
                if (!locked) removeItem(type);
              }}
              className={`object-contain ${locked ? "cursor-not-allowed" : "cursor-pointer hover:scale-110"} transition-transform ${getDropImageSize(type)} ${shape}`}
              title={locked ? "This digit is fixed" : "Click to remove"}
            />
          ))}
        </div>
      </div>
    );
  };

  // Parse question text: first line center, bullet lines left-aligned
  const renderQuestionText = (text: string) => {
    const lines = text.split("\n");
    const firstLine = lines[0];
    const points = lines.slice(1);

    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-lg md:text-4xl font-display font-bold text-foreground text-center">
          {firstLine}
        </p>
        {points.length > 0 && (
          <div className="flex flex-col gap-1 self-start md:self-center md:items-start">
            {points.map((point, i) => (
              <p
                key={i}
                className="text-base md:text-3xl font-display font-bold text-foreground text-left"
              >
                {point}
              </p>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-[80vh]">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/videos/pahal-bg.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-background/80 z-0" />

      <div className="relative z-10 space-y-4 p-4 md:p-6">
        <div className="text-center">
          <h2 className="text-2xl md:text-5xl font-display font-bold text-secondary">
            PAHAL Practice: Build and Break
          </h2>

          <div className="flex justify-center items-center gap-32">
            <p className="text-muted-foreground font-semibold text-4xl mt-3">
              PAHAL Challenge {currentQ + 1} of {TOTAL}
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Clock size={20} className="text-muted-foreground" />
              <span className="text-2xl font-display font-semibold text-muted-foreground">
                {Math.floor(elapsedTime / 60) > 0
                  ? `${Math.floor(elapsedTime / 60)}m `
                  : ""}
                {elapsedTime % 60}s
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-8xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="bg-card/95 backdrop-blur-sm rounded-xl border border-border p-5 md:p-6 game-card-shadow"
            >
              {/* Question text */}
              <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-4 mb-5">
                {renderQuestionText(q.text)}
              </div>

              {/* Main interaction area */}
              <div className="grid grid-cols-1 lg:grid-cols-[1fr_580px] gap-4">
                {/* Drop Zones: 4 columns now */}
                <div className="flex gap-2">
                  {renderColumn(
                    "thousands",
                    "Thousands",
                    "border-purple-400",
                    "rounded-xl",
                    "bg-purple-50",
                  )}
                  {renderColumn(
                    "hundreds",
                    "Hundreds",
                    "border-yellow-400",
                    "rounded-lg",
                    "bg-yellow-50",
                  )}
                  {renderColumn(
                    "tens",
                    "Tens",
                    "border-green-400",
                    "rounded-md",
                    "bg-green-50",
                  )}
                  {renderColumn(
                    "ones",
                    "Ones",
                    "border-blue-400",
                    "rounded-full",
                    "bg-blue-50",
                  )}
                </div>

                {/* Source panel */}
                <div className="bg-accent/10 border-2 border-accent/30 rounded-xl p-4 flex flex-col items-center gap-3">
                  <p className="text-2xl font-display font-semibold text-foreground uppercase tracking-wide text-center">
                    Drag Source
                  </p>

                  <div className="flex flex-row items-end justify-center gap-4 w-full flex-wrap">
                    {DRAG_ITEMS.map((item) => {
                      const locked = isColumnLocked(item.type);
                      return (
                        <div
                          key={item.type}
                          className="flex flex-col items-center gap-1"
                        >
                          {/* <p className="text-base font-display font-bold text-muted-foreground">
                            {item.label}
                          </p> */}
                          <div
                            draggable={!submitted[currentQ] && !locked}
                            onDragStart={(e) => {
                              if (!locked) handleDragStart(e, item.type);
                            }}
                            onClick={() => {
                              if (submitted[currentQ] || locked) return;
                              if (dragType === item.type) {
                                addItem(item.type);
                                setDragType(null);
                              } else {
                                setDragType(item.type);
                              }
                            }}
                            className={`
                              relative flex items-center justify-center rounded-xl p-0.5 transition-all
                              ${
                                submitted[currentQ] || locked
                                  ? "opacity-40 cursor-not-allowed"
                                  : dragType === item.type
                                    ? "cursor-pointer scale-110 ring-4 ring-primary shadow-xl"
                                    : "cursor-pointer hover:scale-105 hover:shadow-lg active:scale-95"
                              }
                            `}
                          >
                            {item.type === "thousands" ? (
                              <img
                                src={For_Thousands_grid}
                                alt="Thousand"
                                className="w-40 h-40 object-contain"
                                draggable={false}
                              />
                            ) : item.type === "hundreds" ? (
                              <img
                                src={For_Hundreds_grid}
                                alt="Hundred"
                                className="w-40 h-40 object-contain"
                                draggable={false}
                              />
                            ) : item.type === "tens" ? (
                              <img
                                src={For_Tens_grid}
                                alt="Ten"
                                className="w-10 h-40 object-contain"
                                draggable={false}
                              />
                            ) : (
                              <img
                                src={For_Ones_grid}
                                alt="One"
                                className="w-20 h-32 object-contain"
                                draggable={false}
                              />
                            )}

                            {dragType === item.type && (
                              <span className="absolute -top-2 -right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold shadow">
                                ✓
                              </span>
                            )}

                            {locked && (
                              <span className="absolute -top-2 -right-2 text-sm">
                                🔒
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <p className="text-xl font-bold font-display text-muted-foreground text-center mt-2">
                    Select an item, then tap its column to place it
                  </p>
                </div>
              </div>

              {/* Input */}
              {q.type === "drag-input" && q.inputLabel && (
                <div className="mt-4 max-w-sm mx-auto">
                  <label className="text-3xl whitespace-nowrap font-display font-semibold text-foreground block mb-1">
                    {q.inputLabel}
                  </label>
                  <input
                    type={q.inputType === "text" ? "text" : "number"}
                    value={inputs[currentQ]}
                    onChange={(e) => {
                      if (submitted[currentQ]) return;
                      const newInputs = [...inputs];
                      newInputs[currentQ] = e.target.value;
                      setInputs(newInputs);
                    }}
                    disabled={!!submitted[currentQ]}
                    placeholder="Enter your answer"
                    className="w-full h-14 rounded-md border border-input bg-background px-4 py-1 text-xl ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-2xl font-display font-bold"
                  />
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-4 rounded-xl text-center text-4xl font-display font-semibold ${
                    feedback === "correct"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {feedback === "correct"
                    ? "Well done! Bravo."
                    : "❌ Try again."}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-5">
            <button
              onClick={handlePrevious}
              disabled={currentQ === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-display font-semibold text-2xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} /> Previous
            </button>

            <div className="flex gap-3">
              {feedback === "wrong" && (
                <button
                  onClick={handleTryAgain}
                  className="px-5 py-2.5 rounded-xl bg-destructive text-destructive-foreground font-display font-semibold text-2xl hover:opacity-90 transition"
                >
                  Try Again
                </button>
              )}
              {!feedback && (
                <button
                  onClick={handleSubmit}
                  disabled={
                    (currentDrop.thousands === 0 &&
                      currentDrop.hundreds === 0 &&
                      currentDrop.tens === 0 &&
                      currentDrop.ones === 0) ||
                    !inputs[currentQ].trim()
                  }
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-2xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              )}
            </div>

            <button
              onClick={handleNext}
              disabled={feedback !== "correct"}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-2xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {currentQ === TOTAL - 1 ? "Finish" : "Next"}{" "}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default THTOBuildAndBreakChallenge;