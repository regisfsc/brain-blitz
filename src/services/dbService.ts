import fs from 'fs/promises';
import path from 'path';
import { StudySession, QuizQuestion } from '../types';

const DB_FILE_PATH = path.join(process.cwd(), 'sessions_db.json');

// Normalize subject for matching (case-insensitive, remove accents, trim)
function normalizeSubject(subject: string): string {
  return (subject || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .trim()
    .replace(/\s+/g, ' '); // collapse extra spaces
}

interface StoredDb {
  [normalizedSubject: string]: {
    subject: string; // Original input subject format
    flashcards: any[];
    quiz: any[];
  };
}

function sanitizeTeXExpressions(value: any): any {
  if (typeof value === 'string') {
    return value
      .replace(/\\+implies/g, '→')
      .replace(/\\+rightarrow/g, '→')
      .replace(/\\+to/g, '→')
      .replace(/\\+/g, ''); // limpa qualquer barra invertida literal
  }
  if (Array.isArray(value)) {
    return value.map(sanitizeTeXExpressions);
  }
  if (value && typeof value === 'object') {
    const res: any = {};
    for (const key of Object.keys(value)) {
      res[key] = sanitizeTeXExpressions(value[key]);
    }
    return res;
  }
  return value;
}

async function readDb(): Promise<StoredDb> {
  try {
    const data = await fs.readFile(DB_FILE_PATH, 'utf-8');
    const parsed = JSON.parse(data);
    return sanitizeTeXExpressions(parsed);
  } catch (error: any) {
    // If file doesn't exist, return empty object
    if (error.code === 'ENOENT') {
      return {};
    }
    console.error('[Database] Erro ao ler banco de dados. Tentando resetar:', error);
    return {};
  }
}

async function writeDb(db: StoredDb): Promise<void> {
  try {
    const sanitizedDb = sanitizeTeXExpressions(db);
    await fs.writeFile(DB_FILE_PATH, JSON.stringify(sanitizedDb, null, 2), 'utf-8');
  } catch (error) {
    console.error('[Database] Erro crítico ao salvar no banco de dados:', error);
  }
}

export async function getStoredSubjectsList(): Promise<string[]> {
  const db = await readDb();
  return Object.values(db).map(entry => entry.subject);
}

export async function getStoredSession(subject: string): Promise<StudySession | null> {
  const db = await readDb();
  const normalized = normalizeSubject(subject);
  const entry = db[normalized];
  if (!entry) return null;

  // We only return Stage 1 (first 10 questions) on initial fetch
  // to avoid sending the whole pool to the client immediately, which keeps the client synchronized
  const quizSubset = entry.quiz.slice(0, 10);
  return {
    subject: entry.subject,
    flashcards: entry.flashcards,
    quiz: quizSubset,
  };
}

export async function saveSession(subject: string, sessionData: any): Promise<void> {
  const db = await readDb();
  const normalized = normalizeSubject(subject);
  
  // If there's an existing entry, merge, keeping all accumulated quiz questions if we already have more than 10
  const existingEntry = db[normalized];
  if (existingEntry) {
    // Ensure we don't drop existing quiz questions (e.g. if we have Stage 2, Stage 3 stored)
    const newQuiz = [...sessionData.quiz];
    if (existingEntry.quiz.length > newQuiz.length) {
      // Overwrite first N, keep remainder
      for (let i = 0; i < newQuiz.length; i++) {
        existingEntry.quiz[i] = newQuiz[i];
      }
    } else {
      existingEntry.quiz = newQuiz;
    }
    existingEntry.flashcards = sessionData.flashcards;
    existingEntry.subject = sessionData.subject || subject;
  } else {
    db[normalized] = {
      subject: sessionData.subject || subject,
      flashcards: sessionData.flashcards,
      quiz: sessionData.quiz,
    };
  }

  await writeDb(db);
  console.log(`[Database] Sessão salva com sucesso para: "${subject}"`);
}

export async function getStoredNextStage(subject: string, stage: number): Promise<QuizQuestion[] | null> {
  const db = await readDb();
  const normalized = normalizeSubject(subject);
  const entry = db[normalized];
  if (!entry) return null;

  const startIndex = (stage - 1) * 10;
  const endIndex = stage * 10;

  // Check if we already have enough questions for this stage in the pool
  if (entry.quiz && entry.quiz.length >= endIndex) {
    console.log(`[Database] Questões encontradas em cache para "${subject}" etapa ${stage} (índices ${startIndex} a ${endIndex - 1})`);
    return entry.quiz.slice(startIndex, endIndex);
  }

  return null;
}

export async function saveNextStageQuestions(subject: string, stage: number, newQuestions: any[]): Promise<void> {
  const db = await readDb();
  const normalized = normalizeSubject(subject);
  const entry = db[normalized];
  if (!entry) {
    console.warn(`[Database] Tentativa de adicionar etapa ${stage} para assunto inexistente: "${subject}". Criando nova entrada.`);
    db[normalized] = {
      subject,
      flashcards: [],
      quiz: [],
    };
  }

  const currentEntry = db[normalized];
  const startIndex = (stage - 1) * 10;

  // Insert or append new questions at the correct indices
  // Ensure the quiz array is padded up to the startIndex if there are gaps
  while (currentEntry.quiz.length < startIndex) {
    currentEntry.quiz.push({
      id: `placeholder_${currentEntry.quiz.length}`,
      question: "Carregando...",
      options: ["A", "B", "C", "D", "E"],
      correctAnswer: 0,
      explanation: "",
      hint: "",
      imageSearchTerm: "",
      source: "Sistema"
    });
  }

  // Overwrite or append starting at startIndex
  for (let i = 0; i < newQuestions.length; i++) {
    currentEntry.quiz[startIndex + i] = newQuestions[i];
  }

  await writeDb(db);
  console.log(`[Database] Salvas ${newQuestions.length} questões inéditas para "${subject}" etapa ${stage}`);
}
