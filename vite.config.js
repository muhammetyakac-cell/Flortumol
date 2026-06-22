import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Let Vite handle chunking automatically to prevent initialization errors
      },
    },
    chunkSizeWarningLimit: 300,
    cssCodeSplit: true,
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2020',
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
    includeSource: ['src/**/*.tsx', 'src/**/*.ts'],
  },
});