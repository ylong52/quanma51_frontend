<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 顶部导航 -->
    <div class="bg-white border-b border-gray-200 py-3 px-4 relative">
      <router-link to="/login" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
        <font-awesome-icon :icon="'arrow-left'" />
      </router-link>
      <router-link to="/" class="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">
        <font-awesome-icon :icon="'home'" />
      </router-link>
      <h1 class="text-xl font-bold text-center text-gray-800">找回密码</h1>
    </div>

    <!-- 主内容区 -->
    <div class="flex-1 flex   justify-center p-4 pt-8">
      <div class="w-full max-w-md">
        

        <!-- 找回密码表单 -->
        <form @submit.prevent="handleResetPassword" class="bg-white rounded-lg border border-gray-100 p-5 w-full">
          <div class="mb-4">
            <label for="reset-phone" class="block text-sm font-medium text-gray-700 mb-1">手机号</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <font-awesome-icon :icon="'mobile'" class="text-gray-400" />
              </div>
              <input type="tel" id="reset-phone" v-model="resetForm.phone"
                class="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom"
                placeholder="请输入注册手机号"
                required>
            </div>
          </div>

          <div class="mb-4">
            <label for="reset-code" class="block text-sm font-medium text-gray-700 mb-1">验证码</label>
            <div class="relative flex items-center">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <font-awesome-icon :icon="'shield'" class="text-gray-400" />
              </div>
              <input type="number" id="reset-code" v-model="resetForm.verify_code"
                class="w-full pl-10 pr-24 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom"
                placeholder="请输入验证码"
                required>
              <button type="button" @click="getVerificationCode"
                class="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm bg-primary text-white rounded hover:bg-primary/90 transition-custom"
                :disabled="cooldown > 0">
                {{ cooldown > 0 ? `${cooldown}秒后重试` : '获取验证码' }}
              </button>
            </div>
          </div>

          <div class="mb-4">
            <label for="reset-password" class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <font-awesome-icon :icon="'lock'" class="text-gray-400" />
              </div>
              <input :type="showPassword ? 'text' : 'password'" id="reset-password" v-model="resetForm.password"
                class="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom"
                placeholder="请输入新密码"
                required>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" @click="togglePassword">
                <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" class="text-gray-400" />
              </div>
            </div>
          </div>

          <div class="mb-6">
            <label for="reset-confirm-password" class="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <font-awesome-icon :icon="'lock'" class="text-gray-400" />
              </div>
              <input :type="showConfirmPassword ? 'text' : 'password'" id="reset-confirm-password" v-model="resetForm.confirmPassword"
                class="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom"
                placeholder="请再次输入新密码"
                required>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" @click="toggleConfirmPassword">
                <font-awesome-icon :icon="showConfirmPassword ? 'eye-slash' : 'eye'" class="text-gray-400" />
              </div>
            </div>
          </div>

          <button type="submit"
            class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-custom hover:transform hover:-translate-y-0.5"
            :disabled="loading">
            {{ loading ? '提交中...' : '重置密码' }}
          </button>

          <div class="mt-6 text-center">
            <p class="text-gray-600">
              想起密码了? <router-link to="/login" class="text-primary font-medium hover:text-primary/80 transition-custom">返回登录</router-link>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from 'vue-toast-notification'
import { useRouter } from 'vue-router';
import * as api from '@/api';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faEye, faEyeSlash, faArrowLeft, faMobile, faShield, faLock, faHome } from '@fortawesome/free-solid-svg-icons';

// 添加图标到库
library.add(faEye, faEyeSlash, faArrowLeft, faMobile, faShield, faLock, faHome);

const router = useRouter();
const toast = useToast();

// 重置密码表单数据
const resetForm = ref({
  phone: '',
  verify_code: '',
  password: '',
  confirmPassword: ''
})

// 加载状态
const loading = ref(false)

// 密码显示状态
const showPassword = ref(false)
const showConfirmPassword = ref(false)

// 验证码倒计时
const cooldown = ref(0)

// 切换密码显示状态
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// 切换确认密码显示状态
const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// 获取验证码
const getVerificationCode = () => {
  if (!resetForm.value.phone) {
    toast.error('请输入手机号码');
    return;
  }
  
  // 模拟发送验证码
  toast.success('验证码已发送');
  cooldown.value = 60;
  
  // 启动倒计时
  const timer = setInterval(() => {
    cooldown.value--;
    if (cooldown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
}

// 重置密码处理
const handleResetPassword = async () => {
  // 表单验证
  if (resetForm.value.password !== resetForm.value.confirmPassword) {
    toast.error('两次输入的密码不一致');
    return;
  }
  
  loading.value = true;
  try {
    // 这里应该调用实际的API
    const res = await api.forgotPassword(resetForm.value);
 
    
    toast.success('密码重置成功！请使用新密码登录');
    router.push('/login');
  } catch (error) {
    console.error('密码重置请求错误:', error);
    // toast.error('密码重置失败: ' + (error?.message || '网络错误'));
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.transition-custom {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style> 