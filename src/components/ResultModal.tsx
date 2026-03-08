import { useEffect } from "react";
import Level2CompleteVideo from "../assets/Level2CompleteVideo.mp4";
import generalSound from "../assets/general-sound.mpeg";
// const ResultModal = ({
//   isOpen,
//   result,
//   score,
//   total,
//   onClose,
//   onPlayAgain,
// }) => {
//   if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 z-40 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
//       <div
//         className={`rounded-3xl p-8 max-w-sm w-full mx-4 text-center animate-bounce-in ${
//           result === "win" ? "bg-card" : "bg-card"
//         }`}
//         style={{ boxShadow: "var(--shadow-hover)" }}
//       >
//         <div className="text-7xl mb-4 animate-float">
//           {result === "win" ? "🎉" : "🎉"}
//         </div>

//         <h2 className="font-display text-3xl font-bold mb-2 text-foreground">
//           {result === "win" ? "Very nice! 🌟" : "Well tried!!😊"}
//         </h2>

//         <p className="text-muted-foreground font-bold mb-4 text-xl ">
//           {result === "win"
//             ? "You got it right! You're a champion! 🏆"
//             : " You can try again !  🎉"}
//         </p>

//         <div
//           className={`inline-block px-6 py-3 rounded-2xl font-display text-2xl font-bold mb-6 ${
//             result === "win"
//               ? "bg-success text-success-foreground"
//               : "bg-destructive text-destructive-foreground"
//           }`}
//         >
//           Score: {score}/{total}
//         </div>

//         <div className="flex gap-3 justify-center">
//           <button
//             onClick={onPlayAgain}
//             className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-xl hover:opacity-90 transition-opacity"
//           >
//             🔄 Try again
//           </button>
//           <button
//             onClick={onClose}
//             className="px-6 py-3 rounded-xl bg-muted text-muted-foreground font-display font-bold text-xl hover:opacity-80 transition-opacity"
//           >
//             🏠 Home
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResultModal;

const ResultModal = ({
  isOpen,
  result,
  score,
  total,
  onClose,
  onPlayAgain,
}) => {
  useEffect(() => {
    if (!isOpen) return;
    const audio = new Audio(generalSound);
    audio.play().catch(() => {});
    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
      <div
        className="rounded-3xl p-8 max-w-lg w-full mx-4 text-center animate-bounce-in bg-card"
        style={{ boxShadow: "var(--shadow-hover)" }}
      >
        <div className="text-7xl mb-2 animate-float">
          {result === "win" ? "🏆" : "🎉"}
        </div>

        <h2 className="font-display text-3xl font-bold mb-2 text-foreground">
          {result === "win" ? "Level 2 Complete! 🌟" : "Well tried!! 😊"}
        </h2>

        <p className="text-muted-foreground font-bold mb-3 text-xl">
          {result === "win"
            ? "You got it right! You're a champion! 🏆"
            : "You can try again! 🎉"}
        </p>

        <div
          className={`inline-block px-6 py-3 rounded-2xl font-display text-2xl font-bold mb-4 ${
            result === "win"
              ? "bg-success text-success-foreground"
              : "bg-destructive text-destructive-foreground"
          }`}
        >
          Score: {score}/{total}
        </div>

        {/* Video — sirf win pe dikhao */}
        {result === "win" && (
          <div className="flex justify-center mb-5">
            <video
              src={Level2CompleteVideo}
              autoPlay
              loop
              muted
              className="w-full max-w-sm rounded-xl shadow-lg"
            />
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button
            onClick={onPlayAgain}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display font-bold text-xl hover:opacity-90 transition-opacity"
          >
            🔄 Try again
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-muted text-muted-foreground font-display font-bold text-xl hover:opacity-80 transition-opacity"
          >
            🏠 Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;
