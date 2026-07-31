'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { preloadPage } from '../utils/preloadHelper';
import Cloud from '../components/Cloud';
import FarmAnimals from '../components/FarmAnimals';

export default function PageTransitionLoader() {
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setShow(true);
    setLoading(true);
    setFadeOut(false);
    setShowPrompt(false);

    preloadPage(pathname);

    const isFirstTime = typeof window !== 'undefined' && !window.hasStarted;
    const showDuration = 1500;
    const totalDuration = 2000;

    let fadeOutTimer;
    let hideTimer;

    if (isFirstTime && pathname !== '/map') {
      // First time: stop loading after 2s and show the prompt
      const promptTimer = setTimeout(() => {
        setLoading(false);
        setShowPrompt(true);
      }, totalDuration);
      return () => clearTimeout(promptTimer);
    } else {
      // Auto-start for map page
      if (isFirstTime && pathname === '/map' && typeof window !== 'undefined') {
        window.hasStarted = true;
        window.startMuted = false; 
      }

      // Not first time or auto-started map page: just hide automatically
      fadeOutTimer = setTimeout(() => setFadeOut(true), showDuration);
      hideTimer = setTimeout(() => {
        setShow(false);
        setLoading(false);
        if (pathname === '/map' && typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('audioPreferenceSet'));
        }
      }, totalDuration);
    }

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname]);

  const handleStart = (playMusic) => {
    if (typeof window !== 'undefined') {
      window.hasStarted = true;
      if (!playMusic) {
        window.startMuted = true;
      } else {
        window.startMuted = false;
      }
    }
    
    // Notify Audio component
    window.dispatchEvent(new CustomEvent('audioPreferenceSet'));

    setFadeOut(true);
    setTimeout(() => {
      setShow(false);
      setShowPrompt(false);
    }, 500);
  };

  if (!show) return null;
  if (pathname === '/map') return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-white transition-opacity duration-500 ease-in-out ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <Cloud top={20} direction="left" speed={50} opacity={0.5} delay={200} />
      <Cloud top={60} direction="right" speed={20} opacity={0.3} delay={200} />
      <Cloud top={110} direction="left" speed={20} opacity={0.3} delay={200} />

      <div className="z-30 flex flex-col items-center xl:pb-50">
        <div className="mb-4">
          <Image
            src="/images/bulbasaur.gif"
            alt="Loading Character"
            width={80}
            height={80}
            className={loading ? "animate-bounce" : ""}
            unoptimized
            priority
          />
        </div>
        
        {loading && (
          <div className="text-center">
            <p className="text-lg font-bold text-gray-700 animate-pulse font-pressStart mt-4">LOADING</p>
            <div className="w-64 max-w-[80vw] h-3 bg-gray-300 rounded-full mt-4 overflow-hidden relative">
              <div className="absolute inset-0 w-full h-full animate-progress bg-gradient-to-r from-blue-900 to-blue-300" />
            </div>
          </div>
        )}

        {showPrompt && (
          <div className="text-center mt-4 bg-white p-6 rounded-xl border-4 border-black shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
            <p className="text-sm md:text-base font-bold text-black mb-6 font-pressStart leading-relaxed">PLAY BACKGROUND<br/>MUSIC?</p>
            <div className="flex justify-center gap-6">
              <button
                onClick={() => handleStart(true)}
                className="px-6 py-3 bg-green-500 text-white font-pressStart text-sm border-2 border-black rounded shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-green-400 hover:translate-y-1 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all cursor-pointer"
              >
                YES
              </button>
              <button
                onClick={() => handleStart(false)}
                className="px-6 py-3 bg-red-500 text-white font-pressStart text-sm border-2 border-black rounded shadow-[4px_4px_0_0_rgba(0,0,0,1)] hover:bg-red-400 hover:translate-y-1 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all cursor-pointer"
              >
                NO
              </button>
            </div>
          </div>
        )}
      </div>

      <FarmAnimals className="z-10" />
      <div className="absolute bottom-0 w-full z-0">
        <Image
          src="/images/ground.png"
          alt="Ground"
          width={1920}
          height={200}
          className="w-full h-auto object-contain"
          priority
        />
      </div>
    </div>
  );
}
