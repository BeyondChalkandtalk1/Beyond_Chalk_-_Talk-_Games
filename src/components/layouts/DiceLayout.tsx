// // // const DiceLayout = ({ slots, centerContent }) => {
// // //   return (
// // //     <div className="max-w-2xl mx-auto mb-8">
// // //       <div className="flex justify-center mb-4">
// // //         <div className="px-6 py-2 rounded-full bg-primary flex items-center justify-center">
// // //           {centerContent || (
// // //             <span className="text-primary-foreground font-display text-xl font-bold">
// // //               🎲 Dice Layout — 12 Months
// // //             </span>
// // //           )}
// // //         </div>
// // //       </div>

// // //       <div className="flex gap-4 justify-center flex-wrap">
// // //         <div
// // //           className="bg-card border-4 border-border rounded-3xl p-4 inline-grid grid-cols-2 grid-rows-3 gap-3"
// // //           style={{ boxShadow: "var(--shadow-card)" }}
// // //         >
// // //           {slots.slice(0, 6).map((slot, i) => (
// // //             <div key={i} className="flex items-center justify-center">
// // //               {slot}
// // //             </div>
// // //           ))}
// // //         </div>

// // //         <div
// // //           className="bg-card border-4 border-border rounded-3xl p-4 inline-grid grid-cols-2 grid-rows-3 gap-3"
// // //           style={{ boxShadow: "var(--shadow-card)" }}
// // //         >
// // //           {slots.slice(6, 12).map((slot, i) => (
// // //             <div key={i + 6} className="flex items-center justify-center">
// // //               {slot}
// // //             </div>
// // //           ))}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default DiceLayout;

// // const DieFace = ({ number }: { number: number }) => {
// //   // Har face ke liye dot positions define karo
// //   const pipLayouts: Record<number, { top: string; left: string }[]> = {
// //     1: [{ top: "50%", left: "50%" }],
// //     2: [
// //       { top: "25%", left: "25%" },
// //       { top: "75%", left: "75%" },
// //     ],
// //     3: [
// //       { top: "25%", left: "25%" },
// //       { top: "50%", left: "50%" },
// //       { top: "75%", left: "75%" },
// //     ],
// //     4: [
// //       { top: "25%", left: "25%" },
// //       { top: "25%", left: "75%" },
// //       { top: "75%", left: "25%" },
// //       { top: "75%", left: "75%" },
// //     ],
// //     5: [
// //       { top: "25%", left: "25%" },
// //       { top: "25%", left: "75%" },
// //       { top: "50%", left: "50%" },
// //       { top: "75%", left: "25%" },
// //       { top: "75%", left: "75%" },
// //     ],
// //     6: [
// //       { top: "22%", left: "28%" },
// //       { top: "22%", left: "72%" },
// //       { top: "50%", left: "28%" },
// //       { top: "50%", left: "72%" },
// //       { top: "78%", left: "28%" },
// //       { top: "78%", left: "72%" },
// //     ],
// //   };

// //   const pips = pipLayouts[number] || [];

// //   return (
// //     <div
// //       className="relative rounded-xl border-2 border-border bg-white shadow-md"
// //       style={{ width: 44, height: 44 }}
// //     >
// //       {pips.map((pos, i) => (
// //         <div
// //           key={i}
// //           className="absolute rounded-full bg-gray-800"
// //           style={{
// //             width: 8,
// //             height: 8,
// //             top: pos.top,
// //             left: pos.left,
// //             transform: "translate(-50%, -50%)",
// //           }}
// //         />
// //       ))}
// //     </div>
// //   );
// // };

// // const DiceLayout = ({ slots, centerContent }) => {
// //   return (
// //     <div className="max-w-2xl mx-auto mb-8">
// //       <div className="flex justify-center mb-4">
// //         <div className="px-6 py-2 rounded-full bg-primary flex items-center justify-center">
// //           {centerContent || (
// //             <span className="text-primary-foreground font-display text-xl font-bold">
// //               🎲 Dice Layout — 12 Months
// //             </span>
// //           )}
// //         </div>
// //       </div>

// //       <div className="flex gap-4 justify-center flex-wrap">
// //         {/* Dice 1 — months 1-6 */}
// //         <div
// //           className="bg-card border-4 border-border rounded-3xl p-4 inline-grid grid-cols-2 grid-rows-3 gap-3"
// //           style={{ boxShadow: "var(--shadow-card)" }}
// //         >
// //           {slots.slice(0, 6).map((slot, i) => (
// //             <div
// //               key={i}
// //               className="flex flex-col items-center justify-center gap-1"
// //             >
// //               <DieFace number={i + 1} />
// //               {slot}
// //             </div>
// //           ))}
// //         </div>

