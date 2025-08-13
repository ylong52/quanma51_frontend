<template>
  <div class="cache-usage-example">
    <h3>配置缓存使用示例</h3>
    
    <div class="usage-section">
      <h4>基本使用</h4>
      <div class="usage-item">
        <span>充值费用:</span>
        <span>{{ userStore.getConfig('recharge_fees') || '未设置' }}</span>
      </div>
      <div class="usage-item">
        <span>免费提现限额:</span>
        <span>{{ userStore.getConfig('free_withdrawal_limit') || '未设置' }}</span>
      </div>
    </div>

    <div class="usage-section">
      <h4>缓存管理</h4>
      <div class="cache-controls">
        <button @click="reloadConfig" class="cache-btn primary">重新加载配置</button>
        <button @click="clearCache" class="cache-btn danger">清除缓存</button>
        <button @click="checkCache" class="cache-btn info">检查缓存状态</button>
      </div>
    </div>

    <div class="usage-section">
      <h4>缓存状态</h4>
      <div class="cache-status">
        <div class="status-item">
          <span>配置已加载:</span>
          <span :class="{ 'status-ok': isConfigLoaded, 'status-error': !isConfigLoaded }">
            {{ isConfigLoaded ? '是' : '否' }}
          </span>
        </div>
        <div class="status-item">
          <span>缓存大小:</span>
          <span>{{ cacheSize }}</span>
        </div>
        <div class="status-item">
          <span>最后更新:</span>
          <span>{{ lastUpdateTime }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useUserStore } from '@/store/user'
import configHelper from '@/utils/configHelper'
import * as api from '@/api/index'

const userStore = useUserStore()
const lastUpdateTime = ref('')

// 计算属性：检查配置是否已加载
const isConfigLoaded = computed(() => {
  return configHelper.isConfigLoaded()
})

// 计算属性：缓存大小
const cacheSize = computed(() => {
  try {
    const saved = sessionStorage.getItem('appConfig')
    return saved ? `${(saved.length / 1024).toFixed(2)} KB` : '0 KB'
  } catch (e) {
    return '计算失败'
  }
})

// 重新加载配置
const reloadConfig = async () => {
  try {
    const success = await configHelper.reloadConfig()
    if (success) {
      lastUpdateTime.value = new Date().toLocaleString()
      console.log('配置重新加载成功')
    } else {
      console.error('配置重新加载失败')
    }
  } catch (error) {
    console.error('重新加载配置时出错:', error)
  }
}

// 清除缓存
const clearCache = () => {
  configHelper.clearCache()
  lastUpdateTime.value = ''
  console.log('配置缓存已清除')
}

// 检查缓存状态
const checkCache = () => {
  console.log('=== 缓存状态检查 ===')
  console.log('Store配置:', userStore.config)
  console.log('配置是否已加载:', isConfigLoaded.value)
  console.log('缓存大小:', cacheSize.value)
  console.log('sessionStorage内容:', sessionStorage.getItem('appConfig'))
}
</script>

<style scoped>
.cache-usage-example {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin: 20px;
}

.usage-section {
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.usage-section h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 5px;
}

.usage-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.usage-item:last-child {
  border-bottom: none;
}

.usage-item span:first-child {
  font-weight: 500;
  color: #666;
}

.usage-item span:last-child {
  color: #333;
  font-weight: 600;
}

.cache-controls {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.cache-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.cache-btn.primary {
  background: #007bff;
  color: white;
}

.cache-btn.primary:hover {
  background: #0056b3;
}

.cache-btn.danger {
  background: #dc3545;
  color: white;
}

.cache-btn.danger:hover {
  background: #c82333;
}

.cache-btn.info {
  background: #17a2b8;
  color: white;
}

.cache-btn.info:hover {
  background: #138496;
}

.cache-status {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.status-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.status-item:last-child {
  border-bottom: none;
}

.status-item span:first-child {
  font-weight: 500;
  color: #666;
}

.status-item span:last-child {
  font-weight: 600;
}

.status-ok {
  color: #28a745;
}

.status-error {
  color: #dc3545;
}
</style>


