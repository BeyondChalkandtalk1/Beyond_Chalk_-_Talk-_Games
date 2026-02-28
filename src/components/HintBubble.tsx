// import { useState, useEffect, useRef, useCallback } from "react";
// import { MONTH_HINTS } from "../data/calendarHints";

// interface HintBubbleProps {
//   /** Which month indices still need to be placed (unplaced months) */
//   unplacedMonths: number[];
//   /** Reset the inactivity timer (call on any user interaction) */
//   lastInteraction: number;
//   /** Inactivity delay in ms before showing hint (default 60000) */
//   delay?: number;
// }

// const MONTH_NAMES = [
//   "January","February","March","April","May","June",
//   "July","August","September","October","November","December"
// ];

// const MAX_HINTS = 3;

// const HintBubble = ({ unplacedMonths, lastInteraction, delay = 6000 }: HintBubbleProps) => {
//   const [visible, setVisible] = useState(false);
//   const [hintMonth, setHintMonth] = useState<number | null>(null);
//   const [selected, setSelected] = useState<number | null>(null);
//   const [answered, setAnswered] = useState(false);
//   // const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
//   const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
// const hintIndexRef = useRef(0); // Sequential hint tracker

//   // Pick a random unplaced month for the hint
//   // const pickHint = useCallback(() => {
//   //   if (unplacedMonths.length === 0) return;
//   //   const idx = unplacedMonths[Math.floor(Math.random() * unplacedMonths.length)];
//   //   setHintMonth(idx);
//   //   setSelected(null);
//   //   setAnswered(false);
//   //   setVisible(true);
//   // }, [unplacedMonths]);
//   const pickHint = useCallback(() => {
//     if (unplacedMonths.length === 0) return;

//     // MAX_HINTS tak hi hints dikhao
//     if (hintIndexRef.current >= MAX_HINTS) return;

//     // Sequence mein next unplaced month pick karo
//     const sequentialMonth =
//       unplacedMonths[hintIndexRef.current % unplacedMonths.length];
//     hintIndexRef.current += 1;

//     setHintMonth(sequentialMonth);
//     setSelected(null);
//     setAnswered(false);
//     setVisible(true);
//   }, [unplacedMonths]);

//   useEffect(() => {
//     if (timerRef.current) clearTimeout(timerRef.current);
//     setVisible(false);

//     if (unplacedMonths.length === 0) return;

//     timerRef.current = setTimeout(() => {
//       pickHint();
//     }, delay);

//     return () => {
//       if (timerRef.current) clearTimeout(timerRef.current);
//     };
//   }, [lastInteraction, unplacedMonths.length, delay, pickHint]);

//   if (!visible || hintMonth === null) return null;

//   const hint = MONTH_HINTS[hintMonth];

//   const handleSelect = (idx: number) => {
//     if (answered) return;
//     setSelected(idx);
//     setAnswered(true);
//   };

//   const dismiss = () => setVisible(false);

//   return (
//     <div
//       className="fixed inset-0 z-40 flex items-center justify-center p-4"
//       style={{ background: "rgba(0,0,0,0.4)" }}
//     >
//       <div
//         className="relative max-w-md w-full rounded-3xl overflow-hidden shadow-2xl animate-bounce-in"
//         style={{
//           background:
//             "linear-gradient(135deg, hsl(45 90% 96%), hsl(30 80% 95%))",
//           border: "3px solid hsl(45 80% 70%)",
//         }}
//       >
//         {/* Close button */}
//         <button
//           onClick={dismiss}
//           className="absolute top-3 right-3 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-all text-lg font-bold z-10"
//         >
//           ✕
//         </button>

//         {/* Decorative top */}
//         <div className="text-center pt-5 pb-2">
//           <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 shadow-lg mb-2 animate-pulse">
//             <span className="text-3xl">{hint.emoji}</span>
//           </div>
//           <div className="flex items-center justify-center gap-1 mb-1">
//             <span className="text-lg">💡</span>
//             <h3 className="font-display text-lg font-bold text-secondary">
//               Hint Time!
//             </h3>
//             <span className="text-lg">💡</span>
//           </div>
//           <p className="text-lg text-muted-foreground font-body px-4">
//             Looks like you need a little help – no problem! 🤗
//           </p>
//         </div>

