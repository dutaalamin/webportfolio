"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HamburgerMenu({ menuItems = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      {/* Tombol Hamburger */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed z-50 top-4 right-4 w-10 h-10 md:w-12 md:h-12 cursor-pointer active:scale-95 transition-transform"
        aria-label="Open Menu"
      >
        <Image
          src="/images/hamburger.png"
          alt="Hamburger"
          fill
          className="object-contain drop-shadow-[2px_2px_0px_rgba(0,0,0,1)] hover:drop-shadow-[3px_3px_0px_rgba(248,184,0,1)] transition-all"
          priority
        />
      </button>

      {/* Overlay Menu */}
      {isOpen && (
        <>
          {/* Latar belakang dim */}
          <div
            className="fixed inset-0 bg-black/80 z-50 backdrop-blur-xs animate-fadeIn"
            onClick={() => setIsOpen(false)}
          />

          {/* RPG Pause Window Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div className="pointer-events-auto relative w-full max-w-[320px] md:max-w-[450px] lg:max-w-[550px] bg-white border-4 border-black rounded-xl p-5 md:p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-pressStart flex flex-col animate-scaleUp">
              
              {/* Top Banner / Player Stats */}
              <div className="bg-[#f8b800] border-2 border-black p-2.5 md:p-4 rounded-lg mb-4 flex items-center justify-between shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <div>
                  <h2 className="text-[10px] md:text-sm text-black font-bold uppercase tracking-wider">PAUSE MENU</h2>
                  <p className="text-[7px] md:text-[9px] text-black/70 font-sans font-bold mt-0.5 md:mt-1">PLAYER: DUTA • LV.99</p>
                </div>
                {/* Tombol Close Square Retro */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 md:w-9 md:h-9 bg-red-500 hover:bg-red-600 text-white text-xs md:text-sm border-2 border-black rounded flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
                  aria-label="Close Menu"
                >
                  ✕
                </button>
              </div>

              {/* Subheader / Mode */}
              <div className="flex items-center gap-2 mb-3 md:mb-5 pb-2 md:pb-3 border-b-2 border-dashed border-gray-300 px-1">
                <span className="text-xs md:text-sm">🎮</span>
                <span className="text-[8px] md:text-[10px] text-gray-500 uppercase tracking-widest">SELECT STAGE</span>
              </div>

              {/* Daftar Menu Items */}
              <div className="space-y-2.5">
                {menuItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  const isHovered = hoveredIndex === index;
                  const showCursor = isActive || isHovered;

                  const content = (
                    <div
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border-2 transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#f8b800]/20 border-[#f8b800] text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,0.8)]"
                          : isHovered
                          ? "bg-gray-100 border-black text-black"
                          : "bg-white border-transparent text-gray-600"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 md:gap-4">
                        <span
                          className={`text-xs md:text-sm transition-opacity ${
                            showCursor ? "opacity-100 text-[#f8b800] animate-pulse" : "opacity-0"
                          }`}
                        >
                          ▶
                        </span>
                        <span className={`text-[10px] md:text-sm font-bold tracking-wide transition-all ${
                          showCursor ? "text-black translate-x-1" : ""
                        }`}>
                          {item.label}
                        </span>
                      </div>
                      
                      {/* Active Indicator Badge */}
                      {isActive && (
                        <span className="text-[6px] md:text-[8px] bg-black text-white px-1.5 md:px-2 py-0.5 md:py-1 rounded-sm tracking-widest">
                          HERE
                        </span>
                      )}
                    </div>
                  );

                  if (item.isPDF || item.isExternal) {
                    return (
                      <a
                        key={index}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setIsOpen(false)}
                      >
                        {content}
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>

              {/* Bottom Footer Info */}
              <div className="mt-5 pt-3 border-t-2 border-gray-200 text-center">
                <p className="text-[7px] text-gray-400 uppercase tracking-wider">
                  TAP ANYWHERE TO RESUME
                </p>
              </div>

            </div>
          </div>
        </>
      )}
    </>
  );
}
