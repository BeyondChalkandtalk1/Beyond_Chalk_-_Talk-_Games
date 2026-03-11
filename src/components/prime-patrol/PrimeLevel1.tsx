import React from 'react';

interface PrimeLevel1Props {
  luckyNumber: number;
  onComplete: () => void;
}

export default function PrimeLevel1({ luckyNumber, onComplete }: PrimeLevel1Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-6">
      <div className="text-center space-y-6 animate-bounce-in">
        <h1 className="text-3xl font-bold text-secondary" style={{ fontFamily: "var(--font-display)" }}>
          🔍 Level 1 — Prime Patrol
        </h1>
        <p className="text-xl text-foreground" style={{ fontFamily: "var(--font-body)" }}>
          Your lucky number: <span className="font-bold text-primary text-3xl">{luckyNumber}</span>
        </p>
        <p className="text-muted-foreground">Level 1 game coming soon...</p>
        <button
          onClick={onComplete}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-full text-lg font-bold shadow-lg hover:scale-105 transition-transform"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Complete Level 1 →
        </button>
      </div>
    </div>
  );
}
