/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HomeHeader } from './components/HomeHeader';
import { FlashcardComponent } from './components/FlashcardComponent';
import { QuizComponent, getStageTitle } from './components/QuizComponent';
import { AILoadingScreen } from './components/AILoadingScreen';
import { generateStudySession, generateNextStage } from './services/geminiService';
import { StudySession } from './types';
import { audio } from './lib/audioService';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookText, 
  CheckSquare, 
  ArrowLeft,
  Sparkles,
  Zap,
  Settings,
  BrainCircuit,
  Volume2,
  VolumeX,
  Music,
  ShieldAlert
} from 'lucide-react';

type ViewSate = 'home' | 'studying';
type StudyMode = 'flashcards' | 'quiz';

export default function App() {
  const [view, setView] = useState<ViewSate>('home');
  const [studyMode, setStudyMode] = useState<StudyMode>('flashcards');
  const [session, setSession] = useState<StudySession | null>(null);
  const [currentStage, setCurrentStage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingSubject, setLoadingSubject] = useState('');
  const [isGeneratingStage, setIsGeneratingStage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Flashcard navigation
  const [currentFlashcard, setCurrentFlashcard] = useState(0);

  // Continuation Battle states
  const [savedSessionInfo, setSavedSessionInfo] = useState<{ subject: string; stage: number } | null>(null);

  // Audio switches for sync'd React triggers
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);

  // Load configuration and cached save states at startup
  useEffect(() => {
    audio.loadSettings();
    setSoundEnabled(audio.soundEnabled);
    setMusicEnabled(audio.musicEnabled);

    const savedSess = localStorage.getItem('bb_saved_session');
    const savedStage = localStorage.getItem('bb_saved_stage');
    if (savedSess && savedStage) {
      try {
        const parsed = JSON.parse(savedSess);
        setSavedSessionInfo({
          subject: parsed.subject,
          stage: Number(savedStage) || 1
        });
      } catch (e) {
        console.error("Error reading saved session from storage", e);
      }
    }
  }, []);

  // Dynamically start/stop or change music files based on screen view state
  useEffect(() => {
    if (musicEnabled) {
      audio.startAmbientMusic(view);
    } else {
      audio.stopAmbientMusic();
    }
  }, [view, musicEnabled]);

  // Automatically caching active sessions in real-time
  useEffect(() => {
    if (session) {
      localStorage.setItem('bb_saved_session', JSON.stringify(session));
      localStorage.setItem('bb_saved_stage', String(currentStage));
      localStorage.setItem('bb_saved_mode', studyMode);
      localStorage.setItem('bb_saved_flashcard', String(currentFlashcard));
      setSavedSessionInfo({
        subject: session.subject,
        stage: currentStage
      });
    }
  }, [session, currentStage, studyMode, currentFlashcard]);

  const toggleSound = () => {
    const nextVal = !soundEnabled;
    audio.soundEnabled = nextVal;
    setSoundEnabled(nextVal);
    audio.playClick();
  };

  const toggleMusic = () => {
    const nextVal = !musicEnabled;
    audio.musicEnabled = nextVal;
    setMusicEnabled(nextVal);
    audio.playClick();
  };

  const startStudying = async (subject: string) => {
    setIsLoading(true);
    setLoadingSubject(subject);
    setError(null);
    setCurrentStage(1);
    try {
      const data = await generateStudySession(subject);
      setSession(data);
      setView('studying');
      setCurrentFlashcard(0);
      setStudyMode('flashcards');
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro ao gerar o conteúdo. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueSession = () => {
    audio.playClick();
    const savedSess = localStorage.getItem('bb_saved_session');
    const savedStage = localStorage.getItem('bb_saved_stage');
    const savedMode = localStorage.getItem('bb_saved_mode') as StudyMode || 'flashcards';
    const savedFlashcard = Number(localStorage.getItem('bb_saved_flashcard')) || 0;

    if (savedSess && savedStage) {
      try {
        const parsed = JSON.parse(savedSess);
        setSession(parsed);
        setCurrentStage(Number(savedStage));
        setStudyMode(savedMode);
        setCurrentFlashcard(savedFlashcard);
        setView('studying');
      } catch (e) {
        console.error("Failed to restore saved session", e);
      }
    }
  };

  const handleDiscardSave = () => {
    audio.playClick();
    localStorage.removeItem('bb_saved_session');
    localStorage.removeItem('bb_saved_stage');
    localStorage.removeItem('bb_saved_mode');
    localStorage.removeItem('bb_saved_flashcard');
    setSavedSessionInfo(null);
  };

  const handleAbortMission = () => {
    audio.playClick();
    setView('home');
    setSession(null);
    setCurrentStage(1);
    setCurrentFlashcard(0);
    // Erase the cached session to allow initiating empty fresh battles
    localStorage.removeItem('bb_saved_session');
    localStorage.removeItem('bb_saved_stage');
    localStorage.removeItem('bb_saved_mode');
    localStorage.removeItem('bb_saved_flashcard');
    setSavedSessionInfo(null);
  };

  const handleNextStage = async () => {
    if (!session) return;
    
    setIsGeneratingStage(true);
    try {
      const nextStageQuestions = await generateNextStage(session.subject, currentStage + 1);
      setSession({
        ...session,
        quiz: nextStageQuestions
      });
      setCurrentStage(s => s + 1);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Falha ao gerar o próximo nível. Tente novamente.');
    } finally {
      setIsGeneratingStage(false);
    }
  };

  const nextFlashcard = () => {
    audio.playClick();
    if (session && currentFlashcard < session.flashcards.length - 1) {
      setCurrentFlashcard(c => c + 1);
    }
  };

  const prevFlashcard = () => {
    audio.playClick();
    if (currentFlashcard > 0) {
      setCurrentFlashcard(c => c - 1);
    }
  };

  return (
    <div className="min-h-screen bg-study-bg bg-mesh relative text-brand-dark">
      {/* Header */}
      <nav className="relative pt-4 z-50 px-4">
        <div className="max-w-5xl mx-auto flex justify-between items-center transition-all bg-white border-3 border-brand-dark px-5 md:px-8 py-3.5 rounded-2xl md:rounded-full shadow-[0px_4px_0px_#1E1B4B]">
          <div 
             className="flex items-center gap-2 cursor-pointer group"
             onClick={handleAbortMission}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-brand-primary border-2 border-brand-dark rounded-xl flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform">
              <Zap className="w-5 h-5 md:w-6 md:h-6 text-white fill-brand-yellow font-bold stroke-[#1E1B4B]" />
            </div>
            <span className="font-display font-black text-xl md:text-2xl tracking-tight text-brand-dark">BRAIN<span className="text-brand-primary">BLITZ</span></span>
          </div>

          <div className="flex items-center gap-4">
             {view === 'studying' && session && (
               <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#FFFDF5] rounded-full border-2 border-brand-dark text-[10px] font-display font-black text-[#5C5A8F]">
                  <span className="w-2.5 h-2.5 bg-brand-accent border border-brand-dark rounded-full animate-pulse" />
                  ALVO: <span className="text-brand-primary uppercase">{session.subject.split(": ")[1] || session.subject}</span>
               </div>
             )}
             <div className="flex items-center gap-2">
                <button 
                  onClick={toggleSound}
                  title={soundEnabled ? "Desativar Sons" : "Ativar Sons"}
                  className={`p-2 shadow-[0px_3px_0px_0px_#1E1B4B] active:translate-y-[2px] active:shadow-none bg-white border-2 border-brand-dark rounded-xl transition-all cursor-pointer ${
                    soundEnabled ? "text-brand-primary" : "text-slate-400"
                  }`}
                 >
                   {soundEnabled ? <Volume2 className="w-4 h-4 md:w-5 h-5 stroke-[2.5px]" /> : <VolumeX className="w-4 h-4 md:w-5 h-5 stroke-[2.5px]" />}
                </button>
                <button 
                  onClick={toggleMusic}
                  title={musicEnabled ? "Desativar Música de Fundo" : "Ativar Música de Fundo"}
                  className={`p-2 shadow-[0px_3px_0px_0px_#1E1B4B] active:translate-y-[2px] active:shadow-none bg-white border-2 border-brand-dark rounded-xl transition-all cursor-pointer ${
                    musicEnabled ? "text-brand-secondary" : "text-slate-400"
                  }`}
                >
                  <Music className="w-4 h-4 md:w-5 h-5 stroke-[2.5px]" />
                </button>
                {view === 'studying' && (
                  <button 
                    onClick={handleAbortMission}
                    className="px-3 py-1.5 bg-rose-100 uppercase font-display font-black text-[10px] hover:bg-rose-200 text-rose-800 rounded-xl border-2 border-brand-dark shadow-[0px_3px_0px_default] active:translate-y-[2px] transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 stroke-[3px]" />
                    SAIR
                  </button>
                )}
             </div>
          </div>
        </div>
      </nav>

      <main className="relative pt-8 pb-20">
        {error && (
          <div className="max-w-2xl mx-auto mb-8 px-6">
            <div className="p-4 md:p-6 bg-rose-50 border-3 border-brand-dark text-rose-800 rounded-3xl text-center font-display font-black text-sm backdrop-blur-md relative flex flex-col md:flex-row items-center justify-between gap-4 shadow-[0px_4px_0px_#1E1B4B]">
              <span className="flex-1 text-center md:text-left">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="juv-btn-primary px-4 py-2 rounded-xl text-xs transition-all whitespace-nowrap tracking-wider font-display font-black cursor-pointer"
              >
                FECHAR
              </button>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="generative-loading"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <AILoadingScreen subject={loadingSubject} />
            </motion.div>
          ) : view === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
            >
              <HomeHeader 
                onStart={startStudying} 
                isLoading={isLoading} 
                savedSessionInfo={savedSessionInfo}
                onContinue={handleContinueSession}
                onDiscardSave={handleDiscardSave}
              />
            </motion.div>
          ) : session ? (
            <motion.div
              key="studying"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              className="max-w-7xl mx-auto px-6"
            >
              {isGeneratingStage ? (
                <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
                  <div className="relative mb-8">
                     <div className="w-16 h-16 border-4 border-slate-200 border-t-brand-primary rounded-full animate-spin" />
                     <BrainCircuit className="absolute inset-0 m-auto w-6 h-6 text-brand-primary animate-pulse stroke-[2px]" />
                  </div>
                  <h2 className="text-2xl md:text-4xl font-display font-black text-brand-dark mb-2 uppercase tracking-tight">EVOLUINDO PARA A FASE {currentStage + 1}! 🚀</h2>
                  <p className="text-[#5C5A8F] font-bold max-w-sm text-sm">A IA está pensando e desenhando novos desafios incríveis para você!</p>
                </div>
              ) : (
                <>
                  <div className="flex flex-col items-center mb-8 md:mb-12">
                    {session.isOfflineFallback ? (
                      <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 rounded-full border-2 border-brand-dark text-amber-800 font-display font-black text-xs uppercase tracking-wider mb-4 shadow-[0px_3px_0px_#1E1B4B] cursor-default" title="Os servidores de IA estão instáveis ou atingiram a cota. Ativamos o modo offline de segurança para você nunca parar de estudar!">
                        <ShieldAlert className="w-4 h-4 text-amber-600 animate-pulse" />
                        Modo Offline Ativado 🛡️
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-4 py-2 bg-yellow-105 rounded-full border-2 border-brand-dark text-brand-dark font-display font-black text-xs uppercase tracking-wider mb-4 shadow-[0px_3px_0px_#1E1B4B]">
                        <Sparkles className="w-4 h-4 text-brand-primary animate-pulse" />
                        Missão de IA Ativa ⚡
                      </div>
                    )}
                    <h1 className="text-4xl md:text-6xl font-display font-black text-brand-dark tracking-tight mb-8 md:mb-10 text-center uppercase">
                      {session.subject}
                    </h1>

                    <div className="inline-flex p-2 bg-[#FFFDF5] border-3 border-brand-dark shadow-[0px_4px_0px_#1E1B4B] rounded-[1.5rem] gap-2">
                      <button
                        onClick={() => { audio.playClick(); setStudyMode('flashcards'); }}
                        className={cn(
                          "px-6 md:px-8 py-3 rounded-xl font-display font-black text-xs transition-all flex items-center gap-2 uppercase tracking-wider cursor-pointer",
                          studyMode === 'flashcards' 
                          ? 'juv-btn-primary' 
                          : 'text-slate-500 hover:text-brand-dark hover:bg-slate-100'
                        )}
                      >
                        <BookText className="w-4 h-4 stroke-[2.5px]" />
                        Estudar 📚
                      </button>
                      <button
                        onClick={() => { audio.playClick(); setStudyMode('quiz'); }}
                        className={cn(
                          "px-6 md:px-8 py-3 rounded-xl font-display font-black text-xs transition-all flex items-center gap-2 uppercase tracking-wider cursor-pointer",
                          studyMode === 'quiz' 
                          ? 'juv-btn-secondary' 
                          : 'text-slate-500 hover:text-brand-dark hover:bg-slate-100'
                        )}
                      >
                        <CheckSquare className="w-4 h-4 stroke-[2.5px]" />
                        Batalhar ⚔️
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    {studyMode === 'flashcards' ? (
                      <div className="w-full flex flex-col items-center">
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={currentFlashcard}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="w-full flex justify-center"
                          >
                            <FlashcardComponent 
                              front={session.flashcards[currentFlashcard].front}
                              back={session.flashcards[currentFlashcard].back}
                              imageUrl={session.flashcards[currentFlashcard].imageUrl}
                            />
                          </motion.div>
                        </AnimatePresence>

                        <div className="mt-10 md:mt-12 flex items-center gap-8 md:gap-10 select-none">
                          <button
                            onClick={prevFlashcard}
                            disabled={currentFlashcard === 0}
                            className="w-14 h-14 rounded-2xl bg-white border-2 border-brand-dark shadow-[0px_4px_0px_#1E1B4B] flex items-center justify-center text-brand-dark hover:bg-slate-50 disabled:opacity-20 transition-all group cursor-pointer"
                          >
                            <ChevronLeft className="w-7 h-7 stroke-[2.5px] group-hover:-translate-x-1 transition-transform" />
                          </button>
                          
                          <div className="flex flex-col items-center">
                            <span className="text-[10px] font-display font-black uppercase tracking-wider text-[#5C5A8F] mb-1">CARTÃO</span>
                            <div className="text-xl md:text-2xl font-display font-black text-brand-dark tabular-nums">
                              {String(currentFlashcard + 1).padStart(2, '0')}
                              <span className="text-slate-400 mx-1.5">/</span>
                              {String(session.flashcards.length).padStart(2, '0')}
                            </div>
                          </div>

                          <button
                            onClick={nextFlashcard}
                            disabled={currentFlashcard === session.flashcards.length - 1}
                            className="w-14 h-14 rounded-2xl bg-white border-2 border-brand-dark shadow-[0px_4px_0px_#1E1B4B] flex items-center justify-center text-brand-dark hover:bg-slate-50 disabled:opacity-20 transition-all group cursor-pointer"
                          >
                            <ChevronRight className="w-7 h-7 stroke-[2.5px] group-hover:translate-x-1 transition-transform" />
                          </button>
                        </div>
                        
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="mt-12 p-6 bg-white border-3 border-brand-dark rounded-[2rem] max-w-sm text-center shadow-[4px_4px_0px_#1E1B4B]"
                        >
                           <p className="text-brand-dark text-xs font-semibold leading-relaxed">
                            Domine todos os segredos dos cards para desbloquear o Quiz e avançar na sua jornada de domínio! 🎯
                           </p>
                        </motion.div>
                      </div>
                    ) : (
                      <QuizComponent 
                        stage={currentStage}
                        questions={session.quiz} 
                        onNextStage={handleNextStage}
                        onStop={() => { audio.playClick(); setView('home'); }}
                      />
                    )}
                  </div>
                </>
              )}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      <footer className="py-12 px-6 flex flex-col items-center gap-4 text-[#8481B5]">
        <div className="flex items-center gap-2 opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
           <Zap className="w-4 h-4 fill-brand-primary stroke-[#1E1B4B]" />
           <span className="text-[10px] font-display font-black uppercase tracking-widest text-[#1E1B4B]">BRAINBLITZ GAME v2.0 ⚡</span>
        </div>
        <p className="text-[9px] font-display font-black uppercase tracking-widest text-slate-400">
          Powered by Gemini AI &bull; Born to Play & Learn
        </p>
      </footer>
    </div>
  );
}

// Utility to join classes
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
