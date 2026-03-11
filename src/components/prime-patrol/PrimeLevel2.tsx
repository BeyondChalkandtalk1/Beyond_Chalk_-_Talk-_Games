import React from 'react';

interface PrimeLevel2Props {
  luckyNumber: number;
  onComplete: () => void;
}

export default function PrimeLevel2({ luckyNumber, onComplete }: PrimeLevel2Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 via-yellow-100 to-orange-100 p-6">
      <div className="text-center space-y-6 animate-bounce-in">
        <h1 className="text-3xl font-bold text-secondary" style={{ fontFamily: "var(--font-display)" }}>
          🏆 Level 2 — Combo Detectives
        </h1>
        <p className="text-xl text-foreground" style={{ fontFamily: "var(--font-body)" }}>
          Your lucky number: <span className="font-bold text-primary text-3xl">{luckyNumber}</span>
        </p>
        <p className="text-muted-foreground">Level 2 game coming soon...</p>
        <button
          onClick={onComplete}
          className="px-8 py-3 bg-secondary text-secondary-foreground rounded-full text-lg font-bold shadow-lg hover:scale-105 transition-transform"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Complete Level 2 →
        </button>
      </div>
    </div>
  );
}
