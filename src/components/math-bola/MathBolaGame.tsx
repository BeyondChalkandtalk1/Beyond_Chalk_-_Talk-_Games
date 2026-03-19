<<<<<<< Updated upstream
import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/contexts/SoundContext';
import { AgeGroup, MathClue, generateTickets, generateCluesForTicket, mathBolaInstructions } from '@/data/mathBolaData';
import correctSound from '@/assets/correctDargSound.mpeg';
import incorrectSound from '@/assets/inCorrectDragSound.mpeg';
import timerSound from '@/assets/TimerSound.mpeg';
import howtoplaySound from '@/assets/howToPlaySound.mpeg';
import tapSound from '@/assets/tapToOpenSound.mpeg';
=======
import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/contexts/SoundContext";
import {
  AgeGroup,
  MathClue,
  generateTickets,
  generateCluesForTicket,
  mathBolaInstructions,
} from "@/data/mathboladata";
import correctSound from "@/assets/correctDargSound.mpeg";
import incorrectSound from "@/assets/inCorrectDragSound.mpeg";
import timerSound from "@/assets/TimerSound.mpeg";
import howtoplaySound from "@/assets/howToPlaySound.mpeg";
import tapSound from "@/assets/tapToOpenSound.mpeg";
>>>>>>> Stashed changes

interface Props {
  age: AgeGroup;
  ticketIndex: number;
  onComplete: () => void;
  onHome: () => void;
}

<<<<<<< Updated upstream
type Phase = 'howtoplay' | 'timerStart' | 'playing' | 'tryAgain' | 'complete';

