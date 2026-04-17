import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import gifVideo from "@/assets/pahal/ballCount.mp4";
import blueBall from "@/assets/pahal/For_Ones.png"
import onesSingleUnit from "@/assets/pahal/onesSingleUnit.png"
import tenGroup from "@/assets/pahal/tenGroup.png";

interface Props {
  onStartQuiz: () => void;
}

const BALL_COUNT = 10;
const BALL_DELAY = 2000; // 2s per ball

const TensAndOnesIntro = ({ onStartQuiz }: Props) => {
  const [step, setStep] = useState(0);
  // Steps:
  // 0: "Meet One" title
  // 1: Single blue ball + voice "One ball"
  // 2: "Let's Count Ones" text
  // 3-12: Balls 1-10 appearing one by one (step 3 = ball 1, step 12 = ball 10)
  // 13: "Now we have 10 Ones"
  // 14: Right side "Let's make a Ten"
  // 15: Show GIF
  // 16: Bottom section "Big Idea: 1 Ten = 10 Ones"
  // 17: Popup

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showContinueButton, setShowContinueButton] = useState(false);

  const speakText = useCallback((text: string) => {
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.85;
    utterance.lang = "en-IN";
    speechSynthesis.speak(utterance);
  }, []);

  // Auto-advance steps
  useEffect(() => {
    const delays: Record<number, number> = {
      0: 2000, // Meet "One" -> show ball
      1: 2000, // ball -> "Let's Count Ones"
      2: 2000, // text -> start counting
      // 3-12: balls, each 2s
      13: 2000, // "Now we have 10 Ones" -> right side
      14: 9000, // "Let's make a Ten" -> GIF
      15: 14000, // GIF plays for 10s -> bottom
      16: 5000, // Big Idea -> popup
      17:4000, // popup -> show continue button
      18:4000
    };

    // For ball steps (3-12), delay is BALL_DELAY
    let delay: number;
    if (step >= 3 && step <= 12) {
      delay = BALL_DELAY;
    } else {
      delay = delays[step];
    }

    if (step === 19) {
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

  // Voice effects
  useEffect(() => {
    if (step === 1) speakText("One");
    if (step >= 3 && step <= 12) {
      const ballNum = step - 2;
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
      speakText(`${words[ballNum]} ${ballNum === 1 ? "one" : "ones"}`);
    }
    if (step === 13) speakText("Now we have ten ones");
    if (step === 14) speakText("Let's make a ten");
    if (step === 16) speakText("One ten equals ten ones");
  }, [step, speakText]);

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

  return (
    <div className="relative min-h-[80vh]">
      {/* Background video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/video1.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-background/80 z-0" />

      <div className="relative z-10 p-4 md:p-3">
        <div className="max-w-9xl mx-auto">
          {/* Split screen layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[50vh]">
            {/* LEFT SECTION */}
            <div className="bg-card/90 backdrop-blur-sm rounded-xl border border-border p-1 game-card-shadow flex flex-col items-center justify-start gap-4">
              {/* Meet "One" */}
              {step >= 0 && (
                <motion.h2
                  {...fadeIn}
                  className="text-2xl md:text-5xl font-display font-bold text-secondary"
                >
                  Meet "One"
                </motion.h2>
              )}

              {/* Single blue ball */}
              {step >= 1 && step < 25 && (
                <motion.div {...bounceIn}>
                  {/* <div className="w-12 h-12 rounded-full bg-blue-700 shadow-lg" /> */}
                  <img
                    src={blueBall}
                    alt=""
                    className="w-12 h-12 object-cover"
                  />
                </motion.div>
              )}

              {/* Let's Count Ones */}
              {step >= 2 && (
                <motion.p
                  {...fadeIn}
                  className="text-4xl font-display font-bold text-foreground"
                >
                  Let's Count Ones
                </motion.p>
              )}

              {/* Row of balls */}
              {step >= 3 && (
                <div className="flex gap-2 flex-wrap justify-center">
                  {Array.from({ length: ballsVisible }, (_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0, y: -30 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{
                        type: "spring" as const,
                        stiffness: 400,
                        damping: 12,
                      }}
                      className="flex flex-col items-center"
                    >
                      {/* <div
                        className="w-10 h-10 md:w-16 md:h-16 rounded-full bg-blue-700 shadow-lg animate-bounce"
                        style={{
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: "1s",
                        }}
                      /> */}
                      <img
                        src={blueBall}
                        alt=""
                        className="w-10 h-10 md:w-12 md:h-12 rounded-full shadow-lg animate-bounce"
                        style={{
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: "1s",
                        }}
                      />
                      {/* <span className="text-xs font-display font-semibold text-muted-foreground mt-1">
                        {i + 1}
                      </span> */}
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Now we have 10 Ones */}
              {step >= 13 && (
                <>
                  <motion.p
                    {...fadeIn}
                    className="text-5xl font-display font-bold text-game-done"
                  >
                    Now we have 10 Ones
                  </motion.p>
                  {/* <img src={onesSingleUnit} alt="" className="w-76 h-96" /> */}
                </>
              )}
            </div>

            {/* RIGHT SECTION */}
            <div className="bg-card/90 backdrop-blur-sm rounded-xl border border-border p-6 game-card-shadow flex flex-col items-center  gap-4">
              {step >= 14 ? (
                <>
                  <motion.h2
                    {...fadeIn}
                    className="text-2xl md:text-5xl font-display font-bold text-secondary"
                  >
                    Let's make a Ten
                  </motion.h2>

                  {step >= 15 && (
                    <>
                      <motion.div {...fadeIn} className=" max-w-xs">
                        {/* <img
                        src={gifVideo}
                        alt="Making a ten"
                        className="w-full rounded-lg"
                      /> */}
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-96 object-cover "
                        >
                          <source src={gifVideo} type="video/mp4" />
                        </video>
                      </motion.div>
                      <p className="text-4xl font-display font-bold text-foreground mb-2">
                        A "Ten" is a group of 10 Ones.
                      </p>
                      <motion.div
                        {...fadeIn}
                        className="mt-0 bg-card/90 backdrop-blur-sm rounded-xl  p-0 game-card-shadow text-center"
                      >
                        <h3 className="text-5xl font-display font-bold text-primary mb-4">
                          Big Idea
                        </h3>
                        <p className="text-4xl md:text-3xl font-display font-bold text-game-done">
                          1 Ten = 10 Ones
                        </p>
                      </motion.div>
                    </>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground/30 font-display text-sm">
                  {/* Placeholder until right side activates */}
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM SECTION */}
          {step >= 16 && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
             {step >= 17 && ( <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-card/90 backdrop-blur-sm rounded-xl border border-border p-6 game-card-shadow text-center items-center flex flex-col gap-3"
              >
                <img
                  src={onesSingleUnit} // 👈 apni image ka path yahan daalo
                  alt="A Hundred = 10 Tens"
                  className="w-80 h-80 object-contain rounded-lg mt-2"
                />
              </motion.div>)}

              {step >= 18 && ( <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-card/90 backdrop-blur-sm rounded-xl border border-border p-6 game-card-shadow text-center items-center flex flex-col gap-3"
              >
                <img
                  src={tenGroup} // 👈 apni image ka path yahan daalo
                  alt="A Hundred = 10 Tens"
                  className="w-80 h-80 object-contain rounded-lg mt-2"
                />
              </motion.div>)}
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

              <p className="text-2xl font-display font-bold text-foreground mb-6">
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

      {/* CONTINUE BUTTON - only shown after closing popup via ✕ */}
    </div>
  );
};

export default TensAndOnesIntro;
