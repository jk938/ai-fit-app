import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Manually declare process to avoid needing @types/node
declare const process: any;

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY || process.env.API_KEY),
    },
    build: {
      outDir: 'dist',
    }
  };
});