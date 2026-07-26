'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { experienceData } from '../data/experienceData';
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

  const current = experienceData[page];
  const isLastPage = page === experienceData.length - 1;

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
    { label: 'Portfolio', href: '/porto' }
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
        <button className="hidden md:flex absolute top-6 left-6 z-50 text-gray-400 hover:text-black transition-colors font-pressStart text-xs items-center justify-center cursor-pointer">
          &lt; Back
        </button>
      </Link>
      <BackgroundAudio src="/audio/about.mp3" volume={1.0} delay={2500} className='fixed top-4 right-10 mr-4'/>
      
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
            {experienceData.map((item, index) => (
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


          {isLastPage && (
            <div className="absolute top-4 right-4">
              <Link href="/porto">
                <button className="text-lg md:text-xl cursor-pointer text-gray-400 hover:text-black font-pressStart disabled:opacity-30">
                  Portfolio ▶
                </button>
              </Link>
            </div>
          )}

          {Object.entries(current.sections).map(([sectionTitle, items], idx) => (
            <div key={idx} className="mb-4 text-black font-pressStart overflow-hidden">
              <button
                className="w-full text-left py-3 text-black font-pressStart text-xs flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection(sectionTitle)}
              >
                <span>{sectionTitle}</span>
                <span>{openSections[sectionTitle] ? '▾' : '▸'}</span>
              </button>

              {openSections[sectionTitle] && (
                <ul className="divide-y divide-gray-600">
                  {items.map((item, index) => {
                    const key = `${sectionTitle}-${index}`;
                    const isOpen = openItems[key];

                    return (
                      <li key={key} className="px-4 py-3">
                        <button
                          onClick={() => toggleItem(key)}
                          className="w-full text-left font-pressStart text-xs flex justify-between items-center"
                        >
                          <div className="flex gap-4">
                            <span>
                              <h1 className='text-[#f8b800] font-bold pb-2 leading-relaxed text-sm drop-shadow-md'>{item.title}</h1>
                              <p className="text-black font-bold text-xs pb-1">{item.position}</p>
                              <p className="text-gray-800 font-bold text-xs pb-1">({item.date})</p>
                              <p className="text-gray-800 font-bold text-xs">{item.location}</p>
                            </span>
                          </div>
                          <span>{isOpen ? '▾' : '▸'}</span>
                        </button>

                        {isOpen && (
                          <div className="mt-2 text-xs pt-4 space-y-4">
                            <ul className="list-none space-y-6">
                              {item.description.map((desc, i) => (
                                <li key={i} className="text-black leading-relaxed">
                                  <span className="text-black font-bold text-sm">{desc.subtitle}</span>
                                  <p className="pt-2 text-black font-bold leading-loose">{desc.subdesc}</p>
                                </li>
                              ))}
                              {item.links?.length > 0 && (
                                <div className="pt-2 text-black font-bold">
                                  <strong className="text-[#f8b800] drop-shadow-md">Links:</strong>
                                  <ul className="list-none ml-2 mt-2 space-y-2">
                                    {item.links.map((linkObj, index) => (
                                      <li key={index}>
                                        <a
                                          href={linkObj.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-blue-700 hover:text-blue-900 underline transition-colors flex items-center"
                                        >
                                          {getIconForLabel(linkObj.label)}
                                          {linkObj.label}
                                        </a>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </ul>

                            {item.skills && (
                              <div className='border-2 border-black rounded-md p-3 mt-4'>
                                <strong className="text-[#f8b800] drop-shadow-md">🎮 Skills:</strong>
                                <p className='text-black font-bold pt-2 leading-relaxed'>{item.skills.join(', ')}</p>
                              </div>
                            )}

                            {item.tools && (
                              <div className='border-2 border-black rounded-md p-3 mt-2'>
                                <strong className="text-[#f8b800] drop-shadow-md">⚒ Tools:</strong> 
                                <p className='text-black font-bold pt-2 leading-relaxed'>{item.tools.join(', ')}</p>
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
