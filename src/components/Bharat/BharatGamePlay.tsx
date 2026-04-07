// import { useState, useCallback, useEffect } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { ChevronLeft, SkipBack, Play, Pause } from "lucide-react";
// import {
//   generateStepData,
//   STEP_LABELS,
//   getMultiplicationForm,
//   numberIcons,
// } from "@/data/bharatGameData";
// import BharatStepContent from "./BharatStepContent";
// import video from "@/assets/Bharat/After completion of every table .mp4";
// import BharatQuizModal from "./BharatQuizModal";

// interface Props {
//   tableOf: number;
//   level: 1 | 2;
//   onBack: () => void;
// }

// const BharatGamePlay = ({ tableOf, level, onBack }: Props) => {
//   const [currentMultiplier, setCurrentMultiplier] = useState(1);
//   const [currentStep, setCurrentStep] = useState(0);
//   const [showQuiz, setShowQuiz] = useState(false);

//   const [completedEntries, setCompletedEntries] = useState<number[]>([]);
//   const [isPaused, setIsPaused] = useState(false);

//   const [showModal, setShowModal] = useState(false);

//   const stepData = generateStepData(tableOf, currentMultiplier);
//   const totalSteps = 6;
//   const maxMultiplier = level === 1 ? 10 : 10;

//   const isComplete =
//     completedEntries.includes(currentMultiplier) &&
//     currentStep === totalSteps - 1 &&
//     currentMultiplier === maxMultiplier;

//   // Auto-advance every 5 seconds
//   useEffect(() => {
//     if (isComplete || isPaused) return;
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
//     isPaused,
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

//   const handlePrevious = () => {
//     if (currentStep > 0) {
//       setCurrentStep((s) => s - 1);
//     } else if (currentMultiplier > 1) {
//       setCurrentMultiplier((m) => m - 1);
//       setCurrentStep(totalSteps - 1);
//     }
//   };

// // isComplete hone par modal open karo
// // useEffect(() => {
// //   if (isComplete) {
// //     setShowModal(true);
// //     // 5 second baad auto-close
// //     const timer = setTimeout(() => {
// //       setShowModal(false);
// //     }, 5000);
// //     return () => clearTimeout(timer);
// //   }
// // }, [isComplete]);

// useEffect(() => {
//   if (isComplete) {
//     setShowModal(true);
//     // After 5 s (or when video ends) open the quiz
//     const timer = setTimeout(() => {
//       setShowModal(false);
//       setShowQuiz(true);
//     }, 5000);
//     return () => clearTimeout(timer);
//   }
// }, [isComplete]);

//   return (
//     <div className=" space-y-4 ">
//       {/* Top bar */}

//       {/* <div className="fixed inset-0 bg-black/40 -z-10" /> */}
//       <h2 className="text-3xl md:text-5xl font-display font-bold text-secondary text-center flex-1">
//         Times Table of {tableOf}
//       </h2>
//       <div className="flex items-center justify-between">
//         <button
//           onClick={onBack}
//           className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition font-bold text-xl"
//         >
//           <ChevronLeft size={28} /> Back to Times Table
//         </button>

//         {/* <div className="text-sm text-muted-foreground font-body">
//           {currentMultiplier} of {maxMultiplier}
//         </div> */}
//       </div>

//       {/* Progress bar */}
//       {/* <div className="flex gap-1">
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
//       </div> */}

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
//               className=" rounded-xl border border-border p-6 md:p-8 min-h-[300px] game-card-shadow"
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

//           {/* Previous & Play/Pause buttons */}
//           <div className="flex items-center justify-center gap-4">
//             <button
//               onClick={handlePrevious}
//               disabled={currentMultiplier === 1 && currentStep === 0}
//               className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-display font-semibold text-2xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
//             >
//               <SkipBack size={24} /> Previous
//             </button>
//             <button
//               onClick={() => setIsPaused((p) => !p)}
//               className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-2xl hover:opacity-90 transition"
//             >
//               {isPaused ? (
//                 <>
//                   <Play size={24} /> Play
//                 </>
//               ) : (
//                 <>
//                   <Pause size={24} /> Pause
//                 </>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Summary panel */}
//         <div className="rounded-xl  p-1 game-card-shadow">
//           <h3 className="font-display font-bold text-3xl text-primary mb-1">
//             📋 Times Table of {tableOf}
//           </h3>
//           <div className="space-y-2">
//             {completedEntries
//               .sort((a, b) => a - b)
//               .map((mult) => (
//                 <motion.div
//                   key={mult}
//                   initial={{ scale: 0.9, opacity: 0 }}
//                   animate={{ scale: 1, opacity: 1 }}
//                   className="px-3 py-2 rounded-lg text-2xl font-body bg-game-done/10 text-game-done font-semibold"
//                 >
//                   {getMultiplicationForm(tableOf, mult)}
//                 </motion.div>
//               ))}
//           </div>

