'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { portoData } from '../data/portoData';
import HamburgerMenu from '../components/HamburgerMenu';
import Cloud from '../components/Cloud';
import BackgroundAudio from '../components/Audio';
import FarmAnimals from '../components/FarmAnimals';
import {
  DocumentIcon,
  GlobeAltIcon,
  CodeBracketIcon,
  LinkIcon
} from '@heroicons/react/24/solid'

export default function ExperiencePage() {
 
  const [page, setPage] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [openItems, setOpenItems] = useState({});

  const current = portoData[page];
  const isLastPage = page === portoData.length - 1;

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleItem = (key) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 2500);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (current?.sections) {
      const initialSections = {};
      const initialItems = {};
      Object.keys(current.sections).forEach(section => {
        initialSections[section] = true;
        current.sections[section].forEach((_, idx) => {
          initialItems[`${section}-${idx}`] = true;
        });
      });
      setOpenSections(initialSections);
      setOpenItems(initialItems);
    }
  }, [current]);

  const menu = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Experience', href: '/experience' },
    { label: 'Portfolio', href: '/portfolio' }
  ];

  function getIconForLabel(label) {
  const lower = label.toLowerCase()

  if (lower.includes('certificate')) return <DocumentIcon className="w-4 h-4 inline-block mr-1" />
  if (lower.includes('project') || lower.includes('demo') || lower.includes('preview')) return <GlobeAltIcon className="w-4 h-4 inline-block mr-1" />
  if (lower.includes('github')) return <CodeBracketIcon className="w-4 h-4 inline-block mr-1" />
  
  // default icon
  return <LinkIcon className="w-4 h-4 inline-block mr-1" />
}

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
        <button className="hidden md:flex absolute top-6 right-6 z-50 px-4 py-2 bg-[#f8b800] border-4 border-black text-black text-xs font-pressStart hover:bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer">
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

      <div className={`relative z-20 w-[90%] max-w-screen-md flex flex-col items-stretch bg-transparent overflow-hidden transition-all duration-700 ease-out transform
      ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >
        <div className={`flex items-center justify-between bg-transparent px-2 md:px-4 pt-4 transition-all duration-700 ease-out
          ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >
          <div className="flex gap-4 md:gap-6">
            {portoData.map((item, index) => (
              <button
                key={index}
                onClick={() => setPage(index)}
                className={`py-3 text-sm md:text-base font-pressStart cursor-pointer transition-colors
                  ${index === page ? 'text-black font-bold scale-110' : 'text-gray-400 hover:text-black'}`}
              >
                {item.year}
              </button>
            ))}
          </div>
        </div>

        <div className={`relative h-[500px] px-6 py-4 overflow-y-auto text-sm space-y-4 transition-all duration-700 ease-out
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
        >



          {Object.entries(current.sections).map(([sectionTitle, items], idx) => (
            <div key={idx} className="mb-8 bg-transparent">
              <h2 className="text-black font-pressStart text-sm mb-6 pb-2 border-b-4 border-black inline-block">{sectionTitle}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {items.map((item, index) => (
                  <div key={index} className="flex flex-col bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-5 hover:-translate-y-2 hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all">
                    {/* Image Placeholder */}
                    <div className="w-full h-40 bg-gray-200 border-4 border-black mb-4 flex items-center justify-center overflow-hidden relative group">
                      {/* Using standard img for easier onError fallback handling */}
                      <img 
                        src={`/images/projects/${item.title.toLowerCase()}.png`} 
                        alt={item.title} 
                        className="object-cover w-full h-full"
                        onError={(e) => { e.target.src = 'https://placehold.co/600x400/eeeeee/000000?font=press-start-2p&text=NO+IMAGE' }}
                      />
                    </div>

                    <h1 className='font-pressStart text-black text-xs md:text-sm drop-shadow-md mb-2 uppercase'>{item.title}</h1>
                    <p className="text-black font-pressStart text-[8px] md:text-[10px] mb-1">{item.position}</p>
                    <p className="text-gray-500 font-pressStart text-[8px] mb-4">({item.date})</p>
                    
                    <div className="flex-grow space-y-2 mb-6">
                      {item.description.map((desc, i) => (
                        <p key={i} className="text-black text-xs font-bold leading-relaxed">
                          {desc.subdesc}
                        </p>
                      ))}
                    </div>

                    <div className="mt-auto space-y-3">
                      {item.skills && (
                        <div className="flex flex-wrap gap-2">
                          {item.skills.map((skill, i) => (
                            <span key={i} className="px-2 py-1 bg-blue-100 border-2 border-black text-black text-[8px] font-pressStart uppercase">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      {item.tools && (
                        <div className="flex flex-wrap gap-2">
                          {item.tools.map((tool, i) => (
                            <span key={i} className="px-2 py-1 bg-green-100 border-2 border-black text-black text-[8px] font-pressStart uppercase">
                              {tool}
                            </span>
                          ))}
                        </div>
                      )}

                      {item.links?.length > 0 && (
                        <div className="pt-4">
                          {item.links.map((linkObj, linkIdx) => (
                            <a
                              key={linkIdx}
                              href={linkObj.url}
                              className="flex items-center justify-center w-full gap-2 px-4 py-3 bg-[#f8b800] border-4 border-black text-black text-[10px] font-pressStart hover:bg-yellow-400 active:translate-y-1 active:shadow-none transition-all cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <GlobeAltIcon className="w-4 h-4" />
                              VISIT SITE ▶
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
