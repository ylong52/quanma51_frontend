import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as api from '@/api'

export const useUserStore = defineStore('user', () => {
  const username = ref('')
  const balance = ref('0.00')
  const isLoggedIn = ref(false)
  const config = ref({}) // 存储全局配置对象

  // 初始化时从localStorage恢复用户信息（同步，避免闪烁）
  const saved = localStorage.getItem('userInfo')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      username.value = parsed.username || ''
      balance.value = parsed.balance || '0.00'
      isLoggedIn.value = !!parsed.isLoggedIn
    } catch (e) {
      // ignore
    }
  }
    
  // 初始化时从sessionStorage恢复配置
  const savedConfig = sessionStorage.getItem('appConfig')
  if (savedConfig) {
    try {
      const parsedConfig = JSON.parse(savedConfig)
      config.value = parsedConfig
    } catch (e) {
      console.warn('恢复配置数据失败:', e)
    }
  }
    
  // getter
  const userInfo = computed(() => ({
    username: username.value,
    balance: balance.value,
    isLoggedIn: isLoggedIn.value
  }))

  // 获取配置的辅助函数
  const getConfig = (key) => {
    // 如果config.value是对象，直接获取属性值
    if (config.value && typeof config.value === 'object' && !Array.isArray(config.value)) {
      return config.value[key] || null
    }
    
    // 如果config.value是数组，使用find方法
    if (Array.isArray(config.value)) {
      const configItem = config.value.find(item => item.key === key)
      return configItem ? configItem.value : null
    }
    
    console.warn('config.value 格式不正确:', config.value)
    return null
  }

  function login(info) {
 
    username.value = info.username
    balance.value = info.balance
    isLoggedIn.value = true
    // 持久化
        localStorage.setItem('userInfo', JSON.stringify({
          userId: info.userId,
          username: username.value,
          balance: balance.value,
          isLoggedIn: true
        }))
  }
  function logout() {
    username.value = ''
    balance.value = '0.00'
    isLoggedIn.value = false
    localStorage.removeItem('userInfo')
    localStorage.removeItem('token')
    // 清除配置缓存
    clearConfig()
  }

  // 验证token的函数
  const validateToken = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      return false
    }
    
    try {
      const res = await api.checkToken()
      if (res.status === 'success') {
        console.log('Token验证成功，保持登录状态')
        return true
      } else {
        console.log('Token验证失败，清除登录状态')
        return false
      }
    } catch (error) {
      console.error('Token验证请求失败:', error)
      return false
    }
  }

  // 初始化用户状态
  const initializeUserState = async () => {
    const saved = localStorage.getItem('userInfo')
    const token = localStorage.getItem('token')
    
    if (saved && token) {
      try {
        // 验证token是否有效
        const isValidToken = await validateToken()
        if (isValidToken) {
          // token有效，保持当前已恢复的登录状态
          console.log('用户状态已恢复并验证成功')
          return true
        } else {
          // token无效，清除状态
          console.log('Token无效，清除用户状态')
          logout()
          return false
        }
      } catch (e) {
        console.error('恢复用户状态失败:', e)
        logout()
        return false
      }
    } else if (!token && isLoggedIn.value) {
      // 有用户信息但没有token，清除登录状态
      console.log('缺少token，清除登录状态')
      logout()
      return false
    }
    
    return !!(saved && token)
  }

  function setBalance(newBalance) {
    balance.value = newBalance
    // 持久化
    localStorage.setItem('userInfo', JSON.stringify({
      username: username.value,
      balance: balance.value,
      isLoggedIn: isLoggedIn.value
    }))
  }

    // 设置全局配置
  function setConfig(configData) {
    console.log('设置配置数据:', configData)
    
    // 直接存储对象格式，保持API返回的原始格式
    if (configData && typeof configData === 'object') {
      config.value = configData
      console.log('配置已存储:', config.value)
      
      // 保存到sessionStorage，浏览器关闭时会自动清除
      try {
        sessionStorage.setItem('appConfig', JSON.stringify(configData))
        console.log('配置已保存到sessionStorage')
      } catch (e) {
        console.warn('保存配置到sessionStorage失败:', e)
      }
    } else {
      console.warn('配置数据格式不正确:', configData)
      config.value = {}
    }
  }

  // 清除配置缓存
  function clearConfig() {
    config.value = {}
    sessionStorage.removeItem('appConfig')
    console.log('配置缓存已清除')
  }

  return {
    username,
    balance,
    isLoggedIn,
    config, // 暴露config对象
    userInfo, // 作为getter暴露
    login,
    logout,
    setBalance,
    setConfig, // 设置配置方法
    getConfig, // 获取配置方法
    clearConfig, // 清除配置缓存方法
    validateToken, // 验证token方法
    initializeUserState // 初始化用户状态方法
  }
})