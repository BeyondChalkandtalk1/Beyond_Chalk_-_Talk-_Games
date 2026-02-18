import logo from "../assets/BCAT_logo.png"
const GameHistory = () => {
  const history = JSON.parse(localStorage.getItem("gameHistory") || "[]");

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-6xl mb-4">
          <img src={logo} alt="" className="w-20 h-20 mx-auto"/>
        </p>
        <p className="font-display text-xl text-muted-foreground">
          Abhi tak koi game nahi khela!
        </p>
        <p className="text-sm text-muted-foreground font-body mt-2">
          Koi game khelo aur yahan apni history dekho 🌟
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
      {history
        .slice()
        .reverse()
        .map((entry, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border animate-slide-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="text-2xl">
              {entry.result === "win" ? "🏆" : "😢"}
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-foreground">
                {entry.gameName}
              </p>
              <p className="text-xs text-muted-foreground font-body">
                {new Date(entry.date).toLocaleDateString("hi-IN")}
              </p>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-display font-bold ${
                entry.result === "win"
                  ? "bg-success text-success-foreground"
                  : "bg-destructive text-destructive-foreground"
              }`}
            >
              {entry.score}/12
            </div>
          </div>
        ))}
    </div>
  );
};

export default GameHistory;

export const saveGameResult = (gameName, result, score) => {
  const history = JSON.parse(localStorage.getItem("gameHistory") || "[]");
  history.push({
    gameName,
    result,
    score,
    date: new Date().toISOString(),
  });
  localStorage.setItem("gameHistory", JSON.stringify(history));
};
