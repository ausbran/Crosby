import { defineConfig } from 'vite';

export default defineConfig({
  root: './src', // Points Vite to your source folder
  build: {
    outDir: '../web/assets/js', // Outputs compiled JS to your public directory
    emptyOutDir: true,
    rollupOptions: {
      input: './src/js/main.js', // Specify the entry point for your JavaScript
    },
  },
  server: {
    open: true, // Automatically opens the browser on localhost
    port: 3000, // Development server runs on port 3000
  },
});