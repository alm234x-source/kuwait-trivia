"use client";

import { useState, useCallback } from "react";
import { questions as kuwaitQuestions } from "./data/questions";
import {
  fetchOTDBQuestions,
  shuffleArray,
  ProcessedQuestion,
} from "./lib/api";
import WelcomeScreen  from "./components/WelcomeScreen";
import QuestionCard   from "./components/QuestionCard";
import ResultScreen   from "./components/ResultScreen";
import LoadingScreen  from "./components/LoadingScreen";
import ErrorScreen    from "./components/ErrorScreen";

// ─── Types ────────────────────────────────────────────────────────────────────

type GameState = "welcome" | "loading" | "playing" | "results" | "error";

// ─── Constants ────────────────────────────────────────────────────────────────

const TIME_LIMIT         = 30;
const POINTS_PER_CORRECT = 10;
const MAX_TIME_BONUS     = 5;   // bonus points for speed

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert Kuwait culture questions (hardcoded format) to ProcessedQuestion */
function toProcessedKuwait(amount: number): ProcessedQuestion[] {
  return shuffleArray(kuwaitQuestions)
    .slice(0, amount)
    .map((q) => {
      const correct    = q.options[q.correctIndex];
      const shuffled   = shuffleArray(q.options);
      return {
        question:     q.question,
        options:      shuffled,
        correctIndex: shuffled.indexOf(correct),
        category:     q.category,
        difficulty:   "mixed",
        fact:         q.fact,
      };
    });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const [gameState,      setGameState]      = useState<GameState>("welcome");
  const [questions,      setQuestions]      = useState<ProcessedQuestion[]>([]);
  const [currentIndex,   setCurrentIndex]   = useState(0);
  const [score,          setScore]          = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [errorMessage,   setErrorMessage]   = useState("");

  // Remember last settings so Retry / Play Again work
  const [lastCategory,   setLastCategory]   = useState(0);
  const [lastDifficulty, setLastDifficulty] = useState("any");
  const [lastAmount,     setLastAmount]     = useState(10);

  // ── Start (or restart) a game ──────────────────────────────────────────────
  const startGame = useCallback(async (
    categoryId: number,
    difficulty: string,
    amount: number,
  ) => {
    setLastCategory(categoryId);
    setLastDifficulty(difficulty);
    setLastAmount(amount);

    setGameState("loading");
    setCurrentIndex(0);
    setScore(0);
    setCorrectAnswers(0);

    try {
      let loaded: ProcessedQuestion[];

      if (categoryId === -1) {
        // Kuwait Culture — use our own hardcoded + shuffled questions
        loaded = toProcessedKuwait(amount);
      } else {
        // Open Trivia Database
        loaded = await fetchOTDBQuestions(
          amount,
          categoryId === 0 ? undefined : categoryId,
          difficulty,
        );
      }

      setQuestions(loaded);
      setGameState("playing");
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setGameState("error");
    }
  }, []);

  // ── Handle an answered question ────────────────────────────────────────────
  const handleAnswer = useCallback(
    (isCorrect: boolean, timeLeft: number) => {
      if (isCorrect) {
        const bonus = Math.floor((timeLeft / TIME_LIMIT) * MAX_TIME_BONUS);
        setScore((s) => s + POINTS_PER_CORRECT + bonus);
        setCorrectAnswers((c) => c + 1);
      }

      const next = currentIndex + 1;
      if (next >= questions.length) {
        setGameState("results");
      } else {
        setCurrentIndex(next);
      }
    },
    [currentIndex, questions.length],
  );

  // ── Render ─────────────────────────────────────────────────────────────────

  if (gameState === "welcome") {
    return <WelcomeScreen onStart={startGame} />;
  }

  if (gameState === "loading") {
    return <LoadingScreen />;
  }

  if (gameState === "error") {
    return (
      <ErrorScreen
        message={errorMessage}
        onRetry={() => startGame(lastCategory, lastDifficulty, lastAmount)}
        onBack={() => setGameState("welcome")}
      />
    );
  }

  if (gameState === "results") {
    return (
      <ResultScreen
        score={score}
        totalQuestions={questions.length}
        correctAnswers={correctAnswers}
        onRestart={() => setGameState("welcome")}
        onPlayAgain={() => startGame(lastCategory, lastDifficulty, lastAmount)}
      />
    );
  }

  // gameState === "playing"
  return (
    <QuestionCard
      key={currentIndex}
      question={questions[currentIndex]}
      questionNumber={currentIndex + 1}
      totalQuestions={questions.length}
      score={score}
      onAnswer={handleAnswer}
      timeLimit={TIME_LIMIT}
    />
  );
}
