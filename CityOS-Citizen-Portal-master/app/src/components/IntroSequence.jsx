import { useState, useEffect } from "react";

const screens = [
  { text: "CITIZEN IDENTIFICATION PROTOCOL: ACTIVE", delay: 0 },
  { text: "THE GRID MONITORS ALL DEVIATIONS", delay: 3000 },
  {
    text: "COMPLIANCE IS SERENITY. RESISTANCE IS NOISE.",
    delay: 6000,
  },
  {
    text: "YOU ARE NOW ENTERING THE SURVEILLANCE ZONE",
    delay: 9000,
    showButton: true,
  },
];

export default function IntroSequence({ onComplete }) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [shouldSkip, setShouldSkip] = useState(false);

  useEffect(() => {
    // Check if user has seen intro before
    const hasSeenIntro = localStorage.getItem("cityos-intro-seen");
    if (hasSeenIntro) {
      setShouldSkip(true);
      onComplete();
      return;
    }

    // Auto-advance screens
    const timers = screens.map((screen, index) => {
      return setTimeout(() => {
        setCurrentScreen(index);
      }, screen.delay);
    });

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [onComplete]);

  const handleEnter = () => {
    localStorage.setItem("cityos-intro-seen", "true");
    onComplete();
  };

  if (shouldSkip) return null;

  const currentScreenData = screens[currentScreen];

  return (
    <div className="fixed inset-0 bg-void z-50 flex items-center justify-center">
      {/* Scanline overlay */}
      <div className="scanline" />

      <div className="text-center px-8 max-w-7xl">
        <h1
          className="font-mono text-5xl md:text-7xl lg:text-8xl text-terminal animate-fade-in leading-tight font-bold terminal-text tracking-widest"
          style={{
            animation:
              "fadeIn 800ms ease-in-out, flicker 3s ease-in-out infinite",
            textShadow: "0 0 20px #00ff00, 0 0 40px #00ff00",
          }}>
          {currentScreenData.text}
        </h1>

        {currentScreenData.showButton && (
          <button
            onClick={handleEnter}
            className="mt-20 px-20 py-6 bg-threat text-white text-2xl font-mono font-black border-4 border-caution
                     shadow-[0_0_40px_rgba(255,0,0,0.6)]
                     hover:shadow-[0_0_80px_rgba(255,0,0,0.9)]
                     hover:bg-threat-dim
                     active:scale-95
                     transition-all duration-150
                     animate-fade-in
                     uppercase tracking-widest
                     threat-glow"
            style={{
              animation:
                "fadeIn 800ms ease-in-out 500ms backwards, pulse 2s ease-in-out infinite",
            }}>
            ⚠ AUTHENTICATE
          </button>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 40px rgba(255,0,0,0.6), 0 0 80px rgba(255,0,0,0.3);
          }
          50% {
            box-shadow: 0 0 80px rgba(255,0,0,0.9), 0 0 120px rgba(255,0,0,0.6);
          }
        }
      `}</style>
    </div>
  );
}
