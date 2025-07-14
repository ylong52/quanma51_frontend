import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    username: '',
    rememberMe: false,
    // 添加新的用户信息字段
    token: '',
    userId: '',
    phone: ''
  }),
  
  actions: {
    // 更新login action以接收完整用户信息
    login(userInfo) {
      this.isLoggedIn = true
      this.username = userInfo.username
      this.rememberMe = userInfo.rememberMe
      this.token = userInfo.token
      this.userId = userInfo.userId
      this.phone = userInfo.phone
    },
    
    logout() {
      this.isLoggedIn = false
      this.username = ''
      this.rememberMe = false
      // 登出时清除所有用户信息
      this.token = ''
      this.userId = ''
      this.phone = ''
    }
  },
  
  getters: {
    getUserInfo: (state) => ({
      isLoggedIn: state.isLoggedIn,
      username: state.username,
      userId: state.userId,
      phone: state.phone
    })
  }
})