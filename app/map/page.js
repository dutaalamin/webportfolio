'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import HamburgerMenu from '../components/HamburgerMenu';
import BackgroundAudio from '../components/Audio';
import Typewriter from '../components/Typewriter';

// Hotspot areas positioned over actual buildings in the map image
// x, y = center position as %, w, h = size as %
const mapLocations = [
  {
    id: 'home',
    name: 'HOME',
    href: '/',
    x: 50, y: 44, // Red building center
    w: 16, h: 16,
  },
  {
    id: 'about',
    name: 'ABOUT',
    href: '/transition',
    x: 15, y: 47, // Gate on the left
    w: 12, h: 18,
  },
  {
    id: 'experience',
    name: 'EXPERIENCE',
    href: '/experience',
    x: 50, y: 22, // Moved slightly down from the rock faces
    w: 30, h: 18,
  },
  {
    id: 'portfolio',
    name: 'PORTFOLIO',
    href: '/portfolio',
    x: 50, y: 88, // Training ground at bottom center
    w: 24, h: 16,
  },
  {
    id: 'message',
    name: 'MESSAGE',
    href: '/message',
    x: 85, y: 80, // Ramen shop bottom right
    w: 12, h: 10,
  },
];

// Falling leaves component
function FallingLeaves() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const leaves = useMemo(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      size: 10 + Math.random() * 14,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 10,
    }));
  }, []);

  if (!mounted) return null;

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
  const [showWelcome, setShowWelcome] = useState(true);
  const [showQuestToast, setShowQuestToast] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  // Move hero to hovered node smoothly without smoke
  useEffect(() => {
    if (hoveredNode) {
      const node = mapLocations.find((l) => l.id === hoveredNode);
      if (node) {
        setHeroPos({ x: node.x, y: node.y });
      }
    }
  }, [hoveredNode]);

  // Handle click: Show smoke, hide hero, then navigate
  const handleNodeClick = (loc) => {
    if (isHeroHidden) return;

    const id = Date.now();
    // Smoke at current pos
    setSmokes(prev => [...prev, { id: id, x: heroPos.x, y: heroPos.y }]);
    setIsHeroHidden(true);

    // Wait for smoke animation, then navigate
    setTimeout(() => {
      router.push(loc.href);
    }, 500);
  };

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
          className={`absolute z-20 pointer-events-none transition-all duration-700 ease-out drop-shadow-[2px_4px_6px_rgba(0,0,0,0.5)] ${
            isVisible && !isHeroHidden ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            left: `${heroPos.x}%`,
            top: `${heroPos.y}%`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="relative w-16 h-16 md:w-24 md:h-24">
            <Image src="/images/ninja.gif" alt="Ninja Hero" fill className="object-contain" />
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
              onClick={() => handleNodeClick(loc)}
            >
              {/* Bouncing Quest Arrow (Always visible) */}
              <div
                className={`absolute top-0 left-1/2 -translate-x-1/2 text-[#f8b800] text-sm md:text-xl transition-all duration-300 pointer-events-none drop-shadow-[0_2px_2px_rgba(0,0,0,1)] ${
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
                className={`absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap transition-all duration-300 z-50 ${
                  isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-90'
                }`}
                style={{ pointerEvents: 'none' }}
              >
                <div className="bg-black/90 text-white px-4 py-2 rounded border-2 border-[#f8b800]/60 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-[8px] md:text-[11px] font-bold text-center tracking-wider">{loc.name}</p>
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
        className={`absolute top-4 left-1/2 -translate-x-1/2 z-30 transition-all duration-700 ease-out text-center ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'
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
          className={`hidden md:flex absolute top-6 left-6 z-30 px-4 py-2 bg-white border-4 border-black text-black text-xs font-pressStart hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          &lt; Back
        </button>
      </Link>

      {/* === MOBILE BACK BUTTON === */}
      <Link href="/">
        <button
          className={`flex md:hidden absolute top-4 left-4 z-30 px-3 py-2 bg-white border-3 border-black text-black text-[8px] font-pressStart shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          ◀ Back
        </button>
      </Link>

      {/* === WELCOME DIALOG (RPG STYLE) === */}
      {showWelcome && (
        <div 
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity duration-500 cursor-pointer"
          onClick={() => {
            setShowWelcome(false);
            setTimeout(() => setShowQuestToast(true), 500);
            setTimeout(() => setShowQuestToast(false), 10500);
          }}
        >
          <div className="relative w-[90%] md:w-[70%] lg:w-[50%] bg-[#f5edd6] border-8 border-[#4a3728] p-6 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col gap-6 animate-navFlash cursor-pointer" >
            {/* Scroll Decoration Dots */}
            <div className="absolute -top-4 -left-4 w-6 h-6 md:w-8 md:h-8 bg-[#8b7332] rounded-full border-4 border-[#4a3728] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
            <div className="absolute -bottom-4 -right-4 w-6 h-6 md:w-8 md:h-8 bg-[#8b7332] rounded-full border-4 border-[#4a3728] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
            <div className="absolute -top-4 -right-4 w-6 h-6 md:w-8 md:h-8 bg-[#8b7332] rounded-full border-4 border-[#4a3728] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
            <div className="absolute -bottom-4 -left-4 w-6 h-6 md:w-8 md:h-8 bg-[#8b7332] rounded-full border-4 border-[#4a3728] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" />
            
            <h2 className="text-[#4a3728] text-[10px] md:text-sm lg:text-base font-bold leading-loose min-h-[120px] md:min-h-[80px] pointer-events-none">
              <Typewriter 
                text="Hey there! Welcome to my domain! I am Duta Alamin, and coding is my Ninja Way. Are you ready to explore? Click on any building to see the projects and skills I've mastered over the years!" 
                speed={35} 
                delay={0} 
              />
            </h2>
            
            <div className="self-end mt-2 text-[6px] md:text-[9px] text-[#8b7332] font-pressStart animate-pulse pointer-events-none flex items-center gap-2">
              <span>TAP ANYWHERE TO CONTINUE</span>
              <span className="text-[10px] md:text-sm">▼</span>
            </div>
          </div>
        </div>
      )}

      {/* === QUEST TOAST === */}
      <div 
        className={`absolute top-20 right-2 md:right-4 z-40 transition-all duration-700 ease-out ${
          showQuestToast ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'
        }`}
      >
        <div className="bg-[#f5edd6] border-2 md:border-4 border-[#4a3728] p-2 md:p-4 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex gap-2 md:gap-4 items-start max-w-[200px] md:max-w-sm">
          <span className="text-lg md:text-2xl animate-bounce mt-0.5">📜</span>
          <div className="flex flex-col gap-1">
            <h3 className="text-red-600 font-bold text-[8px] md:text-base font-pressStart tracking-tighter md:tracking-normal">NEW MISSION!</h3>
            <p className="text-[#4a3728] text-[6px] md:text-xs font-pressStart leading-relaxed md:leading-relaxed">Explore the village and uncover Duta&apos;s Ninja Way!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
