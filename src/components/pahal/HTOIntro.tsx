import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import tenBallCount from "@/assets/pahal/ballCount.mp4";
import blueBall from "@/assets/pahal/For_Ones.png";
import SequentialGifGrid from "./SequentialGifGrid"

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

const HTOIntro = ({ onStartQuiz }: Props) => {
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

  useEffect(() => {
    const delays: Record<number, number> = {
      0: 2000,
      1: 2000,
      2: 2000,
      13: 2000,
      14: 2000,
      15: 6000,
      16: 5000,
      17: 2000,
      18: 10000,
      19: 2000,
    };

    let delay: number;
    if (step >= 3 && step <= 12) {
      delay = BALL_DELAY;
    } else {
      delay = delays[step];
    }

    if (step === 20) {
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
    if (step === 16) speakText("One ten equals ten ones");
    if (step === 17) speakText("Let's make a hundred");
    if (step === 19)
      speakText("One hundred equals ten tens. One ten equals ten ones.");
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 min-h-[50vh]">
            {/* LEFT: Ones */}
            <div className="bg-card/90 backdrop-blur-sm rounded-xl border border-border p-2 game-card-shadow flex flex-col items-center justify-start gap-3">
              {step >= 0 && (
                <motion.h2
                  {...fadeIn}
                  className="text-xl md:text-2xl font-display font-bold text-primary"
                >
                  Meet "One"
                </motion.h2>
              )}
              {step >= 1 && step < 25 && (
                <motion.div {...bounceIn}>
                  {/* <div className="w-10 h-10 rounded-full bg-primary shadow-lg" /> */}
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
                  className="text-sm font-display font-semibold text-foreground"
                >
                  Let's Count Ones
                </motion.p>
              )}
              {step >= 3 && (
                <div className="flex gap-1.5 flex-wrap justify-center">
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
                      {/* <div
                        className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-primary shadow-lg animate-bounce"
                        style={{
                          animationDelay: `${i * 0.1}s`,
                          animationDuration: "1s",
                        }}
                      />
                      <span className="text-[10px] font-display font-semibold text-muted-foreground mt-0.5">
                        {i + 1}
                      </span> */}
                      <img
                        src={blueBall}
                        alt=""
                        className="w-10 h-10 md:w-10 md:h-10 rounded-full shadow-lg animate-bounce"
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
                  className="text-sm font-display font-bold text-game-done"
                >
                  Now we have 10 Ones
                </motion.p>
              )}
            </div>

            {/* MIDDLE: Tens */}
            <div className="bg-card/90 backdrop-blur-sm rounded-xl border border-border p-4 game-card-shadow flex flex-col items-center justify-center gap-3">
              {step >= 14 ? (
                <>
                  <motion.h2
                    {...fadeIn}
                    className="text-xl md:text-2xl font-display font-bold text-primary"
                  >
                    Let's make a Ten
                  </motion.h2>
                  {step >= 15 && (
                    <motion.div {...fadeIn} className=" max-w-xs">
                      {/* <img
                        src="/images/tens-ones-gif.gif"
                        alt="Making a ten"
                        className="w-full rounded-lg"
                      /> */}
                      <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-80 object-cover "
                      >
                        <source src={tenBallCount} type="video/mp4" />
                      </video>
                    </motion.div>
                  )}
                  {step >= 16 && (
                    <motion.p
                      {...fadeIn}
                      className="text-sm font-display font-bold text-game-done"
                    >
                      1 Ten = 10 Ones ✅
                    </motion.p>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground/30 font-display text-xs">
                  Tens
                </div>
              )}
            </div>

            {/* RIGHT: Hundreds */}
            <div className="bg-card/90 backdrop-blur-sm rounded-xl border border-border p-4 game-card-shadow flex flex-col items-center justify-center gap-3">
              {step >= 17 ? (
                // (
                //   <>
                //     <motion.h2
                //       {...fadeIn}
                //       className="text-xl md:text-2xl font-display font-bold text-primary"
                //     >
                //       Let's make a Hundred
                //     </motion.h2>
                //     {step >= 18 && (
                //       <motion.div {...fadeIn} className="w-full max-w-[200px]">
                //         <img
                //           src="/images/hto-hundred-gif.gif"
                //           alt="Making a hundred"
                //           className="w-full rounded-lg"
                //         />
                //       </motion.div>
                //     )}
                //   </>
                // )
                <>
                  <motion.h2
                    {...fadeIn}
                    className="text-xl md:text-2xl font-display font-bold text-primary"
                  >
                    Let's make a Hundred
                  </motion.h2>

                  {/* {step >= 18 && (
                    <motion.div {...fadeIn} className="w-full max-w-[200px]">
                      <div className="grid grid-cols-2 gap-1.5">
                        {Array.from({ length: 10 }).map((_, i) => (
                          <img
                            key={i}
                            src={tenBallCount}
                            alt={`Ten balls ${i + 1}`}
                            className="w-full rounded-md"
                          />
                        ))}
                      </div>
                    </motion.div>
                  )} */}
                  {step >= 18 && (
                    <motion.div {...fadeIn} className="w-full max-w-[700px]">
                      <SequentialGifGrid videoSrc={tenBallCount} />
                      <p>A “Hundred” is a group of 10 Tens.</p>
                    </motion.div>
                  )}
                </>
              ) : (
                <div className="text-muted-foreground/30 font-display text-xs">
                  Hundreds
                </div>
              )}
            </div>
          </div>

          {/* BOTTOM: Big Idea */}
          {step >= 19 && (
            <motion.div
              {...fadeIn}
              className="mt-6 bg-card/90 backdrop-blur-sm rounded-xl border border-border p-6 game-card-shadow text-center"
            >
              <h3 className="text-xl font-display font-bold text-primary mb-1">
                Big Idea
              </h3>
              <p className="text-xl md:text-2xl font-display font-bold text-game-done">
                1 Hundred = 10 Tens
              </p>
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
                  I want to understand the concept again
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HTOIntro;
