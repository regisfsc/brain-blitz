import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { fallbackSessions } from "./src/data/fallbackSessions";
import { getStoredSession, saveSession, getStoredNextStage, saveNextStageQuestions, getStoredSubjectsList } from "./src/services/dbService";

const app = express();
const PORT = 3000;

// Helper to normalize subject search and find appropriate local backup session
function getFallbackSession(subject: string): any {
  const norm = (subject || "").toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // remove accents
  
  let key = "eletrodinamica"; // default
  if (norm.includes("geo") || norm.includes("mate") || norm.includes("calculo") || norm.includes("angulo") || norm.includes("area") || norm.includes("volume") || norm.includes("triang") || norm.includes("circu") || norm.includes("pitagoras") || norm.includes("polig")) {
    key = "geometria";
  } else if (norm.includes("cel") || norm.includes("organ") || norm.includes("bio") || norm.includes("vida") || norm.includes("genet") || norm.includes("mito") || norm.includes("pla") || norm.includes("cito") || norm.includes("corpo")) {
    key = "citologia";
  } else if (norm.includes("quim") || norm.includes("estequ") || norm.includes("mol") || norm.includes("reac") || norm.includes("solu") || norm.includes("mass") || norm.includes("atom")) {
    key = "estequiometria";
  } else if (norm.includes("energ") || norm.includes("cinet") || norm.includes("potenc") || norm.includes("trabal") || norm.includes("cons") || norm.includes("mecan")) {
    key = "energia_mecanica";
  } else if (norm.includes("mru") || norm.includes("mruv") || norm.includes("cinem") || norm.includes("movi") || norm.includes("veloc") || norm.includes("acel") || norm.includes("traje") || norm.includes("espa")) {
    key = "mecanica";
  } else if (norm.includes("fisic") || norm.includes("eletro") || norm.includes("circu") || norm.includes("resis") || norm.includes("ohm") || norm.includes("tens") || norm.includes("volt") || norm.includes("corren") || norm.includes("calor")) {
    key = "eletrodinamica";
  } else {
    // Pick based on subject length to keep it consistent but varied
    const keys = ["eletrodinamica", "citologia", "estequiometria", "mecanica", "energia_mecanica", "geometria"];
    const idx = (subject || "").length % keys.length;
    key = keys[idx];
  }

  const baseSession = fallbackSessions[key];
  if (!baseSession) {
    return {
      subject: subject || "Estudo Geral",
      flashcards: [],
      quiz: [],
      isOfflineFallback: true
    };
  }

  // Create clean adaptive deep copy
  return {
    subject: subject, // Maintain requested subject name for gorgeous Continuity UX
    flashcards: JSON.parse(JSON.stringify(baseSession.flashcards)),
    quiz: JSON.parse(JSON.stringify(baseSession.quiz)),
    isOfflineFallback: true
  };
}

function getFallbackNextStage(subject: string, stage: number): any[] {
  const session = getFallbackSession(subject);
  const baseQuestions = session.quiz;
  if (!baseQuestions || baseQuestions.length === 0) return [];
  
  // Rotate and adapt options to make Stage 2 feel fresh and fun compared to Stage 1
  return baseQuestions.map((q: any, idx: number) => {
    const options = [...q.options];
    const originalAnswer = q.correctAnswer;
    const textAnswer = options[originalAnswer];
    
    const shift = (stage + idx) % options.length;
    const rotatedOptions: string[] = [];
    for (let i = 0; i < options.length; i++) {
      rotatedOptions.push(options[(i + shift) % options.length]);
    }
    const newAnswerIdx = rotatedOptions.indexOf(textAnswer);
    
    return {
      ...q,
      id: `q_fallback_stg_${stage}_${idx}`,
      options: rotatedOptions,
      correctAnswer: newAnswerIdx === -1 ? originalAnswer : newAnswerIdx,
      question: `[Nível ${stage}] ${q.question}`,
      source: `${q.source} (${stage}ª Etapa)`
    };
  });
}

app.use(express.json());

// Initialize Gemini client lazily or safely
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("Aviso: GEMINI_API_KEY não foi encontrada nas variáveis de ambiente!");
    }
    ai = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return ai;
}

