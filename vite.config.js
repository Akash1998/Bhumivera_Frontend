import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { cwd } from 'node:process';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, cwd(), '');
  const hasAndroidFirebaseConfig = existsSync(
    resolve(cwd(), 'android', 'app', 'google-services.json')
  );
  const nativePushEnabled = env.VITE_FCM_ENABLED !== 'false' && hasAndroidFirebaseConfig;
  const isTest = mode === 'test';

  return {
    define: {
      'import.meta.env.VITE_FCM_ENABLED': JSON.stringify(nativePushEnabled ? 'true' : 'false'),
    },
    plugins: [
      react(),
      tailwindcss(),
    ],
    esbuild: {
      drop: isTest ? [] : ['console', 'debugger'],
      legalComments: 'none',
    },
    server: {
      port: 3000,
    },
    build: {
      sourcemap: false,
      minify: 'esbuild',
      chunkSizeWarningLimit: 3000,
      rollupOptions: {
        output: {
          manualChunks: undefined,
          entryFileNames: 'assets/app-[hash].js',
          chunkFileNames: 'assets/chunk-[hash].js',
          assetFileNames: 'assets/media-[hash].[ext]',
        },
      },
    },
  };
});
