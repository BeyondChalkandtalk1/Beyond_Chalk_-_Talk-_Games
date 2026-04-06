// ============================================================
// BharatQuizModal.tsx
// Drop this file next to BharatGamePlay.tsx and import it there.
// Usage (inside BharatGamePlay, after the completion modal):
//
//   import BharatQuizModal from "./BharatQuizModal";
//
//   {showQuiz && (
//     <BharatQuizModal
//       tableOf={tableOf}
//       onClose={() => setShowQuiz(false)}
//     />
//   )}
//
// Trigger it by replacing `setShowModal(true)` with `setShowQuiz(true)`
// (or show both sequentially — up to you).
// ============================================================

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Clock, ChevronRight } from "lucide-react";

// ─── helpers ────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function range(n: number) {
  return Array.from({ length: n }, (_, i) => i + 1);
}

/** An emoji that visually represents `count` objects */
function getEmoji(tableOf: number): string {
  const map: Record<number, string> = {
    1: "🍎", 2: "🚲", 3: "🐱", 4: "🌟", 5: "🖐",
    6: "🎲", 7: "🌈", 8: "🎱", 9: "🌸", 10: "🔟",
    11: "🦁", 12: "🍕",
  };
  return map[tableOf] ?? "⭐";
}

/** Render `count` emojis (max 20 to keep UI sane) */
function EmojiGrid({ count, emoji }: { count: number; emoji: string }) {
  const display = Math.min(count, 20);
  return (
    <div className="flex flex-wrap justify-center gap-1 my-2">
      {Array.from({ length: display }).map((_, i) => (
        <span key={i} className="text-3xl leading-none">{emoji}</span>
      ))}
      {count > 20 && (
        <span className="text-lg text-gray-400 self-center">…+{count - 20}</span>
      )}
    </div>
  );
}

// ─── question types ──────────────────────────────────────────

type QType = 1 | 2 | 3 | 4 | 5 | 6;

interface Question {
  type: QType;
  tableOf: number;
  multiplier: number;   // e.g. 7
  product: number;      // tableOf × multiplier
  options?: (string | number)[];
  answer: string | number | boolean;
  // type-3 variant
  missingSlot?: "left" | "right" | "product";
}

function buildQuestion(tableOf: number, multiplier: number, type: QType): Question {
  const product = tableOf * multiplier;
  const emoji = getEmoji(tableOf);

  // Wrong options pool
  const wrongs = () => {
    const pool = new Set<number>();
    while (pool.size < 3) {
      const delta = Math.floor(Math.random() * 4) + 1;
      const sign = Math.random() > 0.5 ? 1 : -1;
      const v = product + sign * delta * tableOf;
      if (v > 0 && v !== product) pool.add(v);
    }
    return [...pool];
  };

  switch (type) {
    case 1: {
      // Visual → what expression?
      const wrongExprs = shuffle(
        range(10)
          .filter((m) => m !== multiplier)
          .slice(0, 3)
          .map((m) => `${tableOf}×${m}`)
      );
      const options = shuffle([`${tableOf}×${multiplier}`, ...wrongExprs]);
      return { type, tableOf, multiplier, product, answer: `${tableOf}×${multiplier}`, options };
    }
    case 2: {
      // Expression → visual (pick the correct emoji count)
      const wrongCounts = shuffle(
        range(10)
          .filter((m) => m !== multiplier)
          .slice(0, 3)
          .map((m) => tableOf * m)
      );
      const options = shuffle([product, ...wrongCounts]);
      return { type, tableOf, multiplier, product, answer: product, options };
    }
    case 3: {
      // Missing number — three sub-variants
      const slots: ("left" | "right" | "product")[] = ["left", "right", "product"];
      const missingSlot = slots[Math.floor(Math.random() * slots.length)];
      let correctAnswer: number;
      let wrongAnswers: number[];
      if (missingSlot === "left") {
        correctAnswer = tableOf;
        wrongAnswers = shuffle(range(12).filter((n) => n !== tableOf)).slice(0, 3);
      } else if (missingSlot === "right") {
        correctAnswer = multiplier;
        wrongAnswers = shuffle(range(12).filter((n) => n !== multiplier)).slice(0, 3);
      } else {
        correctAnswer = product;
        wrongAnswers = wrongs();
      }
      const options = shuffle([correctAnswer, ...wrongAnswers]);
      return { type, tableOf, multiplier, product, answer: correctAnswer, options, missingSlot };
    }
    case 4: {
      // Repeated addition
      const correctAnswer = product;
      const options = shuffle([correctAnswer, ...wrongs()]);
      return { type, tableOf, multiplier, product, answer: correctAnswer, options };
    }
    case 5: {
      // Visual → expression (same as type 1 but framed differently)
      const wrongExprs = shuffle(
        range(10)
          .filter((m) => m !== multiplier)
          .slice(0, 3)
          .map((m) => `${tableOf}×${m}`)
      );
      const options = shuffle([`${tableOf}×${multiplier}`, ...wrongExprs]);
      return { type, tableOf, multiplier, product, answer: `${tableOf}×${multiplier}`, options };
    }
    case 6: {
      // True or False — sometimes show wrong equation
      const isTrue = Math.random() > 0.4;
      const shownProduct = isTrue
        ? product
        : product + (Math.random() > 0.5 ? tableOf : -tableOf);
      return {
        type, tableOf, multiplier,
        product: shownProduct,
        answer: isTrue,
        options: ["True", "False"],
      };
    }
  }
}

