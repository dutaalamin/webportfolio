'use client';

import { useEffect, useRef } from 'react';

export default function ClickSoundProvider({ children }) {
  const audioContextRef = useRef(null);

  useEffect(() => {
    // Determine if user is on a touch device (mobile/tablet)
    const isTouchDevice = 
      ('ontouchstart' in window) || 
      (navigator.maxTouchPoints > 0) ||
      (navigator.msMaxTouchPoints > 0);
    
    // Only enable sound for PC (non-touch devices)
    if (isTouchDevice) return;

    const initAudio = () => {
      if (!audioContextRef.current) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContextRef.current = new AudioContext();
      }
      if (audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
    };

    const playClickSound = () => {
      if (!audioContextRef.current) return;
      
      const ctx = audioContextRef.current;
      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Retro UI Select Sound (short high-pitched square wave)
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, ctx.currentTime); // A5 note
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
      
      // Volume envelope (quick fade out)
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime); // low volume so it's not annoying
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      
      osc.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    };

    const handleClick = (e) => {
      initAudio();
      
      // Trigger sound if clicking an interactive element
      const target = e.target.closest('button, a, [role="button"], .cursor-pointer');
      if (target) {
        playClickSound();
      }
    };

    // Use capture phase to ensure it runs even if event propagation is stopped
    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('click', handleClick, true);
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  return <>{children}</>;
}
