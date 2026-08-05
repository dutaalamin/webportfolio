'use client';

let audioCtx = null;
let activeOsc = null;
let activeGain = null;

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const audioManager = {
  startCharge() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      this.stopCharge(); // Clean up if any previous is running

      activeOsc = ctx.createOscillator();
      activeGain = ctx.createGain();

      // Triangle wave creates a nice retro gaming sound
      activeOsc.type = 'triangle';
      activeOsc.frequency.setValueAtTime(160, ctx.currentTime); // Start low

      // Quiet initial volume
      activeGain.gain.setValueAtTime(0.04, ctx.currentTime);

      activeOsc.connect(activeGain);
      activeGain.connect(ctx.destination);

      activeOsc.start();
    } catch (e) {
      console.warn("Failed to start charge sound:", e);
    }
  },

  updateCharge(power) {
    try {
      const ctx = getAudioContext();
      if (!ctx || !activeOsc || !activeGain) return;

      // Map power (0-100) to frequency (160Hz - 660Hz)
      const freq = 160 + (power * 5.0);
      activeOsc.frequency.setValueAtTime(freq, ctx.currentTime);

      // Slightly scale volume with power for intensity feel
      const vol = 0.04 + (power * 0.0006);
      activeGain.gain.setValueAtTime(vol, ctx.currentTime);
    } catch (e) {
      console.warn("Failed to update charge sound:", e);
    }
  },

  stopCharge() {
    try {
      if (activeOsc) {
        activeOsc.stop();
        activeOsc.disconnect();
        activeOsc = null;
      }
      if (activeGain) {
        activeGain.disconnect();
        activeGain = null;
      }
    } catch (e) {
      // Ignore cleanup failures
    }
  },

  playThrow() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Whoosh laser throw sound
      osc.type = 'sine';
      osc.frequency.setValueAtTime(700, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.22);

      gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.01, ctx.currentTime + 0.22);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.22);
    } catch (e) {
      console.warn("Failed to play throw sound:", e);
    }
  },

  playSuccess() {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Classic 8-bit success chime
      osc.type = 'square'; 
      
      const now = ctx.currentTime;
      // Notes sequence
      osc.frequency.setValueAtTime(523.25, now);
      osc.frequency.setValueAtTime(659.25, now + 0.15);
      osc.frequency.setValueAtTime(783.99, now + 0.3);
      osc.frequency.setValueAtTime(1046.50, now + 0.45);

      gainNode.gain.setValueAtTime(0.0, now);
      gainNode.gain.linearRampToValueAtTime(0.08, now + 0.05);
      gainNode.gain.setValueAtTime(0.08, now + 0.6);
      gainNode.gain.linearRampToValueAtTime(0.0, now + 0.8);

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.8);
    } catch (e) {
      console.warn("Failed to play success sound:", e);
    }
  }
};
