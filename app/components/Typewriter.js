'use client'

import { useState, useEffect, useRef } from 'react'

export default function Typewriter({ text, speed = 25, delay = 0 }) {
  const [displayedText, setDisplayedText] = useState('')
  const audioRef = useRef(null)

  useEffect(() => {
    setDisplayedText(''); // Reset text to prevent duplicate in Strict Mode
    let timeout;
    let typeInterval;
    
    // Initialize audio element
    if (!audioRef.current && typeof window !== 'undefined') {
      audioRef.current = new Audio('/audio/typing.wav');
      audioRef.current.volume = 0.15; // Set a subtle volume
    }

    let lastPlayTime = 0;
    const playClick = () => {
      // Disable typing sound on mobile devices to prevent lag
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      if (isMobile || !audioRef.current) return;
      
      const now = Date.now();
      if (now - lastPlayTime > 80) { // Throttle audio to prevent jank
        try {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
          lastPlayTime = now;
        } catch (e) {
          // Ignore errors
        }
      }
    };

    timeout = setTimeout(() => {
      let currentIndex = 0;
      typeInterval = setInterval(() => {
        if (currentIndex < text.length) {
          const char = text[currentIndex];
          setDisplayedText((prev) => prev + char);
          if (char !== ' ' && char !== '\n') {
             playClick();
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
    }
  }, [text, speed, delay])

  return <span>{displayedText}</span>
}
