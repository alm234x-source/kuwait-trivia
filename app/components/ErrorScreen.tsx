"use client";

interface ErrorScreenProps {
  message: string;
  onRetry: () => void;
  onBack: () => void;
}

export default function ErrorScreen({ message, onRetry, onBack }: ErrorScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 star-bg animate-fade-in">
      {/* Flag stripe */}
      <div className="w-full h-2 fixed top-0 left-0 flex">
        <div className="flex-1 bg-kuwait-green" />
        <div className="flex-1 bg-white" />
        <div className="flex-1 bg-kuwait-red" />
        <div className="w-16 bg-black" style={{ clipPath: "polygon(0 0, 100% 50%, 0 100%)" }} />
      </div>

      <div className="glass-card rounded-3xl p-8 md:p-10 max-w-sm w-full text-center shadow-2xl animate-bounce-in">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-white text-2xl font-black mb-3">Something went wrong</h2>
        <p className="text-white/60 text-sm leading-relaxed mb-8 bg-white/5 rounded-xl p-4 border border-white/10">
          {message}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={onRetry}
            className="w-full py-3 rounded-2xl text-white font-black text-base transition-all hover:scale-105 active:scale-95 shadow-lg"
            style={{ background: "linear-gradient(135deg, #007A3D, #00A651)" }}
          >
            🔄 Try Again
          </button>
          <button
            onClick={onBack}
            className="w-full py-3 rounded-2xl text-white/70 font-bold text-base transition-all hover:scale-105 active:scale-95 glass-card border border-white/20"
          >
            ← Change Settings
          </button>
        </div>
      </div>
    </div>
  );
}
