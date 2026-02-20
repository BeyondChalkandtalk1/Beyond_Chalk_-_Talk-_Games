import { useState } from "react";

const STORIES = [
  {
    id: "lost_leaves",
    title: "The Lost Calendar Leaves 🍃",
    emoji: "🐶",
    text: "Priya apna calendar bana rahi thi. Tab uska naughty dog Coco bhaag gaya aur saare calendar ke patte le gaya! 🐶💨 Ab sab mixed ho gaye hain. Kya tum Priya ki help karoge?",
    characters: { girl: true, dog: true, leaves: true },
    buttonText: "Help Priya! 🌟",
    color: "from-pink-100 to-blue-100",
  },
  {
    id: "magic_wind",
    title: "The Magic Wind 🌬️",
    emoji: "🍂",
    text: "Ek baar ek jadui hawa aai aur jungle ke poore calendar ke patte udaa le gayi! 🌬️🍁 Chotu monkey bahut pareshan ho gaya. Kya tum uske 12 months wapas theek karo?",
    characters: { girl: false, dog: false, leaves: true, monkey: true },
    buttonText: "Save the Calendar! 🐒",
    color: "from-orange-100 to-yellow-100",
  },
  {
    id: "robot_helper",
    title: "Robot Calendar Helper 🤖",
    emoji: "🤖",
    text: "Professor Bunty ka robot ROBO-CAL kharaab ho gaya! 🤖⚡ Usne saare 12 months ko mix kar diya. Professor ko apni lab mein calendar chahiye. Kya tum ROBO-CAL ko theek karoge?",
    characters: { girl: false, dog: false, robot: true },
    buttonText: "Fix ROBO-CAL! 🔧",
    color: "from-purple-100 to-cyan-100",
  },
  {
    id: "time_traveler",
    title: "The Time Traveler 🚀",
    emoji: "🚀",
    text: "Tara time machine mein baith ke future gayi! ⏰✨ Wahan saare months ki time-line toot gayi hai. Agar calendar sahi nahi hua toh woh wapas nahi aa sakti! Jaldi help karo!",
    characters: { girl: true, rocket: true },
    buttonText: "Save Tara! 🚀",
    color: "from-indigo-100 to-pink-100",
  },
];

