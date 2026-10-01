'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useGame } from '../../components/GameProvider';

const typeThemes = {
  fire: {
    border: 'linear-gradient(135deg, #ffd700, #ff8c00, #ffd700, #ff4500, #ffd700)',
    bg: 'linear-gradient(160deg, #ff6b35 0%, #e63946 40%, #c1121f 100%)',
    tagBg: 'bg-orange-500',
    artBox: 'linear-gradient(135deg, #ffebcd, #ffdcb3, #ffcc99)',
    emoji: '🔥',
  },
  water: {
    border: 'linear-gradient(135deg, #ffd700, #4fc3f7, #ffd700, #0288d1, #ffd700)',
    bg: 'linear-gradient(160deg, #4fc3f7 0%, #0288d1 40%, #01579b 100%)',
    tagBg: 'bg-blue-500',
    artBox: 'linear-gradient(135deg, #e3f2fd, #b3e5fc, #81d4fa)',
    emoji: '💧',
  },
  grass: {
    border: 'linear-gradient(135deg, #ffd700, #81c784, #ffd700, #388e3c, #ffd700)',
    bg: 'linear-gradient(160deg, #81c784 0%, #4caf50 40%, #2e7d32 100%)',
    tagBg: 'bg-green-600',
    artBox: 'linear-gradient(135deg, #e8f5e9, #c8e6c9, #a5d6a7)',
    emoji: '🌿',
  },
  electric: {
    border: 'linear-gradient(135deg, #ffd700, #ffeb3b, #ffd700, #f9a825, #ffd700)',
    bg: 'linear-gradient(160deg, #f9a825 0%, #f57f17 40%, #e65100 100%)',
    tagBg: 'bg-yellow-500',
    artBox: 'linear-gradient(135deg, #fff8e1, #ffecb3, #ffe082)',
    emoji: '⚡',
  },
  psychic: {
    border: 'linear-gradient(135deg, #ffd700, #ba68c8, #ffd700, #8e24aa, #ffd700)',
    bg: 'linear-gradient(160deg, #ba68c8 0%, #9c27b0 40%, #6a1b9a 100%)',
    tagBg: 'bg-purple-600',
    artBox: 'linear-gradient(135deg, #f3e5f5, #e1bee7, #ce93d8)',
    emoji: '🔮',
  },
  ice: {
    border: 'linear-gradient(135deg, #ffd700, #80deea, #ffd700, #0097a7, #ffd700)',
    bg: 'linear-gradient(160deg, #80deea 0%, #26c6da 40%, #006064 100%)',
    tagBg: 'bg-cyan-600',
    artBox: 'linear-gradient(135deg, #e0f7fa, #b2ebf2, #80deea)',
    emoji: '❄️',
  },
  fighting: {
    border: 'linear-gradient(135deg, #ffd700, #ff8a65, #ffd700, #d84315, #ffd700)',
    bg: 'linear-gradient(160deg, #ff8a65 0%, #f4511e 40%, #bf360c 100%)',
    tagBg: 'bg-red-700',
    artBox: 'linear-gradient(135deg, #fbe9e7, #ffccbc, #ffab91)',
    emoji: '🥊',
  },
  poison: {
    border: 'linear-gradient(135deg, #ffd700, #ce93d8, #ffd700, #7b1fa2, #ffd700)',
    bg: 'linear-gradient(160deg, #ce93d8 0%, #9c27b0 40%, #4a148c 100%)',
    tagBg: 'bg-purple-700',
    artBox: 'linear-gradient(135deg, #f3e5f5, #e1bee7, #ce93d8)',
    emoji: '☠️',
  },
  ground: {
    border: 'linear-gradient(135deg, #ffd700, #d4a373, #ffd700, #8d6e63, #ffd700)',
    bg: 'linear-gradient(160deg, #d4a373 0%, #a1887f 40%, #5d4037 100%)',
    tagBg: 'bg-amber-700',
    artBox: 'linear-gradient(135deg, #efebe9, #d7ccc8, #bcaaa4)',
    emoji: '🌍',
  },
  flying: {
    border: 'linear-gradient(135deg, #ffd700, #90caf9, #ffd700, #42a5f5, #ffd700)',
    bg: 'linear-gradient(160deg, #90caf9 0%, #42a5f5 40%, #1565c0 100%)',
    tagBg: 'bg-sky-500',
    artBox: 'linear-gradient(135deg, #e3f2fd, #bbdefb, #90caf9)',
    emoji: '🦅',
  },
  bug: {
    border: 'linear-gradient(135deg, #ffd700, #aed581, #ffd700, #689f38, #ffd700)',
    bg: 'linear-gradient(160deg, #aed581 0%, #7cb342 40%, #33691e 100%)',
    tagBg: 'bg-lime-600',
    artBox: 'linear-gradient(135deg, #f1f8e9, #dcedc8, #c5e1a5)',
    emoji: '🐛',
  },
  rock: {
    border: 'linear-gradient(135deg, #ffd700, #a1887f, #ffd700, #6d4c41, #ffd700)',
    bg: 'linear-gradient(160deg, #a1887f 0%, #795548 40%, #3e2723 100%)',
    tagBg: 'bg-stone-600',
    artBox: 'linear-gradient(135deg, #efebe9, #d7ccc8, #bcaaa4)',
    emoji: '🪨',
  },
  ghost: {
    border: 'linear-gradient(135deg, #ffd700, #9575cd, #ffd700, #512da8, #ffd700)',
    bg: 'linear-gradient(160deg, #9575cd 0%, #673ab7 40%, #311b92 100%)',
    tagBg: 'bg-violet-700',
    artBox: 'linear-gradient(135deg, #ede7f6, #d1c4e9, #b39ddb)',
    emoji: '👻',
  },
  dragon: {
    border: 'linear-gradient(135deg, #ffd700, #7e57c2, #ffd700, #311b92, #ffd700)',
    bg: 'linear-gradient(160deg, #7e57c2 0%, #512da8 40%, #1a237e 100%)',
    tagBg: 'bg-indigo-700',
    artBox: 'linear-gradient(135deg, #ede7f6, #d1c4e9, #b39ddb)',
    emoji: '🐉',
  },
  dark: {
    border: 'linear-gradient(135deg, #ffd700, #616161, #ffd700, #212121, #ffd700)',
    bg: 'linear-gradient(160deg, #616161 0%, #424242 40%, #000000 100%)',
    tagBg: 'bg-gray-800',
    artBox: 'linear-gradient(135deg, #eeeeee, #bdbdbd, #9e9e9e)',
    emoji: '🌑',
  },
  steel: {
    border: 'linear-gradient(135deg, #ffd700, #b0bec5, #ffd700, #546e7a, #ffd700)',
    bg: 'linear-gradient(160deg, #b0bec5 0%, #78909c 40%, #263238 100%)',
    tagBg: 'bg-slate-600',
    artBox: 'linear-gradient(135deg, #eceff1, #cfd8dc, #b0bec5)',
    emoji: '⚙️',
  },
  fairy: {
    border: 'linear-gradient(135deg, #ffd700, #f48fb1, #ffd700, #c2185b, #ffd700)',
    bg: 'linear-gradient(160deg, #f48fb1 0%, #e91e63 40%, #880e4f 100%)',
    tagBg: 'bg-pink-500',
    artBox: 'linear-gradient(135deg, #fce4ec, #f8bbd0, #f48fb1)',
    emoji: '✨',
  },
  normal: {
    border: 'linear-gradient(135deg, #ffd700, #e0e0e0, #ffd700, #9e9e9e, #ffd700)',
    bg: 'linear-gradient(160deg, #e0e0e0 0%, #bdbdbd 40%, #757575 100%)',
    tagBg: 'bg-gray-400',
    artBox: 'linear-gradient(135deg, #fafafa, #f5f5f5, #eeeeee)',
    emoji: '⭐',
  },
};

