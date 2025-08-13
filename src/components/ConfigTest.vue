<template>
  <div class="config-test">
    <h3>配置系统测试</h3>
    
    <div class="test-section">
      <h4>Store状态</h4>
      <div class="test-item">
        <span>配置对象键数量:</span>
        <span>{{ userStore.config ? Object.keys(userStore.config).length : 0 }}</span>
      </div>
      <div class="test-item">
        <span>配置数据类型:</span>
        <span>{{ typeof userStore.config }}</span>
      </div>
      <div class="test-item">
        <span>配置数据内容:</span>
        <pre>{{ JSON.stringify(userStore.config, null, 2) }}</pre>
      </div>
    </div>

    <div class="test-section">
      <h4>配置获取测试</h4>
      <div class="test-item">
        <span>recharge_fees:</span>
        <span>{{ userStore.getConfig('recharge_fees') || '未找到' }}</span>
      </div>
      <div class="test-item">
        <span>withdrawal_fees:</span>
        <span>{{ userStore.getConfig('withdrawal_fees') || '未找到' }}</span>
      </div>
      <div class="test-item">
        <span>rechareg_fees (拼写错误):</span>
        <span>{{ userStore.getConfig('rechareg_fees') || '未找到' }}</span>
      </div>
    </div>

    <div class="test-section">
      <h4>配置助手测试</h4>
      <div class="test-item">
        <span>充值费用:</span>
        <span>{{ configHelper.getRechargeFees() }}</span>
      </div>
      <div class="test-item">
        <span>提现费用:</span>
        <span>{{ configHelper.getWithdrawalFees() }}</span>
      </div>
    </div>

         <div class="test-section">
       <h4>手动测试</h4>
       <button @click="testConfig" class="test-button">测试配置获取</button>
       <button @click="reloadConfig" class="test-button">重新加载配置</button>
       <button @click="clearCache" class="test-button">清除缓存</button>
     </div>
     
     <div class="test-section">
       <h4>缓存状态</h4>
       <div class="test-item">
         <span>sessionStorage中的配置:</span>
         <span>{{ sessionStorageConfig }}</span>
       </div>
       <div class="test-item">
         <span>缓存大小:</span>
         <span>{{ cacheSize }}</span>
       </div>
     </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useUserStore } from '@/store/user'
import configHelper from '@/utils/configHelper'
import * as api from '@/api/index'

const userStore = useUserStore()

// 计算属性：sessionStorage中的配置
const sessionStorageConfig = computed(() => {
  try {
    const saved = sessionStorage.getItem('appConfig')
    return saved ? '已缓存' : '未缓存'
  } catch (e) {
    return '读取失败'
  }
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

const testConfig = () => {
  console.log('=== 配置测试 ===')
  console.log('Store配置:', userStore.config)
  console.log('配置类型:', typeof userStore.config)
  console.log('是否为数组:', Array.isArray(userStore.config))
  
  if (Array.isArray(userStore.config)) {
    userStore.config.forEach((item, index) => {
      console.log(`配置项 ${index}:`, item)
    })
  } else if (userStore.config && typeof userStore.config === 'object') {
    Object.entries(userStore.config).forEach(([key, value]) => {
      console.log(`配置项 ${key}:`, value)
    })
  }
  
  // 测试获取配置
  const rechargeFees = userStore.getConfig('recharge_fees')
  console.log('充值费用:', rechargeFees)
  
  const withdrawalFees = userStore.getConfig('withdrawal_fees')
  console.log('提现费用:', withdrawalFees)
}

const reloadConfig = async () => {
  try {
    console.log('重新加载配置...')
    const res = await api.globalconfig()
    console.log('API响应:', res)
    
    if (res.data) {
      userStore.setConfig(res.data)
      console.log('配置已重新加载并缓存')
    }
  } catch (error) {
    console.error('重新加载配置失败:', error)
  }
}

const clearCache = () => {
  userStore.clearConfig()
  console.log('配置缓存已清除')
}

onMounted(() => {
  console.log('ConfigTest组件已挂载')
  console.log('当前Store配置:', userStore.config)
})
</script>

<style scoped>
.config-test {
  padding: 20px;
  background: #f0f0f0;
  border-radius: 8px;
  margin: 20px;
}

.test-section {
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.test-section h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
}

.test-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.test-item:last-child {
  border-bottom: none;
}

.test-item span:first-child {
  font-weight: 500;
  color: #666;
}

.test-item span:last-child {
  color: #333;
  font-weight: 600;
}

.test-item pre {
  background: #f5f5f5;
  padding: 8px;
  border-radius: 4px;
  font-size: 12px;
  overflow-x: auto;
  max-width: 300px;
}

.test-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  margin-right: 10px;
  cursor: pointer;
}

.test-button:hover {
  background: #0056b3;
}
</style>
