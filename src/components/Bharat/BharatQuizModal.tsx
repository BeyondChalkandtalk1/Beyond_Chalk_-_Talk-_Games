import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── helpers ────────────────────────────────────────────────

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

function range(n: number) {
  return Array.from({ length: n }, (_, i) => i + 1);
}

function getEmoji(tableOf: number): string {
  const map: Record<number, string> = {
    1: "🍎",
    2: "🚲",
    3: "🐱",
    4: "🌟",
    5: "🖐",
    6: "🎲",
    7: "🌈",
    8: "🎱",
    9: "🌸",
    10: "🔟",
    11: "🦁",
    12: "🍕",
  };
  return map[tableOf] ?? "⭐";
}

function EmojiGrid({ count, emoji }: { count: number; emoji: string }) {
  const display = Math.min(count, 20);
  return (
    <div className="flex flex-wrap justify-center gap-1 my-2">
      {Array.from({ length: display }).map((_, i) => (
        <span key={i} className="text-3xl leading-none">
          {emoji}
        </span>
      ))}
      {count > 20 && (
        <span className="text-lg text-gray-400 self-center">
          …+{count - 20}
        </span>
      )}
    </div>
  );
}

// ─── question types ──────────────────────────────────────────

type QType = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

interface Question {
  type: QType;
  tableOf: number;
  multiplier: number;
  product: number;
  options?: (string | number)[];
  answer: string | number | boolean;
  missingSlot?: "left" | "right" | "product";
}

function buildQuestion(
  tableOf: number,
  multiplier: number,
  type: QType,
): Question {
  const product = tableOf * multiplier;

  const wrongs4 = (correct: number, step: number = tableOf) => {
    const pool = new Set<number>();
    while (pool.size < 3) {
      const delta = Math.floor(Math.random() * 3) + 1;
      const sign = Math.random() > 0.5 ? 1 : -1;
      const v = correct + sign * delta * step;
      if (v > 0 && v !== correct) pool.add(v);
    }
    return [...pool];
  };

  switch (type) {
    // Q1: Repeated addition → product
    case 1: {
      const addends = Array(multiplier).fill(tableOf).join(" + ");
      const correct = product;
      const options = shuffle([correct, ...wrongs4(correct)]);
      return { type, tableOf, multiplier, product, answer: correct, options };
    }

    // Q2: Correct statement for tableOf × multiplier
    case 2: {
      const correct = `${tableOf} times ${multiplier}`;
      const wrongs = [
        `${multiplier} times ${tableOf}`,
        `${tableOf} added ${multiplier} times`,
        `${multiplier} added ${tableOf} times`,
      ];
      const options = shuffle([correct, ...wrongs]);
      return { type, tableOf, multiplier, product, answer: correct, options };
    }

    // Q3: Emoji grid (rows × cols) → which expression?
    case 3: {
      const correct = `${tableOf} × ${multiplier}`;
      const alt = `${multiplier} × ${tableOf}`;
      const wrongs = [
        `${tableOf} + ${multiplier}`,
        `${multiplier} + ${multiplier}`,
      ];
      const options = shuffle([correct, alt, ...wrongs]);
      return { type, tableOf, multiplier, product, answer: correct, options };
    }

    // Q4: Fill missing number  tableOf × ___ = product
    case 4: {
      const correct = multiplier;
      const wrongNums = shuffle(
        range(12).filter((n) => n !== multiplier),
      ).slice(0, 3);
      const options = shuffle([correct, ...wrongNums]);
      return { type, tableOf, multiplier, product, answer: correct, options };
    }

    // Q5: Which of these are the same as tableOf × multiplier?
    case 5: {
      const addStr = Array(multiplier).fill(tableOf).join("+");
      const correct = `${tableOf}×${multiplier} and ${addStr}`;
      const wrongs = [
        `${tableOf}×${multiplier} and ${Array(tableOf).fill(multiplier).join("+")}`,
        `${tableOf}×${multiplier} and ${tableOf}+${multiplier}`,
        `${tableOf}×${multiplier} and ${multiplier}+${tableOf}`,
      ];
      const options = shuffle([correct, ...wrongs]);
      return { type, tableOf, multiplier, product, answer: correct, options };
    }

    // Q6: Which shows tableOf×multiplier but NOT multiplier×tableOf?
    case 6: {
      const addStr = Array(multiplier).fill(tableOf).join("+");
      const addStrRev = Array(tableOf).fill(multiplier).join("+");
      const correct = addStr; // tableOf added multiplier-times
      const wrongs = [
        addStrRev,
        String(product),
        `${multiplier} groups of ${tableOf}`,
      ];
      const options = shuffle([correct, ...wrongs]);
      return { type, tableOf, multiplier, product, answer: correct, options };
    }

    // Q7: Friend says tableOf×multiplier = tableOf+multiplier. Is she right?
    case 7: {
      return {
        type,
        tableOf,
        multiplier,
        product,
        answer: "No",
        options: ["Yes", "No"],
      };
    }

    // Q8: tableOf×multiplier and multiplier×tableOf mean same thing? (True/False)
    case 8: {
      return {
        type,
        tableOf,
        multiplier,
        product,
        answer: "True",
        options: ["True", "False"],
      };
    }

    // Q9: Complete  tableOf × multiplier = multiplier + ___
    case 9: {
      const correct =
        tableOf === 1
          ? 0
          : Array(multiplier - 1)
              .fill(tableOf)
              .reduce((a, b) => a + b, 0);
      // simpler: tableOf×multiplier = multiplier + (multiplier*(tableOf-1))
      // actually: tableOf×m = m+m+...  = m*(tableOf) so missing = m*(tableOf-1)
      const missing = multiplier * (tableOf - 1);
      const wrongMissing = shuffle(
        [missing + tableOf, missing - tableOf, missing + 1, missing * 2].filter(
          (v) => v >= 0 && v !== missing,
        ),
      ).slice(0, 3);
      const options = shuffle([missing, ...wrongMissing]);
      return {
        type,
        tableOf,
        multiplier,
        product,
        answer: missing,
        options,
      };
    }

    // Q10: Which one does NOT belong?
    case 10: {
      const addStr = Array(multiplier).fill(tableOf).join("+");
      // The odd one out: multiplier×tableOf (same value but different expression)
      // We mark tableOf+multiplier as the one that does NOT belong
      const doesNotBelong = `${tableOf}+${multiplier}`;
      const rest = [
        `${tableOf}×${multiplier}`,
        addStr,
        `${multiplier}×${tableOf}`,
      ];
      const options = shuffle([doesNotBelong, ...rest]);
      return {
        type,
        tableOf,
        multiplier,
        product,
        answer: doesNotBelong,
        options,
      };
    }
  }
}



