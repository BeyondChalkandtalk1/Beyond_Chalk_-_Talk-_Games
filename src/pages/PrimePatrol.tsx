import React, { useState } from 'react';
import SpinWheel from '../components/prime-patrol/SpinWheel';
import PrimeLevel1 from '../components/prime-patrol/PrimeLevel1';
import PrimeLevel2 from '../components/prime-patrol/PrimeLevel2';

type GamePhase = 'wheel' | 'level1' | 'level2' | 'complete';

export default function PrimePatrol() {
  const [phase, setPhase] = useState<GamePhase>('wheel');
  const [luckyNumber, setLuckyNumber] = useState<number | null>(null);

  const handleLetsPlay = (number: number) => {
    setLuckyNumber(number);
    setPhase('level1');
  };

  const handleLevel1Complete = () => {
    setPhase('level2');
  };

  const handleLevel2Complete = () => {
    setPhase('complete');
  };

  const handlePlayAgain = () => {
    setLuckyNumber(null);
    setPhase('wheel');
  };

  switch (phase) {
    case 'wheel':
      return <SpinWheel onLetsPlay={handleLetsPlay} />;
    case 'level1':
      return (
        <PrimeLevel1
          luckyNumber={luckyNumber!}
          onComplete={handleLevel1Complete}
          onSpinAgain={handlePlayAgain}
        />
      );
    case 'level2':
      return <PrimeLevel2 luckyNumber={luckyNumber!} onComplete={handleLevel2Complete} />;
    case 'complete':
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 via-pink-100 to-blue-100 p-6">
          <div className="text-center space-y-6 animate-bounce-in">
            <div className="text-6xl">🎉🏆🎊</div>
            <h1 className="text-4xl font-bold text-secondary" style={{ fontFamily: "var(--font-display)" }}>
              Congratulations!
            </h1>
            <p className="text-xl text-foreground" style={{ fontFamily: "var(--font-body)" }}>
              You completed both levels of Prime Patrol!
            </p>
            <button
              onClick={handlePlayAgain}
              className="px-8 py-3 bg-primary text-primary-foreground rounded-full text-lg font-bold shadow-lg hover:scale-105 transition-transform"
              style={{ fontFamily: "var(--font-display)" }}
            >
              🔄 Play Again
            </button>
          </div>
        </div>
      );
  }
}
