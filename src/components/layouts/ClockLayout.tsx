const getClockPosition = (index) => {
  const angle = (index * 30 - 90) * (Math.PI / 180);
  const radius = 38;
  return {
    x: 50 + radius * Math.cos(angle),
    y: 50 + radius * Math.sin(angle),
  };
};

const ClockLayout = ({ slots, centerContent }) => {
  return (
    <div className="relative w-full max-w-lg mx-auto aspect-square mb-8">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full bg-primary flex items-center justify-center z-10">
        {centerContent || (
          <span className="text-primary-foreground font-display text-lg font-bold text-center leading-tight">
            12<br />Months
          </span>
        )}
      </div>

      <div className="absolute inset-[10%] rounded-full border-4 border-dashed border-border" />

      {slots.map((slot, index) => {
        const pos = getClockPosition(index);
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

export default ClockLayout;
