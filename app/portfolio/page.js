'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { portoData } from '../data/portoData';
import HamburgerMenu from '../components/HamburgerMenu';
import Cloud from '../components/Cloud';
import BackgroundAudio from '../components/Audio';
import FarmAnimals from '../components/FarmAnimals';
import TradingCard from '../components/TradingCard';
import PokeCard from '../components/PokeCard';

export default function PortfolioPage() {
  const [visibleCount, setVisibleCount] = useState(4);
  const [isVisible, setIsVisible] = useState(false);
  const [cardTheme, setCardTheme] = useState('pokemon');

  const allProjects = portoData.reduce((acc, currentYear) => {
    Object.values(currentYear.sections).forEach(items => {
      acc.push(...items);
    });
    return acc;
  }, []);

  const visibleProjects = allProjects.slice(0, visibleCount);

  const handleViewMore = () => {
    setVisibleCount(allProjects.length);
  };

  const toggleTheme = () => {
    setCardTheme(prev => prev === 'yugioh' ? 'pokemon' : 'yugioh');
  };

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
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Game', href: '/pokedex' },
    { label: 'Map', href: '/map' }
  ];

  return (
    <div className="relative w-screen h-screen bg-white flex items-center justify-center overflow-hidden">
      <HamburgerMenu menuItems={menu} />
      
      {/* Back to Home Button (Desktop) */}
      <Link href="/experience">
        <button className="hidden md:flex absolute top-6 left-6 z-50 px-4 py-2 bg-white border-4 border-black text-black text-xs font-pressStart hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer">
          &lt; Back
        </button>
      </Link>

      {/* Message Button (Top Right) */}
      <Link href="/message">
        <button className="hidden md:flex absolute top-6 right-20 z-50 px-4 py-2 bg-[#f8b800] border-4 border-black text-black text-xs font-pressStart hover:bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer">
          MESSAGE
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

      <div className={`relative z-20 w-[95%] max-w-screen-lg flex flex-col items-stretch bg-transparent overflow-hidden transition-all duration-700 ease-out transform
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >
        {/* Header */}
        <div className={`text-center pt-2 pb-4 transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <div className="flex justify-center mb-4 relative z-50">
            <div className="flex bg-gray-200 border-2 border-black rounded-lg p-1">
              <button 
                onClick={() => setCardTheme('pokemon')}
                className={`px-3 py-1.5 md:px-4 md:py-2 text-[7px] md:text-[9px] font-pressStart rounded transition-all ${cardTheme === 'pokemon' ? 'bg-blue-500 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-white' : 'text-gray-500 hover:text-black border-2 border-transparent'}`}
              >
                POKÉMON
              </button>
              <button 
                onClick={() => setCardTheme('yugioh')}
                className={`px-3 py-1.5 md:px-4 md:py-2 text-[7px] md:text-[9px] font-pressStart rounded transition-all ml-1 ${cardTheme === 'yugioh' ? 'bg-[#f8b800] border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-black' : 'text-gray-500 hover:text-black border-2 border-transparent'}`}
              >
                YU-GI-OH!
              </button>
            </div>
          </div>
          <h1 className="font-pressStart text-black text-base md:text-lg drop-shadow-sm">MY COLLECTION</h1>
          <p className="text-gray-500 font-sans text-[10px] md:text-xs mt-1">{allProjects.length} cards • tap to flip</p>
        </div>

        <div className={`relative h-[450px] md:h-auto md:max-h-[65vh] px-2 md:px-6 py-2 overflow-y-auto transition-all duration-700 ease-out hide-scroll
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          <style dangerouslySetInnerHTML={{__html: `
            .hide-scroll::-webkit-scrollbar { display: none; }
          `}} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 justify-items-center">
            {visibleProjects.map((project, index) => (
              <div key={index} className="w-full flex justify-center">
                {cardTheme === 'yugioh' ? (
                  <TradingCard item={project} index={index} isVisible={isVisible} />
                ) : (
                  <PokeCard item={project} index={index} isVisible={isVisible} />
                )}
              </div>
            ))}
          </div>

          {visibleCount < allProjects.length ? (
            <div className="flex justify-center pb-8 pt-4">
              <button
                onClick={handleViewMore}
                className="px-6 py-3 bg-[#f8b800] border-4 border-black text-black text-[10px] md:text-xs font-pressStart hover:bg-yellow-400 active:translate-y-1 active:shadow-none transition-all cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce"
              >
                OPEN MORE PACKS ▼
              </button>
            </div>
          ) : (
            <div className="flex justify-center pb-8 pt-4">
              <button
                onClick={() => {
                  setVisibleCount(4);
                  document.querySelector('.overflow-y-auto').scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="px-6 py-3 bg-white border-4 border-black text-black text-[10px] md:text-xs font-pressStart hover:bg-gray-200 active:translate-y-1 active:shadow-none transition-all cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                SHOW LESS PACKS ▲
              </button>
            </div>
          )}
        </div>

        {/* Mobile Navigation Buttons at bottom */}
        <div className="flex md:hidden justify-center gap-4 w-full mt-4 pb-4 px-2 z-20">
          <Link href="/experience" className="flex-1">
            <button className="w-full px-2 py-3 bg-white/80 backdrop-blur-sm border-4 border-black text-black text-[10px] font-pressStart hover:bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer text-center rounded-lg">
              ◀ Back
            </button>
          </Link>
          <Link href="/message" className="flex-1">
            <button className="w-full px-2 py-3 bg-[#f8b800]/90 backdrop-blur-sm border-4 border-black text-black text-[10px] font-pressStart hover:bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer text-center rounded-lg">
              Message ▶
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
