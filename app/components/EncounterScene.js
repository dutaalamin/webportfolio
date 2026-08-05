'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useGame } from './GameProvider';
import Typewriter from './Typewriter';
import PokeBall from './PokeBall';
import { audioManager } from '../utils/audio';

const LEGENDARY_IDS = [144, 145, 146, 150, 151];

// This global variable persists during client-side Next.js route changes
// but resets to false upon a manual browser refresh.
let hasSeenGuideThisSession = false;

const typeColors = {
  fire: 'from-orange-500 to-red-600 border-orange-400 text-orange-200',
  water: 'from-blue-500 to-indigo-600 border-blue-400 text-blue-200',
  grass: 'from-green-500 to-emerald-600 border-green-400 text-green-200',
  electric: 'from-yellow-400 to-amber-500 border-yellow-300 text-yellow-100',
  psychic: 'from-purple-500 to-pink-600 border-purple-400 text-purple-200',
  ice: 'from-cyan-400 to-blue-500 border-cyan-300 text-cyan-100',
  fighting: 'from-red-600 to-rose-700 border-red-500 text-red-200',
  poison: 'from-fuchsia-600 to-purple-800 border-fuchsia-500 text-fuchsia-200',
  ground: 'from-amber-600 to-yellow-800 border-amber-500 text-amber-200',
  flying: 'from-sky-400 to-blue-500 border-sky-300 text-sky-100',
  bug: 'from-lime-500 to-green-600 border-lime-400 text-lime-200',
  rock: 'from-stone-500 to-stone-700 border-stone-400 text-stone-200',
  ghost: 'from-violet-700 to-indigo-900 border-violet-600 text-violet-200',
  dragon: 'from-indigo-600 to-purple-900 border-indigo-500 text-indigo-200',
  dark: 'from-zinc-700 to-zinc-900 border-zinc-600 text-zinc-300',
  steel: 'from-slate-400 to-slate-600 border-slate-300 text-slate-200',
  fairy: 'from-pink-400 to-rose-500 border-pink-300 text-pink-100',
  normal: 'from-gray-400 to-gray-600 border-gray-300 text-gray-200',
};

