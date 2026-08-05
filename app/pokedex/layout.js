'use client';

import { Outfit } from 'next/font/google';
import Image from 'next/image';
import { GameProvider } from '../components/GameProvider';
import Navbar from '../components/Navbar';
import Cloud from '../components/Cloud';
import PokemonFarm from '../components/PokemonFarm';
import HamburgerMenu from '../components/HamburgerMenu';
import Link from 'next/link';

const outfit = Outfit({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-outfit',
});

export default function PokedexLayout({ children }) {
  const menu = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Experience', href: '/experience' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Game', href: '/pokedex' },
    { label: 'Map', href: '/map' }
  ];

  return (
    <>
      {/* Portfolio Hamburger Navigation */}
      <HamburgerMenu menuItems={menu} />

      {/* Back to Home Button (Desktop) */}
      <Link href="/">
        <button className="hidden md:flex absolute top-6 left-6 z-50 px-4 py-2 bg-white border-4 border-black text-black text-xs font-pressStart hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer">
          &lt; Back
        </button>
      </Link>

      {/* Back to Home Button (Mobile) */}
      <Link href="/">
        <button className="flex md:hidden absolute top-4 left-4 z-50 px-3 py-2 bg-white border-3 border-black text-black text-[8px] font-pressStart shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer">
          ◀ Back
        </button>
      </Link>

      <div className={`${outfit.variable} font-sans relative w-screen h-screen bg-white flex flex-col items-center justify-center overflow-hidden`}>

      {/* Cloud Layers */}
      <Cloud top={30} direction="left" speed={120} opacity={0.5} delay={500} />
      <Cloud top={120} direction="right" speed={80} opacity={0.3} delay={500} />

      {/* Pokemon Farm walking at the background */}
      <PokemonFarm />

      {/* Game State Provider */}
      <GameProvider>
        {/* Floating Poké Ball Navbar */}
        <Navbar />
        
        {/* Content Viewport */}
        <div className="relative z-10 w-full h-full flex flex-col justify-center items-center p-0 m-0">
          {children}
        </div>
      </GameProvider>

      {/* Ground Image */}
      <div className="fixed bottom-0 left-0 w-full z-0 pointer-events-none">
        <Image
          src="/images/ground.png"
          alt="Ground Background"
          width={1920}
          height={200}
          className="w-full h-auto object-contain object-bottom"
          priority
        />
      </div>
    </div>
  </>
  );
}
