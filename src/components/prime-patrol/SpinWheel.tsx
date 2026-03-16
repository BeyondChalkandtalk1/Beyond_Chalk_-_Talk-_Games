import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw } from 'lucide-react';
import spinBg from "../../assets/spinBg.mp4";
import spinWheelSOund from "../../assets/SpinWheelSound.mpeg";
import { useSound } from '@/contexts/SoundContext';

interface SpinWheelProps {
  onLetsPlay: (number: number) => void;
}

const SEGMENT_COUNT = 15;
const COLORS = [
  '#FF6B6B', '#FF8E53', '#FFC107', '#8BC34A', '#4CAF50',
  '#00BCD4', '#2196F3', '#3F51B5', '#9C27B0', '#E91E63',
  '#FF5722', '#FF9800', '#CDDC39', '#009688', '#03A9F4',
  '#673AB7', '#F44336', '#FFC107', '#4DB6AC', '#7E57C2',
];

function generateNumbers(): number[] {
  const nums: number[] = [];
  while (nums.length < SEGMENT_COUNT) {
    const n = Math.floor(Math.random() * 98) + 2; // 2-99
    if (!nums.includes(n)) nums.push(n);
  }
  return nums;
}

export default function SpinWheel({ onLetsPlay }: SpinWheelProps) {
  const [numbers, setNumbers] = useState<number[]>(generateNumbers);
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const wheelRef = useRef<SVGSVGElement>(null);
  const { playSound } = useSound();
    const handleCloseModal = useCallback(() => {
      setShowResult(false);
      setSelectedNumber(null);
    }, []);

  const segmentAngle = 360 / SEGMENT_COUNT;

  const handleRefresh = useCallback(() => {
    if (spinning) return;
    setNumbers(generateNumbers());
    setSelectedNumber(null);
    setShowResult(false);
    setRotation(0);
  }, [spinning]);

  // const handleSpin = useCallback(() => {
  //   if (spinning) return;
  //     playSound(spinWheelSOund);
  //   setShowResult(false);
  //   setSelectedNumber(null);
  //   setSpinning(true);

  //   // Random spins: 5-10 full rotations + random offset
  //   const extraSpins = (Math.floor(Math.random() * 5) + 5) * 360;
  //   const randomAngle = Math.random() * 360;
  //   const totalRotation = rotation + extraSpins + randomAngle;

  //   setRotation(totalRotation);

  //   // Calculate which segment the arrow points to after spin
  //   setTimeout(() => {
  //     // Arrow is at top (0°). The wheel rotates clockwise.
  //     // Final angle mod 360 tells us where the wheel stopped
  //     const finalAngle = totalRotation % 360;
  //     // The arrow points to the segment at (360 - finalAngle) degrees
  //     const arrowAngle = (360 - finalAngle + 360) % 360;
  //     const segmentIndex = Math.floor(arrowAngle / segmentAngle) % SEGMENT_COUNT;
      
  //     setSelectedNumber(numbers[segmentIndex]);
  //     setShowResult(true);
  //     setSpinning(false);
  //   }, 4500);
  // }, [spinning, rotation, numbers, segmentAngle]);

  const handleSpin = useCallback(() => {
    if (spinning) return;
    playSound(spinWheelSOund);
    setShowResult(false);
    setSelectedNumber(null);
    setSpinning(true);

    // ── Force land on a perfect square (49, 36, or 81) ──────────────────────
    const targetNumbers = [49, 36, 81];
    const target =
      targetNumbers[Math.floor(Math.random() * targetNumbers.length)];

    // Put target at a known index in the numbers array (index 0)
    const newNumbers = [...numbers];
    const existingIndex = newNumbers.indexOf(target);
    if (existingIndex !== -1) {
      // Swap target to index 0
      [newNumbers[0], newNumbers[existingIndex]] = [
        newNumbers[existingIndex],
        newNumbers[0],
      ];
    } else {
      // Replace index 0 with target
      newNumbers[0] = target;
    }
    setNumbers(newNumbers);

    // Target is now at index 0. Arrow is at top (0°).
    // Segment 0 starts at -90° (top). Mid of segment 0 = (0 + 0.5) * segmentAngle - 90
    // We want arrow to point at mid of segment 0 after spin.
    // arrowAngle = 0 means segment index 0 → finalAngle = (360 - 0) % 360 = 0
    // So totalRotation % 360 must = 0 → totalRotation must be multiple of 360
    const extraSpins = (Math.floor(Math.random() * 5) + 5) * 360; // 5-10 full rotations
    // Add small offset to land at center of segment 0
    const segmentMidOffset = segmentAngle * 0.5;
    const totalRotation =
      Math.ceil((rotation + extraSpins) / 360) * 360 - segmentMidOffset;

    setRotation(totalRotation);

    setTimeout(() => {
      setSelectedNumber(target);
      setShowResult(true);
      setSpinning(false);
    }, 4500);
  }, [spinning, rotation, numbers, segmentAngle]);
  
  const size = 530;
  const center = size / 2;
  const radius = size / 2 - 10;

  return (
    <div
      className="min-h-screen flex flex-col bg-transparent items-center justify-center p-4 relative overflow-hidden"
      style={{ background: "transparent" }}
    >
      <video
        src={spinBg}
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          objectFit: "cover",
          zIndex: 0,
        }}
      />

      {/* Title */}
      <motion.h1
        className="relative z-10 text-3xl md:text-6xl font-bold text-center mb-6 text-black bg-clip-text"
        style={{
          fontFamily: "var(--font-display)",
          backgroundImage: "linear-gradient(135deg, #FFD700, #FF6B6B, #FF8E53)",
        }}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        🎯 Prime Patrol & Combo Detectives 🔍
      </motion.h1>

      <div className="flex flex-col lg:flex-row items-end gap-8 z-20">
        <motion.button
          onClick={handleSpin}
          disabled={spinning}
          className="px-6 py-4 rounded-full font-bold text-2xl shadow-xl disabled:opacity-50 transition-all"
          style={{
            fontFamily: "var(--font-display)",
            background: spinning
              ? "linear-gradient(135deg, #666, #888)"
              : "linear-gradient(135deg, #FFD700, #FFA000)",
            color: spinning ? "#ccc" : "#1a1a2e",
          }}
          whileHover={!spinning ? { scale: 1.08 } : {}}
          whileTap={!spinning ? { scale: 0.95 } : {}}
          animate={
            !spinning && !showResult
              ? {
                  boxShadow: [
                    "0 0 20px rgba(255,215,0,0.3)",
                    "0 0 40px rgba(255,215,0,0.6)",
                    "0 0 20px rgba(255,215,0,0.3)",
                  ],
                }
              : {}
          }
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {spinning ? "🌀 Spinning..." : "🎰 Spin the wheel"}
        </motion.button>
        {/* Wheel Container */}
        <div className="relative">
          {/* Arrow pointer at top */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-20">
            <div
              className="w-0 h-0 border-l-[16px] border-r-[16px] border-t-[32px] border-l-transparent border-r-transparent"
              style={{
                borderTopColor: "#FFD700",
                filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.4))",
              }}
            />
          </div>

          {/* Outer glow ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background:
                "conic-gradient(from 0deg, #FF6B6B, #FFD700, #4CAF50, #2196F3, #9C27B0, #FF6B6B)",
              filter: "blur(15px)",
              opacity: spinning ? 0.6 : 0.3,
              transition: "opacity 0.5s",
              margin: "-8px",
            }}
          />

          {/* Wheel SVG */}
          <motion.svg
            ref={wheelRef}
            width={size}
            height={size}
            viewBox={`0 0 ${size} ${size}`}
            className="relative z-10 drop-shadow-2xl"
            animate={{ rotate: rotation }}
            transition={{ duration: 4.5, ease: [0.17, 0.67, 0.12, 0.99] }}
          >
            {/* Outer border circle */}
            <circle
              cx={center}
              cy={center}
              r={radius + 5}
              fill="none"
              stroke="#FFD700"
              strokeWidth="4"
            />

            {numbers.map((num, i) => {
              const startAngle = (i * segmentAngle - 90) * (Math.PI / 180);
              const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180);
              const x1 = center + radius * Math.cos(startAngle);
              const y1 = center + radius * Math.sin(startAngle);
              const x2 = center + radius * Math.cos(endAngle);
              const y2 = center + radius * Math.sin(endAngle);
              const largeArc = segmentAngle > 180 ? 1 : 0;

              // Text position
              const midAngle =
                ((i + 0.5) * segmentAngle - 90) * (Math.PI / 180);
              const textR = radius * 0.7;
              const tx = center + textR * Math.cos(midAngle);
              const ty = center + textR * Math.sin(midAngle);
              const textRotation = (i + 0.5) * segmentAngle;

              return (
                <g key={i}>
                  <path
                    d={`M ${center} ${center} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={COLORS[i]}
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1.5"
                  />
                  <text
                    x={tx}
                    y={ty}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fill="black"
                    fontSize="32"
                    fontWeight="800"
                    transform={`rotate(${textRotation}, ${tx}, ${ty})`}
                    style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}
                  >
                    {num}
                  </text>
                </g>
              );
            })}

            {/* Center circle */}
            <circle
              cx={center}
              cy={center}
              r={35}
              fill="#1a1a2e"
              stroke="#FFD700"
              strokeWidth="3"
            />
            <text
              x={center}
              y={center}
              textAnchor="middle"
              dominantBaseline="central"
              fill="#FFD700"
              fontSize="24"
              fontWeight="bold"
              style={{ fontFamily: "var(--font-display)" }}
            >
              SPIN
            </text>
          </motion.svg>
        </div>

        {/* Right side controls */}
        <div className="flex flex-col items-center gap-5">
          {/* Refresh Button */}
          <motion.button
            onClick={handleRefresh}
            disabled={spinning}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-bold text-2xl shadow-lg disabled:opacity-50 transition-all"
            style={{
              fontFamily: "var(--font-display)",
              background: "linear-gradient(135deg, #FFD700, #FFA000)",
              color: "black",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <RefreshCw
              className={`w-5 h-5 ${spinning ? "animate-spin" : ""}`}
            />
            Refresh Numbers
          </motion.button>

          {/* Spin Button */}
        </div>
      </div>

      {/* Lucky Number Result Modal */}
      <AnimatePresence>
        {showResult && selectedNumber !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal Content */}
            <motion.div
              className="relative rounded-2xl px-10 py-8 border-2 text-center max-w-md w-full"
              style={{
                background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                borderColor: "#FFD700",
                boxShadow: "0 0 40px rgba(255,215,0,0.3)",
              }}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 300 }}
            >
              <button
                onClick={handleCloseModal}
                className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full text-white font-bold text-lg transition-all hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
                aria-label="Close"
              >
                ✕
              </button>
              <p
                className="text-xl text-white mb-2"
                style={{ fontFamily: "var(--font-body)" }}
              >
                Your lucky number is
              </p>
              <motion.span
                className="text-7xl font-extrabold inline-block my-3"
                style={{
                  fontFamily: "var(--font-display)",
                  color: "#FFD700",
                  textShadow: "0 0 20px rgba(255,215,0,0.5)",
                }}
                animate={{ scale: [1, 1.15, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                {selectedNumber}
              </motion.span>
              <p
                className="text-lg mt-3"
                style={{ fontFamily: "var(--font-body)", color: "#e0e0e0" }}
              >
                Let's identify whether it is a{" "}
                <span className="font-bold text-green-400">prime number</span>{" "}
                or a{" "}
                <span className="font-bold text-orange-400">
                  composite number
                </span>
                .
              </p>

              <motion.button
                onClick={() => onLetsPlay(selectedNumber)}
                className="mt-6 px-10 py-3 rounded-full font-bold text-xl shadow-xl"
                style={{
                  fontFamily: "var(--font-display)",
                  background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
                  color: "white",
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 0 15px rgba(76,175,80,0.3)",
                    "0 0 30px rgba(76,175,80,0.6)",
                    "0 0 15px rgba(76,175,80,0.3)",
                  ],
                }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                🚀 Let's Play!
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
