import React from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, Sparkles } from 'lucide-react';

interface AILoadingScreenProps {
  subject: string;
}

export const AILoadingScreen: React.FC<AILoadingScreenProps> = ({ subject }) => {
  const cleanSubject = subject.replace(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+:\s*/, '');

  return (
    <div className="min-h-[550px] flex flex-col items-center justify-center text-center px-4 max-w-xl mx-auto py-12 animate-fade-in">
      <div className="relative mb-12">
        {/* Glow behind the spinner */}
        <div className="absolute inset-0 bg-brand-primary/10 blur-3xl rounded-full" />
        <div className="relative">
          <div className="w-28 h-28 border-[6px] border-slate-100 border-t-brand-primary rounded-full animate-spin" />
          <div className="absolute inset-0 m-auto w-12 h-12 bg-white border-3 border-brand-dark rounded-2xl flex items-center justify-center shadow-md">
            <BrainCircuit className="w-6 h-6 text-brand-primary animate-pulse stroke-[2.5px]" />
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 px-4 py-2 bg-[#FFFDF5] rounded-full border-2 border-brand-dark text-brand-dark font-display font-black text-xs uppercase tracking-wider mb-6 shadow-[3px_3px_0px_#1E1B4B]"
      >
        <Sparkles className="w-4 h-4 text-brand-primary animate-pulse" />
        A Arena está sendo organizada! ✨
      </motion.div>

      <h2 className="text-3xl md:text-5xl font-display font-black text-brand-dark mb-3 uppercase tracking-tight">
        PREPARANDO JOGO
      </h2>
      <div className="inline-block px-4 py-1.5 bg-brand-primary/15 border-2 border-brand-primary/35 text-brand-primary font-display font-black text-xs uppercase tracking-wider rounded-xl mb-10">
        {cleanSubject || "CONTEÚDO PERSONALIZADO"}
      </div>

      {/* Thinking Indicator */}
      <div className="w-full max-w-sm bg-white border-3 border-brand-dark p-10 text-center shadow-[6px_6px_0px_0px_#1E1B4B] rounded-[2rem] flex flex-col items-center gap-6">
        <div className="relative">
          <BrainCircuit className="w-16 h-16 text-brand-secondary animate-pulse stroke-[2px]" />
          <div className="absolute -top-1 -right-1">
            <Sparkles className="w-6 h-6 text-brand-yellow animate-bounce" />
          </div>
        </div>
        <p className="text-brand-dark font-display font-bold text-sm leading-relaxed">
          Carregando o melhor banco local disponível para montar flashcards e quizzes sem depender de servidor ou chave de IA...
        </p>
      </div>

      <p className="mt-8 text-xs text-[#8481B5] font-black uppercase tracking-widest leading-relaxed">
        Funciona em modo estático no GitHub Pages. <br /> Prepare-se para decolar! 🚀
      </p>
    </div>
  );
};
