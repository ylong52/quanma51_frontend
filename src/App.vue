<template>
  <div id="app">
    <router-view />
    <!-- 全局下载状态组件 -->
    <DownloadStatus />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import DownloadStatus from '@/components/DownloadStatus.vue'
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

// 应用启动时初始化用户状态
onMounted(async () => {
  console.log('应用启动，开始验证用户登录状态...')
  try {
    await userStore.initializeUserState()
    console.log('用户登录状态验证完成')
  } catch (error) {
    console.error('初始化用户状态失败:', error)
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style> 