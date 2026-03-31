import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ChevronLeft, Volume2 } from "lucide-react";
import {
  generateStepData,
  STEP_LABELS,
  getMultiplicationForm,
} from "@/data/bharatGameData";
import BharatStepContent from "../Bharat/BharatStepContent";

interface Props {
  tableOf: number;
  level: 1 | 2;
  onBack: () => void;
}

const BharatGamePlay = ({ tableOf, level, onBack }: Props) => {
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [currentStep, setCurrentStep] = useState(0); // 0-5 for the 6 steps
  const [completedEntries, setCompletedEntries] = useState<number[]>([]);

  const stepData = generateStepData(tableOf, currentMultiplier);
  const totalSteps = 6;
  const maxMultiplier = level === 1 ? 5 : 10;
  // const maxMultiplier = level === 1 ? 10 : 10;

  const handleNextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      // Completed all steps for this multiplier
      if (!completedEntries.includes(currentMultiplier)) {
        setCompletedEntries((prev) => [...prev, currentMultiplier]);
      }
      if (currentMultiplier < maxMultiplier) {
        setCurrentMultiplier((m) => m + 1);
        setCurrentStep(0);
      }
    }
  }, [currentStep, currentMultiplier, maxMultiplier, completedEntries]);

  const handlePrevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    } else if (currentMultiplier > 1) {
      setCurrentMultiplier((m) => m - 1);
      setCurrentStep(totalSteps - 1);
    }
  }, [currentStep, currentMultiplier]);

  const speakText = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.lang = "en-IN";
    speechSynthesis.speak(utterance);
  }, []);

  const isComplete =
    completedEntries.includes(currentMultiplier) &&
    currentStep === totalSteps - 1 &&
    currentMultiplier === maxMultiplier;

  return (
    <div className="space-y-4">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition font-body text-sm"
        >
          <ChevronLeft size={18} /> Back to Tables
        </button>
        <h2 className="text-xl md:text-2xl font-display font-bold text-primary">
          Table of {tableOf} — Level {level}
        </h2>
        <div className="text-sm text-muted-foreground font-body">
          {currentMultiplier} of {maxMultiplier}
        </div>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1">
        {Array.from({ length: maxMultiplier }, (_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-colors ${
              completedEntries.includes(i + 1)
                ? "bg-game-done"
                : i + 1 === currentMultiplier
                  ? "bg-game-active"
                  : "bg-muted"
            }`}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Step indicators */}
          <div className="flex gap-1 overflow-x-auto pb-2">
            {STEP_LABELS.map((label, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`px-3 py-1.5 rounded-lg text-xs font-body font-medium whitespace-nowrap transition-all ${
                  i === currentStep
                    ? "bg-primary text-primary-foreground step-glow"
                    : i < currentStep
                      ? "bg-game-done/20 text-game-done"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {i + 1}. {label}
              </button>
            ))}
          </div>

          {/* Step content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentMultiplier}-${currentStep}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="bg-card rounded-xl border border-border p-6 md:p-8 min-h-[300px] game-card-shadow"
            >
              <BharatStepContent
                stepIndex={currentStep}
                stepData={stepData}
                tableOf={tableOf}
                multipliedBy={currentMultiplier}
                onSpeak={speakText}
              />
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={handlePrevStep}
              disabled={currentStep === 0 && currentMultiplier === 1}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-muted text-foreground font-body text-sm font-medium hover:bg-muted/80 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              <ArrowLeft size={16} /> Previous
            </button>
            <button
              // onClick={handleNextStep}
              disabled={isComplete}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-primary-foreground font-body text-sm font-medium hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              {currentStep === totalSteps - 1
                ? currentMultiplier === maxMultiplier
                  ? "✅ Complete!"
                  : "Next Number →"
                : "Next Step"}{" "}
              {currentStep < totalSteps - 1 && <ArrowRight size={16} />}
            </button>
          </div>
        </div>

        {/* Summary panel */}
        <div className="bg-card rounded-xl border border-border p-5 game-card-shadow">
          <h3 className="font-display font-bold text-lg text-primary mb-4">
            📋 Times Table Summary
          </h3>
          <div className="space-y-2">
            {Array.from({ length: maxMultiplier }, (_, i) => {
              const mult = i + 1;
              const isCompleted = completedEntries.includes(mult);
              const isCurrent = mult === currentMultiplier;
              return (
                <motion.div
                  key={mult}
                  initial={isCompleted ? { scale: 0.9 } : {}}
                  animate={isCompleted ? { scale: 1 } : {}}
                  className={`px-3 py-2 rounded-lg text-sm font-body transition-all ${
                    isCompleted
                      ? "bg-game-done/10 text-game-done font-semibold"
                      : isCurrent
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-muted-foreground"
                  }`}
                >
                  {isCompleted || isCurrent
                    ? getMultiplicationForm(tableOf, mult)
                    : `${tableOf} × ${mult} = ?`}
                  {isCompleted && " ✅"}
                </motion.div>
              );
            })}
          </div>

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-game-done/10 rounded-xl text-center"
            >
              <p className="text-2xl mb-1">🎉</p>
              <p className="font-display font-bold text-game-done">
                Table of {tableOf} Complete!
              </p>
              <button
                onClick={onBack}
                className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body font-medium hover:opacity-90 transition"
              >
                Try Another Table
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BharatGamePlay;



// ------------------
// import { useState, useCallback, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronLeft } from "lucide-react";
// import {
//   generateStepData,
//   STEP_LABELS,
//   getMultiplicationForm,
// } from "@/data/bharatGameData";
// import BharatStepContent from "./BharatStepContent";

// interface Props {
//   tableOf: number;
//   level: 1 | 2;
//   onBack: () => void;
// }

// const BharatGamePlay = ({ tableOf, level, onBack }: Props) => {
//   const [currentMultiplier, setCurrentMultiplier] = useState(1);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [completedEntries, setCompletedEntries] = useState<number[]>([]);

//   const stepData = generateStepData(tableOf, currentMultiplier);
//   const totalSteps = 6;
//   const maxMultiplier = level === 1 ? 5 : 10;

//   const isComplete =
//     completedEntries.includes(currentMultiplier) &&
//     currentStep === totalSteps - 1 &&
//     currentMultiplier === maxMultiplier;

//   // Auto-advance every 5 seconds
//   useEffect(() => {
//     if (isComplete) return;
//     const timer = setTimeout(() => {
//       if (currentStep < totalSteps - 1) {
//         setCurrentStep((s) => s + 1);
//       } else {
//         if (!completedEntries.includes(currentMultiplier)) {
//           setCompletedEntries((prev) => [...prev, currentMultiplier]);
//         }
//         if (currentMultiplier < maxMultiplier) {
//           setCurrentMultiplier((m) => m + 1);
//           setCurrentStep(0);
//         }
//       }
//     }, 5000);
//     return () => clearTimeout(timer);
//   }, [
//     currentStep,
//     currentMultiplier,
//     maxMultiplier,
//     completedEntries,
//     isComplete,
//   ]);

//   const speakText = useCallback((text: string) => {
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.rate = 0.8;
//     utterance.lang = "en-IN";
//     speechSynthesis.speak(utterance);
//   }, []);

//   return (
//     <div className="space-y-4">
//       {/* Top bar */}
//       <div className="flex items-center justify-between">
//         <button
//           onClick={onBack}
//           className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition font-body text-sm"
//         >
//           <ChevronLeft size={18} /> Back to Tables
//         </button>
//         <h2 className="text-xl md:text-2xl font-display font-bold text-primary">
//           Table of {tableOf} — Level {level}
//         </h2>
//         <div className="text-sm text-muted-foreground font-body">
//           {currentMultiplier} of {maxMultiplier}
//         </div>
//       </div>

//       {/* Progress bar */}
//       <div className="flex gap-1">
//         {Array.from({ length: maxMultiplier }, (_, i) => (
//           <div
//             key={i}
//             className={`h-2 flex-1 rounded-full transition-colors ${
//               completedEntries.includes(i + 1)
//                 ? "bg-game-done"
//                 : i + 1 === currentMultiplier
//                   ? "bg-game-active"
//                   : "bg-muted"
//             }`}
//           />
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Main area */}
//         <div className="lg:col-span-2 space-y-4">
//           {/* Step content */}
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={`${currentMultiplier}-${currentStep}`}
//               initial={{ opacity: 0, x: 30 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -30 }}
//               transition={{ duration: 0.25 }}
//               className="bg-card rounded-xl border border-border p-6 md:p-8 min-h-[300px] game-card-shadow"
//             >
//               <BharatStepContent
//                 stepIndex={currentStep}
//                 stepData={stepData}
//                 tableOf={tableOf}
//                 multipliedBy={currentMultiplier}
//                 onSpeak={speakText}
//               />
//             </motion.div>
//           </AnimatePresence>
//         </div>

//         {/* Summary panel — only past completed entries */}
//         <div className="bg-card rounded-xl border border-border p-5 game-card-shadow">
//           <h3 className="font-display font-bold text-lg text-primary mb-4">
//             📋 Times Table Summary
//           </h3>
//           <div className="space-y-2">
//             {completedEntries
//               .sort((a, b) => a - b)
//               .map((mult) => (
//                 <motion.div
//                   key={mult}
//                   initial={{ scale: 0.9, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   className="px-3 py-2 rounded-lg text-sm font-body bg-game-done/10 text-game-done font-semibold"
//                 >
//                   {getMultiplicationForm(tableOf, mult)} ✅
//                 </motion.div>
//               ))}
//           </div>

//           {isComplete && (
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mt-6 p-4 bg-game-done/10 rounded-xl text-center"
//             >
//               <p className="text-2xl mb-1">🎉</p>
//               <p className="font-display font-bold text-game-done">
//                 Table of {tableOf} Complete!
//               </p>
//               <button
//                 onClick={onBack}
//                 className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body font-medium hover:opacity-90 transition"
//               >
//                 Try Another Table
//               </button>
//             </motion.div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BharatGamePlay;

// ----------------finall
// import { useState, useCallback, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronLeft } from "lucide-react";
// import {
//   generateStepData,
//   STEP_LABELS,
//   getMultiplicationForm,
// } from "@/data/bharatGameData";
// import BharatStepContent from "./BharatStepContent";

// interface Props {
//   tableOf: number;
//   level: 1 | 2;
//   onBack: () => void;
// }

// const BharatGamePlay = ({ tableOf, level, onBack }: Props) => {
//   const [currentMultiplier, setCurrentMultiplier] = useState(1);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [completedEntries, setCompletedEntries] = useState<number[]>([]);

//   const stepData = generateStepData(tableOf, currentMultiplier);
//   const totalSteps = 6;
//   const maxMultiplier = level === 1 ? 5 : 10;

//   const isComplete =
//     completedEntries.includes(currentMultiplier) &&
//     currentStep === totalSteps - 1 &&
//     currentMultiplier === maxMultiplier;

//   // Auto-advance every 5 seconds
//   useEffect(() => {
//     if (isComplete) return;
//     const timer = setTimeout(() => {
//       if (currentStep < totalSteps - 1) {
//         setCurrentStep((s) => s + 1);
//       } else {
//         if (!completedEntries.includes(currentMultiplier)) {
//           setCompletedEntries((prev) => [...prev, currentMultiplier]);
//         }
//         if (currentMultiplier < maxMultiplier) {
//           setCurrentMultiplier((m) => m + 1);
//           setCurrentStep(0);
//         }
//       }
//     }, 5000);
//     return () => clearTimeout(timer);
//   }, [
//     currentStep,
//     currentMultiplier,
//     maxMultiplier,
//     completedEntries,
//     isComplete,
//   ]);

//   // Change this to 'female' for a female voice
//   const voiceGender = "male" as "male" | "female";

//   const speakText = useCallback(
//     (text: string) => {
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.rate = 0.8;
//       utterance.lang = "en-IN";
//       const voices = speechSynthesis.getVoices();
//       if (voiceGender === "female") {
//         const femaleVoice =
//           voices.find(
//             (v) =>
//               v.lang.startsWith("en") &&
//               v.name.toLowerCase().includes("female"),
//           ) ||
//           voices.find(
//             (v) =>
//               v.lang.startsWith("en") && v.name.toLowerCase().includes("woman"),
//           ) ||
//           voices.find((v) => v.lang.startsWith("en"));
//         if (femaleVoice) utterance.voice = femaleVoice;
//       } else {
//         const maleVoice =
//           voices.find(
//             (v) =>
//               v.lang.startsWith("en") && v.name.toLowerCase().includes("male"),
//           ) ||
//           voices.find(
//             (v) =>
//               v.lang.startsWith("en") && v.name.toLowerCase().includes("man"),
//           );
//         if (maleVoice) utterance.voice = maleVoice;
//       }
//       speechSynthesis.speak(utterance);
//     },
//     [voiceGender],
//   );

//   return (
//     <div className="space-y-4">
//       {/* Top bar */}
//       <div className="flex items-center justify-between">
//         <button
//           onClick={onBack}
//           className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition font-body text-sm"
//         >
//           <ChevronLeft size={18} /> Back to Tables
//         </button>
//         <h2 className="text-xl md:text-2xl font-display font-bold text-primary">
//           Table of {tableOf} — Level {level}
//         </h2>
//         <div className="text-sm text-muted-foreground font-body">
//           {currentMultiplier} of {maxMultiplier}
//         </div>
//       </div>

//       {/* Progress bar */}
//       <div className="flex gap-1">
//         {Array.from({ length: maxMultiplier }, (_, i) => (
//           <div
//             key={i}
//             className={`h-2 flex-1 rounded-full transition-colors ${
//               completedEntries.includes(i + 1)
//                 ? "bg-game-done"
//                 : i + 1 === currentMultiplier
//                   ? "bg-game-active"
//                   : "bg-muted"
//             }`}
//           />
//         ))}
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Main area */}
//         <div className="lg:col-span-2 space-y-4">
//           {/* Step content */}
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={`${currentMultiplier}-${currentStep}`}
//               initial={{ opacity: 0, x: 30 }}
//               animate={{ opacity: 1, x: 0 }}
//               exit={{ opacity: 0, x: -30 }}
//               transition={{ duration: 0.25 }}
//               className="bg-card rounded-xl border border-border p-6 md:p-8 min-h-[300px] game-card-shadow"
//             >
//               <BharatStepContent
//                 stepIndex={currentStep}
//                 stepData={stepData}
//                 tableOf={tableOf}
//                 multipliedBy={currentMultiplier}
//                 onSpeak={speakText}
//               />
//             </motion.div>
//           </AnimatePresence>
//         </div>

//         {/* Summary panel — only past completed entries */}
//         <div className="bg-card rounded-xl border border-border p-5 game-card-shadow">
//           <h3 className="font-display font-bold text-lg text-primary mb-4">
//             📋 Times Table Summary
//           </h3>
//           <div className="space-y-2">
//             {completedEntries
//               .sort((a, b) => a - b)
//               .map((mult) => (
//                 <motion.div
//                   key={mult}
//                   initial={{ scale: 0.9, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   className="px-3 py-2 rounded-lg text-sm font-body bg-game-done/10 text-game-done font-semibold"
//                 >
//                   {getMultiplicationForm(tableOf, mult)} ✅
//                 </motion.div>
//               ))}
//           </div>

//           {isComplete && (
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mt-6 p-4 bg-game-done/10 rounded-xl text-center"
//             >
//               <p className="text-2xl mb-1">🎉</p>
//               <p className="font-display font-bold text-game-done">
//                 Table of {tableOf} Complete!
//               </p>
//               <button
//                 onClick={onBack}
//                 className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-body font-medium hover:opacity-90 transition"
//               >
//                 Try Another Table
//               </button>
//             </motion.div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BharatGamePlay;
