"use client";

import { useState, useCallback } from "react";
import { questions } from "./data/questions";
import WelcomeScreen from "./components/WelcomeScreen";
import QuestionCard from "./components/QuestionCard";
import ResultScreen from "./components/ResultScreen";

type GameState = "welcome" | "playing" | "results";

const TIME_LIMIT = 30;
const POINTS_PER_CORRECT = 10;

function shuffle<T>(arr: T[]): T[] {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState>("welcome");
  const [shuffledQuestions, setShuffledQuestions] = useState(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_LIMIT);

  const startGame = () => {
    setShuffledQuestions(shuffle(questions));
    setCurrentIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setTimeLeft(TIME_LIMIT);
    setGameState("playing");
  };

  const handleAnswer = useCallback(
    (isCorrect: boolean, _selectedIndex: number) => {
      if (isCorrect) {
        const bonus = Math.floor((timeLeft / TIME_LIMIT) * 5);
        setScore((s) => s + POINTS_PER_CORRECT + bonus);
        setCorrectAnswers((c) => c + 1);
      }

      const next = currentIndex + 1;
      if (next >= shuffledQuestions.length) {
        setGameState("results");
      } else {
        setCurrentIndex(next);
        setTimeLeft(TIME_LIMIT);
      }
    },
    [currentIndex, shuffledQuestions.length, timeLeft]
  );

  if (gameState === "welcome") {
    return (
      <WelcomeScreen onStart={startGame} totalQuestions={questions.length} />
    );
  }

  if (gameState === "results") {
    return (
      <ResultScreen
        score={score}
        totalQuestions={shuffledQuestions.length}
        correctAnswers={correctAnswers}
        onRestart={startGame}
      />
    );
  }

  return (
    <QuestionCard
      key={currentIndex}
      question={shuffledQuestions[currentIndex]}
      questionNumber={currentIndex + 1}
      totalQuestions={shuffledQuestions.length}
      score={score}
      onAnswer={handleAnswer}
      timeLimit={TIME_LIMIT}
    />
  );
}
