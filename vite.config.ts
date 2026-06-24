import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  // Relative asset paths keep the build working on GitHub Pages project paths
  // such as https://registsv.github.io/brain-blitz/.
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  build: {
    // GitHub Pages can publish directly from main/docs using "Deploy from a branch".
    // This avoids serving the raw Vite source index.html, which causes a blank page.
    outDir: 'docs',
    emptyOutDir: true,
  },
});
