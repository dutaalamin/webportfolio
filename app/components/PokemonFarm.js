import Image from 'next/image';

export default function PokemonFarm({ className = '' }) {
  return (
    <div className={`hidden z-5 lg:block absolute bottom-[200px] left-0 w-full pointer-events-none ${className}`}>
      {/* Pikachu */}
      <div className="absolute bottom-[15px] animate-run-fast" style={{ animationDelay: '1s' }}>
        <Image src="/images/pikachu.gif" alt="Pikachu" width={65} height={65} className="object-contain" />
      </div>
      {/* Psyduck */}
      <div className="absolute bottom-[25px] animate-run-slow" style={{ animationDelay: '4s' }}>
        <Image src="/images/psyduck.gif" alt="Psyduck" width={75} height={75} className="object-contain" />
      </div>
      {/* Bulbasaur */}
      <div className="absolute bottom-[8px] animate-run-rev" style={{ animationDelay: '2s' }}>
        <Image src="/images/bulbasaur.gif" alt="Bulbasaur" width={70} height={70} className="object-contain" />
      </div>
      {/* Togepi */}
      <div className="absolute bottom-[35px] animate-run" style={{ animationDelay: '3s' }}>
        <Image src="/images/togepi.gif" alt="Togepi" width={55} height={55} className="object-contain" />
      </div>
    </div>
  );
}
