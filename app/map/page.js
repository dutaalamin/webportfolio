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
    x: 50, y: 43, // Red building center
    w: 16, h: 16,
    description: 'Main village headquarters',
  },
  {
    id: 'about',
    name: 'Gerbang Konoha',
    subtitle: 'ABOUT',
    href: '/transition',
    x: 16, y: 43, // Gate on the left
    w: 12, h: 18,
    description: 'The story begins here',
  },
  {
    id: 'experience',
    name: 'Hokage Rock',
    subtitle: 'EXPERIENCE',
    href: '/experience',
    x: 50, y: 15, // Faces on mountain
    w: 30, h: 18,
    description: 'Battle records & quests',
  },
  {
    id: 'portfolio',
    name: 'Arena Latihan',
    subtitle: 'PORTFOLIO',
    href: '/portfolio',
    x: 50, y: 85, // Training ground at bottom center
    w: 24, h: 16,
    description: 'Sacred scroll collection',
  },
  {
    id: 'message',
    name: 'Kedai Ichiraku',
    subtitle: 'MESSAGE',
    href: '/message',
    x: 84, y: 78, // Ramen shop bottom right
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

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  // Move hero to hovered node
  useEffect(() => {
    if (hoveredNode) {
      const node = mapLocations.find((l) => l.id === hoveredNode);
      if (node) {
        setHeroPos({ x: node.x, y: node.y - 10 });
      }
    }
  }, [hoveredNode]);

  const menu = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Experience', href: '/experience' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Map', href: '/map' },
  ];

  return (
    <div className="relative w-screen h-screen bg-[#1c130b] overflow-hidden font-pressStart select-none flex items-center justify-center">
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

        {/* === HERO CHARACTER === */}
        <div
          className={`absolute z-20 pointer-events-none transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            left: `${heroPos.x}%`,
            top: `${heroPos.y}%`,
            transform: 'translate(-50%, -100%)',
          }}
        >
          <div className="relative w-12 h-12 md:w-16 md:h-16">
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
