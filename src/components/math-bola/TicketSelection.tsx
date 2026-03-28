import { motion } from "framer-motion";
import { AgeGroup } from "@/data/mathBolaData";
import { useSound } from "@/contexts/SoundContext";
import tapSound from "@/assets/tapToOpenSound.mpeg";
import cardSelectImage from "@/assets/cardSelectImage.png";
import tambulaCardSelection1 from "@/assets/brainVideoGame3.mp4";

export const TICKET_COLORS = [
  "from-rose-500 to-pink-600 border-rose-400",
  "from-amber-400 to-orange-500 border-amber-300",
  "from-emerald-500 to-teal-600 border-emerald-400",
  "from-sky-400 to-blue-600 border-sky-300",
  "from-violet-500 to-purple-600 border-violet-400",
  "from-yellow-400 to-lime-500 border-yellow-300",
  "from-cyan-400 to-indigo-500 border-cyan-300",
  "from-fuchsia-500 to-pink-500 border-fuchsia-400",
  "from-orange-500 to-red-500 border-orange-400",
];

interface Props {
  age: AgeGroup;
  onSelect: (ticketIndex: number) => void;
}


export default function TicketSelection({ age, onSelect }: Props) {
  const { playSound } = useSound();

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-2 py-6 overflow-hidden">
      {/* ✅ Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={tambulaCardSelection1} type="video/mp4" />
      </video>

      {/* ✅ Dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* ✅ Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-20 text-center space-y-4 w-full"
      >
        
        <h2
          className="text-2xl md:text-5xl font-bold text-white"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Pick Your card!
        </h2>
        <h1
          className="text-white/80 text-2xl "
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span className="bg-yellow-400 px-3 py-1 rounded-sm">
            Choose one of the 9 MathBola cards
          </span>
        </h1>

        <div
          className="grid grid-cols-3 gap-3 w-full"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {Array.from({ length: 9 }).map((_, i) => {
            return (
              <motion.button
                key={i}
                initial={{ rotateY: 180, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{ delay: i * 0.08, type: "spring", damping: 12 }}
                onClick={() => {
                  playSound(tapSound);
                  onSelect(i);
                }}
                className={`relative aspect-[5/2] rounded-2xl border-2 overflow-hidden
                  bg-gradient-to-br ${TICKET_COLORS[i]}
                  shadow-lg hover:shadow-xl hover:scale-105 transition-all cursor-pointer group`}
              >
                <div className="absolute inset-0 flex items-center justify-center gap-3 text-white">
                  <div className="text-2xl group-hover:animate-bounce">
                    {/* 🎲 */}
                    <img src={cardSelectImage} alt="" className="w-18 h-20" />
                  </div>
                  <div className="flex flex-col items-start">
                    <div className="text-3xl font-bold tracking-widest opacity-80">
                      Let's play MathBola!
                    </div>
                    <div className="text-3xl font-bold mx-auto">
                      Card #{i + 1}
                    </div>
                  </div>
                </div>
                <div className="absolute inset-2 border-2 border-white/20 rounded-xl pointer-events-none" />
                <div className="absolute left-6 top-0 bottom-0 border-l-2 border-dashed border-white/20 pointer-events-none" />
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}




