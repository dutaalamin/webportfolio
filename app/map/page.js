'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import HamburgerMenu from '../components/HamburgerMenu';
import BackgroundAudio from '../components/Audio';

const mapLocations = [
  {
    id: 'home',
    name: 'Gerbang Konoha',
    subtitle: 'Main Gate',
    icon: '⛩️',
    href: '/',
    // Position as percentage of map container
    x: 15,
    y: 70,
    description: 'The entrance to the village',
    color: '#c0392b',
  },
  {
    id: 'about',
    name: 'Akademi Ninja',
    subtitle: 'About / Story',
    icon: '📜',
    href: '/transition',
    x: 35,
    y: 35,
    description: 'Where the story begins',
    color: '#2980b9',
  },
  {
    id: 'experience',
    name: 'Arena Chūnin',
    subtitle: 'Experience',
    icon: '⚔️',
    href: '/experience',
    x: 65,
    y: 25,
    description: 'Battle records & quests',
    color: '#8e44ad',
  },
  {
    id: 'portfolio',
    name: 'Gedung Hokage',
    subtitle: 'Portfolio',
    icon: '🏯',
    href: '/portfolio',
    x: 80,
    y: 60,
    description: 'Sacred scroll collection',
    color: '#d35400',
  },
  {
    id: 'message',
    name: 'Kedai Ichiraku',
    subtitle: 'Message',
    icon: '🍜',
    href: '/message',
    x: 50,
    y: 75,
    description: 'Drop a message over ramen',
    color: '#27ae60',
  },
];

// Define path connections between nodes
const pathConnections = [
  { from: 'home', to: 'about' },
  { from: 'about', to: 'experience' },
  { from: 'experience', to: 'portfolio' },
  { from: 'portfolio', to: 'message' },
  { from: 'message', to: 'home' },
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
      rotation: Math.random() * 360,
    }));
  }, []);

  return (
    <>
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
    </>
  );
}

