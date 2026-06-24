import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  XCircle, 
  ChevronRight, 
  Trophy, 
  Dices, 
  Users, 
  Lightbulb, 
  LogOut,
  RotateCcw,
  AlertCircle,
  Sparkles,
  User
} from 'lucide-react';
import { QuizQuestion } from '../types';
import { cn } from '../lib/utils';
import { ImageWithLoader } from './ImageWithLoader';
import { MathText } from './MathText';
import { audio } from '../lib/audioService';

export const getStageTitle = (stageNum: number): string => {
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
  if (stageNum > titles.length) {
    return `Lenda Suprema Vol. ${stageNum - titles.length + 1}`;
  }
  return titles[stageNum - 1];
};

interface QuizProps {
  stage: number;
  questions: QuizQuestion[];
  onNextStage: () => void;
  onStop: () => void;
}

const formatSvg = (svgString: string): string => {
  let formatted = svgString;
  const svgTagMatch = formatted.match(/<svg([^>]*)/i);
  if (svgTagMatch) {
    let svgTagContent = svgTagMatch[0];
    svgTagContent = svgTagContent
      .replace(/\bwidth="[^"]*"/gi, '')
      .replace(/\bheight="[^"]*"/gi, '');
      
    if (!svgTagContent.includes('viewBox') && !svgTagContent.includes('viewbox')) {
      svgTagContent += ' viewBox="0 0 600 350" preserveAspectRatio="xMidYMid meet"';
    } else {
      svgTagContent += ' preserveAspectRatio="xMidYMid meet"';
    }
    
    svgTagContent += ' style="width: 100%; height: 100%; max-width: 100%; max-height: 100%; display: block; margin: auto;"';
    formatted = formatted.replace(/<svg[^>]*>/i, svgTagContent + '>');
  }
  return formatted;
};

