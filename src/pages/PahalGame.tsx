// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft } from "lucide-react";
// import PrePahalSkill from "@/components/pahal/PrePahalSkill";
// import PahalPractice from "@/components/pahal/PahalPractice";

// type Phase = "pre-pahal" | "practice";

// const PahalGame = () => {
//   const [phase, setPhase] = useState<Phase>("pre-pahal");
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-background">
//       {/* <main className="container max-w-12xl py-1"> */}
//       <main className="w-full p-0">
//         <AnimatePresence mode="wait">
//           {phase === "pre-pahal" && (
//             <motion.div
//               key="pre-pahal"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//             >
//               <PrePahalSkill onComplete={() => setPhase("practice")} />
//             </motion.div>
//           )}

//           {phase === "practice" && (
//             <motion.div
//               key="practice"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//             >
//               <PahalPractice onBack={() => navigate("/")} />
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </main>
//     </div>
//   );
// };

// export default PahalGame;

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
// import { BookOpen, Trophy, Star, Lock } from "lucide-react";
import PrePahalSkill from "@/components/pahal/PrePahalSkill";
import PahalPractice from "@/components/pahal/PahalPractice";
import prePahalSkillImage from "@/assets/pahal/Pre_Pahal_Skill.png"
import SubtractionImage from "@/assets/pahal/Subtraction.png";
import PlaceValueImage from "@/assets/pahal/Place_value.png";
import AdditionImage from "@/assets/pahal/Addition.png";
import levelBg from "@/assets/pahal/Bg_level_select.jpg"
import blanksheetpaper from "@/assets/pahal/blank-sheet-paper.jpg"
import {
  ArrowLeft,
  BookOpen,
  Trophy,
  Star,
  Lock,
  Hash,
  Layers,
  Building2,
} from "lucide-react";

// type Phase = "level-select" | "pre-pahal" | "practice";
type Phase =
  | "level-select"
  | "pre-pahal"
  | "level-1-select"
  | "level-1-tens-ones"
  | "level-1-hto"
  | "level-1-thto"
  | "level-2"
  | "practice";
type PlaceValueCategory = "tens-ones" | "hto" | "thto";

const levels = [
  {
    id: "pre-pahal" as Phase,
    title: "Pre-PAHAL Skill",
    description: "Representation of numbers using hands",
    icon: prePahalSkillImage,
    color: "bg-accent",
    locked: false,
  },
  // {
  //   id: "practice" as Phase,
  //   title: "Level 1",
  //   description: "Place value",
  //   icon: PlaceValueImage,
  //   color: "bg-secondary",
  //   locked: false,
  // },
  {
    id: "level-1-select" as Phase, // ✅ "practice" se change karo
    title: "Level 1",
    description: "Place value",
    icon: PlaceValueImage,
    color: "bg-accent",
    locked: false,
  },
  // {
  //   id: "practice" as Phase,
  //   title: "Level 2",
  //   description: "Addition",
  //   icon: AdditionImage,
  //   color: "bg-accent",
  //   locked: false,
  // },
  // {
  //   id: "practice" as Phase,
  //   title: "Level 3",
  //   description: "Subtraction",
  //   icon: SubtractionImage,
  //   color: "bg-accent",
  //   locked: false,
  // },
];

const placeValueCategories = [
  {
    id: "tens-ones" as PlaceValueCategory,
    phase: "level-1-tens-ones" as Phase,
    title: "Tens and Ones",
    description: "Learn place value with Tens and Ones",
    icon: Hash,
    color: "bg-accent",
  },
  {
    id: "hto" as PlaceValueCategory,
    phase: "level-1-hto" as Phase,
    title: "Hundreds, Tens, and Ones",
    description: "Explore Hundreds place value",
    icon: Layers,
    color: "bg-accent",
  },
  {
    id: "thto" as PlaceValueCategory,
    phase: "level-1-thto" as Phase,
    title: "Thousands, Hundreds, Tens, and Ones",
    description: "Master Thousands place value",
    icon: Building2,
    color: "bg-accent",
  },
];

