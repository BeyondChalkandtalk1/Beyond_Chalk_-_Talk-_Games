import { useState, useEffect, useRef } from "react";

const SLIDES = [
  {
    video: "/videos/video1.mp4",
    quote: "Play is our brain's favourite way of learning.",
    author: "Diane Ackerman",
  },
  {
    video: "/videos/video1.mp4",
    quote: "Pure mathematics is, in its way, the poetry of logical ideas.",
    author: "Albert Einstein",
  },
  {
    video: "/videos/video1.mp4",
    quote: "Mathematics is not about numbers, equations, computations, or algorithms: it is about understanding.",
    author: "William Paul Thurston",
  },
];

const HeroVideoSlider = () => {
  const [current, setCurrent] = useState(0);
  const [fade, setFade] = useState(true);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-slide: when current video ends or after 8s fallback
  useEffect(() => {
    setFade(true);

    const video = videoRefs.current[current];
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }

    // Fallback timer
    timeoutRef.current = setTimeout(() => {
      goNext();
    }, 8000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const goNext = () => {
    setFade(false);
    setTimeout(() => {
      setCurrent((prev) => (prev + 1) % SLIDES.length);
    }, 400);
  };

  const handleVideoEnd = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    goNext();
  };

  return (
    <section className="relative w-full h-[70vh] md:h-[80vh] overflow-hidden">
      {/* Video layers */}
      {SLIDES.map((slide, i) => (
        <video
          key={i}
          ref={(el) => { videoRefs.current[i] = el; }}
          src={slide.video}
          muted
          playsInline
          onEnded={handleVideoEnd}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            i === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        />
      ))}

      {/* Dark overlay */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />

      {/* Quote content */}
      <div
        className={`absolute inset-0 z-30 flex flex-col items-center justify-center px-6 text-center transition-all duration-500 ${
          fade ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="max-w-3xl mx-auto">
          <span className="text-5xl md:text-7xl text-white/30 font-serif leading-none select-none">"</span>
          <h2
            className="text-xl md:text-3xl lg:text-4xl font-semibold text-white leading-snug mt-[-1rem]"
            style={{ fontFamily: "'Open Sans', var(--font-body)" }}
          >
            {SLIDES[current].quote}
          </h2>
          <div className="mt-5 flex items-center justify-center gap-2">
            <span className="w-10 h-[2px] bg-primary rounded-full" />
            <p
              className="text-sm md:text-base font-medium tracking-wide text-white/80 italic"
              style={{ fontFamily: "'Open Sans', var(--font-body)" }}
            >
              — {SLIDES[current].author}
            </p>
            <span className="w-10 h-[2px] bg-primary rounded-full" />
          </div>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current);
              setFade(false);
              setTimeout(() => setCurrent(i), 300);
            }}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              i === current
                ? "bg-primary scale-125"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroVideoSlider;
