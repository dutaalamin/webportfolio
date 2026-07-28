'use client';
import { useState, useRef } from 'react';

const typeColors = {
  fire: {
    borderOuter: 'linear-gradient(135deg, #ffd700, #ff8c00, #ffd700, #ff4500, #ffd700)',
    bgInner: 'linear-gradient(160deg, #ff6b35 0%, #e63946 40%, #c1121f 100%)',
    tagBg: 'bg-orange-500',
    artBox: 'linear-gradient(135deg, #ffebcd, #ffdcb3, #ffcc99)',
    iconText: '🔥 Draken'
  },
  water: {
    borderOuter: 'linear-gradient(135deg, #ffd700, #4fc3f7, #ffd700, #0288d1, #ffd700)',
    bgInner: 'linear-gradient(160deg, #4fc3f7 0%, #0288d1 40%, #01579b 100%)',
    tagBg: 'bg-blue-500',
    artBox: 'linear-gradient(135deg, #e3f2fd, #b3e5fc, #81d4fa)',
    iconText: '💧 ScreenV'
  },
  electric: {
    borderOuter: 'linear-gradient(135deg, #ffd700, #ffeb3b, #ffd700, #f9a825, #ffd700)',
    bgInner: 'linear-gradient(160deg, #f9a825 0%, #f57f17 40%, #e65100 100%)',
    tagBg: 'bg-yellow-500',
    artBox: 'linear-gradient(135deg, #fff8e1, #ffecb3, #ffe082)',
    iconText: '⚡ Stinger'
  },
  grass: {
    borderOuter: 'linear-gradient(135deg, #ffd700, #81c784, #ffd700, #388e3c, #ffd700)',
    bgInner: 'linear-gradient(160deg, #81c784 0%, #4caf50 40%, #2e7d32 100%)',
    tagBg: 'bg-green-600',
    artBox: 'linear-gradient(135deg, #e8f5e9, #c8e6c9, #a5d6a7)',
    iconText: '🌿 Casava'
  },
  psychic: {
    borderOuter: 'linear-gradient(135deg, #ffd700, #ba68c8, #ffd700, #8e24aa, #ffd700)',
    bgInner: 'linear-gradient(160deg, #ba68c8 0%, #9c27b0 40%, #6a1b9a 100%)',
    tagBg: 'bg-purple-600',
    artBox: 'linear-gradient(135deg, #f3e5f5, #e1bee7, #ce93d8)',
    iconText: '🔮 Bravo'
  },
  dark: {
    borderOuter: 'linear-gradient(135deg, #ffd700, #616161, #ffd700, #212121, #ffd700)',
    bgInner: 'linear-gradient(160deg, #616161 0%, #424242 40%, #000000 100%)',
    tagBg: 'bg-gray-800',
    artBox: 'linear-gradient(135deg, #eeeeee, #bdbdbd, #9e9e9e)',
    iconText: '🌑 Bpro'
  },
  fairy: {
    borderOuter: 'linear-gradient(135deg, #ffd700, #f48fb1, #ffd700, #c2185b, #ffd700)',
    bgInner: 'linear-gradient(160deg, #f48fb1 0%, #e91e63 40%, #880e4f 100%)',
    tagBg: 'bg-pink-500',
    artBox: 'linear-gradient(135deg, #fce4ec, #f8bbd0, #f48fb1)',
    iconText: '✨ Colorway'
  },
  ice: {
    borderOuter: 'linear-gradient(135deg, #ffd700, #80deea, #ffd700, #0097a7, #ffd700)',
    bgInner: 'linear-gradient(160deg, #80deea 0%, #26c6da 40%, #006064 100%)',
    tagBg: 'bg-cyan-600',
    artBox: 'linear-gradient(135deg, #e0f7fa, #b2ebf2, #80deea)',
    iconText: '❄️ Fishy'
  },
  dragon: {
    borderOuter: 'linear-gradient(135deg, #ffd700, #7e57c2, #ffd700, #311b92, #ffd700)',
    bgInner: 'linear-gradient(160deg, #7e57c2 0%, #512da8 40%, #1a237e 100%)',
    tagBg: 'bg-indigo-700',
    artBox: 'linear-gradient(135deg, #ede7f6, #d1c4e9, #b39ddb)',
    iconText: '🐉 Marvel'
  },
  steel: {
    borderOuter: 'linear-gradient(135deg, #ffd700, #b0bec5, #ffd700, #546e7a, #ffd700)',
    bgInner: 'linear-gradient(160deg, #b0bec5 0%, #78909c 40%, #263238 100%)',
    tagBg: 'bg-slate-600',
    artBox: 'linear-gradient(135deg, #eceff1, #cfd8dc, #b0bec5)',
    iconText: '⚙️ 67Sports'
  },
  fighting: {
    borderOuter: 'linear-gradient(135deg, #ffd700, #ff8a65, #ffd700, #d84315, #ffd700)',
    bgInner: 'linear-gradient(160deg, #ff8a65 0%, #f4511e 40%, #bf360c 100%)',
    tagBg: 'bg-red-700',
    artBox: 'linear-gradient(135deg, #fbe9e7, #ffccbc, #ffab91)',
    iconText: '🥊 Savory'
  },
  normal: {
    borderOuter: 'linear-gradient(135deg, #ffd700, #e0e0e0, #ffd700, #9e9e9e, #ffd700)',
    bgInner: 'linear-gradient(160deg, #e0e0e0 0%, #bdbdbd 40%, #757575 100%)',
    tagBg: 'bg-gray-400',
    artBox: 'linear-gradient(135deg, #fafafa, #f5f5f5, #eeeeee)',
    iconText: '⭐ Project'
  }
};

