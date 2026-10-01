'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import HamburgerMenu from './components/HamburgerMenu'
import Cloud from './components/Cloud'
import BackgroundAudio from './components/Audio'
import FarmAnimals from './components/FarmAnimals'

const menu = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Experience', href: '/experience' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Game', href: '/pokedex' },
  { label: 'Map', href: '/map' },
]

// Glitchy "MISSINGNO." text effect — flickers between a few characters
const GLITCH_CHARS = ['M', 'I', 'S', 'S', 'I', 'N', 'G', 'N', 'O', '.', '?']
function useGlitchText(base = 'MISSINGNO.', intervalMs = 120) {
  const [text, setText] = useState(base)
  useEffect(() => {
    const id = setInterval(() => {
      const arr = base.split('').map((ch, i) => {
        // ~20% chance to swap a character for a glitchy one
        if (ch !== ' ' && Math.random() < 0.2) {
          return GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)]
        }
        return ch
      })
      setText(arr.join(''))
    }, intervalMs)
    return () => clearInterval(id)
  }, [base, intervalMs])
  return text
}

export default function NotFound() {
  const [isVisible, setIsVisible] = useState(false)
  const glitch = useGlitchText('MISSINGNO.')

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <main className="relative w-full min-h-screen bg-white text-black font-pressStart overflow-hidden flex flex-col items-center justify-center">
      <HamburgerMenu menuItems={menu} />
      <BackgroundAudio
        src="/audio/home.mp3"
        volume={0.15}
        delay={0}
        className="fixed right-4 top-16 md:right-4 md:top-4 z-50"
      />

      {/* Cloud Layers */}
      <Cloud top={30} direction="left" speed={120} opacity={0.5} delay={300} />
      <Cloud top={80} direction="right" speed={50} opacity={0.3} delay={300} />

      {/* Animals Farm */}
      <FarmAnimals
        className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`}
      />

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

      {/* Glitch overlay blocks for that classic Pokemon glitch vibe */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="absolute bg-black/80"
            style={{
              left: `${(i * 17 + 5) % 90}%`,
              top: `${(i * 23 + 10) % 70}%`,
              width: `${20 + ((i * 7) % 40)}px`,
              height: `${4 + ((i * 3) % 8)}px`,
              opacity: 0.15 + ((i % 3) * 0.1),
              animation: `glitch-flicker ${1.5 + (i % 3) * 0.7}s steps(2) infinite`,
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div
        className={`relative z-20 flex flex-col items-center text-center px-6 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        {/* Wild encounter banner */}
        <div className="mb-6 px-4 py-2 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <p className="text-[10px] md:text-xs text-black animate-pulse">
            ⚠ WILD <span className="text-red-600">{glitch}</span> APPEARED!
          </p>
        </div>

        {/* Big 404 */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl text-black leading-none mb-4 select-none">
          4<span className="text-red-600 inline-block animate-bounce">0</span>4
        </h1>

        {/* Glitchy sprite placeholder (pixel block) */}
        <div className="relative w-28 h-28 md:w-36 md:h-36 mb-6 border-4 border-black bg-[#a3c48e] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          {/* Pixel-art style "missingno" block pattern */}
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
            {Array.from({ length: 64 }).map((_, i) => {
              const on = [3, 4, 11, 12, 19, 20, 27, 28, 35, 36, 43, 44, 51, 52, 59, 60].includes(i)
              return (
                <div
                  key={i}
                  className={on ? 'bg-black' : 'bg-transparent'}
                  style={{ opacity: on ? 0.85 : 0 }}
                />
              )
            })}
          </div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-30 pointer-events-none" />
        </div>

        <p className="text-[10px] md:text-xs text-gray-700 max-w-md leading-relaxed mb-2">
          You wandered into tall grass outside the map...
        </p>
        <p className="text-[9px] md:text-[11px] text-gray-500 max-w-md leading-relaxed mb-8">
          This page doesn&apos;t exist or has fainted. Return to a safe route to continue your adventure!
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/">
            <button className="px-5 py-3 bg-[#f8b800] border-4 border-black text-black text-[10px] md:text-xs hover:bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer">
              &gt; RUN HOME
            </button>
          </Link>
          <Link href="/map">
            <button className="px-5 py-3 bg-white border-4 border-black text-black text-[10px] md:text-xs hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer">
              &gt; OPEN MAP
            </button>
          </Link>
        </div>
      </div>

      {/* Local keyframes for the glitch flicker */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes glitch-flicker {
          0%, 100% { transform: translate(0, 0); opacity: 0.2; }
          50% { transform: translate(2px, -1px); opacity: 0.5; }
        }
      `}} />
    </main>
  )
}
