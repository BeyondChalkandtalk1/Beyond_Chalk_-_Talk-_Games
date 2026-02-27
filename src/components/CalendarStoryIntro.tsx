import { useState, useCallback } from "react";
import storyMaking from "@/assets/story/story-1-making.jpg";
import storyWhoosh from "@/assets/story/story-2-whoosh.jpg";
import storyRunning from "@/assets/story/story-3-running.jpg";
import storySad from "@/assets/story/story-4-sad.jpg";
import storyHelp from "@/assets/story/story-5-help-2 (1).jpg";
import whitePaw from "../assets/whitePaw.png"

const STORY_PAGES = [
  {
    id: 1,
    image: storyMaking,
    text: "One bright morning, a young girl decided to make something special — her very own calendar! 📅 She brought colourful papers, sketch pens, and shiny stickers. Carefully, she designed each page with days and dates.",
    highlight: "But one important thing was still missing — the names of the months!",
    emoji: "✏️",
    imagePosition: "left" as const,
  },
  {
    id: 2,
    image: storyWhoosh,
    text: "Just then, her playful dog Biscuit came running into the room! 🐶 His tail was wagging, his paws were muddy, and he was full of energy!",
    highlight: "WHOOSH! The papers flew off the table!",
    emoji: "💨",
    imagePosition: "right" as const,
  },
  {
    id: 3,
    image: storyRunning,
    text: "Biscuit grabbed the calendar pages in his mouth and ran across the room! 🏃‍♂️ The pages scattered everywhere like flying leaves! 🍃",
    highlight: '"Oh no! My calendar pages!" cried the girl.',
    emoji: "🍂",
    imagePosition: "left" as const,
  },
  {
    id: 4,
    image: storySad,
    text: "After a little chase, she finally managed to collect all the sheets. But now there was a new problem... 😟",
    highlight: "All the pages were completely mixed up! The months were no longer in order.",
    emoji: "😰",
    imagePosition: "right" as const,
  },
  {
    id: 5,
    image: storyHelp,
    text: "The girl looked at the messy pile and thought... maybe someone smart can help her arrange them back! 🌟",
    highlight: "Can YOU help her fix the calendar? 🙋‍♂️",
    emoji: "🆘",
    imagePosition: "left" as const,
  },
];

type BookState = "closed" | "opening" | "open" | "turning";

