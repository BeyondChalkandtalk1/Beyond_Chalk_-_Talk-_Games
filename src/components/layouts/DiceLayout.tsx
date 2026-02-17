const DiceLayout = ({ slots, centerContent }) => {
  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="flex justify-center mb-4">
        <div className="px-6 py-2 rounded-full bg-primary flex items-center justify-center">
          {centerContent || (
            <span className="text-primary-foreground font-display text-base font-bold">
              🎲 Dice Layout — 12 Months
            </span>
          )}
        </div>
      </div>

      <div className="flex gap-4 justify-center flex-wrap">
        <div
          className="bg-card border-4 border-border rounded-3xl p-4 inline-grid grid-cols-2 grid-rows-3 gap-3"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {slots.slice(0, 6).map((slot, i) => (
            <div key={i} className="flex items-center justify-center">
              {slot}
            </div>
          ))}
        </div>

        <div
          className="bg-card border-4 border-border rounded-3xl p-4 inline-grid grid-cols-2 grid-rows-3 gap-3"
          style={{ boxShadow: "var(--shadow-card)" }}
        >
          {slots.slice(6, 12).map((slot, i) => (
            <div key={i + 6} className="flex items-center justify-center">
              {slot}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DiceLayout;
