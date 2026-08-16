'use client';

import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { audioManager } from '../utils/audio';

const GameContext = createContext();

const LEGENDARY_IDS = [144, 145, 146, 150, 151]; // Articuno, Zapdos, Moltres, Mewtwo, Mew

// Helper to trim down PokeAPI response to only what is needed by the UI.
// This prevents localStorage QuotaExceededError (keeps each record < 1KB instead of 200KB).
const trimPokemon = (p) => {
  if (!p) return null;
  return {
    id: p.id,
    name: p.name,
    types: p.types ? p.types.map(t => ({
      type: { name: t.type?.name || t.type }
    })) : [],
    sprites: {
      front_default: p.sprites?.front_default,
      other: {
        'official-artwork': {
          front_default: p.sprites?.other?.['official-artwork']?.front_default || p.sprites?.front_default
        }
      }
    },
    height: p.height,
    weight: p.weight,
    stats: p.stats ? p.stats.map(s => ({
      base_stat: s.base_stat,
      stat: { name: s.stat?.name || s.stat }
    })) : [],
    caughtAt: p.caughtAt || new Date().toISOString(),
    uniqueId: p.uniqueId || `${p.id}-${Date.now()}`,
    level: p.level || 1,
    cp: p.cp || 10, // Combat Power (starts low, grows with upgrades)
  };
};

// Calculate CP based on base stats and level
const calculateCP = (stats, level) => {
  if (!stats || stats.length === 0) return 10 * level;
  const sum = stats.reduce((acc, s) => acc + s.base_stat, 0);
  // CP scales with level: base sum * level * 0.1
  return Math.round(sum * level * 0.1);
};

// Stardust cost to upgrade (scales with level)
const upgradeCost = (level) => 100 + (level - 1) * 50;

// Candy cost to evolve (25 is Pokemon GO standard)
const EVOLVE_CANDY_COST = 25;

