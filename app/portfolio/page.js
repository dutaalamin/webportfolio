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

export default function PortfolioPage() {
  const [visibleCount, setVisibleCount] = useState(4);
  const [isVisible, setIsVisible] = useState(false);

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
    <div className="relative w-screen h-screen bg-white flex items-center justify-center overflow-hidden">
      <HamburgerMenu menuItems={menu} />
      
      {/* Back to Home Button (Desktop) */}
      <Link href="/">
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
          <h1 className="font-pressStart text-black text-base md:text-lg drop-shadow-sm">MY COLLECTION</h1>
          <p className="text-gray-500 font-sans text-[10px] md:text-xs mt-1">{allProjects.length} cards • tap to flip</p>
        </div>

        <div className={`relative h-[450px] md:h-[500px] px-2 md:px-6 py-2 overflow-y-auto transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 mb-8 justify-items-center">
            {visibleProjects.map((item, index) => (
              <TradingCard key={index} item={item} index={index} />
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
      </div>
    </div>
  );
}
