"use client";

export default function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 star-bg animate-fade-in">
      {/* Flag stripe */}
      <div className="w-full h-2 fixed top-0 left-0 flex">
        <div className="flex-1 bg-kuwait-green" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-kuwait-red" />
        <div className="w-16 bg-black" style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }} />
      </div>

      <div className="glass-card rounded-3xl p-10 max-w-sm w-full text-center shadow-2xl">
        {/* Spinner */}
        <div className="flex justify-center mb-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-white/10" />
            <div
              className="absolute inset-0 rounded-full border-4 border-t-kuwait-green border-r-white border-b-kuwait-red border-l-transparent animate-spin"
            />
            <div className="absolute inset-0 flex items-center justify-center text-2xl">
              🇰🇼
            </div>
          </div>
        </div>

        <h2 className="text-white text-xl font-black mb-2">Loading Questions…</h2>
        <p className="text-white/50 text-sm">Fetching from Open Trivia DB</p>

        {/* Animated dots */}
        <div className="flex justify-center gap-2 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-2 h-2 rounded-full bg-kuwait-gold animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
