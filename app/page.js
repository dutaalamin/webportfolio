'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Cloud from './components/Cloud'
import BackgroundAudio from './components/Audio'
import SocialLinks from './components/SocialLinks';
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

const socialLinks = [
  {
    href: 'https://www.linkedin.com/in/dutaalamin',
    icon: '/logo/linkedin.png',
    alt: 'LinkedIn',
  },
  {
    href: 'https://instagram.com/dutaalamin',
    icon: '/logo/instagram.svg', 
    alt: 'Instagram',
  },
  {
    href: 'https://open.spotify.com/playlist/2gQgfHfdjW8S0S4Ypfu1jV',
    icon: '/logo/spotify.svg', 
    alt: 'Spotify',
  },
]

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 2000)
    return () => clearTimeout(timeout)
  }, [])

  const fadeClass = (delay = 0) =>
    `${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} transition-all duration-700 ease-out delay-[${delay}ms]`

  return (
    <main className="relative w-full min-h-screen bg-white text-black font-pressStart overflow-hidden">
      <BackgroundAudio
        src="/audio/home.mp3"
        volume={0.15}
        delay={0}
        className="fixed right-4 top-4 z-50"
      />

      {/* Cloud Layers */}
      <Cloud top={30} direction="left" speed={120} opacity={0.5} delay={2100} />
      <Cloud top={80} direction="right" speed={50} opacity={0.3} delay={2100} />

      {/* Animals Farm */}
      <FarmAnimals className={fadeClass(600)} />

      {/* Content */}
      <div className={`relative z-5 max-w-7xl mx-auto pt-28 px-6 grid gap-8 grid-cols-1 lg:grid-cols-3 ${fadeClass(900)}`}>
        <div className="flex flex-col gap-2">
          <RoleRotate />
          <SocialLinks links={socialLinks} />
        </div>
        
        <div className="lg:pl-20 lg:col-span-2 mt-4 lg:mt-0">
          <div className="p-8 inline-block">
            <p className="text-xl sm:text-2xl xl:text-4xl mb-4 text-black min-h-[32px] xl:min-h-[40px]">
              <Typewriter text="Welcome, Player!" delay={2500} speed={40} />
            </p>
            <p className="text-sm sm:text-lg xl:text-2xl pb-6 text-black leading-relaxed min-h-[60px] xl:min-h-[80px] whitespace-pre-wrap">
              <Typewriter text={"Ready to embark on a journey\nthrough the quests?"} delay={3400} speed={30} />
            </p>
            <p className="text-sm sm:text-lg xl:text-2xl mb-8 text-black leading-relaxed min-h-[60px] xl:min-h-[80px] whitespace-pre-wrap">
              <Typewriter text={"Choose your stage and begin\nthe adventure!"} delay={4600} speed={30} />
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
              <Link href="/porto">
                <p className="text-gray-300 hover:text-black transition-all duration-300 cursor-pointer text-xl sm:text-2xl font-pressStart">
                  &gt; Porto
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