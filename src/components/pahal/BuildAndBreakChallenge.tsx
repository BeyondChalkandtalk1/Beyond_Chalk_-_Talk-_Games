import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Trophy, Clock } from "lucide-react";
import blueBall from "@/assets/pahal/For_Ones.png";
import celebrationVideo from "@/assets/Level2CompleteVideo.mp4";
import correctDragSound from "@/assets/correctDargSound.mpeg";
import { useSound } from "@/contexts/SoundContext";

interface Props {
  onComplete: () => void;
  onBack: () => void;
  onPlayAgain: () => void;
  playSound: () => void;
}

interface BallItem {
  id: number;
  group?: number; // which group this ball belongs to (for grouping logic)
}

interface QuestionDef {
  text: string;
  type: "drag-input" | "choice";
  // For drag-input questions
  preFilledBalls?: number; // balls already in the zone
  correctDragCount?: number; // total balls needed in zone
  correctInput?: string;
  inputLabel?: string;
  // For choice questions
  choices?: string[];
  correctChoice?: string;
  // For grouping questions
  requireGrouping?: boolean;
  groupSize?: number; // e.g. 10 for tens
  expectedGroups?: number;
  expectedRemainder?: number;
}

const questions: QuestionDef[] = [
  {
    text: "There are 7 Ones. Drag more Ones to make a Ten. How many Ones are needed?",
    type: "drag-input",
    preFilledBalls: 7,
    correctDragCount: 10,
    correctInput: "3 Ones",
    inputLabel: "How many Ones did you add?",
  },
  {
    text: "You have 15 Ones. Drag Ones to make Tens. How many Ones are left after making a Ten?",
    type: "drag-input",
    preFilledBalls: 0,
    correctDragCount: 15,
    correctInput: "5 Ones",
    inputLabel: "How many Ones are left?",
    requireGrouping: true,
    groupSize: 10,
    expectedGroups: 1,
    expectedRemainder: 5,
  },
  {
    text: 'A player says: "11 Ones and 1 Ten make 2 Tens." Is this correct? Fix the mistake by drag-and-drop.',
    type: "drag-input",
    preFilledBalls: 0,
    correctDragCount: 21,
    correctInput: "1 One",
    inputLabel: "How many Ones are left over? (2 Tens and ___ One)",
    requireGrouping: true,
    groupSize: 10,
    expectedGroups: 2,
    expectedRemainder: 1,
  },
  {
    text: "Choose Wisely: You can pick 1 Ten or 9 Ones. Which one gives you more?",
    type: "choice",
    choices: ["1 Ten", "9 Ones"],
    correctChoice: "1 Ten",
  },
  {
    text: "You have 30 Ones scattered around. Make as many Tens as you can. How many Tens did you build?",
    type: "drag-input",
    preFilledBalls: 0,
    correctDragCount: 30,
    correctInput: "3 Tens",
    inputLabel: "How many Tens did you build?",
    requireGrouping: true,
    groupSize: 10,
    expectedGroups: 3,
    expectedRemainder: 0,
  },
];

const TOTAL = questions.length;

