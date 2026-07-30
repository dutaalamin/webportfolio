'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Cloud from '../components/Cloud';
import BackgroundAudio from '../components/Audio';
import HamburgerMenu from '../components/HamburgerMenu';

const mapLocations = [
  {
    id: 'about',
    name: 'Village of About',
    subtitle: 'Learn the Hero\'s Story',
    href: '/about',
    icon: '🏘️',
    x: 18,
    y: 25,
    color: '#4ade80',
    borderColor: '#166534',
  },
  {
    id: 'experience',
    name: 'Battle Arena',
    subtitle: 'Work Experience',
    href: '/experience',
    icon: '⚔️',
    x: 75,
    y: 20,
    color: '#f87171',
    borderColor: '#991b1b',
  },
  {
    id: 'portfolio',
    name: 'Trophy Hall',
    subtitle: 'Projects & Works',
    href: '/portfolio',
    icon: '🏆',
    x: 22,
    y: 65,
    color: '#facc15',
    borderColor: '#854d0e',
  },
  {
    id: 'message',
    name: 'Message Scroll',
    subtitle: 'Send a Message',
    href: '/message',
    icon: '📜',
    x: 72,
    y: 62,
    color: '#a78bfa',
    borderColor: '#5b21b6',
  },
];

const paths = [
  { from: 'about', to: 'experience' },
  { from: 'about', to: 'portfolio' },
  { from: 'experience', to: 'message' },
  { from: 'portfolio', to: 'message' },
  { from: 'about', to: 'message' },
];

const menuItems = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT', href: '/about' },
  { label: 'EXPERIENCE', href: '/experience' },
  { label: 'PORTFOLIO', href: '/portfolio' },
];

