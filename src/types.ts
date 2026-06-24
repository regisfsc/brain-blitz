export interface Flashcard {
  id: string;
  front: string;
  back: string;
  imageUrl?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint?: string;
  imageUrl?: string;
  imageSearchTerm?: string;
  svgDiagram?: string;
  source?: string;
}

export interface StudySession {
  subject: string;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  isOfflineFallback?: boolean;
}

export type HelpType = 'hint' | 'dice' | 'audience';
