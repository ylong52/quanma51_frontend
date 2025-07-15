<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- 遮罩层 -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click.self="emitClose"></div>
      <!-- 注册卡片 -->
      <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden animate-fadeInUp">
        <!-- 关闭按钮 -->
        <button class="absolute top-3 right-3 text-gray-400 hover:text-primary text-xl z-10" @click="emitClose">
          &times;
        </button>
        <div class="p-8">
          <div class="text-center mb-8">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <i class="fa fa-user-plus text-3xl text-primary"></i>
            </div>
            <h2 class="text-2xl font-bold text-gray-800">注册新账户</h2>
            <p class="text-gray-500 mt-1">注册后即可享受更多服务</p>
          </div>
          <!-- 注册表单 -->
          <form @submit.prevent="handleRegister">
            <div class="mb-4">
              <label for="reg-username" class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fa fa-user text-gray-400"></i>
                </div>
                <input type="text" id="reg-username" v-model="registerForm.username"
                  class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom"
                  placeholder="请输入用户名">
              </div>
            </div>
            <div class="mb-4">
              <label for="reg-phone" class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fa fa-mobile text-gray-400"></i>
                </div>
                <input type="text" id="reg-phone" v-model="registerForm.phone"
                  class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom"
                  placeholder="请输入手机号">
              </div>
            </div>
            <div class="mb-4">
              <label for="reg-code" class="block text-sm font-medium text-gray-700 mb-1">验证码</label>
              <div class="relative flex items-center">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fa fa-shield text-gray-400"></i>
                </div>
                <input type="text" id="reg-code" v-model="registerForm.code"
                  class="w-full pl-10 pr-24 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom"
                  placeholder="请输入验证码">
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
                  placeholder="请输入密码">
              </div>
            </div>
            <button type="submit"
              class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-custom shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              :disabled="loading">
              {{ loading ? '注册中...' : '注册' }}
            </button>
          </form>
          <div class="mt-6 text-center">
            <p class="text-gray-600">
              已有账户? <a href="#" class="text-primary font-medium hover:text-primary/80 transition-custom" @click.prevent="emit('goToLogin')">返回登录</a>
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
import * as api from '@/api';

const props = defineProps({ show: Boolean })
const emit = defineEmits(['close', 'goToLogin'])

// 注册表单数据
const registerForm = ref({
  username: '',
  phone: '',
  code: '',
  password: ''
})

// 加载状态
const loading = ref(false)

// 注册处理
const handleRegister = async () => {
  loading.value = true
  try {
    // 实际项目中替换为真实API调用
    const res = await api.register(registerForm.value)    
    if (res.status === 'success') {
      useToast().success('注册成功！请登录')
      emit('close')
      emit('goToLogin') // 通知父组件切换到登录
    }  
  } catch (error) {
    console.error('注册请求错误:', error)
    useToast().error('注册失败: ' + (error.message || '网络错误'))
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