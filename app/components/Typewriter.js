'use client'

import { useState, useEffect, useRef } from 'react'

export default function Typewriter({ text, speed = 25, delay = 0 }) {
  const [displayedText, setDisplayedText] = useState('')
  const audioRef = useRef(null)

  useEffect(() => {
    let timeout;
    let typeInterval;
    
    // Initialize audio element
    if (!audioRef.current && typeof window !== 'undefined') {
      audioRef.current = new Audio('/audio/typing.wav');
      audioRef.current.volume = 0.15; // Set a subtle volume
    }

    const playClick = () => {
      if (!audioRef.current) return;
      try {
        // Clone the node so rapid firing doesn't cut off or fail
        const clickSound = audioRef.current.cloneNode();
        clickSound.volume = audioRef.current.volume;
        clickSound.play().catch(() => {});
      } catch (e) {
        // Ignore errors
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
