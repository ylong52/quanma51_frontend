<template>
  <div class="qrcode-example">
    <h2>二维码使用示例</h2>
    
    <!-- 简单使用 -->
    <div class="example-section">
      <h3>1. 简单使用</h3>
      <QRCode :value="simpleText" />
      <input v-model="simpleText" placeholder="输入文本" class="text-input" />
    </div>

    <!-- 使用工具函数 -->
    <div class="example-section">
      <h3>2. 使用工具函数</h3>
      <div class="tool-buttons">
        <button @click="generateWithTool" class="btn">生成二维码</button>
        <button @click="downloadWithTool" class="btn" :disabled="isDownloading">
          {{ isDownloading ? '下载中...' : '下载二维码' }}
        </button>
        <button @click="generateSVG" class="btn">生成SVG</button>
      </div>
      
      <!-- 下载状态提示 -->
      <div v-if="downloadStatus" class="download-status" :class="downloadStatus.type">
        {{ downloadStatus.message }}
      </div>
      
      <div v-if="toolResult" class="result">
        <img v-if="toolResult.type === 'image'" :src="toolResult.data" alt="二维码" />
        <div v-else-if="toolResult.type === 'svg'" v-html="toolResult.data"></div>
      </div>
    </div>

    <!-- 自定义样式 -->
    <div class="example-section">
      <h3>3. 自定义样式</h3>
      <QRCode 
        :value="customText" 
        :size="250"
        :foreground="customColor"
        :background="customBgColor"
        :margin="3"
        :error-correction-level="'H'"
      />
      <div class="controls">
        <input v-model="customText" placeholder="输入文本" class="text-input" />
        <div class="color-controls">
          <label>前景色: <input v-model="customColor" type="color" /></label>
          <label>背景色: <input v-model="customBgColor" type="color" /></label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import QRCode from '@/components/QRCode.vue'
import { generateQRCode, downloadQRCode, generateQRCodeSVG } from '@/utils/qrcode.js'
import { downloadEventManager } from '@/utils/downloadEvents.js'

const simpleText = ref('https://www.example.com')
const customText = ref('自定义样式二维码')
const customColor = ref('#FF6B6B')
const customBgColor = ref('#F7F7F7')
const toolResult = ref(null)
const isDownloading = ref(false)
const downloadStatus = ref(null)

const generateWithTool = async () => {
  try {
    const dataURL = await generateQRCode(simpleText.value, {
      width: 200,
      color: { dark: '#000000', light: '#FFFFFF' }
    })
    toolResult.value = { type: 'image', data: dataURL }
  } catch (error) {
    console.error('生成失败:', error)
  }
}

const downloadWithTool = async () => {
  // 使用事件管理器触发下载开始事件
  downloadEventManager.triggerDownloadStart({
    text: simpleText.value,
    timestamp: new Date().toISOString()
  })
  
  // 设置下载状态
  isDownloading.value = true
  downloadStatus.value = {
    type: 'info',
    message: '正在生成二维码...'
  }
  
  try {
    await downloadQRCode(simpleText.value, `qrcode-${Date.now()}.png`, {
      width: 300,
      color: { dark: '#000000', light: '#FFFFFF' }
    })
    
    // 使用事件管理器触发下载成功事件
    downloadEventManager.triggerDownloadSuccess({
      text: simpleText.value,
      filename: `qrcode-${Date.now()}.png`,
      timestamp: new Date().toISOString()
    })
    
    // 显示成功状态
    downloadStatus.value = {
      type: 'success',
      message: '二维码下载成功！'
    }
    
    // 3秒后清除状态
    setTimeout(() => {
      downloadStatus.value = null
    }, 3000)
    
  } catch (error) {
    console.error('下载失败:', error)
    
    // 使用事件管理器触发下载失败事件
    downloadEventManager.triggerDownloadError({
      text: simpleText.value,
      error: error.message,
      timestamp: new Date().toISOString()
    })
    
    // 显示错误状态
    downloadStatus.value = {
      type: 'error',
      message: `下载失败: ${error.message}`
    }
    
    // 5秒后清除错误状态
    setTimeout(() => {
      downloadStatus.value = null
    }, 5000)
  } finally {
    isDownloading.value = false
  }
}

const generateSVG = async () => {
  try {
    const svgString = await generateQRCodeSVG(simpleText.value, {
      width: 200,
      color: { dark: '#000000', light: '#FFFFFF' }
    })
    toolResult.value = { type: 'svg', data: svgString }
  } catch (error) {
    console.error('生成SVG失败:', error)
  }
}

// 监听下载事件
const setupDownloadEventListeners = () => {
  // 监听下载开始事件
  window.addEventListener('downloadStart', (event) => {
    console.log('下载开始:', event.detail)
    // 可以在这里添加全局的下载开始处理逻辑
  })
  
  // 监听下载成功事件
  window.addEventListener('downloadSuccess', (event) => {
    console.log('下载成功:', event.detail)
    // 可以在这里添加全局的下载成功处理逻辑
    // 例如：发送统计信息、记录日志等
  })
  
  // 监听下载失败事件
  window.addEventListener('downloadError', (event) => {
    console.log('下载失败:', event.detail)
    // 可以在这里添加全局的下载失败处理逻辑
    // 例如：错误上报、用户行为分析等
  })
}

// 组件挂载时设置事件监听器
onMounted(() => {
  setupDownloadEventListeners()
})
</script>

<style scoped>
.qrcode-example {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.example-section {
  margin-bottom: 30px;
  padding: 20px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #fafafa;
}

.example-section h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 1px solid #ddd;
  padding-bottom: 10px;
}

.text-input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 10px;
  font-size: 14px;
}

.tool-buttons {
  margin-bottom: 15px;
}

.btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 10px;
  margin-bottom: 10px;
  transition: background-color 0.3s;
}

.btn:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
  opacity: 0.6;
}

.download-status {
  padding: 10px;
  border-radius: 4px;
  margin: 10px 0;
  font-size: 14px;
}

.download-status.info {
  background-color: #d1ecf1;
  color: #0c5460;
  border: 1px solid #bee5eb;
}

.download-status.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.download-status.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.result {
  margin-top: 15px;
  text-align: center;
}

.result img {
  max-width: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.controls {
  margin-top: 15px;
}

.color-controls {
  margin-top: 10px;
}

.color-controls label {
  display: inline-block;
  margin-right: 20px;
  font-size: 14px;
}

.color-controls input[type="color"] {
  margin-left: 5px;
  width: 40px;
  height: 25px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}
</style>
