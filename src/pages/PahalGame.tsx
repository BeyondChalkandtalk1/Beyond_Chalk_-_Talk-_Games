import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PrePahalSkill from "@/components/pahal/PrePahalSkill";
import PahalPractice from "@/components/pahal/PahalPractice";

type Phase = "pre-pahal" | "practice";

const PahalGame = () => {
  const [phase, setPhase] = useState<Phase>("pre-pahal");
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary px-4 py-3 flex items-center gap-4">
        <button
          onClick={() => navigate("/")}
          className="text-primary-foreground hover:opacity-80 transition"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-xl md:text-2xl text-primary-foreground font-bold tracking-tight">
            P.A.H.A.L
          </h1>
          <p className="text-primary-foreground/80 text-xs md:text-sm">
            Place Value, Addition, Hands-on grouping, and Lending
          </p>
        </div>
      </header>

      <main className="container max-w-6xl py-6">
        <AnimatePresence mode="wait">
          {phase === "pre-pahal" && (
            <motion.div
              key="pre-pahal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PrePahalSkill onComplete={() => setPhase("practice")} />
            </motion.div>
          )}

          {phase === "practice" && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PahalPractice onBack={() => navigate("/")} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default PahalGame;
