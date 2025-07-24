<template>
  <div class="bg-white p-4 rounded-xl shadow-sm relative flex items-center">
    <!-- 头像和用户信息 -->
    <div class="user-avatar cursor-pointer flex items-center justify-center bg-gray-100" @click="handleUserAction">
      <font-awesome-icon :icon="['fas', 'user-circle']" class="text-4xl text-gray-400" />
    </div>
    <div class="ml-3 flex-1 min-w-0">
      <template v-if="userInfo.isLoggedIn">
        <div class="font-medium text-neutral-dark truncate" @click="gotoPersonalCenter">{{ userInfo.username }}</div>
    
        <div class="text-xs text-blue-500 cursor-pointer mt-0.5" @click="logout">退出登录</div>
      </template>
      <template v-else>
        <div class="font-medium text-neutral-dark truncate">请先登录</div>
        <div class="text-xs text-blue-500 cursor-pointer mt-0.5" @click="showLoginPopup = true">点击登录</div>
      </template>
    </div>
    <!-- 余额按钮 -->
    <div class="absolute top-4 right-4">
      <button class="balance-btn" @click="gotoPersonalCenter">余额: {{ userInfo.balance || '0.00' }}</button>
    </div>
  </div>
  <login :show="showLoginPopup" @close="showLoginPopup=false" />
</template>

<script setup>
import { ref, computed } from 'vue'
import Login from '@/views/login.vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { useToast } from 'vue-toast-notification';
library.add(faUserCircle)
import { useUserStore } from '../store/user'
const userStore = useUserStore();
const toast = useToast();
const router = useRouter();

const userInfo = computed(() => {
  // 兼容 userStore.userInfo 可能是ref/computed
  const info = userStore.userInfo && userStore.userInfo.value ? userStore.userInfo.value : userStore.userInfo
  return info && typeof info === 'object' && 'isLoggedIn' in info
    ? info
    : { username: '未登录用户', balance: '0.00', isLoggedIn: false }
})
const showLoginPopup = ref(false);

// 处理头像点击
function handleUserAction() {
  if (!userInfo.value.isLoggedIn) {
    showLoginPopup.value = true;
  } else {
    gotoPersonalCenter();
  }
}

// 退出登录
function logout() {
  userStore.logout();
  toast.success('退出成功');
}

// 前往个人中心
const gotoPersonalCenter = () => {
  if (userInfo.value.isLoggedIn) {
    router.push('/personal/index');
  } else {
    showLoginPopup.value = true;
  }
}
</script>

<style scoped>
.bg-white {
  background: #fff;
}
.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 2px 4px rgba(0,0,0,0.08);
}
.balance-btn {
  background: linear-gradient(90deg, #FF9900 0%, #FF6600 100%);
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 4px 18px;
  font-size: 15px;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(255, 102, 0, 0.15);
  cursor: pointer;
  outline: none;
}
.quick-icon {
  width: 38px;
  height: 38px;
  background: #fff7e6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 18px;
}
.quick-label {
  font-size: 13px;
  color: #b47b00;
  margin-top: 4px;
}
.grid-cols-4 > div {
  padding: 8px 0 4px 0;
}
</style>