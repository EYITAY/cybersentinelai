import path from 'path';
import { defineConfig } from 'vite';
import os from 'os';

function getLocalIpAddress() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name] || []) {
      // Skip internal and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

export default defineConfig(() => {
  const localIp = getLocalIpAddress();
  
  return {
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      server: {
        host: '0.0.0.0',
        port: 5173,
        middlewareMode: false,
        proxy: {
          '/api': {
            target: 'http://localhost:3001',
            changeOrigin: true,
          },
        },
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              react: ['react', 'react-dom'],
              supabase: ['@supabase/supabase-js'],
            },
          },
        },
      },
    };
});
