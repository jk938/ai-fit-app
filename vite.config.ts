import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Manually declare process to avoid needing @types/node
declare const process: any;

export default defineConfig(({ mode }) => {
  // Use '.' instead of process.cwd() for better compatibility in some environments
  const env = loadEnv(mode, '.', '');
  
  // Robustly get the API key from various possible sources
  const apiKey = env.VITE_API_KEY || env.API_KEY || process.env?.API_KEY || '';

  return {
    plugins: [react()],
    define: {
      // Ensure we never pass undefined to JSON.stringify, forcing a fallback to empty string
      'process.env.API_KEY': JSON.stringify(apiKey),
      // Polyfill process.env to prevent crashes if libs access it
      'process.env': {},
    },
    build: {
      outDir: 'dist',
    }
  };
});