const mapToElement = (title) => {
  if (!title) return 'normal';
  const t = title.toLowerCase();
  
  if (t.includes('bpro')) return 'dark';
  if (t.includes('draken')) return 'fire';
  if (t.includes('stinger')) return 'electric';
  if (t.includes('bravo')) return 'psychic';
  if (t.includes('colorway')) return 'fairy';
  if (t.includes('screenv')) return 'water';
  if (t.includes('casava')) return 'grass';
  if (t.includes('fishytype')) return 'ice';
  if (t.includes('marvel')) return 'dragon';
  if (t.includes('67sports')) return 'steel';
  if (t.includes('savory')) return 'fighting';

  return 'normal';
};

export default function PokeCard({ item, index }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const cardRef = useRef(null);
  
  const elementType = mapToElement(item.title);
  const theme = typeColors[elementType] || typeColors.normal;
  
  const hp = (item.skills?.length || 1) * 30 + 50;
  const abilityName = item.tools?.[0] || 'Web App';
  const abilityDesc = item.description?.[0]?.subdesc || 'A digital project by Duta Alamin.';
  const imageSrc = `/images/projects/${item.title.toLowerCase()}.png`;

  return (
    <div 
      className="relative cursor-pointer group perspective-1000 w-full max-w-[240px]"
      style={{ aspectRatio: '59/86' }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
      >
        {/* ================= FRONT OF CARD ================= */}
        <div className="absolute w-full h-full backface-hidden">
          <div className="relative w-full h-full rounded-2xl p-[6px] shadow-[0_0_30px_rgba(0,0,0,0.2),6px_6px_0_0_rgba(0,0,0,0.8)] group-hover:shadow-[0_0_50px_rgba(0,0,0,0.4),6px_6px_0_0_rgba(0,0,0,0.8)] transition-all duration-300"
            style={{ background: theme.borderOuter }}>
            
            {/* Inner card body */}
            <div className="rounded-xl overflow-hidden h-full flex flex-col font-sans" style={{ background: theme.bgInner }}>
              
              {/* TOP: Name bar */}
              <div className="px-3 pt-3 pb-1 flex justify-between items-center">
                <span className="text-white font-black text-[11px] md:text-xs drop-shadow-md truncate max-w-[70%]" style={{ textShadow: '1px 1px 0 #000' }}>
                  {item.title}
                </span>
                <span className="text-yellow-300 font-black text-[10px] md:text-xs drop-shadow-md">
                  ❤️ HP {hp}
                </span>
              </div>
              
              {/* TYPE tag */}
              <div className="px-3 pb-2">
                <span className={`border border-yellow-300 text-white text-[7px] md:text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow ${theme.tagBg}`}>
                  {theme.iconText} · Rare
                </span>
              </div>

              {/* ARTWORK BOX */}
              <div className="mx-3 mb-2 rounded-lg overflow-hidden border-[3px] flex items-center justify-center relative bg-white" 
                style={{ height: '40%', borderColor: '#ffd700', background: theme.artBox }}>
                <img 
                  src={imageSrc} 
                  alt={item.title} 
                  className="w-full h-full object-cover" 
                  onError={(e) => { e.target.src = 'https://placehold.co/400x300/fff8e1/ffd700?text=?'; }}
                />
              </div>

              {/* BOTTOM TEXT PANEL */}
              <div className="mx-2 mb-2 rounded-lg p-2 flex-1 flex flex-col justify-start" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,215,0,0.4)' }}>
                <p className="text-yellow-200 font-black text-[8px] md:text-[9px] uppercase tracking-widest mb-1">
                  ⚡ {abilityName}
                </p>
                <p className="text-white text-[8px] md:text-[9px] font-bold leading-tight" style={{ display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {abilityDesc}
                </p>
              </div>

              {/* FOOTER */}
              <div className="px-3 pb-2 flex justify-between items-center mt-auto">
                <span className="text-yellow-200 text-[6px] md:text-[7px] font-bold opacity-70">Illus. Duta</span>
                <span className="text-yellow-200 text-[6px] md:text-[7px] font-bold opacity-70">★ Holo</span>
              </div>
            </div>

            {/* Holographic shine overlay */}
            <div className="absolute inset-[6px] rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0.15) 55%, transparent 70%)', animation: 'holoShine 1.5s ease infinite' }}>
            </div>
          </div>
        </div>

        {/* ================= BACK OF CARD ================= */}
        <div className="absolute w-full h-full backface-hidden rotate-y-180 rounded-2xl border-4 border-yellow-500 shadow-xl overflow-hidden flex flex-col items-center justify-center p-4"
             style={{ backgroundImage: 'radial-gradient(circle, #1e3a8a 20%, #172554 80%)' }}>
          
          <div className="w-16 h-16 rounded-full border-4 border-yellow-400 bg-red-600 flex items-center justify-center mb-4 md:mb-6 shadow-inner relative overflow-hidden">
             <div className="w-full h-1/2 bg-white absolute bottom-0"></div>
             <div className="w-4 h-4 bg-white border-2 border-gray-800 rounded-full z-10"></div>
             <div className="w-full h-1 bg-gray-800 absolute top-1/2 transform -translate-y-1/2"></div>
          </div>

          <h3 className="text-yellow-400 font-black text-sm md:text-xl mb-4 md:mb-6 drop-shadow-md text-center" style={{ fontFamily: 'serif' }}>
            POKÉMON
          </h3>

          {item.links?.length > 0 && (
            <a 
              href={item.links[0].url}
              onClick={(e) => e.stopPropagation()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 md:px-6 md:py-2 bg-yellow-400 text-blue-900 font-black rounded-full hover:bg-yellow-300 hover:scale-105 transition-all shadow-lg uppercase text-[10px] md:text-sm tracking-wider font-sans"
            >
              VISIT SITE
            </a>
          )}
          
          <p className="text-white/40 text-[7px] font-sans font-bold mt-4 md:mt-6">TAP TO FLIP BACK</p>
        </div>

      </div>
    </div>
  );
}
