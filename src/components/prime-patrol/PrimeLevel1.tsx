import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/contexts/SoundContext';
import TimerSound from '@/assets/TimerSound.mpeg';
import howtoplaySound from "@/assets/howToPlaySound.mpeg";
import correctSound from '@/assets/correctDargSound.mpeg';
import incorrectSound from '@/assets/inCorrectDragSound.mpeg';
import generalSound from '@/assets/general-sound.mpeg';

interface PrimeLevel1Props {
  luckyNumber: number;
  onComplete: () => void;
}

const EMOJIS = ['⭐', '💎', '🎯',  '🌈'];
const MAX_DIM = 99;

function getFactorPairs(n: number): [number, number][] {
  const pairs: [number, number][] = [];
  for (let i = 1; i <= Math.sqrt(n); i++) {
    if (n % i === 0) {
      const j = n / i;
      if (i <= MAX_DIM && j <= MAX_DIM) {
        pairs.push([i, j]);
      }
    }
  }
  return pairs;
}

function isPrime(n: number): boolean {
  if (n < 2) return false;
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false;
  }
  return true;
}

function detectRectangle(cells: Set<string>): [number, number] | null {
  if (cells.size === 0) return null;
  const positions = Array.from(cells).map(k => {
    const [r, c] = k.split(',').map(Number);
    return [r, c] as [number, number];
  });
  const rows = positions.map(p => p[0]);
  const cols = positions.map(p => p[1]);
  const minR = Math.min(...rows), maxR = Math.max(...rows);
  const minC = Math.min(...cols), maxC = Math.max(...cols);
  const h = maxR - minR + 1, w = maxC - minC + 1;
  if (h * w !== cells.size) return null;
  for (let r = minR; r <= maxR; r++) {
    for (let c = minC; c <= maxC; c++) {
      if (!cells.has(`${r},${c}`)) return null;
    }
  }
  return [h, w];
}

type Phase = 'howtoplay' | 'timerStart' | 'countdown' | 'playing' | 'rectFound' | 'congrats' | 'inputPair' | 'primeCongrats' | 'complete';

