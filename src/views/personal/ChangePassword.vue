<template>
  <el-config-provider :locale="zhCn">
    <div class="min-h-screen bg-gray-100 flex flex-col">
      <div class="max-w-md mx-auto w-full p-4">
        <!-- 头部 -->
        <div class="flex items-center bg-white shadow px-3 py-3 mb-4 fixed top-0 left-0 right-0 z-20 max-w-md mx-auto w-full">
          <router-link to="/personal/index" class="text-gray-500 text-lg mr-2">
            <font-awesome-icon :icon="'arrow-left'" />
          </router-link>
          <div class="flex-1 text-center text-lg font-bold text-gray-800">修改密码</div>
        </div>

        <!-- 表单区域 -->
        <div class="bg-white rounded-xl shadow p-5 mt-16">
          <form @submit.prevent="handleChangePassword">
            <div class="mb-4">
              <label for="old-password" class="block text-sm font-medium text-gray-700 mb-1">旧密码</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <font-awesome-icon :icon="'lock'" class="text-gray-400" />
                </div>
                <input 
                  :type="showOldPassword ? 'text' : 'password'" 
                  id="old-password" 
                  v-model="form.oldPassword"
                  class="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom"
                  placeholder="请输入旧密码"
                  required
                >
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" @click="toggleOldPassword">
                  <font-awesome-icon :icon="showOldPassword ? 'eye-slash' : 'eye'" class="text-gray-400" />
                </div>
              </div>
            </div>

            <div class="mb-4">
              <label for="new-password" class="block text-sm font-medium text-gray-700 mb-1">新密码</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <font-awesome-icon :icon="'lock'" class="text-gray-400" />
                </div>
                <input 
                  :type="showNewPassword ? 'text' : 'password'" 
                  id="new-password" 
                  v-model="form.newPassword"
                  class="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom"
                  placeholder="请输入新密码"
                  required
                >
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" @click="toggleNewPassword">
                  <font-awesome-icon :icon="showNewPassword ? 'eye-slash' : 'eye'" class="text-gray-400" />
                </div>
              </div>
            </div>

            <div class="mb-6">
              <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">确认新密码</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <font-awesome-icon :icon="'lock'" class="text-gray-400" />
                </div>
                <input 
                  :type="showConfirmPassword ? 'text' : 'password'" 
                  id="confirm-password" 
                  v-model="form.confirmPassword"
                  class="w-full pl-10 pr-10 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-custom"
                  placeholder="请再次输入新密码"
                  required
                >
                <div class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" @click="toggleConfirmPassword">
                  <font-awesome-icon :icon="showConfirmPassword ? 'eye-slash' : 'eye'" class="text-gray-400" />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              class="w-full bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-3 px-4 rounded-lg transition-custom hover:transform hover:-translate-y-0.5"
              :disabled="loading"
            >
              {{ loading ? '提交中...' : '确认修改' }}
            </button>
          </form>

          <!-- 提示信息 -->
          <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md mt-6">
            <div class="flex items-center">
              <font-awesome-icon :icon="'exclamation-circle'" class="text-yellow-500 mr-2" />
              <div class="text-sm text-gray-700">
                为了保障账户安全，密码必须包含字母和数字，且长度不少于6位。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faLock, faEye, faEyeSlash, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import { changePassword } from '@/api';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { ElConfigProvider } from 'element-plus';

library.add(faArrowLeft, faLock, faEye, faEyeSlash, faExclamationCircle);

const router = useRouter();
const loading = ref(false);

// 表单数据
const form = ref({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 密码显示状态
const showOldPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// 切换密码显示状态
const toggleOldPassword = () => {
  showOldPassword.value = !showOldPassword.value;
};

const toggleNewPassword = () => {
  showNewPassword.value = !showNewPassword.value;
};

const toggleConfirmPassword = () => {
  showConfirmPassword.value = !showConfirmPassword.value;
};

// 修改密码处理
const handleChangePassword = async () => {
  // 表单验证
  if (!form.value.oldPassword) {
    ElMessage.error('请输入原密码');
    return;
  }

  if (!form.value.newPassword) {
    ElMessage.error('请输入新密码');
    return;
  }

  if (form.value.newPassword.length < 6) {
    ElMessage.error('新密码长度不能少于6位');
    return;
  }

  if (!/(?=.*[A-Za-z])(?=.*\d)/.test(form.value.newPassword)) {
    ElMessage.error('新密码必须包含字母和数字');
    return;
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    ElMessage.error('两次输入的密码不一致');
    return;
  }

  loading.value = true;
  try {
    const res = await changePassword({
      old_password: form.value.oldPassword,
      new_password: form.value.newPassword
    });
    
    ElMessage.success('密码修改成功');
    router.push('/personal/index');
  } catch (error) {
    console.error('修改密码失败:', error);
    ElMessage.error(error?.message || '修改密码失败，请稍后再试');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.transition-custom {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style> 