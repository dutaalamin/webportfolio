import Image from 'next/image';

export default function FarmAnimals({ className = '' }) {
  return (
    <div className={`hidden z-5 lg:block absolute bottom-[185px] left-0 w-full pointer-events-none ${className}`}>
      {/* Cow */}
      <div className="absolute bottom-0 animate-run">
        <Image src="/images/char.gif" alt="Cow" width={110} height={110} className="object-contain" priority />
      </div>
      {/* Chicken */}
      <div className="absolute bottom-[20px] animate-run-fast">
        <Image src="/images/chicken.gif" alt="Chicken" width={60} height={60} className="object-contain" />
      </div>
      {/* Dog */}
      <div className="absolute bottom-[5px] animate-run-rev">
        <Image src="/images/dog.gif" alt="Dog" width={80} height={80} className="object-contain" />
      </div>
      {/* Sheep */}
      <div className="absolute bottom-[10px] animate-run-slow">
        <Image src="/images/sheep.gif" alt="Sheep" width={90} height={90} className="object-contain" />
      </div>
      {/* Cat */}
      <div className="absolute bottom-[30px] animate-run-rev-fast">
        <Image src="/images/cat.gif" alt="Cat" width={70} height={70} className="object-contain" />
      </div>
      {/* Pikachu */}
      <div className="absolute bottom-[15px] animate-run-fast" style={{ animationDelay: '3s' }}>
        <Image src="/images/pikachu.gif" alt="Pikachu" width={65} height={65} className="object-contain" />
      </div>
      {/* Psyduck */}
      <div className="absolute bottom-[25px] animate-run-slow" style={{ animationDelay: '7s' }}>
        <Image src="/images/psyduck.gif" alt="Psyduck" width={75} height={75} className="object-contain" />
      </div>
      {/* Bulbasaur */}
      <div className="absolute bottom-[8px] animate-run-rev" style={{ animationDelay: '5s' }}>
        <Image src="/images/bulbasaur.gif" alt="Bulbasaur" width={70} height={70} className="object-contain" />
      </div>
      {/* Togepi */}
      <div className="absolute bottom-[35px] animate-run" style={{ animationDelay: '6s' }}>
        <Image src="/images/togepi.gif" alt="Togepi" width={55} height={55} className="object-contain" />
      </div>
    </div>
  );
}