function generateQuiz(tableOf: number): Question[] {
  const multipliers = shuffle(range(10)).slice(0, 10);
  const types: QType[] = [1, 2, 3, 4, 5, 6];
  return multipliers.map((mult, i) => {
    const type = types[i % types.length] as QType;
    return buildQuestion(tableOf, mult, type);
  });
}

// ─── sub-components ─────────────────────────────────────────

function TimerRing({ seconds, total }: { seconds: number; total: number }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const progress = seconds / total;
  const color = seconds <= 5 ? "#ef4444" : seconds <= 10 ? "#f59e0b" : "#22c55e";
  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
        <circle cx="28" cy="28" r={r} fill="none" stroke="#e5e7eb" strokeWidth="4" />
        <circle
          cx="28" cy="28" r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - progress)}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
        />
      </svg>
      <span className="text-lg font-bold" style={{ color }}>{seconds}</span>
    </div>
  );
}

interface OptionButtonProps {
  label: string | number | boolean;
  display?: string;
  selected: boolean;
  correct: boolean | null; // null = unanswered
  disabled: boolean;
  onClick: () => void;
  emoji?: string;
}

function OptionButton({ label, display, selected, correct, disabled, onClick, emoji }: OptionButtonProps) {
  const text = display ?? String(label);
  let bg = "bg-white border-2 border-gray-200 hover:border-indigo-400 hover:bg-indigo-50";
  if (selected && correct === true) bg = "bg-green-100 border-2 border-green-500";
  if (selected && correct === false) bg = "bg-red-100 border-2 border-red-500";
  if (!selected && correct === true && disabled) bg = "bg-green-50 border-2 border-green-400";

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full rounded-2xl px-4 py-3 text-xl font-bold text-gray-800 transition-all duration-200 shadow-sm active:scale-95 ${bg} ${disabled ? "cursor-default" : "cursor-pointer"}`}
    >
      {emoji && label === correct && disabled ? (
        <EmojiGrid count={Number(label)} emoji={emoji} />
      ) : null}
      {text}
    </button>
  );
}

// ─── Question renderers ──────────────────────────────────────

function QuestionBody({ q }: { q: Question }) {
  const emoji = getEmoji(q.tableOf);
  switch (q.type) {
    case 1:
      return (
        <div className="text-center">
          <p className="text-lg text-gray-500 mb-1">👀 Look at the picture. What multiplication does this show?</p>
          <EmojiGrid count={q.product} emoji={emoji} />
          <p className="text-base text-gray-400 mt-1">
            ({q.multiplier} groups of {q.tableOf})
          </p>
        </div>
      );
    case 2:
      return (
        <div className="text-center">
          <p className="text-lg text-gray-500 mb-2">🖼 Which picture shows this expression?</p>
          <div className="text-5xl font-black text-indigo-700 my-3">
            {q.tableOf} × {q.multiplier}
          </div>
          <p className="text-base text-gray-400">Pick the option with the correct number of {emoji}</p>
        </div>
      );
    case 3: {
      const left = q.missingSlot === "left" ? "?" : q.tableOf;
      const right = q.missingSlot === "right" ? "?" : q.multiplier;
      const prod = q.missingSlot === "product" ? "?" : q.product;
      return (
        <div className="text-center">
          <p className="text-lg text-gray-500 mb-3">🔢 Fill in the missing number</p>
          <div className="text-5xl font-black text-indigo-700 my-3 tracking-wide">
            <span className={q.missingSlot === "left" ? "text-orange-500 underline underline-offset-4" : ""}>{left}</span>
            {" × "}
            <span className={q.missingSlot === "right" ? "text-orange-500 underline underline-offset-4" : ""}>{right}</span>
            {" = "}
            <span className={q.missingSlot === "product" ? "text-orange-500 underline underline-offset-4" : ""}>{prod}</span>
          </div>
        </div>
      );
    }
    case 4: {
      const addends = Array(q.multiplier).fill(q.tableOf).join(" + ");
      return (
        <div className="text-center">
          <p className="text-lg text-gray-500 mb-2">➕ Repeated Addition — what is the answer?</p>
          <div className="text-3xl font-black text-indigo-700 my-3 break-words leading-snug">
            {addends} = ?
          </div>
        </div>
      );
    }
    case 5:
      return (
        <div className="text-center">
          <p className="text-lg text-gray-500 mb-1">👁 What expression matches this picture?</p>
          <EmojiGrid count={q.product} emoji={emoji} />
          <p className="text-base text-gray-400 mt-1">
            There are {q.multiplier} rows of {q.tableOf} {emoji}
          </p>
        </div>
      );
    case 6:
      return (
        <div className="text-center">
          <p className="text-lg text-gray-500 mb-3">✅ True or False?</p>
          <div className="text-4xl font-black text-indigo-700 my-3">
            {q.tableOf} × {q.multiplier} = {q.product}
          </div>
        </div>
      );
  }
}

// ─── Main Modal ──────────────────────────────────────────────

interface BharatQuizModalProps {
  tableOf: number;
  onClose: () => void;
}

const QUESTION_TIME = 30;
const TRY_AGAIN_TIME = 10;

export default function BharatQuizModal({ tableOf, onClose }: BharatQuizModalProps) {
  const [questions] = useState(() => generateQuiz(tableOf));
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | number | boolean | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);
  const [isTryAgain, setIsTryAgain] = useState(false);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  const q = questions[qIndex];
  const emoji = getEmoji(tableOf);

  const goNext = useCallback(() => {
    setSelected(null);
    setIsCorrect(null);
    setIsTryAgain(false);
    if (qIndex + 1 >= questions.length) {
      setDone(true);
    } else {
      setQIndex((i) => i + 1);
      setTimeLeft(QUESTION_TIME);
    }
  }, [qIndex, questions.length]);

  const handleTimeout = useCallback(() => {
    if (selected === null) {
      // No answer — move on
      goNext();
    }
  }, [selected, goNext]);

  // Timer
  useEffect(() => {
    if (done || selected !== null) return;
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timerRef.current);
  }, [timeLeft, done, selected, handleTimeout]);

  const handleSelect = (option: string | number | boolean) => {
    if (selected !== null || done) return;
    clearTimeout(timerRef.current);
    setSelected(option);
    const correct = option === q.answer;
    setIsCorrect(correct);
    if (correct) {
      setScore((s) => s + 1);
      // Auto-advance after 1.5 s
      setTimeout(goNext, 1500);
    } else {
      // Try again mode
      setIsTryAgain(true);
    }
  };

  // Try-again timer (10 s)
  const [tryTime, setTryTime] = useState(TRY_AGAIN_TIME);
  useEffect(() => {
    if (!isTryAgain) { setTryTime(TRY_AGAIN_TIME); return; }
    if (tryTime <= 0) { goNext(); return; }
    const t = setTimeout(() => setTryTime((t) => t - 1), 1000);
    return () => clearTimeout(t);
  }, [isTryAgain, tryTime, goNext]);

  const handleTryAgain = () => {
    setSelected(null);
    setIsCorrect(null);
    setIsTryAgain(false);
    setTimeLeft(TRY_AGAIN_TIME);
  };

  // ── Results screen ───────────────────────────────────────
  if (done) {
    const pct = Math.round((score / questions.length) * 100);
    const trophy = pct >= 80 ? "🏆" : pct >= 50 ? "🥈" : "📚";
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center"
          >
            <div className="text-7xl mb-3">{trophy}</div>
            <h2 className="text-3xl font-black text-indigo-700 mb-1">Quiz Complete!</h2>
            <p className="text-gray-500 mb-6">Table of {tableOf}</p>
            <div className="bg-indigo-50 rounded-2xl p-5 mb-6">
              <p className="text-6xl font-black text-indigo-600">{score}/{questions.length}</p>
              <p className="text-indigo-400 font-semibold mt-1">{pct}% correct</p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-3 rounded-2xl bg-indigo-600 text-white font-bold text-xl hover:bg-indigo-700 transition"
            >
              Back to Menu
            </button>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
  }

  // ── Quiz screen ──────────────────────────────────────────
  const timerTotal = isTryAgain ? TRY_AGAIN_TIME : QUESTION_TIME;
  const timerVal = isTryAgain ? tryTime : timeLeft;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-3"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
        >
          {/* Header */}
          <div className="bg-indigo-600 px-5 pt-5 pb-4 flex items-center justify-between">
            <div>
              <p className="text-indigo-200 text-sm font-semibold tracking-wide uppercase">
                Question {qIndex + 1} / {questions.length}
              </p>
              <p className="text-white font-black text-lg">Table of {tableOf}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-indigo-200 text-xs">Score</p>
                <p className="text-white font-black text-xl">{score}</p>
              </div>
              <TimerRing seconds={timerVal} total={timerTotal} />
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-indigo-100">
            <motion.div
              className="h-full bg-indigo-500"
              animate={{ width: `${((qIndex) / questions.length) * 100}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* Body */}
          <AnimatePresence mode="wait">
            <motion.div
              key={qIndex}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="p-5 space-y-4"
            >
              {/* Question */}
              <div className="bg-indigo-50 rounded-2xl p-4 min-h-[120px] flex items-center justify-center">
                <QuestionBody q={q} />
              </div>

              {/* Wrong answer banner */}
              <AnimatePresence>
                {isCorrect === false && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-2.5"
                  >
                    <XCircle className="text-red-500 shrink-0" size={20} />
                    <p className="text-red-700 font-semibold text-sm flex-1">
                      Oops! The correct answer is <strong>{String(q.answer)}</strong>
                    </p>
                  </motion.div>
                )}
                {isCorrect === true && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5"
                  >
                    <CheckCircle className="text-green-500 shrink-0" size={20} />
                    <p className="text-green-700 font-semibold text-sm">Correct! Well done! 🎉</p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Options */}
              <div className="grid grid-cols-2 gap-3">
                {(q.options ?? []).map((opt, i) => {
                  const isSelected = selected === opt;
                  const showCorrect = selected !== null;
                  const isAnswerCorrect = opt === q.answer;
                  return (
                    <OptionButton
                      key={i}
                      label={opt}
                      display={
                        q.type === 2
                          ? `${emoji.repeat(Math.min(Number(opt), 5))}… (${opt})`
                          : String(opt)
                      }
                      selected={isSelected}
                      correct={showCorrect ? (isAnswerCorrect ? true : isSelected ? false : null) : null}
                      disabled={selected !== null && !isTryAgain}
                      onClick={() => handleSelect(opt)}
                    />
                  );
                })}
              </div>

              {/* Try Again / Skip row */}
              {isTryAgain && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <button
                    onClick={handleTryAgain}
                    className="flex-1 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg transition"
                  >
                    🔁 Try Again ({tryTime}s)
                  </button>
                  <button
                    onClick={goNext}
                    className="flex items-center gap-1 px-4 py-3 rounded-2xl border-2 border-gray-200 text-gray-500 hover:border-gray-400 font-semibold transition"
                  >
                    Skip <ChevronRight size={18} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}