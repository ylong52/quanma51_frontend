<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 顶部导航 -->
    <div class="bg-white border-b border-gray-200 py-3 px-4">
      <h1 class="text-xl font-bold text-center text-gray-800">注册新账户</h1>
    </div>

    <!-- 主内容区 -->
    <div class="flex-1 flex items-center justify-center p-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <i class="fa fa-user-plus text-3xl text-primary"></i>
          </div>
          <p class="text-gray-500 mt-1">注册后即可享受更多服务</p>
        </div>

        <!-- 注册表单 -->
        <form @submit.prevent="handleRegister" class="bg-white rounded-2xl shadow-md p-6 w-full">
          <div class="mb-4">
            <label for="reg-username" class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fa fa-user text-gray-400"></i>
              </div>
              <input type="text" id="reg-username" v-model="registerForm.username"
                class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom"
                placeholder="请输入用户名"
                required>
            </div>
          </div>

          <div class="mb-4">
            <label for="reg-phone" class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fa fa-mobile text-gray-400"></i>
              </div>
              <input type="tel" id="reg-phone" v-model="registerForm.phone"
                class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom"
                placeholder="请输入手机号"
                required>
            </div>
          </div>

          <div class="mb-4">
            <label for="reg-code" class="block text-sm font-medium text-gray-700 mb-1">验证码</label>
            <div class="relative flex items-center">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fa fa-shield text-gray-400"></i>
              </div>
              <input type="number" id="reg-code" v-model="registerForm.code"
                class="w-full pl-10 pr-24 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom"
                placeholder="请输入验证码"
                required>
              <button type="button"
                class="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-custom">获取验证码</button>
            </div>
          </div>

          <div class="mb-6">
            <label for="reg-password" class="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fa fa-lock text-gray-400"></i>
              </div>
              <input type="password" id="reg-password" v-model="registerForm.password"
                class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom"
                placeholder="请输入密码"
                required>
            </div>
          </div>

          <button type="submit"
            class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-custom shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            :disabled="loading">
            {{ loading ? '注册中...' : '注册' }}
          </button>

          <div class="mt-6 text-center">
            <p class="text-gray-600">
              已有账户? <a href="#" class="text-primary font-medium hover:text-primary/80 transition-custom" @click.prevent="goToLogin">返回登录</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from 'vue-toast-notification'
import * as api from '@/api';
import { useRouter } from 'vue-router';

const router = useRouter();

// 注册表单数据
const registerForm = ref({
  username: '',
  phone: '',
  code: '',
  password: ''
})

// 加载状态
const loading = ref(false)

// 跳转到登录页
const goToLogin = () => {
  router.push('/login');
}

// 注册处理
const handleRegister = async () => {
  loading.value = true
  try {
    const res = await api.register(registerForm.value)
    if (res.status === 'success') {
      useToast().success('注册成功！请登录')
      router.push('/login');
    }
  } catch (error) {
    console.error('注册请求错误:', error)
    useToast().error('注册失败: ' + (error.message || '网络错误'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 移除弹窗相关样式 */
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

.transition-custom {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>