const CalendarStoryIntro = ({ onStart }: { onStart: (story: any) => void }) => {
  const [bookState, setBookState] = useState<BookState>("closed");
  const [currentPage, setCurrentPage] = useState(0);
  const [turnDirection, setTurnDirection] = useState<"next" | "prev">("next");

  const totalPages = STORY_PAGES.length;
  const isLastPage = currentPage === totalPages - 1;
  const isFirstPage = currentPage === 0;
  const page = STORY_PAGES[currentPage];

  const openBook = useCallback(() => {
    setBookState("opening");
    setTimeout(() => setBookState("open"), 600);
  }, []);

  const turnPage = useCallback(
    (direction: "next" | "prev") => {
      if (bookState === "turning") return;
      setTurnDirection(direction);
      setBookState("turning");
      setTimeout(() => {
        setCurrentPage((p) => (direction === "next" ? p + 1 : p - 1));
        setBookState("open");
      }, 500);
    },
    [bookState]
  );

  const goNext = () => {
    if (isLastPage) {
      onStart({ id: "paw_patch", title: "Paw Patch Calendar Quest" });
    } else {
      turnPage("next");
    }
  };

  const goPrev = () => {
    if (!isFirstPage) turnPage("prev");
  };

  // ─── COVER ───
  if (bookState === "closed" || bookState === "opening") {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center px-4"
        style={{ background: "var(--gradient-warm)" }}
      >
        <div
          onClick={openBook}
          className={`
            relative cursor-pointer select-none
            w-[340px] md:w-[480px] aspect-[3/4]
            rounded-r-2xl rounded-l-md
            shadow-2xl
            transition-transform duration-700 origin-left
            ${bookState === "opening" ? "scale-x-0 opacity-0" : "hover:rotate-y-6 hover:shadow-[0_20px_60px_-10px_hsl(var(--secondary)/0.4)]"}
          `}
          style={{
            background:
              "linear-gradient(135deg, hsl(0 60% 30%), hsl(0 55% 40%))",
            transformStyle: "preserve-3d",
            perspective: "1000px",
          }}
        >
          {/* Spine effect */}
          <div
            className="absolute left-0 top-0 bottom-0 w-6 md:w-8 rounded-l-md"
            style={{
              background:
                "linear-gradient(90deg, hsl(0 60% 25%), hsl(0 60% 32%))",
            }}
          />

          {/* Gold border inset */}
          <div className="absolute inset-4 md:inset-6 left-10 md:left-12 border-2 border-[hsl(36,80%,55%)] rounded-xl flex flex-col items-center justify-center gap-4 md:gap-6 p-6">
            {/* Decorative top */}
            <div className="text-4xl md:text-5xl">
              <img src={whitePaw} alt="" className="w-20 h-16" />
            </div>

            <h1
              className="font-display text-2xl md:text-4xl font-extrabold text-center leading-tight"
              style={{ color: "hsl(36 80% 60%)" }}
            >
              Paw Patch
              <br />
              Calendar Quest
            </h1>

            <div
              className="w-16 h-0.5 rounded-full"
              style={{ background: "hsl(36 80% 55%)" }}
            />

            <p
              className="font-bold text-xl md:text-2xl text-center leading-relaxed"
              style={{
                color: "hsl(36 80% 80%)",
                fontFamily: "'Times New Roman', var(--font-body)",
              }}
            >
              Read the story and help
              <br />
              the girl patch the calendar!
            </p>

            {/* Tap to open hint */}
            <div className="mt-2 flex flex-col items-center gap-1 animate-pulse">
              <span
                className="text-lg md:text-xl font-display font-bold"
                style={{ color: "hsl(36 80% 65%)" }}
              >
                ✨ Tap to Open ✨
              </span>
              <span className="text-2xl animate-float">👆</span>
            </div>
          </div>

          {/* Corner decorations */}
          <div className="absolute top-2 right-2 text-lg opacity-60">🌟</div>
          <div className="absolute bottom-2 right-2 text-lg opacity-60">🐶</div>
        </div>

        <p className="mt-6 font-body text-muted-foreground text-xs md:text-sm">
          Click the book to start reading!
        </p>
      </div>
    );
  }

  // ─── OPEN BOOK ───
  const imageOnLeft = page.imagePosition === "left";

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center py-6 px-4"
      style={{ background: "var(--gradient-warm)" }}
    >
      {/* Book title */}
      <h2 className="font-display text-xl md:text-2xl font-bold text-secondary mb-3">
        🐾 Paw Patch Calendar Quest
      </h2>

      {/* Page indicator */}
      <div className="flex gap-2 mb-4">
        {STORY_PAGES.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === currentPage
                ? "w-8 bg-primary"
                : i < currentPage
                  ? "w-4 bg-primary/40"
                  : "w-4 bg-border"
            }`}
          />
        ))}
      </div>

      {/* The Book */}
      <div
        className={`
          relative max-w-4xl w-full
          bg-[hsl(40,40%,96%)]
          rounded-2xl overflow-hidden
          shadow-[0_10px_50px_-10px_hsl(var(--secondary)/0.3)]
          border border-[hsl(35,40%,88%)]
          transition-all duration-500
          ${
            bookState === "turning"
              ? turnDirection === "next"
                ? "animate-page-turn-next"
                : "animate-page-turn-prev"
              : "animate-fade-in"
          }
        `}
        style={{ minHeight: "480px" }}
      >
        {/* Book spine shadow */}
        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-border z-10 hidden md:block" />
        <div
          className="absolute left-1/2 top-0 bottom-0 w-6 -translate-x-1/2 z-10 hidden md:block"
          style={{
            background:
              "linear-gradient(90deg, transparent, hsl(35 30% 85% / 0.5), transparent)",
          }}
        />

        {/* Content grid */}
        <div
          className={`grid grid-cols-1 md:grid-cols-2 min-h-[420px] ${!imageOnLeft ? "md:direction-rtl" : ""}`}
        >
          {/* Image side */}
          <div
            className={`relative overflow-hidden ${imageOnLeft ? "md:order-1" : "md:order-2"}`}
          >
            <img
              src={page.image}
              alt={`Story scene ${page.id}`}
              className="w-full h-full object-cover min-h-[250px] md:min-h-[480px]"
            />
            {/* Page number on image */}
            <div className="absolute bottom-3 left-3 bg-secondary/80 text-secondary-foreground rounded-full w-8 h-8 flex items-center justify-center font-display font-bold text-sm backdrop-blur-sm">
              {currentPage + 1}
            </div>
            {/* Subtle vignette */}
            <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.1)]" />
          </div>

          {/* Text side */}
          <div
            className={`flex flex-col justify-center p-6 md:p-10 min-h-[480px]  ${imageOnLeft ? "md:order-2" : "md:order-1"} ${!imageOnLeft ? "md:direction-ltr" : ""}`}
          >
            {/* Chapter emoji */}
            {/* <div className="text-4xl md:text-5xl mb-4 animate-float">
              {page.emoji}
            </div> */}

            <p className="font-body text-foreground/80 text-lg md:text-xl lg:text-xl leading-relaxed mb-5">
              {page.text}
            </p>

            {/* Highlighted quote */}
            <div className="relative bg-primary/10 rounded-xl px-5 py-4 border-l-4 border-primary">
              <span className="absolute -top-3 -left-1 text-2xl opacity-50">
                ❝
              </span>
              <p className="font-display text-foreground font-bold text-sm md:text-base lg:text-lg leading-snug">
                {page.highlight}
              </p>
            </div>

            {/* Page corner fold effect */}
            <div
              className="hidden md:block absolute bottom-0 right-0 w-12 h-12"
              style={{
                background:
                  "linear-gradient(135deg, transparent 50%, hsl(35 30% 88%) 50%)",
                borderTopLeftRadius: "8px",
              }}
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-6 mt-6 w-full max-w-4xl justify-between">
        <button
          onClick={goPrev}
          disabled={isFirstPage}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-display font-bold text-xl transition-all duration-300 ${
            isFirstPage
              ? "opacity-30 cursor-not-allowed bg-muted text-muted-foreground"
              : "bg-card border-2 border-border text-foreground hover:border-primary hover:scale-105 hover:shadow-md"
          }`}
        >
          <span className="text-lg">📖</span> Previous Page
        </button>

        <span className="font-display text-lg font-bold text-muted-foreground">
          Page {currentPage + 1} of {totalPages}
        </span>

        <button
          onClick={goNext}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-display font-bold text-sm transition-all duration-300 shadow-lg hover:scale-105 ${
            isLastPage
              ? "bg-gradient-to-r from-primary to-accent text-primary-foreground animate-pulse-glow text-xl"
              : "bg-primary text-primary-foreground hover:shadow-xl"
          }`}
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {isLastPage ? (
            <>🎮 Let's Play!</>
          ) : (
            <>
              Turn Page <span className="text-lg">📄</span>
            </>
          )}
        </button>
      </div>

      {/* Learning objectives - last page */}
      {isLastPage && (
        <div className="mt-5 max-w-4xl w-full bg-card/80 rounded-2xl p-3 border border-border animate-slide-up">
          <h3 className="font-display text-lg font-bold text-secondary mb-1">
            🎯 What You'll Learn
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-0">
            {[
              "🗂️ Month Sequencing",
              "📆 Calendar Understanding",
              "🧠 Logical Reasoning",
              "🏖️ Real-Life Application",
              "🧩 Problem Solving Skills",
            ].map((item) => (
              <div
                key={item}
                className="text-lg font-semibold text-foreground/70 bg-background/50 rounded-lg px-1 py-2 text-center whitespace-nowrap"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarStoryIntro;
