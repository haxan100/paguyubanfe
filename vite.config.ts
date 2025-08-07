import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    server: {
      port: parseInt(env.FE_PORT) || 5174,
      proxy: {
        '/api': {
          target: `http://localhost:${env.BE_PORT || 5170}`,
          changeOrigin: true
        }
      }
    }
  };
});
