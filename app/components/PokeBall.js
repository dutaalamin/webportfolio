'use client';

export default function PokeBall({ state, shakeCount }) {
  // Base classes for the outer container styled entirely with Tailwind
  let containerClass = "relative w-[120px] h-[120px] rounded-full border-[6px] border-zinc-900 overflow-hidden shadow-[0_0_30px_rgba(255,26,26,0.3),inset_0_-20px_30px_rgba(0,0,0,0.15),inset_0_20px_30px_rgba(255,255,255,0.1)] transition-all duration-300";
  
  if (state === 'idle') {
    containerClass += " animate-float cursor-pointer hover:scale-105 active:scale-95";
  } else if (state === 'dragging') {
    containerClass += " cursor-grabbing scale-105 shadow-[0_0_25px_rgba(239,68,68,0.2)]";
  } else if (state === 'throwing') {
    containerClass += " animate-pokedex-throw";
  } else if (state === 'shaking') {
    containerClass += ` animate-pokedex-shake`;
  } else if (state === 'caught') {
    containerClass += " scale-90 opacity-90 shadow-[0_0_40px_rgba(74,222,128,0.6)]";
  } else if (state === 'escaped') {
    containerClass += " scale-110 opacity-0 translate-y-[-20px] transition-all duration-500";
  }

  // Key to force animation restart on state/shake change
  const animKey = state === 'shaking' ? `shake-${shakeCount}` : state;

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      {/* Sparkles / Confetti when caught */}
      {state === 'caught' && (
        <div className="absolute inset-0 z-0">
          {[...Array(12)].map((_, i) => {
            const angle = (i * 360) / 12;
            const delay = i * 0.05;
            return (
              <div
                key={i}
                className="absolute w-2 h-6 bg-yellow-400 rounded-full"
                style={{
                  top: '45%',
                  left: '48%',
                  transform: `rotate(${angle}deg) translateY(-60px)`,
                  animation: `pokedex-confetti-pop 0.8s ease-out ${delay}s forwards`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Pure Tailwind Poké Ball */}
      <div 
        key={animKey}
        className={containerClass}
      >
        {/* Top Red Half */}
        <div className="absolute top-0 left-0 right-0 h-1/2 bg-red-600" />
        
        {/* Bottom White Half */}
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white" />
        
        {/* Center Divider Line */}
        <div className="absolute top-[calc(50%-3px)] left-0 right-0 h-[6px] bg-zinc-900" />
        
        {/* Outer Center Button Ring */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30px] h-[30px] bg-white border-[5px] border-zinc-900 rounded-full z-10 shadow-[0_0_15px_rgba(255,255,255,0.5)] flex items-center justify-center">
          {/* Inner Button Circle */}
          <div 
            className={`w-[12px] h-[12px] rounded-full border border-zinc-400 cursor-pointer transition-all duration-200 ${
              state === 'shaking' ? 'animate-pulse bg-red-500 shadow-[0_0_10px_#ef4444]' : 
              state === 'caught' ? 'bg-green-500 shadow-[0_0_15px_#22c55e]' : 'bg-gradient-to-br from-white to-zinc-200'
            }`}
          />
        </div>
      </div>
    </div>
  );
}
