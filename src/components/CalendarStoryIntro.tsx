import { useState } from "react";
import storyMaking from "@/assets/story/story-1-making.jpg";
import storyWhoosh from "@/assets/story/story-2-whoosh.jpg";
import storyRunning from "@/assets/story/story-3-running.jpg";
import storySad from "@/assets/story/story-4-sad.jpg";
import storyHelp from "@/assets/story/story-5-help.jpg";

const STORY_SLIDES = [
  {
    id: 1,
    image: storyMaking,
    text: "One bright morning, a young girl decided to make something special — her very own calendar! 📅 She brought colourful papers, sketch pens, and shiny stickers. Carefully, she designed each page with days and dates.",
    highlight: "But one important thing was still missing — the names of the months!",
    emoji: "✏️",
    bgColor: "from-amber-50 to-orange-50",
  },
  {
    id: 2,
    image: storyWhoosh,
    text: "Just then, her playful dog Biscuit came running into the room! 🐶 His tail was wagging, his paws were muddy, and he was full of energy!",
    highlight: "WHOOSH! The papers flew off the table!",
    emoji: "💨",
    bgColor: "from-yellow-50 to-amber-50",
  },
  {
    id: 3,
    image: storyRunning,
    text: "Biscuit grabbed the calendar pages in his mouth and ran across the room! 🏃‍♂️ The pages scattered everywhere like flying leaves! 🍃",
    highlight: '"Oh no! My calendar pages!" cried the girl.',
    emoji: "🍂",
    bgColor: "from-sky-50 to-blue-50",
  },
  {
    id: 4,
    image: storySad,
    text: "After a little chase, she finally managed to collect all the sheets. But now there was a new problem... 😟",
    highlight: "All the pages were completely mixed up! The months were no longer in order.",
    emoji: "😰",
    bgColor: "from-pink-50 to-rose-50",
  },
  {
    id: 5,
    image: storyHelp,
    text: "The girl looked at the messy pile and thought... maybe someone smart can help her arrange them back! 🌟",
    highlight: "Can YOU help her fix the calendar? 🙋‍♂️",
    emoji: "🆘",
    bgColor: "from-emerald-50 to-teal-50",
  },
];

const CalendarStoryIntro = ({ onStart }: { onStart: (story: any) => void }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slide = STORY_SLIDES[currentSlide];
  const isLast = currentSlide === STORY_SLIDES.length - 1;
  const isFirst = currentSlide === 0;

  const goNext = () => {
    if (isLast) {
      onStart({ id: "paw_patch", title: "Paw Patch Calendar Quest" });
    } else {
      setCurrentSlide((p) => p + 1);
    }
  };

  const goPrev = () => {
    if (!isFirst) setCurrentSlide((p) => p - 1);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-6 px-4"
      style={{ background: "var(--gradient-warm)" }}
    >
      {/* Title */}
      <div className="text-center mb-4">
        <h1 className="font-display text-3xl md:text-5xl font-extrabold text-secondary mb-1">
          🐾 Paw Patch Calendar Quest
        </h1>
        <p className="font-body text-muted-foreground text-sm md:text-base">
          Paw made the mess, smart minds patch the calendar! ✨
        </p>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 mb-4">
        {STORY_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentSlide(i)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === currentSlide
                ? "bg-primary scale-125 shadow-md"
                : i < currentSlide
                ? "bg-primary/50"
                : "bg-border"
            }`}
          />
        ))}
      </div>

      {/* Story card */}
      <div
        key={slide.id}
        className={`relative bg-gradient-to-br ${slide.bgColor} rounded-3xl overflow-hidden max-w-lg w-full shadow-xl border-2 border-white/60 animate-fade-in`}
        style={{ boxShadow: "var(--shadow-hover)" }}
      >
        {/* Slide number badge */}
        <div className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-display font-bold text-sm shadow-md">
          {currentSlide + 1}
        </div>

        {/* Image */}
        <div className="relative w-full aspect-square overflow-hidden">
          <img
            src={slide.image}
            alt={`Story scene ${slide.id}`}
            className="w-full h-full object-cover transition-all duration-500"
          />
          {/* Gradient overlay at bottom for text readability */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        {/* Text content */}
        <div className="p-5 md:p-6">
          <p className="font-body text-foreground/80 text-sm md:text-base leading-relaxed mb-3">
            {slide.text}
          </p>
          <p className="font-display text-foreground font-bold text-base md:text-lg leading-snug bg-white/50 rounded-xl px-4 py-2 border-l-4 border-primary">
            {slide.highlight}
          </p>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-4 mt-5 w-full max-w-lg justify-between">
        <button
          onClick={goPrev}
          disabled={isFirst}
          className={`px-5 py-3 rounded-2xl font-display font-bold text-sm transition-all ${
            isFirst
              ? "opacity-30 cursor-not-allowed bg-muted text-muted-foreground"
              : "bg-card border-2 border-border text-foreground hover:border-primary hover:scale-105"
          }`}
        >
          ← Back
        </button>

        <span className="font-body text-xs text-muted-foreground">
          {currentSlide + 1} / {STORY_SLIDES.length}
        </span>

        <button
          onClick={goNext}
          className={`px-6 py-3 rounded-2xl font-display font-bold text-sm transition-all shadow-lg hover:scale-105 ${
            isLast
              ? "bg-gradient-to-r from-primary to-accent text-primary-foreground animate-pulse text-base"
              : "bg-primary text-primary-foreground"
          }`}
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {isLast ? "🎮 Let's Play!" : "Next →"}
        </button>
      </div>

      {/* Learning objectives - only on last slide */}
      {isLast && (
        <div className="mt-5 max-w-lg w-full bg-card/80 rounded-2xl p-4 border border-border animate-slide-up">
          <h3 className="font-display text-sm font-bold text-secondary mb-2">
            🎯 What You'll Learn
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              "📅 Months in order",
              "📆 Days & weeks",
              "🧠 Logical thinking",
              "🎉 Festivals & seasons",
            ].map((item) => (
              <div
                key={item}
                className="text-xs font-body text-foreground/70 bg-background/50 rounded-lg px-2 py-1.5"
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
