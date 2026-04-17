import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import tenBallCount from "@/assets/pahal/ballCount.mp4";
import blueBall from "@/assets/pahal/For_Ones.png";
import SequentialGifGrid from "./SequentialGifGrid"
import onesSingleUnit from "@/assets/pahal/onesSingleUnit.png";
import groupHundred from "@/assets/pahal/groupHundred.png";
import groupOfThousand from "@/assets/pahal/groupOfThousand.jpg";
import tenGroup from "@/assets/pahal/tenGroup.png";
import HundredBallGrid from "./HundredBallGrid";
import ThousandBallGrid from "./ThousandBallGrid";

interface Props {
  onStartQuiz: () => void;
}

const BALL_DELAY = 4000;

// Steps:
// 0: Left title "Meet One"
// 1: Single ball + voice
// 2: Left "Let's Count Ones"
// 3-12: 10 balls one by one
// 13: "Now we have 10 Ones"
// 14: Middle title "Let's make a Ten"
// 15: Middle GIF (ones→ten)
// 16: "1 Ten = 10 Ones" in middle
// 17: Right title "Let's make a Hundred"
// 18: Right GIF (tens→hundred)
// 19: Bottom Big Idea
// 20: Popup

const THTOIntro = ({ onStartQuiz }: Props) => {
  const [step, setStep] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showContinueButton, setShowContinueButton] = useState(false);

  const speakText = useCallback((text: string) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.lang = "en-IN";
    speechSynthesis.speak(utterance);
  }, []);

//   useEffect(() => {
//     const delays: Record<number, number> = {
//       0: 2000,
//       1: 2000,
//       2: 2000,
//       13: 2000,
//       14: 2000,
//       15: 6000,
//       16: 5000,
//       17: 2000,
//       18: 10000,
//       19: 2000, // first big idea shows, wait 2s
//       20: 2000,
//     };

//     let delay: number;
//     if (step >= 3 && step <= 12) {
//       delay = BALL_DELAY;
//     } else {
//       delay = delays[step];
//     }

//     if (step === 21) {
//       setShowPopup(true);
//       return;
//     }

//     if (delay !== undefined) {
//       timerRef.current = setTimeout(() => setStep((s) => s + 1), delay);
//       return () => {
//         if (timerRef.current) clearTimeout(timerRef.current);
//       };
//     }
//   }, [step]);

useEffect(() => {
  const delays: Record<number, number> = {
    0: 2000,
    1: 2000,
    2: 2000,
    13: 2000,
    14: 2000,
    15: 6000,
    16: 3000,
    17: 2000,
    18: 6000,
    19: 3000,
    20: 2000,
    21: 6000,
    22: 3000,
    23: 2000,
    24: 2000,
    25: 2000,
    26: 2000,
  };

  let delay: number;
  if (step >= 3 && step <= 12) {
    delay = BALL_DELAY;
  } else {
    delay = delays[step];
  }

  if (step === 27) {
    setShowPopup(true);
    return;
  }

  if (delay !== undefined) {
    timerRef.current = setTimeout(() => setStep((s) => s + 1), delay);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }
}, [step]);

//   useEffect(() => {
//     if (step === 1) speakText("One ball");
//     if (step >= 3 && step <= 12) {
//       const n = step - 2;
//       const words = [
//         "",
//         "one",
//         "two",
//         "three",
//         "four",
//         "five",
//         "six",
//         "seven",
//         "eight",
//         "nine",
//         "ten",
//       ];
//       speakText(`${words[n]} ${n === 1 ? "one" : "ones"}`);
//     }
//     if (step === 13) speakText("Now we have ten ones");
//     if (step === 14) speakText("Let's make a ten");
//     if (step === 16) speakText("One ten equals ten ones");
//     if (step === 17) speakText("Let's make a hundred");
//     if (step === 19)
//       speakText("One hundred equals ten tens. One ten equals ten ones.");
//   }, [step, speakText]);


