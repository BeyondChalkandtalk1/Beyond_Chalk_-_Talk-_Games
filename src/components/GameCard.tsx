// import { Link } from "react-router-dom";
// import { useState } from "react";
// import { CalendarDays, BookOpen, GraduationCap, Play } from "lucide-react";

// const iconMap = {
//   primary: <CalendarDays className="w-8 h-8 text-primary-foreground" />,
// };

// const GameCard = ({
//   title,
//   description,
//   emoji,
//   path,
//   color,
//   about_game,
//   learning_object,
// }) => {
//   const [showAbout, setShowAbout] = useState(false);
//   const [showLearning, setShowLearning] = useState(false);

//   return (
//     <Link to={path} className="group block">
//       <div
//         className="relative rounded-3xl p-6 pb-5 transition-all duration-300 hover:scale-[1.03] bg-card border-2 border-border hover:border-primary overflow-hidden"
//         style={{ boxShadow: "var(--shadow-card)" }}
//       >
//         {/* Age badge - top right */}
//         <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-primary/15 border-2 border-primary flex flex-col items-center justify-center">
//           <span className="font-display text-sm font-extrabold text-primary leading-none">7+</span>
//           <span className="font-body text-[9px] font-bold text-primary/70 leading-none">years</span>
//         </div>

//         {/* Icon */}
//         <div
//           className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4 group-hover:animate-wiggle shadow-md"
//         >
//           {iconMap[color] || <span className="text-2xl">{emoji}</span>}
//         </div>

//         <h3 className="font-display text-lg font-bold text-foreground mb-1 pr-16">
//           {title}
//         </h3>
//         <p className="text-sm text-muted-foreground font-body mb-4 leading-relaxed">
//           {description}
//         </p>

//         <div className="flex flex-col gap-2">
//           {/* Aim */}
//           <div
//             onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowAbout((v) => !v); }}
//             onMouseEnter={() => setShowAbout(true)}
//             onMouseLeave={() => setShowAbout(false)}
//           >
//             <button
//               type="button"
//               className={`w-full flex items-center gap-2 text-left px-4 py-2.5 rounded-xl border-2 transition-all duration-300 cursor-pointer font-display text-sm font-bold ${
//                 showAbout
//                   ? "border-primary bg-primary/10 text-primary"
//                   : "border-border bg-muted/40 text-foreground hover:border-primary/50 hover:bg-primary/5"
//               }`}
//             >
//               <BookOpen className="w-4 h-4 flex-shrink-0" /> Aim
//             </button>
//             <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showAbout ? "max-h-40 opacity-100 mt-1.5" : "max-h-0 opacity-0"}`}>
//               <p className="text-xs text-muted-foreground font-body bg-muted/30 rounded-xl p-3 border border-border leading-relaxed">
//                 {about_game}
//               </p>
//             </div>
//           </div>

//           {/* Learning objective */}
//           <div
//             onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowLearning((v) => !v); }}
//             onMouseEnter={() => setShowLearning(true)}
//             onMouseLeave={() => setShowLearning(false)}
//           >
//             <button
//               type="button"
//               className={`w-full flex items-center gap-2 text-left px-4 py-2.5 rounded-xl border-2 transition-all duration-300 cursor-pointer font-display text-sm font-bold ${
//                 showLearning
//                   ? "border-accent bg-accent/10 text-accent-foreground"
//                   : "border-border bg-muted/40 text-foreground hover:border-accent/50 hover:bg-accent/5"
//               }`}
//             >
//               <GraduationCap className="w-4 h-4 flex-shrink-0" /> Learning objective
//             </button>
//             <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showLearning ? "max-h-60 opacity-100 mt-1.5" : "max-h-0 opacity-0"}`}>
//               <div className="text-xs text-muted-foreground font-body bg-muted/30 rounded-xl p-3 border border-border">
//                 <p className="font-semibold mb-2 text-foreground">{learning_object?.heading}</p>
//                 <ul className="list-decimal pl-4 space-y-1">
//                   {learning_object?.points?.map((item, index) => (
//                     <li key={index}>{item}</li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-5 flex items-center gap-2 text-primary font-display text-sm font-bold group-hover:gap-3 transition-all duration-300">
//           <Play className="w-4 h-4 fill-primary" /> Play Now →
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default GameCard;

// ----------------------
// import { Link } from "react-router-dom";
// import { useState } from "react";
// import { CalendarDays, BookOpen, GraduationCap, Play } from "lucide-react";

// const iconMap = {
//   primary: <CalendarDays className="w-8 h-8 text-white" />,
// };

