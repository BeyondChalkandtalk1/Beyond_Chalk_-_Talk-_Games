const PizzaLayout = ({ slots, centerContent }) => {
  const getSlicePosition = (index) => {
    const angle = (index * 30 - 90) * (Math.PI / 180);
    const radius = 38;
    return {
      x: 50 + radius * Math.cos(angle),
      y: 50 + radius * Math.sin(angle),
    };
  };

  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square mb-8">
      <div className="absolute inset-[6%] rounded-full border-8 border-secondary/30" />
      
      <div
        className="absolute inset-[8%] rounded-full"
        style={{ background: "linear-gradient(135deg, hsl(45 80% 70%), hsl(36 70% 60%))" }}
      />

      {Array.from({ length: 12 }).map((_, i) => {
        const angle = i * 30;
        return (
          <div
            key={`line-${i}`}
            className="absolute top-1/2 left-1/2 h-px bg-secondary/20 origin-left"
            style={{
              width: "42%",
              transform: `rotate(${angle}deg)`,
            }}
          />
        );
      })}

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full flex items-center justify-center z-10"
        style={{ background: "var(--gradient-maroon)" }}>
        {centerContent || (
          <span className="text-primary-foreground font-display text-base font-bold text-center leading-tight">
            🍕<br />Pizza
          </span>
        )}
      </div>

      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * 30 + 15 - 90) * (Math.PI / 180);
        const r = 25;
        const x = 50 + r * Math.cos(angle);
        const y = 50 + r * Math.sin(angle);
        const toppings = ["🫑", "🍄", "🫒", "🌶️", "🧅", "🍅"];
        return (
          <div
            key={`top-${i}`}
            className="absolute text-sm opacity-50 -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {toppings[i % toppings.length]}
          </div>
        );
      })}

      {slots.map((slot, index) => {
        const pos = getSlicePosition(index);
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

export default PizzaLayout;
