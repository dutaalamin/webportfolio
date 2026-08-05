'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useGame } from './GameProvider';

export default function Navbar() {
  const pathname = usePathname();
  const { caughtPokemon } = useGame();

  const isCollection = pathname === '/pokedex/collection';
  const targetPath = isCollection ? '/pokedex' : '/pokedex/collection';

  // Get sprite of the last caught Pokemon, or fallback to Pikachu (ID 25)
  const lastCaught = caughtPokemon[caughtPokemon.length - 1];
  const spriteUrl = lastCaught
    ? lastCaught.sprites.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${lastCaught.id}.png`
    : 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'; // Pikachu

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 sm:right-6 z-[100]">
      <Link 
        href={targetPath}
        title={isCollection ? 'Go Catch Pokémon' : 'View My Collection'}
        className="relative block w-20 h-20 md:w-24 md:h-24 transition-all duration-300 hover:scale-110 active:scale-95 group focus:outline-hidden"
      >
        {isCollection ? (
          /* When in collection: show a mini custom rotating Poké Ball to go back */
          <div className="relative w-full h-full flex items-center justify-center">
            
            <div className="w-14 h-14 md:w-16 md:h-16 border-4 border-zinc-950 rounded-full relative overflow-hidden group-hover:rotate-180 transition-transform duration-500 shadow-md">
              {/* Top Red Half */}
              <div className="absolute top-0 left-0 right-0 h-1/2 bg-red-600" />
              {/* Bottom White Half */}
              <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-white" />
              {/* Center Line */}
              <div className="absolute top-[calc(50%-2px)] left-0 right-0 h-1 bg-zinc-950" />
              {/* Center Ring */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white border-4 border-zinc-950 rounded-full z-10" />
            </div>
            {/* Small tooltips / indicators */}
            <span className="absolute -bottom-2 bg-slate-800 text-white text-[10px] font-bold px-3 py-0.5 rounded-full border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
              Catch
            </span>
          </div>
        ) : (
          /* When in game: show the last caught Pokemon / Pikachu to view collection */
          <div className="relative w-full h-full flex items-center justify-center">
            
            {/* Cute Pokemon Sprite inside a floating circle */}
            <div className="relative w-16 h-16 md:w-24 md:h-24 overflow-hidden rounded-full flex items-center justify-center bg-slate-100/80 hover:bg-slate-200/90 backdrop-blur-md transition-colors shadow-lg border-2 border-slate-200">
              <Image 
                src={spriteUrl} 
                alt="My Collection"
                width={100}
                height={100}
                className="object-contain drop-shadow-md select-none group-hover:animate-bounce scale-[1.3] md:scale-[1.5]"
                unoptimized
              />
            </div>

            {/* Red count badge */}
            {caughtPokemon.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                {caughtPokemon.length}
              </span>
            )}
          </div>
        )}
      </Link>
    </div>
  );
}
