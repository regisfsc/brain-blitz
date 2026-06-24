# Notas de ajuste para GitHub Pages

Esta versão foi ajustada para rodar como aplicação estática no GitHub Pages.

## O que mudou

- A aplicação não depende mais de `server.ts`, Express, rotas `/api/*`, banco JSON local ou `GEMINI_API_KEY`.
- A camada de IA foi substituída temporariamente por fallbacks locais em `src/services/geminiService.ts` e `src/data/fallbackSessions.ts`.
- O build agora gera os arquivos finais diretamente na pasta `docs/`.
- A pasta `docs/` já contém `index.html`, `assets/` e `.nojekyll`, pronta para publicação pelo GitHub Pages.
- O `vite.config.ts` usa `base: './'`, para funcionar em caminhos de projeto como `https://registsv.github.io/brain-blitz/`.

## Correção para página em branco

Se o GitHub Pages publicar a raiz do repositório (`main` + `/root`), ele servirá o `index.html` de desenvolvimento do Vite. Esse arquivo aponta para `src/main.tsx`, que o navegador não executa diretamente em produção. O resultado típico é página branca.

Use uma das duas opções abaixo.

### Opção recomendada sem Actions

Em **Settings > Pages**:

1. Source: `Deploy from a branch`
2. Branch: `main`
3. Folder: `/docs`
4. Save

### Opção com GitHub Actions

Em **Settings > Pages**:

1. Source: `GitHub Actions`
2. Faça push do repositório com `.github/workflows/deploy.yml`
3. O workflow executará `npm ci`, `npm run build` e publicará `./docs`

## Comandos locais

```bash
npm ci
npm run build
```

Após o build, a versão publicada fica em `docs/`.