// //         {/* Dice 2 — months 7-12 */}
// //         <div
// //           className="bg-card border-4 border-border rounded-3xl p-4 inline-grid grid-cols-2 grid-rows-3 gap-3"
// //           style={{ boxShadow: "var(--shadow-card)" }}
// //         >
// //           {slots.slice(6, 12).map((slot, i) => (
// //             <div
// //               key={i + 6}
// //               className="flex flex-col items-center justify-center gap-1"
// //             >
// //               <DieFace number={i + 1} />
// //               {slot}
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default DiceLayout;

// const DieFace = ({ number, size = 44 }) => {
//   const pipLayouts = {
//     1: [{ top: "50%", left: "50%" }],
//     2: [
//       { top: "25%", left: "25%" },
//       { top: "75%", left: "75%" },
//     ],
//     3: [
//       { top: "25%", left: "25%" },
//       { top: "50%", left: "50%" },
//       { top: "75%", left: "75%" },
//     ],
//     4: [
//       { top: "25%", left: "25%" },
//       { top: "25%", left: "75%" },
//       { top: "75%", left: "25%" },
//       { top: "75%", left: "75%" },
//     ],
//     5: [
//       { top: "25%", left: "25%" },
//       { top: "25%", left: "75%" },
//       { top: "50%", left: "50%" },
//       { top: "75%", left: "25%" },
//       { top: "75%", left: "75%" },
//     ],
//     6: [
//       { top: "22%", left: "28%" },
//       { top: "22%", left: "72%" },
//       { top: "50%", left: "28%" },
//       { top: "50%", left: "72%" },
//       { top: "78%", left: "28%" },
//       { top: "78%", left: "72%" },
//     ],
//   };

//   const pips = pipLayouts[number] || [];
//   const dotSize = Math.round(size * 0.18);

//   return (
//     <div
//       className="relative rounded-xl border-2 border-border bg-white shadow-md"
//       style={{ width: size, height: size, flexShrink: 0 }}
//     >
//       {pips.map((pos, i) => (
//         <div
//           key={i}
//           className="absolute rounded-full bg-gray-800"
//           style={{
//             width: dotSize,
//             height: dotSize,
//             top: pos.top,
//             left: pos.left,
//             transform: "translate(-50%, -50%)",
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// /**
//  * MonthDiceFace — month number ko dice dots se dikhata hai
//  * Month 1–6  → ek DieFace
//  * Month 7–12 → DieFace(6) + DieFace(remainder) side by side
//  */
// const MonthDiceFace = ({ month }) => {
//   if (month <= 6) {
//     return <DieFace number={month} size={44} />;
//   }

//   const remainder = month - 6; // 1–6
//   return (
//     <div className="flex items-center gap-1">
//       <DieFace number={6} size={36} />
//       <span className="text-xs text-muted-foreground font-bold">+</span>
//       <DieFace number={remainder} size={36} />
//     </div>
//   );
// };

// const DiceLayout = ({ slots, centerContent }) => {
//   return (
//     <div className="max-w-2xl mx-auto mb-8">
//       <div className="flex justify-center mb-4">
//         <div className="px-6 py-2 rounded-full bg-primary flex items-center justify-center">
//           {centerContent || (
//             <span className="text-primary-foreground font-display text-xl font-bold">
//               🎲 Dice Layout — 12 Months
//             </span>
//           )}
//         </div>
//       </div>

//       <div className="flex gap-4 justify-center flex-wrap">
//         {/* Dice 1 — months 1-6 */}
//         <div
//           className="bg-card border-4 border-border rounded-3xl p-4 inline-grid grid-cols-2 grid-rows-3 gap-3"
//           style={{ boxShadow: "var(--shadow-card)" }}
//         >
//           {slots.slice(0, 6).map((slot, i) => (
//             <div
//               key={i}
//               className="flex flex-col items-center justify-center gap-1"
//             >
//               {/* Position indicator die */}
//               <DieFace number={i + 1} />

//               {/* Droppable slot area — default me month ke dice dots dikhata hai */}
//               <div className="flex items-center justify-center min-w-[80px] min-h-[44px]">
//                 {slot ? slot : <MonthDiceFace month={i + 1} />}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Dice 2 — months 7-12 */}
//         <div
//           className="bg-card border-4 border-border rounded-3xl p-4 inline-grid grid-cols-2 grid-rows-3 gap-3"
//           style={{ boxShadow: "var(--shadow-card)" }}
//         >
//           {slots.slice(6, 12).map((slot, i) => (
//             <div
//               key={i + 6}
//               className="flex flex-col items-center justify-center gap-1"
//             >
//               {/* Position indicator die */}
//               <DieFace number={i + 1} />

//               {/* Droppable slot area — month 7–12 ke dice dots */}
//               <div className="flex items-center justify-center min-w-[80px] min-h-[44px]">
//                 {slot ? slot : <MonthDiceFace month={i + 7} />}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DiceLayout;

