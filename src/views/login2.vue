<template>
  <div class="bg-white min-h-screen flex flex-col justify-start pt-20 bg-gray-100">
    <!-- 头部导航图标 -->
    <router-link to="/" class="absolute top-4 left-4 text-gray-600 hover:text-primary transition-colors">
      <font-awesome-icon :icon="'home'"   />
    </router-link>
    
    <div class="bg-white w-full max-w-md mx-auto p-8 rounded-lg   border-gray-100">
      <div class="text-center  ">
        <div class="w-16  bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fa fa-user-circle text-3xl text-primary"></i>
        </div>
        <h2 class="text-2xl font-bold text-gray-800">欢迎回来</h2>
        <p class="text-gray-500 mt-1">登录您的账户继续购物</p>
      </div>
      <!-- 登录表单 -->
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fa fa-user text-gray-400"></i>
            </div>
            <input type="text" id="username" v-model="form.username"
              class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom"
              placeholder="请输入用户名">
          </div>
        </div>
        <div class="mb-6">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">密码</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="fa fa-lock text-gray-400"></i>
            </div>
            <input type="password" id="password" v-model="form.password"
              class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom"
              placeholder="请输入密码">
          </div>
        </div>
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center">
            <input id="rememberMe" type="checkbox" v-model="form.rememberMe"
              class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded">
            <label for="rememberMe" class="ml-2 block text-sm text-gray-700">记住我</label>
          </div>
          <!-- <router-link to="/forgot-password" class="text-sm font-medium text-primary hover:text-primary/80 transition-custom">忘记密码?</router-link> -->
        </div>
        <button type="submit"
          class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-custom hover:transform hover:-translate-y-0.5"
          :disabled="loading">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>
      <div class="mt-6 text-center">
        <p class="text-gray-600">
          还没有账户? <router-link to="/register" class="text-primary font-medium hover:text-primary/80 transition-custom">立即注册</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import { useUserStore } from '../store/user'
import { useRouter } from 'vue-router'
import * as api from '@/api';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome } from '@fortawesome/free-solid-svg-icons';

// 添加图标到库
library.add(faHome);

const router = useRouter()
const userStore = useUserStore()

// 登录表单数据
const form = ref({
  username: '',
  password: '',
  rememberMe: true
})

// 加载状态
const loading = ref(false)

// 登录处理
const handleLogin = async () => {
  loading.value = true
  if (form.value.rememberMe) {
    localStorage.setItem('rememberMe', 'true')
    localStorage.setItem('username', form.value.username)
    localStorage.setItem('password', form.value.password)
  } else {
    localStorage.removeItem('rememberMe')
    localStorage.removeItem('username')
    localStorage.removeItem('password')
  }
  try {
    const res = await api.login(form.value)
    if (res.status === 'success') {
      useToast().success('登录成功！')
      localStorage.setItem('token', res.data.token)
      userStore.login({
        username: form.value.username,
        rememberMe: form.value.rememberMe,
        token: res.data.token,
        userId: res.data.user.id,
        phone: res.data.user.phone,
        balance:res.data.user.balance
      });
      router.push('/') // 登录成功后跳转到首页
    } else {
      localStorage.removeItem('token')
      // useToast().error(res.message || '登录失败')
    }

  } catch (error) {
    console.error('登录请求错误:', error)
    // useToast().error('登录失败，请稍后再试')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  const rememberMe = localStorage.getItem('rememberMe')
  if (rememberMe) {
    form.value.username = localStorage.getItem('username')
    form.value.password = localStorage.getItem('password')
  }
})
</script>

<style scoped>
.transition-custom {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>