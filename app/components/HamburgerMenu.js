"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function HamburgerMenu({ menuItems = [] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Tombol Hamburger */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed z-50 top-4 right-4 w-12 h-12 md:hidden cursor-pointer"
        aria-label="Open Menu"
      >
        <Image
          src="/images/hamburger.png"
          alt="Hamburger"
          fill
          className="object-contain"
          priority
        />
      </button>

      {/* Overlay Menu */}
      {isOpen && (
        <>
          {/* Latar belakang blur */}
          <div
            className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Popup Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="relative bg-white border-[2px] border-gray-900 w-[300px] min-h-[400px] sm:w-[300px] px-6 pt-8 pb-6 shadow-sm shadow-gray-900 flex flex-col items-start text-sm text-black rounded-4xl">
              {/* Tombol Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute right-4 w-8 h-8 rounded-full bg-gray-700 hover:bg-black text-white text-lg leading-none flex items-center justify-center shadow-xl cursor-pointer"
                aria-label="Close Menu"
              >
                ✕
              </button>

              {/* Judul atau Header */}
              <div className="text-lg pt-2 font-bold mb-4 w-full pb-2">
                MENU
              </div>

              {/* Daftar Menu */}
              <div className="space-y-2 w-full">
                {menuItems.map((item, index) => {
                  const linkClass =
                    "block hover:text-black text-gray-500 text-left transition-all";

                  if (item.isPDF || item.isExternal) {
                    return (
                      <a
                        key={index}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        ▸ {item.label}
                      </a>
                    );
                  }

                  return (
                    <Link key={index} href={item.href} className={linkClass}>
                      ▸ {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
