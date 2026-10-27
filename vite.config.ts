import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['assets/icon.png', 'assets/fonts/lihua-serif.woff2'],
      manifest: {
        name: '梨花季·译绣 — 绢白馆藏',
        short_name: '梨花季',
        description: '以绢白馆藏之心，发现传统纹样、苏绣针法与当代文创。',
        theme_color: '#F8F6EF',
        background_color: '#F8F6EF',
        display: 'standalone',
        start_url: './',
        icons: [
          {
            src: 'assets/icon.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'assets/icon.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /.*\/content\/.*\.json/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'content-json-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
              },
            },
          },
          {
            urlPattern: /.*\/assets\/.*\.(webp|png|jpg|svg|woff2)/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'assets-media-cache',
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
            },
          },
        ],
      },
    }),
  ],
  base: './',
  server: {
    host: true,
    port: 5180,
    strictPort: true,
  },
  optimizeDeps: {
    exclude: ['assets/vendor/**'],
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets-app',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three') || id.includes('assets/vendor/three')) {
            return 'vendor-three';
          }
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
        },
      },
    },
  },
});
