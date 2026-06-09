"use client";

import { useEffect, useState, useCallback } from "react";
import { Question } from "../data/questions";

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  score: number;
  onAnswer: (isCorrect: boolean, selectedIndex: number) => void;
  timeLimit: number;
}

const OPTION_LABELS = ["A", "B", "C", "D"];
const OPTION_COLORS = [
  "from-blue-600/30 to-blue-700/20 border-blue-500/30 hover:border-blue-400/60",
  "from-purple-600/30 to-purple-700/20 border-purple-500/30 hover:border-purple-400/60",
  "from-amber-600/30 to-amber-700/20 border-amber-500/30 hover:border-amber-400/60",
  "from-cyan-600/30 to-cyan-700/20 border-cyan-500/30 hover:border-cyan-400/60",
];

export default function QuestionCard({
  question,
  questionNumber,
  totalQuestions,
  score,
  onAnswer,
  timeLimit,
}: QuestionCardProps) {
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [showFact, setShowFact] = useState(false);
  const [timedOut, setTimedOut] = useState(false);

  const handleTimeout = useCallback(() => {
    if (selected !== null) return;
    setTimedOut(true);
    setShowFact(true);
    setTimeout(() => onAnswer(false, -1), 2200);
  }, [selected, onAnswer]);

  useEffect(() => {
    setSelected(null);
    setTimeLeft(timeLimit);
    setShowFact(false);
    setTimedOut(false);
  }, [question.id, timeLimit]);

  useEffect(() => {
    if (selected !== null || timedOut) return;
    if (timeLeft <= 0) {
      handleTimeout();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, selected, timedOut, handleTimeout]);

  const handleSelect = (index: number) => {
    if (selected !== null || timedOut) return;
    setSelected(index);
    setShowFact(true);
    const isCorrect = index === question.correctIndex;
    setTimeout(() => onAnswer(isCorrect, index), 2000);
  };

  const progress = ((questionNumber - 1) / totalQuestions) * 100;
  const timePercent = (timeLeft / timeLimit) * 100;
  const timeColor =
    timeLeft > 15
      ? "bg-kuwait-green"
      : timeLeft > 7
      ? "bg-amber-400"
      : "bg-kuwait-red";

  const getOptionStyle = (index: number) => {
    if (selected === null && !timedOut) {
      return `bg-gradient-to-r ${OPTION_COLORS[index]} border`;
    }
    if (index === question.correctIndex) {
      return "bg-kuwait-green/30 border-2 border-kuwait-green";
    }
    if (index === selected && selected !== question.correctIndex) {
      return "bg-kuwait-red/30 border-2 border-kuwait-red";
    }
    return "bg-white/5 border border-white/10 opacity-50";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 star-bg animate-fade-in">
      {/* Top bar */}
      <div className="w-full max-w-2xl mb-4 flex items-center justify-between">
        <div className="glass-card rounded-xl px-4 py-2 flex items-center gap-2">
          <span className="text-kuwait-gold font-black text-lg">
            {score}
          </span>
          <span className="text-white/50 text-sm">pts</span>
        </div>
        <div className="glass-card rounded-xl px-4 py-2">
          <span className="text-white/70 text-sm font-medium">
            {questionNumber} / {totalQuestions}
          </span>
        </div>
        <div
          className={`glass-card rounded-xl px-4 py-2 flex items-center gap-2 ${
            timeLeft <= 7 ? "animate-pulse" : ""
          }`}
        >
          <span className="text-xl">⏱️</span>
          <span
            className={`font-black text-lg ${
              timeLeft > 15
                ? "text-kuwait-green-light"
                : timeLeft > 7
                ? "text-amber-400"
                : "text-kuwait-red"
            }`}
          >
            {timeLeft}s
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="w-full max-w-2xl mb-4 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-kuwait-gold rounded-full progress-bar-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Timer bar */}
      <div className="w-full max-w-2xl mb-6 h-1 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full ${timeColor} rounded-full transition-all duration-1000`}
          style={{ width: `${timePercent}%` }}
        />
      </div>

      {/* Question card */}
      <div className="glass-card rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl animate-slide-up">
        {/* Category badge */}
        <div className="mb-4 flex items-center gap-2">
          <span
            className="text-xs font-bold px-3 py-1 rounded-full text-white"
            style={{ background: "linear-gradient(135deg, #007A3D, #00A651)" }}
          >
            {question.category}
          </span>
          {timedOut && (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-kuwait-red/20 text-kuwait-red border border-kuwait-red/30">
              ⏰ Time&apos;s up!
            </span>
          )}
        </div>

        {/* Question */}
        <h2 className="text-xl md:text-2xl font-black text-white mb-6 leading-snug">
          {question.question}
        </h2>

        {/* Options */}
        <div className="grid gap-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={selected !== null || timedOut}
              className={`option-btn w-full text-left p-4 rounded-2xl flex items-center gap-4 transition-all duration-200 ${getOptionStyle(index)}`}
            >
              <span
                className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm flex-shrink-0 ${
                  selected === null && !timedOut
                    ? "bg-white/20 text-white"
                    : index === question.correctIndex
                    ? "bg-kuwait-green text-white"
                    : index === selected
                    ? "bg-kuwait-red text-white"
                    : "bg-white/10 text-white/40"
                }`}
              >
                {selected !== null || timedOut
                  ? index === question.correctIndex
                    ? "✓"
                    : index === selected
                    ? "✗"
                    : OPTION_LABELS[index]
                  : OPTION_LABELS[index]}
              </span>
              <span className="text-white font-medium text-sm md:text-base">
                {option}
              </span>
            </button>
          ))}
        </div>

        {/* Fact reveal */}
        {showFact && (
          <div className="mt-5 p-4 rounded-2xl bg-kuwait-gold/10 border border-kuwait-gold/30 animate-slide-up">
            <div className="flex items-start gap-3">
              <span className="text-xl flex-shrink-0">💡</span>
              <div>
                <p className="text-kuwait-gold font-bold text-sm mb-1">
                  Fun Fact
                </p>
                <p className="text-white/80 text-sm leading-relaxed">
                  {question.fact}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