// Type effectiveness chart (attacker → defender multiplier)
// 2 = super effective, 0.5 = not very effective, 0 = immune, 1 = neutral
const TYPE_CHART = {
  fire:     { grass: 2, water: 0.5, fire: 0.5, ice: 2, bug: 2, steel: 2, rock: 0.5, dragon: 0.5 },
  water:    { fire: 2, grass: 0.5, water: 0.5, ground: 2, rock: 2, dragon: 0.5 },
  grass:    { fire: 0.5, water: 2, grass: 0.5, ground: 2, rock: 2, flying: 0.5, bug: 0.5, poison: 0.5, dragon: 0.5 },
  electric: { water: 2, electric: 0.5, grass: 0.5, flying: 2, ground: 0, dragon: 0.5 },
  ice:      { grass: 2, fire: 0.5, water: 0.5, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
  fighting: { normal: 2, ice: 2, rock: 2, dark: 2, steel: 2, flying: 0.5, psychic: 0.5, bug: 0.5, fairy: 0.5, poison: 0.5, ghost: 0 },
  poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
  ground:   { fire: 2, electric: 2, grass: 0.5, poison: 2, rock: 2, bug: 0.5, flying: 0, steel: 2 },
  flying:   { grass: 2, electric: 0.5, ice: 0.5, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
  psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
  bug:      { grass: 2, fire: 0.5, fighting: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5, poison: 0.5 },
  rock:     { fire: 2, ice: 2, grass: 0.5, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
  ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
  dragon:   { dragon: 2, steel: 0.5, fairy: 0 },
  dark:     { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
  steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
  fairy:    { fire: 0.5, fighting: 2, dragon: 2, dark: 2, poison: 0.5, steel: 0.5 },
  normal:   { rock: 0.5, ghost: 0, steel: 0.5 },
};

// Get type effectiveness multiplier
const getTypeMultiplier = (attackType, defenderTypes) => {
  let multiplier = 1;
  for (const def of defenderTypes) {
    const defName = def.type?.name || def;
    const m = TYPE_CHART[attackType]?.[defName];
    if (m !== undefined) multiplier *= m;
  }
  return multiplier;
};

// Move pool — real Pokemon moves per type (simple but authentic)
const MOVES_BY_TYPE = {
  fire: [
    { name: 'Ember', power: 40 },
    { name: 'Flamethrower', power: 90 },
    { name: 'Fire Fang', power: 65 },
  ],
  water: [
    { name: 'Water Gun', power: 40 },
    { name: 'Surf', power: 90 },
    { name: 'Aqua Tail', power: 90 },
  ],
  grass: [
    { name: 'Vine Whip', power: 45 },
    { name: 'Razor Leaf', power: 55 },
    { name: 'Solar Beam', power: 120 },
  ],
  electric: [
    { name: 'Thunder Shock', power: 40 },
    { name: 'Thunderbolt', power: 90 },
    { name: 'Spark', power: 65 },
  ],
  ice: [
    { name: 'Ice Beam', power: 90 },
    { name: 'Powder Snow', power: 40 },
  ],
  fighting: [
    { name: 'Karate Chop', power: 50 },
    { name: 'Brick Break', power: 75 },
    { name: 'Close Combat', power: 120 },
  ],
  poison: [
    { name: 'Poison Sting', power: 15 },
    { name: 'Sludge Bomb', power: 90 },
  ],
  ground: [
    { name: 'Earthquake', power: 100 },
    { name: 'Dig', power: 80 },
  ],
  flying: [
    { name: 'Wing Attack', power: 60 },
    { name: 'Aerial Ace', power: 60 },
  ],
  psychic: [
    { name: 'Confusion', power: 50 },
    { name: 'Psychic', power: 90 },
    { name: 'Psybeam', power: 65 },
  ],
  bug: [
    { name: 'Bug Bite', power: 60 },
    { name: 'Pin Missile', power: 25 },
  ],
  rock: [
    { name: 'Rock Throw', power: 50 },
    { name: 'Rock Slide', power: 75 },
  ],
  ghost: [
    { name: 'Lick', power: 30 },
    { name: 'Shadow Ball', power: 80 },
  ],
  dragon: [
    { name: 'Dragon Rage', power: 40 },
    { name: 'Outrage', power: 120 },
  ],
  dark: [
    { name: 'Bite', power: 60 },
    { name: 'Crunch', power: 80 },
  ],
  steel: [
    { name: 'Metal Claw', power: 50 },
    { name: 'Iron Head', power: 80 },
  ],
  fairy: [
    { name: 'Fairy Wind', power: 40 },
    { name: 'Moonblast', power: 95 },
  ],
  normal: [
    { name: 'Tackle', power: 40 },
    { name: 'Body Slam', power: 85 },
    { name: 'Quick Attack', power: 40 },
  ],
};

// Get a random move for a Pokemon type
const getRandomMove = (types) => {
  const typeList = types.map(t => t.type?.name || t).filter(t => MOVES_BY_TYPE[t]);
  if (typeList.length === 0) {
    const moves = MOVES_BY_TYPE.normal;
    return { ...moves[Math.floor(Math.random() * moves.length)], type: 'normal' };
  }
  const typeName = typeList[Math.floor(Math.random() * typeList.length)];
  const moves = MOVES_BY_TYPE[typeName];
  return { ...moves[Math.floor(Math.random() * moves.length)], type: typeName };
};

// Get all available moves for a Pokemon (1-2 moves per type)
const getAvailableMoves = (types) => {
  const moves = [];
  for (const t of types) {
    const typeName = t.type?.name || t;
    const pool = MOVES_BY_TYPE[typeName] || MOVES_BY_TYPE.normal;
    // Pick 1-2 moves from each type
    const count = Math.min(pool.length, types.length === 1 ? 2 : 1);
    const shuffled = [...pool].sort(() => Math.random() - 0.5).slice(0, count);
    shuffled.forEach(m => moves.push({ ...m, type: typeName }));
  }
  return moves.length > 0 ? moves : [{ ...MOVES_BY_TYPE.normal[0], type: 'normal' }];
};

// Calculate damage for a battle move (uses move power)
const calcDamage = (attacker, defender, move) => {
  const level = attacker.level || 1;
  const movePower = move.power || 40;
  
  const atkStat = attacker.stats.find(s => s.stat.name === 'attack')?.base_stat || 50;
  const defStat = defender.stats.find(s => s.stat.name === 'defense')?.base_stat || 50;
  
  const typeMult = getTypeMultiplier(move.type, defender.types || []);
  
  const attackerTypes = (attacker.types || []).map(t => t.type?.name || t);
  const stab = attackerTypes.includes(move.type) ? 1.5 : 1;
  
  const random = 0.85 + Math.random() * 0.15;
  
  const damage = Math.floor(((2 * level / 5 + 2) * movePower * atkStat / defStat / 50 + 2) * stab * typeMult * random);
  
  return { damage: Math.max(1, damage), typeMult, stab };
};

// Starter Pokemon for session-based play (no persistence)
const STARTER_POKEMON = [
  {
    id: 25, name: 'pikachu',
    types: [{ type: { name: 'electric' } }],
    sprites: {
      front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      other: { 'official-artwork': { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png' } }
    },
    height: 4, weight: 60,
    stats: [
      { base_stat: 35, stat: { name: 'hp' } },
      { base_stat: 55, stat: { name: 'attack' } },
      { base_stat: 40, stat: { name: 'defense' } },
      { base_stat: 50, stat: { name: 'special-attack' } },
      { base_stat: 50, stat: { name: 'special-defense' } },
      { base_stat: 90, stat: { name: 'speed' } },
    ],
    caughtAt: new Date().toISOString(),
    uniqueId: 'starter-pikachu',
    level: 5, cp: 160,
  },
  {
    id: 4, name: 'charmander',
    types: [{ type: { name: 'fire' } }],
    sprites: {
      front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
      other: { 'official-artwork': { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/4.png' } }
    },
    height: 6, weight: 85,
    stats: [
      { base_stat: 39, stat: { name: 'hp' } },
      { base_stat: 52, stat: { name: 'attack' } },
      { base_stat: 43, stat: { name: 'defense' } },
      { base_stat: 60, stat: { name: 'special-attack' } },
      { base_stat: 50, stat: { name: 'special-defense' } },
      { base_stat: 65, stat: { name: 'speed' } },
    ],
    caughtAt: new Date().toISOString(),
    uniqueId: 'starter-charmander',
    level: 5, cp: 155,
  },
  {
    id: 1, name: 'bulbasaur',
    types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
    sprites: {
      front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      other: { 'official-artwork': { front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png' } }
    },
    height: 7, weight: 69,
    stats: [
      { base_stat: 45, stat: { name: 'hp' } },
      { base_stat: 49, stat: { name: 'attack' } },
      { base_stat: 49, stat: { name: 'defense' } },
      { base_stat: 65, stat: { name: 'special-attack' } },
      { base_stat: 65, stat: { name: 'special-defense' } },
      { base_stat: 45, stat: { name: 'speed' } },
    ],
    caughtAt: new Date().toISOString(),
    uniqueId: 'starter-bulbasaur',
    level: 5, cp: 160,
  },
];

export function GameProvider({ children }) {
  // Session-based only — no localStorage persistence
  const [caughtPokemon, setCaughtPokemon] = useState([]);
  const [currentEncounter, setCurrentEncounter] = useState(null);
  const [gameState, setGameState] = useState('exploring');
  const [shakeCount, setShakeCount] = useState(0);
  const [error, setError] = useState(null);
  const [pokeBalls, setPokeBalls] = useState(10);
  const [lastThrowPower, setLastThrowPower] = useState(0);
  const [refillIn, setRefillIn] = useState(0);
  const [stardust, setStardust] = useState(500);
  const [candy, setCandy] = useState({});
  // Auto-battle state
  const [autoBattle, setAutoBattle] = useState(null);

  const MAX_BALLS = 10;
  const REFILL_INTERVAL = 30;

  // Auto-refill: +1 Poke Ball every REFILL_INTERVAL seconds when below MAX_BALLS
  useEffect(() => {
    if (pokeBalls >= MAX_BALLS) {
      setRefillIn(0);
      return;
    }

    setRefillIn(REFILL_INTERVAL);
    const interval = setInterval(() => {
      setRefillIn((prev) => {
        if (prev <= 1) {
          // Time to refill
          setPokeBalls((balls) => Math.min(MAX_BALLS, balls + 1));
          return pokeBalls + 1 >= MAX_BALLS ? 0 : REFILL_INTERVAL;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [pokeBalls]);

  // Fetch initial random encounter on mount
  useEffect(() => {
    getNewEncounter();
  }, []);

  const getNewEncounter = async () => {
    setGameState('loading');
    setError(null);
    try {
      // Pick a random Generation 1 Pokemon (1-151)
      const randomId = Math.floor(Math.random() * 151) + 1;
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      if (!res.ok) throw new Error("Failed to fetch Pokemon");
      const data = await res.json();
      setCurrentEncounter(data);
      setGameState('idle');
      setShakeCount(0);
    } catch (err) {
      console.error(err);
      setError("Failed to summon a wild Pokémon. Please try again.");
      setGameState('idle');
    }
  };

  const releasePokemon = (uniqueId) => {
    setCaughtPokemon(prev => prev.filter(p => p.uniqueId !== uniqueId));
  };

  const throwPokeBall = (power = 50) => {
    if (gameState !== 'idle' || !currentEncounter) return;

    setLastThrowPower(power);
    setGameState('throwing');
    setShakeCount(0);

    // 1. Throw animation takes 400ms
    setTimeout(() => {
      setGameState('shaking');
      setShakeCount(1);
      
      const isLegendary = LEGENDARY_IDS.includes(currentEncounter.id);
      const baseStatSum = currentEncounter.stats.reduce((acc, stat) => acc + stat.base_stat, 0);

      const runShake = (currentShake) => {
        if (currentShake < 3) {
          // Survived this shake, continue
          setTimeout(() => {
            setShakeCount(currentShake + 1);
            runShake(currentShake + 1);
          }, 400);
        } else {
          // 3 shakes completed -> CAUGHT!
          setTimeout(() => {
            setGameState('caught');
            audioManager.playSuccess();
            setPokeBalls((prev) => prev + 1);
            const stardustReward = isLegendary ? 500 : baseStatSum > 450 ? 100 : baseStatSum > 350 ? 50 : 25;
            setStardust((prev) => prev + stardustReward);
            setCandy((prev) => ({
              ...prev,
              [currentEncounter.id]: (prev[currentEncounter.id] || 0) + 3,
            }));
            const newCatch = trimPokemon({
              ...currentEncounter,
              caughtAt: new Date().toISOString(),
              uniqueId: `${currentEncounter.id}-${Date.now()}`,
              level: 5,
              cp: calculateCP(currentEncounter.stats, 5),
            });
            setCaughtPokemon(prev => {
              const updated = [newCatch, ...prev];
              return updated;
            });
          }, 400);
        }
      };

      runShake(0);
    }, 400);
  };

  // Refill Poke Balls (e.g., daily reset or reward)
  const refillPokeBalls = (amount = 10) => {
    setPokeBalls((prev) => prev + amount);
  };

  // Upgrade Pokemon level (costs Stardust)
  const upgradePokemon = (uniqueId) => {
    const pokemon = caughtPokemon.find(p => p.uniqueId === uniqueId);
    if (!pokemon) return false;

    const cost = upgradeCost(pokemon.level);
    if (stardust < cost) return false;
    if (pokemon.level >= 50) return false; // Max level cap

    setStardust((prev) => prev - cost);
    setCaughtPokemon(prev => prev.map(p => {
      if (p.uniqueId !== uniqueId) return p;
      const newLevel = p.level + 1;
      return {
        ...p,
        level: newLevel,
        cp: calculateCP(p.stats, newLevel),
      };
    }));
    return true;
  };

  // Evolve Pokemon (costs 25 Candy of that species)
  const evolvePokemon = async (uniqueId) => {
    const pokemon = caughtPokemon.find(p => p.uniqueId === uniqueId);
    if (!pokemon) return false;

    const speciesCandy = candy[pokemon.id] || 0;
    if (speciesCandy < EVOLVE_CANDY_COST) return false;

    // Fetch evolution chain from PokeAPI
    try {
      const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon.id}`);
      if (!speciesRes.ok) throw new Error('Failed to fetch species');
      const speciesData = await speciesRes.json();

      const chainRes = await fetch(speciesData.evolution_chain.url);
      if (!chainRes.ok) throw new Error('Failed to fetch evolution chain');
      const chainData = await chainRes.json();

      // Find next evolution in the chain
      const findNextEvo = (node, currentId) => {
        if (node.species && node.species.url) {
          const id = parseInt(node.species.url.split('/').filter(Boolean).pop(), 10);
          if (id === currentId && node.evolves_to && node.evolves_to.length > 0) {
            const next = node.evolves_to[0];
            const nextId = parseInt(next.species.url.split('/').filter(Boolean).pop(), 10);
            return { id: nextId, name: next.species.name };
          }
        }
        for (const child of (node.evolves_to || [])) {
          const result = findNextEvo(child, currentId);
          if (result) return result;
        }
        return null;
      };

      const nextEvo = findNextEvo(chainData.chain, pokemon.id);
      if (!nextEvo) return false; // No evolution available

      // Fetch evolved Pokemon data
      const evoRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${nextEvo.id}`);
      if (!evoRes.ok) throw new Error('Failed to fetch evolved pokemon');
      const evoData = await evoRes.json();

      // Consume candy
      setCandy(prev => ({
        ...prev,
        [pokemon.id]: (prev[pokemon.id] || 0) - EVOLVE_CANDY_COST,
      }));

      // Replace Pokemon with evolved form (keep level & uniqueId)
      setCaughtPokemon(prev => prev.map(p => {
        if (p.uniqueId !== uniqueId) return p;
        const evolved = trimPokemon({
          ...evoData,
          caughtAt: p.caughtAt,
          uniqueId: p.uniqueId,
          level: p.level,
          cp: calculateCP(evoData.stats, p.level),
        });
        return evolved;
      }));
      return true;
    } catch (err) {
      console.error('Evolution failed:', err);
      return false;
    }
  };

  // ===== BATTLE SYSTEM =====
  // Battle state: null = not in battle, { player, enemy, turn, log, playerHP, enemyHP, result }
  const [battle, setBattle] = useState(null);

  // Start a battle with selected Pokemon vs current encounter
  const startBattle = (playerPokemon) => {
    if (!currentEncounter || !playerPokemon) return;
    
    const playerHP = Math.floor((playerPokemon.stats.find(s => s.stat.name === 'hp')?.base_stat || 45) * (1 + (playerPokemon.level || 1) * 0.1));
    const enemyHP = Math.floor((currentEncounter.stats.find(s => s.stat.name === 'hp')?.base_stat || 45) * 1.2); // Wild Pokemon slightly tankier
    
    setBattle({
      player: playerPokemon,
      enemy: currentEncounter,
      playerHP,
      playerMaxHP: playerHP,
      enemyHP,
      enemyMaxHP: enemyHP,
      turn: 'player', // 'player' or 'enemy'
      log: [`A wild ${currentEncounter.name.toUpperCase()} appeared! Go, ${playerPokemon.name.toUpperCase()}!`],
      result: null, // null, 'win', 'lose', 'caught'
      busy: false,
    });
    setGameState('battling');
  };

  // Player attacks — returns result object { damage, typeMult, stab, effectiveness }
  const playerAttack = (move) => {
    if (!battle || battle.turn !== 'player' || battle.busy || battle.result) return null;

    setBattle(prev => ({ ...prev, busy: true }));

    const { damage, typeMult } = calcDamage(battle.player, battle.enemy, move);
    const newEnemyHP = Math.max(0, battle.enemyHP - damage);
    
    let effectivenessMsg = '';
    if (typeMult === 0) effectivenessMsg = 'It had no effect...';
    else if (typeMult >= 2) effectivenessMsg = "It's super effective! 💥";
    else if (typeMult <= 0.5 && typeMult > 0) effectivenessMsg = "It's not very effective...";
    
    const newLog = [...battle.log, 
      `${battle.player.name.toUpperCase()} used ${move.name}! ${effectivenessMsg} (${damage} dmg)`
    ];

    // Check if enemy fainted
    if (newEnemyHP === 0) {
      newLog.push(`${battle.enemy.name.toUpperCase()} fainted! You win! 🎉`);
      const baseStatSum = battle.enemy.stats.reduce((acc, s) => acc + s.base_stat, 0);
      const isLegendary = LEGENDARY_IDS.includes(battle.enemy.id);
      const stardustReward = isLegendary ? 300 : baseStatSum > 450 ? 80 : baseStatSum > 350 ? 40 : 20;
      setStardust(prev => prev + stardustReward);
      setCandy(prev => ({ ...prev, [battle.enemy.id]: (prev[battle.enemy.id] || 0) + 2 }));
      newLog.push(`Earned ${stardustReward} ✨ and 2 🍬!`);
      
      setBattle(prev => ({ ...prev, enemyHP: 0, log: newLog, result: 'win', busy: false }));
      return { damage, typeMult, result: 'win' };
    }

    // Enemy's turn to attack
    setBattle(prev => ({ ...prev, enemyHP: newEnemyHP, log: newLog, turn: 'enemy' }));

    // Enemy attacks after 1.2s delay
    setTimeout(() => {
      const enemyMove = getRandomMove(battle.enemy.types);
      const { damage: enemyDmg } = calcDamage(battle.enemy, battle.player, enemyMove);
      const newPlayerHP = Math.max(0, battle.playerHP - enemyDmg);
      
      let enemyEffMsg = '';
      if (enemyDmg === 0) enemyEffMsg = 'It had no effect...';
      else if (calcDamage(battle.enemy, battle.player, enemyMove).typeMult >= 2) enemyEffMsg = "It's super effective! 💥";
      
      const enemyLog = [...newLog, 
        `Wild ${battle.enemy.name.toUpperCase()} used ${enemyMove.name}! ${enemyEffMsg} (${enemyDmg} dmg)`
      ];

      if (newPlayerHP === 0) {
        enemyLog.push(`${battle.player.name.toUpperCase()} fainted! You lost... 💀`);
        setBattle(prev => ({ ...prev, playerHP: 0, log: enemyLog, result: 'lose', busy: false }));
      } else {
        setBattle(prev => ({ ...prev, playerHP: newPlayerHP, log: enemyLog, turn: 'player', busy: false }));
      }
    }, 1200);

    return { damage, typeMult };
  };

  // Catch attempt during battle (always succeeds)
  const catchInBattle = () => {
    if (!battle || battle.busy || battle.result) return null;

    setBattle(prev => ({ ...prev, busy: true }));

    const isLegendary = LEGENDARY_IDS.includes(battle.enemy.id);
    const baseStatSum = battle.enemy.stats.reduce((acc, s) => acc + s.base_stat, 0);

    setTimeout(() => {
      // CAUGHT!
      const catchLog = [...battle.log, `Gotcha! ${battle.enemy.name.toUpperCase()} was caught! 🎉`];
      // Add to collection
      const newCatch = {
        ...battle.enemy,
        caughtAt: new Date().toISOString(),
        uniqueId: `${battle.enemy.id}-${Date.now()}`,
        level: 1,
        cp: calculateCP(battle.enemy.stats, 1),
      };
      const trimmedCatch = trimPokemon(newCatch);
      setCaughtPokemon(prev => [trimmedCatch, ...prev]);
      // Reward
      const stardustReward = isLegendary ? 500 : baseStatSum > 450 ? 100 : baseStatSum > 350 ? 50 : 25;
      setStardust(prev => prev + stardustReward);
      setCandy(prev => ({ ...prev, [battle.enemy.id]: (prev[battle.enemy.id] || 0) + 3 }));
      setBattle(prev => ({ ...prev, log: catchLog, result: 'caught', busy: false }));
    }, 800);

    return { catching: true };
  };

  // End battle and return to encounter
  const endBattle = () => {
    setBattle(null);
    setGameState('idle');
    getNewEncounter();
  };

  // ===== AUTO-BATTLE SYSTEM =====
  // Two Pokemon fight automatically — no player input, fast rounds
  // Use refs to track timers and avoid race conditions
  const battleEffectCounter = useRef(0);
  const battleTimersRef = useRef([]); // track all setTimeout IDs for cleanup
  const battleStartedRef = useRef(false); // guard against double-trigger

  // Clear all pending battle timers
  const clearBattleTimers = () => {
    battleTimersRef.current.forEach(t => clearTimeout(t));
    battleTimersRef.current = [];
  };

  // Auto-trigger battle when caughtPokemon reaches exactly 2
  useEffect(() => {
    if (
      caughtPokemon.length === 2 &&
      !battleStartedRef.current &&
      gameState !== 'auto-battle' &&
      gameState !== 'result'
    ) {
      battleStartedRef.current = true;
      const p1 = caughtPokemon[0];
      const p2 = caughtPokemon[1];
      // Delay of 2000ms so the user can see the 2nd caught Pokemon, while click is blocked
      const t = setTimeout(() => startAutoBattle(p1, p2), 2000);
      battleTimersRef.current.push(t);
    }
  }, [caughtPokemon, gameState]);

  const startAutoBattle = (pokemon1, pokemon2) => {
    // Guard: don't start if already battling
    if (battleStartedRef.current && autoBattle) return;

    const hp1 = Math.floor((pokemon1.stats.find(s => s.stat.name === 'hp')?.base_stat || 45) * 1.5);
    const hp2 = Math.floor((pokemon2.stats.find(s => s.stat.name === 'hp')?.base_stat || 45) * 1.5);

    const battle = {
      pokemon1,
      pokemon2,
      hp1,
      maxHP1: hp1,
      hp2,
      maxHP2: hp2,
      log: [`A battle begins! ${pokemon1.name.toUpperCase()} vs ${pokemon2.name.toUpperCase()}!`],
      winner: null,
      currentTurn: 0, // 0 = pokemon1, 1 = pokemon2
      round: 0,
      effect: null,
      finished: false,
      countdown: 3, // 3..2..1..FIGHT!
    };

    setAutoBattle(battle);
    setGameState('auto-battle');

    // Countdown: 3 → 2 → 1 → FIGHT! → then start rounds
    let count = 3;
    const countdownStep = () => {
      count -= 1;
      if (count > 0) {
        setAutoBattle(prev => prev ? { ...prev, countdown: count } : prev);
        const t = setTimeout(countdownStep, 800);
        battleTimersRef.current.push(t);
      } else {
        // Show FIGHT!
        setAutoBattle(prev => prev ? { ...prev, countdown: 0 } : prev);
        const t = setTimeout(() => runRound(battle), 600);
        battleTimersRef.current.push(t);
      }
    };
    const t1 = setTimeout(countdownStep, 800);
    battleTimersRef.current.push(t1);

    // Run battle rounds automatically — fast (900ms per round)
    // IMPORTANT: We pass the battle data explicitly (not relying on state closure)
    const runRound = (b) => {
      // Stop if battle already finished
      if (b.finished || b.winner) return;

      const attacker = b.currentTurn === 0 ? b.pokemon1 : b.pokemon2;
      const defender = b.currentTurn === 0 ? b.pokemon2 : b.pokemon1;
      const move = getRandomMove(attacker.types);
      const { damage, typeMult } = calcDamage(attacker, defender, move);

      let effMsg = '';
      if (typeMult === 0) effMsg = 'No effect!';
      else if (typeMult >= 2) effMsg = 'Super effective! 💥';
      else if (typeMult <= 0.5) effMsg = 'Not very effective...';

      const newLog = [...b.log, `${attacker.name.toUpperCase()} used ${move.name}! ${effMsg} (${damage} dmg)`];

      // Emit visual effect for this attack
      battleEffectCounter.current += 1;
      const effect = {
        type: move.type,
        target: b.currentTurn === 0 ? 'p2' : 'p1', // defender side
        damage,
        effectiveness: typeMult,
        id: battleEffectCounter.current,
      };

      // Apply damage
      let newHP1 = b.hp1;
      let newHP2 = b.hp2;
      if (b.currentTurn === 0) newHP2 = Math.max(0, b.hp2 - damage);
      else newHP1 = Math.max(0, b.hp1 - damage);

      // Check faint — defender fainted, attacker wins
      if (newHP1 === 0) {
        newLog.push(`${b.pokemon1.name.toUpperCase()} fainted! ${b.pokemon2.name.toUpperCase()} wins! 🏆`);
        const finalBattle = { ...b, hp1: 0, hp2: newHP2, log: newLog, winner: b.pokemon2, effect, finished: true };
        setAutoBattle(finalBattle);
        const t = setTimeout(() => setGameState('result'), 1200);
        battleTimersRef.current.push(t);
        return;
      }
      if (newHP2 === 0) {
        newLog.push(`${b.pokemon2.name.toUpperCase()} fainted! ${b.pokemon1.name.toUpperCase()} wins! 🏆`);
        const finalBattle = { ...b, hp1: newHP1, hp2: 0, log: newLog, winner: b.pokemon1, effect, finished: true };
        setAutoBattle(finalBattle);
        const t = setTimeout(() => setGameState('result'), 1200);
        battleTimersRef.current.push(t);
        return;
      }

      // Next round — switch turns
      const nextBattle = {
        ...b,
        hp1: newHP1,
        hp2: newHP2,
        log: newLog,
        currentTurn: b.currentTurn === 0 ? 1 : 0,
        round: b.round + 1,
        effect,
      };
      setAutoBattle(nextBattle);

      // Clear effect halfway so hit-recoil animation resets before next hit
      const tClear = setTimeout(() => {
        setAutoBattle(prev => {
          // Only clear effect if it's still the same one (don't override a new effect)
          if (prev && prev.effect?.id === effect.id) {
            return { ...prev, effect: null };
          }
          return prev;
        });
      }, 450);
      battleTimersRef.current.push(tClear);

      // Continue to next round after 900ms
      const tNext = setTimeout(() => runRound(nextBattle), 900);
      battleTimersRef.current.push(tNext);
    };
  };

  // End auto-battle, reset for next round
  const endAutoBattle = () => {
    clearBattleTimers();
    setAutoBattle(null);
    setGameState('idle');
    battleStartedRef.current = false;
    // Clear all caught Pokemon so the cycle starts from 0 again
    setCaughtPokemon([]);
    getNewEncounter();
  };

  return (
    <GameContext.Provider value={{
      caughtPokemon,
      currentEncounter,
      gameState,
      shakeCount,
      error,
      pokeBalls,
      maxBalls: MAX_BALLS,
      refillIn,
      lastThrowPower,
      stardust,
      candy,
      upgradeCost,
      evolveCandyCost: EVOLVE_CANDY_COST,
      battle,
      autoBattle,
      getAvailableMoves,
      throwPokeBall,
      getNewEncounter,
      releasePokemon,
      refillPokeBalls,
      upgradePokemon,
      evolvePokemon,
      startBattle,
      playerAttack,
      catchInBattle,
      endBattle,
      endAutoBattle,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
