"use client";

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  onRestart: () => void;
}

function getRank(pct: number): { title: string; emoji: string; color: string; msg: string } {
  if (pct === 100)
    return {
      title: "Kuwait Expert",
      emoji: "🏆",
      color: "from-amber-400 to-yellow-300",
      msg: "Perfect score! You truly know Kuwait inside and out.",
    };
  if (pct >= 80)
    return {
      title: "Gulf Scholar",
      emoji: "🌟",
      color: "from-kuwait-green to-emerald-400",
      msg: "Excellent! You have a deep knowledge of Kuwait's culture.",
    };
  if (pct >= 60)
    return {
      title: "Desert Wanderer",
      emoji: "🐪",
      color: "from-blue-500 to-cyan-400",
      msg: "Good job! You know quite a bit about the Pearl of the Gulf.",
    };
  if (pct >= 40)
    return {
      title: "Gulf Visitor",
      emoji: "⚓",
      color: "from-purple-500 to-violet-400",
      msg: "Not bad! Keep exploring Kuwait's rich heritage.",
    };
  return {
    title: "Desert Explorer",
    emoji: "🗺️",
    color: "from-kuwait-red to-rose-400",
    msg: "Keep learning! Kuwait has so much more to discover.",
  };
}

export default function ResultScreen({
  score,
  totalQuestions,
  correctAnswers,
  onRestart,
}: ResultScreenProps) {
  const pct = Math.round((correctAnswers / totalQuestions) * 100);
  const rank = getRank(pct);
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 star-bg animate-fade-in">
      {/* Flag stripe */}
      <div className="w-full h-2 fixed top-0 left-0 flex">
        <div className="flex-1 bg-kuwait-green" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-kuwait-red" />
        <div className="w-16 bg-black" style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }} />
      </div>

      <div className="glass-card rounded-3xl p-8 md:p-12 max-w-xl w-full shadow-2xl animate-bounce-in">
        {/* Rank */}
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">{rank.emoji}</div>
          <h2 className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${rank.color}`}>
            {rank.title}
          </h2>
          <p className="text-white/60 mt-2 text-sm">{rank.msg}</p>
        </div>

        {/* Score ring */}
        <div className="flex justify-center mb-8">
          <div className="relative w-36 h-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60" cy="60" r="54"
                fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8"
              />
              <circle
                cx="60" cy="60" r="54"
                fill="none"
                stroke={pct >= 60 ? "#007A3D" : pct >= 40 ? "#C9A84C" : "#CE1126"}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 1s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white">{pct}%</span>
              <span className="text-white/50 text-xs">accuracy</span>
            </div>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: "✅", label: "Correct", value: correctAnswers, color: "text-kuwait-green-light" },
            { icon: "❌", label: "Wrong", value: totalQuestions - correctAnswers, color: "text-kuwait-red" },
            { icon: "⭐", label: "Score", value: score, color: "text-kuwait-gold" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-white/40 text-xs mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Score formula note */}
        <p className="text-white/30 text-xs text-center mb-6">
          Score = correct answers × 10 + time bonus
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="w-full py-4 rounded-2xl text-white font-black text-lg transition-all hover:scale-105 active:scale-95 shadow-lg"
            style={{ background: "linear-gradient(135deg, #007A3D, #00A651)" }}
          >
            🔄 Play Again
          </button>
          <button
            onClick={() => {
              const text = `I scored ${score} points (${pct}%) on the Kuwait Culture Trivia quiz! 🇰🇼 Can you beat my score?`;
              if (navigator.share) {
                navigator.share({ title: "Kuwait Trivia", text });
              } else {
                navigator.clipboard.writeText(text).then(() => alert("Result copied to clipboard!"));
              }
            }}
            className="w-full py-3 rounded-2xl text-white/70 font-bold text-base transition-all hover:scale-105 active:scale-95 glass-card border border-white/20"
          >
            📤 Share Result
          </button>
        </div>

        {/* Kuwait tagline */}
        <p className="text-center text-white/20 text-sm mt-6">
          🇰🇼 &nbsp;الكويت — Pearl of the Gulf
        </p>
      </div>
    </div>
  );
}
