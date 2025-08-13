import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'url'
const path = require('path'); // 使用 require 导入 path 模块

export default defineConfig({
  plugins: [vue()],
  base: '/', // 改为绝对路径
  define: {
    // 显式定义Vue特性标志以消除警告
    __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
  },
  build: {
    outDir: path.resolve(__dirname, '../front_web'), // 设置输出目录
     
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
        secure: false
      }
    },
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', 'element-plus']
  }
})