export default function MapPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredNode, setHoveredNode] = useState(null);
  const [heroPos, setHeroPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 500);
    return () => clearTimeout(timeout);
  }, []);

  // Move hero to hovered node
  useEffect(() => {
    if (hoveredNode) {
      const node = mapLocations.find((l) => l.id === hoveredNode);
      if (node) {
        setHeroPos({ x: node.x, y: node.y - 12 });
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

  // Get position for node by ID
  const getNodePos = (id) => {
    const node = mapLocations.find((n) => n.id === id);
    return node ? { x: node.x, y: node.y } : { x: 0, y: 0 };
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden font-pressStart select-none">
      <HamburgerMenu menuItems={menu} />
      <BackgroundAudio src="/audio/experience.mp3" volume={0.15} delay={1000} className="fixed top-4 right-16 z-40" />

      {/* === MAP BACKGROUND === */}
      <div className="absolute inset-0 z-0">
        {/* Sky gradient */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, #87CEEB 0%, #B0E0E6 30%, #98D8C8 50%, #7CB342 65%, #558B2F 80%, #33691E 100%)',
          }}
        />

        {/* Mountain silhouettes */}
        <svg className="absolute bottom-[30%] w-full h-[40%] opacity-30" viewBox="0 0 1200 400" preserveAspectRatio="none">
          <polygon points="0,400 100,150 200,280 350,80 500,220 600,100 750,250 900,50 1050,200 1200,120 1200,400" fill="#2E7D32" />
          <polygon points="0,400 150,200 300,320 450,130 600,270 800,160 950,300 1100,180 1200,250 1200,400" fill="#1B5E20" opacity="0.6" />
        </svg>

        {/* Village ground */}
        <div
          className="absolute bottom-0 w-full h-[45%]"
          style={{
            background: 'linear-gradient(180deg, #8BC34A 0%, #689F38 20%, #558B2F 50%, #4E342E 80%, #3E2723 100%)',
          }}
        />

        {/* Water/river */}
        <svg className="absolute bottom-[15%] w-full h-[12%] opacity-40" viewBox="0 0 1200 100" preserveAspectRatio="none">
          <path d="M0,50 Q150,20 300,50 T600,50 T900,50 T1200,50 L1200,100 L0,100 Z" fill="#1565C0" opacity="0.5" />
          <path d="M0,60 Q100,35 250,60 T550,55 T850,60 T1200,55 L1200,100 L0,100 Z" fill="#0D47A1" opacity="0.3" />
        </svg>

        {/* Pixel trees scattered */}
        {[10, 25, 45, 60, 75, 88].map((x, i) => (
          <div
            key={i}
            className="absolute z-[1]"
            style={{
              left: `${x}%`,
              bottom: `${32 + (i % 3) * 5}%`,
              opacity: 0.5 + (i % 3) * 0.15,
            }}
          >
            <svg width="30" height="45" viewBox="0 0 30 45">
              <rect x="12" y="25" width="6" height="20" fill="#5D4037" />
              <polygon points="15,0 0,25 30,25" fill="#2E7D32" />
              <polygon points="15,8 3,28 27,28" fill="#388E3C" />
            </svg>
          </div>
        ))}

        {/* Fog/clouds drifting across map */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              top: `${10 + i * 8}%`,
              width: `${200 + i * 80}px`,
              height: `${30 + i * 10}px`,
              background: 'radial-gradient(ellipse, rgba(255,255,255,0.2), transparent)',
              animation: `map-cloud-drift ${20 + i * 5}s linear infinite`,
              animationDelay: `${i * 4}s`,
            }}
          />
        ))}
      </div>

      {/* === SVG PATHS CONNECTING NODES === */}
      <svg className="absolute inset-0 z-10 w-full h-full pointer-events-none">
        {pathConnections.map((path, i) => {
          const from = getNodePos(path.from);
          const to = getNodePos(path.to);
          const isActive = hoveredNode === path.from || hoveredNode === path.to;

          // Calculate midpoint with slight curve offset
          const midX = (from.x + to.x) / 2;
          const midY = (from.y + to.y) / 2 - 3;

          return (
            <g key={i}>
              {/* Path shadow */}
              <path
                d={`M ${from.x}% ${from.y}% Q ${midX}% ${midY}% ${to.x}% ${to.y}%`}
                fill="none"
                stroke="rgba(0,0,0,0.3)"
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="12 8"
                style={{ transform: 'translate(2px, 2px)' }}
              />
              {/* Main path */}
              <path
                d={`M ${from.x}% ${from.y}% Q ${midX}% ${midY}% ${to.x}% ${to.y}%`}
                fill="none"
                stroke={isActive ? '#e74c3c' : '#8B4513'}
                strokeWidth="5"
                strokeLinecap="round"
                strokeDasharray="12 8"
                className={isActive ? 'map-path-active' : ''}
                style={{
                  transition: 'stroke 0.3s ease',
                }}
              />
            </g>
          );
        })}
      </svg>

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
        <div className="relative w-14 h-14 md:w-20 md:h-20">
          <Image src="/images/hero2.gif" alt="Hero" fill className="object-contain drop-shadow-lg" />
        </div>
      </div>

      {/* === MAP LOCATION NODES === */}
      {mapLocations.map((loc, i) => {
        const isHovered = hoveredNode === loc.id;

        return (
          <div
            key={loc.id}
            className={`absolute z-20 flex flex-col items-center cursor-pointer transition-all duration-500 ease-out ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
            }`}
            style={{
              left: `${loc.x}%`,
              top: `${loc.y}%`,
              transform: 'translate(-50%, -50%)',
              transitionDelay: `${i * 150 + 300}ms`,
            }}
            onMouseEnter={() => setHoveredNode(loc.id)}
            onMouseLeave={() => setHoveredNode(null)}
            onClick={() => router.push(loc.href)}
          >
            {/* Tooltip (on hover) */}
            <div
              className={`absolute -top-20 md:-top-24 bg-black/90 text-white px-3 py-2 rounded-lg border-2 border-white/30 whitespace-nowrap transition-all duration-300 ${
                isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-90'
              }`}
              style={{ pointerEvents: 'none' }}
            >
              <p className="text-[8px] md:text-[10px] font-bold">{loc.name}</p>
              <p className="text-[6px] md:text-[8px] text-gray-300">{loc.description}</p>
              {/* Triangle pointer */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-transparent border-t-black/90" />
            </div>

            {/* Node circle */}
            <div
              className={`relative w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center border-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 map-node-hover ${
                isHovered
                  ? 'border-white scale-110 shadow-[0_0_20px_rgba(255,200,50,0.6)]'
                  : 'border-black/60 map-node-idle'
              }`}
              style={{
                background: isHovered
                  ? `radial-gradient(circle, ${loc.color}ee, ${loc.color}aa)`
                  : `radial-gradient(circle, ${loc.color}cc, ${loc.color}88)`,
                animationDelay: `${i * 0.5}s`,
              }}
            >
              <span className="text-2xl md:text-3xl">{loc.icon}</span>

              {/* Glow ring on hover */}
              {isHovered && (
                <div
                  className="absolute inset-[-4px] rounded-full border-2 border-yellow-300/60 animate-ping"
                  style={{ animationDuration: '1.5s' }}
                />
              )}
            </div>

            {/* Location label */}
            <div
              className={`mt-2 bg-white/90 border-2 border-black px-2 py-1 rounded shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 ${
                isHovered ? 'bg-[#f8b800] scale-105' : ''
              }`}
            >
              <p className="text-[7px] md:text-[9px] text-black font-bold text-center whitespace-nowrap">{loc.subtitle}</p>
            </div>
          </div>
        );
      })}

      {/* === FALLING LEAVES === */}
      <FallingLeaves />

      {/* === MAP TITLE === */}
      <div
        className={`absolute top-4 left-4 md:top-6 md:left-6 z-30 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
        }`}
      >
        <div className="bg-[#f5edd6] border-4 border-[#8b7332] rounded-lg px-3 py-2 md:px-5 md:py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <h1 className="text-[10px] md:text-sm text-[#4a3728] font-bold">🍥 VILLAGE MAP</h1>
          <p className="text-[6px] md:text-[8px] text-[#8b7332] mt-0.5">Select a location</p>
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