function robustJsonParse(text: string): any {
  try {
    return JSON.parse(text);
  } catch (error) {
    console.warn("JSON.parse falhou no backend, tentando reparar barras invertidas de LaTeX...", error);
    const repaired = text.replace(/\\(?![fnru"\\/])/g, '\\\\');
    try {
      return JSON.parse(repaired);
    } catch (secondError) {
      console.error("Tentativa de reparo falhou:", secondError);
      throw error;
    }
  }
}

function getFriendlyErrorMessage(error: any): string {
  if (!error) return "Erro desconhecido. Por favor, tente novamente.";
  
  const rawStatus = error?.status;
  const status = typeof rawStatus === 'number' ? rawStatus : parseInt(rawStatus) || 0;
  const message = String(error?.message || error || "").toLowerCase();

  if (status === 503 || message.includes("503") || message.includes("demand") || message.includes("unavailable") || message.includes("overloaded")) {
    return "O serviço do Gemini está sob altíssima demanda temporária. Por favor, aguarde alguns segundos e tente novamente.";
  }
  if (status === 429 || message.includes("429") || message.includes("limit") || message.includes("rate") || message.includes("quota") || message.includes("resource_exhausted")) {
    return "Limite de requisições excedido temporariamente. Por favor, aguarde cerca de um minuto e tente novamente.";
  }
  if (status === 401 || status === 403 || message.includes("key") || message.includes("api key") || message.includes("permission") || message.includes("auth")) {
    return "Problema de autenticação com a chave de API (Erro 401/403). Verifique se a sua chave nas Configurações > Secrets está correta.";
  }
  
  // Try to parse error.message if it is a JSON string
  try {
    const parsed = JSON.parse(error.message);
    if (parsed?.error?.message) {
      const msg = parsed.error.message.toLowerCase();
      if (msg.includes("demand") || msg.includes("unavailable") || msg.includes("overloaded")) {
        return "O serviço do Gemini está sob altíssima demanda temporária. Por favor, aguarde alguns segundos e tente novamente.";
      }
      return parsed.error.message;
    }
  } catch (e) {
    // Not a JSON string
  }
  
  return error?.message || "Ocorreu um erro ao comunicar com os servidores de IA. Por favor, tente novamente.";
}

// Helper to generate content with exponential backoff on transient errors
async function generateContentWithRetry(client: GoogleGenAI, options: any, maxRetries = 6): Promise<any> {
  let attempt = 0;
  const originalModel = options.model;
  while (true) {
    try {
      return await client.models.generateContent(options);
    } catch (error: any) {
      attempt++;
      const rawStatus = error?.status;
      const status = typeof rawStatus === 'number' ? rawStatus : parseInt(rawStatus) || 0;
      const message = String(error?.message || error || "");
      
      const isDailyLimit = message.toLowerCase().includes("daily") || 
                           message.toLowerCase().includes("perday") || 
                           message.toLowerCase().includes("free_tier_requests") || 
                           message.toLowerCase().includes("exceeded your current quota") ||
                           message.toLowerCase().includes("rate-limit") || 
                           message.toLowerCase().includes("quota exceeded");

      const isTransient = (status === 503 || status === 429 || status === 500 || 
                          message.includes("demand") || message.includes("limit") || 
                          message.includes("rate") || message.includes("overloaded") || 
                          message.includes("quota") || message.includes("temporarily") || 
                          message.includes("unavailable") || message.includes("RESOURCE_EXHAUSTED")) && !isDailyLimit;

      if (isTransient && attempt <= maxRetries) {
        let delay = Math.pow(2.5, attempt) * 1000 + Math.random() * 2000;
        
        // Specialize delay for 429 / RESOURCE_EXHAUSTED
        if (status === 429 || message.includes("429") || message.indexOf("RESOURCE_EXHAUSTED") !== -1 || message.includes("quota")) {
          // Default to a higher initial delay for rate limits (e.g., 15-30s) instead of just 2.5s
          delay = Math.max(delay, (attempt === 1 ? 15000 : 30000) + Math.random() * 5000);
          
          // Attempt to parse the exact retryDelay if provided in the error message
          try {
            const errJson = JSON.parse(message);
            const details = errJson?.error?.details || errJson?.details;
            if (Array.isArray(details)) {
              const retryInfo = details.find((d: any) => d['@type']?.includes('RetryInfo') || d.retryDelay !== undefined);
              if (retryInfo && retryInfo.retryDelay) {
                const seconds = parseFloat(retryInfo.retryDelay); // e.g. "40s" -> 40
                if (!isNaN(seconds)) {
                  // Add an extra 2 seconds safety buffer
                  delay = (seconds + 2) * 1000;
                  console.log(`[Gemini API] Detectado retryDelay da API Google: aguardando ${seconds}s.`);
                }
              }
            }
          } catch (_) {
            // If message contains a substring like "Please retry in 40.918090025s" or "Please retry in 38s"
            const retryInMatch = message.match(/Please retry in ([\d\.]+)s/i);
            if (retryInMatch && retryInMatch[1]) {
              const seconds = parseFloat(retryInMatch[1]);
              if (!isNaN(seconds)) {
                delay = (seconds + 2) * 1000;
                console.log(`[Gemini API] Detectado tempo de espera no texto da mensagem: aguardando ${seconds}s.`);
              }
            }
          }
        }

        // Drop original model parameter and fall back to highly-available gemini-flash-latest on transient failures
        if (options.model === "gemini-3.5-flash" && attempt >= 1) {
          console.log(`[Gemini API] Ativando modelo auxiliar 'gemini-flash-latest' devido a picos de demanda no 'gemini-3.5-flash'...`);
          options.model = "gemini-flash-latest";
        }

        console.log(`[Gemini API] Aguardando reestabelecimento (Status ${status || 'n/a'}, Tentativa ${attempt}/${maxRetries}). Retomando em ${Math.round(delay)}ms...`);
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}

// API Routes
app.get("/api/stored-subjects", async (req, res) => {
  try {
    const list = await getStoredSubjectsList();
    return res.json({ subjects: list });
  } catch (error: any) {
    console.error("Erro ao ler lista de assuntos:", error);
    return res.status(500).json({ error: "Erro ao obter assuntos salvos." });
  }
});

app.post("/api/study-session", async (req, res) => {
  try {
    const { subject } = req.body;
    if (!subject) {
      return res.status(400).json({ error: "O campo 'subject' é obrigatório." });
    }

    const existingSession = await getStoredSession(subject);
    if (existingSession) {
      console.log(`[Database] Carregando sessão existente do banco de dados para: "${subject}"`);
      return res.json(existingSession);
    }

    const client = getGeminiClient();
    const prompt = `Você é um curador de elite de questões para o ENEM e Grandes Vestibulares (FUVEST, UNICAMP, etc.).
Sua tarefa é gerar uma sessão de estudos sobre o tema: "${subject}".

MISSÃO: Gere obrigatoriamente 10 questões de quiz e 6 flashcards conceituais.

DIRETRIZ DE ORIGEM E FIDELIDADE (CRÍTICO):
1. O campo "source" deve OBRIGATORIAMENTE utilizar o prefixo "Tipo" para simulações (ex: "Tipo ENEM", "Tipo FUVEST").
2. NUNCA atribua anos específicos ou exames sem o prefixo "Tipo" a menos que tenha 100% de certeza de que a questão é uma reprodução literal.
3. PROIBIDO inventar anos para questões criadas pelo modelo.

REGRA DE VELOCIDADE E CONCISÃO:
- Seja EXTREMAMENTE conciso e direto. Explicações ("explanation") e dicas ("hint") devem ter preferencialmente no máximo 2 ou 3 linhas curtas de texto direto.

DIRETRIZ DE EXPRESSÕES MATEMÁTICAS E QUÍMICAS (REGRAS DE MATEMÁTICA PADRÃO E UNICODE - SEM LATEX):
- Use APENAS notação matemática padrão em formato de texto linear/Unicode compatível com a escrita escolar usual (ex: $x²$, $v₀$, $(a)/(b)$ ou $a/b$, $√x$ ou $√(x)$, $S = ℝ$).
- NUNCA utilize comandos LaTeX (como \frac, \sqrt, \mathbb, \mathcal, \Delta, \approx, etc.) ou quaisquer barras invertidas (\) ou chaves LaTeX (como {b}).
- Símbolos matemáticos devem ser representados por seus caracteres Unicode equivalentes diretamente nas equações:
  - Multiplicação: · ou × (ex: $2 · x$ ou $2 × 10⁵$)
  - Divisão / Frações: barra de divisão / (ex: $a/b$ ou $(m · v²)/2$)
  - Raiz Quadrada: símbolo √ ou √(expressão) (ex: $√2$ ou $√(2 · g · h)$)
  - Símbolos gerais: Δ, θ, α, β, ω, π, ≈, ±, ≠, ≤, ≥, ∈, ∉, →, ℝ, ℕ, ℤ, ℚ, ℂ
- FÓRMULAS QUÍMICAS: Devem utilizar índices subscritos reais em Unicode (ex: H₂O, CO₂, H₂SO₄, C₆H₁₂O₆).
- MOEDAS / VALORES FINANCEIROS: Nunca formate valores monetários (como R$ 5,00) como se fossem fórmulas matemáticas. Escreva-os de forma textual simples fora de delimitadores de matemática (ex: escreva R$ 5,00 diretamente no texto, nunca $R$ , 5,00$ ou $R\\5,00$). No máximo, use "R$ 5,00".
- Use sobrescritos e subscritos Unicode diretos (como ², ³, ⁴, ₀, ₁, ₂, etc.) para toda e qualquer variável/expoente.

DIRETRIZ DE SUPORTE VISUAL (MINIMALISMO TÉCNICO):
- SÓ forneça imagem se ela for um ESBOÇO TÉCNICO ou DIAGRAMA que facilite diretamente a resolução.
- NÃO invente figuras decorativas. Se o texto for suficiente, deixe os campos vazios ("").
- Na dúvida, OMITA o visual. O foco é a clareza do texto.
- REGRAS DE GEOGRAFIA E MAPAS (SVG):
  Quando gerar mapas ou diagramas geopolíticos/físicos de Geografia:
  1. Baseie-se estritamente no mapa do mundo oficial contendo paralelos/meridianos suaves de fundo em projeção curvilínea (tipo Robinson/Mollweide).
  2. Cores padronizadas por continente: América (Laranja/Coral: #e06c28 ou #eb6e34), África (Verde Claro/Limão: #9dbb4d ou #a5cf4c), Europa (Laranja Claro/Dourado pastel: #f69f54 ou #f2a64c), Ásia (Amarelo/Ouro: #e7bf53 ou #f7cc53), Oceania (Verde Escuro/Médio: #76a035 ou #638531), Antártida (Verde Fluido Bem Escuro na base: #2e4d3a).
  3. Adicione rótulos textuais de alta legibilidade centralizados de forma elegante nos continentes correspondentes escritos em português ("América", "Europa", "África", "Ásia", "Oceania", "Antártida").
- REGRAS RÍGIDAS DE SIMBOLOGIA PARA CIRCUITOS ELÉTRICOS (SVG):
  Se gerar um circuito elétrico via SVG, utilize rigorosamente os símbolos oficiais apresentados nas diretrizes técnicas:
  1. RESISTOR (RESISTÊNCIA): Fio condutor contínuo com padrão em zigue-zague (\\/\\/\\/\\), nunca use caixas fechadas ou retângulos lisos.
  2. BATERIA / GERADOR: Dois traços paralelos perpendiculares ao condutor: o positivo (+) é longo e fino; o negativo (-) é curto e nitidamente mais grosso/espesso. Adicione os caracteres "+" e "-" próximos de forma bem visível.
  3. CHAVE (INTERRUPTOR): Dois círculos/pontos pretos cheios com uma linha reta metálica inclinada para cima (indicando interruptor aberto) ou deitada (indicando interruptor fechado).
  4. FUSÍVEL: Linha condutora contendo dois pontos pretos cheios nas extremidades, conectados internamente por um fio em formato de onda senoidal suave (um "S" horizontal), rotulado com a letra capital "F" elegante centralizada logo acima da onda.
  5. AMPERÍMETRO: Um círculo perfeito com a letra capital "A" centralizada, atravessado opcionalmente por uma seta diagonal fina cruzando de baixo-esquerda para cima-direita.
  6. VOLTÍMETRO: Um círculo perfeito com a letra capital "V" centralizada, atravessado opcionalmente por uma seta diagonal fina cruzando de baixo-esquerda para cima-direita.
  7. CAPACITOR: Duas placas planas retas de comprimentos precisamente idênticos e paralelas entre si.
  8. INDUTOR: Uma sequência contínua de loops curvos e espirais em formato de bobina/solenóide tridimensional.
  9. TRANSFORMADOR: Dois enrolamentos solenóides/bobinas colocados face a face, divididos verticalmente ao centro por duas linhas verticais retas paralelas (núcleo).
  10. RECEPTOR: Composto por uma resistência interna "r'" em série com uma polaridade contrária gerada por barras (f.c.e.m. "ε'"), apresentando a barra menor/espessa oposta ao fluxo tradicional de um gerador comum.`;

    const response = await generateContentWithRetry(client, {
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            subject: { type: Type.STRING },
            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  front: { type: Type.STRING },
                  back: { type: Type.STRING },
                  imageSearchTerm: { type: Type.STRING, description: "Termo analítico para busca de imagem, APENAS se essencial (deixe vazio caso contrário)" }
                },
                required: ["id", "front", "back", "imageSearchTerm"]
              }
            },
            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING } 
                  },
                  correctAnswer: { type: Type.INTEGER },
                  explanation: { type: Type.STRING },
                  hint: { type: Type.STRING },
                  imageSearchTerm: { type: Type.STRING, description: "Termo de busca para imagem, APENAS se essencial para resolver (vazio caso contrário)" },
                  svgDiagram: { type: Type.STRING, description: "Código SVG técnico, APENAS se essencial para resolver (vazio caso contrário)" },
                  source: { type: Type.STRING, description: "Exame oficial de origem (ex: ENEM 2023)" }
                },
                required: ["id", "question", "options", "correctAnswer", "explanation", "hint", "imageSearchTerm", "source"]
              }
            }
          },
          required: ["subject", "flashcards", "quiz"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      return res.status(500).json({ error: "Falha ao gerar conteúdo do Gemini" });
    }

    const rawData = robustJsonParse(text);
    await saveSession(subject, rawData);
    return res.json(rawData);

  } catch (error: any) {
    console.log(`[Gemini API] Acionando base offline de estudos para a matéria "${req.body?.subject}"...`);
    try {
      const fallbackData = getFallbackSession(req.body?.subject);
      await saveSession(req.body?.subject, fallbackData);
      return res.json(fallbackData);
    } catch (fallbackError) {
      console.error("Falha crítica ao carregar dados locais do fallback:", fallbackError);
      return res.status(500).json({ error: "Erro crítico ao carregar dados locais do app." });
    }
  }
});