// const GameCard = ({
//   title,
//   description,
//   emoji,
//   path,
//   color,
//   about_game,
//   learning_object,
// }) => {
//   const [showAbout, setShowAbout] = useState(false);
//   const [showLearning, setShowLearning] = useState(false);

//   return (
//     <Link
//     to={path}
//     className="group block">
//       <div
//         className="relative rounded-3xl p-6 pb-5 transition-all duration-300 hover:scale-105
//         bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100
//         border-4 border-white shadow-xl hover:shadow-2xl overflow-hidden"
//       >
//         {/* Decorative Blobs */}
//         <div className="absolute -top-6 -left-6 w-24 h-24 bg-pink-300 rounded-full blur-3xl opacity-30"></div>
//         <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-300 rounded-full blur-3xl opacity-30"></div>

//         {/* Age Badge */}
//         <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-yellow-300 border-4 border-white shadow-lg flex flex-col items-center justify-center animate-pulse">
//           <span className="text-sm font-extrabold text-purple-700 leading-none">
//             7+
//           </span>
//           <span className="text-[9px] font-bold text-purple-600 leading-none">
//             years
//           </span>
//         </div>

//         {/* Icon */}
//         <div
//           className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-purple-400 to-pink-400
//           flex items-center justify-center mb-4 shadow-lg group-hover:animate-bounce"
//         >
//           {iconMap[color] || (
//             <span className="text-3xl text-white">{emoji}</span>
//           )}
//         </div>

//         {/* Title */}
//         <h3 className="text-lg font-extrabold text-purple-700 mb-1 pr-16 drop-shadow-sm">
//           {title}
//         </h3>

//         {/* Description */}
//         <p className="text-sm text-purple-800 mb-4 leading-relaxed">
//           {description}
//         </p>

//         <div className="flex flex-col gap-3">
//           <div
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               setShowAbout((v) => !v);
//             }}
//           >
//             <button
//               type="button"
//               className={`w-full flex items-center gap-2 text-left px-4 py-2.5 rounded-2xl font-bold transition-all duration-300 ${
//                 showAbout
//                   ? "bg-pink-300 text-white shadow-md"
//                   : "bg-white text-purple-700 hover:bg-pink-100 shadow"
//               }`}
//             >
//               <BookOpen className="w-4 h-4" /> 🎯 Aim
//             </button>

//             <div
//               className={`overflow-hidden transition-all duration-300 ${
//                 showAbout ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
//               }`}
//             >
//               <p className="text-xs text-purple-800 bg-white/70 rounded-xl p-3 mt-1 shadow">
//                 {about_game}
//               </p>
//             </div>
//           </div>

//           <div
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               setShowLearning((v) => !v);
//             }}
//           >
//             <button
//               type="button"
//               className={`w-full flex items-center gap-2 text-left px-4 py-2.5 rounded-2xl font-bold transition-all duration-300 ${
//                 showLearning
//                   ? "bg-blue-300 text-white shadow-md"
//                   : "bg-white text-purple-700 hover:bg-blue-100 shadow"
//               }`}
//             >
//               <GraduationCap className="w-4 h-4" /> 🎓 Learning
//             </button>

//             <div
//               className={`overflow-hidden transition-all duration-300 ${
//                 showLearning ? "max-h-60 opacity-100 mt-2" : "max-h-0 opacity-0"
//               }`}
//             >
//               <div className="text-xs text-purple-800 bg-white/70 rounded-xl p-3 shadow">
//                 <p className="font-bold mb-2">{learning_object?.heading}</p>
//                 <ul className="list-decimal pl-4 space-y-1">
//                   {learning_object?.points?.map((item, index) => (
//                     <li key={index}>{item}</li>
//                   ))}
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Play Button */}
//         <div
//           className="mt-5 flex items-center justify-center gap-2
//           bg-green-400 text-white py-2 rounded-2xl font-bold shadow-md
//           group-hover:scale-105 transition-all duration-300"
//         >
//           <Play className="w-4 h-4 fill-white" /> 🎮 Play Now
//         </div>
//       </div>
//     </Link>
//   );
// };

// export default GameCard;



// const iconMap = {
//   primary: <CalendarDays className="w-8 h-8 text-white" />,
// };

// ------------------------
// const iconMap = {
//   primary: (
//     <div className="relative w-14 h-10 bg-white rounded-lg flex flex-col items-center justify-center shadow-md">
//       <div className="w-full bg-red-400 text-white text-[14px] font-bold rounded-t-md text-center">
//         MONTH
//       </div>
//       <div className="text-sm font-extrabold text-purple-700 leading-none">
//         12
//       </div>
//     </div>
//   ),
// };


