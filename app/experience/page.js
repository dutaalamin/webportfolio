'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { experienceData } from '../data/experienceData';
import HamburgerMenu from '../components/HamburgerMenu';
import Cloud from '../components/Cloud';
import BackgroundAudio from '../components/Audio';
import StageHero from '../components/StageHero';
import NpcDialogue from '../components/NpcDialogue';

export default function ExperiencePage() {
  const [isVisible, setIsVisible] = useState(false);
  const [talking, setTalking] = useState(false);

  // Flatten all experiences into a single list of quests.
  const allExperiences = experienceData.flatMap((year) =>
    Object.values(year.sections).flat(),
  );

  useEffect(() => {
    const t = setTimeout(() => setIsVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  const menu = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Experience', href: '/experience' },
    { label: 'Portfolio', href: '/portfolio' },
  ];

  // Just two lines: where he has worked, and where he is now. Kept short on
  // purpose so the player gets back to the game quickly.
  const places = allExperiences
    .map((exp) => exp.title)
    .filter((t, i, a) => a.indexOf(t) === i);
  const lines = [
    `I've worked at ${places.slice(0, -1).join(', ')} and ${places[places.length - 1]}.`,
    'And that brings us to today. Follow me and I will show you what I have built.',
  ];

  return (
    <div className="relative w-screen h-screen bg-white flex items-center justify-center overflow-hidden">
      <HamburgerMenu menuItems={menu} />

      {/* Back to About (Desktop) */}
      <Link href="/about">
        <button className="hidden md:flex absolute top-6 left-6 z-50 px-4 py-2 bg-white border-4 border-black text-black text-xs font-pressStart hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer">
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

      {/* The player character, wandering the stage. No pipe here. */}
      <StageHero
        next="/portfolio"
        npc={{ sprite: '/images/hero2.gif', xFrac: 0.6 }}
        onTalk={setTalking}
      />

      {/* The NPC only speaks once you walk up to them. */}
      <NpcDialogue
        open={talking}
        portrait="/images/npc_portrait.png"
        lines={lines}
        next="/portfolio"
        nextLabel="TREASURES"
        onClose={() => setTalking(false)}
      />
    </div>
  );
}
