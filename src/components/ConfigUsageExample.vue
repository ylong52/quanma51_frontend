<template>
  <div class="config-usage-example">
    <h3>配置使用示例</h3>
    
    <!-- 直接使用store中的配置 -->
    <div class="config-section">
      <h4>直接使用Store配置</h4>
      <div class="config-item">
        <span>充值费用:</span>
        <span>{{ userStore.getConfig('recharge_fees') || '未设置' }}</span>
      </div>
      <div class="config-item">
        <span>提现费用:</span>
        <span>{{ userStore.getConfig('withdrawal_fees') || '未设置' }}</span>
      </div>
    </div>

    <!-- 使用配置助手 -->
    <div class="config-section">
      <h4>使用配置助手</h4>
      <div class="config-item">
        <span>充值费用:</span>
        <span>{{ configHelper.getRechargeFees() }}</span>
      </div>
      <div class="config-item">
        <span>最小充值金额:</span>
        <span>{{ configHelper.getMinRechargeAmount() }}</span>
      </div>
      <div class="config-item">
        <span>最大提现金额:</span>
        <span>{{ configHelper.getMaxWithdrawalAmount() }}</span>
      </div>
    </div>

    <!-- 显示所有配置 -->
    <div class="config-section">
      <h4>所有配置数据</h4>
      <div v-if="userStore.config.length > 0" class="config-list">
        <div v-for="(item, index) in userStore.config" :key="index" class="config-item">
          <span>{{ item.key }}:</span>
          <span>{{ item.value }}</span>
        </div>
      </div>
      <div v-else class="no-config">
        暂无配置数据
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/store/user'
import configHelper from '@/utils/configHelper'

const userStore = useUserStore()

// 计算属性：检查配置是否已加载
const isConfigLoaded = computed(() => {
  return userStore.config.length > 0
})

// 计算属性：获取充值费用
const rechargeFees = computed(() => {
  return userStore.getConfig('recharge_fees') || 0
})

// 计算属性：获取提现费用
const withdrawalFees = computed(() => {
  return userStore.getConfig('withdrawal_fees') || 0
})
</script>

<style scoped>
.config-usage-example {
  padding: 20px;
  background: #f5f5f5;
  border-radius: 8px;
  margin: 20px 0;
}

.config-section {
  margin-bottom: 20px;
  padding: 15px;
  background: white;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.config-section h4 {
  margin: 0 0 10px 0;
  color: #333;
  font-size: 16px;
}

.config-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
}

.config-item:last-child {
  border-bottom: none;
}

.config-item span:first-child {
  font-weight: 500;
  color: #666;
}

.config-item span:last-child {
  color: #333;
  font-weight: 600;
}

.config-list {
  max-height: 200px;
  overflow-y: auto;
}

.no-config {
  text-align: center;
  color: #999;
  font-style: italic;
  padding: 20px;
}
</style>
