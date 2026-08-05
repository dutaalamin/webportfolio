'use client';

import { createContext, useContext, useState, useEffect } from 'react';

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
    uniqueId: p.uniqueId || `${p.id}-${Date.now()}`
  };
};

export function GameProvider({ children }) {
  const [caughtPokemon, setCaughtPokemon] = useState([]);
  const [currentEncounter, setCurrentEncounter] = useState(null);
  const [gameState, setGameState] = useState('exploring'); // 'exploring', 'loading', 'idle', 'throwing', 'shaking', 'caught', 'escaped'
  const [shakeCount, setShakeCount] = useState(0);
  const [error, setError] = useState(null);

  // Load and migrate caught Pokemon from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('caught_pokemon');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Run migration to trim down any old massive objects
        const trimmed = parsed.map(p => trimPokemon(p)).filter(Boolean);
        setCaughtPokemon(trimmed);
        
        // Re-save trimmed version to free up space
        localStorage.setItem('caught_pokemon', JSON.stringify(trimmed));
      } catch (e) {
        console.error("Failed to parse and migrate saved pokemon", e);
      }
    }
  }, []);

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
    const updated = caughtPokemon.filter(p => p.uniqueId !== uniqueId);
    setCaughtPokemon(updated);
    localStorage.setItem('caught_pokemon', JSON.stringify(updated));
  };

  const throwPokeBall = () => {
    if (gameState !== 'idle' || !currentEncounter) return;

    setGameState('throwing');
    setShakeCount(0);

    // 1. Throw animation takes 400ms
    setTimeout(() => {
      setGameState('shaking');
      setShakeCount(1);
      
      // Determine capture rate based on base stats (lower capture rate for higher stats/legendaries)
      const isLegendary = LEGENDARY_IDS.includes(currentEncounter.id);
      const baseStatSum = currentEncounter.stats.reduce((acc, stat) => acc + stat.base_stat, 0);
      
      // Capture rate formula
      let catchChance = 0.75; // Standard 75%
      if (isLegendary) {
        catchChance = 0.15; // Legendary 15%
      } else if (baseStatSum > 450) {
        catchChance = 0.45; // Harder evolved forms 45%
      } else if (baseStatSum > 350) {
        catchChance = 0.60; // Medium 60%
      }

      // Simulate shakes (Always succeeds, no breakout chance)
      const runShake = (currentShake) => {
        if (currentShake < 3) {
          setTimeout(() => {
            setShakeCount(currentShake + 1);
            runShake(currentShake + 1);
          }, 400); // Speed up shake interval to 400ms
        } else {
          // 3 shakes completed successfully -> CAUGHT!
          setTimeout(() => {
            setGameState('caught');
            setCaughtPokemon(prev => {
              const newCatch = {
                ...currentEncounter,
                caughtAt: new Date().toISOString(),
                uniqueId: `${currentEncounter.id}-${Date.now()}`
              };
              const trimmedCatch = trimPokemon(newCatch);
              const updated = [trimmedCatch, ...prev];
              
              try {
                localStorage.setItem('caught_pokemon', JSON.stringify(updated));
              } catch (err) {
                console.error("Storage still failed after trimming:", err);
              }
              
              return updated;
            });
          }, 400); // Speed up caught animation reveal to 400ms
        }
      };

      runShake(0);
    }, 400); // Speed up throw delay to 400ms
  };

  return (
    <GameContext.Provider value={{
      caughtPokemon,
      currentEncounter,
      gameState,
      shakeCount,
      error,
      throwPokeBall,
      getNewEncounter,
      releasePokemon
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