//           {isComplete && (
//             <motion.div
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mt-3 p-1 bg-game-done/10 rounded-xl text-center text-2xl"
//             >
//               {/* <p className="text-5xl mb-1">🏆</p>
//               <p className="font-display font-bold text-game-done">
//                 Table of {tableOf} Complete!
//               </p> */}
//               <button
//                 onClick={onBack}
//                 className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-2xl font-body font-medium hover:opacity-90 transition"
//               >
//                 Try Another Table
//               </button>
//             </motion.div>
//           )}
//         </div>
//       </div>
//       {/* 🎉 Completion Modal */}
//       <AnimatePresence>
//         {showModal && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
//           >
//             <motion.div
//               initial={{ scale: 0.8, opacity: 0 }}
//               animate={{ scale: 1, opacity: 1 }}
//               exit={{ scale: 0.8, opacity: 0 }}
//               transition={{ type: "spring", stiffness: 260, damping: 20 }}
//               className="relative rounded-2xl overflow-hidden shadow-2xl w-[90vw] max-w-lg"
//             >
//               {/* Cross Button - Top Right */}
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full w-9 h-9 flex items-center justify-center transition text-xl font-bold"
//                 aria-label="Close"
//               >
//                 ✕
//               </button>

//               {/* Video */}
//               <video
//                 src={video}
//                 autoPlay
//                 muted
//                 playsInline
//                 className="w-full h-auto max-h-[70vh] object-cover"
//                 onEnded={() => setShowModal(false)}
//               />

//               {/* Overlay Text */}
//               <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 text-center">
//                 <p className="text-white font-display font-bold text-3xl">
//                   🏆 Table of {tableOf} Complete!
//                 </p>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>
//       {showQuiz && (
//         <BharatQuizModal
//           tableOf={tableOf}
//           onClose={() => {
//             setShowQuiz(false);
//             onBack(); // optional: go back after quiz
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default BharatGamePlay;

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, SkipBack, Play, Pause } from "lucide-react";
import {
  generateStepData,
  STEP_LABELS,
  getMultiplicationForm,
  numberIcons,
} from "@/data/bharatGameData";
import BharatStepContent from "./BharatStepContent";
import video from "@/assets/Bharat/After completion of every table .mp4";
import BharatQuizModal from "./BharatQuizModal";

interface Props {
  tableOf: number;
  level: 1 | 2;
  onBack: () => void;
}

