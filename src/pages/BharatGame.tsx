import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { TABLES_RANGE } from "@/data/bharatGameData";
import BharatTableSelector from "@/components/Bharat/BharatTableSelector";
import BharatGamePlay from "@/components/Bharat/BharatGamePlay";
import video from "@/assets/Bharat/game4bg.mp4"

const BharatGame = () => {
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [level, setLevel] = useState<1 | 2>(1);
  const navigate = useNavigate();

  // return (
  //   <div className="min-h-screen bg-background">
  //     {/* Header */}
    

  //     <main className="container max-w-6xl py-6">
  //       <AnimatePresence mode="wait">
  //         {!selectedTable ? (
  //           <motion.div
  //             key="selector"
  //             initial={{ opacity: 0, y: 20 }}
  //             animate={{ opacity: 1, y: 0 }}
  //             exit={{ opacity: 0, y: -20 }}
  //           >
  //             <BharatTableSelector
  //               tables={TABLES_RANGE}
  //               onSelect={(t) => setSelectedTable(t)}
  //               level={level}
  //               onLevelChange={setLevel}
  //             />
  //           </motion.div>
  //         ) : (
  //           <motion.div
  //             key="gameplay"
  //             initial={{ opacity: 0, y: 20 }}
  //             animate={{ opacity: 1, y: 0 }}
  //             exit={{ opacity: 0, y: -20 }}
  //             // className="bg-slate-800"
  //           >
  //             <BharatGamePlay
  //               tableOf={selectedTable}
  //               level={level}
  //               onBack={() => setSelectedTable(null)}
  //             />
  //           </motion.div>
  //         )}
  //       </AnimatePresence>
  //     </main>
  //   </div>
  // );
  return (
    <div className="relative min-h-screen w-full">
      {/* Background Video — only shows when BharatGamePlay is active */}
      {/* {selectedTable && (
        <video
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover -z-0"
          style={{ height: "100vh", top: 0 }}
        >
          <source src={video} type="video/mp4" />
        </video>
      )} */}
      {selectedTable && (
  <video
    autoPlay
    loop
    muted
    playsInline
    className="absolute w-full bottom-0 object-cover "
  >
    <source src={video} type="video/mp4" />
  </video>
)}

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
