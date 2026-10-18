import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    port: 3000,
  },
  build: {
    chunkSizeWarningLimit: 3000, 
    rollupOptions: {
      output: {
        manualChunks: undefined 
      }
    }
  }
});
