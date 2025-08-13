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
        <h1 class="text-2xl font-bold">微信JS-SDK测试</h1>
        <div class="w-20"></div>
      </div>
      
             <!-- 环境检查 -->
       <div class="bg-white rounded-lg shadow p-4 mb-4">
         <h2 class="text-lg font-semibold mb-3">环境检查</h2>
         <div class="space-y-2">
           <div class="flex justify-between">
             <span>是否在微信浏览器:</span>
             <span :class="environment.isWeixin ? 'text-green-600' : 'text-red-600'">
               {{ environment.isWeixin ? '是' : '否' }}
             </span>
           </div>
           <div class="flex justify-between">
             <span>wx对象:</span>
             <span :class="environment.hasWx ? 'text-green-600' : 'text-red-600'">
               {{ environment.hasWx ? '已加载' : '未加载' }}
             </span>
           </div>
           <div class="flex justify-between">
             <span>WeixinJSBridge:</span>
             <span :class="environment.hasWeixinJSBridge ? 'text-green-600' : 'text-red-600'">
               {{ environment.hasWeixinJSBridge ? '可用' : '不可用' }}
             </span>
           </div>
           <div class="flex justify-between">
             <span>requestMerchantTransfer:</span>
             <span :class="environment.hasRequestMerchantTransfer ? 'text-green-600' : 'text-red-600'">
               {{ environment.hasRequestMerchantTransfer ? '可用' : '不可用' }}
             </span>
           </div>
         </div>
         <button @click="checkEnvironment" class="mt-3 w-full bg-blue-500 text-white py-2 rounded">
           重新检查环境
         </button>
       </div>

       <!-- 转账功能支持检查 -->
       <div class="bg-white rounded-lg shadow p-4 mb-4">
         <h2 class="text-lg font-semibold mb-3">转账功能支持</h2>
         <div class="space-y-2">
           <div class="flex justify-between">
             <span>转账功能:</span>
             <span :class="transferSupport.supported ? 'text-green-600' : 'text-red-600'">
               {{ transferSupport.supported ? '支持' : '不支持' }}
             </span>
           </div>
           <div v-if="transferSupport.issues.length > 0" class="mt-2">
             <span class="font-medium text-red-600">问题:</span>
             <ul class="list-disc list-inside text-sm text-red-600 mt-1">
               <li v-for="issue in transferSupport.issues" :key="issue">{{ issue }}</li>
             </ul>
           </div>
         </div>
         <button @click="checkTransferSupport" class="mt-3 w-full bg-green-500 text-white py-2 rounded">
           检查转账支持
         </button>
       </div>

      <!-- URL信息 -->
      <div class="bg-white rounded-lg shadow p-4 mb-4">
        <h2 class="text-lg font-semibold mb-3">URL信息</h2>
        <div class="space-y-2 text-sm">
          <div>
            <span class="font-medium">当前URL:</span>
            <div class="text-gray-600 break-all">{{ environment.currentUrl }}</div>
          </div>
          <div>
            <span class="font-medium">去掉Hash的URL:</span>
            <div class="text-gray-600 break-all">{{ environment.urlWithoutHash }}</div>
          </div>
        </div>
      </div>

      <!-- 测试按钮 -->
      <div class="bg-white rounded-lg shadow p-4 mb-4">
        <h2 class="text-lg font-semibold mb-3">功能测试</h2>
        <div class="space-y-3">
          <button @click="testLoadSDK" :disabled="loading" class="w-full bg-green-500 text-white py-2 rounded disabled:opacity-50">
            {{ loading ? '加载中...' : '测试加载SDK' }}
          </button>
          <button @click="testConfig" :disabled="!environment.hasWx" class="w-full bg-orange-500 text-white py-2 rounded disabled:opacity-50">
            测试配置（需要先加载SDK）
          </button>
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
import { WeixinDebugger } from '@/utils/weixinDebug.js'
import { weixinSDK } from '@/utils/weixin.js'

const environment = ref({
  isWeixin: false,
  hasWx: false,
  hasWeixinJSBridge: false,
  hasRequestMerchantTransfer: false,
  currentUrl: '',
  urlWithoutHash: ''
})

const transferSupport = ref({
  supported: false,
  issues: []
})

const loading = ref(false)
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

// 检查环境
const checkEnvironment = () => {
  const env = WeixinDebugger.checkEnvironment()
  environment.value = env
  addLog('环境检查完成', 'info')
}

// 检查转账支持
const checkTransferSupport = () => {
  const support = WeixinDebugger.checkTransferSupport()
  transferSupport.value = support
  addLog('转账支持检查完成', 'info')
  if (support.issues.length > 0) {
    addLog(`发现问题: ${support.issues.join(', ')}`, 'warning')
  }
}

// 测试加载SDK
const testLoadSDK = async () => {
  loading.value = true
  addLog('开始加载微信JS-SDK...', 'info')
  
  try {
    await weixinSDK.loadSDK()
    addLog('微信JS-SDK加载成功', 'success')
    checkEnvironment() // 重新检查环境
  } catch (error) {
    addLog(`加载失败: ${error.message}`, 'error')
  } finally {
    loading.value = false
  }
}

// 测试配置
const testConfig = async () => {
  addLog('开始测试配置...', 'info')
  
  try {
    // 模拟配置参数
    const testConfig = {
      appId: 'test_app_id',
      timestamp: Math.floor(Date.now() / 1000),
      nonceStr: 'test_nonce_str',
      signature: 'test_signature',
      jsApiList: ['checkJsApi']
    }
    
    addLog('使用测试配置参数', 'warning')
    await weixinSDK.config(testConfig)
    addLog('配置测试完成（预期会失败，因为使用测试参数）', 'warning')
  } catch (error) {
    addLog(`配置失败: ${error.message}`, 'error')
  }
}

// 清空日志
const clearLogs = () => {
  logs.value = []
}

onMounted(() => {
  checkEnvironment()
  checkTransferSupport()
  addLog('页面加载完成', 'success')
})
</script>