// --------------------------------------------------------------------------
// const MONTHS = [
//   "Jan",
//   "Feb",
//   "Mar",
//   "Apr",
//   "May",
//   "Jun",
//   "Jul",
//   "Aug",
//   "Sep",
//   "Oct",
//   "Nov",
//   "Dec",
// ];

// // ─── Single die face (1–6 dots) ───────────────────────────────────────────────
// const DieFace = ({ number, size = 44 }) => {
//   const pipLayouts = {
//     1: [{ top: "50%", left: "50%" }],
//     2: [
//       { top: "25%", left: "25%" },
//       { top: "75%", left: "75%" },
//     ],
//     3: [
//       { top: "25%", left: "25%" },
//       { top: "50%", left: "50%" },
//       { top: "75%", left: "75%" },
//     ],
//     4: [
//       { top: "25%", left: "25%" },
//       { top: "25%", left: "75%" },
//       { top: "75%", left: "25%" },
//       { top: "75%", left: "75%" },
//     ],
//     5: [
//       { top: "25%", left: "25%" },
//       { top: "25%", left: "75%" },
//       { top: "50%", left: "50%" },
//       { top: "75%", left: "25%" },
//       { top: "75%", left: "75%" },
//     ],
//     6: [
//       { top: "22%", left: "28%" },
//       { top: "22%", left: "72%" },
//       { top: "50%", left: "28%" },
//       { top: "50%", left: "72%" },
//       { top: "78%", left: "28%" },
//       { top: "78%", left: "72%" },
//     ],
//   };

//   const pips = pipLayouts[number] || [];
//   const dotSize = Math.round(size * 0.18);

//   return (
//     <div
//       className="relative rounded-xl border-2 border-border bg-white shadow-md"
//       style={{ width: size, height: size, flexShrink: 0 }}
//     >
//       {pips.map((pos, i) => (
//         <div
//           key={i}
//           className="absolute rounded-full bg-gray-800"
//           style={{
//             width: dotSize,
//             height: dotSize,
//             top: pos.top,
//             left: pos.left,
//             transform: "translate(-50%, -50%)",
//           }}
//         />
//       ))}
//     </div>
//   );
// };

// // ─── Month number → dice dots ─────────────────────────────────────────────────
// // Month 1–6  : ek die
// // Month 7–12 : do die side by side (6 + remainder)
// const MonthDots = ({ month }) => {
//   if (month <= 6) {
//     return <DieFace number={month} size={40} />;
//   }
//   return (
//     <div className="flex items-center gap-1">
//       <DieFace number={6} size={32} />
//       <DieFace number={month - 6} size={32} />
//     </div>
//   );
// };

// // ─── Month card — top die (position) + bottom box (dots + name) ──────────────
// const MonthCard = ({ positionFace, monthIndex, slot }) => {
//   return (
//     <div className="flex flex-col items-center gap-1">
//       {/* Top: small die showing position within this dice (1–6) */}
//       <DieFace number={positionFace} size={44} />

//       {/* Bottom box: month dots + month name — replaces the old "7 Jul" text */}
//       <div
//         className="flex flex-col items-center justify-center gap-1 rounded-xl border-2 border-border bg-white shadow-sm px-2 py-2"
//         style={{ minWidth: 64, minHeight: 64 }}
//       >
//         <MonthDots month={monthIndex + 1} />
//         <span className="text-xs font-semibold" style={{ color: "#b45309" }}>
//           {MONTHS[monthIndex]}
//         </span>
//         {slot}
//       </div>
//     </div>
//   );
// };

// // ─── Main layout ──────────────────────────────────────────────────────────────
// const DiceLayout = ({ slots = [], centerContent }) => {
//   return (
//     <div className="max-w-2xl mx-auto mb-8">
//       <div className="flex justify-center mb-4">
//         <div className="px-6 py-2 rounded-full bg-primary flex items-center justify-center">
//           {centerContent || (
//             <span className="text-primary-foreground font-display text-xl font-bold">
//               🎲 Dice Layout — 12 Months
//             </span>
//           )}
//         </div>
//       </div>

//       <div className="flex gap-4 justify-center flex-wrap">
//         {/* Big Die 1 — months 1–6 */}
//         <div
//           className="bg-card border-4 border-border rounded-3xl p-4 inline-grid grid-cols-2 grid-rows-3 gap-3"
//           style={{ boxShadow: "var(--shadow-card)" }}
//         >
//           {Array.from({ length: 6 }).map((_, i) => (
//             <MonthCard
//               key={i}
//               positionFace={i + 1}
//               monthIndex={i}
//               slot={slots[i]}
//             />
//           ))}
//         </div>

