import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // allows access from network if needed
    port: 5173, // or any port you want
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // your backend URL
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''), // optional
      },
    },
  },
});