'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { experienceData } from '../data/experienceData';
import HamburgerMenu from '../components/HamburgerMenu';
import Cloud from '../components/Cloud';
import BackgroundAudio from '../components/Audio';
import FarmAnimals from '../components/FarmAnimals';

export default function ExperiencePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [expandedQuest, setExpandedQuest] = useState(0);

  // Flatten all experiences into a single array for the Gym Badges
  const allExperiences = experienceData.flatMap(year => 
    Object.values(year.sections).flat()
  );

  // Pokemon sprites for each experience
  const pokemonSprites = [
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/25.gif', // Pikachu
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/6.gif',  // Charizard
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/9.gif',  // Blastoise
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/3.gif',  // Venusaur
    'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/149.gif' // Dragonite
  ];

  const pokemonThemes = [
    {
      // Pikachu (Electric)
      buttonBg: 'bg-gradient-to-r from-yellow-400 to-yellow-500',
      buttonBorder: 'border-yellow-300',
      buttonShadow: 'shadow-[0_0_15px_rgba(250,204,21,0.6)]',
      textColor: 'text-yellow-600',
      divider: 'from-yellow-500 via-yellow-300',
      cardBg: 'from-yellow-100/90 to-white/60',
      cardBorder: 'border-yellow-400'
    },
    {
      // Charizard (Fire)
      buttonBg: 'bg-gradient-to-r from-red-500 to-orange-500',
      buttonBorder: 'border-orange-300',
      buttonShadow: 'shadow-[0_0_15px_rgba(239,68,68,0.6)]',
      textColor: 'text-red-600',
      divider: 'from-red-500 via-orange-400',
      cardBg: 'from-red-100/90 to-white/60',
      cardBorder: 'border-red-400'
    },
    {
      // Blastoise (Water)
      buttonBg: 'bg-gradient-to-r from-blue-500 to-cyan-500',
      buttonBorder: 'border-cyan-300',
      buttonShadow: 'shadow-[0_0_15px_rgba(59,130,246,0.6)]',
      textColor: 'text-blue-600',
      divider: 'from-blue-500 via-cyan-400',
      cardBg: 'from-blue-100/90 to-cyan-50/60',
      cardBorder: 'border-blue-400'
    },
    {
      // Venusaur (Grass)
      buttonBg: 'bg-gradient-to-r from-green-500 to-emerald-500',
      buttonBorder: 'border-emerald-300',
      buttonShadow: 'shadow-[0_0_15px_rgba(34,197,94,0.6)]',
      textColor: 'text-green-600',
      divider: 'from-green-500 via-emerald-400',
      cardBg: 'from-green-100/90 to-white/60',
      cardBorder: 'border-green-400'
    },
    {
      // Dragonite (Dragon/Flying)
      buttonBg: 'bg-gradient-to-r from-amber-500 to-orange-400',
      buttonBorder: 'border-amber-300',
      buttonShadow: 'shadow-[0_0_15px_rgba(245,158,11,0.6)]',
      textColor: 'text-amber-600',
      divider: 'from-amber-500 via-orange-300',
      cardBg: 'from-amber-100/90 to-orange-50/60',
      cardBorder: 'border-amber-400'
    }
  ];

  useEffect(() => {
    let timeout;
    
    const showPage = () => {
      timeout = setTimeout(() => setIsVisible(true), 500);
    };

    if (typeof window !== 'undefined') {
      if (!window.hasStarted) {
        window.addEventListener('audioPreferenceSet', showPage);
        return () => {
          window.removeEventListener('audioPreferenceSet', showPage);
          if (timeout) clearTimeout(timeout);
        };
      } else {
        timeout = setTimeout(() => setIsVisible(true), 2500);
      }
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, []);

  const menu = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Experience', href: '/experience' },
    { label: 'PORTFOLIO', href: '/portfolio' },
    { label: 'Map', href: '/map' }
  ];

  return (
    <div className="relative w-screen h-screen bg-white flex items-center justify-center overflow-hidden">
      <HamburgerMenu menuItems={menu} />
      
      {/* Back to Home Button (Desktop) */}
      <Link href="/about">
        <button className="hidden md:flex absolute top-6 left-6 z-50 px-4 py-2 bg-white/80 backdrop-blur-sm border-4 border-black text-black text-xs font-pressStart hover:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer">
          &lt; Back
        </button>
      </Link>
      <BackgroundAudio src="/audio/about.mp3" volume={0.15} delay={2500} className='fixed top-4 right-10 mr-4'/>
      
      <Cloud top={0} direction="left" speed={150} opacity={0.2} delay={2725} />
      <Cloud top={25} direction="right" speed={40} opacity={0.2} delay={2725} />
      <Cloud top={120} direction="left" speed={100} opacity={0.5} delay={2725} />
      <Cloud top={170} direction="left" speed={50} opacity={0.3} delay={2725} />
      <Cloud top={250} direction="right" speed={100} opacity={0.5} delay={2725} />

      <div className="absolute bottom-0 w-full z-0">
        <Image
          src="/images/ground.png"
          alt="Ground Background"
          width={1920}
          height={200}
          className="w-full h-auto object-contain"
          priority
        />
      </div>

      <FarmAnimals className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`} />

      {/* Wrapper for Title + Main Content to keep them together vertically centered */}
      <div className={`relative z-10 w-full max-w-5xl mx-auto flex flex-col transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        
        {/* Page Title */}
        <div className="w-full text-center mb-10 md:mb-14">
          <h1 className="font-pressStart text-lg md:text-2xl text-gray-900 drop-shadow-[2px_2px_0px_rgba(255,255,255,0.8)] tracking-wider">
            WORK EXPERIENCE
          </h1>
        </div>

        {/* Main Content - Panels */}
        <div className="w-full px-4 md:px-8 flex flex-col md:flex-row gap-4 md:gap-6 items-start">
        
        {/* Left Panel: Company List */}
        <div className="w-full md:w-[280px] shrink-0 mt-4 md:mt-0">
          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[420px] pb-2 md:pb-0 custom-scrollbar">
            {allExperiences.map((exp, idx) => (
              <button
                key={idx}
                onClick={() => setExpandedQuest(idx)}
                className={`relative overflow-hidden shrink-0 md:shrink text-left px-4 py-3 rounded-xl font-pressStart text-[8px] md:text-[9px] transition-all duration-300 border
                  ${expandedQuest === idx 
                    ? `${pokemonThemes[idx % pokemonThemes.length].buttonBg} text-white ${pokemonThemes[idx % pokemonThemes.length].buttonBorder} ${pokemonThemes[idx % pokemonThemes.length].buttonShadow} scale-[1.02] z-10` 
                    : 'bg-white/40 backdrop-blur-md text-gray-800 border-white/60 hover:bg-white/60 hover:scale-[1.02] hover:shadow-lg z-0'}`}
              >
                <span className="leading-snug">{exp.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel: Experience Detail Card */}
        {expandedQuest !== null && (
          <div key={expandedQuest} className="flex-1 min-w-0 animate-in slide-in-from-right-4 fade-in duration-300">
            
            {/* Holographic Glass Card */}
            <div className={`backdrop-blur-2xl rounded-2xl border border-white/60 shadow-[0_8px_32px_rgba(31,38,135,0.25)] bg-gradient-to-br ${pokemonThemes[expandedQuest % pokemonThemes.length].cardBg} p-5 md:p-7 relative overflow-hidden h-[380px] md:h-[460px] flex flex-col mx-2 md:mx-0 transition-colors duration-500`}>
              
              {/* Pokemon Sprite - Floating freely */}
              <div className="absolute top-6 right-2 md:top-8 md:right-6 w-28 h-28 md:w-36 md:h-36 z-20 flex items-center justify-center">
                <img 
                  src={pokemonSprites[expandedQuest % pokemonSprites.length]} 
                  alt="Pokemon Sprite" 
                  className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]"
                />
              </div>

              {/* Header */}
              <div className="pr-28 md:pr-32 mb-6">
                <h2 className="font-pressStart text-[12px] md:text-[15px] text-gray-900 leading-relaxed">
                  {allExperiences[expandedQuest].title}
                </h2>
                <p className={`font-sans font-bold text-sm md:text-base mt-2 ${pokemonThemes[expandedQuest % pokemonThemes.length].textColor}`}>
                  {allExperiences[expandedQuest].position}
                </p>
                <p className="font-sans text-xs md:text-sm font-medium text-gray-600 mt-1 flex items-center gap-1.5">
                  {allExperiences[expandedQuest].date} <span className="opacity-50">·</span> {allExperiences[expandedQuest].location}
                </p>
              </div>

              {/* Description Scroll Area */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {allExperiences[expandedQuest].description.map((desc, i) => (
                  <div key={i} className={`mb-2 ${i === 0 ? 'md:pr-36' : ''}`}>
                    <p className="font-pressStart text-[8px] md:text-[9px] text-gray-800 mb-2 leading-loose">
                      {desc.subtitle}
                    </p>
                    <p className="font-sans text-[12px] md:text-[14px] text-gray-700 leading-relaxed">
                      {desc.subdesc}
                    </p>
                  </div>
                ))}
                
                {/* Skills section removed per user request */}
              </div>
            </div>
          </div>
        )}
        </div>
        {/* Navigation Buttons at bottom (Mobile Only) */}
        <div className="flex md:hidden justify-center gap-4 w-full px-4 mt-6 z-20">
          <Link href="/about" className="flex-1">
            <button className="w-full px-2 py-3 bg-white/80 backdrop-blur-sm border-4 border-black text-black text-[10px] font-pressStart hover:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer text-center rounded-lg">
              ◀ Back
            </button>
          </Link>
          <Link href="/portfolio" className="flex-1">
            <button className="w-full px-2 py-3 bg-[#f8b800]/90 backdrop-blur-sm border-4 border-black text-black text-[10px] font-pressStart hover:bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer text-center rounded-lg">
              Portfolio ▶
            </button>
          </Link>
        </div>
      </div>

      {/* Desktop Navigation Button (Next to Portfolio) */}
      <div className={`hidden md:flex absolute right-16 md:right-20 top-6 z-50 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}>
        <Link href="/portfolio">
          <button className="px-4 py-2 bg-[#f8b800]/90 backdrop-blur-sm border-4 border-black text-black text-xs font-pressStart hover:bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer">
            Portfolio &gt;
          </button>
        </Link>
      </div>
    </div>
  );
}
