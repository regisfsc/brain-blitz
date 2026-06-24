import React, { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

interface ImageWithLoaderProps {
  src: string;
  alt: string;
  className?: string;
}

export const ImageWithLoader: React.FC<ImageWithLoaderProps> = ({ src, alt, className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="relative w-full h-full min-h-[100px] flex items-center justify-center">
      {isLoading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 z-10">
          <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mb-4" />
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 animate-pulse">Processando Diagrama...</p>
        </div>
      )}
      {!hasError ? (
        <img 
          src={src} 
          alt={alt}
          className={cn(className, isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-500')}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 border border-slate-800 rounded-xl">
           <div className="text-center p-4">
             <RotateCcw className="w-8 h-8 text-slate-800 mx-auto mb-2" />
             <p className="text-[10px] font-black uppercase tracking-widest text-slate-700">Erro ao carregar imagem</p>
           </div>
        </div>
      )}
    </div>
  );
};
