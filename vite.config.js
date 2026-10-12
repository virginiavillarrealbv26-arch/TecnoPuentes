import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { '@': path.resolve(__dirname, 'src') } },
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  ssr: {
    external: ['@rollup/rollup-win32-x64-msvc'],
  },
  optimizeDeps: {
    exclude: ['@rollup/rollup-win32-x64-msvc'],
  },
});
