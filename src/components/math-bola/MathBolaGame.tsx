import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/contexts/SoundContext";
import {
  AgeGroup,
  GameClue,
  TicketCell,
  generateTickets,
  generateCluesForTicket,
  mathBolaInstructions,
} from "@/data/mathBolaData";
import correctSound from "@/assets/correctDargSound.mpeg";
import incorrectSound from "@/assets/inCorrectDragSound.mpeg";
import timerSound from "@/assets/TimerSound.mpeg";
import howtoplaySound from "@/assets/howToPlaySound.mpeg";
import tapSound from "@/assets/tapToOpenSound.mpeg";
import game3Complete from "@/assets/game3Complete.mp4";
import tambulaCardSelection1 from "@/assets/mainGameVideo.mp4";

interface Props {
  age: AgeGroup;
  ticketIndex: number;
  ticketColor: string;
  onComplete: () => void;
  onHome: () => void;
}

type Phase = "howtoplay" | "timerStart" | "playing" | "tryAgain" | "complete";

export default function MathBolaGame({
  age,
  ticketIndex,
  ticketColor,
  onComplete,
  onHome,
}: Props) {
  const { playSound, isSoundEnabled } = useSound();

  // Generate ticket & clues once
  const [gameData] = useState(() => {
    const { tickets } = generateTickets(age);
    const ticket = tickets[ticketIndex] || tickets[0];
  const clues = generateCluesForTicket(ticket, age);
    return { ticket, clues };
  });

  const [phase, setPhase] = useState<Phase>("howtoplay");
  const [currentClueIndex, setCurrentClueIndex] = useState(0);
  const [markedCells, setMarkedCells] = useState<Set<string>>(new Set());
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(20);
  const [totalTime, setTotalTime] = useState(0);
  const [announcementHistory, setAnnouncementHistory] = useState<GameClue[]>(
    [],
  );
  const [tryAgainTimer, setTryAgainTimer] = useState(0);
  const [showTryAgainModal, setShowTryAgainModal] = useState(false);
  const [isTryAgainCountdown, setIsTryAgainCountdown] = useState(false);
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [showEarly5, setShowEarly5] = useState(false);
  const [early5Shown, setEarly5Shown] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const totalTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tryAgainRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const early5TimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);

  

  const { ticket, clues } = gameData;

  // Count total cells on ticket
  const totalNumbers = ticket.flat().filter((c) => c !== null).length;
  const currentClue = clues[currentClueIndex] || null;

  // Check if all cells marked
  const allMarked = markedCells.size >= totalNumbers;

  // Start the 20s announcement timer
  const startAnnouncementTimer = useCallback(() => {
    setTimer(20);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // When timer hits 0, move to next clue
  useEffect(() => {
    if (phase !== "playing") return;
    if (timer === 0 && !allMarked) {
      moveToNextClue();
    }
  }, [timer, phase, allMarked]);

  // Add PREVIOUS clue to history when moving to next clue
  const prevClueRef = useRef<GameClue | null>(null);

  useEffect(() => {
    if (phase !== "playing" && phase !== "tryAgain") return;
    if (!currentClue) return;

    // Pehli baar — sirf ref set karo, history mein mat daalo
    if (prevClueRef.current === null) {
      prevClueRef.current = currentClue;
      return;
    }

    // Clue badli — purani wali history mein daalo (current wali nahi)
    if (prevClueRef.current.id !== currentClue.id) {
      const prev = prevClueRef.current;
      setAnnouncementHistory((h) =>
        h.find((c) => c.id === prev.id) ? h : [prev, ...h],
      );
      prevClueRef.current = currentClue;
    }
  }, [currentClueIndex, phase]);

  // Total elapsed timer
  useEffect(() => {
    if (phase === "playing") {
      totalTimerRef.current = setInterval(
        () => setTotalTime((p) => p + 1),
        1000,
      );
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
      if (early5TimerRef.current) clearTimeout(early5TimerRef.current);
    };
  }, []);

  // Early 5 modal
  useEffect(() => {
    if (markedCells.size >= 5 && !early5Shown && phase === "playing") {
      setShowEarly5(true);
      setEarly5Shown(true);
      early5TimerRef.current = setTimeout(() => {
        setShowEarly5(false);
      }, 5000);
    }
  }, [markedCells.size, early5Shown, phase]);


  const moveToNextClue = useCallback(() => {
    // Already marked clueIds
    const markedClueIds = new Set(
      Array.from(markedCells)
        .map((key) => {
          const [r, c] = key.split("-").map(Number);
          return ticket[r][c]?.clueId;
        })
        .filter(Boolean),
    );

    // Remaining unmarks clues (jo mark nahi hue abhi tak)
    const remainingClues = clues.filter(
      (clue) => !markedClueIds.has(clue.clueId),
    );

    if (remainingClues.length === 0) {
      // Sab mark ho gaye
      setPhase("complete");
      return;
    }

    // Next clue find karo — current ke baad wali remaining mein se
    const currentInRemaining = remainingClues.findIndex(
      (c) => c.id === currentClue?.id,
    );

    const nextClue =
      currentInRemaining === -1 ||
      currentInRemaining >= remainingClues.length - 1
        ? remainingClues[0] // wrap around — sirf unmarked mein
        : remainingClues[currentInRemaining + 1];

    const nextIndex = clues.findIndex((c) => c.id === nextClue.id);
    setCurrentClueIndex(nextIndex);
    startAnnouncementTimer();
  }, [currentClue, markedCells, clues, ticket, startAnnouncementTimer]);

  const handleStartGame = () => {
    setPhase("timerStart");
  };

  const handleTimerStart = () => {
    setPhase("playing");
    startAnnouncementTimer();
  };

  const handleCellClick = (row: number, col: number) => {
    if (!currentClue) return;
    if (phase !== "playing" && phase !== "tryAgain") return;

    const cellValue = ticket[row][col];
    if (cellValue === null) return;

    const key = `${row}-${col}`;
    if (markedCells.has(key)) return;

    // Match by clueId
    if (cellValue.clueId === currentClue.clueId) {
      // Correct!
      playSound(correctSound);
      setMarkedCells((prev) => new Set(prev).add(key));
      setScore((prev) => prev + 1);

      if (phase === "tryAgain") {
        if (tryAgainRef.current) clearInterval(tryAgainRef.current);
        setIsTryAgainCountdown(false);
        setTryAgainTimer(0);
        setPhase("playing");
      }

      const newMarked = new Set(markedCells).add(key);
      if (newMarked.size >= totalNumbers) {
        if (timerRef.current) clearInterval(timerRef.current);
        if (
          currentClue &&
          !announcementHistory.find((c) => c.id === currentClue.id)
        ) {
          setAnnouncementHistory((prev) => [currentClue, ...prev]);
        }
        // complete pe jaane se pehle current clue history mein daalo
        if (currentClue) {
          setAnnouncementHistory((h) =>
            h.find((c) => c.id === currentClue.id) ? h : [currentClue, ...h],
          );
        }
        setTimeout(() => setPhase("complete"), 500);
        return;
      }

      if (timerRef.current) clearInterval(timerRef.current);
      setTimeout(() => moveToNextClue(), 1000);
    } else {
      // Wrong!
      playSound(incorrectSound);
      setShowTryAgainModal(true);
      if (timerRef.current) clearInterval(timerRef.current);
      if (phase === "tryAgain" && tryAgainRef.current) {
        clearInterval(tryAgainRef.current);
        setIsTryAgainCountdown(false);
      }
    }
  };

  const startTryAgainCountdown = () => {
    setShowTryAgainModal(false);
    setIsTryAgainCountdown(true);
    setTryAgainTimer(10);
    setPhase("tryAgain");
    if (tryAgainRef.current) clearInterval(tryAgainRef.current);
    tryAgainRef.current = setInterval(() => {
      setTryAgainTimer((prev) => {
        if (prev <= 1) {
          clearInterval(tryAgainRef.current!);
          setIsTryAgainCountdown(false);
          setPhase("playing");
          moveToNextClue();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const formatTime = (s: number) =>
    `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  // ─── HOW TO PLAY MODAL ───
  if (phase === "howtoplay" || showHowToPlay) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 120 }}
          className="relative w-[90%] max-w-[850px] bg-[#FBF5EF] rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.25)] p-6"
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
          <h2 className="text-3xl font-bold text-center mb-4 text-secondary">
            📖 How to Play — MathBola
          </h2>
          <div className="max-h-[500px]  overflow-y-auto pr-2">
          
            <ul
              className="space-y-3 text-foreground text-2xl leading-relaxed"
              style={{ listStyleType: "none", paddingLeft: 0, margin: 0 }}
            >
              {mathBolaInstructions.map((item, i) => (
                <li
                  key={i}
                  className="flex gap-2"
                  style={{ listStyleType: "none" }}
                >
                  <span>{item.emoji}</span>
                  <span>{item.text}</span>
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
              className="bg-secondary text-secondary-foreground text-2xl px-6 py-2 rounded-full shadow-md hover:scale-105 transition"
            >
              {showHowToPlay ? "Back to Game 🎮" : "Let's Go! 🎉"}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── TIMER START MODAL ───
  if (phase === "timerStart") {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 15 }}
          className="bg-card rounded-3xl p-8 max-w-sm w-full mx-4 text-center space-y-6"
          style={{ boxShadow: "var(--shadow-hover)" }}
        >
          <div className="text-6xl">⏱️</div>
          <h2
            className="text-2xl font-bold text-secondary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Ready to Start?
          </h2>
          <p className="text-muted-foreground">
            A clue will appear every 20 seconds. Find the matching item on your
            ticket!
          </p>
          <button
            onClick={() => {
              playSound(tapSound);
              handleTimerStart();
            }}
            className="px-8 py-3 bg-primary text-primary-foreground rounded-full text-lg font-bold shadow-lg hover:scale-105 transition-transform"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ▶️ Start Timer
          </button>
        </motion.div>
      </div>
    );
  }

  // ─── COMPLETE MODAL ───
  if (phase === "complete") {
      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 12 }}
            className="bg-card rounded-3xl p-8 max-w-md w-full mx-4 text-center space-y-5"
            style={{ boxShadow: "var(--shadow-hover)" }}
          >
            <div className="text-6xl">🎉🏆🎊</div>
            <h2
              className="text-3xl font-bold text-secondary"
              style={{ fontFamily: "var(--font-display)" }}
            >
              MathBola Complete!
            </h2>
            <p className="text-lg text-muted-foreground">
              You have marked all {totalNumbers} clues on your card!
            </p>
            <div className="flex justify-center gap-4 text-lg">
              <div className="bg-primary/10 rounded-xl px-4 py-2">
                <span className="font-bold text-primary">
                  ⏱️ {formatTime(totalTime)}
                </span>
              </div>
              <div className="bg-primary/10 rounded-xl px-4 py-2">
                <span className="font-bold text-primary">
                  🎯 {score}/{totalNumbers}
                </span>
              </div>
            </div>
            <div className="flex justify-center">
              <video
                src={game3Complete}
                autoPlay
                loop
                muted
                className="w-full max-w-xl rounded-xl shadow-lg"
              />
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
    <div className="min-h-screen relative overflow-hidden">
      {/* ✅ Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src={tambulaCardSelection1} type="video/mp4" />
      </video>
      {/* Top bar */}
      <div className="relative z-20">
        <div className="flex items-center justify-between px-4 py-3 bg-card/80 backdrop-blur border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
              <span className="text-lg">⏱️</span>
              <span
                className="font-bold text-primary text-lg"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {formatTime(totalTime)}
              </span>
            </div>
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
          <div className="flex items-center gap-2 bg-primary/10 rounded-full px-4 py-2">
            <span className="text-lg">🎯</span>
            <span
              className="font-bold text-primary text-lg"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {score}/{totalNumbers}
            </span>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 p-4 max-w-8xl mx-auto">
          {/* LEFT 40% */}
          <div className="md:w-[40%] space-y-4">
            {/* Score & Timer boxes */}
            <div className="grid grid-cols-2 gap-3">
              <div
                className="bg-card rounded-2xl border border-border p-4 text-center"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="text-2xl font-bold text-muted-foreground mb-1">
                  Score
                </div>
                <div
                  className="text-4xl font-bold text-primary"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {score}
                </div>
              </div>
              <div
                className="bg-card rounded-2xl border border-border p-4 text-center"
                style={{ boxShadow: "var(--shadow-card)" }}
              >
                <div className="text-2xl font-bold text-muted-foreground mb-1">
                  {isTryAgainCountdown ? "⏳ Try Again In" : "Next Clue In"}
                </div>
                <div
                  className={`text-4xl font-bold ${isTryAgainCountdown ? "text-destructive animate-pulse" : timer <= 5 ? "text-destructive animate-pulse" : "text-primary"}`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {isTryAgainCountdown ? `${tryAgainTimer}s` : `${timer}s`}
                </div>
              </div>
            </div>

            {/* Current Announcement */}
            {/* <motion.div
              key={currentClueIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card rounded-2xl border-2 border-primary/30 p-5 text-center"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="text-2xl text-muted-foreground mb-1">
                📢 Current Clue
              </div>
              {currentClue ? (
                <div
                  className="text-4xl md:text-6xl font-bold text-secondary"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {currentClue.clueText}
                </div>
              ) : (
                <div className="text-lg text-muted-foreground">Waiting...</div>
              )}
            </motion.div> */}
            {/* Current Announcement */}
            <motion.div
              key={currentClueIndex}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-card rounded-2xl border-2 border-primary/30 p-5 text-center"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="text-2xl text-muted-foreground mb-1">
                📢 Current Clue
              </div>
              {currentClue ? (
                <div style={{ fontFamily: "var(--font-display)" }}>
                  {/* Clue Text */}
                  <div className="text-4xl md:text-5xl font-bold text-secondary mb-3">
                    {currentClue.clueText}
                  </div>

                  {/* ✅ Agar clue ka image hai toh dikhao */}
                  {currentClue.clueImage && (
                    <div className="flex justify-center mt-2">
                      <img
                        src={currentClue.clueImage}
                        alt="clue visual"
                        className="max-h-40 max-w-full object-contain rounded-xl border border-border shadow-md"
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-lg text-muted-foreground">Waiting...</div>
              )}
            </motion.div>

            {/* Announcement History */}
            <div
              className="bg-card rounded-2xl border border-border p-4"
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="text-2xl font-bold text-muted-foreground mb-2">
                📋 Clue History
              </div>
              <div className="max-h-[200px] overflow-y-auto space-y-2 pr-1">
                {announcementHistory.length === 0 ? (
                  <p className="text-2xl text-muted-foreground italic">
                    No clues yet...
                  </p>
                ) : (
                  announcementHistory.map((clue) => {
                    const isAnswered = Array.from(markedCells).some((key) => {
                      const [r, c] = key.split("-").map(Number);
                      const cell = ticket[r][c];
                      return cell !== null && cell.clueId === clue.clueId;
                    });
                    return (
                      <div
                        key={clue.id}
                        className={`flex items-center justify-between text-sm px-3 py-2 rounded-lg ${
                          isAnswered
                            ? "bg-primary/10 text-primary"
                            : "bg-muted/50 text-muted-foreground"
                        }`}
                      >
                        <span className="truncate mr-2">
                          #{clue.id}: {clue.clueText}
                        </span>
                        <span className="font-bold whitespace-nowrap">
                          {isAnswered ? "✅" : "⏳"} {clue.answerDisplay}
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
          <div className="md:w-[90%]">
            <div
              className={`rounded-2xl border-2 border-white/20 p-4 bg-gradient-to-br ${ticketColor}`}
              style={{ boxShadow: "var(--shadow-card)" }}
            >
              <div className="text-center mb-3">
                <span className="text-2xl font-bold text-white/90">
                  🎫 Your MathBola Ticket
                </span>
              </div>

              {/* 3×9 Grid */}
              <div className="space-y-1">
                {ticket.map((row, rowIdx) => (
                  <div key={rowIdx} className="grid grid-cols-9 gap-1">
                    {row.map((cell, colIdx) => {
                      const key = `${rowIdx}-${colIdx}`;
                      const isMarked = markedCells.has(key);
                      const isEmpty = cell === null;

                      return (
                        // <motion.button
                        //   key={colIdx}
                        //   disabled={isEmpty || isMarked}
                        //   onClick={() => handleCellClick(rowIdx, colIdx)}
                        //   whileTap={!isEmpty && !isMarked ? { scale: 0.9 } : {}}
                        //   className={`
                        //   aspect-square rounded-lg text-base md:text-4xl font-bold flex items-center justify-center
                        //   transition-all relative border hover:scale-150 hover:z-20 hover:bg-white
                        //   ${
                        //     isEmpty
                        //       ? "bg-muted/30 border-transparent cursor-default"
                        //       : isMarked
                        //         ? "bg-emerald-500/30 border-emerald-400 text-white cursor-default"
                        //         : "bg-card border-border hover:border-primary hover:bg-primary/5 cursor-pointer hover:shadow-md"
                        //   }
                        // `}
                        // >
                        //   {!isEmpty && (
                        //     <>
                        //       {/* <span
                        //         className={`${isMarked ? "opacity-40" : ""} text-center leading-tight`}
                        //       >
                        //         {cell.display}
                        //       </span> */}
                        //       {/* // Ticket cell ke andar — display part */}
                        //       <span
                        //         className={`${isMarked ? "opacity-40" : ""} text-center leading-tight`}
                        //       >
                        //         {cell?.isImage ==true ? (
                        //           <img
                        //             src={cell.display}
                        //             alt={cell.label}
                        //             className="w-20 h-20 object-contain mx-auto"
                        //           />
                        //         ) : (
                        //           cell.display
                        //         )}
                        //       </span>
                        //       {isMarked && (
                        //         <motion.span
                        //           initial={{ scale: 0 }}
                        //           animate={{ scale: 1 }}
                        //           className="absolute inset-0 flex items-center justify-center text-2xl text-emerald-300"
                        //         >
                        //           ✕
                        //         </motion.span>
                        //       )}
                        //     </>
                        //   )}
                        // </motion.button>
                        <motion.button
                          key={colIdx}
                          disabled={isEmpty || isMarked}
                          onClick={() => handleCellClick(rowIdx, colIdx)}
                          whileTap={!isEmpty && !isMarked ? { scale: 0.9 } : {}}
                          className={`
    aspect-square rounded-lg font-bold flex items-center justify-center
    transition-all relative border hover:scale-150 hover:z-20 hover:bg-white
    overflow-hidden
    ${
      isEmpty
        ? "bg-muted/30 border-transparent cursor-default"
        : isMarked
          ? "bg-emerald-500/30 border-emerald-400 text-white cursor-default"
          : "bg-card border-border hover:border-primary hover:bg-primary/5 cursor-pointer hover:shadow-md"
    }
  `}
                        >
                          {!isEmpty && (
                            <>
                              <span
                                className={`${isMarked ? "opacity-40" : ""} w-full h-full flex items-center justify-center p-1`}
                              >
                                {cell?.isImage === true ? (
                                  <img
                                    src={cell.display}
                                    alt={cell.label}
                                    className="w-full h-full object-contain"
                                  />
                                ) : (
                                  // ✅ Text length ke hisaab se font size auto-set
                                  <span
                                    className="w-full h-full flex items-center justify-center text-center leading-tight font-bold"
                                    style={{
                                      fontSize:
                                        cell.display.length <= 2
                                          ? "clamp(14px, 3vw, 32px)" // "45", "6", "<", ">"
                                          : cell.display.length <= 4
                                            ? "clamp(11px, 2.2vw, 22px)" // "100", "9+9"
                                            : cell.display.length <= 7
                                              ? "clamp(9px, 1.8vw, 20px)" // "October", "15+3+3"
                                              : "clamp(7px, 1.4vw, 18px)", // "Sat & Sun", "2+2+2+2"
                                      overflow: "hidden",
                                      wordBreak: "break-word",
                                      overflowWrap: "break-word",
                                      whiteSpace:
                                        cell.display.length > 7
                                          ? "normal"
                                          : "nowrap",
                                      lineHeight: "1.2",
                                      maxWidth: "100%",
                                      maxHeight: "100%",
                                    }}
                                  >
                                    {cell.display}
                                  </span>
                                )}
                              </span>
                              {isMarked && (
                                <motion.span
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="absolute inset-0 flex items-center justify-center text-2xl text-emerald-300"
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

      {/* Try Again Modal */}
      <AnimatePresence>
        {showTryAgainModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 12 }}
              className="relative bg-card rounded-3xl p-8 max-w-sm w-full mx-4 text-center space-y-4"
              style={{ boxShadow: "var(--shadow-hover)" }}
            >
              <button
                onClick={startTryAgainCountdown}
                className="absolute top-3 right-4 text-xl font-bold text-muted-foreground hover:text-foreground transition"
              >
                ✖
              </button>
              <div className="text-6xl">😕</div>
              <h2
                className="text-4xl font-bold text-destructive"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Oops! Wrong Answer
              </h2>
              <p className="text-muted-foreground font-bold text-3xl">
                That's not the right one. Try again! 💪
              </p>
              <button
                onClick={startTryAgainCountdown}
                className="px-8 py-3 bg-destructive text-destructive-foreground rounded-full text-3xl font-bold shadow-lg hover:scale-105 transition-transform"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Try again 👍
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content: 40-60 split */}

      {/* Early 5 Hurry Modal */}
      <AnimatePresence>
        {showEarly5 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", damping: 12 }}
              className="relative bg-card rounded-3xl p-8 max-w-sm w-full mx-4 text-center space-y-4"
              style={{ boxShadow: "var(--shadow-hover)" }}
            >
              <button
                onClick={() => setShowEarly5(false)}
                className="absolute top-3 right-4 text-xl font-bold text-muted-foreground hover:text-foreground transition"
              >
                ✖
              </button>
              <div className="text-6xl">🎉🏃‍♂️💨</div>
              <h2
                className="text-2xl font-bold text-secondary"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Early 5! Hurry! 🔥
              </h2>
              <p className="text-muted-foreground text-lg">
                Congratulations! You've crossed{" "}
                <span className="font-bold text-primary">5 items</span>! Keep
                going! 🚀
              </p>
              <div className="text-4xl animate-bounce">⚡</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
