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

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 2500);
    return () => clearTimeout(timeout);
  }, []);

  const menu = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Experience', href: '/experience' },
    { label: 'Portfolio', href: '/portfolio' }
  ];

  return (
    <div className="relative w-screen h-screen bg-gradient-to-b from-blue-200 to-blue-50 flex items-center justify-center overflow-hidden">
      <HamburgerMenu menuItems={menu} />
      
      {/* Back to Home Button (Desktop) */}
      <Link href="/">
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

      {/* Page Title */}
      <div className={`absolute top-20 md:top-16 left-0 w-full text-center z-20 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'}`}>
        <h1 className="font-pressStart text-lg md:text-2xl text-gray-900 drop-shadow-[2px_2px_0px_rgba(255,255,255,0.8)] tracking-wider">
          WORK EXPERIENCE
        </h1>
      </div>

      {/* Main Content - Floating over background */}
      <div className={`relative z-10 w-full max-w-5xl mx-auto px-4 md:px-8 flex flex-col md:flex-row gap-4 md:gap-6 items-start transition-all duration-700 ease-out transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        style={{ marginTop: '-20px' }}
      >
        
        {/* Left Panel: Company List */}
        <div className="w-full md:w-[280px] shrink-0 mt-4 md:mt-0">
          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[420px] pb-2 md:pb-0 custom-scrollbar">
            {allExperiences.map((exp, idx) => (
              <button
                key={idx}
                onClick={() => setExpandedQuest(idx)}
                className={`shrink-0 md:shrink text-left px-3 py-3 rounded-md font-pressStart text-[8px] md:text-[9px] transition-all duration-200 border-[4px] border-[#fbcd27] shadow-[0_0_0_2px_#111827,inset_0_0_0_2px_#111827]
                  ${expandedQuest === idx 
                    ? 'bg-red-600 text-white scale-[1.02] z-10' 
                    : 'bg-black/70 backdrop-blur-md text-gray-200 hover:bg-black/90 hover:scale-[1.02] z-0'}`}
              >
                <span className="leading-snug">{exp.title}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right Panel: Experience Detail Card */}
        {expandedQuest !== null && (
          <div key={expandedQuest} className="flex-1 min-w-0 animate-in slide-in-from-right-4 fade-in duration-300">
            
            {/* Glass Card */}
            <div className="bg-black/80 backdrop-blur-xl rounded-xl border-[12px] border-[#fbcd27] shadow-[0_0_0_4px_#111827,inset_0_0_0_4px_#111827] p-5 md:p-7 relative overflow-hidden h-[380px] md:h-[460px] flex flex-col mx-2 md:mx-0">
              
              {/* Pokemon Sprite - Floating in top right */}
              <div className="absolute top-4 right-4 w-20 h-20 md:w-28 md:h-28 z-20">
                <img 
                  src={pokemonSprites[expandedQuest % pokemonSprites.length]} 
                  alt="Pokemon Sprite" 
                  className="w-full h-full object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)] animate-bounce"
                  style={{ animationDuration: '3s' }}
                />
              </div>

              {/* Header */}
              <div className="pr-20 md:pr-32 mb-4">
                <h2 className="font-pressStart text-[12px] md:text-[15px] text-white leading-relaxed">
                  {allExperiences[expandedQuest].title}
                </h2>
                <p className="font-sans font-bold text-sm md:text-base text-red-400 mt-2">
                  {allExperiences[expandedQuest].position}
                </p>
                <p className="font-pressStart text-[7px] md:text-[8px] text-gray-300 mt-2 tracking-wider">
                  {allExperiences[expandedQuest].date} · {allExperiences[expandedQuest].location}
                </p>
              </div>

              {/* Divider */}
              <div className="w-full h-[2px] bg-gradient-to-r from-red-500 via-red-300 to-transparent mb-4"></div>

              {/* Description Scroll Area */}
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {allExperiences[expandedQuest].description.map((desc, i) => (
                  <div key={i} className="mb-2">
                    <p className="font-pressStart text-[8px] md:text-[9px] text-gray-200 mb-2 leading-loose">
                      {desc.subtitle}
                    </p>
                    <p className="font-sans text-[12px] md:text-[14px] text-gray-300 leading-relaxed">
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
      <div className={`absolute bottom-16 left-0 right-0 flex md:hidden justify-center gap-4 w-[90%] mx-auto z-20 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <Link href="/about" className="flex-1">
          <button className="w-full px-2 py-3 bg-white/80 backdrop-blur-sm border-4 border-black text-black text-[10px] font-pressStart hover:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer text-center rounded-lg">
            ◀ Back
          </button>
        </Link>
        <Link href="/portfolio" className="flex-1">
          <button className="w-full px-2 py-3 bg-[#f8b800]/90 backdrop-blur-sm border-4 border-black text-black text-[10px] font-pressStart hover:bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer text-center rounded-lg">
            Next ▶
          </button>
        </Link>
      </div>
    </div>
  );
}
