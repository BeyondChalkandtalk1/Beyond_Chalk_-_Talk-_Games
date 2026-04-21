import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TABLES_RANGE } from "@/data/bharatGameData";
import BharatTableSelector from "@/components/Bharat/BharatTableSelector";
import BharatGamePlay from "@/components/Bharat/BharatGamePlay";
import video from "@/assets/Bharat/game4bg.mp4";

const BharatGame = () => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [bgLoaded, setBgLoaded] = useState(false);

  // Preload all table images as soon as component mounts
  useEffect(() => {
    TABLES_RANGE.forEach((t) => {
      if (t.image) {
        const img = new Image();
        img.src = t.image;
      }
    });
  }, []);

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Video — preload always, show when gameplay active */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onCanPlay={() => setBgLoaded(true)}
        className={`absolute w-full bottom-0 object-cover transition-opacity duration-500 ${
          selectedTable && bgLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ pointerEvents: "none" }}
      >
        <source src={video} type="video/mp4" />
      </video>

      <main className="relative z-10 container max-w-9xl py-6">
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
                level={1}
                onLevelChange={() => {}}
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
                level={1}
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