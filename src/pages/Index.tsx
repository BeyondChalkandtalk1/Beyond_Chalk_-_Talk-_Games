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

      {/* About Us Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <h3 className="font-display text-3xl md:text-4xl font-bold text-secondary mb-10 text-center">
            🏫 About Us
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Left - Content */}
            <div className="lg:col-span-2 space-y-4 text-base md:text-[17px] font-body text-foreground leading-relaxed">
              <p>
                <strong>Beyond Chalk and Talk (OPC) Pvt. Ltd.</strong> is a DPIIT-registered, Startup India–recognised organisation working to make mathematics meaningful, engaging, and joyful for learners aged 3 years and above.
              </p>
              <p>
                After spending nearly a decade training teachers and working closely with students, we noticed something important: <em className="text-secondary font-semibold">many children struggle with mathematics not because they cannot learn it, but because they rarely get the chance to experience the ideas behind it.</em> Concepts often remain hidden behind procedures.
              </p>
              <p className="font-semibold text-primary">That's where our games come in.</p>
              <p>
                We created this platform to turn mathematical concepts into interactive games and playful explorations. <em className="text-secondary font-semibold">While there are many math games available online, most focus mainly on practice and repetition.</em> Our games are different. Each one is carefully designed to build conceptual understanding, helping learners think, reason, and discover rather than just arrive at answers. These games are not just for classrooms. They are designed for anyone, anywhere — students, teachers, parents, or curious minds who enjoy learning through interaction and play.
              </p>
              <p>
                Our work is strongly aligned with the vision of <strong>NEP 2020</strong> and <strong>NCF 2023</strong>, promoting experiential and competency-based learning where understanding takes priority over rote methods.
              </p>
              <p>
                At Beyond Chalk and Talk, we believe mathematics should not feel distant or difficult. It should feel interactive, thoughtful, and enjoyable to explore.
              </p>
            </div>

            {/* Right - Photo & Info */}
            <div className="flex flex-col items-center gap-5 bg-card rounded-3xl p-6 border border-border" style={{ boxShadow: "var(--shadow-card)" }}>
              <p className="font-display text-sm font-bold text-primary tracking-wide uppercase">The brain behind these games</p>
              <div className="w-44 h-44 md:w-52 md:h-52 rounded-2xl bg-muted border-4 border-primary/20 overflow-hidden flex items-center justify-center">
                {/* Placeholder - user will replace with actual photo */}
                <span className="text-7xl">👩‍🏫</span>
              </div>
              <div className="text-center space-y-1">
                <h4 className="font-display text-xl font-bold text-secondary">Ms. Divyanshi Dhawan</h4>
                <p className="text-sm font-body text-primary font-bold">Director</p>
                <p className="text-xs font-body text-muted-foreground">M.Sc. (Mathematics), University of Lucknow</p>
                <p className="text-xs font-body text-muted-foreground">PhD at Centre for Education Technology, IIT Jodhpur (pursuing)</p>
              </div>
            </div>
          </div>
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

