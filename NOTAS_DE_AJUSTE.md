# Notas de ajuste para GitHub Pages

## Resumo técnico

A aplicação foi convertida do padrão Google AI Studio/Node backend para um app estático Vite + React. Agora ela pode ser publicada no GitHub Pages sem servidor, sem `GEMINI_API_KEY` e sem chamadas para `/api/*`.

## Arquivos principais alterados

- `src/services/geminiService.ts`: substitui chamadas à IA/backend por fallbacks locais.
- `vite.config.ts`: adiciona `base: './'` para funcionar no subcaminho do GitHub Pages.
- `package.json`: remove scripts e dependências de backend; mantém apenas frontend/Vite.
- `README.md`: atualiza instruções de build e deploy.
- `.github/workflows/deploy.yml`: adiciona workflow para publicar automaticamente no GitHub Pages.
- `src/components/HomeHeader.tsx`, `src/App.tsx`, `src/components/QuizComponent.tsx`, `src/components/AILoadingScreen.tsx`: ajusta textos para indicar modo estático/local em vez de IA ativa.
- `src/components/FlashcardComponent.tsx` e `src/components/QuizComponent.tsx`: aceitam diagramas locais em `data:image/svg+xml`.

## Arquivos removidos

- `server.ts`: não é compatível com GitHub Pages.
- `sessions_db.json`: dependia de backend/local file system.
- `src/services/dbService.ts`: dependia de `fs`/Node, incompatível com frontend estático.

## Estado da IA

A IA foi intencionalmente desativada nesta versão. O ponto de reintegração futura é `src/services/geminiService.ts`, preservando os fallbacks locais como rede de segurança.
