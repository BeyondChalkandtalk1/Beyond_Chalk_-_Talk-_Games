import { Link } from "react-router-dom";

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
        <p className="text-sm text-muted-foreground font-body">{description}</p>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <h1 className="text-ssm font-bold text-foreground">
              About the game
            </h1>
            <p>{about_game}</p>
          </div>
          <div>
            <h1 className="text-ssm font-bold text-foreground">
              Learning
            </h1>
            <p>{learning_object}</p>
          </div>
          <div></div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-primary font-display text-sm font-semibold">
          Play Now →
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
