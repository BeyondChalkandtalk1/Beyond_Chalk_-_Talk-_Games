import { motion } from "framer-motion";
import { AgeGroup } from "@/data/mathboladata";
import { useSound } from "@/contexts/SoundContext";
import tapSound from "@/assets/tapToOpenSound.mpeg";

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

export default function AgeSelection({ onSelect }: Props) {
  const { playSound } = useSound();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10 p-6">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", damping: 15 }}
        className="text-center space-y-8 max-w-lg w-full"
      >
        <div className="text-5xl">🎯</div>
        <h1
          className="text-3xl md:text-4xl font-bold text-secondary"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Math Bola
        </h1>
        <p
          className="text-lg text-muted-foreground"
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
              className="bg-card border-2 border-primary/20 rounded-2xl p-6 space-y-3 hover:border-primary hover:shadow-lg transition-all hover:scale-105"
            >
              <div className="text-4xl">{opt.emoji}</div>
              <div
                className="text-xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {opt.label}
              </div>
              <div className="text-sm text-muted-foreground">{opt.desc}</div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
