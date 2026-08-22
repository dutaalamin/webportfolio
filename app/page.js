'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Cloud from './components/Cloud'
import BackgroundAudio from './components/Audio'

import HamburgerMenu from './components/HamburgerMenu';
import FarmAnimals from './components/FarmAnimals';
import RoleRotate from './components/RoleRotate';
import Typewriter from './components/Typewriter';

import {
  DocumentIcon,
  GlobeAltIcon,
  CodeBracketIcon,
  LinkIcon
} from '@heroicons/react/24/solid'



export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 2000)
    return () => clearTimeout(timeout)
  }, [])

  const fadeClass = (delay = 0) =>
    `${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700 ease-out`

  const fadeStyle = (delay = 0) => ({ transitionDelay: `${delay}ms` })

  const menu = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Experience', href: '/experience' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Game', href: '/pokedex' },
    { label: 'Map', href: '/map' },
  ];

  return (
    <main className="relative w-full min-h-screen bg-white text-black font-pressStart overflow-hidden">
      
      {/* Top Left Minimap Button */}
      <Link href="/map">
        <div className="fixed top-4 md:top-6 left-4 md:left-6 z-50 group cursor-pointer flex flex-col items-center">
          {/* Minimap Box */}
          <div className="w-12 h-12 md:w-32 md:h-32 border-2 md:border-4 border-[#4a3728] rounded-md md:rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] md:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden relative group-hover:translate-y-1 group-hover:translate-x-1 group-hover:shadow-none transition-all bg-[#a3c48e]">
            {/* We scale the map image up so it looks like a zoomed-in minimap */}
            <Image src="/images/konoha_map_hd.png" alt="Mini Map" fill className="object-cover scale-[2.5] origin-center" />
            
            {/* Radar / Grid effect overlay */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-30 pointer-events-none" />
            
            {/* Blinking Player Dot */}
            <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 md:w-3 md:h-3 bg-red-500 rounded-full animate-ping -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-1.5 h-1.5 md:w-3 md:h-3 bg-red-500 border border-white md:border-2 rounded-full -translate-x-1/2 -translate-y-1/2" />
            
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all pointer-events-none" />
          </div>
          
          {/* Label below (Hidden on Mobile) */}
          <div className="mt-1 md:mt-2 text-center group-hover:translate-y-1 transition-transform hidden md:block">
            <span className="bg-black text-[#f8b800] px-2 py-1 text-[7px] md:text-[9px] font-pressStart shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              MINIMAP
            </span>
          </div>
        </div>
      </Link>

      <HamburgerMenu menuItems={menu} />
      <BackgroundAudio
        src="/audio/home.mp3"
        volume={0.15}
        delay={0}
        className="fixed right-4 top-16 md:right-4 md:top-4 z-50"
      />

      {/* Cloud Layers */}
      <Cloud top={30} direction="left" speed={120} opacity={0.5} delay={2100} />
      <Cloud top={80} direction="right" speed={50} opacity={0.3} delay={2100} />

      {/* Animals Farm */}
      <FarmAnimals className={fadeClass(600)} style={fadeStyle(600)} />

      {/* Content */}
      <div className={`relative z-5 max-w-7xl mx-auto pt-24 lg:pt-28 px-6 grid gap-8 grid-cols-1 lg:grid-cols-3 ${fadeClass(900)}`} style={fadeStyle(900)}>
        <div className="flex flex-col gap-2">
          <RoleRotate />

          
          <div className="mt-8 relative w-48 h-48 sm:w-64 sm:h-64 self-center md:self-start md:ml-12">
            <Image 
              src="/images/hello.gif" 
              alt="Hero Greeting" 
              fill
              className="object-contain drop-shadow-md"
            />
          </div>
        </div>
        
        <div className="lg:pl-20 lg:col-span-2 mt-4 lg:mt-0">
          <div className="px-8 pb-8 inline-block">
            <p className="text-xl sm:text-2xl xl:text-4xl mb-4 text-black min-h-[32px] xl:min-h-[40px]">
              <Typewriter text="Welcome, Player!" delay={2500} speed={40} />
            </p>
            <p className="text-sm sm:text-lg xl:text-2xl pb-6 text-black leading-relaxed min-h-[60px] xl:min-h-[80px]">
              <Typewriter text={"Ready to embark on a journey through the quests?"} delay={3400} speed={30} />
            </p>
            <p className="text-sm sm:text-lg xl:text-2xl mb-8 text-black leading-relaxed min-h-[60px] xl:min-h-[80px]">
              <Typewriter text={"Choose your stage and begin the adventure!"} delay={4600} speed={30} />
            </p>
            
            <div className="space-y-6 mt-4">
              <Link href="/transition">
                <p className="text-gray-300 hover:text-black transition-all duration-300 cursor-pointer text-xl sm:text-2xl font-pressStart">
                  &gt; About
                </p>
              </Link>
              <Link href="/experience">
                <p className="text-gray-300 hover:text-black transition-all duration-300 cursor-pointer text-xl sm:text-2xl font-pressStart">
                  &gt; Experience
                </p>
              </Link>
              <Link href="/portfolio">
                <p className="text-gray-300 hover:text-black transition-all duration-300 cursor-pointer text-xl sm:text-2xl font-pressStart">
                  &gt; Portfolio
                </p>
              </Link>
              <Link href="/pokedex">
                <p className="text-gray-300 hover:text-black transition-all duration-300 cursor-pointer text-xl sm:text-2xl font-pressStart">
                  &gt; Game
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Ground */}
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
    </main>
  )
}