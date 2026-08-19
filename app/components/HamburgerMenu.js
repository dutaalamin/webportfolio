"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function HamburgerMenu({ menuItems = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const pathname = usePathname();

  const closeMenu = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 250);
  }, []);

  const openMenu = useCallback(() => {
    if (!isOpen && !isClosing) {
      setIsOpen(true);
    }
  }, [isOpen, isClosing]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (isOpen) {
          closeMenu();
        } else {
          openMenu();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeMenu, openMenu]);

  const menuIcons = {
    'Home': '🏠',
    'About': '📜',
    'Experience': '⚔️',
    'Portfolio': '🎴',
    'Game': '🎮',
    'Map': '🗺️',
  };

  return (
    <>
      {/* Tombol Hamburger */}
      <button
        onClick={openMenu}
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
          {/* Light transparent backdrop — background tetap keliatan */}
          <div
            className={`fixed inset-0 z-50 pm-backdrop ${isClosing ? 'pm-backdrop-out' : ''}`}
            onClick={closeMenu}
          />

          {/* Menu Window */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <div
              className={`pointer-events-auto relative w-full max-w-[320px] md:max-w-[450px] lg:max-w-[520px] font-pressStart flex flex-col pm-window ${
                isClosing ? 'pm-window-out' : 'pm-window-in'
              }`}
            >
              {/* Decorative Corners Removed */}

              {/* Header */}
              <div className="pm-header">
                <h2 className="text-[10px] md:text-xs tracking-wider pm-header-title">
                  MENU
                </h2>

                {/* Close Button */}
                <button
                  onClick={closeMenu}
                  className="pm-close-btn"
                  aria-label="Close Menu"
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path d="M2 2L10 10M10 2L2 10" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* Divider */}
              <div className="pm-divider">
                <div className="pm-divider-line" />
                <span className="pm-divider-text">SELECT STAGE</span>
                <div className="pm-divider-line" />
              </div>

              {/* Menu Items */}
              <div className="pm-menu-list">
                {menuItems.map((item, index) => {
                  const isActive = pathname === item.href;
                  const isHovered = hoveredIndex === index;
                  const showHighlight = isActive || isHovered;
                  const icon = menuIcons[item.label] || '▸';

                  const content = (
                    <div
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      className={`pm-menu-item ${showHighlight ? 'pm-menu-item-active' : ''} ${
                        isActive ? 'pm-menu-item-current' : ''
                      }`}
                      style={{
                        animationDelay: !isClosing ? `${index * 50}ms` : '0ms',
                      }}
                    >
                      {/* Cursor Arrow */}
                      <div className={`pm-cursor ${showHighlight ? 'pm-cursor-visible' : ''}`}>
                        ▶
                      </div>

                      {/* Icon + Label */}
                      <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                        <span className="text-xs md:text-sm">{icon}</span>
                        <span
                          className={`text-[9px] md:text-[11px] tracking-wide transition-all duration-200 ${
                            showHighlight ? 'pm-label-active' : ''
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>

                      {/* Active Badge */}
                      {isActive && (
                        <span className="pm-here-badge">
                          HERE
                        </span>
                      )}

                      {/* Hover Arrow */}
                      {isHovered && !isActive && (
                        <span className="pm-go-arrow">→</span>
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
                        onClick={closeMenu}
                      >
                        {content}
                      </a>
                    );
                  }

                  return (
                    <Link
                      key={index}
                      href={item.href}
                      onClick={closeMenu}
                    >
                      {content}
                    </Link>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="pm-footer">
                <div className="pm-footer-keys">
                  <span className="pm-key">ESC</span>
                  <span className="text-[6px] md:text-[7px] text-gray-400">RESUME</span>
                </div>
                <p className="pm-footer-text">
                  TAP ANYWHERE TO RESUME
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      <style jsx>{`
        /* ==========================================
           PAUSE MENU — LIGHT RPG THEME
        ========================================== */

        /* Backdrop — transparan, background tetap keliatan */
        .pm-backdrop {
          background: rgba(255, 255, 255, 0.45);
          backdrop-filter: blur(4px);
          animation: pmBackdropIn 0.25s ease-out forwards;
        }
        .pm-backdrop-out {
          animation: pmBackdropOut 0.25s ease-in forwards;
        }

        @keyframes pmBackdropIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pmBackdropOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        /* Main Window — white card with retro border */
        .pm-window {
          background: #ffffff;
          border: 4px solid #222;
          border-radius: 12px;
          padding: 0;
          overflow: hidden;
        }

        .pm-window-in {
          animation: pmWindowIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .pm-window-out {
          animation: pmWindowOut 0.2s ease-in forwards;
        }

        @keyframes pmWindowIn {
          from {
            opacity: 0;
            transform: scale(0.88) translateY(16px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes pmWindowOut {
          from {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
          to {
            opacity: 0;
            transform: scale(0.92) translateY(10px);
          }
        }

        /* Decorative Corners Removed */

        /* Header */
        .pm-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          background: #f8b800;
          border-bottom: 3px solid #222;
        }

        @media (min-width: 768px) {
          .pm-header { padding: 16px 24px; }
        }

        .pm-header-title {
          color: #222;
          font-weight: bold;
          text-shadow: 1px 1px 0 rgba(255,255,255,0.3);
        }

        /* Close Button */
        .pm-close-btn {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid #222;
          border-radius: 4px;
          background: #ef4444;
          color: white;
          cursor: pointer;
          transition: all 0.15s;
          box-shadow: 2px 2px 0px 0px rgba(0,0,0,1);
        }
        .pm-close-btn:hover {
          background: #dc2626;
          transform: translateY(-1px);
          box-shadow: 3px 3px 0px 0px rgba(0,0,0,1);
        }
        .pm-close-btn:active {
          transform: translateY(1px);
          box-shadow: 1px 1px 0px 0px rgba(0,0,0,1);
        }

        @media (min-width: 768px) {
          .pm-close-btn { width: 32px; height: 32px; }
        }

        /* Divider */
        .pm-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
        }

        @media (min-width: 768px) {
          .pm-divider { padding: 14px 24px; }
        }

        .pm-divider-line {
          flex: 1;
          height: 2px;
          background: repeating-linear-gradient(
            90deg,
            #ddd 0px, #ddd 4px,
            transparent 4px, transparent 8px
          );
        }

        .pm-divider-text {
          font-size: 7px;
          color: #999;
          letter-spacing: 2px;
          white-space: nowrap;
        }

        @media (min-width: 768px) {
          .pm-divider-text { font-size: 8px; letter-spacing: 3px; }
        }

        /* Menu Items List */
        .pm-menu-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          padding: 0 14px 14px;
        }

        @media (min-width: 768px) {
          .pm-menu-list { padding: 0 18px 18px; gap: 3px; }
        }

        /* Individual Menu Item */
        .pm-menu-item {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 10px 12px;
          border-radius: 8px;
          border: 2px solid transparent;
          cursor: pointer;
          transition: all 0.2s ease-out;
          color: #666;
          position: relative;
          animation: pmItemSlideIn 0.35s ease-out both;
        }

        @media (min-width: 768px) {
          .pm-menu-item { padding: 12px 16px; }
        }

        @keyframes pmItemSlideIn {
          from {
            opacity: 0;
            transform: translateX(-16px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .pm-menu-item-active {
          color: #222;
          background: #fef9e7;
          border-color: #f8b800;
          box-shadow: 2px 2px 0px 0px rgba(0,0,0,0.15);
        }

        .pm-menu-item-current {
          background: linear-gradient(90deg, rgba(248,184,0,0.12) 0%, rgba(248,184,0,0.04) 100%);
          border-color: #f8b800;
          box-shadow: 3px 3px 0px 0px rgba(248,184,0,0.3);
        }

        /* Cursor Arrow */
        .pm-cursor {
          font-size: 8px;
          color: #f8b800;
          opacity: 0;
          transform: translateX(-6px);
          transition: all 0.2s ease-out;
          min-width: 14px;
          filter: drop-shadow(1px 1px 0 rgba(0,0,0,0.2));
        }

        @media (min-width: 768px) {
          .pm-cursor { font-size: 10px; min-width: 18px; }
        }

        .pm-cursor-visible {
          opacity: 1;
          transform: translateX(0);
          animation: pmCursorBounce 0.7s ease-in-out infinite;
        }

        @keyframes pmCursorBounce {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(3px); }
        }

        /* Label Active State */
        .pm-label-active {
          color: #222;
          font-weight: bold;
        }

        /* HERE Badge */
        .pm-here-badge {
          font-size: 6px;
          padding: 2px 8px;
          background: #222;
          color: #fff;
          border-radius: 3px;
          letter-spacing: 2px;
          box-shadow: 2px 2px 0px 0px rgba(248,184,0,0.5);
        }

        @media (min-width: 768px) {
          .pm-here-badge { font-size: 7px; padding: 3px 10px; }
        }

        /* Go Arrow */
        .pm-go-arrow {
          font-size: 10px;
          color: #f8b800;
          animation: pmArrowSlide 0.3s ease-out;
          filter: drop-shadow(1px 1px 0 rgba(0,0,0,0.15));
        }

        @keyframes pmArrowSlide {
          from { opacity: 0; transform: translateX(-4px); }
          to { opacity: 1; transform: translateX(0); }
        }

        /* Footer */
        .pm-footer {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 10px 20px;
          border-top: 2px solid #eee;
          background: #fafafa;
        }

        @media (min-width: 768px) {
          .pm-footer { padding: 12px 24px; }
        }

        .pm-footer-keys {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .pm-key {
          font-size: 6px;
          padding: 2px 6px;
          border: 2px solid #ddd;
          border-radius: 3px;
          color: #999;
          background: #fff;
          letter-spacing: 1px;
          box-shadow: 0 2px 0 #ccc;
        }

        .pm-footer-text {
          font-size: 6px;
          color: #bbb;
          letter-spacing: 2px;
          animation: pmFooterPulse 3s ease-in-out infinite;
        }

        @media (min-width: 768px) {
          .pm-footer-text { font-size: 7px; }
        }

        @keyframes pmFooterPulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>
    </>
  );
}
