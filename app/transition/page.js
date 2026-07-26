'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Cloud from '../components/Cloud';
import BackgroundAudio from '../components/Audio';
import FarmAnimals from '../components/FarmAnimals';

const storyPages = [
  {
    text: `Meet our hero, an Informatics graduate from Yogyakarta... With a deep passion for technology, a young Software Engineer emerged—skilled in AI, system automation, and turning complex industrial challenges into seamless digital solutions.`,
  }
]

export default function IntroPage() {
  const router = useRouter()
  const [currentPage, setCurrentPage] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [isFinished, setIsFinished] = useState(false)
  const [isLocked, setIsLocked] = useState(false)

  const intervalRef = useRef(null)
  const textRef = useRef('')
  const indexRef = useRef(0)

  useEffect(() => {
    if (!storyPages[currentPage]) return

    // Hentikan interval sebelumnya
    if (intervalRef.current) clearInterval(intervalRef.current)

    const fullText = storyPages[currentPage].text
    textRef.current = fullText
    indexRef.current = 0
    setDisplayedText('')
    setIsFinished(false)
    setIsLocked(true)

    setTimeout(() => {
      intervalRef.current = setInterval(() => {
        const currentIndex = indexRef.current
        if (currentIndex < textRef.current.length) {
          const char = textRef.current[currentIndex];
          setDisplayedText((prev) => prev + char);
          
          const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
          if (char !== ' ' && char !== '\n' && !isMobile) {
            if (typeof window !== 'undefined') {
              if (!window.typeSound) {
                window.typeSound = new Audio('/audio/typing.wav');
                window.typeSound.volume = 0.15;
              }
              const now = Date.now();
              if (!window.lastPlayTime || now - window.lastPlayTime > 80) {
                try {
                  window.typeSound.currentTime = 0;
                  window.typeSound.play().catch(() => {});
                  window.lastPlayTime = now;
                } catch (e) {}
              }
            }
          }
          indexRef.current += 1
        } else {
          clearInterval(intervalRef.current)
          setIsFinished(true)
          setIsLocked(false)
        }
      }, 50)
    }, 2500);
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [currentPage])

  const handleNext = () => {
    if (!isFinished || isLocked) return
    if (currentPage < storyPages.length - 1) {
      setCurrentPage((prev) => prev + 1)
    } else {
      router.push('/about')
    }
  }

  const handleBack = () => {
    if (isLocked || currentPage === 0) return
    setCurrentPage((prev) => prev - 1)
  }

  const handleSkip = () => {
    router.push('/about')
  }

  const handleGoHome = () => {
    router.push('/')
  }

  const handleTextClick = () => {
    if (!isFinished) {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setDisplayedText(textRef.current)
      setIsFinished(true)
      setIsLocked(false)
    }
  }

  return (
    <div className="relative w-screen h-screen bg-white text-black font-pressStart overflow-hidden">
      <Cloud top={45} direction="left" speed={50} opacity={0.4} delay={2100} />
      <Cloud top={180} direction="left" speed={100} opacity={0.2} delay={2100} />
      <Cloud top={230} direction="right" speed={150} opacity={0.3} delay={2100} />
      <Cloud top={100} direction="right" speed={40} opacity={0.3} delay={2100} />   
      <BackgroundAudio className="absolute pt-18 right-10 z-20" src="/audio/experience.mp3" volume={0.15} delay={2500} />
      

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

      <FarmAnimals />

      <div className="relative z-10 flex flex-col items-center justify-center h-full px-6">
        <button
          onClick={handleGoHome}
          className="hidden md:flex absolute top-6 left-6 z-50 px-4 py-2 bg-white border-4 border-black text-black text-xs font-pressStart hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer"
        >
          &lt; Back
        </button>

        <div className="flex flex-col md:flex-row items-center md:items-end justify-center gap-6 md:gap-10 max-w-5xl w-full mx-auto pb-20 md:pb-40">
          {/* Character */}
          <div className="flex-shrink-0 mt-16 md:mt-0">
            <Image 
              src="/images/dutaloading.png" 
              alt="Duta" 
              width={350} 
              height={350} 
              className="object-contain w-48 md:w-[350px] h-auto"
            />
          </div>

          {/* Dialogue Box */}
          <div
            onClick={handleTextClick}
            className="relative p-6 md:p-10 w-full min-h-[200px] cursor-pointer"
          >
            <p className="whitespace-pre-wrap text-black text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed font-pressStart">
              {displayedText}
              {!isFinished && <span className="animate-pulse">_</span>}
            </p>

            {/* Next Indicator */}
            {isFinished && (
              <button 
                onClick={handleSkip} 
                className="absolute bottom-4 right-6 px-3 py-2 bg-[#f8b800] border-4 border-black text-black text-[10px] md:text-xs font-pressStart hover:bg-yellow-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all cursor-pointer animate-pulse"
              >
                Next ▶
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