export default function EncounterScene() {
  const {
    currentEncounter,
    gameState,
    shakeCount,
    throwPokeBall,
    getNewEncounter,
    error,
  } = useGame();

  // Splash screen state (true only after first throw)
  const [hasThrownOnce, setHasThrownOnce] = useState(false);

  // Professor Oak Guide dialog states
  const [showGuide, setShowGuide] = useState(!hasSeenGuideThisSession);
  const [isTypingGuide, setIsTypingGuide] = useState(true);

  // Hold-to-charge states
  const [isCharging, setIsCharging] = useState(false);
  const [power, setPower] = useState(0);
  const powerRef = useRef(0);
  const powerDirRef = useRef(1);
  const chargeInterval = useRef(null);

  const startCharging = (e) => {
    if (e && e.type === 'mousedown') e.preventDefault();
    if (gameState !== 'idle') return;
    
    setIsCharging(true);
    setPower(0);
    powerRef.current = 0;
    powerDirRef.current = 1;

    audioManager.startCharge();

    chargeInterval.current = setInterval(() => {
      let p = powerRef.current;
      let dir = powerDirRef.current;
      
      p += dir * 2.0;
      
      if (p >= 100) {
        p = 100;
        dir = -1;
      } else if (p <= 0) {
        p = 0;
        dir = 1;
      }
      
      powerRef.current = p;
      powerDirRef.current = dir;
      setPower(p);
      
      audioManager.updateCharge(p);
    }, 20);
  };

  const releaseCharge = () => {
    if (!isCharging) return;
    setIsCharging(false);
    
    if (chargeInterval.current) {
      clearInterval(chargeInterval.current);
      chargeInterval.current = null;
    }
    
    audioManager.stopCharge();
    audioManager.playThrow();
    
    setHasThrownOnce(true);
    throwPokeBall();
  };

  useEffect(() => {
    if (!isCharging) return;
    
    const handleGlobalUp = () => releaseCharge();
    window.addEventListener('mouseup', handleGlobalUp);
    window.addEventListener('touchend', handleGlobalUp);
    
    return () => {
      window.removeEventListener('mouseup', handleGlobalUp);
      window.removeEventListener('touchend', handleGlobalUp);
    };
  }, [isCharging]);

  useEffect(() => {
    return () => {
      if (chargeInterval.current) clearInterval(chargeInterval.current);
      audioManager.stopCharge();
    };
  }, []);

  // Sync hasThrownOnce state when returning from collection page or if we are already doing something
  useEffect(() => {
    if (['throwing', 'shaking', 'caught', 'escaped'].includes(gameState)) {
      setHasThrownOnce(true);
    } else if (gameState === 'loading') {
      // Reset the splash screen when fetching a new encounter
      setHasThrownOnce(false);
    }
  }, [gameState]);

  // Auto-reset back after 3.5 seconds if caught or escaped
  useEffect(() => {
    let timer;
    if (gameState === 'caught' || gameState === 'escaped') {
      timer = setTimeout(() => {
        getNewEncounter();
      }, 8000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [gameState, getNewEncounter]);

  const handleSceneClick = () => {
    if (gameState === 'caught' || gameState === 'escaped') {
      getNewEncounter();
    }
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-200 rounded-2xl w-full max-w-md mx-auto mt-20 shadow-xs">
        <p className="text-red-600 font-bold mb-4">{error}</p>
        <button 
          onClick={getNewEncounter}
          className="px-6 py-2.5 bg-red-500 hover:bg-red-600 font-bold text-white rounded-full transition-colors cursor-pointer"
        >
          Try Summoning Again
        </button>
      </div>
    );
  }

  // --- 2. LOADING (Searching) STATE ---
  if (gameState === 'loading' || !currentEncounter) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="relative w-32 h-32 mb-6">
          <div className="absolute inset-0 border-4 border-cyan-500/20 rounded-full animate-ping"></div>
          <div className="absolute inset-2 border-4 border-t-cyan-500 border-r-cyan-500 border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="text-cyan-600 font-bold text-lg tracking-wider animate-pulse uppercase">
          Searching tall grass...
        </p>
      </div>
    );
  }

  // --- 3. ENCOUNTER STATE ---
  const p = currentEncounter;
  const isLegendary = LEGENDARY_IDS.includes(p.id);
  const primaryType = p.types[0]?.type?.name || 'normal';
  const typeStyle = typeColors[primaryType] || typeColors.normal;
  const isCaught = gameState === 'caught';

  const displayRarityText = isCaught ? (isLegendary ? '⭐ LEGENDARY' : 'WILD POKÉMON') : '❓ MYSTERY SHADOW';
  const displayDexNum = isCaught ? `Dex #${String(p.id).padStart(3, '0')}` : 'Dex #???';
  const displayTypeStyle = isCaught ? typeStyle : 'from-slate-400 to-slate-500 border-slate-300 text-slate-100 bg-slate-400';

  let statusMessage = "";
  if (gameState === 'idle') statusMessage = "Something is rustling in the tall grass...";
  else if (gameState === 'throwing') statusMessage = "Go, Poké Ball!";
  else if (gameState === 'shaking') statusMessage = `Shaking... `.repeat(shakeCount);
  else if (gameState === 'caught') statusMessage = `Gotcha! ${p.name.toUpperCase()} was caught! 🎉`;
  else if (gameState === 'escaped') statusMessage = "Oh no! The Pokémon escaped into the grass!";

  const showPokemon = gameState === 'idle' || gameState === 'throwing' || gameState === 'escaped' || gameState === 'caught';
  let pokemonAnimClass = "transition-all duration-500";
  if (gameState === 'throwing') pokemonAnimClass += " animate-pokedex-caught pokedex-silhouette"; 
  else if (gameState === 'escaped') pokemonAnimClass += " animate-pokedex-escape pokedex-silhouette"; 
  else if (gameState === 'caught') pokemonAnimClass += " animate-pokedex-appear drop-shadow-[0_0_40px_rgba(34,197,94,0.7)] scale-110"; 
  else if (gameState === 'idle') pokemonAnimClass += " animate-float pokedex-silhouette animate-pokedex-grass-rustle"; 

  return (
    <div 
      onClick={handleSceneClick}
      className={`w-full h-full flex flex-col justify-between overflow-hidden relative ${
        (gameState === 'caught' || gameState === 'escaped') ? 'cursor-pointer' : ''
      }`}
    >
      <div className="relative w-full h-full flex-1 flex flex-col justify-between p-6 sm:p-10 overflow-hidden">
        
        {/* Particle/Ambient Elements */}
        <div className={`absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-1000 ${hasThrownOnce ? 'opacity-40' : 'opacity-0'}`}>
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="pokedex-particle"
              style={{
                top: `${30 + i * 5}%`,
                left: `${5 + (i * 13) % 90}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${3 + (i % 3)}s`
              }}
            />
          ))}
        </div>



        {/* MIDDLE PANEL: Pokemon Sprite & Poké Ball */}
        <div className={`relative flex-1 w-full flex items-center justify-center ${hasThrownOnce ? 'min-h-[250px]' : 'min-h-full'}`}>
          {/* Pokemon Sprite Container */}
          {hasThrownOnce && showPokemon && (
            <div className={`relative w-52 h-52 sm:w-72 sm:h-72 md:w-96 md:h-96 -translate-y-28 md:-translate-y-36 z-10 ${pokemonAnimClass}`}>
              <Image 
                src={p.sprites.other['official-artwork'].front_default} 
                alt={p.name}
                fill
                className="object-contain p-2 sm:p-4 drop-shadow-[0_20px_35px_rgba(0,0,0,0.15)]"
                sizes="(max-width: 640px) 208px, (max-width: 768px) 288px, 384px"
                priority
              />
            </div>
          )}

          {/* Hold-to-charge Poké Ball or animated Poké Ball */}
          {gameState === 'idle' ? (
            <div 
              onMouseDown={startCharging}
              onTouchStart={startCharging}
              className={`absolute z-30 cursor-pointer flex flex-col items-center select-none transition-all duration-300 ${
                !hasThrownOnce 
                  ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 gap-8 scale-[1.5] hover:scale-[1.6] active:scale-[1.4]' 
                  : 'bottom-4 gap-2 scale-[1.3] hover:scale-[1.35] active:scale-[1.2]'
              }`}
            >
              <div className="relative">
                <PokeBall state={isCharging ? "dragging" : "idle"} />
                
                {/* Power Bar */}
                <div className={`absolute -right-16 bottom-4 w-7 h-36 bg-slate-950 rounded-lg border-4 border-slate-900 overflow-visible shadow-2xl transition-opacity duration-200 pointer-events-none ${isCharging ? 'opacity-100' : 'opacity-0'}`}>
                  {/* Realtime percentage display hovering above the bar */}
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 border-2 border-yellow-400 text-yellow-400 text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-md">
                    {Math.round(power)}%
                  </div>
                  <div 
                    className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-yellow-400 via-orange-500 to-red-600 shadow-[inset_-2px_0_4px_rgba(255,255,255,0.4)]"
                    style={{ height: `${power}%` }}
                  />
                </div>
              </div>

              {!isCharging && !hasThrownOnce && (
                <h1 
                  className="text-xl md:text-3xl font-black text-yellow-400 tracking-[0.3em] uppercase animate-pulse whitespace-nowrap text-center drop-shadow-[0_0_15px_rgba(234,179,8,0.8)] -mt-4"
                  style={{ WebkitTextStroke: '1.5px #1e293b' }}
                >
                  Throw the ball
                </h1>
              )}

              {!isCharging && hasThrownOnce && (
                <span className="text-[7px] md:text-[8px] font-black uppercase text-slate-500 tracking-wider bg-slate-100/95 px-4 py-1.5 rounded-full border border-slate-200 pointer-events-none animate-pulse shadow-xs">
                  Hold to Charge ⚡
                </span>
              )}
            </div>
          ) : (
            <div className={`absolute z-20 transition-all duration-700 ${
              gameState === 'caught' ? 'translate-y-24 translate-x-24 scale-[0.4] opacity-0' :
              gameState === 'throwing' ? 'scale-100' : 'scale-[0.6]'
            }`}>
              <PokeBall state={gameState} shakeCount={shakeCount} />
            </div>
          )}
        </div>
                  {/* BOTTOM PANEL: Rotom Phone / Pokédex HUD Box */}
        <div className={`absolute bottom-12 sm:bottom-28 md:bottom-36 left-1/2 -translate-x-1/2 z-10 w-[92%] max-w-lg flex flex-col items-center transition-all duration-1000 ${hasThrownOnce ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none'}`}>
          
          {/* Red Pokédex Chassis */}
          <div className="relative w-full rounded-[2rem] p-3 pt-6 pb-4 bg-gradient-to-br from-red-500 to-rose-600 border-4 border-slate-900 shadow-[6px_6px_0px_rgba(0,0,0,0.15)] flex flex-col items-center">
            
            {/* Camera Lens and Status LEDs (Pokédex/Rotom Tech Detail) */}
            <div className="absolute top-2 left-6 flex items-center gap-2">
              <div className="w-3.5 h-3.5 bg-cyan-400 border-2 border-slate-900 rounded-full shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
              <div className="w-1.5 h-1.5 bg-yellow-400 border border-slate-900 rounded-full" />
              <div className="w-1.5 h-1.5 bg-green-400 border border-slate-900 rounded-full" />
            </div>

            {/* Inner Content: Warm Retro Yellow Tech Pokedex Screen */}
            <div className="relative w-full flex flex-col items-center bg-[#fefce8] border-4 border-yellow-300/60 rounded-[1.2rem] p-4 text-center overflow-hidden shadow-inner">
              
              {/* Rarity & Dex # Badges inside the screen */}
              <div className="flex gap-2.5 mb-4.5 z-10">
                <span className={`text-[10px] md:text-xs font-black px-4 py-1.5 rounded-md uppercase tracking-wider border border-yellow-300 bg-gradient-to-r ${displayTypeStyle} text-white shadow-sm`}>
                  {displayRarityText}
                </span>
                <span className="text-slate-800 font-black text-[10px] md:text-xs tracking-wider bg-yellow-100/70 px-4 py-1.5 rounded-md border border-yellow-300/60 shadow-sm">
                  {displayDexNum}
                </span>
              </div>

              <h2 className="relative text-slate-900 font-black text-2xl md:text-3xl capitalize mb-2.5 tracking-wider">
                {isCaught ? p.name : '???'}
              </h2>
              
              <div className="relative flex gap-2 mb-4.5">
                {isCaught ? (
                  p.types.map(t => (
                    <span 
                      key={t.type.name} 
                      className={`text-[11px] md:text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-md border border-yellow-300 shadow-sm text-white bg-gradient-to-r ${typeColors[t.type.name] || typeColors.normal}`}
                    >
                      {t.type.name}
                    </span>
                  ))
                ) : (
                  <span className="text-[11px] md:text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-md bg-yellow-100/50 border border-yellow-300/60 text-slate-500 shadow-sm">
                    Unknown Type
                  </span>
                )}
              </div>

              {/* Warm Pokedex Message Console */}
              {['idle', 'escaped'].includes(gameState) && (
                <div className="relative w-full bg-yellow-50/80 rounded-xl border border-yellow-200 p-2.5 h-12 flex items-center justify-center mb-2 shadow-inner">
                  <p className={`text-xs md:text-sm font-bold tracking-wider transition-all duration-300 ${
                    gameState === 'escaped' ? 'text-red-500 animate-pulse' : 'text-slate-700'
                  }`}>
                    {statusMessage}
                  </p>
                </div>
              )}
              
              {(gameState === 'caught' || gameState === 'escaped') && (
                <p className="relative text-[10px] md:text-xs font-black text-slate-600 animate-pulse tracking-wide uppercase mt-1">
                  Click anywhere to continue exploring
                </p>
              )}

              {hasThrownOnce && gameState === 'idle' && (
                <div className="relative w-full flex justify-center mt-2.5 z-10">
                  <button
                    onClick={(e) => { e.stopPropagation(); getNewEncounter(); }}
                    className="w-full py-2.5 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-400 hover:to-rose-500 text-white font-black rounded-lg border-b-4 border-red-800 border border-slate-950 transition-all text-center uppercase tracking-widest text-[9px] cursor-pointer shadow-md active:border-b-0 active:translate-y-0.5"
                  >
                    Run Away / Search another spot
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* === PROFESSOR OAK GUIDE DIALOG === */}
      {showGuide && (
        <div 
          className="absolute inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs cursor-pointer select-none"
          onClick={() => {
            if (isTypingGuide) {
              setIsTypingGuide(false);
            } else {
              hasSeenGuideThisSession = true;
              setShowGuide(false);
            }
          }}
        >
          <div 
            className="relative w-[92%] max-w-lg md:max-w-2xl bg-[#fefce8] border-8 border-red-500 p-5 md:p-8 rounded-[2rem] shadow-[8px_8px_0px_rgba(0,0,0,0.15)] flex flex-col sm:flex-row gap-5 items-center sm:items-start cursor-pointer pointer-events-auto"
            onClick={(e) => {
              // Let click bubble up to trigger next state or close
            }}
          >
            {/* Tech camera light detail */}
            <div className="absolute top-3.5 left-6 flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 bg-cyan-400 border border-slate-900 rounded-full animate-pulse" />
              <div className="w-1 h-1 bg-yellow-400 rounded-full" />
              <div className="w-1 h-1 bg-green-400 rounded-full" />
            </div>

            {/* Screws at four corners */}
            <div className="absolute top-3 right-6 w-2 h-2 bg-slate-400 rounded-full border border-slate-600" />
            <div className="absolute bottom-3 left-6 w-2 h-2 bg-slate-400 rounded-full border border-slate-600" />
            <div className="absolute bottom-3 right-6 w-2 h-2 bg-slate-400 rounded-full border border-slate-600" />

            {/* Left side: Avatar Column */}
            <div className="flex-shrink-0 flex flex-col items-center gap-2 mt-4 sm:mt-6">
              <div className="relative w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-yellow-100 to-amber-200 border-4 border-slate-900 rounded-xl overflow-hidden shadow-inner">
                <Image 
                  src="/images/prof_oak.png" 
                  alt="Prof. Oak Avatar" 
                  fill 
                  className="object-contain scale-110 object-bottom"
                />
              </div>
            </div>

            {/* Right side: Text Column */}
            <div className="flex-1 flex flex-col items-center sm:items-start gap-1 mt-1 sm:mt-6 text-center sm:text-left">
              {/* Oak title badge */}
              <div className="bg-red-500 text-white font-black text-[10px] md:text-xs px-3.5 py-1 rounded-md border-2 border-slate-950 shadow-sm tracking-wider uppercase">
                Prof. Oak
              </div>

              {/* Welcome Text */}
              <h2 className="text-slate-800 text-xs sm:text-sm md:text-base font-black leading-relaxed min-h-[150px] sm:min-h-[110px] tracking-wide mt-2">
                <Typewriter 
                  text="Hello there! Welcome to the Pokédex Field Quest! To begin your journey, press and hold the Poké Ball in the center of the field to charge your throwing power. Release it when you have enough power to catch the wild Pokémon rustling in the grass. Try to catch them all and build your ultimate holographic collection!" 
                  speed={25} 
                  delay={2200}
                  forceComplete={!isTypingGuide}
                  onComplete={() => setIsTypingGuide(false)}
                />
              </h2>

            {/* Tap anywhere indicator */}
            {!isTypingGuide && (
              <div className="self-end mt-2 text-[8px] md:text-[9px] font-black text-slate-500 animate-pulse flex items-center gap-1.5">
                <span>TAP ANYWHERE TO CONTINUE</span>
                <span className="text-[10px] md:text-sm">▼</span>
              </div>
            )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
