'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useGame } from './GameProvider';

// Attack effect config per type
const ATTACK_EFFECTS = {
  electric: { class: 'battle-lightning', color: '#fbbf24', emoji: '⚡', flash: 'bg-yellow-400' },
  fire: { class: 'battle-fire-burst', color: '#ef4444', emoji: '🔥', flash: 'bg-red-500' },
  water: { class: 'battle-water-splash', color: '#3b82f6', emoji: '💧', flash: 'bg-blue-500' },
  grass: { class: 'battle-grass-swirl', color: '#22c55e', emoji: '🌿', flash: 'bg-green-500' },
  ice: { class: 'battle-energy-burst', color: '#06b6d4', emoji: '❄️', flash: 'bg-cyan-400' },
  fighting: { class: 'battle-energy-burst', color: '#dc2626', emoji: '🥊', flash: 'bg-red-600' },
  poison: { class: 'battle-energy-burst', color: '#a855f7', emoji: '☠️', flash: 'bg-purple-500' },
  ground: { class: 'battle-energy-burst', color: '#a16207', emoji: '🌍', flash: 'bg-amber-700' },
  flying: { class: 'battle-energy-burst', color: '#0ea5e9', emoji: '🦅', flash: 'bg-sky-400' },
  psychic: { class: 'battle-energy-burst', color: '#d946ef', emoji: '🔮', flash: 'bg-fuchsia-500' },
  bug: { class: 'battle-energy-burst', color: '#84cc16', emoji: '🐛', flash: 'bg-lime-500' },
  rock: { class: 'battle-energy-burst', color: '#78716c', emoji: '🪨', flash: 'bg-stone-500' },
  ghost: { class: 'battle-energy-burst', color: '#7c3aed', emoji: '👻', flash: 'bg-violet-600' },
  dragon: { class: 'battle-energy-burst', color: '#6366f1', emoji: '🐉', flash: 'bg-indigo-500' },
  dark: { class: 'battle-energy-burst', color: '#52525b', emoji: '🌑', flash: 'bg-zinc-700' },
  steel: { class: 'battle-energy-burst', color: '#94a3b8', emoji: '⚙️', flash: 'bg-slate-400' },
  fairy: { class: 'battle-energy-burst', color: '#ec4899', emoji: '🧚', flash: 'bg-pink-400' },
  normal: { class: 'battle-energy-burst', color: '#a3a3a3', emoji: '⭐', flash: 'bg-gray-400' },
};