export default function PrimeLevel1({ luckyNumber, onComplete }: PrimeLevel1Props) {
  const { playSound, isSoundEnabled } = useSound();

  const [phase, setPhase] = useState<Phase>('howtoplay');
  const [emoji, setEmoji] = useState('⭐');
  const [cells, setCells] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState<[number, number][]>([]);
  const [currentRect, setCurrentRect] = useState<[number, number] | null>(null);
  const [timer, setTimer] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [inputR, setInputR] = useState('');
  const [inputC, setInputC] = useState('');
  const [inputError, setInputError] = useState('');
  const [noRectMsg, setNoRectMsg] = useState('');
  const [highlightRect, setHighlightRect] = useState(false);
  const [congratsError, setCongratsError] = useState('');
  const completedRef = useRef(completed);
  completedRef.current = completed;

  const primeNum = useMemo(() => isPrime(luckyNumber), [luckyNumber]);
  const allPairs = useMemo(() => getFactorPairs(luckyNumber), [luckyNumber]);

  const gridSize = useMemo(() => {
    let maxDim = 6;
    allPairs.forEach(([a, b]) => { maxDim = Math.max(maxDim, a, b); });
    if (allPairs.length === 0) {
      maxDim = Math.ceil(Math.sqrt(luckyNumber)) + 2;
    }
    return Math.min(Math.max(maxDim + 2, 6), MAX_DIM);
  }, [allPairs, luckyNumber]);

  const remaining = useMemo(() =>
    allPairs.filter(([a, b]) => !completed.some(([ca, cb]) => ca === a && cb === b)),
    [allPairs, completed]
  );

  // Timer
  useEffect(() => {
    if (phase !== 'playing' && phase !== 'rectFound') return;
    const iv = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(iv);
  }, [phase]);

  // Countdown
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown < 0) { setPhase('playing'); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, countdown]);

  const handleStartTimer = () => {
    setPhase('countdown');
  };

  // Timer sound
  useEffect(() => {
    if (phase !== 'playing' || !isSoundEnabled) return;
    const audio = new Audio(TimerSound);
    audio.loop = true; audio.volume = 0.3;
    audio.play().catch(() => {});
    return () => { audio.pause(); audio.currentTime = 0; };
  }, [phase, isSoundEnabled]);

  // How to play sound
  useEffect(() => {
    if (phase === 'howtoplay' || showHowToPlay) {
      console.log("play sount how")
      playSound(howtoplaySound);
    }
  }, [phase, showHowToPlay]);

  // Auto-check rectangle when all cells placed
  useEffect(() => {
    if (phase !== 'playing') return;
    if (cells.size < luckyNumber) { setNoRectMsg(''); return; }
    if (cells.size !== luckyNumber) return;

    const rect = detectRectangle(cells);
    if (rect) {
      const norm: [number, number] = rect[0] <= rect[1] ? [rect[0], rect[1]] : [rect[1], rect[0]];
      const alreadyDone = completedRef.current.some(([a, b]) => a === norm[0] && b === norm[1]);
      if (alreadyDone) {
        setNoRectMsg(`You already found ${norm[0]} × ${norm[1]}! Try a different arrangement! 😊`);
        return;
      }
      setCurrentRect(norm);
      setHighlightRect(true);
      setPhase('rectFound');
      setNoRectMsg('');
      playSound(correctSound);

      setTimeout(() => {
        setCompleted(prev => [...prev, norm]);
        setHighlightRect(false);
        setPhase('congrats');
        setCongratsError('');
      }, 2000);
    } else {
      setNoRectMsg("Not a perfect rectangle! Clear and try again, or click \"It's Prime!\" if no rectangle is possible! 🤔");
    }
  }, [cells.size, phase]);

  const handleCellClick = useCallback((r: number, c: number) => {
    if (phase !== 'playing') return;
    const key = `${r},${c}`;
    setCells(prev => {
      const next = new Set(prev);
      if (next.has(key)) { next.delete(key); }
      else if (next.size < luckyNumber) { next.add(key); }
      return next;
    });
  }, [phase, luckyNumber]);

  const handleClear = () => { setCells(new Set()); setNoRectMsg(''); };

  const handlePrimeGuess = () => {
    if (primeNum || allPairs.length === 0) {
      playSound(correctSound);
      setPhase('primeCongrats');
    } else {
      playSound(incorrectSound);
      setNoRectMsg(`Not prime! ${luckyNumber} is composite. Try to form a rectangle! 💪`);
      setCells(new Set());
    }
  };

  const handleMoreYes = () => {
    setPhase('inputPair');
    setInputR(''); setInputC(''); setInputError('');
  };

  const handleMoreNo = () => {
    // remaining includes the pair we JUST completed, so recalculate
    const currentRemaining = allPairs.filter(([a, b]) =>
      !completedRef.current.some(([ca, cb]) => ca === a && cb === b)
    );
    if (currentRemaining.length > 0) {
      setCongratsError(`Oops! There are still ${currentRemaining.length} more arrangement(s) possible! Think again! 🤔`);
    } else {
      setPhase('complete');
    }
  };

  const handleSubmitPair = () => {
    const r = parseInt(inputR), c = parseInt(inputC);
    if (isNaN(r) || isNaN(c) || r <= 0 || c <= 0) {
      setInputError('Please enter valid numbers!'); return;
    }
    if (r * c !== luckyNumber) {
      setInputError(`${r} × ${c} = ${r * c}, but we need ${luckyNumber}! Try again! 🤔`); return;
    }
    const norm: [number, number] = r <= c ? [r, c] : [c, r];
    if (completed.some(([a, b]) => a === norm[0] && b === norm[1])) {
      setInputError(`Already found ${norm[0]} × ${norm[1]}! Try another!`); return;
    }
    if (r > MAX_DIM || c > MAX_DIM) {
      setInputError(`Too big! Both numbers must be ≤ ${MAX_DIM}`); return;
    }
    setCells(new Set());
    setNoRectMsg('');
    setPhase('playing');
  };

  const formatTime = (s: number) => s < 60 ? `${s}s` : `${Math.floor(s / 60)}m ${(s % 60).toString().padStart(2, '0')}s`;

  // Complete screen
  if (phase === 'complete') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6"
        style={{ background: 'linear-gradient(135deg, #fef3c7, #fce7f3, #dbeafe)' }}>
        <motion.div className="text-center space-y-4"
          initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <div className="text-6xl">🎉🏆🎊</div>
          <h1 className="text-4xl font-bold text-secondary" style={{ fontFamily: 'var(--font-display)' }}>
            Level 1 Complete!
          </h1>
          <div className="bg-white/80 rounded-2xl p-6 shadow-lg max-w-md mx-auto space-y-3">
            <p className="text-2xl font-bold" style={{ color: primeNum ? '#16a34a' : '#ea580c' }}>
              {luckyNumber} is a {primeNum ? 'Prime Number! 🌟' : 'Composite Number! 🎯'}
            </p>
            {primeNum ? (
              <p className="text-muted-foreground">
                {luckyNumber} can only be divided by 1 and itself. No rectangular arrangement other than 1 × {luckyNumber} is possible!
              </p>
            ) : (
              <div>
                <p className="text-lg font-semibold mb-2">Arrangements found:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {completed.map(([a, b], i) => (
                    <span key={i} className="inline-block bg-primary/10 text-primary font-bold px-3 py-1 rounded-full">
                      {a} × {b}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <p className="text-muted-foreground">⏱️ Time: {formatTime(timer)}</p>
          </div>
          <button onClick={onComplete}
            className="px-10 py-4 rounded-full font-bold text-xl shadow-xl text-white hover:scale-105 transition-transform"
            style={{ background: 'linear-gradient(135deg, #4CAF50, #8BC34A)', fontFamily: 'var(--font-display)' }}>
            Continue to Level 2 →
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col p-3"
      style={{
        background: "linear-gradient(135deg, #f0f4ff, #fdf2f8, #f0fdf4)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3 px-2">
        <div className="flex flex-col gap-2">
          <span className="text-2xl font-bold bg-white px-4 py-2 rounded-full shadow-md text-center">
            ⏱️ {formatTime(timer)}
          </span>
          <button
            onClick={() => setShowHowToPlay(true)}
            className="px-3 py-1.5 text-white text-2xl bg-slate-500 font-bold rounded-full hover:scale-105 transition-transform"
          >
            📖 How to Play
          </button>
        </div>
        <h2
          className="text-2xl md:text-4xl font-bold text-secondary text-center"
          style={{ fontFamily: "var(--font-display)" }}
        >
          🔍 Level 1 — Prime Patrol and Combo Detectives
        </h2>
        <span className="text-lg font-bold bg-white px-4 py-2 rounded-full shadow-md">
          ✅ {completed.length}/{allPairs.length}
        </span>
      </div>

      {/* Lucky number + remaining clicks */}
      <div className="text-center mb-2 flex flex-wrap items-center justify-center gap-3">
        <span className="bg-white/80 px-4 py-1.5 rounded-full shadow text-2xl font-bold">
          Your number:{" "}
          <span
            className="text-2xl font-bold text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {luckyNumber}
          </span>
        </span>
        <span className="bg-white/80 px-4 py-1.5 rounded-full shadow text-2xl font-bold">
          Remaining clicks:{" "}
          <span className="text-2xl font-bold text-secondary">
            {luckyNumber - cells.size}
          </span>
        </span>
      </div>

<div className='flex justify-center text-center text-2xl font-bold py-4 text-golden'>
  <h1>Select an icon</h1>
</div>
      {/* Emoji selector */}
      <div className="flex justify-center gap-2 mb-3">
        {EMOJIS.map((e) => (
          <button
            key={e}
            onClick={() => setEmoji(e)}
            className={`text-2xl p-1.5 rounded-lg transition-all ${emoji === e ? "bg-primary/20 scale-110 ring-2 ring-primary" : "hover:bg-muted"}`}
          >
            {e}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="flex justify-center mb-3">
        <div
          className="inline-grid gap-1 p-3 bg-white/70 rounded-2xl shadow-lg"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
            width: `min(85vw, ${gridSize * 50}px)`,
          }}
        >
          {Array.from({ length: gridSize * gridSize }, (_, idx) => {
            const r = Math.floor(idx / gridSize);
            const c = idx % gridSize;
            const key = `${r},${c}`;
            const isSelected = cells.has(key);
            const isHighlighted = highlightRect && isSelected;

            return (
              <motion.button
                key={key}
                onClick={() => handleCellClick(r, c)}
                className={`aspect-square rounded-md border-2 transition-all flex items-center justify-center text-sm md:text-lg
                  ${
                    isSelected
                      ? isHighlighted
                        ? "border-yellow-400 bg-yellow-100 shadow-[0_0_12px_rgba(250,204,21,0.7)]"
                        : "border-primary bg-primary/10"
                      : "border-gray-200 bg-white hover:border-primary/40 hover:bg-primary/5"
                  }`}
                whileTap={{ scale: 0.9 }}
              >
                {isSelected ? emoji : ""}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 mb-2">
        <button
          onClick={handleClear}
          className="px-6 py-2 rounded-full bg-destructive text-destructive-foreground font-bold shadow-md hover:scale-105 transition-transform"
        >
          🗑️ Clear All
        </button>
        {cells.size === luckyNumber && noRectMsg && (
          <motion.button
            onClick={handlePrimeGuess}
            className="px-6 py-2 rounded-full bg-amber-500 text-white font-bold shadow-md hover:scale-105 transition-transform"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            🤔 It's Prime!
          </motion.button>
        )}
      </div>

      {/* Messages */}
      <AnimatePresence>
        {noRectMsg && (
          <motion.p
            className="text-center text-sm font-semibold text-amber-600 mb-2 px-4"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {noRectMsg}
          </motion.p>
        )}
      </AnimatePresence>

      {/* ===== MODALS ===== */}

      {/* How to Play Modal */}
      <AnimatePresence>
        {(phase === "howtoplay" || showHowToPlay) && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <motion.div
              className="relative bg-[#FBF5EF] rounded-3xl shadow-2xl p-6 max-w-[600px] w-full max-h-[90vh] overflow-y-auto hide-scrollbar"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {/* <button
                onClick={() => {
                  if (phase === "howtoplay") setPhase("timerStart");
                  setShowHowToPlay(false);
                }}
                className="absolute top-3 right-4 text-xl font-bold text-[#8F2424]"
              >
                ✖
              </button> */}
              <h2 className="text-3xl font-bold text-center mb-4 text-[#8F2424]">
                📖 How to Play — Level 1
              </h2>
              <ul className="space-y-3 text-gray-700 text-2xl leading-relaxed">
                <li className="flex gap-2">
                  <span>🎰</span> Arrange the same number of icons on the grid.
                </li>
                <li className="flex gap-2">
                  <span>🎨</span> Try to organise the icons into rectangular
                  arrays with equal rows and columns.
                </li>
                <li className="flex gap-2">
                  <span>📐</span> Explore different possible arrangements on the
                  grid.
                </li>
                <li className="flex gap-2">
                  <span>🔄</span> If the icons can be arranged in one or
                  multiple rectangular array, the number is composite.
                </li>
                <li className="flex gap-2">
                  <span>🤔</span> If no other rectangular arrangement can be
                  formed (other than the basic one), the number is prime.
                </li>
              </ul>
              <div className="mt-5 text-center">
                <button
                  onClick={() => {
                    if (phase === "howtoplay") setPhase("timerStart");
                    setShowHowToPlay(false);
                  }}
                  className="bg-[#8F2424] text-white text-xl font-bold px-6 py-2 rounded-full shadow-md hover:scale-105 transition"
                >
                  Let's Play! 🎉
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Timer Start Modal */}
      <AnimatePresence>
        {phase === "timerStart" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <motion.div
              className="relative bg-[#FBF5EF] rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <div className="text-6xl mb-4">⏱️</div>
              <h3
                className="text-2xl font-bold text-[#8F2424] mb-3"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Ready to Start?
              </h3>
              <p className="text-gray-600 mb-6 text-xl">
                Timer will begin as soon as you click the button below!
              </p>
              <button
                onClick={handleStartTimer}
                className="px-8 py-3 rounded-full text-white font-bold text-xl shadow-lg hover:scale-105 transition-transform"
                style={{
                  background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
                  fontFamily: "var(--font-display)",
                }}
              >
                ▶️ Start Timer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Countdown Modal */}
      {/* <AnimatePresence>
        {phase === "countdown" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60" />
            <AnimatePresence mode="wait">
              <motion.div
                key={countdown}
                className="relative text-9xl font-bold text-white"
                style={{
                  fontFamily: "var(--font-display)",
                  textShadow: "0 0 40px rgba(255,215,0,0.8)",
                }}
                initial={{ scale: 2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.3, opacity: 0 }}
                transition={{ duration: 0.4 }}
              >
                {countdown > 0 ? countdown : "GO!"}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Congrats Modal */}
      <AnimatePresence>
        {phase === "congrats" && currentRect && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className="relative rounded-2xl p-8 border-2 text-center max-w-md w-full"
              style={{
                background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                borderColor: "#FFD700",
                boxShadow: "0 0 40px rgba(255,215,0,0.3)",
              }}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <button
                onClick={() => setPhase("congrats")}
                className="absolute top-3 right-4 text-xl font-bold text-white hover:text-red-400 transition"
              >
                ✖
              </button>
              <div className="text-5xl mb-3">🎉</div>
              <h3
                className="text-2xl font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Congratulations!
              </h3>
              <p className="text-lg text-gray-200 mb-4">
                You made a{" "}
                <span className="text-yellow-400 font-bold text-2xl">
                  {currentRect[0]} × {currentRect[1]}
                </span>{" "}
                rectangle!
              </p>
              <p className="text-white text-lg mb-4">
                Are more arrangements possible?
              </p>
              {congratsError && (
                <p className="text-amber-400 text-sm mb-3 animate-pulse">
                  {congratsError}
                </p>
              )}
              <div className="flex gap-4 justify-center">
                <button
                  onClick={handleMoreYes}
                  className="px-8 py-3 rounded-full font-bold text-lg text-white shadow-lg hover:scale-105 transition-transform"
                  style={{
                    background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
                  }}
                >
                  ✅ Yes!
                </button>
                <button
                  onClick={handleMoreNo}
                  className="px-8 py-3 rounded-full font-bold text-lg text-white shadow-lg hover:scale-105 transition-transform"
                  style={{
                    background: "linear-gradient(135deg, #ef4444, #f97316)",
                  }}
                >
                  ❌ No
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Prime Congrats Modal */}
      <AnimatePresence>
        {phase === "primeCongrats" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className="relative rounded-2xl p-8 border-2 text-center max-w-md w-full"
              style={{
                background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                borderColor: "#FFD700",
                boxShadow: "0 0 40px rgba(255,215,0,0.3)",
              }}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <div className="text-5xl mb-3">🌟🎉🌟</div>
              <h3
                className="text-2xl font-bold text-white mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Congratulations!
              </h3>
              <p className="text-lg text-gray-200 mb-2">
                You correctly identified that
              </p>
              <p
                className="text-3xl font-bold text-yellow-400 mb-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {luckyNumber} is a Prime Number!
              </p>
              <p className="text-gray-300 mb-6">
                It can only be divided by 1 and {luckyNumber}. No rectangular
                arrangement other than 1 × {luckyNumber} is possible! 🧠
              </p>
              <button
                onClick={() => setPhase("complete")}
                className="px-8 py-3 rounded-full font-bold text-lg text-white shadow-lg hover:scale-105 transition-transform"
                style={{
                  background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
                }}
              >
                Continue →
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input Pair Modal */}
      <AnimatePresence>
        {phase === "inputPair" && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              className="relative rounded-2xl p-8 border-2 text-center max-w-md w-full"
              style={{
                background: "linear-gradient(135deg, #1a1a2e, #16213e)",
                borderColor: "#FFD700",
              }}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              transition={{ type: "spring", damping: 20 }}
            >
              <button
                onClick={() => setPhase("congrats")}
                className="absolute top-3 right-4 text-xl font-bold text-white hover:text-red-400 transition"
              >
                ✖
              </button>
              <h3
                className="text-xl font-bold text-white mb-4"
                style={{ fontFamily: "var(--font-display)" }}
              >
                What's the next arrangement?
              </h3>
              <p className="text-gray-300 mb-4">
                Enter the dimensions: ___ × ___ = {luckyNumber}
              </p>
              <div className="flex items-center justify-center gap-3 mb-4">
                <input
                  type="number"
                  value={inputR}
                  onChange={(e) => setInputR(e.target.value)}
                  placeholder="rows"
                  className="w-20 px-3 py-2 rounded-lg text-center text-lg font-bold bg-white/10 text-white border border-white/30 focus:border-yellow-400 focus:outline-none"
                />
                <span className="text-2xl text-yellow-400 font-bold">×</span>
                <input
                  type="number"
                  value={inputC}
                  onChange={(e) => setInputC(e.target.value)}
                  placeholder="cols"
                  className="w-20 px-3 py-2 rounded-lg text-center text-lg font-bold bg-white/10 text-white border border-white/30 focus:border-yellow-400 focus:outline-none"
                />
              </div>
              {inputError && (
                <p className="text-amber-400 text-sm mb-3 animate-pulse">
                  {inputError}
                </p>
              )}
              <button
                onClick={handleSubmitPair}
                className="px-8 py-3 rounded-full font-bold text-lg text-white shadow-lg hover:scale-105 transition-transform"
                style={{
                  background: "linear-gradient(135deg, #4CAF50, #8BC34A)",
                }}
              >
                ✅ Submit
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
