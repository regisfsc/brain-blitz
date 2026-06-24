import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx } from 'clsx';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';
import { ImageWithLoader } from './ImageWithLoader';
import { MathText } from './MathText';
import { audio } from '../lib/audioService';

interface FlashcardProps {
  front: string;
  back: string;
  imageUrl?: string;
}

export const FlashcardComponent: React.FC<FlashcardProps> = ({ front, back, imageUrl }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const hasImage = imageUrl && 
    imageUrl.trim() !== '' && 
    !imageUrl.toLowerCase().includes('null') && 
    !imageUrl.toLowerCase().includes('undefined') && 
    (imageUrl.trim().startsWith('http') || imageUrl.trim().startsWith('data:image'));

  const handleFlip = () => {
    audio.playClick();
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={cn(
        "perspective-1000 w-full max-w-lg cursor-pointer group transition-all duration-300 select-none",
        hasImage 
          ? "aspect-[1.1/1] sm:aspect-[1.2/1] min-h-[360px] md:min-h-[420px]" 
          : "aspect-[1.618/1] min-h-[220px]"
      )}
      onClick={handleFlip}
    >
      <motion.div
        className="relative w-full h-full duration-700 preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
      >
        {/* Front */}
        <div className="absolute inset-0 w-full h-full backface-hidden bg-white border-3 border-brand-dark rounded-[2.5rem] shadow-[0px_6px_0px_#1E1B4B] hover:shadow-[0px_9px_0px_#1E1B4B] flex flex-col transition-all duration-300 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-[6px] bg-brand-primary z-20" />
          
          {hasImage && (
            <div className="flex-[2] w-full relative overflow-hidden bg-slate-50 min-h-0 p-6 flex items-center justify-center border-b-2 border-brand-dark/10">
              <ImageWithLoader 
                src={imageUrl!} 
                alt={front}
                className="max-w-[92%] max-h-[92%] object-contain opacity-90 group-hover:opacity-100 transition-all duration-700"
              />
            </div>
          )}

          <div className={cn(
            "p-8 text-center relative z-10 flex flex-col items-center justify-center min-h-[140px]",
            hasImage ? "flex-[1]" : "h-full"
          )}>
            <h3 className={cn(
              "font-display font-black text-brand-dark leading-tight select-text",
              hasImage ? "text-base md:text-lg" : "text-xl md:text-2xl"
            )}>
              <MathText text={front} />
            </h3>
            <p className="mt-3 text-[#5C5A8F] font-display font-black uppercase tracking-[0.2em] text-[9px] opacity-80">
              Toque para virar e ver a resposta! ✨
            </p>
          </div>

          <div className="absolute bottom-6 right-8 text-brand-primary group-hover:scale-110 transition-all z-20">
            <RotateCcw className="w-5 h-5 opacity-70 group-hover:opacity-100 group-hover:rotate-90 transition-all duration-550" />
          </div>
        </div>

        {/* Back */}
        <div 
          className="absolute inset-0 w-full h-full backface-hidden bg-gradient-to-tr from-brand-primary to-brand-secondary text-white border-3 border-brand-dark rounded-[2.5rem] shadow-[0px_6px_0px_#1E1B4B] p-8 md:p-12 flex flex-col items-center justify-center text-center"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.12)_0%,transparent_60%)] pointer-events-none" />
          <div className="text-base md:text-lg lg:text-xl font-display font-black leading-relaxed relative z-10 select-text">
            <MathText text={back} variant="dark" />
          </div>
          <div className="absolute bottom-6 right-8 text-white/80">
            <RotateCcw className="w-5 h-5 rotate-180 opacity-80" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
