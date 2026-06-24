# BrainBlitz — versão estática para GitHub Pages

Esta versão foi ajustada para rodar como aplicação frontend estática, sem `server.ts`, sem rotas `/api/*`, sem banco JSON local no servidor e sem chave Gemini/OpenAI obrigatória.

A camada que antes dependia do Google AI Studio foi substituída por fallbacks locais em `src/data/fallbackSessions.ts`. Assim, a aplicação funciona no GitHub Pages imediatamente. Depois, a conexão com API e agentes de IA pode ser reintroduzida de forma controlada no arquivo `src/services/geminiService.ts` ou em um novo serviço.

## O que mudou

- `npm run dev` agora usa apenas Vite.
- `npm run build` gera apenas arquivos estáticos em `dist/`.
- `vite.config.ts` usa `base: './'`, necessário para funcionar em repositórios do GitHub Pages.
- `src/services/geminiService.ts` não chama mais `/api/study-session`, `/api/next-stage` ou `/api/stored-subjects`.
- Os assuntos novos usam o banco local de fallback mais próximo.
- Os diagramas usam SVG local em `data:image/svg+xml`, sem serviço externo de geração de imagem.

## Rodar localmente

```bash
npm install
npm run dev
```

## Gerar build estático

```bash
npm run build
```

A pasta publicada deve ser `dist/`.

## Publicar no GitHub Pages

Opção recomendada já incluída neste pacote:

1. Suba este projeto para um repositório no GitHub.
2. No repositório, vá em **Settings > Pages**.
3. Em **Build and deployment**, selecione **GitHub Actions**.
4. O workflow `.github/workflows/deploy.yml` fará o build e publicará `dist/` automaticamente a cada push na branch `main`.
5. O comando de build usado pelo workflow é:

```bash
npm ci
npm run build
```

6. A pasta de saída é:

```bash
dist
```

## Observação sobre IA

Nesta versão, a IA está propositalmente desativada. O app está preparado para funcionar com fallbacks locais. Quando a conexão com API/agentes for implementada, preserve um fallback local para manter a aplicação estável em caso de falha de rede, limite de quota ou ausência de chave.
