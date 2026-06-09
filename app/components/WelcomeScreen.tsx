"use client";

interface WelcomeScreenProps {
  onStart: () => void;
  totalQuestions: number;
}

export default function WelcomeScreen({
  onStart,
  totalQuestions,
}: WelcomeScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 animate-fade-in star-bg">
      {/* Flag stripe accent */}
      <div className="w-full h-2 fixed top-0 left-0 flex">
        <div className="flex-1 bg-kuwait-green" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-kuwait-red" />
        <div className="w-16 bg-black" style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }} />
      </div>

      <div className="glass-card rounded-3xl p-8 md:p-12 max-w-xl w-full text-center shadow-2xl animate-slide-up">
        {/* Kuwait flag emoji + decoration */}
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl shadow-lg gold-gradient">
              🇰🇼
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-kuwait-green flex items-center justify-center text-white text-sm font-bold shadow">
              ✦
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-black text-white mb-2 leading-tight">
          Kuwait
          <span className="block text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(135deg, #C9A84C, #F0D080)" }}>
            Culture Trivia
          </span>
        </h1>

        <p className="text-white/50 text-lg mb-1 font-medium tracking-wider">
          كويت تريفيا
        </p>

        <p className="text-white/70 mt-4 mb-8 text-base leading-relaxed">
          How well do you know Kuwait? Test your knowledge of its rich history,
          vibrant culture, landmarks, and traditions.
        </p>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: "❓", label: "Questions", value: totalQuestions },
            { icon: "⏱️", label: "Timed", value: "30s each" },
            { icon: "🏆", label: "Categories", value: "10+" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-card rounded-xl p-3 flex flex-col items-center gap-1"
            >
              <span className="text-xl">{stat.icon}</span>
              <span className="text-white font-bold text-sm">{stat.value}</span>
              <span className="text-white/50 text-xs">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Start button */}
        <button
          onClick={onStart}
          className="w-full py-4 px-8 rounded-2xl text-white text-xl font-black transition-all duration-200 hover:scale-105 active:scale-95 shadow-lg relative overflow-hidden group"
          style={{ background: "linear-gradient(135deg, #007A3D, #00A651)" }}
        >
          <span className="relative z-10">Start Quiz →</span>
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
        </button>

        <p className="text-white/30 text-sm mt-4">
          Each question has 4 options • Learn a fun fact after each answer
        </p>
      </div>

      {/* Bottom decoration */}
      <div className="mt-8 flex gap-2 opacity-40">
        {["🌴", "🕌", "⚓", "🐚", "🛢️"].map((emoji, i) => (
          <span key={i} className="text-2xl">{emoji}</span>
        ))}
      </div>
    </div>
  );
}
