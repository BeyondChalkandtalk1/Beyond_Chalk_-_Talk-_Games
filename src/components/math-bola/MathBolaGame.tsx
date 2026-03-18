import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/contexts/SoundContext';
import { AgeGroup, MathClue, generateTickets, generateCluesForTicket, mathBolaInstructions } from '@/data/mathBolaData';
import correctSound from '@/assets/correctDargSound.mpeg';
import incorrectSound from '@/assets/inCorrectDragSound.mpeg';
import timerSound from '@/assets/TimerSound.mpeg';
import howtoplaySound from '@/assets/howToPlaySound.mpeg';
import tapSound from '@/assets/tapToOpenSound.mpeg';

interface Props {
  age: AgeGroup;
  ticketIndex: number;
  onComplete: () => void;
  onHome: () => void;
}

type Phase = 'howtoplay' | 'timerStart' | 'playing' | 'tryAgain' | 'complete';

export default function MathBolaGame({ age, ticketIndex, onComplete, onHome }: Props) {
  const { playSound, isSoundEnabled } = useSound();

  // Generate ticket & clues once
  const [gameData] = useState(() => {
    const { tickets } = generateTickets(age);
    const ticket = tickets[ticketIndex] || tickets[0];
    const clues = generateCluesForTicket(ticket, age);
    return { ticket, clues };
  });

  const [phase, setPhase] = useState<Phase>('howtoplay');
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const [markedCells, setMarkedCells] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(20);
  const [totalTime, setTotalTime] = useState(0);
  const [announcementHistory, setAnnouncementHistory] = useState<MathClue[]>([]);
  const [tryAgainTimer, setTryAgainTimer] = useState(0);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tryAgainRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);

  const { ticket, clues } = gameData;

  // Count total numbers on ticket
  const totalNumbers = ticket.flat().filter(c => c !== null).length;
  const currentClue = clues[currentClueIndex] || null;

  // Check if all cells marked
  const allMarked = markedCells.size >= totalNumbers;

  // Start the 20s announcement timer
  const startAnnouncementTimer = useCallback(() => {
    setTimer(20);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
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
    if (phase !== 'playing') return;
    if (timer === 0 && !allMarked) {
      moveToNextClue();
    }
  }, [timer, phase, allMarked]);

  // Add current clue to history when it starts
  useEffect(() => {
    if (phase === 'playing' && currentClue) {
      setAnnouncementHistory(prev => {
        if (prev.find(c => c.id === currentClue.id)) return prev;
        return [...prev, currentClue];
      });
    }
  }, [currentClueIndex, phase, currentClue]);

  // Auto-scroll history
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [announcementHistory]);

  // Total elapsed timer
  useEffect(() => {
    if (phase === 'playing') {
      totalTimerRef.current = setInterval(() => setTotalTime(p => p + 1), 1000);
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
      setCurrentClueIndex(prev => prev + 1);
      startAnnouncementTimer();
    } else {
      // All clues done — check completion
      if (allMarked) {
        setPhase('complete');
      } else {
        // Restart clues (loop)
        setCurrentClueIndex(0);
        startAnnouncementTimer();
      }
    }
  }, [currentClueIndex, clues.length, allMarked, startAnnouncementTimer]);

  const handleStartGame = () => {
    setPhase('timerStart');
  };

  const handleTimerStart = () => {
    setPhase('playing');
    startAnnouncementTimer();
  };

  const handleCellClick = (row: number, col: number) => {
    if (phase === 'tryAgain' || !currentClue) return;

    const cellValue = ticket[row][col];
    if (cellValue === null) return;

    const key = `${row}-${col}`;
    if (markedCells.has(key)) return; // Already marked

    if (cellValue === currentClue.answer) {
      // Correct!
      playSound(correctSound);
      setMarkedCells(prev => new Set(prev).add(key));
      setScore(prev => prev + 1);

      // Check if all marked
      const newMarked = new Set(markedCells).add(key);
      if (newMarked.size >= totalNumbers) {
        if (timerRef.current) clearInterval(timerRef.current);
        setTimeout(() => setPhase('complete'), 500);
        return;
      }

      // Move to next clue
      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => moveToNextClue(), 1000);
    } else {
      // Wrong!
      playSound(incorrectSound);
      setPhase('tryAgain');
      setTryAgainTimer(10);
      if (timerRef.current) clearInterval(timerRef.current);

      tryAgainRef.current = setInterval(() => {
        setTryAgainTimer(prev => {
          if (prev <= 1) {
            clearInterval(tryAgainRef.current!);
            setPhase('playing');
            moveToNextClue();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  // ─── HOW TO PLAY MODAL ───
  if (phase === 'howtoplay' || showHowToPlay) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120 }}
          className="relative w-[90%] max-w-[450px] bg-[#FBF5EF] rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.25)] p-6"
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
          <h2 className="text-2xl font-bold text-center mb-4 text-secondary">
            📖 How to Play — Math Bola
          </h2>
          <div className="max-h-[300px] overflow-y-auto pr-2">
            <ul className="space-y-3 text-foreground text-sm leading-relaxed">
              {mathBolaInstructions.map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span>{item.emoji}</span>
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
              className="bg-secondary text-secondary-foreground px-6 py-2 rounded-full shadow-md hover:scale-105 transition"
            >
              {showHowToPlay ? 'Back to Game 🎮' : "Let's Go! 🎉"}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── TIMER START MODAL ───
  if (phase === 'timerStart') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
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
          </p>
          <button
            onClick={() => {
              playSound(tapSound);
              handleTimerStart();
            }}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full text-lg font-bold shadow-lg hover:scale-105 transition-transform"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            ▶️ Start Timer
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── COMPLETE MODAL ───
  if (phase === 'complete') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', damping: 12 }}
          className="bg-card rounded-3xl p-8 max-w-md w-full mx-4 text-center space-y-5"
          style={{ boxShadow: 'var(--shadow-hover)' }}
        >
          <div className="text-6xl">🎉🏆🎊</div>
          <h2 className="text-3xl font-bold text-secondary" style={{ fontFamily: 'var(--font-display)' }}>
            Math Bola Complete!
          </h2>
          <p className="text-lg text-muted-foreground">
            You marked all {totalNumbers} numbers on your ticket!
          </p>
          <div className="flex justify-center gap-4 text-lg">
            <div className="bg-primary/10 rounded-xl px-4 py-2">
              <span className="font-bold text-primary">⏱️ {formatTime(totalTime)}</span>
            </div>
            <div className="bg-primary/10 rounded-xl px-4 py-2">
              <span className="font-bold text-primary">🎯 {score}/{totalNumbers}</span>
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
            <span className="font-bold text-primary text-lg" style={{ fontFamily: 'var(--font-display)' }}>
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
          <span className="font-bold text-primary text-lg" style={{ fontFamily: 'var(--font-display)' }}>
            {score}/{totalNumbers}
          </span>
        </div>
      </div>

      {/* Try Again overlay */}
      <AnimatePresence>
        {phase === 'tryAgain' && (
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
            <div className="bg-card rounded-2xl border border-border p-4 text-center" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="text-sm text-muted-foreground mb-1">Score</div>
              <div className="text-3xl font-bold text-primary" style={{ fontFamily: 'var(--font-display)' }}>
                {score}
              </div>
            </div>
            <div className="bg-card rounded-2xl border border-border p-4 text-center" style={{ boxShadow: 'var(--shadow-card)' }}>
              <div className="text-sm text-muted-foreground mb-1">Next Clue In</div>
              <div className={`text-3xl font-bold ${timer <= 5 ? 'text-destructive animate-pulse' : 'text-primary'}`} style={{ fontFamily: 'var(--font-display)' }}>
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
            style={{ boxShadow: 'var(--shadow-card)' }}
          >
            <div className="text-sm text-muted-foreground mb-1">📢 Current Announcement</div>
            {currentClue ? (
              <div className="text-2xl md:text-3xl font-bold text-secondary" style={{ fontFamily: 'var(--font-display)' }}>
                {currentClue.clue} = ?
              </div>
            ) : (
              <div className="text-lg text-muted-foreground">Waiting...</div>
            )}
          </motion.div>

          {/* Announcement History */}
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
                    return ticket[r][c] === clue.answer;
                  });
                  return (
                    <div
                      key={clue.id}
                      className={`flex items-center justify-between text-sm px-3 py-2 rounded-lg ${
                        isAnswered ? 'bg-primary/10 text-primary' : 'bg-muted/50 text-muted-foreground'
                      }`}
                    >
                      <span>#{clue.id}: {clue.clue} = ?</span>
                      <span className="font-bold">
                        {isAnswered ? '✅' : '⏳'} {clue.answer}
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
          <div className="bg-card rounded-2xl border-2 border-primary/20 p-4" style={{ boxShadow: 'var(--shadow-card)' }}>
            <div className="text-center mb-3">
              <span className="text-sm font-bold text-muted-foreground">🎫 Your Math Bola Ticket</span>
            </div>

            {/* 3×9 Grid */}
            <div className="space-y-1">
              {ticket.map((row, rowIdx) => (
                <div key={rowIdx} className="grid grid-cols-9 gap-1">
                  {row.map((cell, colIdx) => {
                    const key = `${rowIdx}-${colIdx}`;
                    const isMarked = markedCells.has(key);
                    const isEmpty = cell === null;
                    const isCurrentAnswer = currentClue && cell === currentClue.answer;

                    return (
                      <motion.button
                        key={colIdx}
                        disabled={isEmpty || isMarked || phase === 'tryAgain'}
                        onClick={() => handleCellClick(rowIdx, colIdx)}
                        whileTap={!isEmpty && !isMarked ? { scale: 0.9 } : {}}
                        className={`
                          aspect-square rounded-lg text-sm md:text-base font-bold flex items-center justify-center
                          transition-all relative border
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