function getTheme(types) {
  const primaryType = types?.[0]?.type?.name || 'normal';
  return typeThemes[primaryType] || typeThemes.normal;
}

export default function CollectionPage() {
  const { caughtPokemon, releasePokemon } = useGame();
  const [searchQuery, setSearchQuery] = useState('');
  const [flippedCards, setFlippedCards] = useState({});

  const toggleFlip = (uniqueId) => {
    setFlippedCards((prev) => ({ ...prev, [uniqueId]: !prev[uniqueId] }));
  };

  const handleRelease = (e, uniqueId) => {
    e.stopPropagation(); // Avoid flipping card
    if (confirm("Are you sure you want to release this Pokémon back into the wild?")) {
      releasePokemon(uniqueId);
    }
  };

  const filteredPokemon = caughtPokemon.filter((p) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen py-12 px-6 lg:px-24 w-full z-10 overflow-y-auto max-h-[85vh] hide-scroll">
      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-blue-700 drop-shadow-[0_0_15px_rgba(8,145,178,0.15)] tracking-wider">
          MY COLLECTION
        </h1>
        <p className="text-slate-600 mb-8">Your Caught holographic trading cards ({caughtPokemon.length} caught)</p>

        {caughtPokemon.length > 0 ? (
          <>
            {/* Search Bar */}
            <div className="w-full max-w-md mb-12 relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full opacity-15 group-hover:opacity-40 transition duration-300 blur-sm"></div>
              <input 
                type="text" 
                placeholder="Search your collection..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="relative w-full bg-white text-slate-800 px-6 py-3 rounded-full border border-slate-200 focus:outline-none focus:border-cyan-500 shadow-xs transition-colors placeholder-slate-400 text-sm"
              />
            </div>

            {filteredPokemon.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-500 text-lg">No Pokémon found matching &ldquo;{searchQuery}&rdquo;</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6 w-full place-items-center mb-12">
                {filteredPokemon.map((p) => {
                  const theme = getTheme(p.types);
                  const primaryType = p.types[0]?.type?.name || 'normal';
                  const hp = Math.floor(p.stats[0]?.base_stat || 45);
                  const isFlipped = flippedCards[p.uniqueId] || false;
                  
                  return (
                    <div 
                      key={p.uniqueId} 
                      onClick={() => toggleFlip(p.uniqueId)}
                      className="[perspective:1000px] cursor-pointer w-full max-w-[200px] transition-transform duration-300 hover:-translate-y-2 card-enter"
                      style={{ aspectRatio: '59/86' }}
                    >
                      <div className={`w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                        
                        {/* ================= FRONT OF CARD ================= */}
                        <div className="absolute w-full h-full [backface-visibility:hidden] group">
                          <div 
                            className="relative w-full h-full rounded-2xl overflow-hidden p-[5px] shadow-[0_0_20px_rgba(0,0,0,0.3),4px_4px_0_0_rgba(0,0,0,0.7)] hover:shadow-[0_0_40px_rgba(0,0,0,0.5),4px_4px_0_0_rgba(0,0,0,0.7)] transition-all duration-300"
                            style={{ background: theme.border }}
                          >
                            {/* Inner card body */}
                            <div className="rounded-xl overflow-hidden h-full flex flex-col" style={{ background: theme.bg }}>
                              
                              {/* TOP: Name + HP */}
                              <div className="px-3 pt-2.5 pb-1 flex justify-between items-center">
                                <span className="text-white font-black text-[10px] md:text-xs drop-shadow-md capitalize truncate max-w-[65%]" style={{ textShadow: '1px 1px 0 #000' }}>
                                  {p.name}
                                </span>
                                <span className="text-yellow-300 font-black text-[9px] md:text-[11px] drop-shadow-md whitespace-nowrap">
                                  ❤️ HP {hp}
                                </span>
                              </div>
                              
                              {/* TYPE tag */}
                              <div className="px-3 pb-1.5">
                                <span className={`border border-yellow-300 text-white text-[6px] md:text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider shadow ${theme.tagBg}`}>
                                  {theme.emoji} {primaryType} · #{String(p.id).padStart(3, '0')}
                                </span>
                              </div>

                              {/* ARTWORK BOX */}
                              <div 
                                className="mx-2.5 mb-1.5 rounded-lg overflow-hidden border-[3px] flex items-center justify-center relative" 
                                style={{ height: '42%', borderColor: '#ffd700', background: theme.artBox }}
                              >
                                <div className="relative w-full h-full">
                                  <Image 
                                    src={p.sprites.other['official-artwork'].front_default} 
                                    alt={p.name}
                                    fill
                                    className="object-contain p-2 drop-shadow-[0_5px_5px_rgba(0,0,0,0.3)]"
                                    sizes="200px"
                                  />
                                </div>
                              </div>

                              {/* BOTTOM INFO PANEL */}
                              <div className="mx-2 mb-1.5 rounded-lg p-2 flex-1 flex flex-col justify-start" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,215,0,0.4)' }}>
                                <p className="text-yellow-200 font-black text-[7px] md:text-[8px] uppercase tracking-widest mb-0.5">
                                  ⚡ {p.types.map(t => t.type.name).join(' / ')}
                                </p>
                                <p className="text-white text-[7px] md:text-[8px] font-bold leading-tight opacity-80">
                                  Height: {(p.height / 10).toFixed(1)}m · Weight: {(p.weight / 10).toFixed(1)}kg
                                </p>
                              </div>

                              {/* FOOTER */}
                              <div className="px-3 pb-1.5 flex justify-between items-center mt-auto">
                                <span className="text-yellow-200 text-[5px] md:text-[6px] font-bold opacity-70">Caught Item</span>
                                <span className="text-yellow-200 text-[5px] md:text-[6px] font-bold opacity-70">★ Holo</span>
                              </div>
                            </div>

                            {/* Holographic shine overlay */}
                            <div 
                              className="absolute inset-[5px] rounded-xl pointer-events-none opacity-0 hover:opacity-100 transition-opacity duration-300"
                              style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.15) 55%, transparent 70%)', animation: 'holoShine 1.5s ease infinite' }}
                            />
                          </div>
                        </div>

                        {/* ================= BACK OF CARD (Stats) ================= */}
                        <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
                          <div 
                            className="relative w-full h-full rounded-2xl overflow-hidden p-[5px] shadow-[0_0_20px_rgba(0,0,0,0.3),4px_4px_0_0_rgba(0,0,0,0.7)]"
                            style={{ background: theme.border }}
                          >
                            <div className="rounded-xl overflow-hidden h-full flex flex-col justify-between" style={{ background: theme.bg }}>
                              
                              {/* TOP: Name + HP */}
                              <div className="px-3 pt-2.5 pb-1 flex justify-between items-center">
                                <span className="text-white font-black text-[10px] md:text-xs drop-shadow-md capitalize truncate max-w-[65%]" style={{ textShadow: '1px 1px 0 #000' }}>
                                  {p.name}
                                </span>
                                <button
                                  onClick={(e) => handleRelease(e, p.uniqueId)}
                                  className="px-2 py-0.5 bg-red-600 hover:bg-red-500 border border-red-400 rounded text-white font-bold text-[7px] md:text-[8px] uppercase tracking-wider shadow active:scale-95 transition-all"
                                >
                                  Release
                                </button>
                              </div>

                              {/* STATS PANEL */}
                              <div className="mx-2.5 flex-1 rounded-lg p-2.5 flex flex-col justify-center" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,215,0,0.4)' }}>
                                <p className="text-yellow-200 font-black text-[8px] md:text-[9px] uppercase tracking-widest mb-1.5">
                                  ⚡ Base Stats
                                </p>
                                <div className="space-y-1">
                                  {p.stats.map((stat) => (
                                    <div key={stat.stat.name} className="flex items-center gap-1.5">
                                      <span className="w-12 text-[7px] md:text-[8px] font-black text-white/80 uppercase truncate">
                                        {stat.stat.name.replace('special-', 'sp.')}
                                      </span>
                                      <div className="flex-1 h-1 bg-black/30 rounded-full overflow-hidden">
                                        <div 
                                          className={`h-full rounded-full ${stat.base_stat > 80 ? 'bg-green-400' : stat.base_stat > 50 ? 'bg-yellow-400' : 'bg-red-400'}`}
                                          style={{ width: `${Math.min((stat.base_stat / 150) * 100, 100)}%` }}
                                        />
                                      </div>
                                      <span className="w-6 text-right text-[7px] md:text-[8px] font-black text-white">{stat.base_stat}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* FOOTER */}
                              <div className="px-3 py-1.5 flex justify-between items-center mt-auto">
                                <span className="text-yellow-200 text-[5px] md:text-[6px] font-bold opacity-70">Pokédex Encyclopedia</span>
                                <span className="text-white/40 text-[5px] md:text-[6px] font-bold">TAP TO FLIP</span>
                              </div>
                            </div>

                            {/* Holographic shine overlay */}
                            <div 
                              className="absolute inset-[5px] rounded-xl pointer-events-none opacity-60"
                              style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.1) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.1) 55%, transparent 70%)', animation: 'holoShine 2s ease infinite' }}
                            />
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-32 h-32 relative mb-6 opacity-35 animate-pulse">
              {/* Pure CSS Pokeball fallback */}
              <div className="pokeball-container scale-75 shadow-xs"></div>
            </div>
            <h3 className="text-slate-700 font-bold text-lg mb-2">No Pokémon caught yet!</h3>
            <p className="text-slate-600 text-sm max-w-sm mb-6 font-sans">
              Venture into the tall grass on the Encounter page to find and catch wild Pokémon.
            </p>
            <Link 
              href="/pokedex" 
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-full shadow-lg transition-all text-sm tracking-wide border-2 border-cyan-400/20 active:scale-95 cursor-pointer font-sans"
            >
              Start Encounter 🌿
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
