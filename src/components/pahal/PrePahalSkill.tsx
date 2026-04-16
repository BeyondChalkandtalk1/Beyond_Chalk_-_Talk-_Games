import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  SkipBack,
  Play,
  Pause,
  Volume2,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Clock,
  Trophy,
  CheckCircle,
  XCircle,
} from "lucide-react";
import {
  handRepresentations,
  tenEqualsImage,
  getPrePahalQuestions,
  PracticeQuestion,
  DragOption,
} from "@/data/pahalGameData";
import DragCountQuestion from "./DragCountQuestion";
import bgVideo1 from "@/assets/pahal/bgVideo1.mp4"; // ✅ Doc1 ka original import
import tropyVideo from "@/assets/Level2CompleteVideo.mp4";

interface Props {
  onComplete: () => void;
}

type SubPhase = "representation" | "quiz" | "results";

// const QUESTION_TIME = 30;

const PrePahalSkill = ({ onComplete }: Props) => {
  const [subPhase, setSubPhase] = useState<SubPhase>("representation");

  // --- Representation state ---
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showOneTen, setShowOneTen] = useState(false);
  const [showTenEquals, setShowTenEquals] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);

  const totalItems = handRepresentations.length;
  const voiceGender = "male" as "male" | "female";

  // --- Quiz state ---
  const questions = useMemo(() => getPrePahalQuestions(), []);
  const totalQuestions = questions.length;
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answers, setAnswers] = useState<(string | null)[]>(
    Array(totalQuestions).fill(null),
  );
  // const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [elapsedTime, setElapsedTime] = useState(0);
  const quizStartTime = useRef(Date.now());
  const [showFeedback, setShowFeedback] = useState(false);
  const [droppedItem, setDroppedItem] = useState<DragOption | null>(null);
  const [selectedDragItem, setSelectedDragItem] = useState<DragOption | null>(
    null,
  );
  const startTime = useRef(Date.now());

  const speakText = useCallback(
    (text: string) => {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.lang = "en-IN";
      const voices = speechSynthesis.getVoices();
      if (voiceGender === "female") {
        const voice =
          voices.find(
            (v) =>
              v.lang.startsWith("en") &&
              v.name.toLowerCase().includes("female"),
          ) || voices.find((v) => v.lang.startsWith("en"));
        if (voice) utterance.voice = voice;
      } else {
        const voice =
          voices.find(
            (v) =>
              v.lang.startsWith("en") && v.name.toLowerCase().includes("male"),
          ) ||
          voices.find(
            (v) =>
              v.lang.startsWith("en") && v.name.toLowerCase().includes("man"),
          );
        if (voice) utterance.voice = voice;
      }
      speechSynthesis.speak(utterance);
    },
    [voiceGender],
  );

  // Auto-speak
  useEffect(() => {
    if (subPhase !== "representation") return;
    if (!showOneTen && !showTenEquals && !hasSpoken) {
      speakText(handRepresentations[currentIndex].speechText);
      setHasSpoken(true);
    }
  }, [currentIndex, showOneTen, showTenEquals, hasSpoken, speakText, subPhase]);

  // Auto-advance representation
  useEffect(() => {
    if (subPhase !== "representation" || isPaused) return;
    const timer = setTimeout(() => {
      if (showTenEquals) {
        // setSubPhase("quiz");
        // startTime.current = Date.now();
        setSubPhase("quiz");
        startTime.current = Date.now();
        quizStartTime.current = Date.now();
        return;
      }
      if (showOneTen) {
        setShowOneTen(false);
        setShowTenEquals(true);
        speakText("One Ten equals Ten Ones");
        return;
      }
      if (currentIndex < totalItems - 1) {
        setCurrentIndex((i) => i + 1);
        setHasSpoken(false);
      } else {
        setShowOneTen(true);
        speakText("One Ten");
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [
    currentIndex,
    isPaused,
    showOneTen,
    showTenEquals,
    totalItems,
    speakText,
    subPhase,
  ]);

  // Representation controls
  const handlePrevious = () => {
    if (showTenEquals) {
      setShowTenEquals(false);
      setShowOneTen(true);
      speakText("One Ten");
      return;
    }
    if (showOneTen) {
      setShowOneTen(false);
      return;
    }
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setHasSpoken(false);
    }
  };
  const handleRepeat = () => {
    setCurrentIndex(0);
    setShowOneTen(false);
    setShowTenEquals(false);
    setHasSpoken(false);
    setIsPaused(false);
  };
  const handleHearAgain = () => {
    if (showTenEquals) speakText("One Ten equals Ten Ones");
    else if (showOneTen) speakText("One Ten");
    else speakText(handRepresentations[currentIndex].speechText);
  };

  // --- Quiz logic ---
  const question = questions[currentQ];

  // useEffect(() => {
  //   if (subPhase !== "quiz" || showFeedback) return;
  //   if (timeLeft <= 0) {
  //     handleQuizNext();
  //     return;
  //   }
  //   const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
  //   return () => clearInterval(timer);
  // }, [timeLeft, subPhase, showFeedback]);

 useEffect(() => {
   if (subPhase !== "quiz") return;
   const timer = setInterval(() => {
     setElapsedTime(Math.round((Date.now() - quizStartTime.current) / 1000));
   }, 1000);
   return () => clearInterval(timer);
 }, [subPhase]);

  const handleSelect = (option: string) => {
    if (showFeedback) return;
    setSelectedAnswer(option);
    const newAnswers = [...answers];
    newAnswers[currentQ] = option;
    setAnswers(newAnswers);
    setShowFeedback(true);
  };

  // const handleQuizNext = useCallback(() => {
  //   if (currentQ < totalQuestions - 1) {
  //     setCurrentQ((q) => q + 1);
  //     setSelectedAnswer(null);
  //     setShowFeedback(false);
  //     setTimeLeft(QUESTION_TIME);
  //     setDroppedItem(null);
  //     setSelectedDragItem(null);
  //   } else {
  //     setSubPhase("results");
  //   }
  // }, [currentQ, totalQuestions]);

  const handleQuizNext = useCallback(() => {
    if (currentQ < totalQuestions - 1) {
      setCurrentQ((q) => q + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
      // REMOVE: setTimeLeft(QUESTION_TIME);
      setDroppedItem(null);
      setSelectedDragItem(null);
    } else {
      setSubPhase("results");
    }
  }, [currentQ, totalQuestions]);

  // const handleQuizPrevious = () => {
  //   if (currentQ > 0) {
  //     setCurrentQ((q) => q - 1);
  //     setSelectedAnswer(answers[currentQ - 1]);
  //     setShowFeedback(!!answers[currentQ - 1]);
  //     setTimeLeft(QUESTION_TIME);
  //   }
  // };
  const handleQuizPrevious = () => {
    if (currentQ > 0) {
      setCurrentQ((q) => q - 1);
      setSelectedAnswer(answers[currentQ - 1]);
      setShowFeedback(!!answers[currentQ - 1]);
      // REMOVE: setTimeLeft(QUESTION_TIME);
    }
  };

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

  const score = answers.reduce((acc, ans, i) => {
    if (ans && ans === questions[i]?.correctAnswer) return acc + 1;
    return acc;
  }, 0);

  const totalTimeSec = Math.round((Date.now() - startTime.current) / 1000);
  const totalTimeMin = Math.floor(totalTimeSec / 60);
  const totalTimeRemSec = totalTimeSec % 60;

  const current = handRepresentations[currentIndex];

  // const isCorrect =
  //   question?.type === "drag-count"
  //     ? selectedAnswer === String(question.correctCount)
  //     : question?.type === "drag-drop"
  //       ? selectedAnswer === question.correctDragLabel
  //       : selectedAnswer === question?.correctAnswer;

  const isCorrect =
    question?.type === "drag-count"
      ? selectedAnswer === question.correctAnswer // ✅ ab yeh match karega
      : question?.type === "drag-drop"
        ? selectedAnswer === question.correctDragLabel
        : selectedAnswer === question?.correctAnswer;

  return (
    <div className="relative min-h-[100vh] py-3">
      {/* ✅ Doc1 ka original bgVideo1 import use ho raha hai */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={bgVideo1} type="video/mp4" />
      </video>
      <div className="absolute inset-0" />

      <div className="relative z-10 space-y-6">
        {/* ===== REPRESENTATION PHASE ===== */}
        {subPhase === "representation" && (
          <>
            {/* ✅ Doc1 ka bada title style */}
            <div className="text-center">
              <h2 className="text-5xl md:text-5xl font-display font-bold text-secondary">
                Pre-PAHAL Skill
              </h2>
              <p className="text-primary text-2xl font-bold mt-1">
                Representation of numbers using hands
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <AnimatePresence mode="wait">
                {!showOneTen && !showTenEquals && (
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                    className="rounded-xl p-8 md:p-6 flex flex-col items-center"
                  >
                    <img
                      src={current.image}
                      alt={current.label}
                      className="w-40 h-40 md:w-56 md:h-56 object-contain"
                    />
                    <p className="text-3xl md:text-4xl font-display font-bold text-primary mt-6">
                      {current.label}
                    </p>
                  </motion.div>
                )}
                {showOneTen && (
                  <motion.div
                    key="one-ten"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl p-8 md:p-12 flex flex-col items-center"
                  >
                    <img
                      src={tenEqualsImage}
                      alt="1 Ten"
                      className="w-40 h-40 md:w-56 md:h-56 object-contain"
                    />
                    <p className="text-3xl md:text-4xl font-display font-bold text-primary mt-6">
                      1 Ten
                    </p>
                  </motion.div>
                )}
                {showTenEquals && (
                  <motion.div
                    key="ten-equals"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="rounded-xl p-8 md:p-12 game-card-shadow flex flex-col items-center"
                  >
                    <div className="flex items-center gap-6 flex-wrap justify-center">
                      <img
                        src={tenEqualsImage}
                        alt="1 Ten"
                        className="w-32 h-32 object-contain"
                      />
                      <p className="text-3xl md:text-4xl font-display font-bold text-primary">
                        1 Ten = 10 Ones
                      </p>
                      <img
                        src={handRepresentations[10].image}
                        alt="10 Ones"
                        className="w-32 h-32 object-contain"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ✅ Doc1 ke bade button fonts */}
              <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0 && !showOneTen && !showTenEquals}
                  className="flex items-center gap-2 px-5 py-1.5 rounded-xl bg-secondary text-secondary-foreground font-display font-bold text-2xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <SkipBack size={18} /> Previous
                </button>
                <button
                  onClick={() => setIsPaused((p) => !p)}
                  className="flex items-center gap-2 px-5 py-1.5 rounded-xl bg-primary text-primary-foreground font-display font-bold text-2xl hover:opacity-90 transition"
                >
                  {isPaused ? (
                    <>
                      <Play size={18} /> Play
                    </>
                  ) : (
                    <>
                      <Pause size={18} /> Pause
                    </>
                  )}
                </button>
                <button
                  onClick={handleHearAgain}
                  className="flex items-center gap-2 px-5 py-1.5 rounded-xl bg-accent text-accent-foreground font-display font-bold text-2xl hover:opacity-90 transition"
                >
                  <Volume2 size={18} /> Hear it again!
                </button>
                <button
                  onClick={handleRepeat}
                  className="flex items-center gap-2 px-5 py-1.5 rounded-xl bg-muted text-muted-foreground font-display font-bold text-2xl hover:opacity-90 transition"
                >
                  <RotateCcw size={18} /> Repeat
                </button>
              </div>
            </div>
          </>
        )}

        {/* ===== QUIZ PHASE ===== */}
        {subPhase === "quiz" && (
          <>
            <div className="text-center">
              <h2 className="text-5xl md:text-5xl font-display font-bold text-secondary">
                PAHAL Practice: Explore, Build, and Identify Numbers
              </h2>
              <p className="text-primary text-2xl font-bold mt-1">
                Get ready to play—drag, build, and identify the numbers.
              </p>
            </div>

            <div className="flex items-center justify-between max-w-2xl mx-auto px-4">
              <div className="text-lg font-display font-semibold text-foreground">
                PAHAL Challenge {currentQ + 1} / {totalQuestions}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-lg font-display font-semibold text-game-done">
                  Score: {score}
                </span>
                {/* <span
                  className={`flex items-center gap-1 text-lg font-display font-semibold ${timeLeft <= 5 ? "text-destructive animate-pulse" : "text-muted-foreground"}`}
                >
                  <Clock size={18} /> {timeLeft}s
                </span> */}
                <span className="flex items-center gap-1 text-lg font-display font-semibold text-muted-foreground">
                  <Clock size={18} />{" "}
                  {Math.floor(elapsedTime / 60) > 0
                    ? `${Math.floor(elapsedTime / 60)}m `
                    : ""}
                  {elapsedTime % 60}s
                </span>
              </div>
            </div>

            <div className="max-w-5xl mx-auto px-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQ}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                  className="bg-card/90 backdrop-blur-sm rounded-xl border border-border p-6 md:p-8 game-card-shadow"
                >
                  {question.type === "drag-count" &&
                  question.dragImage &&
                  question.correctCount !== undefined ? (
                    <DragCountQuestion
                      question={question.question}
                      dragImage={question.dragImage}
                      correctCount={question.correctCount}
                      gridSize={question.gridSize || 24}
                      validateAnswer={question.validateAnswer}
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
                      <p className="text-xl font-display font-bold text-maroon text-center mb-6">
                        {question.question}
                      </p>
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
                      <div className="flex justify-center gap-4 flex-wrap">
                        {question.dragOptions.map((item, idx) => {
                          const isThis = droppedItem?.label === item.label;
                          const isSelected =
                            selectedDragItem?.label === item.label;
                          let ringClass =
                            "border-border hover:border-primary/50 hover:scale-105 cursor-pointer";
                          if (showFeedback && isThis)
                            ringClass =
                              item.label === question.correctDragLabel
                                ? "border-game-done ring-2 ring-game-done scale-105"
                                : "border-destructive ring-2 ring-destructive scale-95";
                          else if (
                            showFeedback &&
                            item.label === question.correctDragLabel
                          )
                            ringClass =
                              "border-game-done ring-2 ring-game-done";
                          else if (showFeedback)
                            ringClass = "border-border opacity-40";
                          else if (isSelected)
                            ringClass =
                              "border-primary ring-2 ring-primary scale-105";
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
                      {question.handImages &&
                        question.handImages.length > 0 && (
                          <div className="flex justify-center gap-4 mb-6 flex-wrap">
                            {question.handImages.map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt={`Hand ${idx + 1}`}
                                className="w-28 h-28 md:w-36 md:h-36 object-contain"
                              />
                            ))}
                          </div>
                        )}
                      <p className="text-2xl font-display font-bold text-maroon text-center mb-6">
                        {question.question}
                      </p>
                      <div
                        className={`grid gap-3 text-3xl ${question.options.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}
                      >
                        {question.options.map((opt) => {
                          const isSelected = selectedAnswer === opt;
                          const isCorrectOpt = opt === question.correctAnswer;
                          let optClass =
                            "border-border bg-card text-foreground hover:border-primary/50 hover:scale-102";
                          if (showFeedback) {
                            if (isCorrectOpt)
                              optClass =
                                "border-green-500 bg-green-50 text-green-600 text-3xl scale-105";
                            else if (isSelected && !isCorrectOpt)
                              optClass =
                                "border-red-400 bg-red-50 text-red-500 text-3xl scale-95";
                            else
                              optClass =
                                "border-border bg-card text-muted-foreground text-3xl opacity-40";
                          } else if (isSelected)
                            optClass =
                              "border-primary bg-primary/10 text-primary text-3xl scale-105";
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
                                {showFeedback &&
                                  isSelected &&
                                  !isCorrectOpt && <XCircle size={20} />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}

                  {showFeedback && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`mt-4 p-3 rounded-lg text-center text-2xl font-display font-semibold ${
                        isCorrect
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {isCorrect ? "Well done!" : `❌ Incorrect! `}

                      {/* Try Again button - sirf wrong answer pe */}
                      {!isCorrect && (
                        <div className="mt-3">
                          <button
                            onClick={() => {
                              setSelectedAnswer(null);
                              setShowFeedback(false);
                              setShowFeedback(false);
                              setDroppedItem(null);
                              setSelectedDragItem(null);
                              // setTimeLeft(QUESTION_TIME);
                              // answers reset karo current question ke liye
                              const newAnswers = [...answers];
                              newAnswers[currentQ] = null;
                              setAnswers(newAnswers);
                            }}
                            className="px-6 py-2 bg-red-500 text-white rounded-xl font-display font-bold text-xl hover:bg-red-600 transition"
                          >
                            🔄 Try Again
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>

              <div className="flex items-center justify-between mt-6">
                <button
                  onClick={handleQuizPrevious}
                  disabled={currentQ === 0}
                  className="flex items-center gap-2 px-5 py-1.5 rounded-xl bg-secondary text-secondary-foreground font-display font-bold text-2xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={18} /> Previous
                </button>
                <button
                  onClick={handleQuizNext}
                  disabled={!showFeedback}
                  className="flex items-center gap-2 px-5 py-1.5 rounded-xl bg-primary text-primary-foreground font-display font-bold text-2xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {currentQ === totalQuestions - 1 ? "Finish" : "Next"}{" "}
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </>
        )}

        {/* ===== RESULTS PHASE ===== */}
        {subPhase === "results" && (
          <div className="max-w-2xl mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card/90 backdrop-blur-sm rounded-xl border border-border p-8 md:p-12 game-card-shadow text-center"
            >
              <Trophy className="w-16 h-16 text-game-done mx-auto mb-4" />
              <h2 className="text-3xl font-display font-bold text-primary mb-2">
                PAHAL Practice Challenge completed!
              </h2>
              <p className="text-xl font-display font-semibold text-foreground mb-2">
                Score: {score} / {totalQuestions}
              </p>
              <p className="text-muted-foreground font-body mb-6">
                Total Time: {totalTimeMin > 0 ? `${totalTimeMin}m ` : ""}
                {totalTimeRemSec}s
              </p>

              <div className="mb-6 rounded-xl overflow-hidden max-w-sm mx-auto">
                <video
                  src={tropyVideo}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full"
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
                      PC{i + 1}: {answers[i] || "No answer"}
                    </span>
                    <span>
                      {answers[i] === q.correctAnswer
                        ? "✓"
                        : `✗ (${q.correctAnswer})`}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={onComplete}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-display font-bold text-2xl hover:opacity-90 transition"
              >
                Back to Levels
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrePahalSkill;