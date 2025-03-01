import { useState } from "react";

const Flashcard = ( {frontText, backText}:{frontText:string, backText:string} ) => {
    const [flipped, setFlipped] = useState(false);
  
    return (
        <div
      className="w-full h-full perspective-1000 cursor-pointer rounded-lg"
      onClick={() => setFlipped(!flipped)}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform ${flipped ? 'rotate-y-180' : ''}`}
        style={{ transformStyle: "preserve-3d" }}
      >
        <div className="absolute px-10 w-full h-full flex items-center opacity-90 text-center fontStyle justify-center rounded-2xl bg-blue-800 text-white text-xl 2xl:text-[28px] font-extrabold" style={{ backfaceVisibility: "hidden" }}>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-slate-400 z-2 text-[11px] 2xl:text-[14px]">clues</div>
          {frontText}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-slate-400 z-2 text-[11px] 2xl:text-[14px]">Tap to flip</div>
        </div>
        <div className="absolute px-10 w-full h-full flex items-center opacity-90 text-center fontStyle justify-center rounded-2xl bg-red-800 text-white text-xl 2xl:text-[28px] font-extrabold" style={{ transform: "rotateY(180deg)", backfaceVisibility: "hidden" }}>
          <div className="absolute top-2 left-1/2 -translate-x-1/2 text-slate-400 z-2 text-[11px] 2xl:text-[14px]">clues</div>
          {backText}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-slate-400 z-2 text-[11px] 2xl:text-[14px]">Tap to flip</div>
        </div>
      </div>
    </div>
    );
  };
  

export default Flashcard;