<template>
  <div v-if="showStatus" class="download-status-overlay">
    <div class="download-status-card" :class="statusType">
      <div class="status-icon">
        <span v-if="statusType === 'info'" class="loading-spinner"></span>
        <span v-else-if="statusType === 'success'" class="success-icon">✓</span>
        <span v-else-if="statusType === 'error'" class="error-icon">✗</span>
      </div>
      <div class="status-content">
        <div class="status-title">{{ statusTitle }}</div>
        <div class="status-message">{{ statusMessage }}</div>
        <div v-if="downloadInfo" class="download-info">
          <div class="info-item">
            <span class="label">文件:</span>
            <span class="value">{{ downloadInfo.filename || '二维码' }}</span>
          </div>
          <div class="info-item">
            <span class="label">时间:</span>
            <span class="value">{{ formatTime(downloadInfo.timestamp) }}</span>
          </div>
        </div>
      </div>
      <button @click="closeStatus" class="close-btn">×</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { onDownloadStart, onDownloadSuccess, onDownloadError, removeDownloadListener } from '@/utils/downloadEvents.js'

const showStatus = ref(false)
const statusType = ref('info')
const statusTitle = ref('')
const statusMessage = ref('')
const downloadInfo = ref(null)

let startListenerId = null
let successListenerId = null
let errorListenerId = null

const formatTime = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp).toLocaleString('zh-CN')
}

const closeStatus = () => {
  showStatus.value = false
}

const showDownloadStatus = (type, title, message, info = null) => {
  statusType.value = type
  statusTitle.value = title
  statusMessage.value = message
  downloadInfo.value = info
  showStatus.value = true

  // 自动关闭
  const autoCloseTime = type === 'error' ? 5000 : 3000
  setTimeout(() => {
    if (showStatus.value) {
      closeStatus()
    }
  }, autoCloseTime)
}

onMounted(() => {
  // 监听下载开始事件
  startListenerId = onDownloadStart((data) => {
    showDownloadStatus(
      'info',
      '下载开始',
      '正在生成二维码...',
      data
    )
  })

  // 监听下载成功事件
  successListenerId = onDownloadSuccess((data) => {
    showDownloadStatus(
      'success',
      '下载成功',
      '二维码已成功下载到您的设备',
      data
    )
  })

  // 监听下载失败事件
  errorListenerId = onDownloadError((data) => {
    showDownloadStatus(
      'error',
      '下载失败',
      `下载失败: ${data.error || '未知错误'}`,
      data
    )
  })
})

onUnmounted(() => {
  // 清理监听器
  if (startListenerId) {
    removeDownloadListener('downloadStart', startListenerId)
  }
  if (successListenerId) {
    removeDownloadListener('downloadSuccess', successListenerId)
  }
  if (errorListenerId) {
    removeDownloadListener('downloadError', errorListenerId)
  }
})
</script>

<style scoped>
.download-status-overlay {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
}

.download-status-card {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  margin-bottom: 10px;
  animation: slideIn 0.3s ease-out;
  position: relative;
}

.download-status-card.info {
  background-color: #e3f2fd;
  border-left: 4px solid #2196f3;
  color: #1565c0;
}

.download-status-card.success {
  background-color: #e8f5e8;
  border-left: 4px solid #4caf50;
  color: #2e7d32;
}

.download-status-card.error {
  background-color: #ffebee;
  border-left: 4px solid #f44336;
  color: #c62828;
}

.status-icon {
  margin-right: 12px;
  font-size: 20px;
  font-weight: bold;
  min-width: 24px;
  text-align: center;
}

.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid currentColor;
  border-radius: 50%;
  border-top-color: transparent;
  animation: spin 1s linear infinite;
}

.success-icon {
  color: #4caf50;
}

.error-icon {
  color: #f44336;
}

.status-content {
  flex: 1;
}

.status-title {
  font-weight: bold;
  margin-bottom: 4px;
  font-size: 14px;
}

.status-message {
  font-size: 13px;
  margin-bottom: 8px;
}

.download-info {
  font-size: 12px;
  opacity: 0.8;
}

.info-item {
  display: flex;
  margin-bottom: 2px;
}

.info-item .label {
  font-weight: bold;
  margin-right: 8px;
  min-width: 40px;
}

.info-item .value {
  word-break: break-all;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: inherit;
  opacity: 0.7;
  margin-left: 8px;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: opacity 0.2s;
}

.close-btn:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.1);
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .download-status-overlay {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }
  
  .download-status-card {
    padding: 12px;
  }
}
</style>
