import { motion } from "framer-motion";
import { AgeGroup } from "@/data/mathBolaData";
import { useSound } from "@/contexts/SoundContext";
import tapSound from "@/assets/tapToOpenSound.mpeg";
import ageSelection from "@/assets/ageSelectionVideo.mp4";

interface Props {
  onSelect: (age: AgeGroup) => void;
}

const ageOptions: {
  value: AgeGroup;
  label: string;
  emoji: string;
  desc: string;
}[] = [
  {
    value: "7",
    label: "6-7  Years",
    emoji: "🧒",
    desc: "Addition & Subtraction",
  },
  {
    value: "8",
    label: "7-8 Years",
    emoji: "👦",
    desc: "Multiplication & Division",
  },
  { value: "9+", label: "8-9 Years", emoji: "🧑", desc: "Mixed Operations" },
];

// export default function AgeSelection({ onSelect }: Props) {
//   const { playSound } = useSound();

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10 p-6">
      
//       <motion.div
//         initial={{ scale: 0.8, opacity: 0 }}
//         animate={{ scale: 1, opacity: 1 }}
//         transition={{ type: "spring", damping: 15 }}
//         className="text-center space-y-8 max-w-lg w-full"
//       >
//         <div className="text-5xl">🎯</div>
//         <h1
//           className="text-3xl md:text-4xl font-bold text-secondary"
//           style={{ fontFamily: "var(--font-display)" }}
//         >
//          Let's play MathBola
//         </h1>
//         <p
//           className="text-lg text-muted-foreground"
//           style={{ fontFamily: "var(--font-body)" }}
//         >
//           Select your age group to start playing!
//         </p>

//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//           {ageOptions.map((opt, i) => (
//             <motion.button
//               key={opt.value}
//               initial={{ y: 30, opacity: 0 }}
//               animate={{ y: 0, opacity: 1 }}
//               transition={{ delay: i * 0.15 }}
//               onClick={() => {
//                 playSound(tapSound);
//                 onSelect(opt.value);
//               }}
//               className="bg-card border-2 border-primary/20 rounded-2xl p-6 space-y-3 hover:border-primary hover:shadow-lg transition-all hover:scale-105"
//             >
//               {/* <div className="text-4xl">{opt.emoji}</div> */}
//               <div
//                 className="text-xl font-bold text-foreground"
//                 style={{ fontFamily: "var(--font-display)" }}
//               >
//                 {opt.label}
//               </div>
//               <div className="text-sm text-muted-foreground">{opt.desc}</div>
//             </motion.button>
//           ))}
//         </div>
//       </motion.div>
//     </div>
//   );
// }

export default function AgeSelection({ onSelect }: Props) {
  const { playSound } = useSound();

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* ✅ Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={ageSelection} type="video/mp4" />
      </video>

      {/* ✅ Optional dark overlay — video ke upar thoda dim effect */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* ✅ Content — video ke upar */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="relative z-20 text-center space-y-8 max-w-lg w-full"
      >
        <div className="text-5xl">🎯</div>
        <h1
          className="text-3xl md:text-4xl font-bold text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Let's play MathBola!
        </h1>
        <p
          className="text-2xl text-white bg-yellow-500 p-1 rounded-sm"
          style={{ fontFamily: "var(--font-body)" }}
        >
          Select your age group to start playing!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {ageOptions.map((opt, i) => (
            <motion.button
              key={opt.value}
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.15 }}
              onClick={() => {
                playSound(tapSound);
                onSelect(opt.value);
              }}
              className="bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-2xl p-6 space-y-3 hover:border-white hover:shadow-lg transition-all hover:scale-105"
            >
              <div
                className="text-xl font-bold text-white"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {opt.label}
              </div>
              <div className="text-sm text-white/80">{opt.desc}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
