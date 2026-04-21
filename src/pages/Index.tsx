import GameCard from "../components/GameCard";
import GameHistory from "../components/GameHistory";
import HeroVideoSlider from "../components/HeroVideoSlider";
import MamImage from "../assets/divyanshi_mam.jpeg";
import { useSound } from "@/contexts/SoundContext";
import { useEffect } from "react";
import homePageSound from "../assets/cartoon-music-sound.mpeg";


const GAMES = [
  {
    title: "Paw Patch Calendar Quest 📅",
    description: "Paw made the mess, smart minds patch the calendar.  🏆",
    emoji: "🐾",
    about_game:
      "To help the player understand the structure and order of a calendar by arranging mixed calendar pages and solving simple logic-based questions related to days, weeks, and months.",
    learning_object: {
      heading: "After playing the game, learners will be able to:",
      points: [
        "Sequence the months of the year in the correct order.",
        "Interpret basic calendar information (days, dates, weeks, and months).",
        "Develop logical thinking and sequencing skills through problem-solving tasks.",
      ],
    },
    levels: 2,
    age: "7+",
    path: "/games/calendar",
    color: "primary" as const,
  },
  {
    title: "Prime Patrol and Combo Detectives",
    description: "Investigate numbers, discover their secrets! 🏆",
    emoji: "🐾",
    about_game:
      "To help the player distinguish between prime and composite numbers by arranging arrays on a grid. By forming rows and columns, composite numbers show multiple rectangular arrays, while prime numbers do not. At advanced levels, the player explores factors and identifies perfect square numbers through square arrays.",
    learning_object: {
      heading: "After playing the game, learners will be able to:",
      points: [
        "Distinguish between prime and composite numbers through array formation on a grid.",
        "Identify factors and factor pairs through different rectangular arrangements.",
        "Recognise perfect square numbers by observing square arrays (equal rows and columns).",
        "Develop reasoning and conceptual understanding of number relationships without relying on memorisation of divisibility rules.",
      ],
    },
    levels: 1,
    age: "9+",
    path: "/games/prime",
    color: "primary" as const,
  },
  {
    title: "MathBola 🎯",
    description: "Math Comes Alive with Every Clue Card! 🎫",
    emoji: "🎲",
    about_game:
      "To help the player develop a comprehensive understanding of mathematical concepts such as number, operations, patterns, and spatial relationships, through ‘MathBola’, a Tambola-inspired game that engages the player in interpreting and applying concepts in real-life contexts.",
    learning_object: {
      heading: "After playing the game, learners will be able to:",
      points: [
        "Demonstrate understanding of mathematical concepts in real-life contexts.",
        "Use logical reasoning to make decisions and justify thinking.",
        "Recognise patterns, relationships, and structures across different situations.",
        "Reflect on thinking and identify errors to improve solutions.",
      ],
    },
    levels: 1,
    age: "6-9",
    path: "/games/mathbola",
    color: "primary" as const,
  },
  {
    title:
      "B.H.A.R.A.T (Building Holistic Understanding through Representations of Arithmetic Tables)🚀",
    description: "  From Representation to Real Understanding.",
    emoji: "🎲",
    about_game:
      "To help the player develop a deep and holistic understanding of times tables using multiple representations such as verbal statements, repeated addition, visual models, arrays, and symbolic notation.",
    learning_object: {
      heading: "After playing the game, learners will be able to:",
      points: [
        "Read, understand, and verbally express multiplication statements with clarity.",
        "Represent multiplication through repeated addition, visual models, and grouping/arrays.",
        "Relate arrays and visual models to symbolic multiplication forms.",
        "Connect multiple representations to build conceptual understanding and recall multiplication facts meaningfully.",
      ],
    },
    levels: 1,
    age: "4+",
    path: "/games/bharat",
    color: "primary" as const,
  },
  {
    title: "PAHAL (Place Value, Addition, Hands-on grouping, and Lending)",
    description: "Laying the Foundation for Arithmetic.",
    emoji: "🎲",
    about_game:
      "To help the player develop a clear understanding of place value up to thousands through interactive visual representations that make abstract concepts concrete, with progressive levels that build conceptual clarity and confidence.",
    learning_object: {
      heading: "After playing the game, learners will be able to:",
      points: [
        "Identify and represent numbers up to thousands using place value models.",
        "Explain the value of a digit based on its position in a number.",
        "Compose and decompose numbers using place value understanding.",
      ],
    },
    levels: 2,
    age: "5+",
    path: "/games/pahal",
    color: "primary" as const,
  },
];