//         {/* Clue card */}
//         <div
//           className="mx-4 mb-3 rounded-2xl p-3 text-center"
//           style={{
//             background: "hsl(45 70% 90%)",
//             border: "2px dashed hsl(45 60% 70%)",
//           }}
//         >
//           <p className="font-display font-bold text-xl text-foreground">
//             {hint.clue}
//           </p>
//         </div>

//         {/* Question */}
//         <div className="px-4 mb-2">
//           <p className="text-center text-lg font-display font-bold text-muted-foreground">
//             What month is this? 🤔
//           </p>
//         </div>

//         {/* Options */}
//         {/* <div className="grid grid-cols-2 gap-2 px-4 mb-3">
//           {hint.options.map((opt, idx) => {
//             const isCorrect = idx === hint.correct;
//             const isSelected = selected === idx;
//             let cls = "bg-card border-border hover:border-primary hover:scale-105";
//             if (answered) {
//               if (isCorrect) cls = "bg-green-100 border-green-500 scale-105";
//               else if (isSelected) cls = "bg-red-100 border-red-400 scale-95";
//               else cls = "bg-card border-border opacity-50";
//             }
//             return (
//               <button
//                 key={idx}
//                 onClick={() => handleSelect(idx)}
//                 className={`rounded-xl border-2 p-2.5 font-display font-bold text-sm text-foreground transition-all ${cls} ${!answered ? "cursor-pointer" : "cursor-default"}`}
//               >
//                 {opt}
//               </button>
//             );
//           })}
//         </div> */}

//         {/* Result */}
//         {/* {answered && (
//           <div className={`mx-4 mb-4 rounded-xl p-3 text-center text-xs font-body animate-fade-in ${
//             selected === hint.correct
//               ? "bg-green-50 text-green-700 border border-green-300"
//               : "bg-orange-50 text-orange-700 border border-orange-300"
//           }`}>
//             {selected === hint.correct ? (
//               <>✅ Sahi jawaab! Ab <strong>{MONTH_NAMES[hintMonth]}</strong> ki leaf dhundo aur lagao! 🎯</>
//             ) : (
//               <>💡 Sahi jawaab hai: <strong>{hint.options[hint.correct]}</strong>! Ab isko dhundo! 🔍</>
//             )}
//             <div className="text-[10px] mt-1 text-muted-foreground">{hint.funFact}</div>
//           </div>
//         )} */}

//         {/* Footer sparkles */}
//         <div className="flex justify-center gap-1 pb-4 text-lg">
//           <span className="animate-bounce" style={{ animationDelay: "0ms" }}>
//             ⭐
//           </span>
//           <span className="animate-bounce" style={{ animationDelay: "150ms" }}>
//             ✨
//           </span>
//           <span className="animate-bounce" style={{ animationDelay: "300ms" }}>
//             ⭐
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HintBubble;

import { useState, useEffect, useRef, useCallback } from "react";
import { MONTH_HINTS } from "../data/calendarHints";

interface HintBubbleProps {
  /** Which month indices still need to be placed (unplaced months) */
  unplacedMonths: number[];
  /** Reset the inactivity timer (call on any user interaction) */
  lastInteraction: number;
  /** Inactivity delay in ms before showing hint (default 60000) */
  delay?: number;
  /** If true: month-wise random hints. If false: only top 3 sequential hints */
  monthWiseHints?: boolean;
    maxHints?: number;           // ← naya
  customHints?: { emoji: string; clue: string }[];  // ← naya

}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MAX_HINTS = 3;

// ✅ Yahan se change karo: true = month-wise, false = top 3 sequential
const MONTH_WISE_HINTS = false;