const BuildAndBreakChallenge = ({ onComplete, onBack, onPlayAgain }: Props) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const quizStartTime = useRef(Date.now());
  const dragSoundRef = useRef<HTMLAudioElement | null>(null);
  const [balls, setBalls] = useState<BallItem[][]>(() =>
    questions.map((q) =>
      Array.from({ length: q.preFilledBalls || 0 }, (_, i) => ({ id: i })),
    ),
  );
  const [inputs, setInputs] = useState<string[]>(Array(TOTAL).fill(""));
  const [choices, setChoices] = useState<(string | null)[]>(
    Array(TOTAL).fill(null),
  );
  const [feedbacks, setFeedbacks] = useState<("correct" | "wrong" | null)[]>(
    Array(TOTAL).fill(null),
  );
  const [submitted, setSubmitted] = useState<boolean[]>(
    Array(TOTAL).fill(false),
  );
  const [isFinished, setIsFinished] = useState(false);
  const nextId = useRef(100);
 const { playSound } = useSound();
  const q = questions[currentQ];
  const currentBalls = balls[currentQ];
  const feedback = feedbacks[currentQ];

  // Add a ball to drop zone
  const addBall = useCallback(() => {
    if (submitted[currentQ]) return;
    setBalls((prev) => {
      const updated = [...prev];
      updated[currentQ] = [...updated[currentQ], { id: nextId.current++ }];
      return updated;
    });
  }, [currentQ, submitted]);

  // Remove a ball
  const removeBall = useCallback(
    (id: number) => {
      if (submitted[currentQ]) return;
      setBalls((prev) => {
        const updated = [...prev];
        updated[currentQ] = updated[currentQ].filter((b) => b.id !== id);
        return updated;
      });
    },
    [currentQ, submitted],
  );

  // Handle drag
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("text/plain", "ball");
    e.dataTransfer.effectAllowed = "copy";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };



  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    addBall();
    playSound(correctDragSound);
  };

  // Submit answer
  const handleSubmit = () => {
    if (submitted[currentQ]) return;

    let isCorrect = false;

    if (q.type === "choice") {
      isCorrect = choices[currentQ] === q.correctChoice;
    } else {
      const ballCount = currentBalls.length;
      const inputVal = inputs[currentQ].trim();

      if (q.requireGrouping) {
        const fullGroups = Math.floor(ballCount / (q.groupSize || 10));
        const remainder = ballCount % (q.groupSize || 10);
        isCorrect =
          ballCount === q.correctDragCount &&
          fullGroups === q.expectedGroups &&
          remainder === q.expectedRemainder &&
          inputVal === q.correctInput;
      } else {
        isCorrect =
          ballCount === q.correctDragCount && inputVal === q.correctInput;
      }
    }

    const newFeedbacks = [...feedbacks];
    newFeedbacks[currentQ] = isCorrect ? "correct" : "wrong";
    setFeedbacks(newFeedbacks);

    const newSubmitted = [...submitted];
    newSubmitted[currentQ] = isCorrect; // only lock on correct
    setSubmitted(newSubmitted);
  };



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

useEffect(() => {
  dragSoundRef.current = new Audio(correctDragSound);
}, []);

