'use client'

import { useState, useEffect, useRef } from 'react'

export default function Typewriter({ text, speed = 25, delay = 0 }) {
  const [displayedText, setDisplayedText] = useState('')
  const audioCtxRef = useRef(null)

  useEffect(() => {
    let timeout;
    let typeInterval;
    
    // Initialize audio context
    if (!audioCtxRef.current && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtxRef.current = new AudioContext();
      }
    }

    const playBlip = () => {
      if (!audioCtxRef.current) return;
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {});
      }
      try {
        const osc = audioCtxRef.current.createOscillator();
        const gainNode = audioCtxRef.current.createGain();
        
        osc.type = 'square';
        // Randomize pitch slightly for a more mechanical typing feel
        osc.frequency.setValueAtTime(300 + Math.random() * 100, audioCtxRef.current.currentTime);
        
        gainNode.gain.setValueAtTime(0.01, audioCtxRef.current.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.current.currentTime + 0.05);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtxRef.current.destination);
        
        osc.start();
        osc.stop(audioCtxRef.current.currentTime + 0.05);
      } catch (e) {
        // Ignore audio errors if browser blocks it
      }
    };

    timeout = setTimeout(() => {
      let currentIndex = 0;
      typeInterval = setInterval(() => {
        if (currentIndex < text.length) {
          const char = text[currentIndex];
          setDisplayedText((prev) => prev + char);
          if (char !== ' ' && char !== '\n') {
             playBlip();
          }
          currentIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, speed);
    }, delay);

    return () => {
      clearTimeout(timeout);
      clearInterval(typeInterval);
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    }
  }, [text, speed, delay])

  return <span>{displayedText}</span>
}
