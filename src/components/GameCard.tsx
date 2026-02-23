import { Link } from "react-router-dom";
import { useState } from "react";

const colorMap = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
};

const GameCard = ({
  title,
  description,
  emoji,
  path,
  color,
  about_game,
  learning_object,
}) => {
  const [showAbout, setShowAbout] = useState(false);
  const [showLearning, setShowLearning] = useState(false);

  return (
    <Link to={path} className="group block">
      <div
        className="rounded-2xl p-6 transition-all duration-300 hover:scale-105 bg-card border-2 border-border hover:border-primary"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        <div
          className={`w-16 h-16 rounded-2xl ${colorMap[color]} flex items-center justify-center text-3xl mb-4 group-hover:animate-wiggle`}
        >
          {emoji}
        </div>
        <h3 className="font-display text-xl font-bold text-foreground mb-2">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground font-body mb-3">{description}</p>

        <div className="flex flex-col gap-3">
          {/* About the Game - reveal on hover/click */}
          <div
            className="relative"
            onMouseEnter={() => setShowAbout(true)}
            onMouseLeave={() => setShowAbout(false)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowAbout((v) => !v);
            }}
          >
            <button
              type="button"
              className={`w-full text-left px-3 py-2 rounded-xl border-2 transition-all duration-300 cursor-pointer font-display text-xs font-bold ${
                showAbout
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted/50 text-foreground hover:border-primary/50"
              }`}
            >
              📖 About Game
            </button>
            <div
              className={`mt-1 overflow-hidden transition-all duration-300 ease-in-out ${
                showAbout ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-xs text-muted-foreground font-body bg-muted/30 rounded-xl p-3 border border-border">
                {about_game}
              </p>
            </div>
          </div>

          {/* Learning - reveal on hover/click */}
          <div
            className="relative"
            onMouseEnter={() => setShowLearning(true)}
            onMouseLeave={() => setShowLearning(false)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowLearning((v) => !v);
            }}
          >
            <button
              type="button"
              className={`w-full text-left px-3 py-2 rounded-xl border-2 transition-all duration-300 cursor-pointer font-display text-xs font-bold ${
                showLearning
                  ? "border-accent bg-accent/10 text-accent-foreground"
                  : "border-border bg-muted/50 text-foreground hover:border-accent/50"
              }`}
            >
              🎓 Learning
            </button>
            <div
              className={`mt-1 overflow-hidden transition-all duration-300 ease-in-out ${
                showLearning ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="text-xs text-muted-foreground font-body bg-muted/30 rounded-xl p-3 border border-border">
                {learning_object}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 text-primary font-display text-sm font-semibold">
          Play Now →
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
