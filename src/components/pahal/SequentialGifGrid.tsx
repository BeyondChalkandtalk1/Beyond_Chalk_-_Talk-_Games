import { useState, useEffect, useRef } from "react";
import videoTen from "@/assets/pahal/ballCount.mp4"

const VIDEO_SRC = videoTen; // apna video path yahan
const TOTAL = 10;

export default function SequentialVideoGrid({ videoSrc }: { videoSrc: string }) {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [completedCount, setCompletedCount] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleVideoEnd = () => {
    const next = activeIndex + 1;
    setCompletedCount(next);
    if (next < TOTAL) {
      setActiveIndex(next);
    }
  };

  // naya video load hone pe autoplay
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play();
    }
  }, [activeIndex]);

  return (
    <div className="flex flex-col gap-1">
      {Array.from({ length: TOTAL }).map((_, i) => {
        const isActive = i === activeIndex;
        const isDone = i < completedCount;
        const isPending = !isActive && !isDone;

        return (
          <div
            key={i}
            className="w-[80px] h-[80px] overflow-hidden rounded-md bg-transparent"
            style={{ visibility: isPending ? "hidden" : "visible" }}
          >
            {isDone && (
              // last frame freeze — poster image ya last-frame thumbnail
              <video
                src={videoSrc}
                className="w-full h-full object-cover"
                style={{ pointerEvents: "none" }}
              />
            )}

            {isActive && (
              <video
                ref={videoRef}
                src={videoSrc}
                className="w-full h-full object-cover"
                autoPlay
                muted
                playsInline
                onEnded={handleVideoEnd}
                style={{ pointerEvents: "none" }}
              />
            )}

            <p className="text-base font-display text-foreground mb-2">
              A "Hundred" is a group of 10 Tens. A "Ten" is a group of 10 Ones.
            </p>
          </div>
        );
      })}
    </div>
  );
}
