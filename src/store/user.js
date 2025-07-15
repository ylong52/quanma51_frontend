import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => {
    // 从localStorage读取保存的用户信息
    const savedUser = localStorage.getItem('userInfo');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        return {
          isLoggedIn: parsed.isLoggedIn,
          username: parsed.username,
          rememberMe: parsed.rememberMe,
          token: parsed.token,
          userId: parsed.userId,
          phone: parsed.phone
        };
      } catch (e) {
        localStorage.removeItem('userInfo');
      }
    }
    
    return {
      isLoggedIn: false,
      username: '',
      rememberMe: false,
      token: '',
      userId: '',
      phone: ''
    };
  },
  
  actions: {
    login(userInfo) {
      this.isLoggedIn = true;
      this.username = userInfo.username;
      this.rememberMe = userInfo.rememberMe;
      this.token = userInfo.token;
      this.userId = userInfo.userId;
      this.phone = userInfo.phone;

      // 如果勾选了记住我，保存到localStorage
      if (userInfo.rememberMe) {
        localStorage.setItem('userInfo', JSON.stringify({
          isLoggedIn: true,
          username: userInfo.username,
          rememberMe: true,
          token: userInfo.token,
          userId: userInfo.userId,
          phone: userInfo.phone
        }));
        sessionStorage.removeItem('userInfo');
      } else { 
        localStorage.removeItem('userInfo');      
        //临时存储
        sessionStorage.setItem('userInfo', JSON.stringify({
          isLoggedIn: true,
          username: userInfo.username,
          rememberMe: true,
          token: userInfo.token,
          userId: userInfo.userId,
          phone: userInfo.phone
        }));
      }
    },
    
    logout() {
      this.isLoggedIn = false;
      this.username = '';
      this.rememberMe = false;
      this.token = '';
      this.userId = '';
      this.phone = '';
      // 登出时清除localStorage
      localStorage.removeItem('userInfo');
      sessionStorage.removeItem('userInfo');
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