export default function BattleScene() {
  const {
    battle,
    playerAttack,
    catchInBattle,
    endBattle,
    pokeBalls,
    getAvailableMoves,
  } = useGame();

  const [showCatchAnim, setShowCatchAnim] = useState(false);
  const [attackEffect, setAttackEffect] = useState(null); // { type, target, damage }
  const [screenShake, setScreenShake] = useState(false);
  const prevLogLen = useRef(0);

  // Compute available moves once per battle
  const moves = useMemo(() => {
    if (!battle) return [];
    return getAvailableMoves(battle.player.types);
  }, [battle?.player?.uniqueId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Watch battle log for new entries → trigger visual effects
  useEffect(() => {
    if (!battle) return;
    const newEntries = battle.log.slice(prevLogLen.current);
    prevLogLen.current = battle.log.length;

    for (const entry of newEntries) {
      // Player attacked: "PIKACHU used Thunderbolt!..."
      const playerMatch = entry.match(/^(\w+) used (.+?)!/);
      if (playerMatch && playerMatch[1].toUpperCase() === battle.player.name.toUpperCase()) {
        const moveName = playerMatch[2];
        const move = moves.find(m => m.name === moveName);
        const dmgMatch = entry.match(/\((\d+) dmg\)/);
        const damage = dmgMatch ? parseInt(dmgMatch[1]) : 0;
        const type = move?.type || 'normal';
        setAttackEffect({ type, target: 'enemy', damage, key: Date.now() });
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 400);
        setTimeout(() => setAttackEffect(null), 600);
      }
      // Enemy attacked: "Wild PORYGON used Tackle!..."
      const enemyMatch = entry.match(/^Wild (\w+) used (.+?)!/);
      if (enemyMatch) {
        const dmgMatch = entry.match(/\((\d+) dmg\)/);
        const damage = dmgMatch ? parseInt(dmgMatch[1]) : 0;
        // Find enemy move type from name
        const enemyTypes = battle.enemy.types.map(t => t.type?.name || t);
        const type = enemyTypes[0] || 'normal';
        setAttackEffect({ type, target: 'player', damage, key: Date.now() });
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 400);
        setTimeout(() => setAttackEffect(null), 600);
      }
    }
  }, [battle?.log]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset log tracker when new battle starts
  useEffect(() => {
    if (battle && battle.log.length === 1) {
      prevLogLen.current = 1;
    }
  }, [battle?.player?.uniqueId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!battle) return null;

  const { player, enemy, playerHP, playerMaxHP, enemyHP, enemyMaxHP, turn, log, result, busy } = battle;

  const playerHPPercent = (playerHP / playerMaxHP) * 100;
  const enemyHPPercent = (enemyHP / enemyMaxHP) * 100;

  const handleAttack = (move) => {
    if (busy || turn !== 'player' || result) return;
    playerAttack(move);
  };

  const handleCatch = () => {
    if (busy || result || pokeBalls <= 0) return;
    setShowCatchAnim(true);
    setTimeout(() => setShowCatchAnim(false), 1500);
    catchInBattle();
  };

  // Get effect config
  const effectConfig = attackEffect ? ATTACK_EFFECTS[attackEffect.type] || ATTACK_EFFECTS.normal : null;
  const isPlayerHit = attackEffect?.target === 'player';
  const isEnemyHit = attackEffect?.target === 'enemy';
  const enemyFainted = result === 'win' || result === 'caught';
  const playerFainted = result === 'lose';

  // Result screen
  if (result) {
    const isWin = result === 'win';
    const isCaught = result === 'caught';
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-8">
        <div className={`text-4xl sm:text-6xl font-black mb-4 ${isWin || isCaught ? 'text-green-400' : 'text-red-400'} drop-shadow-[0_0_20px_currentColor]`}>
          {isCaught ? 'CAUGHT! 🎉' : isWin ? 'VICTORY! 🏆' : 'DEFEAT... 💀'}
        </div>
        
        <div className="bg-slate-900/80 border-2 border-yellow-500/50 rounded-xl p-4 max-w-md w-full mb-6">
          <p className="text-yellow-200 text-[10px] font-bold uppercase tracking-wider mb-2">Battle Log</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {log.slice(-5).map((entry, i) => (
              <p key={i} className="text-white text-[9px] sm:text-[10px] leading-relaxed">{entry}</p>
            ))}
          </div>
        </div>

        <button
          onClick={endBattle}
          className="px-8 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-black rounded-lg border-2 border-cyan-400 shadow-lg active:scale-95 transition-all uppercase tracking-wider text-xs cursor-pointer"
        >
          Continue Exploring →
        </button>
      </div>
    );
  }

  return (
    <div className={`absolute inset-0 z-50 flex flex-col bg-[#1e293b] select-none ${screenShake ? 'battle-shake' : ''}`}>
      {/* Attack flash overlay */}
      {effectConfig && (
        <div className={`absolute inset-0 z-30 pointer-events-none battle-flash ${effectConfig.flash}`} />
      )}
 
      {/* ===== BATTLE FIELD ===== */}
      <div className="relative flex-1 overflow-hidden w-full max-w-4xl mx-auto bg-gradient-to-b from-sky-300 via-sky-100 to-emerald-50 border-x-4 border-slate-900">
        {/* Enemy — top right */}
        <div className="absolute top-4 right-2 sm:top-6 sm:right-8 z-20 flex flex-col items-end">
          {/* Enemy HP Box */}
          <div className="bg-white/90 rounded-lg border-2 border-black p-1.5 sm:p-2 shadow-[2px_2px_0_rgba(0,0,0,1)] min-w-[110px] sm:min-w-[150px] mb-1">
            <div className="flex justify-between items-center mb-0.5">
              <span className="font-pressStart text-[7px] sm:text-[9px] text-black capitalize">{enemy.name}</span>
              <span className="text-[6px] sm:text-[7px] font-bold text-red-500">WILD</span>
            </div>
            <div className="h-1.5 sm:h-2 bg-gray-300 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${enemyHPPercent > 50 ? 'bg-green-500' : enemyHPPercent > 20 ? 'bg-yellow-400' : 'bg-red-500'}`}
                style={{ width: `${enemyHPPercent}%` }}
              />
            </div>
          </div>
          {/* Enemy Sprite & Platform Container */}
          <div className="relative w-20 h-20 sm:w-32 sm:h-32 ml-auto flex items-center justify-center">
            {/* Grassy platform background under the enemy */}
            {!showCatchAnim && !enemyFainted && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-6 sm:w-28 sm:h-8 bg-emerald-800/10 border border-emerald-800/5 rounded-full transform scale-y-[0.4] blur-[0.5px] z-0" />
            )}

            {isEnemyHit && attackEffect.damage > 0 && (
              <div
                key={attackEffect.key}
                className="absolute top-0 left-1/2 -translate-x-1/2 z-40 battle-damage-popup text-red-500 font-black text-lg sm:text-2xl"
                style={{ textShadow: '2px 2px 0 #000' }}
              >
                -{attackEffect.damage}
              </div>
            )}
            {isEnemyHit && effectConfig && (
              <div
                key={`fx-${attackEffect.key}`}
                className={`absolute inset-0 z-30 flex items-center justify-center ${effectConfig.class}`}
              >
                <span className="text-4xl sm:text-6xl" style={{ filter: `drop-shadow(0 0 10px ${effectConfig.color})` }}>
                  {effectConfig.emoji}
                </span>
              </div>
            )}
            {showCatchAnim ? (
              <div className="w-full h-full flex items-center justify-center z-10">
                <div className="w-12 h-12 rounded-full border-4 border-zinc-900 overflow-hidden relative animate-bounce">
                  <div className="absolute top-0 left-0 right-0 h-1/2 bg-red-600" />
                  <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white" />
                  <div className="absolute top-1/2 left-0 right-0 h-1 bg-zinc-900" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-zinc-900 rounded-full" />
                </div>
              </div>
            ) : (
              <div className="relative w-full h-full z-10">
                <Image
                  src={enemy.sprites.other['official-artwork'].front_default || enemy.sprites.front_default}
                  alt={enemy.name}
                  fill
                  className={`object-contain drop-shadow-md -scale-x-100 ${isEnemyHit ? 'battle-hit' : ''} ${enemyFainted ? 'battle-faint' : ''}`}
                  sizes="128px"
                  unoptimized
                />
              </div>
            )}
          </div>
        </div>
 
        {/* Player — bottom left */}
        <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-8 z-20 flex flex-col items-start">
          {/* Player Sprite & Platform Container */}
          <div className="relative w-20 h-20 sm:w-32 sm:h-32 flex items-center justify-center">
            {/* Grassy platform background under the player */}
            {!playerFainted && (
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-20 h-6 sm:w-28 sm:h-8 bg-emerald-800/15 border border-emerald-800/5 rounded-full transform scale-y-[0.4] blur-[0.5px] z-0" />
            )}

            {isPlayerHit && attackEffect.damage > 0 && (
              <div
                key={attackEffect.key}
                className="absolute top-0 left-1/2 -translate-x-1/2 z-40 battle-damage-popup text-red-500 font-black text-lg sm:text-2xl"
                style={{ textShadow: '2px 2px 0 #000' }}
              >
                -{attackEffect.damage}
              </div>
            )}
            {isPlayerHit && effectConfig && (
              <div
                key={`fx-${attackEffect.key}`}
                className={`absolute inset-0 z-30 flex items-center justify-center ${effectConfig.class}`}
              >
                <span className="text-4xl sm:text-6xl" style={{ filter: `drop-shadow(0 0 10px ${effectConfig.color})` }}>
                  {effectConfig.emoji}
                </span>
              </div>
            )}
            <div className="relative w-full h-full z-10">
              <Image
                src={player.sprites.other['official-artwork'].front_default || player.sprites.front_default}
                alt={player.name}
                fill
                className={`object-contain drop-shadow-md ${isPlayerHit ? 'battle-hit' : ''} ${playerFainted ? 'battle-faint' : ''}`}
                sizes="128px"
                unoptimized
              />
            </div>
          </div>
          {/* Player HP Box */}
          <div className="bg-white/90 rounded-lg border-2 border-black p-1.5 sm:p-2 shadow-[2px_2px_0_rgba(0,0,0,1)] min-w-[110px] sm:min-w-[150px] mt-1">
            <div className="flex justify-between items-center mb-0.5">
              <span className="font-pressStart text-[7px] sm:text-[9px] text-black capitalize">{player.name}</span>
              <span className="text-[6px] sm:text-[7px] font-bold text-gray-500">Lv.{player.level || 1}</span>
            </div>
            <div className="h-1.5 sm:h-2 bg-gray-300 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${playerHPPercent > 50 ? 'bg-green-500' : playerHPPercent > 20 ? 'bg-yellow-400' : 'bg-red-500'}`}
                style={{ width: `${playerHPPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
 
      {/* ===== Action area — simple, matches portfolio style ===== */}
      <div className="bg-white border-t-4 border-slate-900 p-3 sm:p-4 w-full">
        <div className="max-w-4xl mx-auto w-full">
          {/* Battle message */}
          <p className="font-pressStart text-[8px] sm:text-[9px] text-slate-800 mb-3 leading-relaxed min-h-[30px] flex items-center">
            {log[log.length - 1]}
            {busy && <span className="inline-block w-1.5 h-3 bg-black ml-1 animate-pulse" />}
          </p>
          {/* Buttons — simple grid */}
          <div className="grid grid-cols-2 gap-2">
            {moves.slice(0, 2).map((move, i) => (
              <button
                key={i}
                onClick={() => handleAttack(move)}
                disabled={busy || turn !== 'player'}
                className="py-2.5 px-3 bg-white border-2 border-black hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-[2px_2px_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-left rounded"
              >
                <p className="font-pressStart text-[7px] sm:text-[8px] text-black">{move.name}</p>
                <p className="text-[6px] sm:text-[7px] text-gray-500 capitalize">{move.type} · {move.power}</p>
              </button>
            ))}
            <button
              onClick={handleCatch}
              disabled={busy || pokeBalls <= 0}
              className="py-2.5 px-3 bg-[#f8b800] border-2 border-black hover:bg-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed shadow-[2px_2px_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-left rounded"
            >
              <p className="font-pressStart text-[7px] sm:text-[8px] text-black">🎯 BALL</p>
              <p className="text-[6px] sm:text-[7px] text-black/60">×{pokeBalls}</p>
            </button>
            <button
              onClick={endBattle}
              disabled={busy}
              className="py-2.5 px-3 bg-white border-2 border-black hover:bg-slate-50 disabled:opacity-40 shadow-[2px_2px_0_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer text-left rounded"
            >
              <p className="font-pressStart text-[7px] sm:text-[8px] text-black">🏃 RUN</p>
              <p className="text-[6px] sm:text-[7px] text-gray-500">Escape</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