export const QuizComponent: React.FC<QuizProps> = ({ 
  stage, 
  questions, 
  onNextStage, 
  onStop 
}) => {
  const [displayQuestions, setDisplayQuestions] = useState<QuizQuestion[]>(questions);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showStageResult, setShowStageResult] = useState(false);
  const [wrongQuestions, setWrongQuestions] = useState<QuizQuestion[]>([]);
  
  // Power-ups state
  const [excludedOptions, setExcludedOptions] = useState<number[]>([]);
  const [audienceStats, setAudienceStats] = useState<number[] | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [diceUsedInStage, setDiceUsedInStage] = useState(false);
  const [audienceUsedInStage, setAudienceUsedInStage] = useState(false);
  const [isRollingDice, setIsRollingDice] = useState(false);
  const [diceResult, setDiceResult] = useState<number | null>(null);
  const [hintUsedInStage, setHintUsedInStage] = useState(false);

  const currentQuestion = displayQuestions[currentIndex];

  const hasSvgDiagram = currentQuestion?.svgDiagram && 
    currentQuestion.svgDiagram.trim() !== '' && 
    currentQuestion.svgDiagram.toLowerCase() !== 'null' && 
    currentQuestion.svgDiagram.toLowerCase() !== 'undefined' && 
    currentQuestion.svgDiagram.includes('<svg');

  const hasImageUrl = currentQuestion?.imageUrl && 
    currentQuestion.imageUrl.trim() !== '' && 
    !currentQuestion.imageUrl.toLowerCase().includes('null') && 
    !currentQuestion.imageUrl.toLowerCase().includes('undefined') && 
    currentQuestion.imageUrl.trim().startsWith('http');

  useEffect(() => {
    setDisplayQuestions(questions);
    setCurrentIndex(0);
    setScore(0);
    setShowStageResult(false);
    setWrongQuestions([]);
    setDiceUsedInStage(false);
    setAudienceUsedInStage(false);
    setHintUsedInStage(false);
    audio.playQuestionAppear();
  }, [questions]);

  useEffect(() => {
    setExcludedOptions([]);
    setAudienceStats(null);
    setShowHint(false);
    setIsRollingDice(false);
    setDiceResult(null);
    audio.playQuestionAppear();
  }, [currentIndex, displayQuestions]);

  useEffect(() => {
    if (showStageResult) {
      const isPerfect = score === displayQuestions.length;
      if (isPerfect) {
        audio.playStageUp();
      } else {
        audio.playFailure();
      }
    }
  }, [showStageResult, score, displayQuestions]);

  const handleOptionClick = (index: number) => {
    if (isAnswered || excludedOptions.includes(index)) return;
    audio.playClick();
    setSelectedOption(index);
  };

  const handleConfirm = () => {
    if (selectedOption === null) return;
    const correct = selectedOption === currentQuestion.correctAnswer;
    if (correct) {
      setScore(s => s + 1);
      audio.playSuccess();
    } else {
      setWrongQuestions(prev => [...prev, currentQuestion]);
      audio.playFailure();
    }
    setIsAnswered(true);
  };

  const handleNext = () => {
    if (currentIndex < displayQuestions.length - 1) {
      setCurrentIndex(c => c + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowStageResult(true);
    }
  };

  const handleDiceRoll = () => {
    if (diceUsedInStage || isAnswered || isRollingDice) return;
    
    audio.playDiceRoll();
    setIsRollingDice(true);
    setDiceUsedInStage(true);
    
    const numOptions = currentQuestion.options.length;
    let faces = [1, 2];
    if (numOptions === 5) {
      faces = [1, 1, 2, 2, 3, 4];
    } else if (numOptions === 4) {
      faces = [1, 1, 2, 2, 3, 3];
    } else if (numOptions === 3) {
      faces = [1, 1, 1, 2, 2, 2];
    } else if (numOptions > 5) {
      faces = [];
      const maxExcl = numOptions - 1;
      for (let i = 0; i < 6; i++) {
        faces.push(Math.min(maxExcl, (i % maxExcl) + 1));
      }
    } else {
      faces = [1, 1, 1, 1, 1, 1];
    }
    const roll = faces[Math.floor(Math.random() * faces.length)];
    
    // Dice animation delay
    setTimeout(() => {
      setDiceResult(roll);
      
      // Show result for 1 more second before applying and closing
      setTimeout(() => {
        const incorrectIndices = currentQuestion.options.map((_, i) => i).filter(i => i !== currentQuestion.correctAnswer);
        const toExclude = incorrectIndices.sort(() => Math.random() - 0.5).slice(0, roll);
        
        setExcludedOptions(toExclude);
        setIsRollingDice(false);
        if (selectedOption !== null && toExclude.includes(selectedOption)) setSelectedOption(null);
      }, 1200);
    }, 1500);
  };

  const handleAudienceHelp = () => {
    if (audienceUsedInStage || isAnswered) return;
    
    audio.playCrowdHelp();
    const stats = new Array(currentQuestion.options.length).fill(0);
    const correctVal = Math.floor(Math.random() * 35) + 40;
    stats[currentQuestion.correctAnswer] = correctVal;
    let remaining = 100 - correctVal;
    const otherIndices = currentQuestion.options.map((_, i) => i).filter(i => i !== currentQuestion.correctAnswer);
    otherIndices.forEach((idx, i) => {
      if (i === otherIndices.length - 1) stats[idx] = remaining;
      else {
        const val = Math.floor(Math.random() * remaining);
        stats[idx] = val;
        remaining -= val;
      }
    });
    
    setAudienceStats(stats);
    setAudienceUsedInStage(true);
  };

  const handleHintClick = () => {
    if (!hintUsedInStage && !isAnswered) {
      audio.playClick();
      setShowHint(true);
      setHintUsedInStage(true);
    }
  };

  const handleRetryStage = () => {
    setDisplayQuestions(wrongQuestions);
    setWrongQuestions([]);
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowStageResult(false);
    setDiceUsedInStage(false);
    setAudienceUsedInStage(false);
    setHintUsedInStage(false);
  };

  if (showStageResult) {
    const isPerfect = score === displayQuestions.length;

    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white border-4 border-brand-dark p-10 rounded-[2.5rem] shadow-[0px_10px_0px_#1E1B4B] text-center relative overflow-hidden animate-fade-in"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-3xl -mr-12 -mt-12" />
        <div className="mb-8">
          {isPerfect ? (
            <>
              <div className="w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border-3 border-brand-dark shadow-[0px_4px_0px_#1E1B4B] relative">
                <Trophy className="w-10 h-10 text-brand-yellow animate-bounce" />
              </div>
              <h2 className="text-3xl font-display font-black text-brand-dark mb-1.5 uppercase tracking-tight">DOMINADO! 👑</h2>
              <p className="text-brand-primary text-xs font-black tracking-widest uppercase mb-1.5">{getStageTitle(stage)}</p>
              <p className="text-[#5C5A8F] text-sm font-bold max-w-xs mx-auto">Você completou a Etapa {stage} sem errar nadinha!</p>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-rose-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border-3 border-brand-dark shadow-[0px_4px_0px_#1E1B4B]">
                <AlertCircle className="w-10 h-10 text-brand-primary" />
              </div>
              <h2 className="text-3xl font-display font-black text-brand-dark mb-1.5 uppercase tracking-tight">QUASE LÁ! 🎯</h2>
              <p className="text-brand-secondary text-xs font-black tracking-widest uppercase mb-1.5">{getStageTitle(stage)}</p>
              <p className="text-[#5C5A8F] text-sm font-bold max-w-xs mx-auto">
                Faltou pouco! Você errou {wrongQuestions.length} {wrongQuestions.length === 1 ? 'questão' : 'questões'}. <br />
                Elimine os seus erros para avançar!
              </p>
            </>
          )}
        </div>
        
        <div className="text-6xl font-black text-brand-primary font-display mb-8">
          {score}/{displayQuestions.length}
        </div>

        <div className="space-y-4">
          {isPerfect ? (
            <button 
              onClick={onNextStage}
              className="juv-btn-primary w-full py-4.5 rounded-2xl font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-3"
            >
              PRÓXIMO NÍVEL
              <ChevronRight className="w-5 h-5 stroke-[3px]" />
            </button>
          ) : (
            <button 
              onClick={handleRetryStage}
              className="juv-btn-primary w-full py-4.5 rounded-2xl font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-3"
            >
              <RotateCcw className="w-4 h-4 stroke-[3px]" />
              APAGAR ERROS 💪
            </button>
          )}
          <button 
            onClick={onStop}
            className="juv-btn-neutral w-full py-4 rounded-2xl font-display font-black text-xs uppercase tracking-wider"
          >
            PARAR MISSÃO
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-5xl w-full flex flex-col lg:flex-row gap-8 items-start px-2 md:px-0">
      <div className="flex-1 w-full">
        <div className="mb-8 flex flex-col gap-3">
          <div className="flex justify-between items-end">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-primary mb-1 block">JOGO ATIVO • {getStageTitle(stage)} 🌟</span>
              <h2 className="text-xl font-display font-black text-brand-dark uppercase tracking-tight">Fase {stage} • Desafio {currentIndex + 1}/{displayQuestions.length}</h2>
            </div>
            <div className="text-right">
               <span className="text-[10px] font-black uppercase tracking-wider text-[#5C5A8F] mb-1 block">APROVEITAMENTO</span>
               <span className="text-lg font-display font-black text-brand-secondary tabular-nums">{Math.round((score / Math.max(1, currentIndex)) * 100)}%</span>
            </div>
          </div>
          <div className="h-4 bg-slate-200 border-3 border-brand-dark rounded-full overflow-hidden relative shadow-[0px_2px_0px_#1E1B4B]">
            <motion.div 
              className="h-full bg-brand-primary"
              initial={{ width: 0 }}
              animate={{ width: `${((currentIndex + 1) / displayQuestions.length) * 100}%` }}
            />
          </div>
        </div>

        <motion.div
          key={`${currentIndex}-${displayQuestions.length}`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white border-3 border-brand-dark p-6 md:p-10 rounded-[2.5rem] relative overflow-hidden shadow-[0px_8px_0px_0px_#1E1B4B]"
        >
          <div className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-3xl -mr-8 -mt-8" />
          
          <AnimatePresence>
            {isRollingDice && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#FFFDF5]/95 backdrop-blur-sm rounded-[2.5rem]"
              >
                <div className="relative">
                  <motion.div
                    animate={diceResult === null ? { rotate: [0, 90, 180, 270, 360], scale: [1, 1.2, 1] } : { rotate: 0, scale: 1.5 }}
                    transition={diceResult === null ? { duration: 0.5, repeat: Infinity } : { type: "spring", stiffness: 200 }}
                    className="bg-brand-primary border-3 border-brand-dark text-white p-6 rounded-2xl shadow-[0px_4px_0px_#1E1B4B]"
                  >
                    {diceResult === null ? <Dices className="w-16 h-16 text-white" /> : <div className="w-16 h-16 flex items-center justify-center text-4xl font-black text-white">{diceResult}</div>}
                  </motion.div>
                </div>
                <p className="mt-6 text-brand-dark font-display font-black uppercase tracking-wider animate-pulse">
                  {diceResult === null ? "Girando a Sorte..." : `Excluindo ${diceResult} opções! 💥`}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {hasSvgDiagram ? (
            <div 
              className="mb-8 p-4 bg-white rounded-2xl border-3 border-brand-dark flex justify-center items-center shadow-[0px_4px_0px_#1E1B4B] min-h-[240px] max-h-[420px] w-full relative overflow-hidden"
            >
              <div 
                className="w-full h-full flex justify-center items-center max-w-full"
                style={{ maxHeight: '100%', maxWidth: '100%' }}
                dangerouslySetInnerHTML={{ 
                  __html: formatSvg(currentQuestion.svgDiagram!) 
                }}
              />
            </div>
          ) : hasImageUrl ? (
            <div className="mb-8 rounded-2xl overflow-hidden border-3 border-brand-dark relative group/img bg-slate-50 flex justify-center items-center p-4 max-h-[420px] w-full shadow-[0px_4px_0px_#1E1B4B]">
               <ImageWithLoader 
                 src={currentQuestion.imageUrl!} 
                 alt="Imagem da questão" 
                 className="max-w-full max-h-[380px] object-contain opacity-95 group-hover/img:opacity-100 transition-all duration-500"
               />
            </div>
          ) : null}

          <AnimatePresence>
            {audienceStats && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-6 p-4 bg-slate-100 rounded-2xl border-2 border-brand-dark flex flex-wrap justify-center gap-3 relative z-20 shadow-[0px_3px_0px_#1E1B4B]"
              >
                <div className="absolute -top-3 left-4 px-3 bg-brand-secondary text-white text-[9px] font-display font-black uppercase tracking-wider rounded-full border-2 border-brand-dark py-0.5 shadow-sm">
                  Votação do Chat 🗣️
                </div>
                {audienceStats.map((stat, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    className="flex flex-col items-center"
                  >
                    <motion.div 
                      animate={{ y: [0, -2, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: idx * 0.2 }}
                      className="bg-white px-3 py-1 rounded-xl shadow-[0px_3px_0px_#1E1B4B] border-2 border-brand-dark text-brand-dark font-display font-black text-xs text-center min-w-[45px] relative mb-1.5"
                    >
                      <div className="text-[9px] text-[#5C5A8F] leading-none mb-0.5">{String.fromCharCode(65 + idx)}</div>
                      {stat}%
                      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-brand-dark rounded-full" />
                    </motion.div>
                    
                    <div className="bg-brand-secondary p-1 rounded-full border-2 border-brand-dark shadow-sm">
                      <User className="w-3.5 h-3.5 text-white" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex flex-col gap-4 mb-6">
            <h2 className="text-lg md:text-xl lg:text-2xl font-display font-black text-brand-dark leading-tight relative z-10 selection:bg-brand-primary/20">
              <MathText text={currentQuestion.question} />
            </h2>
            {currentQuestion.source && (
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-brand-primary/10 text-brand-primary px-3 py-1.5 rounded-xl border-2 border-brand-primary/25 font-display font-black uppercase tracking-wider">
                  {currentQuestion.source}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3 relative z-10">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectSelection = isAnswered && isSelected && idx === currentQuestion.correctAnswer;
              const isWrong = isAnswered && isSelected && idx !== currentQuestion.correctAnswer;
              const isExcluded = excludedOptions.includes(idx);

              return (
                <div key={idx} className="relative group">
                  <button
                    onClick={() => handleOptionClick(idx)}
                    disabled={isAnswered || isExcluded}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border-3 transition-all flex items-center justify-between relative overflow-hidden cursor-pointer",
                      !isAnswered && !isExcluded && "bg-white border-brand-dark text-brand-dark shadow-[0px_4px_0px_#1E1B4B] hover:translate-y-[-2px] hover:shadow-[0px_6px_0px_#1E1B4B] active:translate-y-[2px] active:shadow-[0px_2px_0px_#1E1B4B]",
                      !isAnswered && isSelected && "bg-brand-primary/10 border-brand-primary text-brand-dark shadow-[0px_4px_0px_#1E1B4B]",
                      isCorrectSelection && "bg-emerald-100 border-emerald-500 text-emerald-800 font-extrabold shadow-[0px_4px_0px_#065F46]",
                      isWrong && "bg-rose-100 border-rose-500 text-rose-800 font-extrabold shadow-[0px_4px_0px_#991B1B]",
                      isAnswered && !isSelected && "bg-slate-50 border-slate-300 text-slate-400 shadow-none opacity-45 cursor-not-allowed",
                      isExcluded && "opacity-15 bg-slate-100 border-slate-300 text-slate-300 shadow-none cursor-not-allowed"
                    )}
                  >
                    <div className="flex-1 relative z-10 flex gap-3 items-center">
                      <span className="font-display font-black text-brand-primary shrink-0 text-sm w-6">{String.fromCharCode(65 + idx)}</span>
                      <span className="font-semibold text-xs md:text-[14px] leading-snug"><MathText text={option} /></span>
                    </div>
                    
                    <div className="relative z-10 ml-3">
                      {isCorrectSelection && <CheckCircle2 className="w-6 h-6 text-emerald-600 stroke-[2.5px]" />}
                      {isWrong && <XCircle className="w-6 h-6 text-rose-600 stroke-[2.5px]" />}
                    </div>
                  </button>
                </div>
              );
            })}
          </div>

          <div className="mt-10 relative z-10">
            {!isAnswered ? (
              <button
                onClick={handleConfirm}
                disabled={selectedOption === null}
                className={cn(
                  "w-full py-4 rounded-xl font-display font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2",
                  selectedOption === null 
                    ? "bg-slate-100 border-3 border-slate-300 text-slate-450 cursor-not-allowed" 
                    : "juv-btn-primary"
                )}
              >
                ENVIAR RESPOSTA !
              </button>
            ) : (
              <div className="space-y-4">
                {selectedOption === currentQuestion.correctAnswer && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 bg-emerald-50/50 rounded-2xl border-3 border-brand-dark shadow-[0px_4px_0px_#1E1B4B] text-brand-dark"
                  >
                    <p className="text-xs font-display font-black uppercase tracking-wider text-emerald-800 mb-1.5 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-yellow animate-bounce" />
                      Explicação da Sábia IA:
                    </p>
                    <div className="text-sm font-semibold leading-relaxed">
                      <MathText text={currentQuestion.explanation} />
                    </div>
                  </motion.div>
                )}
                <button
                  onClick={handleNext}
                  className="juv-btn-secondary w-full py-4 rounded-2xl font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  {currentIndex === displayQuestions.length - 1 ? 'FINALIZAR ETAPA' : 'PRÓXIMO DESAFIO 🚀'}
                  <ChevronRight className="w-5 h-5 stroke-[2.5px]" />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Sidebar Controls (Power-ups) */}
      <div className="w-full lg:w-72 space-y-6">
        <div className="bg-white border-3 border-brand-dark p-8 rounded-[2.5rem] shadow-[0px_6px_0px_#1E1B4B] relative overflow-hidden">
          <h3 className="text-xs font-display font-black uppercase tracking-wider text-[#5C5A8F] mb-6">Power-ups ⚡</h3>
          
          <div className="grid grid-cols-1 gap-4">
            <button
              onClick={handleDiceRoll}
              disabled={diceUsedInStage || isAnswered}
              className={cn(
                "w-full p-4 rounded-3xl border-3 flex items-center gap-3 transition-all duration-200 group cursor-pointer",
                diceUsedInStage 
                  ? "bg-slate-50 border-slate-300 text-slate-400 opacity-60 cursor-not-allowed shadow-none" 
                  : "bg-white border-brand-dark text-brand-dark shadow-[0px_4px_0px_#1E1B4B] hover:translate-y-[-2px] hover:shadow-[0px_6px_0px_#1E1B4B] active:translate-y-[2px]"
              )}
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-2 border-brand-dark", diceUsedInStage ? "bg-slate-100" : "bg-indigo-100 text-indigo-600 group-hover:scale-110 shadow-inner")}>
                <Dices className="w-6 h-6 stroke-[2.5px]" />
              </div>
              <div className="text-left font-display">
                <span className="block text-[10px] font-black uppercase tracking-tight text-[#5C5A8F]">{diceUsedInStage ? "Usado" : "Dice Sweep"}</span>
                <span className="text-sm font-black uppercase tracking-normal">Excluir 🎲</span>
              </div>
            </button>

            <button
              onClick={handleAudienceHelp}
              disabled={audienceUsedInStage || isAnswered}
              className={cn(
                "w-full p-4 rounded-3xl border-3 flex items-center gap-3 transition-all duration-200 group cursor-pointer",
                audienceUsedInStage 
                  ? "bg-slate-50 border-slate-300 text-slate-400 opacity-60 cursor-not-allowed shadow-none" 
                  : "bg-white border-brand-dark text-brand-dark shadow-[0px_4px_0px_#1E1B4B] hover:translate-y-[-2px] hover:shadow-[0px_6px_0px_#1E1B4B] active:translate-y-[2px]"
              )}
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-2 border-brand-dark", audienceUsedInStage ? "bg-slate-100" : "bg-pink-100 text-pink-600 group-hover:scale-110 shadow-inner")}>
                <Users className="w-6 h-6 stroke-[2.5px]" />
              </div>
              <div className="text-left font-display">
                <span className="block text-[10px] font-black uppercase tracking-tight text-[#5C5A8F]">{audienceUsedInStage ? "Usado" : "Crowd Pulse"}</span>
                <span className="text-sm font-black uppercase tracking-normal">Plateia 🗣️</span>
              </div>
            </button>

            <button
              onClick={handleHintClick}
              disabled={hintUsedInStage || isAnswered}
              className={cn(
                "w-full p-4 rounded-3xl border-3 flex items-center gap-3 transition-all duration-200 group relative cursor-pointer",
                hintUsedInStage 
                  ? "bg-slate-50 border-slate-300 text-slate-400 opacity-60 cursor-not-allowed shadow-none" 
                  : "bg-white border-brand-dark text-brand-dark shadow-[0px_4px_0px_#1E1B4B] hover:translate-y-[-2px] hover:shadow-[0px_6px_0px_#1E1B4B] active:translate-y-[2px]"
              )}
            >
              <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all border-2 border-brand-dark", hintUsedInStage ? "bg-slate-100" : "bg-yellow-100 text-yellow-650 group-hover:scale-110 shadow-inner")}>
                <Lightbulb className="w-6 h-6 stroke-[2.5px]" />
              </div>
              <div className="text-left font-display">
                <span className="block text-[10px] font-black uppercase tracking-tight text-[#5C5A8F]">{hintUsedInStage ? "Usado" : "IA Link"}</span>
                <span className="text-sm font-black uppercase tracking-normal text-yellow-650">Dica 💡</span>
              </div>
              {!hintUsedInStage && !isAnswered && (
                <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-yellow-500 rounded-full animate-ping" />
              )}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {showHint && currentQuestion.hint && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 10 }}
              className="bg-yellow-50 border-3 border-brand-dark p-6 rounded-[2rem] shadow-[0px_4px_0px_#1E1B4B] text-brand-dark text-sm"
            >
              <div className="flex items-center gap-2 font-display font-black uppercase tracking-wider text-xs mb-3 text-yellow-650">
                <Lightbulb className="w-4 h-4 stroke-[2.5px]" />
                Dica de IA:
              </div>
              <div className="font-semibold leading-relaxed italic">
                "<MathText text={currentQuestion.hint} />"
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={onStop}
          className="juv-btn-neutral w-full p-4 rounded-3xl font-display font-black text-xs uppercase tracking-wider flex items-center justify-center gap-3 cursor-pointer"
        >
          <LogOut className="w-4 h-4 stroke-[3px]" />
          Abandonar Fase
        </button>
      </div>
    </div>
  );
};