useEffect(() => {
  if (isFinished) return;
  const timer = setInterval(() => {
    setElapsedTime(Math.round((Date.now() - quizStartTime.current) / 1000));
  }, 1000);
  return () => clearInterval(timer);
}, [isFinished]);

  const handleTryAgain = () => {
    const newFeedbacks = [...feedbacks];
    newFeedbacks[currentQ] = null;
    setFeedbacks(newFeedbacks);

    // Reset balls to original prefilled count
    setBalls((prev) => {
      const updated = [...prev];
      const preCount = questions[currentQ].preFilledBalls || 0;
      updated[currentQ] = Array.from({ length: preCount }, (_, i) => ({
        id: i,
      }));
      return updated;
    });

    // Reset input field
    setInputs((prev) => {
      const updated = [...prev];
      updated[currentQ] = "";
      return updated;
    });

    // Reset choice selection
    setChoices((prev) => {
      const updated = [...prev];
      updated[currentQ] = null;
      return updated;
    });
  };

  const handleNext = () => {
    if (currentQ < TOTAL - 1) {
      setCurrentQ((c) => c + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrevious = () => {
    if (currentQ > 0) setCurrentQ((c) => c - 1);
  };

  // Group balls visually into tens
  const getGroupedBalls = () => {
    if (!q.requireGrouping) return null;
    const groupSize = q.groupSize || 10;
    const groups: BallItem[][] = [];
    const remainder: BallItem[] = [];

    currentBalls.forEach((ball, i) => {
      const groupIdx = Math.floor(i / groupSize);
      if (i < Math.floor(currentBalls.length / groupSize) * groupSize) {
        if (!groups[groupIdx]) groups[groupIdx] = [];
        groups[groupIdx].push(ball);
      } else {
        remainder.push(ball);
      }
    });

    return { groups, remainder };
  };

  const score = feedbacks.filter((f) => f === "correct").length;



  if (isFinished) {
      const totalMin = Math.floor(elapsedTime / 60);
      const totalSec = elapsedTime % 60;
    return (
      <div className="max-w-3xl mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card/90 backdrop-blur-sm rounded-xl border border-border p-8 md:p-12 game-card-shadow text-center mt-5"
        >
          <Trophy className="w-16 h-16 text-game-done mx-auto mb-4" />
          <h2 className="text-5xl font-display font-bold text-primary mb-4">
            Challenge Complete!
          </h2>
          <p className="text-3xl font-display font-semibold text-foreground mb-4">
            Score: {score} / {TOTAL}
          </p>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock size={22} className="text-muted-foreground" />
            <p className="text-2xl font-display font-semibold text-muted-foreground">
              Total Time: {totalMin > 0 ? `${totalMin}m ` : ""}
              {totalSec}s
            </p>
          </div>

          {/* Celebration Video */}
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

          {/* ===== QUESTION SUMMARY — same as PrePahalSkill ===== */}
          <div className="space-y-2 text-left max-w-2xl mx-auto mb-6">
            {questions.map((ques, i) => {
              const isCorrect = feedbacks[i] === "correct";
              const userAnswer =
                ques.type === "choice"
                  ? choices[i] || "No answer"
                  : inputs[i]
                    ? `Balls: ${balls[i].length}, Input: "${inputs[i]}"`
                    : "No answer";
              const correctAns =
                ques.type === "choice"
                  ? ques.correctChoice
                  : `Balls: ${ques.correctDragCount}, Input: "${ques.correctInput}"`;

              return (
                <div
                  key={i}
                  className={`px-4 py-2 rounded-lg text-3xl font-body flex justify-between ${
                    isCorrect
                      ? "bg-green-200 text-game-done"
                      : "bg-red-200 text-destructive"
                  }`}
                >
                  <span>PC {i + 1}.</span>
                  <span>
                    {isCorrect ? "✓" : `✗ (${correctAns})`} ({userAnswer})
                  </span>
                </div>
              );
            })}
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 justify-center">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl text-4xl font-display font-semibold hover:opacity-90 transition"
            >
              Go Back
            </button>
            <button
              // onClick={onComplete}
              onClick={onPlayAgain}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl text-4xl font-display font-semibold hover:opacity-90 transition"
            >
              Play again
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const grouped = q.requireGrouping ? getGroupedBalls() : null;

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
        {/* Title */}
        <div className="text-center">
          <h2 className="text-2xl md:text-5xl font-display font-bold text-secondary">
            PAHAL Practice: Build and Break
          </h2>
          <div className="flex mx-auto items-center justify-center gap-32 mt-2">
            <p className="text-muted-foreground font-bold text-2xl mt-1">
              PAHAL Challenge: {currentQ + 1} of {TOTAL}
            </p>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Clock size={20} className="text-muted-foreground" />
              <span className="text-xl font-display font-semibold text-muted-foreground">
                {Math.floor(elapsedTime / 60) > 0
                  ? `${Math.floor(elapsedTime / 60)}m `
                  : ""}
                {elapsedTime % 60}s
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="bg-card/95 backdrop-blur-sm rounded-xl border border-border p-6 game-card-shadow"
            >
              {/* Question text */}
              <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-4 mb-5 text-center">
                <p className="text-lg md:text-4xl font-display font-bold text-foreground">
                  {q.text}
                </p>
              </div>

              {q.type === "choice" ? (
                /* Choice question (Q4) */
                <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                  {q.choices?.map((choice) => {
                    const isSelected = choices[currentQ] === choice;
                    const isCorrectChoice =
                      feedback === "correct" && choice === q.correctChoice;
                    const isWrongChoice =
                      feedback === "wrong" &&
                      isSelected &&
                      choice !== q.correctChoice;

                    return (
                      <button
                        key={choice}
                        onClick={() => {
                          if (submitted[currentQ] || feedback) return;
                          const newChoices = [...choices];
                          newChoices[currentQ] = choice;
                          setChoices(newChoices);
                        }}
                        disabled={!!submitted[currentQ]}
                        className={`p-5 rounded-xl border-2 font-display font-bold text-4xl transition-all ${
                          isCorrectChoice
                            ? "border-game-done bg-game-done/10 text-game-done scale-105"
                            : isWrongChoice
                              ? "border-destructive bg-destructive/10 text-destructive"
                              : isSelected
                                ? "border-primary bg-primary/10 text-primary scale-105"
                                : "border-border bg-card text-foreground hover:border-primary/50 hover:scale-102"
                        }`}
                      >
                        {choice}
                      </button>
                    );
                  })}
                </div>
              ) : (
                /* Drag-input question */
                <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-4">
                  {/* Left: Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`border-2 rounded-xl p-4 min-h-[200px] transition-all ${
                      feedback === "correct"
                        ? "border-game-done/50 bg-game-done/5"
                        : feedback === "wrong"
                          ? "border-destructive/50 bg-destructive/5"
                          : "border-primary/30 bg-primary/5"
                    }`}
                  >
                    <p className="text-3xl font-display font-semibold text-foreground/70 uppercase tracking-wide mb-3 text-center">
                      Drop Zone – Drag ones here
                    </p>

                    {q.requireGrouping && grouped ? (
                      /* Grouped display */
                      <div className="space-y-3">
                        {grouped.groups.map((group, gi) => (
                          <div key={gi} className="flex flex-col items-center">
                            <span className="text-2xl font-display font-semibold text-game-done mb-1">
                              {gi + 1} {gi + 1 > 1 ? "Tens" : "Ten"}
                            </span>
                            <div className="flex gap-1 flex-wrap justify-center p-2 bg-game-done/10 rounded-lg border border-game-done/30">
                              {group.map((ball) => (
                                <img
                                  src={blueBall}
                                  alt=""
                                  key={ball.id}
                                  initial={{ opacity: 0, scale: 0, y: -20 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 15,
                                  }}
                                  onClick={() => removeBall(ball.id)}
                                  className="w-7 h-7 md:w-12 md:h-12 rounded-full bg-blue-700 shadow-md cursor-pointer hover:scale-110 transition-transform"
                                  title="Click to remove"
                                />
                              ))}
                            </div>
                          </div>
                        ))}
                        {grouped.remainder.length > 0 && (
                          <div className="flex flex-col items-center">
                            <span className="text-2xl font-display font-semibold text-muted-foreground mb-1">
                              Remaining Ones
                            </span>
                            <div className="flex gap-1 flex-wrap justify-center p-2 bg-muted/20 rounded-lg border border-border">
                              {grouped.remainder.map((ball) => (
                                <img
                                  src={blueBall}
                                  alt=""
                                  key={ball.id}
                                  initial={{ opacity: 0, scale: 0, y: -20 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  transition={{
                                    type: "spring",
                                    stiffness: 400,
                                    damping: 15,
                                  }}
                                  onClick={() => removeBall(ball.id)}
                                  className="w-7 h-7 md:w-12 md:h-12 rounded-full bg-blue-700 shadow-md cursor-pointer hover:scale-110 transition-transform"
                                  title="Click to remove"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      /* Simple vertical stack */
                      <div className="flex flex-wrap gap-1.5 justify-center">
                        {currentBalls.map((ball) => (
                        
                          <img
                            src={blueBall}
                            alt=""
                            key={ball.id}
                            initial={{ opacity: 0, scale: 0, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 15,
                            }}
                            onClick={() => removeBall(ball.id)}
                            className="w-7 h-7 md:w-12 md:h-12 rounded-full bg-blue-700 shadow-md cursor-pointer hover:scale-110 transition-transform"
                            title="Click to remove"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Right: Ball Source */}
                  <div className="bg-accent/10 border-2 border-accent/30 rounded-xl p-3 flex flex-col items-center justify-center gap-3">
                    <p className="text-2xl font-display font-semibold text-foreground uppercase tracking-wide text-center">
                      'Ones' Source
                    </p>
                    <div>
                      <img
                        src={blueBall}
                        alt=""
                        draggable={!submitted[currentQ]}
                        onDragStart={handleDragStart}
                        // onClick={addBall}
                        onClick={() => {
                          addBall();
                          playSound(correctDragSound);
                        }}
                        className={`w-14 h-14 md:w-16 md:h-16 rounded-full bg-blue-700 shadow-lg flex items-center justify-center transition-all ${
                          submitted[currentQ]
                            ? "opacity-40 cursor-not-allowed"
                            : "cursor-pointer hover:scale-110 active:scale-95"
                        }`}
                      />
                    </div>
                    <p className="text-2xl font-display font-bold text-muted-foreground text-center">
                      Tap or drag
                    </p>
                  </div>
                </div>
              )}

              {/* Input box for drag-input questions */}
              {q.type === "drag-input" && (
                <div className="mt-4 max-w-4xl mx-auto">
                  <label className="text-4xl font-display font-semibold text-secondary block mb-1">
                    {q.inputLabel}
                  </label>
                  <input
                    type="string"
                    value={inputs[currentQ]}
                    onChange={(e) => {
                      if (submitted[currentQ]) return;
                      const newInputs = [...inputs];
                      newInputs[currentQ] = e.target.value;
                      setInputs(newInputs);
                    }}
                    disabled={!!submitted[currentQ]}
                    placeholder="Enter your answer"
                    className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-2xl ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-2xl font-display font-bold"
                  />
                </div>
              )}

              {/* Feedback */}
              {feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-2 rounded-xl text-4xl text-center font-display font-bold ${
                    feedback === "correct"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {feedback === "correct"
                    ? " Well done! Bravo."
                    : "❌ Try again."}
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation buttons */}
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
                    q.type === "choice"
                      ? !choices[currentQ]
                      : currentBalls.length === 0 || !inputs[currentQ].trim()
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

export default BuildAndBreakChallenge;
