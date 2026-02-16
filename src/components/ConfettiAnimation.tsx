const ConfettiAnimation = () => {
  const colors = [
    "hsl(36 80% 50%)",
    "hsl(45 90% 55%)",
    "hsl(0 60% 35%)",
    "hsl(140 60% 45%)",
    "hsl(200 80% 55%)",
    "hsl(280 70% 55%)",
  ];

  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 1.5,
    color: colors[Math.floor(Math.random() * colors.length)],
    size: Math.random() * 10 + 6,
    rotation: Math.random() * 360,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute confetti-piece"
          style={{
            left: `${piece.left}%`,
            top: "-20px",
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.color,
            borderRadius: piece.id % 3 === 0 ? "50%" : "2px",
            animationDelay: `${piece.delay}s`,
            transform: `rotate(${piece.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};

export default ConfettiAnimation;
