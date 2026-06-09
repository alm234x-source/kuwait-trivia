"use client";

interface ResultScreenProps {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  onRestart: () => void;        // back to welcome / change settings
  onPlayAgain: () => void;      // same settings, new questions
}

interface Rank {
  title: string;
  emoji: string;
  gradient: string;
  msg: string;
}

function getRank(pct: number): Rank {
  if (pct === 100) return { title: "Kuwait Expert",    emoji: "🏆", gradient: "from-amber-400 to-yellow-300",   msg: "Perfect score! You truly know Kuwait inside and out." };
  if (pct >=  80)  return { title: "Gulf Scholar",     emoji: "🌟", gradient: "from-kuwait-green to-emerald-400", msg: "Excellent! You have a deep knowledge of the Gulf." };
  if (pct >=  60)  return { title: "Desert Wanderer",  emoji: "🐪", gradient: "from-blue-400 to-cyan-400",       msg: "Good job! You know quite a bit about the Pearl of the Gulf." };
  if (pct >=  40)  return { title: "Gulf Visitor",     emoji: "⚓", gradient: "from-purple-400 to-violet-400",   msg: "Not bad! Keep exploring Kuwait's rich heritage." };
  return                  { title: "Desert Explorer",  emoji: "🗺️", gradient: "from-kuwait-red to-rose-400",     msg: "Keep learning — Kuwait has so much more to discover!" };
}

export default function ResultScreen({
  score,
  totalQuestions,
  correctAnswers,
  onRestart,
  onPlayAgain,
}: ResultScreenProps) {
  const wrongAnswers = totalQuestions - correctAnswers;
  const pct          = Math.round((correctAnswers / totalQuestions) * 100);
  const rank         = getRank(pct);

  // SVG ring
  const r             = 52;
  const circumference = 2 * Math.PI * r;
  const dashOffset    = circumference - (pct / 100) * circumference;
  const ringColor     = pct >= 60 ? "#007A3D" : pct >= 40 ? "#C9A84C" : "#CE1126";

  const shareText = `I scored ${correctAnswers}/${totalQuestions} (${pct}%) on the Kuwait Culture Trivia quiz! 🇰🇼 Can you beat me?`;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "Kuwait Trivia", text: shareText });
    } else {
      navigator.clipboard
        .writeText(shareText)
        .then(() => alert("Result copied to clipboard!"))
        .catch(() => alert(shareText));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 star-bg animate-fade-in">
      {/* Flag stripe */}
      <div className="w-full h-2 fixed top-0 left-0 flex">
        <div className="flex-1 bg-kuwait-green" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-kuwait-red" />
        <div className="w-16 bg-black" style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }} />
      </div>

      <div className="glass-card rounded-3xl p-7 md:p-10 max-w-md w-full shadow-2xl animate-bounce-in">
        {/* Rank header */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{rank.emoji}</div>
          <h2
            className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${rank.gradient}`}
          >
            {rank.title}
          </h2>
          <p className="text-white/50 mt-2 text-sm leading-relaxed">{rank.msg}</p>
        </div>

        {/* Score ring */}
        <div className="flex justify-center mb-6">
          <div className="relative w-36 h-36">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle
                cx="60" cy="60" r={r}
                fill="none"
                stroke={ringColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                style={{ transition: "stroke-dashoffset 1.2s ease" }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-white">{pct}%</span>
              <span className="text-white/40 text-xs">accuracy</span>
            </div>
          </div>
        </div>

        {/* Score fraction + stats grid */}
        <div className="glass-card rounded-2xl p-4 mb-5 text-center border border-white/10">
          <p className="text-white/50 text-xs uppercase tracking-widest mb-1">Final Score</p>
          <p className="text-4xl font-black text-kuwait-gold">{score}</p>
          <p className="text-white/40 text-sm mt-1">points</p>
        </div>

        <div className="grid grid-cols-3 gap-2.5 mb-7">
          {[
            { icon: "✅", label: "Correct",   value: `${correctAnswers} / ${totalQuestions}`, color: "text-emerald-400" },
            { icon: "❌", label: "Wrong",     value: `${wrongAnswers} / ${totalQuestions}`,   color: "text-kuwait-red"  },
            { icon: "📊", label: "Accuracy",  value: `${pct}%`,                               color: "text-kuwait-gold" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card rounded-2xl p-3.5 text-center border border-white/10">
              <div className="text-xl mb-1">{stat.icon}</div>
              <div className={`text-lg font-black ${stat.color}`}>{stat.value}</div>
              <div className="text-white/35 text-xs mt-0.5">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col gap-2.5">
          <button
            onClick={onPlayAgain}
            className="w-full py-3.5 rounded-2xl text-white font-black text-base transition-all hover:scale-[1.02] active:scale-95 shadow-lg"
            style={{ background: "linear-gradient(135deg, #007A3D, #00A651)" }}
          >
            🔄 Play Again (same settings)
          </button>
          <button
            onClick={onRestart}
            className="w-full py-3 rounded-2xl text-white/70 font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 glass-card border border-white/20"
          >
            ⚙️ Change Category / Difficulty
          </button>
          <button
            onClick={handleShare}
            className="w-full py-3 rounded-2xl text-white/50 font-bold text-sm transition-all hover:scale-[1.02] active:scale-95 glass-card border border-white/10"
          >
            📤 Share My Result
          </button>
        </div>

        <p className="text-center text-white/15 text-xs mt-5">
          🇰🇼 &nbsp;الكويت — Pearl of the Gulf
        </p>
      </div>
    </div>
  );
}
