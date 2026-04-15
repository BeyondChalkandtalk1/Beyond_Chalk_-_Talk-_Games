import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Trophy,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  getPrePahalQuestions,
  PracticeQuestion,
  DragOption,
} from "@/data/pahalGameData";
import DragCountQuestion from "./DragCountQuestion";
import bgVideo1 from "@/assets/pahal/bgVideo1.mp4";
import TensAndOnesIntro from "./TensAndOnesIntro";
import BuildAndBreakChallenge from "./BuildAndBreakChallenge";
import HTOIntro from "./HTOIntro";

export type PlaceValueCategory = 'tens-ones' | 'hto' | 'thto';

interface Props {
  onBack: () => void;
  category?: PlaceValueCategory;
  onPlayAgain: () => void;
}

interface Props {
  onBack: () => void;
}

const QUESTION_TIME = 30;
const TOTAL_QUESTIONS = 10;

const PahalPractice = ({
  onBack,
  category = "tens-ones",
  onPlayAgain,
}: Props) => {
  const [phase, setPhase] = useState<"intro" | "challenge" | "quiz">(
    category === "tens-ones" || category === "hto" ? "intro" : "quiz",
  );
  const questions = useMemo(() => getPrePahalQuestions(), []);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<(string | null)[]>(
    Array(TOTAL_QUESTIONS).fill(null),
  );
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [isFinished, setIsFinished] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [droppedItem, setDroppedItem] = useState<DragOption | null>(null);
  const [selectedDragItem, setSelectedDragItem] = useState<DragOption | null>(
    null,
  );
  const startTime = useRef(Date.now());

  const question = questions[currentQ];

  // Timer countdown
  useEffect(() => {
    if (isFinished || showFeedback) return;
    if (timeLeft <= 0) {
      // Time up, mark as no answer and move on
      handleNext();
      return;
    }
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished, showFeedback]);

  const handleSelect = (option: string) => {
    if (showFeedback) return; // prevent re-selection
    setSelectedAnswer(option);
    const newAnswers = [...answers];
    newAnswers[currentQ] = option;
    setAnswers(newAnswers);
    setShowFeedback(true);
  };

  const handleNext = useCallback(() => {
    if (currentQ < TOTAL_QUESTIONS - 1) {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      setTimeLeft(QUESTION_TIME);
      setDroppedItem(null);
      setSelectedDragItem(null);
    } else {
      setIsFinished(true);
    }
  }, [currentQ]);

  const handleSelectDragItem = (item: DragOption) => {
    if (showFeedback) return;
    setSelectedDragItem(item);
  };

  const handleDropZoneClick = () => {
    if (showFeedback || !selectedDragItem) return;
    setDroppedItem(selectedDragItem);
    const newAnswers = [...answers];
    newAnswers[currentQ] = selectedDragItem.label;
    setAnswers(newAnswers);
    setSelectedAnswer(selectedDragItem.label);
    setShowFeedback(true);
    setSelectedDragItem(null);
  };

  const handlePrevious = () => {
    if (currentQ > 0) {
      setCurrentQ((q) => q - 1);
      setSelectedAnswer(answers[currentQ - 1]);
      setShowFeedback(!!answers[currentQ - 1]);
      setTimeLeft(QUESTION_TIME);
    }
  };

  const score = answers.reduce((acc, ans, i) => {
    if (ans && ans === questions[i]?.correctAnswer) return acc + 1;
    return acc;
  }, 0);

  const totalTimeSec = Math.round((Date.now() - startTime.current) / 1000);
  const totalTimeMin = Math.floor(totalTimeSec / 60);
  const totalTimeRemSec = totalTimeSec % 60;

  // if (phase === "intro") {
  //   return (
  //     <>
        // <div className="text-center mt-5">
        //   <h2 className="text-2xl md:text-5xl font-display font-bold text-secondary">
        //     Level 1
        //   </h2>
        //   <p className="text-muted-foreground font-bold text-2xl mt-1">
        //     {category === "tens-ones"
        //       ? "Place Value – Tens and Ones"
        //       : category === "hto"
        //         ? "Place Value – Hundreds, Tens, and Ones"
        //         : "Place Value – Thousands, Hundreds, Tens, and Ones"}
        //   </p>
        // </div>
  //       {/* <TensAndOnesIntro
  //           onStartQuiz={() => {
  //             setPhase("challenge");
  //             startTime.current = Date.now();
  //           }}
  //         /> */}
  //       <TensAndOnesIntro
  //         onStartQuiz={() => {
  //           setPhase("challenge");
  //         }}
  //       />
  //       ;
  //     </>
  //   );
  // }

    if (phase === "intro") {
      if (category === "hto") {
        return (
          <>
            <div className="text-center mt-5">
              <h2 className="text-2xl md:text-5xl font-display font-bold text-secondary">
                Level 1
              </h2>
              <p className="text-muted-foreground font-bold text-2xl mt-1">
                {category === "tens-ones"
                  ? "Place Value – Tens and Ones"
                  : category === "hto"
                    ? "Place Value – Hundreds, Tens, and Ones"
                    : "Place Value – Thousands, Hundreds, Tens, and Ones"}
              </p>
            </div>
            <HTOIntro
              onStartQuiz={() => {
                setPhase("challenge");
              }}
            />
          </>
        );
      }
      return (
        <>
          <div className="text-center mt-5">
            <h2 className="text-2xl md:text-5xl font-display font-bold text-secondary">
              Level 1
            </h2>
            <p className="text-muted-foreground font-bold text-2xl mt-1">
              {category === "tens-ones"
                ? "Place Value – Tens and Ones"
                : category === "hto"
                  ? "Place Value – Hundreds, Tens, and Ones"
                  : "Place Value – Thousands, Hundreds, Tens, and Ones"}
            </p>
          </div>
          <TensAndOnesIntro
            onStartQuiz={() => {
              setPhase("challenge");
            }}
          />
        </>
      );
    }

  if (phase === "challenge") {
    return (
      <BuildAndBreakChallenge
        onComplete={() => {
          setPhase("quiz");
          startTime.current = Date.now();
        }}
        onBack={onBack}
        onPlayAgain={onPlayAgain}
      />
    );
  }

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-card rounded-xl border border-border p-8 md:p-12 game-card-shadow text-center"
        >
          <Trophy className="w-16 h-16 text-game-done mx-auto mb-4" />
          <h2 className="text-3xl font-display font-bold text-primary mb-2">
            Level 1 Complete!
          </h2>
          <p className="text-xl font-display font-semibold text-foreground mb-2">
            Score: {score} / {TOTAL_QUESTIONS}
          </p>
          <p className="text-muted-foreground font-body mb-6">
            Total Time: {totalTimeMin > 0 ? `${totalTimeMin}m ` : ""}
            {totalTimeRemSec}s
          </p>

          {/* Celebration video */}
          <div className="mb-6 rounded-xl overflow-hidden max-w-sm mx-auto">
            <video
              src={bgVideo1}
              autoPlay
              loop
              muted
              playsInline
              className="w-full"
              poster=""
            />
          </div>

          <div className="space-y-2 text-left max-w-md mx-auto mb-6">
            {questions.map((q, i) => (
              <div
                key={i}
                className={`px-4 py-2 rounded-lg text-sm font-body flex justify-between ${
                  answers[i] === q.correctAnswer
                    ? "bg-game-done/10 text-game-done"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                <span>
                  Q{i + 1}: {answers[i] || "No answer"}
                </span>
                <span>
                  {answers[i] === q.correctAnswer
                    ? "✓"
                    : `✗ (${q.correctAnswer})`}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={onBack}
              className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-display font-semibold hover:opacity-90 transition"
            >
              Go Home
            </button>
            <button
              onClick={onBack}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-display font-semibold hover:opacity-90 transition"
            >
              Go to Next Level →
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // const isCorrect =
  //   question.type === "drag-count"
  //     ? selectedAnswer === String(question.correctCount)
  //     : question.type === "drag-drop"
  //       ? selectedAnswer === question.correctDragLabel
  //       : selectedAnswer === question.correctAnswer;
  const isCorrect =
    question?.type === "drag-count"
      ? selectedAnswer === question.correctAnswer // ✅ ab yeh match karega
      : question?.type === "drag-drop"
        ? selectedAnswer === question.correctDragLabel
        : selectedAnswer === question?.correctAnswer;

  return (
    <div className="relative min-h-[100vh]">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={bgVideo1} type="video/mp4" />
      </video>
      <div className="absolute inset-0 z-0" />

      <div className="relative z-10 space-y-6 p-4 md:p-6">
        <div className="text-center">
          <h2 className="text-5xl md:text-5xl font-display font-bold text-secondary">
            PAHAL Practice
          </h2>
          <p className="text-primary text-4xl font-bold mt-1">
            Explore, Build, and Identify Numbers
          </p>
        </div>

        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">
            Level 1
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            {category === "tens-ones"
              ? "Place Value – Tens and Ones"
              : category === "hto"
                ? "Place Value – Hundreds, Tens, and Ones"
                : "Place Value – Thousands, Hundreds, Tens, and Ones"}
          </p>
        </div>

        {/* Score & Timer bar */}
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="text-2xl font-display font-bold text-foreground">
            Question {currentQ + 1} / {TOTAL_QUESTIONS}
          </div>
          <div className="flex items-center gap-4">
            <span className="text-2xl font-display font-bold text-game-done">
              Score: {score}
            </span>
            <span
              className={`flex items-center gap-1 text-2xl font-display font-bold ${
                timeLeft <= 5
                  ? "text-destructive animate-pulse"
                  : "text-muted-foreground"
              }`}
            >
              <Clock size={16} /> {timeLeft}s
            </span>
          </div>
        </div>

        {/* Timer progress */}
        <div className="max-w-2xl mx-auto">
          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: "100%" }}
              animate={{ width: `${(timeLeft / QUESTION_TIME) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className=" rounded-xl  p-6 md:p-8 "
            >
              {/* Drag-count question type (grid-based) */}
              {/* {question.type === "drag-count" &&
              question.dragImage &&
              question.correctCount ? ( */}
              {question.type === "drag-count" &&
              question.dragImage &&
              question.correctCount !== undefined ? (
                <DragCountQuestion
                  question={question.question}
                  dragImage={question.dragImage}
                  correctCount={question.correctCount}
                  gridSize={question.gridSize || 24}
                  validateAnswer={question.validateAnswer}
                  // onAnswer={(correct, answer) => {
                  //   const newAnswers = [...answers];
                  //   newAnswers[currentQ] = answer;
                  //   setAnswers(newAnswers);
                  //   setSelectedAnswer(answer);
                  //   setShowFeedback(true);
                  // }}
                  onAnswer={(correct, answer) => {
                    const newAnswers = [...answers];
                    // ✅ correct answer tab hi set karo jab actually correct ho
                    newAnswers[currentQ] = correct
                      ? question.correctAnswer
                      : answer;
                    setAnswers(newAnswers);
                    setSelectedAnswer(
                      correct ? question.correctAnswer : answer,
                    );
                    setShowFeedback(true);
                  }}
                  showFeedback={showFeedback}
                />
              ) : question.type === "drag-drop" && question.dragOptions ? (
                <>
                  <p className="text-4xl font-display font-bold text-foreground text-center mb-6">
                    {question.question}
                  </p>

                  {/* Drop zone */}
                  <div className="flex justify-center mb-6">
                    <div
                      onClick={handleDropZoneClick}
                      className={`w-36 h-36 md:w-44 md:h-44 rounded-xl border-3 border-dashed flex items-center justify-center transition-all ${
                        droppedItem
                          ? showFeedback &&
                            droppedItem.label === question.correctDragLabel
                            ? "border-game-done bg-game-done/10"
                            : showFeedback
                              ? "border-destructive bg-destructive/10"
                              : "border-primary bg-primary/10"
                          : selectedDragItem
                            ? "border-primary bg-primary/5 cursor-pointer animate-pulse"
                            : "border-muted-foreground/40 bg-muted/30"
                      }`}
                    >
                      {droppedItem ? (
                        <img
                          src={droppedItem.image}
                          alt={droppedItem.label}
                          className="w-28 h-28 md:w-36 md:h-36 object-contain"
                        />
                      ) : selectedDragItem ? (
                        <span className="text-primary font-display text-sm font-semibold">
                          Tap to place
                        </span>
                      ) : (
                        <span className="text-muted-foreground font-display text-sm">
                          Drop here
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Draggable hand images */}
                  <div className="flex justify-center gap-4 flex-wrap">
                    {question.dragOptions.map((item, idx) => {
                      const isThis = droppedItem?.label === item.label;
                      const isSelected = selectedDragItem?.label === item.label;
                      let ringClass =
                        "border-border hover:border-primary/50 hover:scale-105 cursor-pointer";
                      if (showFeedback && isThis) {
                        ringClass =
                          item.label === question.correctDragLabel
                            ? "border-game-done ring-2 ring-game-done scale-105"
                            : "border-destructive ring-2 ring-destructive scale-95";
                      } else if (
                        showFeedback &&
                        item.label === question.correctDragLabel
                      ) {
                        ringClass = "border-game-done ring-2 ring-game-done";
                      } else if (showFeedback) {
                        ringClass = "border-border opacity-40";
                      } else if (isSelected) {
                        ringClass =
                          "border-primary ring-2 ring-primary scale-105";
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectDragItem(item)}
                          disabled={showFeedback}
                          className={`p-2 rounded-xl border-2 transition-all ${ringClass}`}
                        >
                          <img
                            src={item.image}
                            alt={item.label}
                            className="w-24 h-24 md:w-28 md:h-28 object-contain"
                          />
                          <p className="text-xs font-display font-semibold text-muted-foreground mt-1">
                            {item.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  {/* MCQ / fill-blank */}
                  {question.handImages && question.handImages.length > 0 && (
                    <div className="flex justify-center gap-4 mb-6 flex-wrap">
                      {question.handImages.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`Hand representation ${idx + 1}`}
                          className="w-28 h-28 md:w-36 md:h-36 object-contain"
                        />
                      ))}
                    </div>
                  )}

                  <p className="font-display font-bold text-primary  text-3xl text-center mb-6">
                    {question.question}
                  </p>

                  <div
                    className={`grid gap-3 ${question.options.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}
                  >
                    {question.options.map((opt) => {
                      const isSelected = selectedAnswer === opt;
                      const isCorrectOpt = opt === question.correctAnswer;
                      let optClass =
                        "border-border text-4xl  hover:border-primary/50 hover:scale-102";

                      if (showFeedback) {
                        if (isCorrectOpt) {
                          optClass =
                            "border-game-done bg-game-done/10 text-4xl  scale-105";
                        } else if (isSelected && !isCorrectOpt) {
                          optClass =
                            "border-destructive bg-destructive/10 text-4xl  text-destructive scale-95";
                        } else {
                          optClass =
                            "border-border bg-card text-muted-foreground text-4xl  opacity-50";
                        }
                      } else if (isSelected) {
                        optClass =
                          "border-primary bg-primary/10 text-primary text-4xl  scale-105";
                      }

                      return (
                        <button
                          key={opt}
                          onClick={() => handleSelect(opt)}
                          disabled={showFeedback}
                          className={`p-4 rounded-xl border-2 font-display font-semibold text-lg transition-all ${optClass}`}
                        >
                          <span className="flex items-center justify-center gap-2">
                            {opt}
                            {showFeedback && isCorrectOpt && (
                              <CheckCircle size={20} />
                            )}
                            {showFeedback && isSelected && !isCorrectOpt && (
                              <XCircle size={20} />
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {/* Feedback message */}
              {/* {showFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-3 rounded-lg text-center text-2xl font-display font-bold ${
                    isCorrect
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {isCorrect
                    ? "Well done!"
                    : `❌ Wrong! Correct answer: ${question.correctAnswer}`}
                </motion.div>
              )} */}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6">
            <button
              onClick={handlePrevious}
              disabled={currentQ === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-display font-semibold text-sm hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={18} /> Previous
            </button>
            <button
              onClick={handleNext}
              disabled={!showFeedback}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {currentQ === TOTAL_QUESTIONS - 1 ? "Finish" : "Next"}{" "}
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PahalPractice;
