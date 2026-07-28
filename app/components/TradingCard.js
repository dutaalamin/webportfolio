'use client';
import { useState, useRef, useEffect } from 'react';
import { GlobeAltIcon } from '@heroicons/react/24/solid';

const CARD_ATTRS = [
  { attr: '🔥', attrName: 'FIRE', color: '#b91c1c' },
  { attr: '💧', attrName: 'WATER', color: '#1d4ed8' },
  { attr: '🌍', attrName: 'EARTH', color: '#854d0e' },
  { attr: '💨', attrName: 'WIND', color: '#15803d' },
  { attr: '✨', attrName: 'LIGHT', color: '#ca8a04' },
  { attr: '🌑', attrName: 'DARK', color: '#581c87' },
  { attr: '⚡', attrName: 'DIVINE', color: '#c2410c' },
  { attr: '🌀', attrName: 'SPELL', color: '#0e7490' },
  { attr: '💎', attrName: 'ULTRA', color: '#4f46e5' },
  { attr: '🏆', attrName: 'LEGEND', color: '#b45309' },
];

export default function TradingCard({ item, index }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Flip Summon states
  const [isFaceDown, setIsFaceDown] = useState(true);
  const [isSummoning, setIsSummoning] = useState(false);
  const [showAura, setShowAura] = useState(false);

  const attr = CARD_ATTRS[index % CARD_ATTRS.length];
  const starCount = Math.min(item.tools?.length || 1, 8);
  const atkVal = (item.skills?.length || 1) * 800;
  const defVal = (item.tools?.length || 1) * 500;

  useEffect(() => {
    // Delay bertahap berurutan
    const initialDelay = 300 + (index * 150);
    
    const timer = setTimeout(() => {
      if (!isFaceDown || isSummoning) return;
      setIsSummoning(true); // Memulai animasi melompat (1.2 detik)
      setShowAura(true);
      
      // Di puncak lompatan (500ms), balik kartunya 3D
      setTimeout(() => {
        setIsFaceDown(false);
      }, 500);

      // Selesai seluruh animasi di 1200ms
      setTimeout(() => {
        setIsSummoning(false);
      }, 1200);
      
      // Aura menghilang perlahan
      setTimeout(() => {
        setShowAura(false);
      }, 1200);
      
    }, initialDelay);

    return () => clearTimeout(timer);
  }, [index]);

  const handleMouseMove = (e) => {
    if (!cardRef.current || isFaceDown) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    if (isFaceDown) return;
    setTilt({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const handleMouseEnter = () => {
    if (isFaceDown) return;
    setIsHovered(true);
  };

  // Logika Rotasi:
  // Jika FaceDown = -180deg (menampilkan bagian belakang palsu/vortex)
  // Jika isFlipped = 180deg (menampilkan deskripsi)
  // Default = 0deg (menampilkan depan)
  let rotateVal = `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`;
  if (isFaceDown) rotateVal = 'rotateY(-180deg)';
  else if (isFlipped) rotateVal = 'rotateY(180deg)';

  return (
    <div
      ref={cardRef}
      className={`yugioh-card-wrapper cursor-pointer relative ${isSummoning ? 'animate-ygo-summon' : (isFaceDown && index % 2 === 0 ? 'animate-float' : (isFaceDown ? 'animate-float-delay' : ''))}`}
      style={{ perspective: '1200px' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        if (isFaceDown) return; // Jangan bisa di-klik manual saat masih Face-Down
        setIsFlipped(!isFlipped);
      }}
    >
      {showAura && <div className="ygo-aura-overlay"></div>}
      <div
        className="yugioh-card-inner"
        style={{
          transform: rotateVal,
          transformStyle: 'preserve-3d',
          transition: isFaceDown || isFlipped || !isHovered ? 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'transform 0.1s ease',
        }}
      >
        {/* ===== FRONT OF CARD ===== */}
        <div
          className="yugioh-card-face yugioh-card-front"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Outer gold border */}
          <div className="w-full h-full rounded-[12px] p-[6px]"
            style={{ background: 'linear-gradient(145deg, #d4a843, #b8942e, #e8c95a, #c9a23a, #d4a843)' }}
          >
            {/* Inner card body */}
            <div className="w-full h-full rounded-[8px] flex flex-col"
              style={{ background: 'linear-gradient(180deg, #e8d5a3 0%, #d4be82 100%)' }}
            >
              {/* === Card Name + Attribute Row === */}
              <div className="flex items-center justify-between px-3 pt-2 pb-1">
                <h2 className="font-pressStart text-[8px] md:text-[10px] text-black uppercase truncate leading-tight pr-1" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.3)' }}>
                  {item.title}
                </h2>
                <div className="flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-full flex items-center justify-center text-[12px] md:text-[14px] border-2 border-black/30"
                  style={{ background: attr.color }}
                  title={attr.attrName}
                >
                  {attr.attr}
                </div>
              </div>

              {/* === Star Level Row === */}
              <div className="flex justify-end px-3 pb-1 gap-[1px]">
                {Array.from({ length: starCount }).map((_, i) => (
                  <span key={i} className="text-[8px] md:text-[10px]" style={{ color: '#d4a843', textShadow: '0 0 2px rgba(0,0,0,0.5)' }}>★</span>
                ))}
              </div>

              {/* === Image Frame === */}
              <div className="mx-3 mb-2 border-[3px] border-[#8b7332] overflow-hidden relative" style={{ aspectRatio: '4/3' }}>
                <img
                  src={`/images/projects/${item.title.toLowerCase()}.png`}
                  alt={item.title}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.target.src = 'https://placehold.co/400x300/d4be82/8b7332?font=press-start-2p&text=NO+IMG';
                  }}
                />
                {/* Holographic shimmer */}
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-200"
                  style={{
                    opacity: isHovered ? 0.35 : 0,
                    background: `linear-gradient(
                      ${110 + tilt.y * 6}deg,
                      transparent 15%,
                      rgba(255,255,255,0.6) 40%,
                      rgba(200,230,255,0.4) 55%,
                      transparent 85%
                    )`,
                  }}
                />
              </div>

              {/* === Type Line === */}
              <div className="mx-3 mb-1 border-b border-[#8b7332] pb-1">
                <p className="font-pressStart text-[6px] md:text-[7px] text-black/80 uppercase tracking-wider">
                  【{item.position?.toUpperCase() || 'WEB APP'}】
                </p>
              </div>

              {/* === Description Box === */}
              <div className="mx-3 mb-2 flex-grow border-[2px] border-[#8b7332] rounded-sm p-2 overflow-hidden"
                style={{ background: 'linear-gradient(180deg, #f5edd6, #e8d9b8)' }}
              >
                <p className="text-[7px] md:text-[8px] text-black/85 leading-relaxed font-sans font-medium" style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.description?.[0]?.subdesc}
                </p>
                {/* Tools tags */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {item.tools?.slice(0, 4).map((tool, i) => (
                    <span key={i} className="text-[6px] font-sans font-bold text-[#8b7332] uppercase">
                      {tool}{i < Math.min((item.tools?.length || 0) - 1, 3) ? ' •' : ''}
                    </span>
                  ))}
                </div>
              </div>

              {/* === ATK / DEF Row === */}
              <div className="flex justify-end items-center px-3 pb-2 gap-3">
                <span className="font-pressStart text-[7px] md:text-[8px] text-black/80">
                  ATK/<span className="text-black font-bold">{atkVal}</span>
                </span>
                <span className="font-pressStart text-[7px] md:text-[8px] text-black/80">
                  DEF/<span className="text-black font-bold">{defVal}</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== BACK OF CARD ===== */}
        <div
          className="yugioh-card-face yugioh-card-back"
          style={{ backfaceVisibility: 'hidden', transform: isFaceDown ? 'rotateY(-180deg)' : 'rotateY(180deg)' }}
        >
          {isFaceDown ? (
            /* Desain Vortex/Pusaran saat belum disummon (Face-Down) */
            <div className="ygo-card-back-design shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
              <div className="ygo-card-back-inner"></div>
            </div>
          ) : (
            /* Desain Teks Deskripsi saat diklik manual (Flipped) */
            <div className="w-full h-full rounded-[12px] p-[6px]"
              style={{ background: 'linear-gradient(145deg, #d4a843, #b8942e, #e8c95a, #c9a23a, #d4a843)' }}
            >
              <div className="w-full h-full rounded-[8px] flex flex-col items-center justify-center p-5"
                style={{ background: 'linear-gradient(180deg, #e8d5a3 0%, #d4be82 100%)' }}
              >
                <h2 className="font-pressStart text-black text-xs md:text-sm mb-3 uppercase text-center" style={{ textShadow: '0 1px 0 rgba(255,255,255,0.3)' }}>
                  {item.title}
                </h2>
                <p className="text-black/70 font-sans text-[10px] md:text-xs mb-2 font-bold text-center">{item.position}</p>
                <p className="text-black/60 font-sans text-[9px] md:text-[11px] leading-relaxed mb-5 text-center">
                  {item.description?.[0]?.subdesc}
                </p>

                {/* Skills */}
                {item.skills && (
                  <div className="flex flex-wrap gap-2 justify-center mb-5">
                    {item.skills.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-[#8b7332]/20 border border-[#8b7332] text-black text-[8px] font-sans font-bold rounded uppercase">
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Visit Site Button */}
                {item.links?.length > 0 && (
                  <a
                    href={item.links[0].url}
                    className="inline-flex items-center justify-center px-5 py-2 bg-[#f8b800] text-black text-[10px] font-pressStart rounded-lg border-2 border-black hover:bg-yellow-400 active:translate-y-1 transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)] cursor-pointer"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    VISIT SITE
                  </a>
                )}

                <p className="text-black/40 text-[7px] font-pressStart mt-4">TAP TO FLIP</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
