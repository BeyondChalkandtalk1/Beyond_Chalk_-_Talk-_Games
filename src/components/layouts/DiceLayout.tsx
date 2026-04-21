const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DieFace = ({ number, size = 44 }) => {
  const pipLayouts = {
    1: [{ top: "50%", left: "50%" }],
    2: [
      { top: "25%", left: "25%" },
      { top: "75%", left: "75%" },
    ],
    3: [
      { top: "25%", left: "25%" },
      { top: "50%", left: "50%" },
      { top: "75%", left: "75%" },
    ],
    4: [
      { top: "25%", left: "25%" },
      { top: "25%", left: "75%" },
      { top: "75%", left: "25%" },
      { top: "75%", left: "75%" },
    ],
    5: [
      { top: "25%", left: "25%" },
      { top: "25%", left: "75%" },
      { top: "50%", left: "50%" },
      { top: "75%", left: "25%" },
      { top: "75%", left: "75%" },
    ],
    6: [
      { top: "22%", left: "28%" },
      { top: "22%", left: "72%" },
      { top: "50%", left: "28%" },
      { top: "50%", left: "72%" },
      { top: "78%", left: "28%" },
      { top: "78%", left: "72%" },
    ],
  };
  const pips = pipLayouts[number] || [];
  const dotSize = Math.round(size * 0.18);
  return (
    <div
      className="relative rounded-xl border-2 border-border bg-white shadow-md"
      style={{ width: size, height: size, flexShrink: 0 }}
    >
      {pips.map((pos, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-gray-800"
          style={{
            width: dotSize,
            height: dotSize,
            top: pos.top,
            left: pos.left,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
    </div>
  );
};

const MonthDots = ({ month }) => {
  if (month <= 6) return <DieFace number={month} size={60} />;
  return (
    <div className="flex items-center gap-1">
      <DieFace number={6} size={60} />
      <DieFace number={month - 6} size={60} />
    </div>
  );
};

// slotConfig = { isPlaced, result, isShaking, placedMonth, onDragOver, onDrop, onClick }
const MonthCard = ({ positionFace, monthIndex, slotConfig = {} }: { positionFace: any; monthIndex: any; slotConfig?: any }) => {
  const {
    isPlaced,
    result,
    isShaking,
    placedMonth,
    onDragOver,
    onDrop,
    onClick,
  } = slotConfig;

  let cardBg =
    "bg-card border-border hover:border-primary hover:scale-[1.03] hover:shadow-lg";
  if (isPlaced) {
    cardBg =
      result === "correct"
        ? "bg-green-100 border-green-500 scale-[1.03]"
        : "bg-red-100 border-red-500";
  }

  return (
    <div
      className={`flex flex-col items-center gap-2 p-3 rounded-2xl border-2 cursor-pointer transition-all duration-200 select-none ${cardBg} ${isShaking ? "animate-shake" : ""}`}
      style={{ boxShadow: "var(--shadow-card)", minWidth: 80 }}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
    >
      {/* Position die */}
      {/* <DieFace number={positionFace} size={40} /> */}

      {/* Content: placed month OR month dots + name */}
      <div className="flex flex-col items-center justify-center gap-1">
        {isPlaced && placedMonth ? (
          <>
            <span className="text-2xl">{placedMonth.emoji}</span>
            <span className="text-2xl font-display font-bold text-foreground">
              {placedMonth.name}
            </span>
          </>
        ) : (
          <>
            <MonthDots month={monthIndex + 1} />
            <span
              className="text-lg font-semibold"
              style={{ color: "#b45309" }}
            >
              {MONTHS[monthIndex]}
            </span>
          </>
        )}
      </div>
    </div>
  );
};


const DiceLayout = ({ slotConfigs = [], centerContent }) => {
  return (
    <div className="w-full mb-8">
      <div
        className="bg-card border-4 border-border rounded-3xl p-4 grid grid-cols-6 gap-3"
        style={{ boxShadow: "var(--shadow-card)" }}
      >
        {Array.from({ length: 12 }).map((_, i) => (
          <MonthCard
            key={i}
            positionFace={i + 1}
            monthIndex={i}
            slotConfig={slotConfigs[i]}
          />
        ))}
      </div>
    </div>
  );
};

export default DiceLayout;