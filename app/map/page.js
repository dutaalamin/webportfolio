'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Cloud from '../components/Cloud';
import BackgroundAudio from '../components/Audio';
import HamburgerMenu from '../components/HamburgerMenu';

const mapLocations = [
  {
    id: 'about',
    name: 'Konoha Village',
    subtitle: 'About Me',
    href: '/about',
    emoji: '🏯',
    x: 15,
    y: 28,
    bgGradient: 'from-green-400 to-emerald-600',
    glowColor: 'rgba(74, 222, 128, 0.6)',
    ringColor: '#166534',
  },
  {
    id: 'experience',
    name: 'Training Ground',
    subtitle: 'Work Experience',
    href: '/experience',
    emoji: '⚔️',
    x: 78,
    y: 22,
    bgGradient: 'from-red-400 to-red-600',
    glowColor: 'rgba(248, 113, 113, 0.6)',
    ringColor: '#991b1b',
  },
  {
    id: 'portfolio',
    name: 'Scroll Archive',
    subtitle: 'Projects & Works',
    href: '/portfolio',
    emoji: '📜',
    x: 18,
    y: 68,
    bgGradient: 'from-amber-400 to-yellow-600',
    glowColor: 'rgba(250, 204, 21, 0.6)',
    ringColor: '#854d0e',
  },
  {
    id: 'message',
    name: 'Hawk Post',
    subtitle: 'Send a Message',
    href: '/message',
    emoji: '🦅',
    x: 75,
    y: 65,
    bgGradient: 'from-violet-400 to-purple-600',
    glowColor: 'rgba(167, 139, 250, 0.6)',
    ringColor: '#5b21b6',
  },
];

const paths = [
  { from: 'about', to: 'experience' },
  { from: 'about', to: 'portfolio' },
  { from: 'experience', to: 'message' },
  { from: 'portfolio', to: 'message' },
];

const menuItems = [
  { label: 'HOME', href: '/' },
  { label: 'ABOUT', href: '/about' },
  { label: 'EXPERIENCE', href: '/experience' },
  { label: 'PORTFOLIO', href: '/portfolio' },
  { label: 'WORLD MAP 🗺️', href: '/map' },
];

