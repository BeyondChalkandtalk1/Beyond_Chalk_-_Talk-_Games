import Header from "../components/Header";
import Footer from "../components/Footer";
import GameCard from "../components/GameCard";
import GameHistory from "../components/GameHistory";
import logo from "../assets/BCAT_logo.png"

const GAMES = [
  {
    title: "Calendar Game 📅",
    description:
      "12 months ko sahi calendar se match karo! Clock pe drag & drop karo aur champion bano! 🏆",
    emoji: "📅",
    path: "/games/calendar",
    color: "primary" as const,
  },
];

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section
          className="py-12 md:py-16 text-center"
          style={{ background: "var(--gradient-warm)" }}
        >
          <div className="container mx-auto px-4">
            <div className="animate-float inline-block text-6xl mb-4">
              <img src={logo} alt="" className="w-16 h-16" />
            </div>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-secondary mb-3">
              Educational Games for Mathematical Learning
            </h2>
            <p className="text-lg text-muted-foreground font-body max-w-md mx-auto">
              Khel khel mein seekho! Fun educational games sirf tumhare liye 🌟
            </p>
          </div>
        </section>

        {/* Games Section */}
        {/* <section className="py-10">
          <div className="container mx-auto px-4">
            <h3 className="font-display text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              🎯 Games
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {GAMES.map((game) => (
                <GameCard key={game.path} {...game} />
              ))}
            </div>
          </div>
        </section> */}

        {/* History Section */}
        {/* <section className="py-10" style={{ background: "var(--gradient-warm)" }}>
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
        </section> */}
      </main>

      <Footer />
    </div>
  );
};

export default Index;
