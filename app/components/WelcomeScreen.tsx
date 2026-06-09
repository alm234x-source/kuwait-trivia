"use client";

import { useState } from "react";
import { CATEGORIES, DIFFICULTIES, AMOUNTS } from "../lib/api";

interface WelcomeScreenProps {
  onStart: (categoryId: number, difficulty: string, amount: number) => void;
}

export default function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] = useState("any");
  const [selectedAmount, setSelectedAmount] = useState(10);

  const chosenCategory = CATEGORIES.find((c) => c.id === selectedCategory)!;
  const chosenDifficulty = DIFFICULTIES.find((d) => d.id === selectedDifficulty)!;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 star-bg animate-fade-in">
      {/* Flag stripe */}
      <div className="w-full h-2 fixed top-0 left-0 flex">
        <div className="flex-1 bg-kuwait-green" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-kuwait-red" />
        <div
          className="w-16 bg-black"
          style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }}
        />
      </div>

      <div className="glass-card rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center mb-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-4xl shadow-lg gold-gradient">
              🇰🇼
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white leading-tight">
            Kuwait
            <span
              className="block text-transparent bg-clip-text"
              style={{ backgroundImage: "linear-gradient(135deg,#C9A84C,#F0D080)" }}
            >
              Culture Trivia
            </span>
          </h1>
          <p className="text-white/40 text-sm mt-1">Powered by Open Trivia DB</p>
        </div>

        {/* ── Category ──────────────────────────────────────────── */}
        <div className="mb-5">
          <label className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2 block">
            📚 Category
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 border ${
                  selectedCategory === cat.id
                    ? "bg-kuwait-green/30 border-kuwait-green text-white scale-[1.02]"
                    : "glass-card border-white/10 text-white/60 hover:border-white/30 hover:text-white"
                }`}
              >
                <span className="text-base flex-shrink-0">{cat.emoji}</span>
                <span className="truncate">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Difficulty ────────────────────────────────────────── */}
        <div className="mb-5">
          <label className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2 block">
            🎯 Difficulty
          </label>
          <div className="grid grid-cols-4 gap-2">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff.id}
                onClick={() => setSelectedDifficulty(diff.id)}
                className={`flex flex-col items-center gap-1 py-3 px-2 rounded-xl text-xs font-bold transition-all duration-150 border ${
                  selectedDifficulty === diff.id
                    ? `bg-gradient-to-b ${diff.color} border-white/30 text-white scale-[1.04]`
                    : "glass-card border-white/10 text-white/50 hover:text-white hover:border-white/30"
                }`}
              >
                <span className="text-lg">{diff.emoji}</span>
                <span>{diff.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── Question count ────────────────────────────────────── */}
        <div className="mb-7">
          <label className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2 block">
            🔢 Questions
          </label>
          <div className="flex gap-2">
            {AMOUNTS.map((n) => (
              <button
                key={n}
                onClick={() => setSelectedAmount(n)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-black transition-all duration-150 border ${
                  selectedAmount === n
                    ? "bg-kuwait-gold/20 border-kuwait-gold text-kuwait-gold scale-[1.04]"
                    : "glass-card border-white/10 text-white/50 hover:text-white hover:border-white/30"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* ── Start button ──────────────────────────────────────── */}
        <button
          onClick={() => onStart(selectedCategory, selectedDifficulty, selectedAmount)}
          className="w-full py-4 rounded-2xl text-white text-lg font-black transition-all duration-200 hover:scale-[1.02] active:scale-95 shadow-lg relative overflow-hidden group"
          style={{ background: "linear-gradient(135deg, #007A3D, #00A651)" }}
        >
          <span className="relative z-10">
            {chosenCategory.emoji} {chosenCategory.name} · {chosenDifficulty.name} · {selectedAmount}Q &nbsp;→
          </span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
        </button>

        <p className="text-white/25 text-xs text-center mt-4">
          30 seconds per question · Time bonus on correct answers
        </p>
      </div>
    </div>
  );
}
