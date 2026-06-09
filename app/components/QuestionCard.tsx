"use client";

import { useEffect, useState, useCallback } from "react";
import { ProcessedQuestion } from "../lib/api";

interface QuestionCardProps {
  question: ProcessedQuestion;
  questionNumber: number;
  totalQuestions: number;
  score: number;
  onAnswer: (isCorrect: boolean, timeLeft: number) => void;
  timeLimit: number;
}

const OPTION_LABELS = ["A", "B", "C", "D"];
const OPTION_COLORS = [
  "from-blue-600/30 to-blue-700/20 border-blue-500/30 hover:border-blue-400/60",
  "from-purple-600/30 to-purple-700/20 border-purple-500/30 hover:border-purple-400/60",
  "from-amber-600/30 to-amber-700/20 border-amber-500/30 hover:border-amber-400/60",
  "from-cyan-600/30 to-cyan-700/20 border-cyan-500/30 hover:border-cyan-400/60",
];

const DIFFICULTY_BADGE: Record<string, string> = {
  easy:   "bg-emerald-700/40 text-emerald-300 border-emerald-500/30",
  medium: "bg-amber-700/40 text-amber-300 border-amber-500/30",
  hard:   "bg-red-700/40 text-red-300 border-red-500/30",
  mixed:  "bg-slate-700/40 text-slate-300 border-slate-500/30",
};

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  score,
  onAnswer,
  timeLimit,
}: QuestionCardProps) {
  const [selected, setSelected]     = useState<number | null>(null);
  const [timeLeft, setTimeLeft]     = useState(timeLimit);
  const [showFact, setShowFact]     = useState(false);
  const [timedOut, setTimedOut]     = useState(false);

  /* ── Reset on new question ─────────────────────────────── */
  useEffect(() => {
    setSelected(null);
    setTimeLeft(timeLimit);
    setShowFact(false);
    setTimedOut(false);
  }, [question, timeLimit]);

  /* ── Countdown ─────────────────────────────────────────── */
  const handleTimeout = useCallback(() => {
    setTimedOut(true);
    setShowFact(true);
    setTimeout(() => onAnswer(false, 0), 2200);
  }, [onAnswer]);

  useEffect(() => {
    if (selected !== null || timedOut) return;
    if (timeLeft <= 0) { handleTimeout(); return; }
    const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(id);
  }, [timeLeft, selected, timedOut, handleTimeout]);

  /* ── Answer handler ────────────────────────────────────── */
  const handleSelect = (index: number) => {
    if (selected !== null || timedOut) return;
    setSelected(index);
    setShowFact(true);
    setTimeout(() => onAnswer(index === question.correctIndex, timeLeft), 2000);
  };

  /* ── Derived display values ────────────────────────────── */
  const progress      = ((questionNumber - 1) / totalQuestions) * 100;
  const timePercent   = (timeLeft / timeLimit) * 100;
  const timeColor     = timeLeft > 15 ? "bg-kuwait-green" : timeLeft > 7 ? "bg-amber-400" : "bg-kuwait-red";
  const diffLabel     = question.difficulty ?? "mixed";
  const badgeClass    = DIFFICULTY_BADGE[diffLabel] ?? DIFFICULTY_BADGE.mixed;

  const getOptionStyle = (index: number) => {
    if (selected === null && !timedOut)
      return `bg-gradient-to-r ${OPTION_COLORS[index % 4]} border`;
    if (index === question.correctIndex)
      return "bg-kuwait-green/30 border-2 border-kuwait-green";
    if (index === selected && selected !== question.correctIndex)
      return "bg-kuwait-red/30 border-2 border-kuwait-red";
    return "bg-white/5 border border-white/10 opacity-40";
  };

  const getOptionIcon = (index: number) => {
    if (selected === null && !timedOut) return OPTION_LABELS[index];
    if (index === question.correctIndex) return "✓";
    if (index === selected)              return "✗";
    return OPTION_LABELS[index];
  };

  const optionIconClass = (index: number) => {
    if (selected === null && !timedOut) return "bg-white/20 text-white";
    if (index === question.correctIndex) return "bg-kuwait-green text-white";
    if (index === selected)              return "bg-kuwait-red text-white";
    return "bg-white/10 text-white/30";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 star-bg animate-fade-in">
      {/* ── Top stats bar ──────────────────────────────────── */}
      <div className="w-full max-w-2xl mb-3 flex items-center justify-between gap-2">
        <div className="glass-card rounded-xl px-3 py-2 flex items-center gap-1.5 min-w-0">
          <span className="text-kuwait-gold font-black text-base leading-none">{score}</span>
          <span className="text-white/40 text-xs">pts</span>
        </div>
        <div className="glass-card rounded-xl px-3 py-2 text-white/60 text-sm font-medium">
          {questionNumber} / {totalQuestions}
        </div>
        <div className={`glass-card rounded-xl px-3 py-2 flex items-center gap-1.5 ${timeLeft <= 7 ? "animate-pulse" : ""}`}>
          <span className="text-base">⏱️</span>
          <span className={`font-black text-base leading-none ${timeLeft > 15 ? "text-emerald-400" : timeLeft > 7 ? "text-amber-400" : "text-kuwait-red"}`}>
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* ── Progress bars ──────────────────────────────────── */}
      <div className="w-full max-w-2xl mb-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full bg-kuwait-gold rounded-full progress-bar-fill" style={{ width: `${progress}%` }} />
      </div>
      <div className="w-full max-w-2xl mb-5 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className={`h-full ${timeColor} rounded-full transition-all duration-1000`} style={{ width: `${timePercent}%` }} />
      </div>

      {/* ── Question card ──────────────────────────────────── */}
      <div className="glass-card rounded-3xl p-5 md:p-7 max-w-2xl w-full shadow-2xl animate-slide-up">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white border border-kuwait-green/40 bg-kuwait-green/20">
            {question.category}
          </span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full border capitalize ${badgeClass}`}>
            {diffLabel}
          </span>
          {timedOut && (
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-kuwait-red/20 text-kuwait-red border border-kuwait-red/30">
              ⏰ Time&apos;s up!
            </span>
          )}
        </div>

        {/* Question text */}
        <h2 className="text-lg md:text-xl font-black text-white mb-5 leading-snug">
          {question.question}
        </h2>

        {/* Options */}
        <div className="grid gap-2.5">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={selected !== null || timedOut}
              className={`option-btn w-full text-left p-3.5 md:p-4 rounded-2xl flex items-center gap-3 transition-all duration-200 ${getOptionStyle(index)}`}
            >
              <span className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 ${optionIconClass(index)}`}>
                {getOptionIcon(index)}
              </span>
              <span className="text-white font-medium text-sm md:text-base leading-tight">
                {option}
              </span>
            </button>
          ))}
        </div>

        {/* Fun fact / category reveal */}
        {showFact && (
          <div className="mt-4 p-4 rounded-2xl bg-kuwait-gold/10 border border-kuwait-gold/30 animate-slide-up">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">
                {selected === question.correctIndex ? "🎉" : timedOut ? "⏰" : "💡"}
              </span>
              <div>
                <p className="text-kuwait-gold font-bold text-sm mb-1">
                  {selected === question.correctIndex ? "Correct!" : timedOut ? "Too slow!" : "Wrong!"}
                  {" "}
                  <span className="text-white/60 font-normal">
                    The answer was:{" "}
                    <strong className="text-white">
                      {question.options[question.correctIndex]}
                    </strong>
                  </span>
                </p>
                {question.fact && (
                  <p className="text-white/70 text-sm leading-relaxed">{question.fact}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
