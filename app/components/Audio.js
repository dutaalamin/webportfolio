'use client'

import { useEffect, useRef, useState } from 'react'
import { SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid'

export default function BackgroundAudio({
  src,
  volume = 0.5,
  delay = 2500,
  className = '' // ✅ bebas override dari luar
}) {
  const audioRef = useRef(null)
  const [isMuted, setIsMuted] = useState(false)

  useEffect(() => {
    const checkPreferenceAndPlay = () => {
      const startMuted = sessionStorage.getItem('startMuted') === 'true';
      if (startMuted) {
        setIsMuted(true);
        if (audioRef.current) audioRef.current.muted = true;
      }
      
      if (audioRef.current && !startMuted) {
        audioRef.current.volume = volume;
        audioRef.current.play().catch((err) => {
          console.warn('Autoplay blocked:', err);
        });
      }
    };

    const hasStarted = sessionStorage.getItem('hasStarted') === 'true';
    let timeout;
    
    if (hasStarted) {
      timeout = setTimeout(checkPreferenceAndPlay, delay);
    } else {
      const handlePreferenceSet = () => {
        checkPreferenceAndPlay();
      };
      window.addEventListener('audioPreferenceSet', handlePreferenceSet);
      return () => window.removeEventListener('audioPreferenceSet', handlePreferenceSet);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [src, volume, delay])

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
    }
    setIsMuted(!isMuted)
  }

  return (
    <>
      <audio ref={audioRef} src={src} loop />
      <button
        onClick={toggleMute}
        className="fixed bottom-6 right-6 z-50 p-2 cursor-pointer transition-transform hover:scale-110 drop-shadow-lg"
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        {isMuted ? (
          <SpeakerXMarkIcon className="w-8 h-8 text-black" />
        ) : (
          <SpeakerWaveIcon className="w-8 h-8 text-[#f8b800]" />
        )}
      </button>
    </>
  )
}
