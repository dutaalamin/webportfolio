'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import HamburgerMenu from '../components/HamburgerMenu';
import BackgroundAudio from '../components/Audio';

// Hotspot areas positioned over actual buildings in the map image
// x, y = center position as %, w, h = size as %
const mapLocations = [
  {
    id: 'home',
    name: 'Gedung Hokage',
    subtitle: 'HOME',
    href: '/',
    x: 50, y: 44, // Red building center
    w: 16, h: 16,
    description: 'Main village headquarters',
  },
  {
    id: 'about',
    name: 'Gerbang Konoha',
    subtitle: 'ABOUT',
    href: '/transition',
    x: 18, y: 47, // Gate on the left (moved down and right slightly)
    w: 12, h: 18,
    description: 'The story begins here',
  },
  {
    id: 'experience',
    name: 'Hokage Rock',
    subtitle: 'EXPERIENCE',
    href: '/experience',
    x: 50, y: 22, // Faces on mountain (moved down)
    w: 30, h: 18,
    description: 'Battle records & quests',
  },
  {
    id: 'portfolio',
    name: 'Arena Latihan',
    subtitle: 'PORTFOLIO',
    href: '/portfolio',
    x: 50, y: 88, // Training ground at bottom center (moved down)
    w: 24, h: 16,
    description: 'Sacred scroll collection',
  },
  {
    id: 'message',
    name: 'Kedai Ichiraku',
    subtitle: 'MESSAGE',
    href: '/message',
    x: 87, y: 80, // Ramen shop bottom right (moved right and down)
    w: 12, h: 10,
    description: 'Drop a message over ramen',
  },
];

// Falling leaves component
function FallingLeaves() {
  const leaves = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 10 + Math.random() * 14,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 10,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="map-leaf"
          style={{
            left: leaf.left,
            width: leaf.size,
            height: leaf.size,
            animationDuration: `${leaf.duration}s`,
            animationDelay: `${leaf.delay}s`,
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 2C6.5 2 2 6.5 2 12c5-1 8-4 10-10z"
              fill={`hsl(${100 + Math.random() * 40}, 60%, ${35 + Math.random() * 20}%)`}
              opacity="0.8"
            />
            <path
              d="M12 2c5.5 0 10 4.5 10 10-5-1-8-4-10-10z"
              fill={`hsl(${340 + Math.random() * 30}, 70%, ${45 + Math.random() * 15}%)`}
              opacity="0.7"
            />
          </svg>
        </div>
      ))}
    </div>
  );
}

