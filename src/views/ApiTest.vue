<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-md mx-auto">
      <div class="flex items-center justify-between mb-6">
        <router-link 
          to="/test" 
          class="text-blue-500 hover:text-blue-700 flex items-center"
        >
          <i class="fas fa-arrow-left mr-2"></i>
          返回测试导航
        </router-link>
        <h1 class="text-2xl font-bold">API调用测试</h1>
        <div class="w-20"></div>
      </div>
      
      <!-- 测试数据 -->
      <div class="bg-white rounded-lg shadow p-4 mb-4">
        <h2 class="text-lg font-semibold mb-3">测试数据</h2>
        <div class="space-y-2 text-sm">
          <div>
            <span class="font-medium">当前URL:</span>
            <div class="text-gray-600 break-all">{{ currentUrl }}</div>
          </div>
          <div>
            <span class="font-medium">去掉Hash的URL:</span>
            <div class="text-gray-600 break-all">{{ urlWithoutHash }}</div>
          </div>
          <div>
            <span class="font-medium">测试ID:</span>
            <input v-model="testId" type="text" class="w-full border rounded px-2 py-1" placeholder="输入测试ID">
          </div>
        </div>
      </div>

      <!-- 测试按钮 -->
      <div class="bg-white rounded-lg shadow p-4 mb-4">
        <h2 class="text-lg font-semibold mb-3">API测试</h2>
        <div class="space-y-3">
          <button @click="testApiCall" :disabled="loading" class="w-full bg-blue-500 text-white py-2 rounded disabled:opacity-50">
            {{ loading ? '测试中...' : '测试API调用' }}
          </button>
        </div>
      </div>

      <!-- 结果展示 -->
      <div class="bg-white rounded-lg shadow p-4 mb-4">
        <h2 class="text-lg font-semibold mb-3">测试结果</h2>
        <div class="space-y-2">
          <div v-if="apiResult">
            <span class="font-medium">API响应:</span>
            <pre class="bg-gray-100 p-2 rounded text-xs overflow-auto">{{ JSON.stringify(apiResult, null, 2) }}</pre>
          </div>
          <div v-if="apiError" class="text-red-600">
            <span class="font-medium">错误:</span>
            <div>{{ apiError }}</div>
          </div>
        </div>
      </div>

      <!-- 日志输出 -->
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-lg font-semibold mb-3">调试日志</h2>
        <div class="bg-gray-100 p-3 rounded text-sm font-mono h-40 overflow-y-auto">
          <div v-for="(log, index) in logs" :key="index" :class="getLogClass(log.type)">
            {{ log.time }} - {{ log.message }}
          </div>
        </div>
        <button @click="clearLogs" class="mt-3 w-full bg-gray-500 text-white py-2 rounded">
          清空日志
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as api from '@/api'
import { WeixinDebugger } from '@/utils/weixinDebug.js'

const currentUrl = ref('')
const urlWithoutHash = ref('')
const testId = ref('123')
const loading = ref(false)
const apiResult = ref(null)
const apiError = ref(null)
const logs = ref([])

// 添加日志
const addLog = (message, type = 'info') => {
  logs.value.push({
    time: new Date().toLocaleTimeString(),
    message,
    type
  })
}

// 获取日志样式
const getLogClass = (type) => {
  const classes = {
    info: 'text-blue-600',
    success: 'text-green-600',
    error: 'text-red-600',
    warning: 'text-orange-600'
  }
  return classes[type] || classes.info
}

// 测试API调用
const testApiCall = async () => {
  if (!testId.value) {
    addLog('请输入测试ID', 'error')
    return
  }

  loading.value = true
  apiResult.value = null
  apiError.value = null
  
  addLog('开始测试API调用...', 'info')
  
  try {
    const apiData = {
      id: testId.value,
      currentUrl: urlWithoutHash.value
    }
    
    addLog(`发送数据: ${JSON.stringify(apiData)}`, 'info')
    
    // 验证API参数
    const validationIssues = WeixinDebugger.validateApiData(apiData)
    if (validationIssues.length > 0) {
      addLog(`参数验证失败: ${validationIssues.join(', ')}`, 'warning')
    } else {
      addLog('参数验证通过', 'success')
    }
    
    const result = await api.userWithdrawalWechatConfirm(apiData)
    apiResult.value = result
    addLog('API调用成功', 'success')
    
  } catch (error) {
    apiError.value = error.message
    addLog(`API调用失败: ${error.message}`, 'error')
    console.error('API调用错误:', error)
  } finally {
    loading.value = false
  }
}

// 清空日志
const clearLogs = () => {
  logs.value = []
}

onMounted(() => {
  currentUrl.value = window.location.href
  urlWithoutHash.value = window.location.href.split('#')[0]
  addLog('页面加载完成', 'success')
  addLog(`当前URL: ${currentUrl.value}`, 'info')
  addLog(`去掉Hash的URL: ${urlWithoutHash.value}`, 'info')
})
</script>