export default function MathBolaGame({ age, ticketIndex, onComplete, onHome }: Props) {
=======
type Phase = "howtoplay" | "timerStart" | "playing" | "tryAgain" | "complete";

export default function MathBolaGame({
  age,
  ticketIndex,
  onComplete,
  onHome,
}: Props) {
>>>>>>> Stashed changes
  const { playSound, isSoundEnabled } = useSound();

  // Generate ticket & clues once
  const [gameData] = useState(() => {
    const { tickets } = generateTickets(age);
    const ticket = tickets[ticketIndex] || tickets[0];
    const clues = generateCluesForTicket(ticket, age);
    return { ticket, clues };
  });

<<<<<<< Updated upstream
  const [phase, setPhase] = useState<Phase>('howtoplay');
=======
  const [phase, setPhase] = useState<Phase>("howtoplay");
>>>>>>> Stashed changes
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const [markedCells, setMarkedCells] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(20);
  const [totalTime, setTotalTime] = useState(0);
<<<<<<< Updated upstream
  const [announcementHistory, setAnnouncementHistory] = useState<MathClue[]>([]);
=======
  const [announcementHistory, setAnnouncementHistory] = useState<MathClue[]>(
    [],
  );
>>>>>>> Stashed changes
  const [tryAgainTimer, setTryAgainTimer] = useState(0);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tryAgainRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);

  const { ticket, clues } = gameData;

  // Count total numbers on ticket
<<<<<<< Updated upstream
  const totalNumbers = ticket.flat().filter(c => c !== null).length;
=======
  const totalNumbers = ticket.flat().filter((c) => c !== null).length;
>>>>>>> Stashed changes
  const currentClue = clues[currentClueIndex] || null;

  // Check if all cells marked
  const allMarked = markedCells.size >= totalNumbers;

  // Start the 20s announcement timer
  const startAnnouncementTimer = useCallback(() => {
    setTimer(20);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
<<<<<<< Updated upstream
      setTimer(prev => {
=======
      setTimer((prev) => {
>>>>>>> Stashed changes
        if (prev <= 1) {
          // Move to next announcement
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // When timer hits 0, move to next clue
  useEffect(() => {
<<<<<<< Updated upstream
    if (phase !== 'playing') return;
=======
    if (phase !== "playing") return;
>>>>>>> Stashed changes
    if (timer === 0 && !allMarked) {
      moveToNextClue();
    }
  }, [timer, phase, allMarked]);

<<<<<<< Updated upstream
  // Add PREVIOUS clue to history when moving to next clue (not the current one)
  const prevClueRef = useRef<MathClue | null>(null);
  useEffect(() => {
    if (phase === 'playing' && currentClue) {
      // Add the previous clue to history (if any)
      if (prevClueRef.current && !announcementHistory.find(c => c.id === prevClueRef.current!.id)) {
        setAnnouncementHistory(prev => [prevClueRef.current!, ...prev]);
      }
      prevClueRef.current = currentClue;
    }
  }, [currentClueIndex, phase]);

  // Total elapsed timer
  useEffect(() => {
    if (phase === 'playing') {
      totalTimerRef.current = setInterval(() => setTotalTime(p => p + 1), 1000);
=======
  // Add current clue to history when it starts
  useEffect(() => {
    if (phase === "playing" && currentClue) {
      setAnnouncementHistory((prev) => {
        if (prev.find((c) => c.id === currentClue.id)) return prev;
        return [...prev, currentClue];
      });
    }
  }, [currentClueIndex, phase, currentClue]);

  // Auto-scroll history
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [announcementHistory]);

  // Total elapsed timer
  useEffect(() => {
    if (phase === "playing") {
      totalTimerRef.current = setInterval(
        () => setTotalTime((p) => p + 1),
        1000,
      );
>>>>>>> Stashed changes
      if (isSoundEnabled) playSound(timerSound);
    }
    return () => {
      if (totalTimerRef.current) clearInterval(totalTimerRef.current);
    };
  }, [phase]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (totalTimerRef.current) clearInterval(totalTimerRef.current);
      if (tryAgainRef.current) clearInterval(tryAgainRef.current);
    };
  }, []);

  const moveToNextClue = useCallback(() => {
    if (currentClueIndex + 1 < clues.length) {
<<<<<<< Updated upstream
      setCurrentClueIndex(prev => prev + 1);
=======
      setCurrentClueIndex((prev) => prev + 1);
>>>>>>> Stashed changes
      startAnnouncementTimer();
    } else {
      // All clues done — check completion
      if (allMarked) {
<<<<<<< Updated upstream
        setPhase('complete');
=======
        setPhase("complete");
>>>>>>> Stashed changes
      } else {
        // Restart clues (loop)
        setCurrentClueIndex(0);
        startAnnouncementTimer();
      }
    }
  }, [currentClueIndex, clues.length, allMarked, startAnnouncementTimer]);

  const handleStartGame = () => {
<<<<<<< Updated upstream
    setPhase('timerStart');
  };

  const handleTimerStart = () => {
    setPhase('playing');
=======
    setPhase("timerStart");
  };

  const handleTimerStart = () => {
    setPhase("playing");
>>>>>>> Stashed changes
    startAnnouncementTimer();
  };

  const handleCellClick = (row: number, col: number) => {
<<<<<<< Updated upstream
    if (phase === 'tryAgain' || !currentClue) return;
=======
    if (phase === "tryAgain" || !currentClue) return;
>>>>>>> Stashed changes

    const cellValue = ticket[row][col];
    if (cellValue === null) return;

    const key = `${row}-${col}`;
    if (markedCells.has(key)) return; // Already marked

    if (cellValue === currentClue.answer) {
      // Correct!
      playSound(correctSound);
<<<<<<< Updated upstream
      setMarkedCells(prev => new Set(prev).add(key));
      setScore(prev => prev + 1);
=======
      setMarkedCells((prev) => new Set(prev).add(key));
      setScore((prev) => prev + 1);
>>>>>>> Stashed changes

      // Check if all marked
      const newMarked = new Set(markedCells).add(key);
      if (newMarked.size >= totalNumbers) {
        if (timerRef.current) clearInterval(timerRef.current);
<<<<<<< Updated upstream
        // Add current clue to history before completing
        if (currentClue && !announcementHistory.find(c => c.id === currentClue.id)) {
          setAnnouncementHistory(prev => [currentClue, ...prev]);
        }
        setTimeout(() => setPhase('complete'), 500);
=======
        setTimeout(() => setPhase("complete"), 500);
>>>>>>> Stashed changes
        return;
      }

      // Move to next clue
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => moveToNextClue(), 1000);
    } else {
      // Wrong!
      playSound(incorrectSound);
<<<<<<< Updated upstream
      setPhase('tryAgain');
=======
      setPhase("tryAgain");
>>>>>>> Stashed changes
      setTryAgainTimer(10);
      if (timerRef.current) clearInterval(timerRef.current);

      tryAgainRef.current = setInterval(() => {
<<<<<<< Updated upstream
        setTryAgainTimer(prev => {
          if (prev <= 1) {
            clearInterval(tryAgainRef.current!);
            setPhase('playing');
=======
        setTryAgainTimer((prev) => {
          if (prev <= 1) {
            clearInterval(tryAgainRef.current!);
            setPhase("playing");
>>>>>>> Stashed changes
            moveToNextClue();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

<<<<<<< Updated upstream
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // ─── HOW TO PLAY MODAL ───
  if (phase === 'howtoplay' || showHowToPlay) {
=======
  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // ─── HOW TO PLAY MODAL ───
  if (phase === "howtoplay" || showHowToPlay) {
>>>>>>> Stashed changes
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
<<<<<<< Updated upstream
          transition={{ type: 'spring', stiffness: 120 }}
          className="relative w-[90%] max-w-[450px] bg-[#FBF5EF] rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.25)] p-6"
=======
          transition={{ type: "spring", stiffness: 120 }}
          className="relative w-[90%] max-w-[850px] bg-[#FBF5EF] rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.25)] p-6"
>>>>>>> Stashed changes
        >
          <button
            onClick={() => {
              if (showHowToPlay) {
                setShowHowToPlay(false);
              } else {
                handleStartGame();
              }
            }}
            className="absolute top-3 right-4 text-xl font-bold text-secondary"
          >
            ✖
          </button>
<<<<<<< Updated upstream
          <h2 className="text-2xl font-bold text-center mb-4 text-secondary">
            📖 How to Play — Math Bola
          </h2>
          <div className="max-h-[300px] overflow-y-auto pr-2">
            <ul className="space-y-3 text-foreground text-sm leading-relaxed">
              {mathBolaInstructions.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span>{item.emoji}</span>
=======
          <h2 className="text-3xl font-bold text-center mb-4 text-secondary">
            📖 How to Play — Math Bola
          </h2>
          <div className="max-h-[500px]  overflow-y-auto pr-2">
            <ul className="space-y-3 text-foreground text-2xl leading-relaxed">
              {mathBolaInstructions.map((item, i) => (
                <li key={i} className="flex gap-2">
                  {/* <span>{item.emoji}</span> */}
>>>>>>> Stashed changes
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-5 text-center">
            <button
              onClick={() => {
                playSound(tapSound);
                if (showHowToPlay) {
                  setShowHowToPlay(false);
                } else {
                  handleStartGame();
                }
              }}
<<<<<<< Updated upstream
              className="bg-secondary text-secondary-foreground px-6 py-2 rounded-full shadow-md hover:scale-105 transition"
            >
              {showHowToPlay ? 'Back to Game 🎮' : "Let's Go! 🎉"}
=======
              className="bg-secondary text-secondary-foreground text-2xl px-6 py-2 rounded-full shadow-md hover:scale-105 transition"
            >
              {showHowToPlay ? "Back to Game 🎮" : "Let's Go! 🎉"}
>>>>>>> Stashed changes
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── TIMER START MODAL ───
<<<<<<< Updated upstream
  if (phase === 'timerStart') {
=======
  if (phase === "timerStart") {
>>>>>>> Stashed changes
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
<<<<<<< Updated upstream
          transition={{ type: 'spring', damping: 15 }}
          className="bg-card rounded-3xl p-8 max-w-sm w-full mx-4 text-center space-y-6"
          style={{ boxShadow: 'var(--shadow-hover)' }}
        >
          <div className="text-6xl">⏱️</div>
          <h2 className="text-2xl font-bold text-secondary" style={{ fontFamily: 'var(--font-display)' }}>
            Ready to Start?
          </h2>
          <p className="text-muted-foreground">
            A new math clue will appear every 20 seconds. Solve it and mark the answer on your ticket!
=======
          transition={{ type: "spring", damping: 15 }}
          className="bg-card rounded-3xl p-8 max-w-sm w-full mx-4 text-center space-y-6"
          style={{ boxShadow: "var(--shadow-hover)" }}
        >
          <div className="text-6xl">⏱️</div>
          <h2
            className="text-3xl font-bold text-secondary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to Start?
          </h2>
          <p className="text-muted-foreground text-2xl">
            A new math clue will appear every 20 seconds. Solve it and mark the
            answer on your ticket!
>>>>>>> Stashed changes
          </p>
          <button
            onClick={() => {
              playSound(tapSound);
              handleTimerStart();
            }}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full text-lg font-bold shadow-lg hover:scale-105 transition-transform"
<<<<<<< Updated upstream
            style={{ fontFamily: 'var(--font-display)' }}
=======
            style={{ fontFamily: "var(--font-display)" }}
>>>>>>> Stashed changes
          >
            ▶️ Start Timer
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── COMPLETE MODAL ───
<<<<<<< Updated upstream
  if (phase === 'complete') {
=======
  if (phase === "complete") {
>>>>>>> Stashed changes
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
<<<<<<< Updated upstream
          transition={{ type: 'spring', damping: 12 }}
          className="bg-card rounded-3xl p-8 max-w-md w-full mx-4 text-center space-y-5"
          style={{ boxShadow: 'var(--shadow-hover)' }}
        >
          <div className="text-6xl">🎉🏆🎊</div>
          <h2 className="text-3xl font-bold text-secondary" style={{ fontFamily: 'var(--font-display)' }}>
=======
          transition={{ type: "spring", damping: 12 }}
          className="bg-card rounded-3xl p-8 max-w-md w-full mx-4 text-center space-y-5"
          style={{ boxShadow: "var(--shadow-hover)" }}
        >
          <div className="text-6xl">🎉🏆🎊</div>
          <h2
            className="text-3xl font-bold text-secondary"
            style={{ fontFamily: "var(--font-display)" }}
          >
>>>>>>> Stashed changes
            Math Bola Complete!
          </h2>
          <p className="text-lg text-muted-foreground">
            You marked all {totalNumbers} numbers on your ticket!
          </p>
          <div className="flex justify-center gap-4 text-lg">
            <div className="bg-primary/10 rounded-xl px-4 py-2">
<<<<<<< Updated upstream
              <span className="font-bold text-primary">⏱️ {formatTime(totalTime)}</span>
            </div>
            <div className="bg-primary/10 rounded-xl px-4 py-2">
              <span className="font-bold text-primary">🎯 {score}/{totalNumbers}</span>
=======
              <span className="font-bold text-primary">
                ⏱️ {formatTime(totalTime)}
              </span>
            </div>
            <div className="bg-primary/10 rounded-xl px-4 py-2">
              <span className="font-bold text-primary">
                🎯 {score}/{totalNumbers}
              </span>
>>>>>>> Stashed changes
            </div>
          </div>
          <div className="flex gap-3 justify-center pt-2">
            <button
              onClick={onComplete}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:scale-105 transition-transform"
            >
              🔄 Play Again
            </button>
            <button
              onClick={onHome}
              className="px-6 py-3 rounded-xl bg-muted text-muted-foreground font-bold text-lg hover:scale-105 transition-transform"
            >
              🏠 Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── MAIN GAME UI ───
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/10">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur border-b border-border">
        <div className="flex items-center gap-3">
          {/* Timer */}
          <div className="flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
            <span className="text-lg">⏱️</span>
<<<<<<< Updated upstream
            <span className="font-bold text-primary text-lg" style={{ fontFamily: 'var(--font-display)' }}>
=======
            <span
              className="font-bold text-primary text-lg"
              style={{ fontFamily: "var(--font-display)" }}
            >
>>>>>>> Stashed changes
              {formatTime(totalTime)}
            </span>
          </div>
          {/* How to play */}
          <button
            onClick={() => {
              playSound(howtoplaySound);
              setShowHowToPlay(true);
            }}
            className="bg-secondary/10 text-secondary rounded-full px-3 py-2 text-sm font-bold hover:bg-secondary/20 transition"
          >
            📖 How to Play
          </button>
        </div>
        {/* Score */}
        <div className="flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
          <span className="text-lg">🎯</span>
<<<<<<< Updated upstream
          <span className="font-bold text-primary text-lg" style={{ fontFamily: 'var(--font-display)' }}>
=======
          <span
            className="font-bold text-primary text-lg"
            style={{ fontFamily: "var(--font-display)" }}
          >
>>>>>>> Stashed changes
            {score}/{totalNumbers}
          </span>
        </div>
      </div>

      {/* Try Again overlay */}
      <AnimatePresence>
<<<<<<< Updated upstream
        {phase === 'tryAgain' && (
=======
        {phase === "tryAgain" && (
>>>>>>> Stashed changes
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-40 bg-destructive text-destructive-foreground px-6 py-3 rounded-2xl shadow-lg text-lg font-bold"
          >
            ❌ Wrong! Try again in {tryAgainTimer}s
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content: 40-60 split */}
      <div className="flex flex-col md:flex-row gap-4 p-4 max-w-6xl mx-auto">
        {/* LEFT 40% — Score, Timer, Announcement, History */}
        <div className="md:w-[40%] space-y-4">
          {/* Score & Timer boxes */}
          <div className="grid grid-cols-2 gap-3">
<<<<<<< Updated upstream
            <div className="bg-card rounded-2xl border border-border p-4 text-center" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="text-sm text-muted-foreground mb-1">Score</div>
              <div className="text-3xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                {score}
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-4 text-center" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="text-sm text-muted-foreground mb-1">Next Clue In</div>
              <div className={`text-3xl font-bold ${timer <= 5 ? 'text-destructive animate-pulse' : 'text-primary'}`} style={{ fontFamily: 'var(--font-display)' }}>
=======
            <div
              className="bg-card rounded-2xl border border-border p-4 text-center"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="text-sm text-muted-foreground mb-1">Score</div>
              <div
                className="text-3xl font-bold text-primary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {score}
              </div>
            </div>
            <div
              className="bg-card rounded-2xl border border-border p-4 text-center"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="text-sm text-muted-foreground mb-1">
                Next Clue In
              </div>
              <div
                className={`text-3xl font-bold ${timer <= 5 ? "text-destructive animate-pulse" : "text-primary"}`}
                style={{ fontFamily: "var(--font-display)" }}
              >
>>>>>>> Stashed changes
                {timer}s
              </div>
            </div>
          </div>

          {/* Current Announcement */}
          <motion.div
            key={currentClueIndex}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-card rounded-2xl border-2 border-primary/30 p-5 text-center"
<<<<<<< Updated upstream
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div className="text-sm text-muted-foreground mb-1">📢 Current Announcement</div>
            {currentClue ? (
              <div className="text-2xl md:text-3xl font-bold text-secondary" style={{ fontFamily: 'var(--font-display)' }}>
=======
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="text-sm text-muted-foreground mb-1">
              📢 Current Announcement
            </div>
            {currentClue ? (
              <div
                className="text-2xl md:text-3xl font-bold text-secondary"
                style={{ fontFamily: "var(--font-display)" }}
              >
>>>>>>> Stashed changes
                {currentClue.clue} = ?
              </div>
            ) : (
              <div className="text-lg text-muted-foreground">Waiting...</div>
            )}
          </motion.div>

          {/* Announcement History */}
<<<<<<< Updated upstream
          <div className="bg-card rounded-2xl border border-border p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="text-sm font-bold text-muted-foreground mb-2">📋 Announcement History</div>
            <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1">
              {announcementHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No announcements yet...</p>
              ) : (
                announcementHistory.map((clue) => {
                  // Check if this clue's answer is marked
                  const isAnswered = Array.from(markedCells).some(key => {
                    const [r, c] = key.split('-').map(Number);
=======
          <div
            className="bg-card rounded-2xl border border-border p-4"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="text-sm font-bold text-muted-foreground mb-2">
              📋 Announcement History
            </div>
            <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1">
              {announcementHistory.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                  No announcements yet...
                </p>
              ) : (
                announcementHistory.map((clue) => {
                  // Check if this clue's answer is marked
                  const isAnswered = Array.from(markedCells).some((key) => {
                    const [r, c] = key.split("-").map(Number);
>>>>>>> Stashed changes
                    return ticket[r][c] === clue.answer;
                  });
                  return (
                    <div
                      key={clue.id}
                      className={`flex items-center justify-between text-sm px-3 py-2 rounded-lg ${
<<<<<<< Updated upstream
                        isAnswered ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground'
                      }`}
                    >
                      <span>#{clue.id}: {clue.clue} = ?</span>
                      <span className="font-bold">
                        {isAnswered ? '✅' : '⏳'} {clue.answer}
=======
                        isAnswered
                          ? "bg-primary/10 text-primary"
                          : "bg-muted/50 text-muted-foreground"
                      }`}
                    >
                      <span>
                        #{clue.id}: {clue.clue} = ?
                      </span>
                      <span className="font-bold">
                        {isAnswered ? "✅" : "⏳"} {clue.answer}
>>>>>>> Stashed changes
                      </span>
                    </div>
                  );
                })
              )}
              <div ref={historyEndRef} />
            </div>
          </div>
        </div>

        {/* RIGHT 60% — Ticket */}
        <div className="md:w-[60%]">
<<<<<<< Updated upstream
          <div className="bg-card rounded-2xl border-2 border-primary/20 p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="text-center mb-3">
              <span className="text-sm font-bold text-muted-foreground">🎫 Your Math Bola Ticket</span>
=======
          <div
            className="bg-card rounded-2xl border-2 border-primary/20 p-4"
            style={{ boxShadow: "var(--shadow-card)" }}
          >
            <div className="text-center mb-3">
              <span className="text-sm font-bold text-muted-foreground">
                🎫 Your Math Bola Ticket
              </span>
>>>>>>> Stashed changes
            </div>

            {/* 3×9 Grid */}
            <div className="space-y-1">
              {ticket.map((row, rowIdx) => (
                <div key={rowIdx} className="grid grid-cols-9 gap-1">
                  {row.map((cell, colIdx) => {
                    const key = `${rowIdx}-${colIdx}`;
                    const isMarked = markedCells.has(key);
                    const isEmpty = cell === null;
<<<<<<< Updated upstream
                    const isCurrentAnswer = currentClue && cell === currentClue.answer;
=======
                    const isCurrentAnswer =
                      currentClue && cell === currentClue.answer;
>>>>>>> Stashed changes

                    return (
                      <motion.button
                        key={colIdx}
<<<<<<< Updated upstream
                        disabled={isEmpty || isMarked || phase === 'tryAgain'}
=======
                        disabled={isEmpty || isMarked || phase === "tryAgain"}
>>>>>>> Stashed changes
                        onClick={() => handleCellClick(rowIdx, colIdx)}
                        whileTap={!isEmpty && !isMarked ? { scale: 0.9 } : {}}
                        className={`
                          aspect-square rounded-lg text-sm md:text-base font-bold flex items-center justify-center
                          transition-all relative border
<<<<<<< Updated upstream
                          ${isEmpty
                            ? 'bg-muted/30 border-transparent cursor-default'
                            : isMarked
                              ? 'bg-primary/20 border-primary/40 text-primary cursor-default'
                              : 'bg-card border-border hover:border-primary hover:bg-primary/5 cursor-pointer hover:shadow-md'
                          }
                        `}
                        style={{ fontFamily: 'var(--font-display)' }}
                      >
                        {!isEmpty && (
                          <>
                            <span className={isMarked ? 'opacity-40' : ''}>{cell}</span>
=======
                          ${
                            isEmpty
                              ? "bg-muted/30 border-transparent cursor-default"
                              : isMarked
                                ? "bg-primary/20 border-primary/40 text-primary cursor-default"
                                : "bg-card border-border hover:border-primary hover:bg-primary/5 cursor-pointer hover:shadow-md"
                          }
                        `}
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {!isEmpty && (
                          <>
                            <span className={isMarked ? "opacity-40" : ""}>
                              {cell}
                            </span>
>>>>>>> Stashed changes
                            {isMarked && (
                              <motion.span
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute inset-0 flex items-center justify-center text-2xl text-primary"
                              >
                                ✕
                              </motion.span>
                            )}
                          </>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