const HintBubble = ({
  unplacedMonths,
  lastInteraction,
  delay = 6000,
  monthWiseHints = MONTH_WISE_HINTS,
  maxHints = 3, // ← default 3, level 2 mein 2 pass karenge
  customHints,
}: HintBubbleProps) => {
  const [visible, setVisible] = useState(false);
  const [hintMonth, setHintMonth] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const hintIndexRef = useRef(0);

  const pickHint = useCallback(() => {
    if (unplacedMonths.length === 0) return;

    if (monthWiseHints) {
      // Month-wise mode: random unplaced month se hint lo
      const idx =
        unplacedMonths[Math.floor(Math.random() * unplacedMonths.length)];
      setHintMonth(idx);
      setSelected(null);
      setAnswered(false);
      setVisible(true);
    } else {
      // Sequential mode: sirf top MAX_HINTS tak dikhao
      if (hintIndexRef.current >= maxHints) return;
       setCurrentHintIndex(hintIndexRef.current); 
    const sequentialMonth =
      unplacedMonths[hintIndexRef.current % unplacedMonths.length];
    hintIndexRef.current += 1;
      setHintMonth(sequentialMonth);
      setSelected(null);
      setAnswered(false);
      setVisible(true);
    }
  }, [unplacedMonths, monthWiseHints, maxHints]);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setVisible(false);

    if (unplacedMonths.length === 0) return;

    timerRef.current = setTimeout(() => {
      pickHint();
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [lastInteraction, unplacedMonths.length, delay, pickHint]);

  if (!visible || hintMonth === null) return null;

  // const hint = MONTH_HINTS[hintMonth];
  // const hint = customHints
  //   ? (customHints[hintIndexRef.current % customHints.length] ?? customHints[0])
  //   : MONTH_HINTS[hintMonth];

  const hint = customHints
    ? (customHints[currentHintIndex % customHints.length] ?? customHints[0])
    : MONTH_HINTS[hintMonth];

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
  };

  const dismiss = () => setVisible(false);

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.4)" }}
    >
      <div
        className="relative max-w-md w-full rounded-3xl overflow-hidden shadow-2xl animate-bounce-in"
        style={{
          background:
            "linear-gradient(135deg, hsl(45 90% 96%), hsl(30 80% 95%))",
          border: "3px solid hsl(45 80% 70%)",
        }}
      >
        {/* Close button */}
        <button
          onClick={dismiss}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:bg-destructive hover:text-destructive-foreground transition-all text-lg font-bold z-10"
        >
          ✕
        </button>

        {/* Decorative top */}
        <div className="text-center pt-5 pb-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 shadow-lg mb-2 animate-pulse">
            <span className="text-3xl">{hint.emoji}</span>
          </div>
          <div className="flex items-center justify-center gap-1 mb-1">
            <span className="text-lg">💡</span>
            <h3 className="font-display text-3xl font-bold text-secondary">
              Hint Time!
            </h3>
            <span className="text-lg">💡</span>
          </div>
          <p className="text-xl text-muted-foreground font-body px-4">
            Looks like you need a little help – no problem! 🤗
          </p>
        </div>

        {/* Clue card */}
        <div
          className="mx-4 mb-3 rounded-2xl p-3 text-center"
          style={{
            background: "hsl(45 70% 90%)",
            border: "2px dashed hsl(45 60% 70%)",
          }}
        >
          <p className="font-display font-bold text-xl text-foreground">
            {hint.clue}
          </p>
        </div>

        {/* Question */}
        <div className="px-4 mb-2">
          <p className="text-center text-lg font-display font-bold text-muted-foreground">
            What month is this? 🤔
          </p>
        </div>

        {/* Footer sparkles */}
        <div className="flex justify-center gap-1 pb-4 text-lg">
          <span className="animate-bounce" style={{ animationDelay: "0ms" }}>
            ⭐
          </span>
          <span className="animate-bounce" style={{ animationDelay: "150ms" }}>
            ✨
          </span>
          <span className="animate-bounce" style={{ animationDelay: "300ms" }}>
            ⭐
          </span>
        </div>
      </div>
    </div>
  );
};

export default HintBubble;