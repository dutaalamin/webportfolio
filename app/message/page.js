'use client'
import Link from 'next/link';
import { useState, useEffect } from 'react';
import HamburgerMenu from '../components/HamburgerMenu';
import Cloud from '../components/Cloud';
import BackgroundAudio from '../components/Audio';
import FarmAnimals from '../components/FarmAnimals';
import ContactForm from '../components/ContactForm';
import Image from 'next/image';

export default function EndPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 2500);
    return () => clearTimeout(timeout);
  }, []);

  const menu = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Experience', href: '/experience' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Message', href: '/message' },
    { label: 'Map', href: '/map' }
  ];

  return (
    <div className="relative w-screen h-screen bg-white flex flex-col items-center justify-center overflow-hidden">
      <HamburgerMenu menuItems={menu} />
      
      {/* Back to Home Button (Desktop) */}
      <Link href="/">
        <button className="hidden md:flex absolute top-6 left-6 z-50 px-4 py-2 bg-white border-4 border-black text-black text-xs font-pressStart hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer">
          &lt; Back
        </button>
      </Link>

      <BackgroundAudio src="/audio/end.mp3" volume={0.15} delay={2500} className='fixed top-4 right-10 mr-4'/>
      
      {/* Clouds */}
      <Cloud top={10} direction="left" speed={150} opacity={0.2} delay={2725} />
      <Cloud top={40} direction="right" speed={40} opacity={0.2} delay={2725} />
      <Cloud top={150} direction="right" speed={100} opacity={0.3} delay={2725} />
      <Cloud top={100} direction="left" speed={30} opacity={0.4} delay={2725} /> 

      {/* Ground Image */}
      <div className="absolute bottom-0 w-full z-0">
        <Image src="/images/ground.png" alt="Ground Background" width={1920} height={200} className="w-full h-auto object-contain" priority />
      </div>

      <FarmAnimals className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100' : 'opacity-0'}`} />

      {/* Main Container */}
      <div className={`relative z-20 w-[90%] max-w-screen-md flex flex-col items-center justify-center bg-transparent transition-all duration-700 ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}>
        <h1 className="text-xl md:text-2xl font-pressStart text-black mb-6 text-center leading-relaxed">
          THANK YOU FOR PLAYING!
        </h1>
        <p className="text-sm font-pressStart text-gray-600 mb-8 text-center max-w-md leading-relaxed">
          Feel free to reach out to me using the form below. I'll get back to you as soon as possible!
        </p>
        
        <ContactForm />
      </div>
    </div>
  );
}
