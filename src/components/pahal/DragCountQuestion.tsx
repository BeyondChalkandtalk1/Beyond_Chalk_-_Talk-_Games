import { useState } from "react";
import { motion } from "framer-motion";
import { X, CheckCircle, XCircle } from "lucide-react";
import { handRepresentations, tenEqualsImage } from "@/data/pahalGameData";

interface Props {
  question: string;
  dragImage: string; // kept for backward compat but we use all hands now
  correctCount: number;
  gridSize: number;
  onAnswer: (isCorrect: boolean, answer: string) => void;
  showFeedback: boolean;
  validateAnswer?: (
    droppedHands: { number: number; label: string }[],
  ) => boolean;
}

interface DroppedHand {
  id: number;
  number: number;
  image: string;
  label: string;
}

// All available hand images for the source grid
const allHands = [
  ...handRepresentations.map((h) => ({
    number: h.number,
    image: h.image,
    label: h.label,
  })),
  { number: 10, image: tenEqualsImage, label: "1 Ten" },
];

const DragCountQuestion = ({
  question,
  correctCount,
  onAnswer,
  showFeedback,
  validateAnswer,
}: Props) => {
  const [droppedHands, setDroppedHands] = useState<DroppedHand[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const totalValue = droppedHands.reduce((sum, h) => sum + h.number, 0);

  const handleDragStart = (e: React.DragEvent, hand: (typeof allHands)[0]) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(hand));
    setIsDragging(true);
  };

  const handleDragEnd = () => setIsDragging(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  // const addHand = (hand: (typeof allHands)[0]) => {
  //   if (submitted || hand.number === 0) return;
  //   setDroppedHands((prev) => [
  //     ...prev,
  //     { id: Date.now() + Math.random(), ...hand },
  //   ]);
  // };

  const addHand = (hand: (typeof allHands)[0]) => {
    if (submitted) return;
    // ✅ hand.number === 0 wali condition hatao
    setDroppedHands((prev) => [
      ...prev,
      { id: Date.now() + Math.random(), ...hand },
    ]);
  };

  const handleDropToLeft = (e: React.DragEvent) => {
    e.preventDefault();
    if (submitted) return;
    try {
      const hand = JSON.parse(e.dataTransfer.getData("text/plain"));
      addHand(hand);
    } catch {
      /* ignore */
    }
    setIsDragging(false);
  };

  const handleTapGridItem = (hand: (typeof allHands)[0]) => {
    addHand(hand);
  };

  const handleRemoveItem = (id: number) => {
    if (submitted) return;
    setDroppedHands((prev) => prev.filter((h) => h.id !== id));
  };

  // const handleSubmit = () => {
  //   if (submitted || droppedHands.length === 0) return;
  //   const correct = totalValue === correctCount;
  //   setIsCorrect(correct);
  //   setSubmitted(true);
  //   onAnswer(correct, totalValue.toString());
  // };

const handleSubmit = () => {
  if (submitted || droppedHands.length === 0) return;

  let correct: boolean;

  if (validateAnswer) {
    correct = validateAnswer(droppedHands);
  } else {
    correct = totalValue === correctCount;
  }

  setIsCorrect(correct);
  setSubmitted(true);
  onAnswer(correct, correct ? "correct" : "wrong"); // ✅ value nahi, result pass karo
};

  const handleReset = () => {
    if (submitted) return;
    setDroppedHands([]);
  };

  return (
    <div className="space-y-4">
      {/* Blue Area - Question */}
      <div className="bg-primary/10 border-2 border-primary/30 rounded-xl p-4 md:p-6 text-center">
        <p className="text-2xl md:text-2xl font-display font-bold text-maroon">
          {question}
        </p>
      </div>

      {/* Main layout: Left (Drop Target) | Right (Source Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_500px] gap-4">
        {/* Left - Drop Target */}
        <div
          onDragOver={handleDragOver}
          onDrop={handleDropToLeft}
          className={`border-2 rounded-xl p-3 md:p-4 min-h-[200px] transition-all ${
            submitted
              ? isCorrect
                ? "border-game-done/50 bg-game-done/5"
                : "border-destructive/50 bg-destructive/5"
              : isDragging
                ? "border-primary border-dashed bg-primary/5"
                : "border-primary/30 bg-primary/5"
          }`}
        >
          <p className="text-2xl font-display font-bold text-black  tracking-wide mb-3 text-center">
            Drop Zone – Place hands here
          </p>

          {droppedHands.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {droppedHands.map((hand) => (
                <div
                  key={hand.id}
                  className="relative w-14 h-14 md:w-36 md:h-36 rounded-lg border border-primary/30  p-0.5"
                >
                  <img
                    src={hand.image}
                    alt={hand.label}
                    className="w-full h-full object-contain"
                  />
                  {!submitted && (
                    <button
                      onClick={() => handleRemoveItem(hand.id)}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center"
                    >
                      <X size={10} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-maroon text-xl font-bold">
              {isDragging
                ? "Drop here!"
                : "Select or drag hands from the right →"}
            </div>
          )}

          {/* Total value */}
          {/* <div className="mt-3 text-center">
            <span className="bg-card rounded-lg px-3 py-1.5 border border-border text-sm font-display font-bold text-foreground">
              Total: {totalValue} Ones
            </span>
          </div> */}

          {!submitted && droppedHands.length > 0 && (
            <div className="text-center mt-2">
              <button
                onClick={handleReset}
                className="text-2xl text-destructive font-display font-bold hover:underline"
              >
                Reset All
              </button>
            </div>
          )}
        </div>

        {/* Right - Source Grid (all hand images) */}
        <div className="bg-game-done/10 border-2 border-game-done/30 rounded-xl p-3 md:p-4">
          <p className="text-2xl font-display font-bold text-black  tracking-wide mb-3 text-center">
            Tap or drag from here
          </p>
          <div className="grid grid-cols-2 gap-2">
            {allHands.map((hand, i) => (
              <div
                key={i}
                // draggable={!submitted && hand.number > 0}
                onDragStart={(e) => handleDragStart(e, hand)}
                onDragEnd={handleDragEnd}
                onClick={() => handleTapGridItem(hand)}
                className={`rounded-lg border flex flex-col items-center justify-center p-1 transition-all ${
                  submitted 
                    ? "opacity-40 cursor-not-allowed border-border bg-muted/30"
                    : "border-game-done/50  hover:border-game-done hover:shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                }`}
              >
                <img
                  src={hand.image}
                  alt={hand.label}
                  className="w-20 h-20 md:w-32 md:h-32 object-contain"
                />
                {/* <span className="text-[10px] font-display font-semibold text-muted-foreground mt-0.5">
                  {hand.label}
                </span> */}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Submit */}
      {!submitted && (
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={droppedHands.length === 0}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-display font-bold text-2xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit Answer
          </button>
        </div>
      )}

      {/* Feedback */}
      {/* {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl text-center font-display font-semibold ${
            isCorrect
              ? "bg-game-done/10 text-game-done"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {isCorrect ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle size={20} /> 🎉 Correct! Total: {totalValue} Ones
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2 text-2xl">
              <XCircle size={28} /> You placed {totalValue} Ones. Correct
              answer: {correctCount} Ones
            </span>
          )}
        </motion.div>
      )} */}
      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-xl text-center font-display font-semibold ${
            isCorrect
              ? "bg-game-done/10 text-game-done"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {isCorrect ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle size={20} /> 🎉 Correct!
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2 text-2xl">
              <XCircle size={28} /> Wrong combination! Use the correct hands.
              {/* ✅ Generic message, specific value mat dikhao */}
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default DragCountQuestion;
