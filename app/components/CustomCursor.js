// src/components/CustomCursor.js
'use client'

import { useEffect, useState } from 'react'

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 })
  const [isPointer, setIsPointer] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    // Only enable on devices with a fine pointer (mouse), not touch screens
    const mq = window.matchMedia('(pointer: fine)')
    if (!mq.matches) return
    setEnabled(true)

    // Hide the native cursor only when our custom cursor is active
    document.body.style.cursor = 'none'

    const move = (e) => {
      setPosition({ x: e.clientX, y: e.clientY })
      const target = e.target.closest('button, a, [role="button"], .cursor-pointer, input, textarea, select, label')
      setIsPointer(Boolean(target))
    }

    const down = () => setIsClicking(true)
    const up = () => setIsClicking(false)

    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', down)
    window.addEventListener('mouseup', up)

    return () => {
      document.body.style.cursor = ''
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
      window.removeEventListener('mouseup', up)
    }
  }, [])

  if (!enabled) return null

  return (
    <div
      className="fixed z-[9999] pointer-events-none"
      style={{
        left: position.x,
        top: position.y,
        transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : 1})`,
        transition: 'transform 80ms ease-out',
      }}
      aria-hidden="true"
    >
      {/* Pokeball cursor - inline SVG so it doesn't depend on an external file */}
      <svg
        width="28"
        height="28"
        viewBox="0 0 32 32"
        style={{
          filter: isPointer
            ? 'drop-shadow(0 0 6px rgba(248,184,0,0.9))'
            : 'drop-shadow(2px 2px 0px rgba(0,0,0,0.5))',
          transition: 'filter 150ms ease-out',
        }}
      >
        {/* Outer ring */}
        <circle cx="16" cy="16" r="15" fill="#ffffff" stroke="#1a1a1a" strokeWidth="2" />
        {/* Top red half */}
        <path d="M 1 16 A 15 15 0 0 1 31 16 L 1 16 Z" fill="#dc2626" stroke="#1a1a1a" strokeWidth="2" />
        {/* Center band */}
        <rect x="1" y="14" width="30" height="4" fill="#1a1a1a" />
        {/* Center button */}
        <circle cx="16" cy="16" r="5" fill="#ffffff" stroke="#1a1a1a" strokeWidth="2" />
        <circle cx="16" cy="16" r="2.5" fill={isPointer ? '#f8b800' : '#ffffff'} stroke="#1a1a1a" strokeWidth="1" />
      </svg>
    </div>
  )
}