const PahalGame = () => {
  const [phase, setPhase] = useState<Phase>("level-select");
  const navigate = useNavigate();

   const handleBack = () => {
     if (phase === "level-select") {
       navigate("/");
     } else if (phase === "level-1-select") {
       setPhase("level-select");
     } else if (phase.startsWith("level-1-")) {
       setPhase("level-1-select");
     } else {
       setPhase("level-select");
     }
   };

  return (
    <div className="min-h-screen bg-background">
      <main className="w-full p-0">
        <AnimatePresence mode="wait">
          {phase === "level-select" && (
            <div className="relative w-full min-h-screen">
              {/* Background image */}
              <img
                src={levelBg}
                alt="background"
                className="absolute inset-0 w-full h-full object-cover z-0"
              />

              {/* Content */}
              <motion.div
                key="level-select"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative z-10 container max-w-12xl py-1"
              >
                <div className="text-center mb-8 mt-7">
                  <h2 className="text-3xl md:text-5xl font-display font-bold text-secondary">
                    Kindly select a level and begin your PAHAL Journey
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
                  {levels.map((level, index) => {
                    const Icon = level.icon;
                    return (
                      <button
                        key={index}
                        onClick={() => !level.locked && setPhase(level.id)}
                        disabled={level.locked}
                        className={`relative p-6 rounded-xl border-2 border-border bg-card game-card-shadow flex flex-col items-center justify-center  gap-3 transition-all ${
                          level.locked
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:border-primary/50 hover:scale-105 cursor-pointer"
                        }`}
                      >
                        {level.locked && (
                          <Lock
                            size={20}
                            className="absolute top-3 right-3 text-muted-foreground"
                          />
                        )}
                        <div
                          className={`w-14 h-14 rounded-full ${level.color} flex items-center justify-center`}
                        >
                          <img
                            src={Icon}
                            alt={`${level.title} icon`}
                            className="w-8 h-8"
                          />
                        </div>
                        <h3 className="text-4xl font-display font-bold text-foreground">
                          {level.title}
                        </h3>
                        <p className="text-3xl text-muted-foreground font-bold">
                          {level.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}

          {/* {phase === "level-1-select" && (
            <motion.div
              key="level-1-select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <div className="text-center mb-8 mt-5">
                <h2 className="text-2xl md:text-5xl font-display font-bold text-primary">
                  Level 1
                </h2>
                <p className="text-muted-foreground font-bold text-4xl mt-5">
                  Choose the place value you want to explore!
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {placeValueCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setPhase(cat.phase)}
                      className="relative p-6 rounded-xl border-2 border-border bg-card game-card-shadow flex flex-col items-center gap-3 transition-all hover:border-primary/50 hover:scale-105 cursor-pointer"
                    >
                      <div
                        className={`w-14 h-14 rounded-full ${cat.color} flex items-center justify-center`}
                      >
                        <Icon size={28} className="text-secondary" />
                      </div>
                      <h3 className="text-4xl font-display font-bold text-foreground">
                        {cat.title}
                      </h3>
                      <p className="text-2xl text-muted-foreground font-bold">
                        {cat.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )} */}

          {phase === "level-1-select" && (
            <div className="relative w-full min-h-screen">
              <img
                src={blanksheetpaper}
                alt="background"
                className="absolute inset-0 w-full h-full object-cover z-0"
              />

              <motion.div
                key="level-1-select"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative z-10"
              >
                <div className="text-center mb-8 mt-0">
                  <h2 className="text-2xl md:text-5xl font-display font-bold text-primary">
                    Level 1
                  </h2>
                  <p className="text-muted-foreground font-bold text-4xl mt-5">
                    Choose the place value you want to explore!
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-5xl mx-auto">
                  {placeValueCategories.map((cat) => {
                    const Icon = cat.icon;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setPhase(cat.phase)}
                        className="relative p-6 rounded-xl border-2 border-border bg-card game-card-shadow flex flex-col items-center gap-3 transition-all hover:border-primary/50 hover:scale-105 cursor-pointer"
                      >
                        <div
                          className={`w-14 h-14 rounded-full ${cat.color} flex items-center justify-center`}
                        >
                          <Icon size={28} className="text-secondary" />
                        </div>
                        <h3 className="text-4xl font-display font-bold text-foreground">
                          {cat.title}
                        </h3>
                        <p className="text-2xl text-muted-foreground font-bold">
                          {cat.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          )}

          {phase === "pre-pahal" && (
            <motion.div
              key="pre-pahal"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PrePahalSkill onComplete={() => setPhase("level-select")} />
            </motion.div>
          )}

          {/* {phase === "level-1-select" && (
            <motion.div
              key="level-1-select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="container max-w-3xl py-6"
            >
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">
                  Level 1
                </h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Choose the place value you want to explore!
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                {placeValueCategories.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setPhase(cat.phase)}
                      className="relative p-6 rounded-xl border-2 border-border bg-card game-card-shadow flex flex-col items-center gap-3 transition-all hover:border-primary/50 hover:scale-105 cursor-pointer"
                    >
                      <div
                        className={`w-14 h-14 rounded-full ${cat.color} flex items-center justify-center`}
                      >
                        <Icon size={28} className="text-primary-foreground" />
                      </div>
                      <h3 className="text-lg font-display font-bold text-foreground">
                        {cat.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {cat.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )} */}

          {phase === "practice" && (
            <motion.div
              key="practice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PahalPractice
                onBack={() => setPhase("level-select")}
                onPlayAgain={() => setPhase("level-1-select")}
              />
            </motion.div>
          )}

          {(phase === "level-1-tens-ones" ||
            phase === "level-1-hto" ||
            phase === "level-1-thto") && (
            <motion.div
              key={phase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PahalPractice
                category={
                  phase === "level-1-tens-ones"
                    ? "tens-ones"
                    : phase === "level-1-hto"
                      ? "hto"
                      : "thto"
                }
                onBack={() => setPhase("level-select")}
                onPlayAgain={() => setPhase("level-1-select")}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default PahalGame;

// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft, BookOpen, Trophy, Star, Lock } from "lucide-react";
// import PrePahalSkill from "@/components/pahal/PrePahalSkill";
// import PahalPractice from "@/components/pahal/PahalPractice";

// type Phase = "level-select" | "pre-pahal" | "level-1" | "level-2";

// const levels = [
//   {
//     id: "pre-pahal" as Phase,
//     title: "Pre-PAHAL Skill",
//     description: "Learn number representation using hands",
//     icon: BookOpen,
//     color: "bg-accent",
//     locked: false,
//   },
//   {
//     id: "level-1" as Phase,
//     title: "Level 1",
//     description: "Ones, Tens & Place Value basics",
//     icon: Star,
//     color: "bg-primary",
//     locked: false,
//   },
//   {
//     id: "level-2" as Phase,
//     title: "Level 2",
//     description: "Advanced place value & comparison",
//     icon: Trophy,
//     color: "bg-game-done",
//     locked: true,
//   },
// ];

// const PahalGame = () => {
//   const [phase, setPhase] = useState<Phase>("level-select");
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-background">
//       <header className="bg-primary px-4 py-3 flex items-center gap-4">
//         <button
//           onClick={() =>
//             phase === "level-select" ? navigate("/") : setPhase("level-select")
//           }
//           className="text-primary-foreground hover:opacity-80 transition"
//         >
//           <ArrowLeft size={24} />
//         </button>
//         <div>
//           <h1 className="text-xl md:text-2xl text-primary-foreground font-bold tracking-tight">
//             P.A.H.A.L
//           </h1>
//           <p className="text-primary-foreground/80 text-xs md:text-sm">
//             Place Value, Addition, Hands-on grouping, and Lending
//           </p>
//         </div>
//       </header>

//       <main className="container max-w-6xl py-6">
//         <AnimatePresence mode="wait">
//           {phase === "level-select" && (
//             <motion.div
//               key="level-select"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//             >
//               <div className="text-center mb-8">
//                 <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">
//                   Choose a Level
//                 </h2>
//                 <p className="text-muted-foreground text-sm mt-1">
//                   Select where you want to start
//                 </p>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
//                 {levels.map((level) => {
//                   const Icon = level.icon;
//                   return (
//                     <button
//                       key={level.id}
//                       onClick={() => !level.locked && setPhase(level.id)}
//                       disabled={level.locked}
//                       className={`relative p-6 rounded-xl border-2 border-border bg-card game-card-shadow flex flex-col items-center gap-3 transition-all ${
//                         level.locked
//                           ? "opacity-50 cursor-not-allowed"
//                           : "hover:border-primary/50 hover:scale-105 cursor-pointer"
//                       }`}
//                     >
//                       {level.locked && (
//                         <Lock
//                           size={20}
//                           className="absolute top-3 right-3 text-muted-foreground"
//                         />
//                       )}
//                       <div
//                         className={`w-14 h-14 rounded-full ${level.color} flex items-center justify-center`}
//                       >
//                         <Icon size={28} className="text-primary-foreground" />
//                       </div>
//                       <h3 className="text-lg font-display font-bold text-foreground">
//                         {level.title}
//                       </h3>
//                       <p className="text-xs text-muted-foreground">
//                         {level.description}
//                       </p>
//                     </button>
//                   );
//                 })}
//               </div>
//             </motion.div>
//           )}

//           {phase === "pre-pahal" && (
//             <motion.div
//               key="pre-pahal"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//             >
//               <PrePahalSkill onComplete={() => setPhase("level-select")} />
//             </motion.div>
//           )}

//           {phase === "level-1" && (
//             <motion.div
//               key="level-1"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//             >
//               <PahalPractice onBack={() => setPhase("level-select")} />
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </main>
//     </div>
//   );
// };

// export default PahalGame;


// import { useState } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { ArrowLeft, BookOpen, Trophy, Star, Lock } from "lucide-react";
// import PrePahalSkill from "@/components/pahal/PrePahalSkill";
// import PahalPractice from "@/components/pahal/PahalPractice";

// type Phase = "level-select" | "pre-pahal" | "level-1" | "level-2";

// const levels = [
//   {
//     id: "pre-pahal" as Phase,
//     title: "Pre-PAHAL Skill",
//     description: "Learn number representation using hands",
//     icon: BookOpen,
//     color: "bg-accent",
//     locked: false,
//   },
//   {
//     id: "level-1" as Phase,
//     title: "Level 1",
//     description: "Ones, Tens & Place Value basics",
//     icon: Star,
//     color: "bg-primary",
//     locked: false,
//   },
//   {
//     id: "level-2" as Phase,
//     title: "Level 2",
//     description: "Advanced place value & comparison",
//     icon: Trophy,
//     color: "bg-game-done",
//     locked: true,
//   },
// ];

// const PahalGame = () => {
//   const [phase, setPhase] = useState<Phase>("level-select");
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-background">
//       <header className="bg-primary px-4 py-3 flex items-center gap-4">
//         <button
//           onClick={() =>
//             phase === "level-select" ? navigate("/") : setPhase("level-select")
//           }
//           className="text-primary-foreground hover:opacity-80 transition"
//         >
//           <ArrowLeft size={24} />
//         </button>
//         <div>
//           <h1 className="text-xl md:text-2xl text-primary-foreground font-bold tracking-tight">
//             P.A.H.A.L
//           </h1>
//           <p className="text-primary-foreground/80 text-xs md:text-sm">
//             Place Value, Addition, Hands-on grouping, and Lending
//           </p>
//         </div>
//       </header>

//       <main className="container max-w-6xl py-6">
//         <AnimatePresence mode="wait">
//           {phase === "level-select" && (
//             <motion.div
//               key="level-select"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//             >
//               <div className="text-center mb-8">
//                 <h2 className="text-2xl md:text-3xl font-display font-bold text-primary">
//                   Choose a Level
//                 </h2>
//                 <p className="text-muted-foreground text-sm mt-1">
//                   Select where you want to start
//                 </p>
//               </div>
//               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
//                 {levels.map((level) => {
//                   const Icon = level.icon;
//                   return (
//                     <button
//                       key={level.id}
//                       onClick={() => !level.locked && setPhase(level.id)}
//                       disabled={level.locked}
//                       className={`relative p-6 rounded-xl border-2 border-border bg-card game-card-shadow flex flex-col items-center gap-3 transition-all ${
//                         level.locked
//                           ? "opacity-50 cursor-not-allowed"
//                           : "hover:border-primary/50 hover:scale-105 cursor-pointer"
//                       }`}
//                     >
//                       {level.locked && (
//                         <Lock
//                           size={20}
//                           className="absolute top-3 right-3 text-muted-foreground"
//                         />
//                       )}
//                       <div
//                         className={`w-14 h-14 rounded-full ${level.color} flex items-center justify-center`}
//                       >
//                         <Icon size={28} className="text-primary-foreground" />
//                       </div>
//                       <h3 className="text-lg font-display font-bold text-foreground">
//                         {level.title}
//                       </h3>
//                       <p className="text-xs text-muted-foreground">
//                         {level.description}
//                       </p>
//                     </button>
//                   );
//                 })}
//               </div>
//             </motion.div>
//           )}

//           {phase === "pre-pahal" && (
//             <motion.div
//               key="pre-pahal"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//             >
//               <PrePahalSkill onComplete={() => setPhase("level-select")} />
//             </motion.div>
//           )}

//           {phase === "level-1" && (
//             <motion.div
//               key="level-1"
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//             >
//               <PahalPractice onBack={() => setPhase("level-select")} />
//             </motion.div>
//           )}
//         </AnimatePresence>
//       </main>
//     </div>
//   );
// };

// export default PahalGame;
