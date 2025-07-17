<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- 遮罩层 -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click.self="emitClose"></div>
      <!-- 登录卡片 -->
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden animate-fadeInUp">
        <!-- 关闭按钮 -->
        <button class="absolute top-3 right-3 text-gray-400 hover:text-primary text-xl z-10" @click="emitClose">
          &times;
        </button>
        <div class="p-8">
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
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
              <a href="#" class="text-sm font-medium text-primary hover:text-primary/80 transition-custom">忘记密码?</a>
            </div>
            <button type="submit"
              class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-custom shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              :disabled="loading">
              {{ loading ? '登录中...' : '登录' }}
            </button>
          </form>
          <div class="mt-6 text-center">
            <p class="text-gray-600">
              还没有账户? <a href="#" class="text-primary font-medium hover:text-primary/80 transition-custom" @click.prevent="emit('goToRegister')">立即注册</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue'
import { useToast } from 'vue-toast-notification'
import { useUserStore } from '../store/user'
import * as api from '@/api';

const props = defineProps({ show: Boolean })
const emit = defineEmits(['close', 'goToRegister'])
const userStore = useUserStore()

// 登录表单数据
const form = ref({
  username: '',
  password: '',
  rememberMe: false
})

// 加载状态
const loading = ref(false)

// 登录处理
const handleLogin = async () => {
  loading.value = true
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
        phone: res.data.user.phone
      });
      emit('close');
    } else {
      localStorage.removeItem('token')
       
    }
  } catch (error) {
    console.error('登录请求错误:', error)
     
  } finally {
    loading.value = false
  }
}

const emitClose = () => emit('close')
</script>

<style scoped>
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-custom {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>