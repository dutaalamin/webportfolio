'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { preloadPage } from '../utils/preloadHelper';
import Cloud from '../components/Cloud';
import FarmAnimals from '../components/FarmAnimals';

export default function PageTransitionLoader() {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setShow(true);
    setLoading(true);
    setFadeOut(false);

    preloadPage(pathname);

    const totalDuration = 2000;
    const showDuration = totalDuration - 500;

    if (typeof window !== 'undefined' && !window.hasStarted) {
      window.hasStarted = true;
      window.startMuted = false;
    }

    const fadeOutTimer = setTimeout(() => setFadeOut(true), showDuration);
    const hideTimer = setTimeout(() => {
      setShow(false);
      setLoading(false);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('audioPreferenceSet'));
      }
    }, totalDuration);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, [pathname]);


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
