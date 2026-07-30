'use client';

import { useEffect } from 'react';

export default function DisableZoom() {
  useEffect(() => {
    // Mencegah pinch-to-zoom di iOS Safari
    const preventPinchZoom = (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    };

    // Mencegah double-tap to zoom di iOS Safari
    let lastTouchEnd = 0;
    const preventDoubleTapZoom = (e) => {
      const now = (new Date()).getTime();
      if (now - lastTouchEnd <= 300) {
        e.preventDefault();
      }
      lastTouchEnd = now;
    };

    document.addEventListener('touchmove', preventPinchZoom, { passive: false });
    document.addEventListener('touchend', preventDoubleTapZoom, { passive: false });

    return () => {
      document.removeEventListener('touchmove', preventPinchZoom);
      document.removeEventListener('touchend', preventDoubleTapZoom);
    };
  }, []);

  return null;
}
