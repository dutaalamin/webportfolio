'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { aboutPages } from '../data/aboutData';
import HamburgerMenu from '../components/HamburgerMenu';
import Cloud from '../components/Cloud';
import BackgroundAudio from '../components/Audio';
import FarmAnimals from '../components/FarmAnimals';

export default function AboutPage() {

  const [page, setPage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const current = aboutPages[page];
  const isLastPage = page === aboutPages.length - 1;

  const menu = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Experience', href: '/experience' },
    { label: 'Portfolio', href: '/porto' }
  ];

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 2500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="relative w-screen h-screen bg-white flex items-center justify-center overflow-hidden">
      <HamburgerMenu menuItems={menu} />
      
      {/* Back to Home Button (Desktop) */}
      <Link href="/">
        <button className="hidden md:flex absolute top-6 left-6 z-50 text-gray-400 hover:text-black transition-colors font-pressStart text-xs items-center justify-center cursor-pointer">
          &lt; Back
        </button>
      </Link>
      <BackgroundAudio src="/audio/experience.mp3" volume={0.15} delay={2500} className='fixed top-4 right-10 mr-4'/>
      
      <Cloud top={10} direction="left" speed={150} opacity={0.2} delay={2725}/>
      <Cloud top={40} direction="right" speed={40} opacity={0.2} delay={2725}/>
      <Cloud top={150} direction="right" speed={100} opacity={0.3} delay={2725}/>
      <Cloud top={100} direction="left" speed={30} opacity={0.4} delay={2725}/> 
      <Cloud top={200} direction="right" speed={200} opacity={0.5} delay={2725}/>
      <Cloud top={250} direction="left" speed={150} opacity={0.5} delay={2725}/>     

      {/* City Background */}
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

      {/* Main Container */}
      <div
        className={`relative z-20 w-[90%] max-w-screen-md min-h-[550px] h-auto bg-transparent p-6 flex flex-col transition-all duration-700 ease-out transform
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >
        {/* Top Navigation */}
        <div className="absolute top-4 left-4 flex gap-4">
          <button
            onClick={() => setPage((prev) => Math.max(0, prev - 1))}
            disabled={page === 0}
            className="text-lg cursor-pointer text-gray-400 hover:text-black font-pressStart disabled:opacity-30"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((prev) => Math.min(aboutPages.length - 1, prev + 1))}
            disabled={isLastPage}
            className="text-lg cursor-pointer text-gray-400 hover:text-black font-pressStart disabled:opacity-30"
          >
            Next
          </button>
        </div>

        {/* Next Stage Button */}
        {isLastPage && (
          <div className="absolute top-4 right-4">
            <Link href="/experience">
              <button className="text-lg cursor-pointer text-gray-400 hover:text-black font-pressStart disabled:opacity-30">
                Experience ▶
              </button>
            </Link>
          </div>
        )}

        {/* Scrollable Content */}
        <div className="mt-12 flex-1 pr-2">
          <div className={`flex flex-col sm:flex-row ${current.photoPosition === 'right' ? 'sm:flex-row-reverse' : ''} items-start gap-6`}>
            {current.photoSrc && (
              <Image
                src={current.photoSrc}
                alt="Section Image"
                width={current.photoSize?.width || 120}
                height={current.photoSize?.height || 120}
                className="rounded-lg mx-auto sm:mx-0"
              />
            )}
            <div className="flex-1 text-sm">{current.content}</div>
          </div>

          {current.info && (
            <div className="mt-4 text-sm">{current.info}</div>
          )}
        </div>
      </div>
    </div>
  );
}
