<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 顶部导航 -->
    <div class="bg-white border-b border-gray-200 py-3 px-4 relative">
      <router-link to="/" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
        <font-awesome-icon :icon="'home'" />
      </router-link>
      <h1 class="text-xl font-bold text-center text-gray-800">注册新账户</h1>
    </div>

    <!-- 主内容区 -->
    <div class="flex-1 flex   justify-center p-4">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-16  bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
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

          <!-- <div class="mb-4">
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
          </div> -->

          <div class="mb-4">
            <label for="reg-password" class="block text-sm font-medium text-gray-700 mb-1">密码</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fa fa-lock text-gray-400"></i>
              </div>
              <input :type="showPassword ? 'text' : 'password'" id="reg-password" v-model="registerForm.password"
                :class="[
                  'w-full pl-10 pr-10 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-custom',
                  registerForm.password.length > 0 && registerForm.password.length < 6 
                    ? 'border-red-300 focus:ring-red-500/50 focus:border-red-500' 
                    : registerForm.password.length >= 6 
                    ? 'border-green-300 focus:ring-green-500/50 focus:border-green-500'
                    : 'border-gray-300 focus:ring-primary/50 focus:border-primary'
                ]"
                placeholder="请输入密码"
                required>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" @click="togglePassword">
                <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" class="text-gray-400" />
              </div>
            </div>
          </div>

          <div class="mb-6">
            <label for="reg-confirm-password" class="block text-sm font-medium text-gray-700 mb-1">确认密码</label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i class="fa fa-lock text-gray-400"></i>
              </div>
              <input :type="showConfirmPassword ? 'text' : 'password'" id="reg-confirm-password" v-model="registerForm.confirmPassword"
                :class="[
                  'w-full pl-10 pr-10 py-3 rounded-lg border focus:outline-none focus:ring-2 transition-custom',
                  registerForm.confirmPassword && !passwordsMatch 
                    ? 'border-red-300 focus:ring-red-500/50 focus:border-red-500' 
                    : registerForm.confirmPassword && passwordsMatch 
                    ? 'border-green-300 focus:ring-green-500/50 focus:border-green-500'
                    : 'border-gray-300 focus:ring-primary/50 focus:border-primary'
                ]"
                placeholder="请再次输入密码"
                required>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" @click="toggleConfirmPassword">
                <font-awesome-icon :icon="showConfirmPassword ? 'eye-slash' : 'eye'" class="text-gray-400" />
              </div>
            </div>
            <!-- 密码匹配提示 -->
            <div v-if="registerForm.confirmPassword && !passwordsMatch" class="mt-1 text-sm text-red-500 flex items-center">
              <i class="fa fa-exclamation-circle mr-1"></i>
              两次输入的密码不一致
            </div>
            <div v-else-if="registerForm.confirmPassword && passwordsMatch" class="mt-1 text-sm text-green-500 flex items-center">
              <i class="fa fa-check-circle mr-1"></i>
              密码匹配
            </div>
            
            <!-- 密码强度提示 -->
            <div v-if="registerForm.password" class="mt-2">
              <div class="text-xs text-gray-500 mb-1">密码强度：</div>
              <div class="flex space-x-1">
                <div class="flex-1 h-1 rounded-full" :class="passwordStrength >= 1 ? 'bg-red-400' : 'bg-gray-200'"></div>
                <div class="flex-1 h-1 rounded-full" :class="passwordStrength >= 2 ? 'bg-orange-400' : 'bg-gray-200'"></div>
                <div class="flex-1 h-1 rounded-full" :class="passwordStrength >= 3 ? 'bg-yellow-400' : 'bg-gray-200'"></div>
                <div class="flex-1 h-1 rounded-full" :class="passwordStrength >= 4 ? 'bg-green-400' : 'bg-gray-200'"></div>
              </div>
              <div class="text-xs mt-1" :class="passwordStrengthText.color">{{ passwordStrengthText.text }}</div>
            </div>
          </div>

          <button type="submit"
            class="w-full bg-primary hover:bg-primary/90 text-white font-medium py-3 px-4 rounded-lg transition-custom shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            :disabled="loading || !canSubmit">
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
import { ref, computed, onMounted } from 'vue'
import { useToast } from 'vue-toast-notification'
import * as api from '@/api';
import { useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome,faEye,faEyeSlash } from '@fortawesome/free-solid-svg-icons';

// 添加图标到库
library.add(faHome,faEye,faEyeSlash);

const router = useRouter();

// 注册表单数据
const registerForm = ref({
  username: '',
  // phone: '',
  // code: '',
  password: '',
  confirmPassword: ''
})

// 加载状态
const loading = ref(false)

// 密码显示状态
const showPassword = ref(false);
const showConfirmPassword = ref(false);

// 切换密码显示状态
const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// 切换确认密码显示状态
const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// 密码匹配验证
const passwordsMatch = computed(() => {
  return registerForm.value.password === registerForm.value.confirmPassword;
});

// 密码强度计算
const passwordStrength = computed(() => {
  const password = registerForm.value.password;
  if (!password) return 0;
  
  let strength = 0;
  
  // 长度检查
  if (password.length >= 6) strength += 1;
  if (password.length >= 8) strength += 1;
  
  // 包含数字
  if (/\d/.test(password)) strength += 1;
  
  // 包含字母
  if (/[a-zA-Z]/.test(password)) strength += 1;
  
  // 包含特殊字符
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
  
  return Math.min(strength, 4);
});

// 密码强度文本
const passwordStrengthText = computed(() => {
  const strength = passwordStrength.value;
  const texts = [
    { text: '很弱', color: 'text-red-500' },
    { text: '弱', color: 'text-orange-500' },
    { text: '中等', color: 'text-yellow-500' },
    { text: '强', color: 'text-green-500' },
    { text: '很强', color: 'text-green-600' }
  ];
  return texts[strength] || texts[0];
});

// 是否可以提交表单
const canSubmit = computed(() => {
  return registerForm.value.username && 
         registerForm.value.password && 
         registerForm.value.confirmPassword && 
         passwordsMatch.value && 
         registerForm.value.password.length >= 6;
});

// 跳转到登录页
const goToLogin = () => {
  router.push('/login');
}

// 注册处理
const handleRegister = async () => {
  // 验证密码是否匹配
  if (!passwordsMatch.value) {
    useToast().error('两次输入的密码不一致，请重新输入')
    return
  }

  // 验证密码长度
  if (registerForm.value.password.length < 6) {
    useToast().error('密码长度至少6位')
    return
  }

  loading.value = true
  registerForm.value.invite = localStorage.getItem('invite')
  
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

/* 密码强度指示器动画 */
.password-strength-bar {
  transition: all 0.3s ease;
}

/* 表单验证样式 */
.form-error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-success {
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}
</style>