import { Link } from "react-router-dom";
import { useState } from "react";
import { CalendarDays, Play } from "lucide-react";
const iconMap = {
  primary: (levels) => (
    <div className="relative w-20 h-20 bg-white rounded-xl flex flex-col items-center justify-center shadow-lg border-2 border-yellow-300">
      <div className="w-full bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400 text-white text-[17px] font-bold rounded-t-xl text-center">
        Number of levels
      </div>
      <div className="text-2xl font-extrabold text-secondary leading-none">
        {levels}
      </div>
      {/* <span className="absolute -top-1 -right-1 text-xs">🌈</span> */}
    </div>
  ),
};

const GameCard = ({
  title,
  description,
  emoji,
  path,
  color,
  about_game,
  learning_object,
  levels,
  age
}) => {
  const [activeSection, setActiveSection] = useState(null);

  return (
    <Link
      to={path}
      className="group block h-full"
      style={{ fontFamily: "'Times New Roman', var(--font-body)" }}
    >
      {/* <div
      className="group block"
      style={{ fontFamily: "'Times New Roman', var(--font-body)" }}
    > */}
      <div
        className="relative rounded-3xl p-6 pb-5 transition-all duration-300 hover:scale-105 
        bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 
        border-4 border-white shadow-xl hover:shadow-2xl overflow-hidden h-full flex flex-col"
      >
        {/* Decorative Background Blobs */}
        <div className="absolute -top-6 -left-6 w-24 h-24 bg-pink-300 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-300 rounded-full blur-3xl opacity-30"></div>

        {/* Age Badge */}
        <div className="absolute top-4 right-4 w-16 h-16 rounded-full bg-yellow-300  shadow-lg flex flex-col items-center justify-center animate-pulse">
          <span className="text-xl font-extrabold text-purple-700 leading-none">
            {age}
          </span>
          <span className="text-[18px] font-bold text-purple-600 leading-none">
            years
          </span>
        </div>

        {/* Icon */}
        <div
          className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-yellow-300 via-orange-300 to-pink-300
          flex items-center justify-center mb-4 shadow-lg group-hover:animate-bounce"
        >
          {/* {iconMap[color] || (
            <span className="text-3xl text-white">{emoji}</span>
          )} */}
          {iconMap[color] ? (
            iconMap[color](levels)
          ) : (
            <span className="text-3xl text-white">{emoji}</span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-2xl font-extrabold  text-secondary mb-1 pr-16 drop-shadow-sm">
          {title}
        </h3>

        {/* Description */}
        <p className="text-xl text-secondary mb-4 leading-relaxed">
          {description}
        </p>

        {/* ================= Sections ================= */}
        <div className="mt-3">
          {/* Buttons Row */}
          <div className="flex gap-3">
            {/* Aim Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveSection(activeSection === "aim" ? null : "aim");
              }}
              className={`flex-1 px-4 py-2.5 rounded-2xl text-xl font-bold transition-all duration-300 ${
                activeSection === "aim"
                  ? "bg-pink-400 text-white shadow-md"
                  : "bg-white text-secondary hover:bg-pink-100 shadow"
              }`}
            >
              🎯 Aim
            </button>

            {/* Learning Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveSection(
                  activeSection === "learning" ? null : "learning",
                );
              }}
              className={`flex-1 px-4 py-2.5 rounded-2xl text-xl font-bold transition-all whitespace-nowrap duration-300 ${
                activeSection === "learning"
                  ? "bg-blue-400 text-white shadow-md"
                  : "bg-white text-secondary hover:bg-blue-100 shadow"
              }`}
            >
              🎓 Learning Outcomes
            </button>
          </div>

          {/* Full Width Expand Section */}
          <div
            className={`overflow-hidden transition-all duration-300 ${
              activeSection ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0"
            }`}
          >
            {activeSection === "aim" && (
              <div className="text-lg text-black bg-white/80 rounded-xl p-4 shadow">
                {about_game}
              </div>
            )}

            {activeSection === "learning" && (
              <div className="text-lg text-black bg-white/80 rounded-xl p-4 shadow">
                <p className="font-bold mb-2">{learning_object?.heading}</p>

                <ul className="list-decimal pl-4 space-y-1 max-h-40 overflow-y-auto hide-scrollbar pr-2">
                  {learning_object?.points?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Play Button */}
        <div
          className="mt-auto pt-5 flex items-center justify-center gap-2 
          bg-green-400 text-white py-2 rounded-2xl font-bold shadow-md text-xl
          group-hover:scale-105 transition-all duration-300"
        >
          <Play className="w-4 h-4 fill-white" /> 🎮 Play Now
        </div>
      </div>
    </Link>
  );
};

export default GameCard;