//         {/* Big Die 2 — months 7–12 */}
//         <div
//           className="bg-card border-4 border-border rounded-3xl p-4 inline-grid grid-cols-2 grid-rows-3 gap-3"
//           style={{ boxShadow: "var(--shadow-card)" }}
//         >
//           {Array.from({ length: 6 }).map((_, i) => (
//             <MonthCard
//               key={i + 6}
//               positionFace={i + 1}
//               monthIndex={i + 6}
//               slot={slots[i + 6]}
//             />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DiceLayout;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DieFace = ({ number, size = 44 }) => {
  const pipLayouts = {
    1: [{ top: "50%", left: "50%" }],
    2: [
      { top: "25%", left: "25%" },
      { top: "75%", left: "75%" },
    ],
    3: [
      { top: "25%", left: "25%" },
      { top: "50%", left: "50%" },
      { top: "75%", left: "75%" },
    ],
    4: [
      { top: "25%", left: "25%" },
      { top: "25%", left: "75%" },
      { top: "75%", left: "25%" },
      { top: "75%", left: "75%" },
    ],
    5: [
      { top: "25%", left: "25%" },
      { top: "25%", left: "75%" },
      { top: "50%", left: "50%" },
      { top: "75%", left: "25%" },
      { top: "75%", left: "75%" },
    ],
    6: [
      { top: "22%", left: "28%" },
      { top: "22%", left: "72%" },
      { top: "50%", left: "28%" },
      { top: "50%", left: "72%" },
      { top: "78%", left: "28%" },
      { top: "78%", left: "72%" },
    ],
  };
  const pips = pipLayouts[number] || [];
  const dotSize = Math.round(size * 0.18);
  return (
    <div
      className="relative rounded-xl border-2 border-border bg-white shadow-md"
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      {pips.map((pos, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gray-800"
          style={{
            width: dotSize,
            height: dotSize,
            top: pos.top,
            left: pos.left,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
};

const MonthDots = ({ month }) => {
  if (month <= 6) return <DieFace number={month} size={60} />;
  return (
    <div className="flex items-center gap-1">
      <DieFace number={6} size={60} />
      <DieFace number={month - 6} size={60} />
    </div>
  );
};

// slotConfig = { isPlaced, result, isShaking, placedMonth, onDragOver, onDrop, onClick }
const MonthCard = ({ positionFace, monthIndex, slotConfig = {} }) => {
  const {
    isPlaced,
    result,
    isShaking,
    placedMonth,
    onDragOver,
    onDrop,
    onClick,
  } = slotConfig;

  let cardBg =
    "bg-card border-border hover:border-primary hover:scale-[1.03] hover:shadow-lg";
  if (isPlaced) {
    cardBg =
      result === "correct"
        ? "bg-green-100 border-green-500 scale-[1.03]"
        : "bg-red-100 border-red-500";
  }

  return (
    <div
      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 cursor-pointer transition-all duration-200 select-none ${cardBg} ${isShaking ? "animate-shake" : ""}`}
      style={{ boxShadow: "var(--shadow-card)", minWidth: 80 }}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
    >
      {/* Position die */}
      {/* <DieFace number={positionFace} size={40} /> */}

      {/* Content: placed month OR month dots + name */}
      <div className="flex flex-col items-center gap-1">
        {isPlaced && placedMonth ? (
          <>
            <span className="text-2xl">{placedMonth.emoji}</span>
            <span className="text-xs font-display font-bold text-foreground">
              {placedMonth.short}
            </span>
          </>
        ) : (
          <>
            <MonthDots month={monthIndex + 1} />
            <span
              className="text-lg font-semibold"
              style={{ color: "#b45309" }}
            >
              {MONTHS[monthIndex]}
            </span>
          </>
        )}
      </div>
    </div>
  );
};

// Props: slotConfigs (array of 12 config objects), centerContent
const DiceLayout = ({ slotConfigs = [], centerContent }) => {
  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="flex justify-center mb-4">
        {/* <div className="px-6 py-2 rounded-full bg-primary flex items-center justify-center">
          {centerContent || (
            <span className="text-primary-foreground font-display text-xl font-bold">
              🎲 Dice Layout — 12 Months
            </span>
          )}
        </div> */}
      </div>

      <div className="flex gap-4 justify-center flex-wrap">
        {/* Die 1 — months 1–6 */}
        <div
          className="bg-card border-4 border-border rounded-3xl p-4 inline-grid grid-cols-2 grid-rows-3 gap-3"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <MonthCard
              key={i}
              positionFace={i + 1}
              monthIndex={i}
              slotConfig={slotConfigs[i]}
            />
          ))}
        </div>

        {/* Die 2 — months 7–12 */}
        <div
          className="bg-card border-4 border-border rounded-3xl p-4 inline-grid grid-cols-2 grid-rows-3 gap-3"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <MonthCard
              key={i + 6}
              positionFace={i + 1}
              monthIndex={i + 6}
              slotConfig={slotConfigs[i + 6]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiceLayout;