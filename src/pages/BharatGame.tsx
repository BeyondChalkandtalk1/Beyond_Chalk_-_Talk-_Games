import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { TABLES_RANGE } from "@/data/bharatGameData";
import BharatTableSelector from "@/components/Bharat/BharatTableSelector";
import BharatGamePlay from "@/components/Bharat/BharatGamePlay";

const BharatGame = () => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [level, setLevel] = useState<1 | 2>(1);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
    

      <main className="container max-w-6xl py-6">
        <AnimatePresence mode="wait">
          {!selectedTable ? (
            <motion.div
              key="selector"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <BharatTableSelector
                tables={TABLES_RANGE}
                onSelect={(t) => setSelectedTable(t)}
                level={level}
                onLevelChange={setLevel}
              />
            </motion.div>
          ) : (
            <motion.div
              key="gameplay"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <BharatGamePlay
                tableOf={selectedTable}
                level={level}
                onBack={() => setSelectedTable(null)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default BharatGame;
