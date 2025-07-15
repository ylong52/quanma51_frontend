import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'

export default defineConfig({
  plugins: [vue()],
  define: {
    // 显式定义Vue特性标志以消除警告
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    hmr: {
      overlay: true,
      port: 24678
    },
    watch: {
      usePolling: true,
      interval: 1000,
      followSymlinks: false,
      ignored: ['**/node_modules/**', '**/dist/**']
    },
    host: '0.0.0.0',
    port: 3000,
    strictPort: false,
    open: false,
    proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api/, '')
    }
  },
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'element-plus']
  }
})