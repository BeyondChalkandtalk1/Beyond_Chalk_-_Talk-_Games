const ResultModal = ({ isOpen, result, score, total, onClose, onPlayAgain }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-foreground/40 backdrop-blur-sm">
      <div
        className={`rounded-3xl p-8 max-w-sm w-full mx-4 text-center animate-bounce-in ${
          result === "win" ? "bg-card" : "bg-card"
        }`}
        style={{ boxShadow: "var(--shadow-hover)" }}
      >
        <div className="text-7xl mb-4 animate-float">
          {result === "win" ? "🎉" : "💪"}
        </div>

        <h2 className="font-display text-3xl font-bold mb-2 text-foreground">
          {result === "win" ? "Bahut Badhiya! 🌟" : "Well tried!!😊"}
        </h2>

        <p className="text-muted-foreground font-bold mb-4 text-xl ">
          {result === "win"
            ? "Tumne sahi jawab diya! Champion ho tum! 🏆"
            : " You can try again !  💪"}
        </p>

        <div
          className={`inline-block px-6 py-3 rounded-2xl font-display text-2xl font-bold mb-6 ${
            result === "win"
              ? "bg-success text-success-foreground"
              : "bg-destructive text-destructive-foreground"
          }`}
        >
          Score: {score}/{total}
        </div>

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
