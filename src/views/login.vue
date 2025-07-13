<template>
  <Teleport to="body">
    <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- 遮罩层 -->
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click.self="emitClose"></div>
      <!-- 登录/注册卡片 -->
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
            <h2 class="text-2xl font-bold text-gray-800">{{ tab === 'login' ? '欢迎回来' : '注册新账户' }}</h2>
            <p class="text-gray-500 mt-1">
              {{ tab === 'login' ? '登录您的账户继续购物' : '注册后即可享受更多服务' }}
            </p>
          </div>
          <!-- 登录表单 -->
          <form v-if="tab === 'login'" @submit.prevent="handleLogin">
            <div class="mb-4">
              <label for="username" class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fa fa-user text-gray-400"></i>
                </div>
                <input 
                  type="text" 
                  id="username" 
                  v-model="form.username"
                  class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom" 
                  placeholder="请输入用户名"
                >
              </div>
            </div>
            <div class="mb-6">
              <label for="password" class="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fa fa-lock text-gray-400"></i>
                </div>
                <input 
                  type="password" 
                  id="password" 
                  v-model="form.password"
                  class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom" 
                  placeholder="请输入密码"
                >
              </div>
            </div>
            <div class="flex items-center justify-between mb-6">
              <div class="flex items-center">
                <input 
                  id="rememberMe" 
                  type="checkbox" 
                  v-model="form.rememberMe"
                  class="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                >
                <label for="rememberMe" class="ml-2 block text-sm text-gray-700">记住我</label>
              </div>
              <a href="#" class="text-sm font-medium text-primary hover:text-primary/80 transition-custom">忘记密码?</a>
            </div>
            <button 
              type="submit" 
              class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-custom shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              :disabled="loading"
            >
              {{ loading ? '登录中...' : '登录' }}
            </button>
          </form>
          <!-- 注册表单 -->
          <form v-else @submit.prevent="handleRegister">
            <div class="mb-4">
              <label for="reg-username" class="block text-sm font-medium text-gray-700 mb-1">用户名</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fa fa-user text-gray-400"></i>
                </div>
                <input 
                  type="text" 
                  id="reg-username" 
                  v-model="registerForm.username"
                  class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom" 
                  placeholder="请输入用户名"
                >
              </div>
            </div>
            <div class="mb-4">
              <label for="reg-phone" class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fa fa-mobile text-gray-400"></i>
                </div>
                <input 
                  type="text" 
                  id="reg-phone" 
                  v-model="registerForm.phone"
                  class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom" 
                  placeholder="请输入手机号"
                >
              </div>
            </div>
            <div class="mb-4">
              <label for="reg-code" class="block text-sm font-medium text-gray-700 mb-1">验证码</label>
              <div class="relative flex items-center">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fa fa-shield text-gray-400"></i>
                </div>
                <input 
                  type="text" 
                  id="reg-code" 
                  v-model="registerForm.code"
                  class="w-full pl-10 pr-24 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom" 
                  placeholder="请输入验证码"
                >
                <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-custom">获取验证码</button>
              </div>
            </div>
            <div class="mb-6">
              <label for="reg-password" class="block text-sm font-medium text-gray-700 mb-1">密码</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i class="fa fa-lock text-gray-400"></i>
                </div>
                <input 
                  type="password" 
                  id="reg-password" 
                  v-model="registerForm.password"
                  class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom" 
                  placeholder="请输入密码"
                >
              </div>
            </div>
            <button 
              type="submit" 
              class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-custom shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              :disabled="loading"
            >
              {{ loading ? '注册中...' : '注册' }}
            </button>
          </form>
          <div class="mt-6 text-center">
            <p class="text-gray-600">
              <template v-if="tab === 'login'">
                还没有账户? <a href="#" class="text-primary font-medium hover:text-primary/80 transition-custom" @click.prevent="tab = 'register'">立即注册</a>
              </template>
              <template v-else>
                已有账户? <a href="#" class="text-primary font-medium hover:text-primary/80 transition-custom" @click.prevent="tab = 'login'">返回登录</a>
              </template>
            </p>
          </div>
          <div v-if="tab === 'login'" class="mt-6">
            <div class="relative flex items-center">
              <div class="flex-grow border-t border-gray-300"></div>
               
              <div class="flex-grow border-t border-gray-300"></div>
            </div>
             
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

const props = defineProps({
  show: Boolean
})
const emit = defineEmits(['close'])

// 获取用户store
const userStore = useUserStore()

// 登录表单数据
const form = ref({
  username: '',
  password: '',
  rememberMe: false
})
// 注册表单数据
const registerForm = ref({
  username: '',
  phone: '',
  code: '',
  password: ''
})

// 加载状态
const loading = ref(false)

// 登录处理
const handleLogin = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    // 登录成功后，将状态保存到pinia
    userStore.login(form.value.username, form.value.rememberMe)
    useToast().success('登录成功！')
    emit('close')
  } catch (error) {
    useToast().error('登录失败，请检查用户名和密码')
  } finally {
    loading.value = false
  }
}

// 注册处理
const handleRegister = async () => {
  loading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1500))
    useToast().success('注册成功！')
    emit('close')
  } catch (error) {
    useToast().error('注册失败，请重试')
  } finally {
    loading.value = false
  }
}

const tab = ref('login')

const emitClose = () => {
  emit('close')
}
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeInUp {
  animation: fadeInUp 0.3s cubic-bezier(0.4,0,0.2,1);
}
.transition-custom {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>