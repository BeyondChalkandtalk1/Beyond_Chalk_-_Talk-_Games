import GameCard from "../components/GameCard";
import GameHistory from "../components/GameHistory";
import HeroVideoSlider from "../components/HeroVideoSlider";
import MamImage from "../assets/divyanshi_mam.jpeg";

const GAMES = [
  {
    title: "Paw Patch Calendar Quest 📅",
    description: "Paw made the mess, smart minds patch the calendar.  🏆",
    emoji: "🐾",
    about_game:
      "To help children understand the structure and order of a calendar by arranging mixed calendar pages and solving simple logic-based questions related to days, weeks, and months.",
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
      {/* Hero Video Slider */}
      <HeroVideoSlider />

 

      {/* Games Section */}
      <section className="py-2">
        <div className="container mx-auto px-4">
          <h3
            className="text-xl md:text-2xl font-bold text-foreground mb-6 flex items-center gap-2"
            style={{ fontFamily: "'Open Sans', var(--font-display)" }}
          >
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
          <h3
            className="text-xl md:text-2xl font-bold text-foreground mb-6 flex items-center gap-2"
            style={{ fontFamily: "'Open Sans', var(--font-display)" }}
          >
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
