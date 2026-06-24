import { fallbackSessions } from "../data/fallbackSessions";
import { StudySession, QuizQuestion } from "../types";

const LOCAL_SUBJECTS_KEY = "bb_local_subjects";

function normalizeText(value: string): string {
  return (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function getTopicOnly(subject: string): string {
  return subject.includes(":") ? subject.split(":").slice(1).join(":").trim() : subject.trim();
}

function getFallbackKey(subject: string): keyof typeof fallbackSessions {
  const norm = normalizeText(subject);

  if (
    norm.includes("geo") ||
    norm.includes("mate") ||
    norm.includes("calculo") ||
    norm.includes("angulo") ||
    norm.includes("area") ||
    norm.includes("volume") ||
    norm.includes("triang") ||
    norm.includes("circu") ||
    norm.includes("pitagoras") ||
    norm.includes("polig") ||
    norm.includes("trigonom")
  ) {
    return "geometria";
  }

  if (
    norm.includes("cel") ||
    norm.includes("organ") ||
    norm.includes("bio") ||
    norm.includes("vida") ||
    norm.includes("genet") ||
    norm.includes("mito") ||
    norm.includes("pla") ||
    norm.includes("cito") ||
    norm.includes("corpo")
  ) {
    return "citologia";
  }

  if (
    norm.includes("quim") ||
    norm.includes("estequ") ||
    norm.includes("mol") ||
    norm.includes("reac") ||
    norm.includes("solu") ||
    norm.includes("mass") ||
    norm.includes("atom")
  ) {
    return "estequiometria";
  }

  if (
    norm.includes("energ") ||
    norm.includes("cinet") ||
    norm.includes("potenc") ||
    norm.includes("trabal") ||
    norm.includes("cons") ||
    norm.includes("mecan")
  ) {
    return "energia_mecanica";
  }

  if (
    norm.includes("mru") ||
    norm.includes("mruv") ||
    norm.includes("cinem") ||
    norm.includes("movi") ||
    norm.includes("veloc") ||
    norm.includes("acel") ||
    norm.includes("traje") ||
    norm.includes("espaco")
  ) {
    return "mecanica";
  }

  if (
    norm.includes("fisic") ||
    norm.includes("eletro") ||
    norm.includes("resis") ||
    norm.includes("ohm") ||
    norm.includes("tens") ||
    norm.includes("volt") ||
    norm.includes("corren") ||
    norm.includes("calor")
  ) {
    return "eletrodinamica";
  }

  const keys = Object.keys(fallbackSessions) as Array<keyof typeof fallbackSessions>;
  const index = (subject || "").length % keys.length;
  return keys[index] || "eletrodinamica";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function createLocalDiagramUrl(searchTerm: string, subject: string, index: number): string {
  const term = escapeHtml((searchTerm || getTopicOnly(subject) || "Diagrama de estudo").slice(0, 56));
  const norm = normalizeText(`${subject} ${searchTerm}`);

  let accent = "#FF4D79";
  let secondary = "#4F46E5";
  let drawing = `
    <circle cx="160" cy="140" r="44" fill="none" stroke="#1E1B4B" stroke-width="8"/>
    <circle cx="250" cy="190" r="30" fill="none" stroke="#1E1B4B" stroke-width="8"/>
    <circle cx="345" cy="135" r="38" fill="none" stroke="#1E1B4B" stroke-width="8"/>
    <path d="M202 158 L222 178 M280 178 L312 152" stroke="#1E1B4B" stroke-width="8" stroke-linecap="round"/>
  `;

  if (norm.includes("elet") || norm.includes("resis") || norm.includes("corrente") || norm.includes("ohm") || norm.includes("volt")) {
    accent = "#FBBF24";
    secondary = "#10B981";
    drawing = `
      <path d="M98 180 H170 L188 130 L228 230 L268 130 L308 230 L348 130 L368 180 H462" fill="none" stroke="#1E1B4B" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="98" cy="180" r="13" fill="#FBBF24" stroke="#1E1B4B" stroke-width="6"/>
      <circle cx="462" cy="180" r="13" fill="#10B981" stroke="#1E1B4B" stroke-width="6"/>
      <path d="M430 118 l35 62 l-35 62" fill="none" stroke="#FF4D79" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
    `;
  } else if (norm.includes("bio") || norm.includes("cel") || norm.includes("mito") || norm.includes("organel")) {
    accent = "#10B981";
    secondary = "#4F46E5";
    drawing = `
      <ellipse cx="280" cy="175" rx="175" ry="98" fill="#ECFDF5" stroke="#1E1B4B" stroke-width="8"/>
      <circle cx="250" cy="165" r="44" fill="#DBEAFE" stroke="#1E1B4B" stroke-width="7"/>
      <path d="M330 154 c44 -30 80 28 36 54 c-38 22 -84 -14 -58 -42" fill="#FDE68A" stroke="#1E1B4B" stroke-width="6"/>
      <path d="M150 190 c36 -24 70 -20 104 10" fill="none" stroke="#10B981" stroke-width="7" stroke-linecap="round"/>
    `;
  } else if (norm.includes("quim") || norm.includes("mol") || norm.includes("atom") || norm.includes("reac")) {
    accent = "#4F46E5";
    secondary = "#10B981";
    drawing = `
      <circle cx="165" cy="165" r="42" fill="#DBEAFE" stroke="#1E1B4B" stroke-width="8"/>
      <circle cx="280" cy="110" r="34" fill="#FDE68A" stroke="#1E1B4B" stroke-width="8"/>
      <circle cx="375" cy="205" r="46" fill="#DCFCE7" stroke="#1E1B4B" stroke-width="8"/>
      <path d="M204 148 L248 124 M308 134 L342 176" stroke="#1E1B4B" stroke-width="9" stroke-linecap="round"/>
      <path d="M120 250 H435" stroke="#FF4D79" stroke-width="7" stroke-linecap="round" stroke-dasharray="12 14"/>
    `;
  } else if (norm.includes("geo") || norm.includes("triang") || norm.includes("angulo") || norm.includes("area") || norm.includes("pitag") || norm.includes("polig")) {
    accent = "#4F46E5";
    secondary = "#FBBF24";
    drawing = `
      <path d="M150 235 L278 95 L420 235 Z" fill="#EEF2FF" stroke="#1E1B4B" stroke-width="8" stroke-linejoin="round"/>
      <path d="M278 95 V235" stroke="#FF4D79" stroke-width="7" stroke-linecap="round" stroke-dasharray="10 12"/>
      <circle cx="278" cy="95" r="13" fill="#FBBF24" stroke="#1E1B4B" stroke-width="5"/>
      <path d="M150 235 Q204 200 228 235" fill="none" stroke="#10B981" stroke-width="7" stroke-linecap="round"/>
    `;
  } else if (norm.includes("mecan") || norm.includes("energia") || norm.includes("veloc") || norm.includes("forca") || norm.includes("trabalho")) {
    accent = "#FBBF24";
    secondary = "#FF4D79";
    drawing = `
      <path d="M105 235 H455" stroke="#1E1B4B" stroke-width="9" stroke-linecap="round"/>
      <rect x="180" y="160" width="96" height="62" rx="18" fill="#DBEAFE" stroke="#1E1B4B" stroke-width="8"/>
      <path d="M286 190 H420" stroke="#FF4D79" stroke-width="8" stroke-linecap="round"/>
      <path d="M420 190 l-32 -25 M420 190 l-32 25" stroke="#FF4D79" stroke-width="8" stroke-linecap="round"/>
      <circle cx="205" cy="235" r="16" fill="#FBBF24" stroke="#1E1B4B" stroke-width="6"/>
      <circle cx="255" cy="235" r="16" fill="#10B981" stroke="#1E1B4B" stroke-width="6"/>
    `;
  }

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 560 380" role="img" aria-label="${term}">
      <rect width="560" height="380" rx="42" fill="#FFFDF5"/>
      <circle cx="96" cy="82" r="42" fill="${accent}" opacity="0.16"/>
      <circle cx="468" cy="84" r="55" fill="${secondary}" opacity="0.12"/>
      <circle cx="474" cy="298" r="44" fill="#FBBF24" opacity="0.14"/>
      <g transform="translate(0 ${index % 2 === 0 ? 0 : 4})">${drawing}</g>
      <rect x="80" y="292" width="400" height="48" rx="18" fill="#FFFFFF" stroke="#1E1B4B" stroke-width="5"/>
      <text x="280" y="323" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="800" fill="#1E1B4B">${term}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function withLocalDiagrams<T extends { imageSearchTerm?: string; imageUrl?: string }>(items: T[], subject: string, offset = 0): T[] {
  return items.map((item, index) => ({
    ...item,
    imageUrl: createLocalDiagramUrl(item.imageSearchTerm || "", subject, index + offset),
  }));
}

function readLocalSubjects(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_SUBJECTS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveLocalSubject(subject: string): void {
  try {
    const current = readLocalSubjects();
    const updated = Array.from(new Set([subject, ...current])).slice(0, 50);
    localStorage.setItem(LOCAL_SUBJECTS_KEY, JSON.stringify(updated));
  } catch {
    // localStorage can be unavailable in restricted browser contexts. The app still works.
  }
}

function buildSessionFromFallback(subject: string): StudySession {
  const fallbackKey = getFallbackKey(subject);
  const baseSession = fallbackSessions[fallbackKey] || fallbackSessions.eletrodinamica;
  const cloned = JSON.parse(JSON.stringify(baseSession)) as StudySession;
  const resolvedSubject = subject?.trim() || cloned.subject || "Estudo Geral";

  return {
    ...cloned,
    subject: resolvedSubject,
    isOfflineFallback: true,
    flashcards: withLocalDiagrams(cloned.flashcards || [], resolvedSubject, 42),
    quiz: withLocalDiagrams(cloned.quiz || [], resolvedSubject, 100),
  };
}

export async function generateStudySession(subject: string): Promise<StudySession> {
  const session = buildSessionFromFallback(subject);
  saveLocalSubject(session.subject);
  return session;
}

export async function generateNextStage(subject: string, stage: number): Promise<QuizQuestion[]> {
  const session = buildSessionFromFallback(subject);
  const baseQuestions = session.quiz || [];

  return baseQuestions.map((question, index) => {
    const options = [...question.options];
    const correctText = options[question.correctAnswer];
    const shift = (stage + index) % options.length;
    const rotatedOptions = options.map((_, optionIndex) => options[(optionIndex + shift) % options.length]);
    const newCorrectAnswer = rotatedOptions.indexOf(correctText);

    return {
      ...question,
      id: `q_local_stage_${stage}_${index}`,
      options: rotatedOptions,
      correctAnswer: newCorrectAnswer >= 0 ? newCorrectAnswer : question.correctAnswer,
      question: `[Nível ${stage}] ${question.question}`,
      source: `${question.source || "Banco local"} • Fallback estático`,
      imageUrl: createLocalDiagramUrl(question.imageSearchTerm || "", subject, index + stage * 50),
    };
  });
}

export async function getStoredSubjects(): Promise<string[]> {
  const bundledSubjects = Object.values(fallbackSessions).map((session) => session.subject);
  const savedSubjects = readLocalSubjects();
  return Array.from(new Set([...savedSubjects, ...bundledSubjects]));
}