// Animated CSS characters using divs (like the HTML prototype)
const StoryAnimation = ({ story }) => {
  const isLostLeaves = story.id === "lost_leaves";
  const isMagicWind = story.id === "magic_wind";
  const isRobot = story.id === "robot_helper";
  const isTimeTraveler = story.id === "time_traveler";

  return (
    <div
      className="relative w-full max-w-2xl mx-auto rounded-3xl overflow-hidden"
      style={{
        height: "200px",
        background: isLostLeaves
          ? "linear-gradient(#bbdefb, #e3f2fd)"
          : isMagicWind
          ? "linear-gradient(#fff9c4, #ffe082)"
          : isRobot
          ? "linear-gradient(#e1bee7, #b39ddb)"
          : "linear-gradient(#1a237e, #283593)",
      }}
    >
      {/* Ground */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "40px",
          background: isTimeTraveler ? "#0d47a1" : "#a5d6a7",
          borderRadius: "0 0 24px 24px",
        }}
      />

      {/* Stars for time traveler */}
      {isTimeTraveler && (
        <>
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white"
              style={{
                width: "4px",
                height: "4px",
                top: `${10 + (i * 13) % 60}%`,
                left: `${5 + (i * 17) % 90}%`,
                opacity: 0.8,
                animation: `twinkle ${1 + (i % 3) * 0.5}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </>
      )}

      {/* Clouds */}
      {!isTimeTraveler && (
        <>
          <div
            className="absolute rounded-full"
            style={{
              width: "80px",
              height: "30px",
              background: "rgba(255,255,255,0.7)",
              top: "20px",
              left: "60px",
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: "60px",
              height: "25px",
              background: "rgba(255,255,255,0.6)",
              top: "30px",
              right: "80px",
            }}
          />
        </>
      )}

      {/* Girl character */}
      {(isLostLeaves || isTimeTraveler) && (
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            left: "80px",
            animation: isTimeTraveler ? "none" : "girlWalk 4s ease-in-out infinite alternate",
          }}
        >
          {/* Head */}
          <div
            style={{
              width: "28px",
              height: "28px",
              background: "#ffcc80",
              borderRadius: "50%",
              margin: "0 auto",
              position: "relative",
            }}
          >
            {/* Hair */}
            <div style={{ position: "absolute", top: "-4px", left: "4px", width: "20px", height: "10px", background: "#5d4037", borderRadius: "10px 10px 0 0" }} />
          </div>
          {/* Body */}
          <div style={{ width: "36px", height: "50px", background: isTimeTraveler ? "#3f51b5" : "#f06292", borderRadius: "10px", margin: "2px auto 0" }} />
        </div>
      )}

      {/* Dog character */}
      {isLostLeaves && (
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            right: "100px",
            animation: "dogRun 4s ease-in-out infinite alternate-reverse",
          }}
        >
          <div style={{ width: "55px", height: "30px", background: "#8d6e63", borderRadius: "15px", position: "relative" }}>
            {/* Dog head */}
            <div style={{ position: "absolute", width: "30px", height: "28px", background: "#6d4c41", borderRadius: "50%", right: "-15px", top: "-5px" }} />
            {/* Tail */}
            <div style={{ position: "absolute", width: "20px", height: "8px", background: "#8d6e63", borderRadius: "10px", left: "-15px", top: "5px", transform: "rotate(-30deg)" }} />
          </div>
        </div>
      )}

      {/* Monkey character */}
      {isMagicWind && (
        <div style={{ position: "absolute", bottom: "40px", left: "120px", animation: "monkeyJump 2s ease-in-out infinite alternate" }}>
          <div style={{ width: "24px", height: "24px", background: "#8d6e63", borderRadius: "50%", margin: "0 auto" }} />
          <div style={{ width: "32px", height: "40px", background: "#a1887f", borderRadius: "10px", margin: "2px auto 0" }} />
        </div>
      )}

      {/* Robot character */}
      {isRobot && (
        <div style={{ position: "absolute", bottom: "40px", left: "50%", transform: "translateX(-50%)", animation: "robotBob 1.5s ease-in-out infinite alternate" }}>
          <div style={{ width: "40px", height: "32px", background: "#78909c", borderRadius: "8px", margin: "0 auto", position: "relative" }}>
            <div style={{ position: "absolute", top: "8px", left: "6px", width: "8px", height: "8px", background: "#29b6f6", borderRadius: "50%" }} />
            <div style={{ position: "absolute", top: "8px", right: "6px", width: "8px", height: "8px", background: "#29b6f6", borderRadius: "50%" }} />
          </div>
          <div style={{ width: "50px", height: "50px", background: "#607d8b", borderRadius: "8px", margin: "2px auto 0" }} />
        </div>
      )}

      {/* Rocket */}
      {isTimeTraveler && (
        <div style={{ position: "absolute", bottom: "35px", right: "80px", animation: "rocketFloat 2s ease-in-out infinite alternate" }}>
          <div style={{ fontSize: "40px" }}>🚀</div>
        </div>
      )}

      {/* Flying leaves */}
      {(isLostLeaves || isMagicWind) && (
        <>
          {["#fff176", "#a5d6a7", "#ffcc80", "#f48fb1"].map((color, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: "16px",
                height: "20px",
                background: color,
                borderRadius: "4px",
                top: `${20 + i * 15}%`,
                left: `${20 + i * 20}%`,
                animation: `leafFly${i % 2 === 0 ? "A" : "B"} ${2 + i * 0.5}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </>
      )}

      <style>{`
        @keyframes girlWalk { 0%{left:80px} 100%{left:140px} }
        @keyframes dogRun { 0%{right:100px} 100%{right:60px} }
        @keyframes monkeyJump { 0%{transform:translateY(0)} 100%{transform:translateY(-20px)} }
        @keyframes robotBob { 0%{transform:translateY(0) rotate(-3deg)} 100%{transform:translateY(-10px) rotate(3deg)} }
        @keyframes rocketFloat { 0%{transform:translateY(0) rotate(-10deg)} 100%{transform:translateY(-15px) rotate(10deg)} }
        @keyframes leafFlyA { 0%{transform:translateY(0) rotate(0deg)} 100%{transform:translateY(-30px) rotate(180deg)} }
        @keyframes leafFlyB { 0%{transform:translateY(0) rotate(0deg)} 100%{transform:translate(20px,-20px) rotate(-120deg)} }
        @keyframes twinkle { 0%{opacity:0.3} 100%{opacity:1} }
      `}</style>
    </div>
  );
};

const CalendarStoryIntro = ({ onStart }) => {
  const [selectedStory, setSelectedStory] = useState(0);
  const current = STORIES[selectedStory];

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-8 px-4" style={{ background: "var(--gradient-warm)" }}>
      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="font-display text-4xl md:text-5xl font-bold text-secondary mb-2">
          📅 Calendar Game
        </h1>
        <p className="font-body text-muted-foreground text-lg">Ek kahani chuno aur khelo! 🌟</p>
      </div>

      {/* Story selector tabs */}
      <div className="flex flex-wrap justify-center gap-2 mb-6 max-w-2xl w-full">
        {STORIES.map((s, i) => (
          <button
            key={s.id}
            onClick={() => setSelectedStory(i)}
            className={`px-4 py-2 rounded-2xl font-display font-bold text-sm transition-all border-2 ${
              selectedStory === i
                ? "bg-primary text-primary-foreground border-primary scale-105 shadow-lg"
                : "bg-card border-border text-foreground hover:border-primary"
            }`}
          >
            {s.emoji} Story {i + 1}
          </button>
        ))}
      </div>

      {/* Story card */}
      <div
        key={current.id}
        className={`bg-gradient-to-br ${current.color} rounded-3xl p-6 max-w-2xl w-full shadow-xl border-2 border-white/50 animate-fade-in mb-6`}
      >
        <h2 className="font-display text-2xl font-bold text-center text-foreground mb-4">
          {current.title}
        </h2>

        {/* Animation stage */}
        <StoryAnimation story={current} />

        {/* Story text */}
        <p className="font-body text-base md:text-lg text-foreground/80 text-center mt-4 leading-relaxed">
          {current.text}
        </p>
      </div>

      {/* Start button */}
      <button
        onClick={() => onStart(current)}
        className="px-8 py-4 rounded-2xl font-display font-bold text-xl bg-primary text-primary-foreground hover:scale-110 transition-all shadow-lg animate-pulse"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {current.buttonText}
      </button>

      <p className="text-xs text-muted-foreground font-body mt-4">
        Pehle HTML calendar game hai, phir aur bhi levels! 🎮
      </p>
    </div>
  );
};

export default CalendarStoryIntro;