export default function MapPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [heroPos, setHeroPos] = useState({ x: 50, y: 32 });
  const [smokes, setSmokes] = useState([]);
  const [isHeroHidden, setIsHeroHidden] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  // Move hero to hovered node with thick smoke teleport
  useEffect(() => {
    if (hoveredNode) {
      const node = mapLocations.find((l) => l.id === hoveredNode);
      if (node) {
        const newX = node.x;
        const newY = node.y - 10;
        
        // Don't teleport if already there
        if (Math.abs(heroPos.x - newX) < 2 && Math.abs(heroPos.y - newY) < 2) return;

        // If already teleporting, do nothing
        if (isHeroHidden) return;

        const id = Date.now();
        
        // 1. Smoke at current pos
        setSmokes(prev => [...prev, { id: id + 1, x: heroPos.x, y: heroPos.y }]);
        setIsHeroHidden(true);

        // 2. Wait, then move hero and show smoke at new pos
        setTimeout(() => {
          setHeroPos({ x: newX, y: newY });
          setSmokes(prev => [...prev, { id: id + 2, x: newX, y: newY }]);
          setIsHeroHidden(false);
          
          // Cleanup smokes from state
          setTimeout(() => {
            setSmokes(prev => prev.filter(s => s.id !== id + 1 && s.id !== id + 2));
          }, 800);
        }, 400); // 400ms hidden delay
      }
    }
  }, [hoveredNode, heroPos, isHeroHidden]);

  const menu = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Experience', href: '/experience' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Map', href: '/map' },
  ];

  return (
    <div className="relative w-screen h-screen bg-[#1c130b] overflow-hidden font-pressStart select-none flex items-center justify-center">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes thick-smoke-expand {
          0% { transform: translate(-50%, -80%) scale(0.1); opacity: 1; }
          40% { transform: translate(-50%, -80%) scale(1.2); opacity: 1; filter: drop-shadow(0px 10px 10px rgba(0,0,0,0.2)); }
          70% { transform: translate(-50%, -80%) scale(1.5); opacity: 0.8; filter: drop-shadow(0px 10px 20px rgba(0,0,0,0.1)); }
          100% { transform: translate(-50%, -80%) scale(2); opacity: 0; filter: blur(5px); }
        }
        .smoke-puff-thick {
          animation: thick-smoke-expand 0.7s ease-out forwards;
        }
      `}} />
      <HamburgerMenu menuItems={menu} />
      <BackgroundAudio src="/audio/experience.mp3" volume={0.15} delay={1000} className="fixed top-4 right-16 z-40" />

      {/* === FULL SCREEN MAP CONTAINER === */}
      <div className="relative w-full h-full overflow-hidden bg-black">
        
        {/* === MAP BACKGROUND IMAGE === */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/konoha_map_hd.png"
            alt="Konoha Village Map"
            fill
            className="object-fill"
            priority
          />
        </div>

        {/* === SMOKE PUFFS === */}
        {smokes.map((smoke) => (
          <div
            key={smoke.id}
            className="smoke-puff-thick absolute z-30 pointer-events-none"
            style={{
              left: `${smoke.x}%`,
              top: `${smoke.y}%`,
            }}
          >
            {/* THICK CLOUD STRUCTURE */}
            <div className="relative w-24 h-24 md:w-32 md:h-32">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-[inset_-2px_-5px_10px_rgba(0,0,0,0.1)]" />
              <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-gray-100 rounded-full shadow-[inset_-2px_-5px_10px_rgba(0,0,0,0.1)]" />
              <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-[inset_-2px_-5px_10px_rgba(0,0,0,0.1)]" />
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 bg-gray-50 rounded-full shadow-[inset_-2px_-5px_10px_rgba(0,0,0,0.1)]" />
            </div>
          </div>
        ))}

        {/* === HERO CHARACTER === */}
        <div
          className={`absolute z-20 pointer-events-none ${
            isVisible && !isHeroHidden ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            left: `${heroPos.x}%`,
            top: `${heroPos.y}%`,
            transform: 'translate(-50%, -100%)',
            transition: isHeroHidden ? 'none' : 'opacity 0.2s',
          }}
        >
          <div className="relative w-20 h-20 md:w-28 md:h-28">
            <Image src="/images/hero2.gif" alt="Hero" fill className="object-contain drop-shadow-lg" />
          </div>
        </div>

        {/* === CLICKABLE HOTSPOT AREAS OVER BUILDINGS === */}
        {mapLocations.map((loc, i) => {
          const isHovered = hoveredNode === loc.id;

          return (
            <div
              key={loc.id}
              className={`absolute z-20 cursor-pointer transition-all duration-300 ease-out ${
                isVisible ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                left: `${loc.x - loc.w / 2}%`,
                top: `${loc.y - loc.h / 2}%`,
                width: `${loc.w}%`,
                height: `${loc.h}%`,
                transitionDelay: `${i * 100 + 300}ms`,
              }}
              onMouseEnter={() => setHoveredNode(loc.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => router.push(loc.href)}
            >
              {/* Bouncing Quest Arrow (Always visible) */}
              <div
                className={`absolute -top-8 left-1/2 -translate-x-1/2 text-[#f8b800] text-sm md:text-xl transition-all duration-300 pointer-events-none drop-shadow-[0_2px_2px_rgba(0,0,0,1)] ${
                  isHovered ? 'scale-125 text-white animate-none -translate-y-2' : 'animate-bounce'
                }`}
              >
                ▼
              </div>

              {/* Subtle radial glow on hover instead of a hard box */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-500 pointer-events-none ${
                  isHovered
                    ? 'bg-[#f8b800]/20 shadow-[0_0_40px_20px_rgba(248,184,0,0.4)] scale-110'
                    : 'bg-transparent scale-100'
                }`}
              />

              {/* Label that appears on hover */}
              <div
                className={`absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 z-50 ${
                  isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-90'
                }`}
                style={{ pointerEvents: 'none' }}
              >
                <div className="bg-black/90 text-white px-3 py-1.5 rounded border-2 border-[#f8b800]/60 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-[7px] md:text-[9px] font-bold text-center">{loc.name}</p>
                  <p className="text-[5px] md:text-[7px] text-[#f8b800] text-center mt-0.5">{loc.subtitle}</p>
                </div>
                {/* Triangle pointer */}
                <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[5px] border-r-[5px] border-b-[6px] border-transparent border-b-black/90" />
              </div>
            </div>
          );
        })}

        {/* === FALLING LEAVES === */}
        <FallingLeaves />
      </div>

      {/* === MAP TITLE === */}
      <div
        className={`absolute top-4 left-4 md:top-6 md:left-6 z-30 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
        }`}
      >
        <div className="bg-[#f5edd6]/90 border-4 border-[#8b7332] rounded-lg px-3 py-2 md:px-5 md:py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-[10px] md:text-sm text-[#4a3728] font-bold">🍥 VILLAGE MAP</h1>
          <p className="text-[6px] md:text-[8px] text-[#8b7332] mt-0.5">Click a building to explore</p>
        </div>
      </div>

      {/* === BACK BUTTON (Desktop) === */}
      <Link href="/">
        <button
          className={`hidden md:flex absolute bottom-6 left-6 z-30 px-4 py-2 bg-white border-4 border-black text-black text-xs font-pressStart hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          &lt; Back
        </button>
      </Link>

      {/* === MOBILE BACK BUTTON === */}
      <Link href="/">
        <button
          className={`flex md:hidden absolute bottom-4 left-4 z-30 px-3 py-2 bg-white border-3 border-black text-black text-[8px] font-pressStart shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          ◀ Back
        </button>
      </Link>
    </div>
  );
}
