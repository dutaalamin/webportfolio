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
  const [page, setPage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [expandedQuest, setExpandedQuest] = useState(null);

  // Flatten all experiences into a single array for the Gym Badges
  const allExperiences = experienceData.flatMap(year => 
    Object.values(year.sections).flat()
  );

  // Badge configurations
  const badgeColors = [
    'bg-gray-300',      // Boulder Badge
    'bg-blue-400',      // Cascade Badge
    'bg-yellow-400',    // Thunder Badge
    'bg-green-400',     // Rainbow Badge
    'bg-purple-400',    // Soul Badge
    'bg-red-400'        // Volcano Badge
  ];

  const badgeIcons = ['🗿', '💧', '⚡', '🌈', '🔮', '🌋'];

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 2500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    setExpandedQuest(null);
  }, [page]);

  const menu = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Experience', href: '/experience' },
    { label: 'Portfolio', href: '/portfolio' }
  ];

  const getQuestStatus = (date) => {
    if (date?.toLowerCase().includes('present')) return { label: 'IN PROGRESS', color: '#22c55e', icon: '🔄' };
    return { label: 'COMPLETED', color: '#f8b800', icon: '✅' };
  };

  const getQuestRank = (skills) => {
    const count = skills?.length || 0;
    if (count >= 5) return { rank: 'S', color: '#f8b800', bg: '#f8b800' };
    if (count >= 4) return { rank: 'A', color: '#ef4444', bg: '#ef4444' };
    if (count >= 3) return { rank: 'B', color: '#3b82f6', bg: '#3b82f6' };
    return { rank: 'C', color: '#22c55e', bg: '#22c55e' };
  };

  return (
    <div className="relative w-screen h-screen bg-white flex items-center justify-center overflow-hidden">
      <HamburgerMenu menuItems={menu} />
      
      {/* Back to Home Button (Desktop) */}
      <Link href="/">
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

      <FarmAnimals className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`} />

        {/* Pokédex Container */}
        <div className={`relative w-full max-w-4xl mx-auto rounded-[24px] border-[8px] border-[#8b0000] p-4 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.5)] transition-all duration-700 ease-out transform flex flex-col md:flex-row gap-4 md:gap-6
          ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95'}`}
          style={{ background: '#dc2626' }}
        >
          {/* Decorative Camera/Lights on Top Left (Pokédex style) */}
          <div className="absolute top-2 left-4 flex gap-2 items-center hidden md:flex">
             <div className="w-8 h-8 rounded-full bg-blue-400 border-[3px] border-white shadow-[0_0_8px_rgba(96,165,250,0.8)] animate-pulse"></div>
             <div className="w-3 h-3 rounded-full bg-red-500 border border-black"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-400 border border-black"></div>
             <div className="w-3 h-3 rounded-full bg-green-500 border border-black"></div>
          </div>

          {/* Left Panel: Navigation List */}
          <div className="w-full md:w-1/3 bg-[#f8fafc] border-[4px] border-black rounded-lg flex flex-col h-[200px] md:h-[450px] shadow-inner mt-0 md:mt-10 overflow-hidden">
             <div className="bg-[#cbd5e1] border-b-[4px] border-black p-3 text-center">
                 <h2 className="font-pressStart text-[10px] md:text-[11px] text-black tracking-wider">DATABASE</h2>
             </div>
             <div className="flex-1 overflow-y-auto p-2 custom-scrollbar space-y-2 bg-[#f1f5f9]">
                 {allExperiences.map((exp, idx) => (
                    <button
                       key={idx}
                       onClick={() => setExpandedQuest(idx)}
                       className={`w-full text-left px-3 py-3 border-[3px] border-black rounded font-pressStart text-[8px] md:text-[9px] transition-all hover:bg-gray-200 active:translate-y-1 active:shadow-none
                          ${expandedQuest === idx 
                              ? 'bg-[#3b82f6] text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.3)] border-black' 
                              : 'bg-white text-black shadow-[2px_2px_0px_rgba(0,0,0,1)]'}`}
                    >
                       <span className="opacity-50 mr-2">No.{String(idx + 1).padStart(2, '0')}</span>
                       <span className="leading-snug block mt-1 md:inline md:mt-0">{exp.title}</span>
                    </button>
                 ))}
             </div>
          </div>

          {/* Right Panel: Gameboy/LCD Monitor */}
          <div className="w-full md:w-2/3 bg-[#8b9bb4] border-[4px] md:border-[8px] border-[#334155] rounded-xl p-3 md:p-5 relative flex flex-col h-[350px] md:h-[450px] shadow-[inset_0_0_15px_rgba(0,0,0,0.5)] md:mt-10">
             
             {/* LCD Screen Inner */}
             <div className="flex-1 bg-[#8bac0f] border-[4px] border-[#0f380f] rounded-lg relative overflow-hidden flex flex-col shadow-[inset_0_0_10px_rgba(0,0,0,0.3)]">
                
                {/* CSS Scanlines & Flicker Overlay */}
                <div className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay opacity-20"
                     style={{ background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, #000 2px, #000 4px)' }}>
                </div>
                
                {expandedQuest !== null ? (
                   <div className="relative z-10 p-4 md:p-6 flex flex-col h-full animate-in fade-in zoom-in-95 duration-300">
                      
                      {/* Company & Role */}
                      <div className="border-b-[3px] border-[#306230] pb-3 mb-4">
                         <h2 className="font-pressStart text-[11px] md:text-sm text-[#0f380f] leading-relaxed tracking-wide">
                            {allExperiences[expandedQuest].title}
                         </h2>
                         <p className="font-sans font-bold text-xs md:text-sm text-[#306230] mt-2">
                            ▶ {allExperiences[expandedQuest].position}
                         </p>
                      </div>

                      {/* Date & Location */}
                      <p className="font-pressStart text-[7px] md:text-[8px] text-[#0f380f]/80 mb-4 tracking-widest">
                         [ {allExperiences[expandedQuest].date} | {allExperiences[expandedQuest].location} ]
                      </p>

                      {/* Description Scroll Area */}
                      <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                         {allExperiences[expandedQuest].description.map((desc, i) => (
                            <div key={i} className="mb-3">
                               <p className="font-pressStart text-[8px] md:text-[9px] text-[#0f380f] mb-2 leading-loose">
                                  {desc.subtitle}
                               </p>
                               <p className="font-sans text-[11px] md:text-[13px] text-[#306230] font-bold leading-relaxed border-l-[3px] border-[#306230]/40 pl-3">
                                  {desc.subdesc}
                               </p>
                            </div>
                         ))}
                         
                         {/* Skills */}
                         {allExperiences[expandedQuest].skills && (
                            <div className="mt-5 pt-3 border-t-[3px] border-[#306230]/30">
                               <p className="font-pressStart text-[8px] text-[#0f380f] mb-3">SKILLS AQUIRED:</p>
                               <div className="flex flex-wrap gap-2">
                                  {allExperiences[expandedQuest].skills.map((skill, i) => (
                                     <span key={i} className="px-2 py-1 bg-[#306230] text-[#8bac0f] border-2 border-[#0f380f] rounded text-[8px] font-pressStart shadow-[2px_2px_0px_#0f380f]">
                                        {skill}
                                     </span>
                                  ))}
                               </div>
                            </div>
                         )}
                      </div>
                   </div>
                ) : (
                   /* Empty State */
                   <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-center p-6">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-full border-[4px] border-[#306230] border-t-transparent animate-spin mb-4"></div>
                      <p className="font-pressStart text-[10px] text-[#0f380f] animate-pulse">AWAITING INPUT...</p>
                      <p className="font-pressStart text-[7px] text-[#306230] mt-4">SELECT ENTRY FROM DATABASE</p>
                   </div>
                )}
             </div>
             
             {/* Decorative Speaker Grills */}
             <div className="absolute bottom-3 right-4 flex gap-1 md:gap-2">
                 <div className="w-6 md:w-8 h-1 md:h-2 bg-[#334155] rounded-full rotate-[-45deg]"></div>
                 <div className="w-6 md:w-8 h-1 md:h-2 bg-[#334155] rounded-full rotate-[-45deg]"></div>
                 <div className="w-6 md:w-8 h-1 md:h-2 bg-[#334155] rounded-full rotate-[-45deg]"></div>
             </div>
          </div>
        </div>

        {/* Navigation Buttons at bottom (Mobile Only) */}
        <div className={`flex md:hidden justify-center gap-4 mt-6 w-[90%] mx-auto transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
          <Link href="/about" className="flex-1">
            <button className="w-full px-2 py-3 bg-white border-4 border-black text-black text-[10px] font-pressStart hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer text-center rounded-lg">
              ◀ Back
            </button>
          </Link>
          <Link href="/portfolio" className="flex-1">
            <button className="w-full px-2 py-3 bg-[#f8b800] border-4 border-black text-black text-[10px] font-pressStart hover:bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer text-center rounded-lg">
              Next ▶
            </button>
          </Link>
        </div>
    </div>
  );
}
