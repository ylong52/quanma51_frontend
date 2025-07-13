import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    username: '',
    rememberMe: false
  }),
  
  actions: {
    login(username, rememberMe) {
      this.isLoggedIn = true
      this.username = username
      this.rememberMe = rememberMe
    },
    
    logout() {
      this.isLoggedIn = false
      this.username = ''
      this.rememberMe = false
    }
  },
  
  getters: {
    getUserInfo: (state) => {
      return {
        isLoggedIn: state.isLoggedIn,
        username: state.username
      }
    }
  }
})