'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Typewriter from './Typewriter';

// The conversation box that opens when the player walks up to an NPC. It is
// only rendered while `open` is true, so the NPC has to be met in the world
// before any of this appears.
export default function NpcDialogue({
  open = false,
  portrait = '/images/npc_portrait.png',
  lines = [],
  next,
  nextLabel = 'NEXT',
  onClose,
}) {
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState(false);

  // Restart the conversation whenever it re-opens.
  useEffect(() => {
    if (open) {
      setIndex(0);
      setDone(false);
    }
  }, [open]);

  if (!open) return null;

  const isLast = index >= lines.length - 1;
  const line = lines[index];

  const advance = () => {
    if (!done) return; // wait for the typewriter to finish
    if (isLast) {
      onClose?.();
      return;
    }
    setIndex((i) => i + 1);
    setDone(false);
  };

  return (
    <div className="absolute inset-x-0 bottom-6 md:bottom-10 z-30 flex justify-center px-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="w-full max-w-3xl">
        {/* Dialog box: portrait on the left, text on the right */}
        <button
          type="button"
          onClick={advance}
          className="w-full bg-white border-4 border-black rounded-lg shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-3 md:p-5 flex items-center gap-3 md:gap-5 text-left cursor-pointer"
        >
          {/* Portrait */}
          <div className="shrink-0 w-16 h-16 md:w-24 md:h-24 bg-gray-100 border-4 border-black rounded-md overflow-hidden relative">
            <Image
              src={portrait}
              alt="Portrait"
              fill
              sizes="96px"
              className="object-cover"
            />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0 min-h-[72px] md:min-h-[96px] flex flex-col justify-center">
            <p className="font-sans text-[12px] md:text-[15px] text-gray-900 leading-relaxed">
              <Typewriter
                key={index}
                text={line}
                speed={22}
                delay={index === 0 ? 200 : 0}
                onComplete={() => setDone(true)}
              />
            </p>

            {/* Blinking advance prompt */}
            <div className="mt-2 flex items-center justify-end gap-3">
              {done && !isLast && (
                <span className="font-pressStart text-[8px] md:text-[10px] text-gray-400 animate-pulse">
                  ▼ PRESS TO CONTINUE
                </span>
              )}
              {done && isLast && next && (
                <Link
                  href={next}
                  onClick={(e) => e.stopPropagation()}
                  className="font-pressStart text-[9px] md:text-[11px] text-black hover:text-[#b8860b] transition-colors"
                >
                  {nextLabel} ▶
                </Link>
              )}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