export default function WorldMapPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [nodesVisible, setNodesVisible] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 300);
    return () => clearTimeout(timeout);
  }, []);

  // Stagger node appearance
  useEffect(() => {
    if (isVisible) {
      mapLocations.forEach((_, index) => {
        setTimeout(() => {
          setNodesVisible(prev => [...prev, index]);
        }, 400 + index * 250);
      });
    }
  }, [isVisible]);

  const getLocationById = (id) => mapLocations.find(l => l.id === id);

  return (
    <main className="relative w-full h-screen overflow-hidden font-pressStart select-none">
      {/* Background Audio */}
      <BackgroundAudio src="/audio/home.mp3" volume={0.15} delay={0} />

      {/* Hamburger Menu */}
      <HamburgerMenu menuItems={menuItems} />

      {/* Sky Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#87CEEB] via-[#B0E0F0] to-[#e8d5a3]" />

      {/* Clouds */}
      <Cloud />

      {/* Parchment Map Overlay */}
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(139,109,63,0.15) 100%)',
        }}
      />

      {/* Map Title Banner */}
      <div className={`absolute top-4 left-1/2 -translate-x-1/2 z-30 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
        <div className="bg-[#f8b800] border-4 border-black px-6 py-2 md:px-10 md:py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-[8px] sm:text-[10px] md:text-sm text-black font-bold tracking-wider text-center">
            🗺️ WORLD MAP
          </h1>
          <p className="text-[6px] md:text-[8px] text-black/60 text-center mt-1">SELECT YOUR DESTINATION</p>
        </div>
      </div>

      {/* Back to Home Button (Desktop) */}
      <Link href="/">
        <button className="hidden md:flex absolute top-6 left-6 z-50 px-4 py-2 bg-white border-4 border-black text-black text-xs font-pressStart hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer">
          &lt; Home
        </button>
      </Link>

      {/* SVG Paths connecting nodes */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        {paths.map((path, index) => {
          const from = getLocationById(path.from);
          const to = getLocationById(path.to);
          if (!from || !to) return null;

          const isHighlighted = hoveredNode === path.from || hoveredNode === path.to;

          return (
            <line
              key={index}
              x1={from.x + 4}
              y1={from.y + 5}
              x2={to.x + 4}
              y2={to.y + 5}
              stroke={isHighlighted ? '#f8b800' : '#8B6D3F'}
              strokeWidth={isHighlighted ? '0.6' : '0.4'}
              strokeDasharray="1.5,1"
              opacity={isVisible ? (isHighlighted ? 1 : 0.5) : 0}
              style={{
                transition: 'all 0.5s ease',
                filter: isHighlighted ? 'drop-shadow(0 0 2px #f8b800)' : 'none',
              }}
            />
          );
        })}
      </svg>

      {/* Map Nodes */}
      <div className="absolute inset-0 z-20">
        {mapLocations.map((location, index) => {
          const isHovered = hoveredNode === location.id;
          const isNodeVisible = nodesVisible.includes(index);

          return (
            <Link
              key={location.id}
              href={location.href}
              className="absolute group"
              style={{
                left: `${location.x}%`,
                top: `${location.y}%`,
                transform: `translate(-50%, -50%) scale(${isNodeVisible ? 1 : 0})`,
                opacity: isNodeVisible ? 1 : 0,
                transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}
              onMouseEnter={() => setHoveredNode(location.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Node Glow Ring */}
              <div
                className={`absolute inset-0 rounded-full transition-all duration-300 ${isHovered ? 'scale-150 opacity-60' : 'scale-100 opacity-0'}`}
                style={{
                  background: `radial-gradient(circle, ${location.color}44, transparent)`,
                  filter: 'blur(8px)',
                }}
              />

              {/* Node Circle */}
              <div
                className={`relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full border-4 flex items-center justify-center transition-all duration-300 cursor-pointer ${isHovered ? 'scale-110 -translate-y-2' : ''}`}
                style={{
                  backgroundColor: location.color,
                  borderColor: location.borderColor,
                  boxShadow: isHovered
                    ? `0 8px 0 0 ${location.borderColor}, 0 12px 20px rgba(0,0,0,0.3)`
                    : `0 4px 0 0 ${location.borderColor}, 0 6px 10px rgba(0,0,0,0.2)`,
                }}
              >
                <span className="text-2xl sm:text-3xl md:text-4xl drop-shadow-md">{location.icon}</span>

                {/* Pulse animation ring */}
                <div
                  className="absolute inset-0 rounded-full border-2 animate-ping"
                  style={{
                    borderColor: location.color,
                    animationDuration: '2s',
                  }}
                />
              </div>

              {/* Node Label */}
              <div className={`absolute left-1/2 -translate-x-1/2 mt-2 md:mt-3 whitespace-nowrap transition-all duration-300 ${isHovered ? 'translate-y-1' : ''}`}>
                <div className="bg-black/80 backdrop-blur-sm text-white px-2 py-1 md:px-4 md:py-2 rounded-lg border-2 border-white/20 text-center">
                  <p className="text-[6px] sm:text-[7px] md:text-[9px] font-bold tracking-wide">{location.name}</p>
                  <p className={`text-[5px] sm:text-[6px] md:text-[7px] text-gray-300 mt-0.5 transition-all duration-300 overflow-hidden ${isHovered ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'}`}>
                    {location.subtitle}
                  </p>
                </div>
                {/* Pointer triangle */}
                <div className="w-0 h-0 mx-auto border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-black/80 rotate-180 -mt-[1px]" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Hero Character in Center */}
      <div
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}
      >
        <div className="relative">
          <Image
            src="/images/hello.gif"
            alt="Hero"
            width={80}
            height={80}
            className="object-contain w-16 sm:w-20 md:w-24 h-auto drop-shadow-lg"
          />
          {/* Hero standing shadow */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-2 bg-black/20 rounded-full blur-sm" />
        </div>
      </div>

      {/* Decorative Trees / Bushes */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        {/* Ground texture */}
        <div className="relative w-full h-24 md:h-32">
          <Image
            src="/images/ground.png"
            alt="Ground"
            fill
            className="object-cover object-top"
          />
        </div>
      </div>

      {/* Decorative elements */}
      <div className={`absolute left-[8%] top-[45%] z-10 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-3xl md:text-5xl drop-shadow-lg">🌲</span>
      </div>
      <div className={`absolute left-[50%] top-[15%] z-10 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-2xl md:text-4xl drop-shadow-lg">⛩️</span>
      </div>
      <div className={`absolute right-[8%] top-[42%] z-10 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-3xl md:text-5xl drop-shadow-lg">🌲</span>
      </div>
      <div className={`absolute left-[40%] bottom-[25%] z-10 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-2xl md:text-3xl drop-shadow-lg">🌿</span>
      </div>
      <div className={`absolute right-[35%] bottom-[30%] z-10 transition-all duration-1000 delay-1100 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <span className="text-xl md:text-2xl drop-shadow-lg">🌸</span>
      </div>

      {/* Bottom Info Bar */}
      <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 z-30 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="bg-black/70 backdrop-blur-sm text-white px-4 py-2 md:px-8 md:py-3 rounded-lg border-2 border-white/10 flex items-center gap-4 md:gap-8">
          <div className="flex items-center gap-2">
            <span className="text-[8px] md:text-[10px] text-gray-400">🎮</span>
            <span className="text-[6px] md:text-[8px] text-gray-300">CLICK A STAGE TO BEGIN</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-2">
            <span className="text-[8px] md:text-[10px] text-gray-400">📍</span>
            <span className="text-[6px] md:text-[8px] text-gray-300">
              {hoveredNode ? mapLocations.find(l => l.id === hoveredNode)?.name.toUpperCase() : 'HOVER TO PREVIEW'}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
