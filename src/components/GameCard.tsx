import { Link } from "react-router-dom";

const colorMap = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
};

const GameCard = ({ title, description, emoji, path, color }) => {
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
        <h3 className="font-display text-xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground font-body">{description}</p>
        <div className="mt-4 flex items-center gap-2 text-primary font-display text-sm font-semibold">
          Play Now →
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
