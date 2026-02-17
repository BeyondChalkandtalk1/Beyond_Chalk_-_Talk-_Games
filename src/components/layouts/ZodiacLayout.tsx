const ZODIAC_SIGNS = ["♈", "♉", "♊", "♋", "♌", "♍", "♎", "♏", "♐", "♑", "♒", "♓"];

const ZodiacLayout = ({ slots, centerContent }) => {
  const getPosition = (index) => {
    const angle = (index * 30 - 90) * (Math.PI / 180);
    const radius = 40;
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    };
  };

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square mb-8">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full flex items-center justify-center z-10"
        style={{ background: "var(--gradient-golden)" }}>
        {centerContent || (
          <span className="text-primary-foreground font-display text-base font-bold text-center leading-tight">
            ☀️<br />Zodiac
          </span>
        )}
      </div>

      <div className="absolute inset-[8%] rounded-full border-2 border-primary/30" />
      <div className="absolute inset-[12%] rounded-full border-2 border-dashed border-accent/40" />

      {ZODIAC_SIGNS.map((sign, index) => {
        const angle = (index * 30 + 15 - 90) * (Math.PI / 180);
        const r = 24;
        const x = 50 + r * Math.cos(angle);
        const y = 50 + r * Math.sin(angle);
        return (
          <div
            key={`zodiac-${index}`}
            className="absolute text-lg opacity-40 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {sign}
          </div>
        );
      })}

      {slots.map((slot, index) => {
        const pos = getPosition(index);
        return (
          <div
            key={index}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            {slot}
          </div>
        );
      })}
    </div>
  );
};

export default ZodiacLayout;
