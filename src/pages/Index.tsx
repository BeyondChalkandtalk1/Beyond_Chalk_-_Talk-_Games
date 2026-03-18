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
    levels:2,
    age: "7+",
    path: "/games/calendar",
    color: "primary" as const,
  },
  {
    title: "Prime Patrol and Combo Detectives",
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
    levels:2,
    age: "9+",
    path: "/games/prime",
    color: "primary" as const,
  },
  {
    title: "Math Bola 🎯",
    description: "A Tambola-style math game — solve clues and mark your ticket! 🎫",
    emoji: "🎲",
    about_game:
      "A fun Tambola (Housie) inspired math game where players solve mental math clues announced every 20 seconds and mark matching answers on their ticket to win.",
    learning_object: {
      heading: "After playing the game, learners will be able to:",
      points: [
        "Perform quick mental arithmetic (addition, subtraction, multiplication, division).",
        "Improve speed and accuracy in solving math problems.",
        "Develop listening and attention skills through timed announcements.",
        "Apply number recognition and matching strategies.",
        "Build confidence in solving age-appropriate math problems.",
      ],
    },
    levels: 1,
    age: "7+",
    path: "/games/mathbola",
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
              <p className="font-semibold text-primary">
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
              <div className="text-xl text-primary font-bold">
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
