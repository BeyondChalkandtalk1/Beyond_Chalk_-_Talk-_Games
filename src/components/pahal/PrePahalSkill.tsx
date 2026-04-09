import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SkipBack, Play, Pause, Volume2, RotateCcw } from "lucide-react";
import { handRepresentations, tenEqualsImage } from "@/data/pahalGameData";

interface Props {
  onComplete: () => void;
}

const PrePahalSkill = ({ onComplete }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showTenEquals, setShowTenEquals] = useState(false);
  const [hasSpoken, setHasSpoken] = useState(false);

  const totalItems = handRepresentations.length; // 0-10 = 11 items

  // Voice gender variable (change to 'female' for female voice)
  const voiceGender = "male" as "male" | "female";

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

  // Auto-speak when a new hand appears
  useEffect(() => {
    if (!showTenEquals && !hasSpoken) {
      const rep = handRepresentations[currentIndex];
      speakText(rep.speechText);
      setHasSpoken(true);
    }
  }, [currentIndex, showTenEquals, hasSpoken, speakText]);

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (isPaused) return;
    const timer = setTimeout(() => {
      if (showTenEquals) {
        onComplete();
        return;
      }
      if (currentIndex < totalItems - 1) {
        setCurrentIndex((i) => i + 1);
        setHasSpoken(false);
      } else {
        setShowTenEquals(true);
        speakText("One Ten equals Ten Ones");
      }
    }, 5000);
    return () => clearTimeout(timer);
  }, [
    currentIndex,
    isPaused,
    showTenEquals,
    totalItems,
    onComplete,
    speakText,
  ]);

  const handlePrevious = () => {
    if (showTenEquals) {
      setShowTenEquals(false);
      return;
    }
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setHasSpoken(false);
    }
  };

  const handleRepeat = () => {
    setCurrentIndex(0);
    setShowTenEquals(false);
    setHasSpoken(false);
    setIsPaused(false);
  };

  const handleHearAgain = () => {
    if (showTenEquals) {
      speakText("One Ten equals Ten Ones");
    } else {
      speakText(handRepresentations[currentIndex].speechText);
    }
  };

  const current = handRepresentations[currentIndex];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">
          Pre-PAHAL Skill
        </h2>
        <p className="text-muted-foreground text-sm mt-1">
          Representation of numbers using hands
        </p>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1 max-w-2xl mx-auto">
        {Array.from({ length: totalItems + 1 }, (_, i) => (
          <div
            key={i}
            className={`h-2 flex-1 rounded-full transition-colors ${
              i < currentIndex || (i === totalItems && showTenEquals)
                ? "bg-game-done"
                : i === currentIndex && !showTenEquals
                  ? "bg-game-active"
                  : i === totalItems && showTenEquals
                    ? "bg-game-active"
                    : "bg-muted"
            }`}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          {!showTenEquals ? (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              transition={{ duration: 0.25 }}
              className="bg-card rounded-xl border border-border p-8 md:p-12 game-card-shadow flex flex-col items-center"
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
          ) : (
            <motion.div
              key="ten-equals"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-card rounded-xl border border-border p-8 md:p-12 game-card-shadow flex flex-col items-center"
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

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mt-6 flex-wrap">
          <button
            onClick={handlePrevious}
            disabled={currentIndex === 0 && !showTenEquals}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-secondary text-secondary-foreground font-display font-semibold text-sm hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SkipBack size={18} /> Previous
          </button>
          <button
            onClick={() => setIsPaused((p) => !p)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-display font-semibold text-sm hover:opacity-90 transition"
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
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-accent-foreground font-display font-semibold text-sm hover:opacity-90 transition"
          >
            <Volume2 size={18} /> Hear it again!
          </button>
          <button
            onClick={handleRepeat}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-muted text-muted-foreground font-display font-semibold text-sm hover:opacity-90 transition"
          >
            <RotateCcw size={18} /> Repeat
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrePahalSkill;
