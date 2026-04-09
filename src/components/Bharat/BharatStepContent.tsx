
// -------------final------------------
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2 } from "lucide-react";
import type { StepData } from "@/data/bharatGameData";
import smileImage from "@/assets/Bharat/smilyImage.png";
import { numberIcons } from "@/data/bharatGameData";

const numberWordsLower: Record<number, string> = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten",
};

interface Props {
  stepIndex: number;
  stepData: StepData;
  tableOf: number;
  multipliedBy: number;
  onSpeak: (text: string) => void;
}

const BharatStepContent = ({
  stepIndex,
  stepData,
  tableOf,
  multipliedBy,
  onSpeak,
}: Props) => {
  const { content } = stepData;
  const hasAutoPlayed = useRef(false);

  // Auto-play sound when step 2 (index 1) appears
  useEffect(() => {
    if (stepIndex === 1 && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true;
      onSpeak(content.writtenText);
    }
    if (stepIndex !== 1) {
      hasAutoPlayed.current = false;
    }
  }, [stepIndex, content.writtenText, onSpeak]);

  switch (stepIndex) {
    case 0: // Written Text
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[240px] space-y-6">
          {/* <p className="text-sm font-body text-muted-foreground uppercase tracking-widest">
            Step 1 — Written Text
          </p> */}
          <motion.h3
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl md:text-4xl font-display font-bold text-foreground text-center"
          >
            {content.writtenText}
          </motion.h3>
          <p className="text-muted-foreground font-body text-2xl">
            Read the sentence carefully — it says "
            <em> {tableOf == 1 ? "one is" : "ones are"} </em>{tableOf==1?"":`", not "`}
            <em> {tableOf == 1 ? "" : "za"} </em>"
          </p>
        </div>
      );

    case 1: // Say It Aloud
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[240px] space-y-6">
          {/* <p className="text-sm font-body text-muted-foreground uppercase tracking-widest">
            Step 2 — Say It Out Aloud
          </p> */}
          <motion.h3
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl md:text-4xl font-display font-bold text-foreground text-center"
          >
            {content.writtenText}
          </motion.h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSpeak(content.writtenText)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-secondary text-secondary-foreground font-display font-semibold text-2xl hover:opacity-90 transition"
          >
            <Volume2 size={24} /> Let's Hear it Again 🔊
          </motion.button>
        </div>
      );

    case 2: // Addition Form
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[240px] space-y-6">
          {/* <p className="text-sm font-body text-muted-foreground uppercase tracking-widest">
            Step 3 — Addition Form
          </p> */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-3xl md:text-5xl font-display font-bold text-primary text-center"
          >
            {content.additionForm}
          </motion.div>
          <p className="text-muted-foreground font-body text-2xl text-center max-w-md">
            {`${
              tableOf == 1
                ? ""
                : `We add ${multipliedBy} ${numberWordsLower[tableOf] || tableOf} times.
            That makes ${tableOf * multipliedBy}!`
            } `}
          </p>
        </div>
      );

    case 3: // Graphical Representation
      // return (
      //   <div className="flex flex-col items-center justify-center h-full min-h-[240px] space-y-6">
      //     {/* <p className="text-sm font-body text-muted-foreground uppercase tracking-widest">
      //       Step 4 — Graphical Representation
      //     </p> */}
      //     <div className="flex flex-wrap items-center justify-center gap-2 text-4xl md:text-5xl">
      //       {content.graphicalIcons.map((icon, i) => (
      //         <motion.span
      //           key={i}
      //           initial={{ scale: 0, opacity: 0 }}
      //           animate={{ scale: 1, opacity: 1 }}
      //           transition={{ delay: i * 0.15 }}
      //           className="inline-flex items-center"
      //         >
      //           {i > 0 && (
      //             <span className="text-2xl text-muted-foreground mx-1 font-display">
      //               +
      //             </span>
      //           )}
      //           <span className="text-4xl md:text-5xl">{icon}</span>
      //         </motion.span>
      //       ))}
      //     </div>
      //   </div>
      // );

            return (
              <div className="flex flex-col items-center justify-center h-full min-h-[240px] space-y-6">
                {/* <p className="text-sm font-body text-muted-foreground uppercase tracking-widest">
                  Step 4 — Graphical Representation
                </p> */}
                <div className="flex flex-wrap items-center justify-center gap-2 text-4xl md:text-5xl">
                  {content.graphicalIcons.map((icon, i) => (
                    <motion.span
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.15 }}
                      className="inline-flex items-center"
                    >
                      {i > 0 && (
                        <span className="text-2xl text-muted-foreground mx-1 font-display">
                          +
                        </span>
                      )}
                      <img src={icon} alt="" className="w-28 h-28"/>
                    </motion.span>
                  ))}
                </div>
                {/* Representation label at bottom right */}
                <div className="w-full flex justify-end mt-4">
                  <p className="text-2xl  font-bold ">
                    {numberIcons[multipliedBy]?.represents}
                  </p>
                </div>
              </div>
            );

    case 4: // Array / Grid Form
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[240px] space-y-6">
          {/* <p className="text-sm font-body text-muted-foreground uppercase tracking-widest">
            Step 5 — Array / Grid Form
          </p> */}
          <div className="flex flex-col items-center gap-0.5">
            {Array.from({ length: 10 }, (_, row) => (
              <motion.div
                key={row}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: row * 0.05 }}
                className="flex gap-0.5"
              >
                {Array.from({ length: 10 }, (_, col) => {
                  const isFilled =
                    row < content.arrayRows && col < content.arrayCols;
                  return (
                    <motion.div
                      key={col}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: row * 0.03 + col * 0.02 }}
                      className={`w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-xs ${
                        isFilled
                          ? "bg-game-dot"
                          : "bg-white border border-border"
                      }`}
                    >
                      {isFilled ? <img src={smileImage} alt="Smile" className="w-full h-full object-contain" /> : ""}
                    </motion.div>
                  );
                })}
              </motion.div>
            ))}
          </div>
          <p className="text-muted-foreground font-body text-2xl text-center">
            {tableOf} {tableOf==1?"group":"groups"} of {multipliedBy} or {tableOf} times {multipliedBy}{" "}
            in the form of array look like this.
          </p>
        </div>
      );

    case 5: // Multiplication Form
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[240px] space-y-6">
          {/* <p className="text-sm font-body text-muted-foreground uppercase tracking-widest">
            Step 6 — Multiplication Form
          </p> */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-4xl md:text-6xl font-display font-bold text-primary"
          >
            {content.multiplicationForm}
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-muted-foreground font-body text-2xl text-center max-w-md"
          >
            Great job! You've learned this the B.H.A.R.A.T. way!
          </motion.p>
        </div>
      );

    default:
      return null;
  }
};

export default BharatStepContent;
