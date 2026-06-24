import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Sparkles, BookOpen, BrainCircuit, ArrowLeft, Trash2, Database, HelpCircle } from 'lucide-react';
import { getStoredSubjects } from '../services/geminiService';

const getStageTitle = (stageNum: number): string => {
  const titles = [
    "Recruta do Conhecimento",
    "Desbravador do Saber",
    "Alquimista Mental",
    "Mestre da Razão",
    "Explorador Quântico",
    "Sábio da Academia",
    "Titã do Intelecto",
    "Oráculo da Ciência",
    "Semideus do Pensamento"
  ];
  if (stageNum <= 0) return titles[0];
  if (stageNum > titles.length) return `Lenda Suprema Vol. ${stageNum - titles.length + 1}`;
  return titles[stageNum - 1];
};

interface HomeProps {
  onStart: (subject: string) => void;
  isLoading: boolean;
  savedSessionInfo?: { subject: string; stage: number } | null;
  onContinue?: () => void;
  onDiscardSave?: () => void;
}

export const HomeHeader: React.FC<HomeProps> = ({ 
  onStart, 
  isLoading,
  savedSessionInfo,
  onContinue,
  onDiscardSave
}) => {
  const [subject, setSubject] = useState('');
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);
  const [storedSubjects, setStoredSubjects] = useState<string[]>([]);

  useEffect(() => {
    getStoredSubjects().then(list => {
      if (list && list.length > 0) {
        setStoredSubjects(Array.from(new Set(list)));
      }
    });
  }, [selectedDiscipline]);

  const getFilteredStoredSubjects = () => {
    if (!selectedDiscipline) return [];
    const prefix = `${selectedDiscipline.toLowerCase()}:`;
    return storedSubjects.filter(s => s.toLowerCase().startsWith(prefix));
  };

  const subjectExists = () => {
    if (!selectedDiscipline || !subject.trim()) return false;
    const fullNormalized = `${selectedDiscipline.toLowerCase()}: ${subject.trim().toLowerCase()}`;
    return storedSubjects.some(s => s.toLowerCase() === fullNormalized);
  };

  const disciplines = [
    "Matemática", "Português", "Redação", "Literatura", 
    "História", "Geografia", "Biologia", "Química", 
    "Física", "Filosofia", "Sociologia", "Artes", 
    "Inglês", "Espanhol"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject.trim() && selectedDiscipline) {
      onStart(`${selectedDiscipline}: ${subject.trim()}`);
    }
  };

  return (
    <div className="relative isolate pt-10 lg:px-8">
      <div className="mx-auto max-w-4xl py-12 sm:py-20 animate-fade-in">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-brand-primary/10 border-2 border-brand-primary/30 text-brand-primary font-display font-bold text-xs uppercase tracking-wider mb-6 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-brand-yellow animate-pulse" />
            O Aprendizado mais divertido do Mundo! ⚡
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-black text-brand-dark mb-6 leading-[0.95] tracking-tight uppercase">
            APRENDA <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-primary bg-[length:200%_auto] animate-[background_6s_linear_infinite]">QUALQUER ASSUNTO</span> <br />
            BRINCANDO! 🎉
          </h1>
          
          <p className="text-base md:text-lg text-[#5C5A8F] mb-10 max-w-2xl mx-auto leading-relaxed font-semibold">
            Esqueça as decorebas chatas. Transformamos o conteúdo do seu colégio ou faculdade em um super jogo de flashcards e quizzes gerado por IA com power-ups!
          </p>

          {savedSessionInfo && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto mb-12 p-8 glass-card border-brand-primary/30 rounded-[2.5rem] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-3xl -mr-12 -mt-12" />
              
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/15 border-2 border-brand-dark text-brand-primary font-black text-[10px] uppercase tracking-wider mb-4">
                🎮 BADAWI EM ANDAMENTO
              </span>
              
              <p className="text-[10px] font-black text-[#5C5A8F] uppercase tracking-wider mb-1">Assunto atual</p>
              <h3 className="text-2xl md:text-3xl font-display font-black text-brand-dark uppercase tracking-tight mb-2">
                {savedSessionInfo.subject.split(": ")[1] || savedSessionInfo.subject}
              </h3>
              
              <div className="flex justify-center gap-2 items-center text-brand-dark text-xs font-black uppercase mb-6 tracking-widest">
                <span>FASE {savedSessionInfo.stage}</span>
                <span className="text-brand-primary inline-block px-1 animate-pulse">•</span>
                <span className="text-brand-primary">{getStageTitle(savedSessionInfo.stage)}</span>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <button
                  onClick={onContinue}
                  className="juv-btn-primary w-full sm:w-auto px-8 py-4 rounded-2xl font-display font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  Continuar Jogando
                </button>
                <button
                  onClick={onDiscardSave}
                  className="juv-btn-neutral w-full sm:w-auto px-6 py-4 rounded-2xl font-display font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Resetar Jogo
                </button>
              </div>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {!selectedDiscipline ? (
              <motion.div 
                key="disciplines"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <h3 className="text-sm font-black uppercase tracking-[0.25em] text-brand-primary mb-3">Escolha sua Disciplina 👇</h3>
                <div className="flex flex-wrap justify-center gap-4 max-w-3xl mx-auto px-4">
                  {disciplines.map((disc) => (
                    <button
                      key={disc}
                      onClick={() => setSelectedDiscipline(disc)}
                      className="px-6 py-3.5 rounded-2xl bg-white border-3 border-brand-dark text-brand-dark font-display font-black text-[14px] shadow-[0px_4px_0px_#1E1B4B] hover:translate-y-[-2px] hover:shadow-[0px_6px_0px_#1E1B4B] active:translate-y-[2px] active:shadow-[0px_2px_0px_#1E1B4B] transition-all cursor-pointer"
                    >
                      {disc}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="subject"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="max-w-xl mx-auto space-y-6 px-4"
              >
                <div className="flex items-center justify-center gap-4 mb-4">
                  <button 
                    onClick={() => {
                      setSelectedDiscipline(null);
                      setSubject('');
                    }}
                    className="p-3 bg-white border-3 border-brand-dark text-brand-dark rounded-2xl shadow-[0px_4px_0px_#1E1B4B] hover:translate-y-[-2px] hover:shadow-[0px_5px_0px_#1E1B4B] active:translate-y-[2px] transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-5 h-5 stroke-[3px]" />
                  </button>
                  <div className="px-5 py-2.5 bg-brand-primary border-3 border-brand-dark text-white rounded-2xl shadow-[0px_4px_0px_#1E1B4B] font-display font-black uppercase tracking-wider text-sm">
                    {selectedDiscipline}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="relative group">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-brand-dark/50 group-focus-within:text-brand-primary transition-colors">
                      <Search className="w-5 h-5 stroke-[2.5px]" />
                    </div>
                    <input
                      autoFocus
                      type="text"
                      placeholder={`Qual assunto de ${selectedDiscipline}?`}
                      className="w-full pl-14 pr-36 py-4.5 md:py-5 rounded-2xl bg-white border-3 border-brand-dark focus:outline-none focus:border-brand-primary text-base font-bold text-brand-dark shadow-[0px_6px_0px_#1E1B4B] placeholder:text-slate-400 transition-all font-display"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      disabled={isLoading}
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !subject.trim()}
                      className="absolute right-2 top-2 bottom-2 px-6 rounded-xl bg-gradient-to-r from-brand-primary to-brand-primary/90 text-white font-display font-black uppercase tracking-wider text-xs hover:scale-105 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer shadow-md"
                    >
                      {isLoading ? (
                        <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          JOGAR 🚀
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Real-time DB matching and creation notification */}
                {subject.trim() && (
                  <div className="mt-2 text-center animate-fade-in">
                    {subjectExists() ? (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-50 border-2 border-emerald-500 text-emerald-800 text-[11px] font-black uppercase tracking-wider shadow-sm animate-pulse">
                        <Database className="w-3.5 h-3.5 text-emerald-600" />
                        Banco Encontrado! Carregamento Instantâneo ⚡
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-50 border-2 border-indigo-400 text-indigo-900 text-[11px] font-black uppercase tracking-wider shadow-sm">
                        <Sparkles className="w-3.5 h-3.5 text-brand-primary" />
                        Novo Sub-Banco! Será gerado por IA e adicionado à base 🧠
                      </span>
                    )}
                  </div>
                )}

                {/* Stored subjects on DB for current discipline */}
                {getFilteredStoredSubjects().length > 0 && (
                  <div className="text-left mt-6 p-5 bg-[#FFFCE8] border-3 border-brand-dark rounded-3xl shadow-[4px_4px_0px_#1E1B4B]">
                    <p className="text-[10px] font-black uppercase text-brand-primary tracking-widest mb-3.5 flex items-center gap-1.5">
                       <Database className="w-4 h-4 text-brand-primary stroke-[2.5px]" />
                       SUB-BANCOS SALVOS NA DISCIPLINA:
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {getFilteredStoredSubjects().map((item) => {
                        const topic = item.includes(':') ? item.split(':')[1].trim() : item;
                        return (
                          <button
                            key={item}
                            type="button"
                            onClick={() => {
                              setSubject(topic);
                              onStart(item);
                            }}
                            className="px-4 py-2.5 text-xs font-black uppercase tracking-wider rounded-xl bg-white hover:bg-slate-50 border-2 border-brand-dark shadow-[3px_3px_0px_#1E1B4B] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer flex items-center gap-1.5 text-brand-dark hover:scale-[1.02]"
                          >
                            📚 {topic}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <p className="text-[#5C5A8F] text-xs font-bold uppercase tracking-wider">
                  Sugestão: {selectedDiscipline === 'Biologia' ? 'Mitocôndrias' : selectedDiscipline === 'Matemática' ? 'Trigonometria' : 'Revisão Geral'}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto px-4">
            {[
              { icon: BookOpen, title: "Cards Divertidos", color: "text-indigo-600", bg: "bg-indigo-100", desc: "Sprints de memória com revelação em flashcards super fofos." },
              { icon: BrainCircuit, title: "Modo Boss 👾", color: "text-brand-primary", bg: "bg-pink-100", desc: "Enfrente quizzas em fases insanas e use seus power-ups secretamente." },
              { icon: Sparkles, title: "IA Ultra Generativa", color: "text-emerald-600", bg: "bg-emerald-100", desc: "Criador de arenas personalizadas para você decolar nos estudos!" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-[2rem] bg-white border-3 border-brand-dark text-left group shadow-[0px_6px_0px_0px_#1E1B4B] hover:translate-y-[-4px] hover:shadow-[0px_10px_0px_0px_#1E1B4B] transition-all duration-200 cursor-default"
              >
                <div className={`w-12 h-12 rounded-2xl ${feature.bg} flex items-center justify-center ${feature.color} mb-5 group-hover:scale-110 transition-transform shadow-inner`}>
                  <feature.icon className="w-6 h-6 stroke-[2.5px]" />
                </div>
                <h3 className="font-display font-black text-brand-dark text-lg mb-1.5">{feature.title}</h3>
                <p className="text-xs text-[#5C5A8F] leading-relaxed font-semibold">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
