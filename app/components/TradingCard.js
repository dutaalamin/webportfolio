'use client';
import { useState, useRef } from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/solid';

const CARD_COLORS = [
  { bg: 'from-yellow-400 to-amber-600', border: 'border-amber-500', star: '⭐', rarity: 'LEGENDARY' },
  { bg: 'from-purple-400 to-purple-700', border: 'border-purple-500', star: '💎', rarity: 'EPIC' },
  { bg: 'from-blue-400 to-blue-700', border: 'border-blue-500', star: '🔷', rarity: 'RARE' },
  { bg: 'from-green-400 to-emerald-600', border: 'border-green-500', star: '🟢', rarity: 'COMMON' },
  { bg: 'from-red-400 to-rose-600', border: 'border-red-500', star: '🔥', rarity: 'ULTRA RARE' },
  { bg: 'from-cyan-400 to-teal-600', border: 'border-cyan-500', star: '💠', rarity: 'SPECIAL' },
  { bg: 'from-pink-400 to-fuchsia-600', border: 'border-pink-500', star: '✨', rarity: 'MYTHIC' },
  { bg: 'from-orange-400 to-orange-600', border: 'border-orange-500', star: '🏆', rarity: 'CHAMPION' },
  { bg: 'from-indigo-400 to-indigo-700', border: 'border-indigo-500', star: '🌟', rarity: 'STELLAR' },
  { bg: 'from-lime-400 to-green-600', border: 'border-lime-500', star: '⚡', rarity: 'POWER' },
];

export default function TradingCard({ item, index }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const color = CARD_COLORS[index % CARD_COLORS.length];

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  return (
    <div
      ref={cardRef}
      className="trading-card-wrapper cursor-pointer"
      style={{
        perspective: '1000px',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div
        className="trading-card-inner"
        style={{
          transform: isFlipped 
            ? `rotateY(180deg)` 
            : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transformStyle: 'preserve-3d',
          transition: isFlipped || !isHovered ? 'transform 0.6s ease' : 'transform 0.1s ease',
        }}
      >
        {/* Front of Card */}
        <div
          className={`trading-card-front relative flex flex-col rounded-2xl overflow-hidden border-[3px] ${color.border}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Card Header Gradient */}
          <div className={`bg-gradient-to-br ${color.bg} px-4 py-2 flex justify-between items-center`}>
            <h2 className="font-pressStart text-white text-[10px] md:text-xs drop-shadow-md uppercase truncate pr-2">
              {item.title}
            </h2>
            <span className="text-white text-[8px] font-pressStart whitespace-nowrap">{item.date}</span>
          </div>

          {/* Card Image */}
          <div className="relative w-full h-36 md:h-44 border-y-2 border-black/20 overflow-hidden bg-gray-100">
            <img
              src={`/images/projects/${item.title.toLowerCase()}.png`}
              alt={item.title}
              className="object-cover w-full h-full"
              onError={(e) => {
                e.target.src = 'https://placehold.co/600x400/eeeeee/000000?font=press-start-2p&text=NO+IMAGE';
              }}
            />
            {/* Holographic shimmer overlay */}
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-300 pointer-events-none"
              style={{
                opacity: isHovered ? 0.3 : 0,
                background: `linear-gradient(
                  ${105 + tilt.y * 5}deg,
                  transparent 20%,
                  rgba(255,255,255,0.5) 45%,
                  rgba(200,220,255,0.3) 55%,
                  transparent 80%
                )`,
              }}
            />
          </div>

          {/* Card Info Section */}
          <div className="bg-white/95 px-4 py-3 flex-grow flex flex-col">
            <p className="text-gray-700 font-sans font-bold text-[10px] md:text-xs mb-2">{item.position}</p>
            <p className="text-gray-600 font-sans text-[9px] md:text-[11px] leading-relaxed mb-3 line-clamp-3">
              {item.description?.[0]?.subdesc}
            </p>

            {/* Stats / Tags */}
            <div className="mt-auto flex flex-wrap gap-1">
              {item.tools?.map((tool, i) => (
                <span
                  key={i}
                  className={`px-[6px] py-[2px] text-[7px] md:text-[8px] font-sans font-bold uppercase rounded bg-gradient-to-br ${color.bg} text-white`}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Card Footer */}
          <div className={`bg-gradient-to-br ${color.bg} px-4 py-2 flex justify-between items-center`}>
            <span className="text-white/90 text-[7px] font-pressStart">{color.star} {color.rarity}</span>
            <span className="text-white/80 text-[7px] font-pressStart">#{String(index + 1).padStart(3, '0')}</span>
          </div>
        </div>

        {/* Back of Card */}
        <div
          className={`trading-card-back absolute inset-0 flex flex-col rounded-2xl overflow-hidden border-[3px] ${color.border} bg-gradient-to-br ${color.bg}`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <div className="flex-grow flex flex-col items-center justify-center p-6 text-center">
            <h2 className="font-pressStart text-white text-sm md:text-base mb-4 drop-shadow-md uppercase">
              {item.title}
            </h2>
            <p className="text-white/90 font-sans text-xs md:text-sm mb-3 font-bold">{item.position}</p>
            <p className="text-white/80 font-sans text-[10px] md:text-xs leading-relaxed mb-6">
              {item.description?.[0]?.subdesc}
            </p>

            {/* Skills */}
            {item.skills && (
              <div className="flex flex-wrap gap-2 justify-center mb-4">
                {item.skills.map((skill, i) => (
                  <span key={i} className="px-2 py-1 bg-white/20 backdrop-blur text-white text-[8px] md:text-[9px] font-sans font-bold rounded-lg uppercase">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Visit Site Button */}
            {item.links?.length > 0 && (
              <a
                href={item.links[0].url}
                className="inline-flex items-center gap-2 mt-4 px-5 py-2 bg-white text-black text-[10px] font-pressStart rounded-xl border-2 border-black hover:bg-gray-100 active:translate-y-1 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] cursor-pointer"
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
              >
                <GlobeAltIcon className="w-4 h-4" />
                VISIT ▶
              </a>
            )}
          </div>

          {/* Back Footer */}
          <div className="bg-black/20 px-4 py-2 text-center">
            <span className="text-white/70 text-[7px] font-pressStart">TAP TO FLIP BACK</span>
          </div>
        </div>
      </div>
    </div>
  );
}