app.post("/api/next-stage", async (req, res) => {
  try {
    const { subject, stage } = req.body;
    if (!subject || stage === undefined) {
      return res.status(400).json({ error: "Os campos 'subject' e 'stage' são obrigatórios." });
    }

    const existingNextStage = await getStoredNextStage(subject, stage);
    if (existingNextStage) {
      console.log(`[Database] Carregando questões salvas no banco de dados para "${subject}" nível ${stage}`);
      return res.json(existingNextStage);
    }

    const client = getGeminiClient();
    const prompt = `Gere mais 10 questões reais de exames oficiais sobre o tema "${subject}" para a etapa ${stage}.
Recupere questões desafiadoras e reais de exames oficiais.

DIRETRIZ DE ORIGEM E FIDELIDADE:
- O campo "source" deve OBRIGATORIAMENTE utilizar o prefixo "Tipo" (ex: "Tipo ENEM").

DIRETRIZ DE EXPRESSÕES MATEMÁTICAS E QUÍMICAS (UNICODE E REGRAS DE EQUAÇÃO DO WORD):
- Use formato Unicode compatível com a ferramenta Equation do Word, envelopada entre cifrões simples (ex: $x²$, $V₀$, $(a)/(b)$).
- Use símbolos e caracteres Unicode nativos para expoentes/índices (ex: x², y₁, t²).
- FÓRMULAS QUÍMICAS OBRIGATÓRIAS COM SUBSCRITOS: Todas as fórmulas químicas devem possuir índices subscritos reais em Unicode (ex: H₂O, CO₂, H₂SO₄, C₆H₁₂O₆).
- REAÇÕES QUÍMICAS COM SETA REAL: Todas as reações químicas devem ser apresentadas utilizando a seta química de reação real (→) (ex: $2 H₂ + O₂ → 2 H₂O$), exatamente como em livros didáticos e grandes vestibulares.
- PROIBIÇÃO DE CÓDIGOS DE PROGRAMAÇÃO: É expressamente proibido utilizar códigos como \implies, \rightarrow, ou caracteres/símbolos de programação dentro das equações químicas. Utilize apenas a notação química convencional limpa com caracteres Unicode nativos e a seta (→).
- NÃO utilize qualquer barra invertida ou comando LaTeX (como \\frac, \\times, etc.). Use operadores e símbolos Unicode (ex: ×, ·, ÷, ±, ≠, ≤, ≥, ≈, √, Δ, π, θ, λ, sen, cos, tan, log, ln).

DIRETRIZ DE SUPORTE VISUAL:
- Só forneça visuais se forem esboços técnicos úteis. Se não, deixe os campos vazios.
- REGRAS DE GEOGRAFIA E MAPAS (SVG):
  Quando gerar mapas ou diagramas geopolíticos/físicos de Geografia:
  1. Baseie-se estritamente no mapa do mundo oficial contendo paralelos/meridianos suaves de fundo em projeção curvilínea (tipo Robinson/Mollweide).
  2. Cores padronizadas por continente: América (Laranja/Coral: #e06c28 ou #eb6e34), África (Verde Claro/Limão: #9dbb4d ou #a5cf4c), Europa (Laranja Claro/Dourado pastel: #f69f54 ou #f2a64c), Ásia (Amarelo/Ouro: #e7bf53 ou #f7cc53), Oceania (Verde Escuro/Médio: #76a035 ou #638531), Antártida (Verde Fluido Bem Escuro na base: #2e4d3a).
  3. Adicione rótulos textuais de alta legibilidade centralizados nos continentes correspondentes escritos em português ("América", "Europa", "África", "Ásia", "Oceania", "Antártida").
- REGRAS RÍGIDAS DE SIMBOLOGIA PARA CIRCUITOS ELÉTRICOS (SVG):
  Se gerar um circuito elétrico via SVG, utilize rigorosamente os seguintes símbolos oficiais:
  1. RESISTOR (RESISTÊNCIA): Fio condutor contínuo com padrão em zigue-zague (\\/\\/\\/\\), nunca use retângulos lisos.
  2. BATERIA / GERADOR: Pólo positivo (+) longo e fino; pólo negativo (-) curto e nitidamente mais espesso. Adicione os sinais "+" e "-" visíveis.
  3. CHAVE (INTERRUPTOR): Dois pontos pretos com uma linha inclinada (aberta) ou deitada (fechada) conectando-os.
  4. FUSÍVEL: Dois pontos pretos nas pontas conectados por uma onda senoidal ("S" deitado), com a letra "F" centralizada acima.
  5. AMPERÍMETRO: Círculo com a letra "A" centralizada, com uma seta diagonal fina atravessando de baixo-esquerda para cima-direita.
  6. VOLTÍMETRO: Círculo com a letra "V" centralizada, com uma seta diagonal fina atravessando de baixo-esquerda para cima-direita.
  7. CAPACITOR: Duas placas retas, planas, paralelas de comprimentos perfeitamente iguais.
  8. INDUTOR: Sequência contínua de loops em formato de bobina helicoidal.
  9. TRANSFORMADOR: Duas bobinas espiraladas face a face com duas linhas retas verticais paralelas no meio.
  10. RECEPTOR: Representação contendo resistência interna "r'" e f.c.e.m. "ε'" com polaridade oposta ao gerador.

Responda em um array JSON.`;

    const response = await generateContentWithRetry(client, {
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              question: { type: Type.STRING },
              options: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING } 
              },
              correctAnswer: { type: Type.INTEGER },
              explanation: { type: Type.STRING },
              hint: { type: Type.STRING },
              imageSearchTerm: { type: Type.STRING },
              svgDiagram: { type: Type.STRING },
              source: { type: Type.STRING }
            },
            required: ["id", "question", "options", "correctAnswer", "explanation", "hint", "imageSearchTerm", "source"]
          }
        }
      }
    });

    const text = response.text;
    if (!text) {
      return res.status(500).json({ error: "Falha ao gerar conteúdo do Gemini" });
    }

    const rawData = robustJsonParse(text);
    await saveNextStageQuestions(subject, stage, rawData);
    return res.json(rawData);

  } catch (error: any) {
    console.log(`[Gemini API] Acionando base offline de estudos para a matéria "${req.body?.subject}" etapa ${req.body?.stage}...`);
    try {
      const { subject, stage } = req.body;
      const fallbackQuestions = getFallbackNextStage(subject, stage);
      await saveNextStageQuestions(subject, stage, fallbackQuestions);
      return res.json(fallbackQuestions);
    } catch (fallbackError) {
      console.error("Falha crítica ao carregar próximo nível do fallback:", fallbackError);
      return res.status(500).json({ error: "Erro crítico ao carregar dados locais do nível." });
    }
  }
});

// Setup Vite Dev Server / Static files handler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on port ${PORT}`);
  });
}

startServer();