export default function WorldMapPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [nodesVisible, setNodesVisible] = useState([]);
  const [heroPos, setHeroPos] = useState({ x: 48, y: 48 });
  const [isWalking, setIsWalking] = useState(false);
  const [walkTarget, setWalkTarget] = useState(null);
  const [facingRight, setFacingRight] = useState(true);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showFlash, setShowFlash] = useState(false);

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
        }, 500 + index * 300);
      });
    }
  }, [isVisible]);

  const getLocationById = (id) => mapLocations.find(l => l.id === id);

  // Handle walking to a node
  const handleNodeClick = (location, e) => {
    e.preventDefault();
    if (isWalking) return;

    setIsWalking(true);
    setSelectedNode(location.id);
    setFacingRight(location.x > heroPos.x);
    setWalkTarget(location);

    // Move hero to the node
    setHeroPos({ x: location.x, y: location.y });

    // After walking animation, flash and navigate
    setTimeout(() => {
      setShowFlash(true);
      setTimeout(() => {
        router.push(location.href);
      }, 600);
    }, 1200);
  };

  return (
    <main className="relative w-full h-screen overflow-hidden font-pressStart select-none">
      {/* Background Audio */}
      <BackgroundAudio src="/audio/home.mp3" volume={0.15} delay={0} />

      {/* Hamburger Menu */}
      <HamburgerMenu menuItems={menuItems} />

      {/* Sky / Map Background */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 20%, #0f3460 40%, #533483 60%, #e94560 80%, #f8b800 100%)',
      }} />

      {/* Stars overlay (top portion) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 40}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${1.5 + Math.random() * 2}s`,
              opacity: 0.4 + Math.random() * 0.6,
            }}
          />
        ))}
      </div>

      {/* Terrain / Map Surface */}
      <div className="absolute bottom-0 left-0 right-0 h-[75%]" style={{
        background: 'linear-gradient(180deg, #8B7355 0%, #A0926B 20%, #C4B896 40%, #D4C8A0 60%, #8B7355 100%)',
        borderTop: '4px solid #5C4830',
      }}>
        {/* Parchment texture overlay */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(139,109,63,0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 60%, rgba(139,109,63,0.2) 0%, transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(139,109,63,0.25) 0%, transparent 40%)
          `,
        }} />
      </div>

      {/* Map Grid Lines (subtle) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
        {[...Array(10)].map((_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 10} x2="100" y2={i * 10} stroke="#5C4830" strokeWidth="0.15" />
        ))}
        {[...Array(10)].map((_, i) => (
          <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="100" stroke="#5C4830" strokeWidth="0.15" />
        ))}
      </svg>

      {/* Road Paths connecting nodes */}
      <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <filter id="pathGlow">
            <feGaussianBlur stdDeviation="0.3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {paths.map((path, index) => {
          const from = getLocationById(path.from);
          const to = getLocationById(path.to);
          if (!from || !to) return null;

          const isHighlighted = hoveredNode === path.from || hoveredNode === path.to;

          // Calculate midpoint for curve
          const mx = (from.x + to.x) / 2;
          const my = (from.y + to.y) / 2 - 5;

          return (
            <g key={index}>
              {/* Road shadow */}
              <path
                d={`M ${from.x + 3} ${from.y + 4} Q ${mx} ${my + 2} ${to.x + 3} ${to.y + 4}`}
                fill="none"
                stroke="rgba(0,0,0,0.2)"
                strokeWidth={isHighlighted ? '1.2' : '0.8'}
                strokeLinecap="round"
                opacity={isVisible ? 0.5 : 0}
                style={{ transition: 'all 0.5s ease' }}
              />
              {/* Main road */}
              <path
                d={`M ${from.x + 3} ${from.y + 3} Q ${mx} ${my} ${to.x + 3} ${to.y + 3}`}
                fill="none"
                stroke={isHighlighted ? '#f8b800' : '#8B6D3F'}
                strokeWidth={isHighlighted ? '1' : '0.6'}
                strokeDasharray={isHighlighted ? 'none' : '2,1.5'}
                strokeLinecap="round"
                opacity={isVisible ? (isHighlighted ? 1 : 0.6) : 0}
                filter={isHighlighted ? 'url(#pathGlow)' : 'none'}
                style={{ transition: 'all 0.5s ease' }}
              />
            </g>
          );
        })}
      </svg>

      {/* Decorative Landmarks */}
      <div className={`absolute left-[5%] top-[35%] z-10 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-80' : 'opacity-0'}`}>
        <div className="text-4xl md:text-6xl drop-shadow-lg">🌲</div>
      </div>
      <div className={`absolute left-[10%] top-[50%] z-10 transition-all duration-1000 delay-600 ${isVisible ? 'opacity-70' : 'opacity-0'}`}>
        <div className="text-3xl md:text-4xl drop-shadow-lg">🌲</div>
      </div>
      <div className={`absolute right-[5%] top-[35%] z-10 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-80' : 'opacity-0'}`}>
        <div className="text-4xl md:text-6xl drop-shadow-lg">🌲</div>
      </div>
      <div className={`absolute right-[10%] top-[55%] z-10 transition-all duration-1000 delay-800 ${isVisible ? 'opacity-70' : 'opacity-0'}`}>
        <div className="text-3xl md:text-4xl drop-shadow-lg">🌲</div>
      </div>
      <div className={`absolute left-[45%] top-[18%] z-10 transition-all duration-1000 delay-900 ${isVisible ? 'opacity-80' : 'opacity-0'}`}>
        <div className="text-3xl md:text-5xl drop-shadow-lg">⛩️</div>
      </div>
      <div className={`absolute left-[55%] bottom-[18%] z-10 transition-all duration-1000 delay-1000 ${isVisible ? 'opacity-60' : 'opacity-0'}`}>
        <div className="text-2xl md:text-3xl drop-shadow-lg">🏔️</div>
      </div>
      <div className={`absolute left-[35%] top-[80%] z-10 transition-all duration-1000 delay-1100 ${isVisible ? 'opacity-60' : 'opacity-0'}`}>
        <div className="text-xl md:text-2xl drop-shadow-lg">🌊</div>
      </div>

      {/* Map Title Banner */}
      <div className={`absolute top-3 left-1/2 -translate-x-1/2 z-30 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-8'}`}>
        <div className="relative">
          <div className="bg-gradient-to-r from-[#c0392b] via-[#e74c3c] to-[#c0392b] border-4 border-black px-6 py-2 md:px-12 md:py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
            {/* Metallic shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer" />
            <h1 className="text-[8px] sm:text-[10px] md:text-base text-white font-bold tracking-widest text-center drop-shadow-md relative z-10">
              NINJA WORLD MAP
            </h1>
            <p className="text-[5px] md:text-[7px] text-white/70 text-center mt-0.5 tracking-wider relative z-10">忍の世界 — SELECT YOUR DESTINATION</p>
          </div>
          {/* Scroll ends */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-10 bg-gradient-to-r from-[#8B4513] to-[#A0522D] border-2 border-black rounded-full" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-10 bg-gradient-to-r from-[#A0522D] to-[#8B4513] border-2 border-black rounded-full" />
        </div>
      </div>

      {/* Back to Home Button (Desktop) */}
      <Link href="/">
        <button className="hidden md:flex absolute top-6 left-6 z-50 px-4 py-2 bg-white border-4 border-black text-black text-xs font-pressStart hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer">
          &lt; Home
        </button>
      </Link>

      {/* Map Nodes */}
      <div className="absolute inset-0 z-20">
        {mapLocations.map((location, index) => {
          const isHovered = hoveredNode === location.id;
          const isSelected = selectedNode === location.id;
          const isNodeVisible = nodesVisible.includes(index);

          return (
            <div
              key={location.id}
              className="absolute cursor-pointer"
              style={{
                left: `${location.x}%`,
                top: `${location.y}%`,
                transform: `translate(-50%, -50%) scale(${isNodeVisible ? 1 : 0})`,
                opacity: isNodeVisible ? 1 : 0,
                transition: 'transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.6s ease',
              }}
              onClick={(e) => handleNodeClick(location, e)}
              onMouseEnter={() => setHoveredNode(location.id)}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Ground shadow */}
              <div className={`absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 md:w-20 h-3 bg-black/20 rounded-full blur-sm transition-all duration-300 ${isHovered ? 'w-20 md:w-24 opacity-40' : ''}`} />

              {/* Glow effect */}
              <div
                className={`absolute inset-[-12px] rounded-full transition-all duration-500 ${isHovered || isSelected ? 'opacity-100 scale-110' : 'opacity-0 scale-90'}`}
                style={{
                  background: `radial-gradient(circle, ${location.glowColor}, transparent 70%)`,
                  filter: 'blur(10px)',
                }}
              />

              {/* Node structure - multi-layered */}
              <div className={`relative transition-all duration-300 ${isHovered ? '-translate-y-3 scale-110' : ''}`}>
                {/* Outer ring */}
                <div
                  className={`w-18 h-18 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full p-1 transition-all duration-300`}
                  style={{
                    background: `conic-gradient(from 0deg, ${location.ringColor}, ${location.glowColor}, ${location.ringColor})`,
                    boxShadow: isHovered
                      ? `0 0 20px ${location.glowColor}, 0 8px 0 ${location.ringColor}`
                      : `0 4px 0 ${location.ringColor}, 0 6px 10px rgba(0,0,0,0.3)`,
                  }}
                >
                  {/* Inner circle */}
                  <div className={`w-full h-full rounded-full bg-gradient-to-br ${location.bgGradient} flex items-center justify-center border-2 border-white/30`}>
                    <span className="text-2xl sm:text-3xl md:text-4xl drop-shadow-lg">{location.emoji}</span>
                  </div>
                </div>

                {/* Spinning ring on hover */}
                {isHovered && (
                  <div className="absolute inset-[-4px] rounded-full border-2 border-dashed animate-spin pointer-events-none" style={{
                    borderColor: location.glowColor,
                    animationDuration: '3s',
                  }} />
                )}
              </div>

              {/* Village nameplate */}
              <div className={`absolute left-1/2 -translate-x-1/2 mt-3 whitespace-nowrap transition-all duration-300 ${isHovered ? 'translate-y-1' : ''}`}>
                <div className="relative">
                  <div className={`bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-3 py-1.5 md:px-5 md:py-2 border-2 text-center transition-all duration-300 ${isHovered ? 'border-[#f8b800]' : 'border-gray-600'}`}
                    style={{ clipPath: 'polygon(8% 0%, 92% 0%, 100% 50%, 92% 100%, 8% 100%, 0% 50%)' }}
                  >
                    <p className="text-[6px] sm:text-[7px] md:text-[9px] font-bold tracking-wider">{location.name}</p>
                    <p className={`text-[5px] md:text-[6px] text-gray-400 mt-0.5 transition-all duration-300 overflow-hidden ${isHovered ? 'max-h-10 opacity-100' : 'max-h-0 opacity-0'}`}>
                      — {location.subtitle} —
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hero Character (walking) */}
      <div
        className="absolute z-25 pointer-events-none"
        style={{
          left: `${heroPos.x}%`,
          top: `${heroPos.y}%`,
          transform: `translate(-50%, -50%) scaleX(${facingRight ? 1 : -1})`,
          transition: isWalking ? 'left 1.2s ease-in-out, top 1.2s ease-in-out' : 'none',
        }}
      >
        <div className="relative">
          <Image
            src={isWalking ? "/images/char.gif" : "/images/hello.gif"}
            alt="Hero"
            width={100}
            height={100}
            className="object-contain w-14 sm:w-18 md:w-20 h-auto drop-shadow-lg"
          />
          {/* Character name tag */}
          {!isWalking && (
            <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <div className="bg-black/70 text-[#f8b800] text-[5px] md:text-[6px] px-2 py-0.5 rounded-sm border border-[#f8b800]/30">
                DUTA ★
              </div>
            </div>
          )}
          {/* Ground shadow */}
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-2 bg-black/25 rounded-full blur-sm" />
        </div>
      </div>

      {/* Clouds (on top of everything visual but below UI) */}
      <Cloud />

      {/* Bottom Status Bar */}
      <div className={`absolute bottom-3 left-1/2 -translate-x-1/2 z-30 transition-all duration-1000 delay-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white px-4 py-2 md:px-10 md:py-3 border-2 border-[#f8b800]/40 flex items-center gap-4 md:gap-8"
          style={{ clipPath: 'polygon(3% 0%, 97% 0%, 100% 50%, 97% 100%, 3% 100%, 0% 50%)' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-[8px] md:text-[10px] text-[#f8b800]">🎮</span>
            <span className="text-[5px] md:text-[7px] text-gray-300 tracking-wider">CLICK A VILLAGE</span>
          </div>
          <div className="w-px h-4 bg-[#f8b800]/30" />
          <div className="flex items-center gap-2">
            <span className="text-[8px] md:text-[10px] text-[#f8b800]">📍</span>
            <span className="text-[5px] md:text-[7px] tracking-wider" style={{ color: hoveredNode ? '#f8b800' : '#9ca3af' }}>
              {hoveredNode ? mapLocations.find(l => l.id === hoveredNode)?.name.toUpperCase() : 'HOVER TO PREVIEW'}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation Flash Effect */}
      {showFlash && (
        <div className="fixed inset-0 z-[100] bg-white animate-flashIn pointer-events-none" />
      )}
    </main>
  );
}
