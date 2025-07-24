import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const username = ref('')
  const balance = ref('0.00')
  const isLoggedIn = ref(false)

  // 初始化时从localStorage恢复
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

  // getter
  const userInfo = computed(() => ({
    username: username.value,
    balance: balance.value,
    isLoggedIn: isLoggedIn.value
  }))

  function login(info) {
    username.value = info.username
    balance.value = info.balance
    isLoggedIn.value = true
    // 持久化
    localStorage.setItem('userInfo', JSON.stringify({
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
  }

  return {
    username,
    balance,
    isLoggedIn,
    userInfo, // 作为getter暴露
    login,
    logout
  }
})