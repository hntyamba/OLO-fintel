import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    // Garante que os ficheiros dentro de 'frontend/public' vão para a raiz do build final
    publicDir: path.resolve(__dirname, 'public'),
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      // Força a pasta de saída a ser a 'dist' na raiz do subprojeto
      outDir: 'dist',
      // Garante que a pasta public é limpa e reinserida a cada build
      emptyOutDir: true,
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

