# 全局配置使用说明

## 概述

本项目已将全局配置数据存储到 Pinia store 中，方便在各个组件中访问和使用配置数据。

## 配置数据结构

配置数据通过 `api.globalconfig()` 接口获取，数据结构为：

```javascript
[
  { key: 'recharge_fees', value: 0.01 },
  { key: 'withdrawal_fees', value: 0.02 },
  { key: 'min_recharge_amount', value: 1 },
  { key: 'max_withdrawal_amount', value: 10000 }
  // ... 更多配置项
]
```

## 使用方法

### 1. 直接使用 Store

```javascript
import { useUserStore } from '@/store/user'

const userStore = useUserStore()

// 获取指定配置
const rechargeFees = userStore.getConfig('recharge_fees')
const withdrawalFees = userStore.getConfig('withdrawal_fees')

// 获取所有配置
const allConfig = userStore.config

// 设置配置（通常在应用启动时）
userStore.setConfig(configData)
```

### 2. 使用配置助手

```javascript
import configHelper from '@/utils/configHelper'

// 获取充值费用
const rechargeFees = configHelper.getRechargeFees()

// 获取提现费用
const withdrawalFees = configHelper.getWithdrawalFees()

// 获取最小充值金额
const minRechargeAmount = configHelper.getMinRechargeAmount()

// 获取最大提现金额
const maxWithdrawalAmount = configHelper.getMaxWithdrawalAmount()

// 获取任意配置
const customConfig = configHelper.get('custom_key', 'default_value')

// 检查配置是否已加载
const isLoaded = configHelper.isConfigLoaded()
```

### 3. 在模板中使用

```vue
<template>
  <div>
    <!-- 直接使用 -->
    <p>充值费用: {{ userStore.getConfig('recharge_fees') }}</p>
    
    <!-- 使用配置助手 -->
    <p>提现费用: {{ configHelper.getWithdrawalFees() }}</p>
    
    <!-- 显示所有配置 -->
    <div v-for="item in userStore.config" :key="item.key">
      {{ item.key }}: {{ item.value }}
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from '@/store/user'
import configHelper from '@/utils/configHelper'

const userStore = useUserStore()
</script>
```

## 配置初始化与缓存

配置数据在应用启动时自动加载到 store 中，并保存到 sessionStorage 缓存：

```javascript
// src/views/index.vue
onMounted(() => {
  api.globalconfig().then(res => {
    if (res.data && res.data != null) {
      userStore.setConfig(res.data) // 自动保存到 sessionStorage
    }
  })
})
```

### 缓存特性

- **sessionStorage 存储**: 配置数据保存在 sessionStorage 中，浏览器关闭时自动清除
- **自动恢复**: 页面刷新时会自动从 sessionStorage 恢复配置数据
- **手动管理**: 提供清除缓存和重新加载配置的方法

## 常用配置项

| 配置键 | 说明 | 默认值 |
|--------|------|--------|
| `recharge_fees` | 充值费用 | 0 |
| `withdrawal_fees` | 提现费用 | 0 |
| `min_recharge_amount` | 最小充值金额 | 1 |
| `max_withdrawal_amount` | 最大提现金额 | 10000 |

## 注意事项

1. **配置加载时机**: 配置数据在应用启动时加载，如果组件在配置加载前渲染，可能需要处理空值情况。

2. **默认值**: 使用 `getConfig()` 方法时建议提供默认值：
   ```javascript
   const fees = userStore.getConfig('recharge_fees', 0)
   ```

3. **响应式**: store 中的配置数据是响应式的，配置更新后相关组件会自动重新渲染。

4. **类型安全**: 建议在使用配置数据时进行类型检查和默认值处理。

## 缓存管理

### 清除缓存

```javascript
// 使用 store 方法
userStore.clearConfig()

// 使用配置助手
configHelper.clearCache()
```

### 重新加载配置

```javascript
// 使用配置助手重新加载
const success = await configHelper.reloadConfig()
if (success) {
  console.log('配置重新加载成功')
}
```

### 检查缓存状态

```javascript
// 检查配置是否已加载
const isLoaded = configHelper.isConfigLoaded()

// 检查缓存大小
const cacheSize = sessionStorage.getItem('appConfig')?.length || 0
```

## 扩展配置助手

如需添加新的配置项访问方法，可以在 `src/utils/configHelper.js` 中添加：

```javascript
// 添加新的配置获取方法
getCustomConfig() {
  return this.get('custom_key', 'default_value')
}
```
