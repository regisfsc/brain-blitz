import { StudySession, QuizQuestion } from "../types";

export async function generateStudySession(subject: string): Promise<StudySession> {
  const response = await fetch("/api/study-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subject }),
  });

  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    let errorMsg = `Erro ${response.status}: ${response.statusText}`;
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData.error) errorMsg = errorData.error;
    }
    throw new Error(errorMsg);
  }

  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    console.error("Esperava JSON, mas recebeu:", text.substring(0, 200));
    throw new Error("O servidor de IA retornou uma resposta inválida ou está reiniciando. Por favor, tente novamente em alguns instantes.");
  }

  const rawData = await response.json();

  // Transform imageSearchTerm to URL using Pollinations Flux with a technical style on the client side
  const transform = (item: any, lockId: number) => {
    const term = item.imageSearchTerm?.trim();
    // Neutral academic style
    const stylePrefix = "Extremely precise technical blueprint style on PURE WHITE BACKGROUND, minimalist black and white line art, scientific textbook diagram, high contrast, clean schematic, light theme, no dark colors: ";
    return {
      ...item,
      imageUrl: term ? `https://image.pollinations.ai/prompt/${encodeURIComponent(stylePrefix + term)}?width=800&height=600&model=flux&nologo=true&seed=${lockId}` : undefined
    };
  };

  return {
    ...rawData,
    flashcards: rawData.flashcards.map((item: any, idx: number) => transform(item, idx + 42)),
    quiz: rawData.quiz.map((item: any, idx: number) => transform(item, idx + 100))
  } as StudySession;
}

export async function generateNextStage(subject: string, stage: number): Promise<QuizQuestion[]> {
  const response = await fetch("/api/next-stage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ subject, stage }),
  });

  const contentType = response.headers.get("content-type");

  if (!response.ok) {
    let errorMsg = `Erro ${response.status}: ${response.statusText}`;
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json().catch(() => ({}));
      if (errorData.error) errorMsg = errorData.error;
    }
    throw new Error(errorMsg);
  }

  if (!contentType || !contentType.includes("application/json")) {
    const text = await response.text();
    console.error("Esperava JSON, mas recebeu:", text.substring(0, 200));
    throw new Error("O servidor de IA retornou uma resposta inválida ou está reiniciando. Por favor, tente novamente em alguns instantes.");
  }

  const rawData = await response.json();

  const transform = (item: any, lockId: number) => {
    const term = item.imageSearchTerm?.trim();
    const stylePrefix = "Extremely precise technical drawing on PURE WHITE BACKGROUND, minimalist scientific black line art, light theme, educational schematic, clear technical labels: ";
    return {
      ...item,
      imageUrl: term ? `https://image.pollinations.ai/prompt/${encodeURIComponent(stylePrefix + term)}?width=800&height=600&model=flux&nologo=true&seed=${lockId}` : undefined
    };
  };

  return rawData.map((item: any, idx: number) => transform(item, idx + (stage * 50))) as QuizQuestion[];
}

export async function getStoredSubjects(): Promise<string[]> {
  try {
    const response = await fetch("/api/stored-subjects");
    if (!response.ok) return [];
    const data = await response.json();
    return data.subjects || [];
  } catch (e) {
    console.error("Erro ao carregar assuntos salvos:", e);
    return [];
  }
}

