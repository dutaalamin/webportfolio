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

  const current = experienceData[page];

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

      <div className={`relative z-20 w-[95%] max-w-screen-md flex flex-col items-stretch overflow-hidden transition-all duration-700 ease-out transform
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >
        {/* Chapter Select Header */}
        <div className={`flex items-center justify-between px-2 md:px-4 pt-2 pb-2 transition-all duration-700 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div className="flex gap-3 md:gap-5">
            {experienceData.map((item, index) => (
              <button
                key={index}
                onClick={() => setPage(index)}
                className={`py-2 px-3 text-[10px] md:text-xs font-pressStart cursor-pointer transition-all border-2
                  ${index === page 
                    ? 'bg-[#f8b800] text-black border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]' 
                    : 'bg-white/80 text-gray-400 border-gray-300 hover:text-black hover:border-black'}`}
              >
                CH.{item.year}
              </button>
            ))}
          </div>

          <Link href="/portfolio">
            <button className="px-3 py-2 bg-[#f8b800] border-4 border-black text-black text-[10px] md:text-xs font-pressStart hover:bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer">
              Portfolio ▶
            </button>
          </Link>
        </div>

        {/* Quest Log Scroll Panel */}
        <div className={`relative h-[460px] md:h-[500px] overflow-y-auto transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          {/* Quest Log Container - Parchment Style */}
          <div className="mx-1 md:mx-2 rounded-lg border-4 border-[#8b7332] overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)]"
            style={{ background: 'linear-gradient(180deg, #f5edd6 0%, #e8d9b8 50%, #dcc9a0 100%)' }}
          >
            {/* Quest Log Title Bar */}
            <div className="px-4 py-3 border-b-3 border-[#8b7332] flex items-center gap-3"
              style={{ background: 'linear-gradient(90deg, #c9a23a, #d4a843, #e8c95a, #d4a843, #c9a23a)' }}
            >
              <span className="text-lg">📜</span>
              <h1 className="font-pressStart text-[10px] md:text-xs text-black drop-shadow-sm">QUEST LOG — CHAPTER {current.year}</h1>
            </div>

            {/* Quest Entries */}
            <div className="p-3 md:p-4 space-y-4">
              {Object.entries(current.sections).map(([sectionTitle, items], sIdx) => (
                <div key={sIdx}>
                  {/* Section Header */}
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-[#8b7332]/40">
                    <span className="text-sm">{sectionTitle.includes('Other') ? '⚔️' : '🗡️'}</span>
                    <h2 className="font-pressStart text-[8px] md:text-[10px] text-[#6b5a28] uppercase">{sectionTitle}</h2>
                  </div>

                  {/* Quest Cards */}
                  <div className="space-y-3">
                    {items.map((item, index) => {
                      const questKey = `${sIdx}-${index}`;
                      const isExpanded = expandedQuest === questKey;
                      const status = getQuestStatus(item.date);
                      const rank = getQuestRank(item.skills);

                      return (
                        <div key={questKey} 
                          className="rounded-lg border-3 border-[#8b7332] overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[4px_4px_0px_0px_rgba(139,115,50,0.5)]"
                          style={{ background: 'linear-gradient(180deg, #faf4e4 0%, #f0e4c8 100%)' }}
                          onClick={() => setExpandedQuest(isExpanded ? null : questKey)}
                        >
                          {/* Quest Header */}
                          <div className="p-3 md:p-4">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                {/* Quest Title */}
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-[10px]">{status.icon}</span>
                                  <h3 className="font-pressStart text-[9px] md:text-[11px] text-[#8b7332] leading-tight truncate">{item.title}</h3>
                                </div>
                                {/* Position & Date */}
                                <p className="font-pressStart text-[7px] md:text-[8px] text-black/70 mt-1">{item.position}</p>
                                <p className="font-sans text-[10px] md:text-[11px] text-black/50 font-medium mt-1">{item.date} • {item.location}</p>
                              </div>
                              
                              {/* Quest Rank Badge */}
                              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-3 border-black/30 flex items-center justify-center font-pressStart text-white text-sm md:text-base font-bold shadow-inner"
                                  style={{ background: rank.bg }}
                                >
                                  {rank.rank}
                                </div>
                                <span className="font-pressStart text-[6px] text-black/40"
                                  style={{ color: status.color }}
                                >
                                  {status.label}
                                </span>
                              </div>
                            </div>

                            {/* Expand indicator */}
                            <div className="flex justify-center mt-2">
                              <span className="font-pressStart text-[8px] text-[#8b7332]/60">{isExpanded ? '▲ CLOSE' : '▼ VIEW QUEST'}</span>
                            </div>
                          </div>

                          {/* Expanded Quest Details */}
                          {isExpanded && (
                            <div className="border-t-2 border-[#8b7332]/30 p-3 md:p-4 space-y-4"
                              style={{ background: 'linear-gradient(180deg, #f0e4c8 0%, #e6d6ac 100%)' }}
                            >
                              {/* Quest Objectives */}
                              <div>
                                <h4 className="font-pressStart text-[8px] text-[#6b5a28] mb-2 flex items-center gap-1">
                                  <span>📋</span> QUEST OBJECTIVES
                                </h4>
                                <div className="space-y-3 ml-1">
                                  {item.description.map((desc, i) => (
                                    <div key={i} className="flex gap-2">
                                      <span className="text-[#22c55e] text-xs mt-0.5 flex-shrink-0">✓</span>
                                      <div>
                                        <p className="font-pressStart text-[7px] md:text-[8px] text-black/80 mb-1">{desc.subtitle}</p>
                                        <p className="font-sans text-[10px] md:text-[11px] text-black/60 leading-relaxed font-medium">{desc.subdesc}</p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Quest Rewards: Skills */}
                              {item.skills && (
                                <div className="border-2 border-[#8b7332]/40 rounded-md p-3"
                                  style={{ background: 'linear-gradient(180deg, #faf4e4, #f5edd6)' }}
                                >
                                  <h4 className="font-pressStart text-[8px] text-[#6b5a28] mb-2 flex items-center gap-1">
                                    <span>🏆</span> REWARDS — SKILLS ACQUIRED
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {item.skills.map((skill, i) => (
                                      <span key={i} className="px-2 py-1 bg-[#f8b800]/20 border-2 border-[#8b7332]/50 text-black text-[7px] md:text-[8px] font-pressStart rounded">
                                        {skill}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* Quest Rewards: Tools */}
                              {item.tools && (
                                <div className="border-2 border-[#8b7332]/40 rounded-md p-3"
                                  style={{ background: 'linear-gradient(180deg, #faf4e4, #f5edd6)' }}
                                >
                                  <h4 className="font-pressStart text-[8px] text-[#6b5a28] mb-2 flex items-center gap-1">
                                    <span>⚒️</span> ITEMS COLLECTED — TOOLS
                                  </h4>
                                  <div className="flex flex-wrap gap-2">
                                    {item.tools.map((tool, i) => (
                                      <span key={i} className="px-2 py-1 bg-[#3b82f6]/10 border-2 border-[#3b82f6]/30 text-black text-[7px] md:text-[8px] font-pressStart rounded">
                                        {tool}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {/* XP Bar */}
                              <div className="flex items-center gap-2">
                                <span className="font-pressStart text-[7px] text-[#6b5a28]">EXP</span>
                                <div className="flex-1 h-3 bg-[#8b7332]/20 rounded-full overflow-hidden border border-[#8b7332]/40">
                                  <div className="h-full rounded-full transition-all duration-1000"
                                    style={{ 
                                      width: '100%',
                                      background: 'linear-gradient(90deg, #f8b800, #fcd34d, #f8b800)'
                                    }}
                                  />
                                </div>
                                <span className="font-pressStart text-[7px] text-[#22c55e]">MAX</span>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 border-t-2 border-[#8b7332]/30 text-center"
              style={{ background: 'linear-gradient(90deg, #c9a23a, #d4a843, #e8c95a, #d4a843, #c9a23a)' }}
            >
              <p className="font-pressStart text-[7px] text-black/50">
                {Object.values(current.sections).flat().length} QUEST{Object.values(current.sections).flat().length > 1 ? 'S' : ''} IN CHAPTER {current.year}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