useEffect(() => {
  if (step === 1) speakText("One ball");
  if (step >= 3 && step <= 12) {
    const n = step - 2;
    const words = [
      "",
      "one",
      "two",
      "three",
      "four",
      "five",
      "six",
      "seven",
      "eight",
      "nine",
      "ten",
    ];
    speakText(`${words[n]} ${n === 1 ? "one" : "ones"}`);
  }
  if (step === 13) speakText("Now we have ten ones");
  if (step === 14) speakText("Let's make a ten");
  if (step === 16) speakText("Big idea. One ten equals ten ones");
  if (step === 17) speakText("Let's make a hundred");
  if (step === 19) speakText("Big idea. One hundred equals ten tens");
  if (step === 20) speakText("Let's make a thousand");
  if (step === 22) speakText("Big idea. One thousand equals ten hundreds");
  if (step === 23) speakText("This is one ones unit");
  if (step === 24) speakText("This is one tens group");
  if (step === 25) speakText("This is one hundreds group");
  if (step === 26) speakText("This is one thousands group");
}, [step, speakText]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        setShowPopup(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const ballsVisible = step >= 3 ? Math.min(step - 2, 10) : 0;

  const fadeIn = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 },
  };

  const bounceIn = {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    transition: { type: "spring" as const, stiffness: 300, damping: 15 },
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

      <div className="relative z-10 p-4 md:p-3">
        <div className="max-w-9xl mx-auto">
          {/* Three-column layout */}

          {/* BOTTOM: Big Idea */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 min-h-[50vh]">
            {/* COL 1: Ones */}
            <div className="bg-card/90 backdrop-blur-sm rounded-xl border border-border p-2 game-card-shadow flex flex-col items-center justify-start gap-3">
              {step >= 0 && (
                <motion.h2
                  {...fadeIn}
                  className="text-2xl md:text-4xl font-display font-bold text-secondary"
                >
                  Meet "One"
                </motion.h2>
              )}
              {step >= 1 && (
                <motion.div {...bounceIn}>
                  <img
                    src={blueBall}
                    alt=""
                    className="w-12 h-12 object-cover"
                  />
                </motion.div>
              )}
              {step >= 2 && (
                <motion.p
                  {...fadeIn}
                  className="text-3xl font-display font-semibold text-foreground text-center"
                >
                  Let's Count Ones
                </motion.p>
              )}
              {step >= 3 && (
                <div className="flex flex-col gap-1.5 flex-wrap justify-center">
                  {Array.from({ length: ballsVisible }, (_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, y: -20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        type: "spring" as const,
                        stiffness: 400,
                        damping: 12,
                      }}
                      className="flex flex-col items-center"
                    >
                      <img
                        src={blueBall}
                        alt=""
                        className="w-10 h-10 md:w-8 md:h-8 rounded-full shadow-lg animate-bounce"
                        style={{
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: "1s",
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
              {step >= 13 && (
                <motion.p
                  {...fadeIn}
                  className="text-2xl font-display font-bold text-game-done text-center"
                >
                  Now we have 10 Ones
                </motion.p>
              )}
            </div>

            {/* COL 2: Tens */}
            <div className="bg-card/90 backdrop-blur-sm rounded-xl border border-border p-4 game-card-shadow flex flex-col items-center gap-3">
              {step >= 14 ? (
                <>
                  <motion.h2
                    {...fadeIn}
                    className="text-2xl md:text-4xl font-display font-bold text-secondary text-center"
                  >
                    Let's make a Ten
                  </motion.h2>
                  {step >= 15 && (
                    <motion.div {...fadeIn} className="max-w-xs">
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-96 object-cover"
                      >
                        <source src={tenBallCount} type="video/mp4" />
                      </video>
                    </motion.div>
                  )}
                  {step >= 16 && (
                    <motion.div {...fadeIn} className="text-center">
                      <p className="text-2xl font-display font-bold text-foreground mb-2">
                        A "Ten" is a group of 10 Ones.
                      </p>
                      <h3 className="text-4xl font-display font-bold text-primary mb-2">
                        Big Idea 💡
                      </h3>
                      <p className="text-3xl font-display font-bold text-game-done">
                        1 Ten = 10 Ones
                      </p>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground/30 font-display text-xs">
                  Tens
                </div>
              )}
            </div>

            {/* COL 3: Hundreds */}
            <div className="bg-card/90 backdrop-blur-sm rounded-xl border border-border p-4 game-card-shadow flex flex-col items-center gap-3">
              {step >= 17 ? (
                <>
                  <motion.h2
                    {...fadeIn}
                    className="text-2xl md:text-4xl font-display font-bold text-secondary text-center"
                  >
                    Let's make a Hundred
                  </motion.h2>
                  {step >= 18 && (
                    <motion.div {...fadeIn} className="flex justify-center">
                      <HundredBallGrid totalVisible={100} />
                    </motion.div>
                  )}
                  {step >= 19 && (
                    <motion.div {...fadeIn} className="text-center">
                      <p className="text-2xl font-display font-bold text-foreground mb-2">
                        A "Hundred" is a group of 10 Tens.
                      </p>
                      <h3 className="text-4xl font-display font-bold text-primary mb-2">
                        Big Idea 💡
                      </h3>
                      <p className="text-3xl font-display font-bold text-game-done">
                        1 Hundred = 10 Tens
                      </p>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground/30 font-display text-xs">
                  Hundreds
                </div>
              )}
            </div>

            {/* COL 4: Thousands */}
            <div className="bg-card/90 backdrop-blur-sm rounded-xl border border-border p-4 game-card-shadow flex flex-col items-center gap-3">
              {step >= 20 ? (
                <>
                  <motion.h2
                    {...fadeIn}
                    className="text-2xl md:text-4xl font-display font-bold text-secondary text-center"
                  >
                    Let's make a Thousand
                  </motion.h2>
                  {step >= 21 && (
                    <motion.div {...fadeIn} className="flex w-full justify-center items-center">
                      <ThousandBallGrid totalVisible={1000} />
                    </motion.div>
                  )}
                  {step >= 22 && (
                    <motion.div {...fadeIn} className="text-center">
                      <p className="text-2xl font-display font-bold text-foreground mb-2">
                        A "Thousand" is a group of 10 Hundreds.
                      </p>
                      <h3 className="text-4xl font-display font-bold text-primary mb-2">
                        Big Idea 💡
                      </h3>
                      <p className="text-3xl font-display font-bold text-game-done">
                        1 Thousand = 10 Hundreds
                      </p>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground/30 font-display text-xs">
                  Thousands
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM: 4 images appearing one by one */}
          {step >= 23 && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Ones */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-card/90 backdrop-blur-sm rounded-xl border border-border p-4 game-card-shadow text-center flex flex-col items-center gap-2"
              >
                {/* <p className="text-4xl font-display font-bold text-secondary">
                  Ones
                </p> */}
                <img
                  src={onesSingleUnit}
                  alt="One"
                  className="w-80 h-80 object-contain"
                />
                {/* <p className="text-4xl font-display font-bold text-game-done">
                  1 One
                </p> */}
              </motion.div>

              {/* Tens */}
              {step >= 24 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-card/90 backdrop-blur-sm rounded-xl border border-border p-4 game-card-shadow text-center flex flex-col items-center gap-2"
                >
                  {/* <p className="text-4xl font-display font-bold text-secondary">
                    Tens
                  </p> */}
                  <img
                    src={tenGroup}
                    alt="Ten"
                    className="w-80 h-80 object-contain"
                  />
                  {/* <p className="text-4xl font-display font-bold text-game-done">
                    1 Ten = 10 Ones
                  </p> */}
                </motion.div>
              )}

              {/* Hundreds */}
              {step >= 25 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-card/90 backdrop-blur-sm rounded-xl border border-border p-4 game-card-shadow text-center flex flex-col items-center gap-2"
                >
                  {/* <p className="text-xl font-display font-bold text-secondary">
                    Hundreds
                  </p> */}
                  <img
                    src={groupHundred}
                    alt="Hundred"
                    className="w-80 h-80 object-contain"
                  />
                  {/* <p className="text-lg font-display font-bold text-game-done">
                    1 Hundred = 10 Tens
                  </p> */}
                </motion.div>
              )}

              {/* Thousands */}
              {step >= 26 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-card/90 backdrop-blur-sm rounded-xl border border-border p-4 game-card-shadow text-center flex flex-col items-center gap-2"
                >
                  {/* <p className="text-xl font-display font-bold text-secondary">
                    Thousands
                  </p> */}
                  {/* 👈 apna thousands image import karke yahan daalo */}
                  <img
                    src={groupOfThousand}
                    alt="Thousand"
                    className="w-80 h-80 object-contain"
                  />
                  {/* <p className="text-lg font-display font-bold text-game-done">
                    1 Thousand = 10 Hundreds
                  </p> */}
                </motion.div>
              )}
            </div>
          )}

          {showContinueButton && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-6 flex justify-center"
            >
              <button
                onClick={onStartQuiz}
                className="px-10 py-4 bg-primary text-primary-foreground text-2xl rounded-xl font-display font-semibold hover:opacity-90 transition shadow-lg"
              >
                Continue
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* POPUP */}
      <AnimatePresence>
        {/* {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: "spring" as const,
                stiffness: 300,
                damping: 20,
              }}
              className="bg-card rounded-2xl border border-border p-8 game-card-shadow max-w-md mx-4 text-center"
            >
              <p className="text-xl font-display font-bold text-foreground mb-6">
                📌 Are you ready to take PAHAL Practice Challenge!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={onStartQuiz}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-xl font-display font-semibold hover:opacity-90 transition"
                >
                  Yes ✅
                </button>
                <button
                  onClick={() => {
                    setShowPopup(false);
                    setStep(0);
                    speechSynthesis.cancel();
                  }}
                  className="px-6 py-3 bg-secondary text-secondary-foreground rounded-xl font-display font-semibold hover:opacity-90 transition text-sm"
                >
                  I want to understand the concept again 🔄
                </button>
              </div>
            </motion.div>
          </motion.div>
        )} */}
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{
                type: "spring" as const,
                stiffness: 300,
                damping: 20,
              }}
              className="relative bg-card rounded-2xl border border-border p-8 game-card-shadow max-w-xl mx-4 text-center"
            >
              {/* Close button */}
              {/* Close button */}
              <button
                onClick={() => {
                  setShowPopup(false);
                  setShowContinueButton(true);
                  speechSynthesis.cancel();
                }}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-muted hover:bg-muted/70 text-muted-foreground hover:text-foreground transition text-lg font-bold"
                aria-label="Close"
              >
                ✕
              </button>

              <p className="text-3xl font-display font-bold text-foreground mb-6">
                Are you ready to take PAHAL Practice Challenge!
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={onStartQuiz}
                  className="px-6 py-3 bg-primary text-primary-foreground text-2xl rounded-xl font-display font-semibold hover:opacity-90 transition"
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    setShowPopup(false);
                    setStep(0);
                    speechSynthesis.cancel();
                  }}
                  className="px-6 py-3 bg-secondary text-secondary-foreground text-2xl rounded-xl font-display font-semibold hover:opacity-90 transition"
                >
                  I want to revisit the concept again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default THTOIntro;