function generateQuiz(tableOf: number): Question[] {
  const multipliers = shuffle(range(10)).slice(0, 10);
  const types: QType[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  return multipliers.map((mult, i) => {
    const type = types[i % types.length] as QType;
    return buildQuestion(tableOf, mult, type);
  });
}

// ─── Timer Ring ──────────────────────────────────────────────

function TimerRing({ seconds, total }: { seconds: number; total: number }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const progress = seconds / total;
  const color =
    seconds <= 5 ? "#ef4444" : seconds <= 10 ? "#f59e0b" : "#ffffff";
  return (
    <div className="relative w-14 h-14 flex items-center justify-center">
      <svg className="absolute inset-0 -rotate-90" viewBox="0 0 56 56">
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="4"
        />
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeDasharray={circ}
          strokeDashoffset={circ * (1 - progress)}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s" }}
        />
      </svg>
      <span className="text-lg font-bold" style={{ color }}>
        {seconds}
      </span>
    </div>
  );
}

// ─── Option Button ───────────────────────────────────────────

interface OptionButtonProps {
  label: string | number | boolean;
  display?: string;
  selected: boolean;
  correct: boolean | null;
  disabled: boolean;
  onClick: () => void;
  emoji?: string;
}

function OptionButton({
  label,
  display,
  selected,
  correct,
  disabled,
  onClick,
}: OptionButtonProps) {
  const text = display ?? String(label);
  let bg =
    "bg-white border-2 border-gray-200 hover:border-[#8F2424] hover:bg-red-50 text-gray-800";
  if (selected && correct === true)
    bg = "bg-green-100 border-2 border-green-500 text-gray-800";
  if (selected && correct === false)
    bg = "bg-red-100 border-2 border-red-500 text-gray-800";
  if (!selected && correct === true && disabled)
    bg = "bg-green-50 border-2 border-green-400 text-gray-800";

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full rounded-2xl px-4 py-3 text-xl font-bold transition-all duration-200 shadow-sm active:scale-95 ${bg} ${disabled ? "cursor-default" : "cursor-pointer"}`}
    >
      {text}
    </button>
  );
}

// ─── Question Body ───────────────────────────────────────────

// function QuestionBody({ q }: { q: Question }) {
//   const emoji = getEmoji(q.tableOf);
//   switch (q.type) {
//     case 1:
//       return (
//         <div className="text-center">
//           <p className="text-lg text-gray-600 mb-1 font-semibold">
//             Look at the picture. What multiplication does this show?
//           </p>
//           <EmojiGrid count={q.product} emoji={emoji} />
//           <p className="text-base text-gray-500 mt-1">
//             ({q.multiplier} groups of {q.tableOf})
//           </p>
//         </div>
//       );
//     case 2:
//       return (
//         <div className="text-center">
//           <p className="text-lg text-gray-600 mb-2 font-semibold">
//             Which picture shows this expression?
//           </p>
//           <div className="text-5xl font-black text-[#8F2424] my-3">
//             {q.tableOf} × {q.multiplier}
//           </div>
//           <p className="text-base text-gray-500">
//             Pick the option with the correct number of {emoji}
//           </p>
//         </div>
//       );
//     case 3: {
//       const left = q.missingSlot === "left" ? "?" : q.tableOf;
//       const right = q.missingSlot === "right" ? "?" : q.multiplier;
//       const prod = q.missingSlot === "product" ? "?" : q.product;
//       return (
//         <div className="text-center">
//           <p className="text-lg text-gray-600 mb-3 font-semibold">
//             Fill in the missing number
//           </p>
//           <div className="text-5xl font-black text-[#8F2424] my-3 tracking-wide">
//             <span
//               className={
//                 q.missingSlot === "left"
//                   ? "text-orange-500 underline underline-offset-4"
//                   : ""
//               }
//             >
//               {left}
//             </span>
//             {" × "}
//             <span
//               className={
//                 q.missingSlot === "right"
//                   ? "text-orange-500 underline underline-offset-4"
//                   : ""
//               }
//             >
//               {right}
//             </span>
//             {" = "}
//             <span
//               className={
//                 q.missingSlot === "product"
//                   ? "text-orange-500 underline underline-offset-4"
//                   : ""
//               }
//             >
//               {prod}
//             </span>
//           </div>
//         </div>
//       );
//     }
//     case 4: {
//       const addends = Array(q.multiplier).fill(q.tableOf).join(" + ");
//       return (
//         <div className="text-center">
//           <p className="text-lg text-gray-600 mb-2 font-semibold">
//             Repeated Addition — what is the answer?
//           </p>
//           <div className="text-3xl font-black text-[#8F2424] my-3 break-words leading-snug">
//             {addends} = ?
//           </div>
//         </div>
//       );
//     }
//     case 5:
//       return (
//         <div className="text-center">
//           <p className="text-lg text-gray-600 mb-1 font-semibold">
//             What expression matches this picture?
//           </p>
//           <EmojiGrid count={q.product} emoji={emoji} />
//           <p className="text-base text-gray-500 mt-1">
//             There are {q.multiplier} rows of {q.tableOf} {emoji}
//           </p>
//         </div>
//       );
//     case 6:
//       return (
//         <div className="text-center">
//           <p className="text-lg text-gray-600 mb-3 font-semibold">
//             True or False?
//           </p>
//           <div className="text-4xl font-black text-[#8F2424] my-3">
//             {q.tableOf} × {q.multiplier} = {q.product}
//           </div>
//         </div>
//       );
//   }
// }

function QuestionBody({ q }: { q: Question }) {
  const emoji = getEmoji(q.tableOf);

  switch (q.type) {
    // Q1: Repeated addition
    case 1: {
      const addends = Array(q.multiplier).fill(q.tableOf).join(" + ");
      return (
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-3 font-semibold">
            What is the answer?
          </p>
          <div className="text-3xl font-black text-[#8F2424] my-3 break-words leading-snug">
            {addends} = ?
          </div>
        </div>
      );
    }

    // Q2: Correct statement
    case 2: {
      return (
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2 font-semibold">
            What is the correct statement for this?
          </p>
          <div className="text-5xl font-black text-[#8F2424] my-3">
            {q.tableOf} × {q.multiplier}
          </div>
        </div>
      );
    }

    // Q3: Emoji grid → expression
    // Q3: Grid description → expression
    case 3: {
      return (
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-1 font-semibold">
            There are {q.multiplier} rows and {q.tableOf} columns of objects.
            What does this show?
          </p>
          <div className="text-4xl font-black text-[#8F2424] my-3">
            {q.multiplier} rows × {q.tableOf} columns
          </div>
        </div>
      );
    }

    // Q4: Fill missing number
    case 4: {
      return (
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-3 font-semibold">
            Fill in the missing number
          </p>
          <div className="text-5xl font-black text-[#8F2424] my-3 tracking-wide">
            {q.tableOf} ×{" "}
            <span className="text-orange-500 underline underline-offset-4">
              ____
            </span>{" "}
            = {q.product}
          </div>
        </div>
      );
    }

    // Q5: Which are same as tableOf × multiplier?
    case 5: {
      return (
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2 font-semibold">
            Which of these are the same as{" "}
            <span className="text-[#8F2424]">
              {q.tableOf} × {q.multiplier}
            </span>
            ?
          </p>
        </div>
      );
    }

    // Q6: Shows A×B but NOT B×A
    case 6: {
      return (
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2 font-semibold">
            Which shows{" "}
            <span className="text-[#8F2424]">
              {q.tableOf} × {q.multiplier}
            </span>{" "}
            but <span className="text-red-500">NOT</span>{" "}
            <span className="text-[#8F2424]">
              {q.multiplier} × {q.tableOf}
            </span>
            ?
          </p>
        </div>
      );
    }

    // Q7: Friend says wrong
    case 7: {
      return (
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-3 font-semibold">
            Your friend says{" "}
            <span className="text-[#8F2424] font-black">
              {q.tableOf} × {q.multiplier}
            </span>{" "}
            means{" "}
            <span className="text-[#8F2424] font-black">
              {q.tableOf} + {q.multiplier}
            </span>
            . Is she right?
          </p>
        </div>
      );
    }

    // Q8: True or False commutative
    case 8: {
      return (
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-3 font-semibold">
            True or False?
          </p>
          <div className="text-3xl font-black text-[#8F2424] my-3 leading-snug">
            {q.tableOf} × {q.multiplier} and {q.multiplier} × {q.tableOf} mean
            the same thing.
          </div>
        </div>
      );
    }

    // Q9: Complete the equation
    case 9: {
      const missing = q.multiplier * (q.tableOf - 1);
      return (
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-3 font-semibold">
            Complete the equation
          </p>
          <div className="text-4xl font-black text-[#8F2424] my-3 tracking-wide">
            {q.tableOf} × {q.multiplier} = {q.multiplier} +{" "}
            <span className="text-orange-500 underline underline-offset-4">
              ___
            </span>
          </div>
        </div>
      );
    }

    // Q10: Which does NOT belong?
    case 10: {
      return (
        <div className="text-center">
          <p className="text-lg text-gray-600 mb-2 font-semibold">
            Which one does <span className="text-red-500 font-black">NOT</span>{" "}
            belong?
          </p>
          <p className="text-sm text-gray-400">
            (All others equal {q.tableOf} × {q.multiplier} = {q.product})
          </p>
        </div>
      );
    }
  }
}

// ─── Score Messages ──────────────────────────────────────────

function getScoreMessage(
  score: number,
  total: number,
): { headline: string; sub: string } {
  const pct = (score / total) * 100;
  if (pct === 100)
    return {
      headline: "Outstanding! You’re a B.H.A.R.A.T Champion!",
      sub: "Absolutely brilliant! You've mastered every question. The Times Table is yours!",
    };
  if (pct >= 80)
    return {
      headline: "Outstanding! Almost Perfect!",
      sub: "You're very close to mastering this table. A little more practice and you'll ace it!",
    };
  if (pct >= 60)
    return {
      headline: "Great effort! Keep growing with B.H.A.R.A.T!",
      sub: "You've got a solid understanding. Revisit the steps you missed and try again!",
    };
  if (pct >= 40)
    return {
      headline: "Good try! Let’s explore and try again with B.H.A.R.A.T!",
      sub: "You're building your skills. Go through the B.H.A.R.A.T steps again and come back stronger!",
    };
  return {
    headline: "Keep Practising! You Can Do It!",
    sub: "Every champion starts somewhere. Revisit the Times Table and take the challenge again!",
  };
}

// ─── Main Modal ──────────────────────────────────────────────

interface BharatQuizModalProps {
  tableOf: number;
  onClose: () => void;
}

const QUESTION_TIME = 30;
const TRY_AGAIN_TIME = 10;

export default function BharatQuizModal({
  tableOf,
  onClose,
}: BharatQuizModalProps) {
  const [questions] = useState(() => generateQuiz(tableOf));
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | number | boolean | null>(
    null,
  );
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
    if (selected === null) goNext();
  }, [selected, goNext]);

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
      setTimeout(goNext, 1500);
    } else {
      setIsTryAgain(true);
    }
  };

  const [tryTime, setTryTime] = useState(TRY_AGAIN_TIME);
  useEffect(() => {
    if (!isTryAgain) {
      setTryTime(TRY_AGAIN_TIME);
      return;
    }
    if (tryTime <= 0) {
      goNext();
      return;
    }
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
    const { headline, sub } = getScoreMessage(score, questions.length);
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
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden"
          >
            {/* Yellow header */}
            <div className="bg-primary px-6 py-5 text-center">
              <h2 className="text-3xl font-black text-black">
                B.H.A.R.A.T Challenge Complete!
              </h2>
              <p className="text-black font-semibold mt-1 text-2xl">
                Times Table of {tableOf}
              </p>
            </div>

            {/* Score */}
            <div className="px-6 pt-5 pb-2 text-center">
              <div className="bg-[#8F2424]/10 rounded-2xl p-5 mb-4">
                <p className="text-6xl font-black text-[#8F2424]">
                  {score}/{questions.length}
                </p>
                <p className="text-[#8F2424] font-bold mt-1 text-2xl">{pct}% correct</p>
              </div>

              {/* Dynamic message */}
              <p className="text-black font-black text-xl mb-2 leading-snug">
                {headline}
              </p>
              {/* <p className="text-gray-600 text-base mb-6 leading-relaxed">
                {sub}
              </p> */}

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-[#8F2424] text-white font-black text-xl hover:bg-[#7a1f1f] transition"
              >
                Back to Menu
              </button>
            </div>
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
        className="fixed inset-0 z-999 flex items-center justify-center bg-black/70 px-3 pt-20"
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl overflow-hidden"
        >
          {/* Yellow Header */}
          <div className="bg-primary px-5 pt-5 pb-4 flex items-center justify-between">
            <div>
              <p className="text-black text-2xl font-black tracking-wide uppercase">
                B.H.A.R.A.T Challenge {qIndex + 1} / {questions.length}
              </p>
              <p className="text-[#8F2424] font-black text-2xl">
                Times Table of {tableOf}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-black text-xl font-semibold">Score</p>
                <p className="text-[#8F2424] font-black text-2xl">{score}</p>
              </div>
              <TimerRing seconds={timerVal} total={timerTotal} />
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-yellow-100">
            <motion.div
              className="h-full bg-[#8F2424]"
              animate={{ width: `${(qIndex / questions.length) * 100}%` }}
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
              {/* Question box */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 min-h-[120px] flex items-center justify-center">
                <QuestionBody q={q} />
              </div>

              {/* Feedback banner */}
              <AnimatePresence>
                {isCorrect === false && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-red-50 border border-red-200 rounded-xl px-4 py-2.5"
                  >
                    <p className="text-red-700 font-semibold text-xl">
                      Oops! The correct answer is{" "}
                      <strong>{String(q.answer)}</strong>
                    </p>
                  </motion.div>
                )}
                {isCorrect === true && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="bg-green-50 border border-green-200 rounded-xl px-4 py-2.5"
                  >
                    <p className="text-green-700 font-semibold text-xl">
                      Correct! Well done!
                    </p>
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
                          : q.type == 6
                            ? typeof opt === "boolean"
                              ? opt
                                ? "True"
                                : "False"
                              : String(opt)
                            : String(opt)
                      }
                      selected={isSelected}
                      correct={
                        showCorrect
                          ? isAnswerCorrect
                            ? true
                            : isSelected
                              ? false
                              : null
                          : null
                      }
                      disabled={selected !== null && !isTryAgain}
                      onClick={() => handleSelect(opt)}
                    />
                  );
                })}
              </div>

              {/* Try Again / Skip */}
              {isTryAgain && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <button
                    onClick={handleTryAgain}
                    className="flex-1 py-3 rounded-2xl bg-[#8F2424] hover:bg-[#7a1f1f] text-white font-bold text-lg transition"
                  >
                    Try Again ({tryTime}s)
                  </button>
                  <button
                    onClick={goNext}
                    className="flex items-center gap-1 px-4 py-3 rounded-2xl border-2 border-gray-200 text-gray-500 hover:border-gray-400 font-semibold transition"
                  >
                    Skip
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