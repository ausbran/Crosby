import { defineConfig } from 'vite';

export default defineConfig({
  root: './src',
  build: {
    outDir: '../web/assets/js',
    emptyOutDir: true,
  },
  server: {
    open: true,
  },
});