const BharatGamePlay = ({ tableOf, level, onBack }: Props) => {
  const [currentMultiplier, setCurrentMultiplier] = useState(1);
  const [currentStep, setCurrentStep] = useState(0);
  const [showQuiz, setShowQuiz] = useState(false);
  const [completedEntries, setCompletedEntries] = useState<number[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showChallengePrompt, setShowChallengePrompt] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const stepData = generateStepData(tableOf, currentMultiplier);
  const totalSteps = 6;
  const maxMultiplier = level === 1 ? 10 : 10;

  const isComplete =
    completedEntries.includes(currentMultiplier) &&
    currentStep === totalSteps - 1 &&
    currentMultiplier === maxMultiplier;

  // Preload video on mount
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
    }
  }, []);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (isComplete || isPaused) return;
    const timer = setTimeout(() => {
      if (currentStep < totalSteps - 1) {
        setCurrentStep((s) => s + 1);
      } else {
        if (!completedEntries.includes(currentMultiplier)) {
          setCompletedEntries((prev) => [...prev, currentMultiplier]);
        }
        if (currentMultiplier < maxMultiplier) {
          setCurrentMultiplier((m) => m + 1);
          setCurrentStep(0);
        }
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [
    currentStep,
    currentMultiplier,
    maxMultiplier,
    completedEntries,
    isComplete,
    isPaused,
  ]);

  const voiceGender = "male" as "male" | "female";

  const speakText = useCallback(
    (text: string) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.8;
      utterance.lang = "en-IN";
      const voices = speechSynthesis.getVoices();
      if (voiceGender === "female") {
        const femaleVoice =
          voices.find(
            (v) =>
              v.lang.startsWith("en") &&
              v.name.toLowerCase().includes("female"),
          ) ||
          voices.find(
            (v) =>
              v.lang.startsWith("en") && v.name.toLowerCase().includes("woman"),
          ) ||
          voices.find((v) => v.lang.startsWith("en"));
        if (femaleVoice) utterance.voice = femaleVoice;
      } else {
        const maleVoice =
          voices.find(
            (v) =>
              v.lang.startsWith("en") && v.name.toLowerCase().includes("male"),
          ) ||
          voices.find(
            (v) =>
              v.lang.startsWith("en") && v.name.toLowerCase().includes("man"),
          );
        if (maleVoice) utterance.voice = maleVoice;
      }
      speechSynthesis.speak(utterance);
    },
    [voiceGender],
  );

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    } else if (currentMultiplier > 1) {
      setCurrentMultiplier((m) => m - 1);
      setCurrentStep(totalSteps - 1);
    }
  };

  // Show trophy video on complete, then challenge prompt, then quiz
  useEffect(() => {
    if (isComplete) {
      setShowModal(true);
    }
  }, [isComplete]);

  const handleVideoEnd = () => {
    setShowModal(false);
    setShowChallengePrompt(true);
  };

  const handleVideoSkip = () => {
    setShowModal(false);
    setShowChallengePrompt(true);
  };

  return (
    <div className="space-y-4">
      {/* Hidden preload video */}
      <video ref={videoRef} src={video} preload="auto" className="hidden" />

      <h2 className="text-3xl md:text-5xl font-display font-bold text-secondary text-center flex-1">
        Times Table of {tableOf}
      </h2>
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition font-bold text-xl"
        >
          <ChevronLeft size={28} /> Back to Times Table
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main area */}
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${currentMultiplier}-${currentStep}`}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-border p-6 md:p-8 min-h-[300px] game-card-shadow"
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

          {/* Previous & Play/Pause buttons */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentMultiplier === 1 && currentStep === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-display font-semibold text-2xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <SkipBack size={24} /> Previous
            </button>
            <button
              onClick={() => setIsPaused((p) => !p)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-2xl hover:opacity-90 transition"
            >
              {isPaused ? (
                <>
                  <Play size={24} /> Play
                </>
              ) : (
                <>
                  <Pause size={24} /> Pause
                </>
              )}
            </button>
          </div>
        </div>

        {/* Summary panel — scrollable so pencil bg never hides last entries */}
        <div
          className="rounded-xl px-1 pt-0 game-card-shadow flex flex-col"
          style={{ maxHeight: "48vh" }}
        >
          <h3 className="font-display font-bold text-3xl text-primary mb-1 shrink-0">
            Times Table of {tableOf}
          </h3>
          <div className="overflow-y-auto flex-1 space-y-2 pr-1">
            {completedEntries
              .sort((a, b) => a - b)
              .map((mult) => (
                <motion.div
                  key={mult}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="px-3 py-0.5 rounded-lg text-2xl font-body bg-game-done/10 text-game-done font-semibold"
                >
                  {getMultiplicationForm(tableOf, mult)}
                </motion.div>
              ))}
          </div>

          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-3 p-1 bg-game-done/10 rounded-xl text-center text-2xl shrink-0"
            >
              <button
                onClick={onBack}
                className="mt-3 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-2xl font-body font-medium hover:opacity-90 transition"
              >
                Try Another Table
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Trophy Video Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="relative rounded-2xl overflow-hidden shadow-2xl  w-2xl pt-40"
            >
              <button
                onClick={handleVideoSkip}
                className="absolute top-3 right-3 z-10 bg-black/60 hover:bg-black/80 text-white rounded-full w-9 h-9 flex items-center justify-center transition text-xl font-bold"
                aria-label="Close"
              >
                ✕
              </button>

              <video
                src={video}
                autoPlay
                muted
                playsInline
                preload="auto"
                className="w-full h-auto max-h-[70vh] object-cover"
                onEnded={handleVideoEnd}
              />

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 text-center">
                <p className="text-white font-display font-bold text-4xl">
                  🏆 Times Table of {tableOf} Complete!
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* B.H.A.R.A.T Challenge Prompt */}
      <AnimatePresence>
        {showChallengePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 pt-10"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl overflow-hidden"
            >
              {/* Yellow header */}
              <div className="bg-primary px-6 py-5 text-center">
                <p className="text-4xl mb-1">🏆</p>
                <h2 className="text-4xl font-black text-black">
                  Times Table of {tableOf} Complete!
                </h2>
              </div>

              {/* Body */}
              <div className="px-6 py-6 text-center space-y-4">
                <p className="text-[#8F2424] font-bold text-3xl leading-snug">
                  This will help the player prepare for the challenge.
                </p>
                <p className="text-black font-black text-3xl leading-snug">
                  Ready to take on the
                  <br />
                  <span className="text-[#8F2424]">B.H.A.R.A.T Challenge?</span>
                </p>
                <p className="text-gray-600 font-bold text-2xl">
                  Test everything you've learned about the Times Table of{" "}
                  {tableOf}!
                </p>

                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowChallengePrompt(false);
                      onBack();
                    }}
                    className="flex-1 py-3 rounded-2xl border-2 border-gray-300 text-gray-600 font-bold text-lg hover:border-gray-400 transition"
                  >
                    Not Now
                  </button>
                  <button
                    onClick={() => {
                      setShowChallengePrompt(false);
                      setShowQuiz(true);
                    }}
                    className="flex-1 py-3 rounded-2xl bg-[#8F2424] text-white font-black text-lg hover:bg-[#7a1f1f] transition"
                  >
                    Let's Go!
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {showQuiz && (
        <BharatQuizModal
          tableOf={tableOf}
          onClose={() => {
            setShowQuiz(false);
            onBack();
          }}
        />
      )}
    </div>
  );
};

export default BharatGamePlay;