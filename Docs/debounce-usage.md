# 防抖功能使用说明

## 概述

本项目已集成防抖功能，用于防止用户快速重复点击按钮导致的重复请求问题。

## 防抖工具函数

### 基本用法

```javascript
import { useDebounce } from '@/utils/debounce'

// 创建防抖函数
const debouncedFunction = useDebounce(originalFunction, 1000) // 1秒防抖
```

### 参数说明

- `originalFunction`: 原始函数
- `wait`: 等待时间（毫秒），默认300ms
- `immediate`: 是否立即执行，默认false

## 在Vue组件中使用

### 1. 导入防抖工具

```javascript
import { useDebounce } from '@/utils/debounce'
```

### 2. 创建防抖函数

```javascript
// 原始函数
const handleSubmit = async () => {
  try {
    const result = await api.submitData(formData)
    console.log('提交成功:', result)
  } catch (error) {
    console.error('提交失败:', error)
  }
}

// 防抖处理后的函数
const debouncedHandleSubmit = useDebounce(handleSubmit, 1000)
```

### 3. 在模板中使用

```vue
<template>
  <button @click="debouncedHandleSubmit">
    提交
  </button>
</template>
```

## 已应用防抖的按钮

### 提现页面 (userWithdrawal.vue)

1. **提现申请按钮**
   - 防抖时间: 1000ms
   - 防止重复提交提现申请

2. **删除提现记录按钮**
   - 防抖时间: 1000ms
   - 防止重复删除操作

3. **查询按钮**
   - 防抖时间: 500ms
   - 防止快速重复查询

### 支付绑定页面 (PaymentBinding.vue)

1. **绑定支付宝按钮**
   - 防抖时间: 1000ms
   - 防止重复绑定操作

2. **保存微信姓名按钮**
   - 防抖时间: 1000ms
   - 防止重复保存操作

## 防抖效果

### 防抖前
```
用户点击 → 立即执行 → 用户快速点击 → 立即执行 → 重复请求
```

### 防抖后
```
用户点击 → 等待1秒 → 执行一次 → 用户快速点击 → 重置等待时间 → 只执行最后一次
```

## 最佳实践

### 1. 选择合适的防抖时间

- **表单提交**: 1000ms - 防止重复提交
- **搜索查询**: 300-500ms - 平衡响应速度和防抖效果
- **删除操作**: 1000ms - 防止误操作

### 2. 用户体验优化

```javascript
// 可以添加加载状态
const isLoading = ref(false)

const handleSubmit = async () => {
  if (isLoading.value) return // 防止重复执行
  
  isLoading.value = true
  try {
    await api.submitData(formData)
    ElMessage.success('提交成功')
  } catch (error) {
    ElMessage.error('提交失败')
  } finally {
    isLoading.value = false
  }
}

const debouncedHandleSubmit = useDebounce(handleSubmit, 1000)
```

### 3. 错误处理

```javascript
const handleSubmit = async () => {
  try {
    const result = await api.submitData(formData)
    ElMessage.success('操作成功')
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败，请稍后再试')
  }
}
```

## 注意事项

1. **防抖时间不宜过长**: 避免用户等待时间过长
2. **重要操作保留确认**: 删除等危险操作仍需确认对话框
3. **状态管理**: 防抖期间可能需要禁用按钮或显示加载状态
4. **错误处理**: 确保防抖函数内的错误处理完善

## 扩展使用

### 自定义防抖时间

```javascript
// 快速响应
const quickDebounced = useDebounce(fn, 300)

// 慢速响应
const slowDebounced = useDebounce(fn, 2000)
```

### 立即执行模式

```javascript
// 立即执行，然后防抖
const immediateDebounced = useDebounce(fn, 1000, true)
```


