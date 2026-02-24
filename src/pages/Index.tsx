import GameCard from "../components/GameCard";
import GameHistory from "../components/GameHistory";
import logo from "../assets/BCAT_logo.png"

const GAMES = [
  {
    title: "Paw Patch Calendar Quest 📅",
    description: "Paw made the mess, smart minds patch the calendar.  🏆",
    emoji: "🐾",
    about_game:
      "To help children understand the structure and order of a calendar by arranging mixed calendar pages and solving simple logic-based questions related to days, weeks, and months.",

//     learning_object: `After playing the game, learners will be able to:
// 1.	Sequence the months of the year correctly.
// 2.	Interpret basic calendar information (days, dates, weeks, months).
// 3.	Use reasoning to answer calendar-based questions (before–after days, order of months, simple event timing).
// 4.	Apply calendar knowledge to everyday contexts such as holidays, routines, and festivals.
// 5.	Develop logical thinking and sequencing skills through a problem-solving task.
// .`,
    learning_object: {
      heading: "After playing the game, learners will be able to:",
      points: [
        "Sequence the months of the year correctly.",
        "Interpret basic calendar information (days, dates, weeks, months).",
        "Use reasoning to answer calendar-based questions (before–after days, order of months, simple event timing).",
        "Apply calendar knowledge to everyday contexts such as holidays, routines, and festivals.",
        "Develop logical thinking and sequencing skills through a problem-solving task.",
      ],
    },
    path: "/games/calendar",
    color: "primary" as const,
  },
];

const Index = () => {
  return (
    <>
      {/* Hero Section */}
      <section
        className="py-12 md:py-16 text-center"
        style={{ background: "var(--gradient-warm)" }}
      >
        <div className="container mx-auto px-4">
          <div className="animate-float inline-block text-6xl mb-4">
            <img src={logo} alt="" className="w-28 h-24" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary mb-3">
            Play is our brain’s favourite way of learning.
          </h2>
          <p className="text-lg font-semibold font-body max-w-md mx-auto">
            ~Diane Ackerman
          </p>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-10">
        <div className="container mx-auto px-4">
          <h3 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            🎯 Mathematical Games
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {GAMES.map((game) => (
              <GameCard key={game.path} {...game} />
            ))}
          </div>
        </div>
      </section>

      {/* History Section */}
      <section className="py-10" style={{ background: "var(--gradient-warm)" }}>
        <div className="container mx-auto px-4">
          <h3 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            📊 Game History
          </h3>
          <div
            className="bg-card rounded-2xl p-6 border border-border"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <GameHistory />
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;

