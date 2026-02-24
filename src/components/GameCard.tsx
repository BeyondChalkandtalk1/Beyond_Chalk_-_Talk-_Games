import { Link } from "react-router-dom";
import { useState } from "react";
import { CalendarDays, BookOpen, GraduationCap, Play } from "lucide-react";

const iconMap = {
  primary: <CalendarDays className="w-8 h-8 text-primary-foreground" />,
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
        className="relative rounded-3xl p-6 pb-5 transition-all duration-300 hover:scale-[1.03] bg-card border-2 border-border hover:border-primary overflow-hidden"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {/* Age badge - top right */}
        <div className="absolute top-4 right-4 w-14 h-14 rounded-full bg-primary/15 border-2 border-primary flex flex-col items-center justify-center">
          <span className="font-display text-sm font-extrabold text-primary leading-none">7+</span>
          <span className="font-body text-[9px] font-bold text-primary/70 leading-none">years</span>
        </div>

        {/* Icon */}
        <div
          className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center mb-4 group-hover:animate-wiggle shadow-md"
        >
          {iconMap[color] || <span className="text-2xl">{emoji}</span>}
        </div>

        <h3 className="font-display text-lg font-bold text-foreground mb-1 pr-16">
          {title}
        </h3>
        <p className="text-sm text-muted-foreground font-body mb-4 leading-relaxed">
          {description}
        </p>

        <div className="flex flex-col gap-2">
          {/* Aim */}
          <div
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowAbout((v) => !v); }}
            onMouseEnter={() => setShowAbout(true)}
            onMouseLeave={() => setShowAbout(false)}
          >
            <button
              type="button"
              className={`w-full flex items-center gap-2 text-left px-4 py-2.5 rounded-xl border-2 transition-all duration-300 cursor-pointer font-display text-sm font-bold ${
                showAbout
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-muted/40 text-foreground hover:border-primary/50 hover:bg-primary/5"
              }`}
            >
              <BookOpen className="w-4 h-4 flex-shrink-0" /> Aim
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showAbout ? "max-h-40 opacity-100 mt-1.5" : "max-h-0 opacity-0"}`}>
              <p className="text-xs text-muted-foreground font-body bg-muted/30 rounded-xl p-3 border border-border leading-relaxed">
                {about_game}
              </p>
            </div>
          </div>

          {/* Learning objective */}
          <div
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowLearning((v) => !v); }}
            onMouseEnter={() => setShowLearning(true)}
            onMouseLeave={() => setShowLearning(false)}
          >
            <button
              type="button"
              className={`w-full flex items-center gap-2 text-left px-4 py-2.5 rounded-xl border-2 transition-all duration-300 cursor-pointer font-display text-sm font-bold ${
                showLearning
                  ? "border-accent bg-accent/10 text-accent-foreground"
                  : "border-border bg-muted/40 text-foreground hover:border-accent/50 hover:bg-accent/5"
              }`}
            >
              <GraduationCap className="w-4 h-4 flex-shrink-0" /> Learning objective
            </button>
            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showLearning ? "max-h-60 opacity-100 mt-1.5" : "max-h-0 opacity-0"}`}>
              <div className="text-xs text-muted-foreground font-body bg-muted/30 rounded-xl p-3 border border-border">
                <p className="font-semibold mb-2 text-foreground">{learning_object?.heading}</p>
                <ul className="list-decimal pl-4 space-y-1">
                  {learning_object?.points?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 text-primary font-display text-sm font-bold group-hover:gap-3 transition-all duration-300">
          <Play className="w-4 h-4 fill-primary" /> Play Now →
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
