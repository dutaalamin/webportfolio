'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HamburgerMenu from '../components/HamburgerMenu';
import Cloud from '../components/Cloud';
import BackgroundAudio from '../components/Audio';
import StageHero from '../components/StageHero';
import NpcDialogue from '../components/NpcDialogue';
import { aboutLines } from '../data/aboutData';

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);
  const [talking, setTalking] = useState(false);

  const menu = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Experience', href: '/experience' },
    { label: 'Portfolio', href: '/portfolio' },
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
        <button className="hidden md:flex absolute top-6 left-6 z-50 px-4 py-2 bg-white border-4 border-black text-black text-xs font-pressStart hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer">
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

      {/* The player character, wandering the stage. No pipe here. */}
      <StageHero
        next="/experience"
        npc={{ sprite: '/images/hero2.gif', xFrac: 0.6 }}
        onTalk={setTalking}
      />

      {/* The NPC only speaks once you walk up to them. */}
      <NpcDialogue
        open={talking}
        portrait="/images/npc_portrait.png"
        lines={aboutLines}
        next="/experience"
        nextLabel="ONWARD"
        onClose={() => setTalking(false)}
      />
    </div>
  );
}
