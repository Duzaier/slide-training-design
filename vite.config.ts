import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: (process.env.GITHUB_ACTIONS || process.env.GITHUB_PAGES) ? '/slide-training-design/' : './',
  plugins: [react()],
  server: {
    port: 3000,
    open: false,
    host: true
  }
});
