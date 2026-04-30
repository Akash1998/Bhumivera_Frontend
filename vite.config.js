import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    port: 3000,
  },
  build: {
    chunkSizeWarningLimit: 1000, 
    rollupOptions: {
      output: {
        // Smart chunking algorithm to prevent Virtual DOM crashes and massive bundle loads
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'vendor-react'; // Isolates core react framework
            }
            if (id.includes('axios') || id.includes('framer-motion') || id.includes('lucide')) {
              return 'vendor-utils'; // Isolates heavy utilities
            }
            return 'vendor-core'; // Catches remaining node_modules
          }
        }
      }
    }
  }
});