const Index = () => {
const { playLoopingSound, clearLoopingSound } = useSound();

useEffect(() => {
  playLoopingSound(homePageSound);

  return () => {
    clearLoopingSound(); // ✅ page leave pe ref null hoga
  };
}, []);
  return (
    <>
      {/* Hero Video Slider */}
      <HeroVideoSlider />

      {/* About Us Section */}
      <section className="py-10 md:py-14">
        <div className="container mx-auto px-4">
          <h3
            className="text-2xl md:text-3xl font-bold text-secondary mb-3 text-center"
            style={{ fontFamily: "'Times New Roman', var(--font-display)" }}
          >
            About Us
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            {/* Left - Content */}
            <div
              className="lg:col-span-2 space-y-4 text-[15px] md:text-[20px] text-foreground leading-[1.6]"
              style={{ fontFamily: "'Times New Roman', var(--font-body)" }}
            >
              <p>
                <strong className="text-secondary font-bold">
                  Beyond Chalk and Talk (OPC) Pvt. Ltd.
                </strong>{" "}
                is a DPIIT-registered, Startup India–recognised organisation
                working to make mathematics meaningful, engaging, and joyful for
                learners aged 3 years and above.
              </p>
              <p>
                After spending nearly a decade training teachers and working
                closely with students, we noticed something important:{" "}
                <span
                  className="text-secondary font-semibold"
                  style={{ fontFamily: "'Times New Roman', var(--font-body)" }}
                >
                  many children struggle with mathematics not because they
                  cannot learn it, but because they rarely get the chance to
                  experience the ideas behind it.
                </span>{" "}
                Concepts often remain hidden behind procedures.
              </p>
              <p className="font-semibold text-secondary">
                That's where our games come in.
              </p>
              <p>
                We created this platform to turn mathematical concepts into
                interactive games and playful explorations.{" "}
                <span className="text-secondary font-semibold">
                  While there are many math games available online, most focus
                  mainly on practice and repetition.
                </span>{" "}
                Our games are different. Each one is carefully designed to build
                conceptual understanding, helping learners think, reason, and
                discover rather than just arrive at answers. These games are not
                just for classrooms. They are designed for anyone, anywhere —
                students, teachers, parents, or curious minds who enjoy learning
                through interaction and play.
              </p>
              <p>
                Our work is strongly aligned with the vision of{" "}
                <strong>NEP 2020</strong> and <strong>NCF 2023</strong>,
                promoting experiential and competency-based learning where
                understanding takes priority over rote methods.
              </p>
              <p>
                At Beyond Chalk and Talk, we believe mathematics should not feel
                distant or difficult. It should feel interactive, thoughtful,
                and enjoyable to explore.
              </p>
            </div>

            {/* Right - Photo & Info */}
            <div
              className="flex flex-col items-center gap-4 bg-card rounded-2xl p-5 border border-border"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="text-xl text-secondary font-bold">
                <h1>The brain behind these games</h1>
              </div>
              <div className="w-full aspect-[3/4] max-w-[320px] rounded-xl bg-muted border-2 border-primary/20 overflow-hidden">
                <img
                  src={MamImage}
                  alt="Ms. Divyanshi Dhawan"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center space-y-0.5">
                <h4
                  className="text-lg font-bold text-secondary"
                  style={{
                    fontFamily: "'Times New Roman', var(--font-display)",
                  }}
                >
                  Ms. Divyanshi Dhawan
                </h4>
                <p
                  className="text-lg text-primary font-semibold"
                  style={{ fontFamily: "'Times New Roman', var(--font-body)" }}
                >
                  Director
                </p>
                <p
                  className="text-lg text-muted-foreground leading-snug pt-1"
                  style={{ fontFamily: "'Times New Roman', var(--font-body)" }}
                >
                  Beyond Chalk and Talk (OPC) Pvt. Ltd
                </p>
                <p
                  className="text-lg text-muted-foreground leading-snug pt-1"
                  style={{ fontFamily: "'Times New Roman', var(--font-body)" }}
                >
                  M.Sc. (Mathematics), University of Lucknow
                </p>
                <p
                  className="text-lg text-muted-foreground leading-snug"
                  style={{ fontFamily: "'Times New Roman', var(--font-body)" }}
                >
                  PhD at Centre for Education Technology, IIT Jodhpur (pursuing)
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Games Section */}
      <section className="py-2">
        <div className="container mx-auto px-4">
          <h3
            className="text-xl md:text-2xl font-bold text-foreground mb-6 flex items-center gap-2"
            style={{ fontFamily: "'Times New Roman', var(--font-display)" }}
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
            style={{ fontFamily: "'Times New Roman', var(--font-display)" }}
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
