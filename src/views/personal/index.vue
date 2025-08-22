<template>
  <div
    class="w-full max-w-md mx-auto bg-gray-100 min-h-screen flex flex-col py-4"
  >
    <div>
      <!-- 头部 -->
      <div class="flex items-center px-4 py-5 border-b border-gray-100">
        <font-awesome-icon
          :icon="['fas', 'user-circle']"
          class="text-4xl text-gray-400"
        />
        <div class="flex flex-col flex-1">
          <div class="text-base font-bold text-gray-800">
            {{ userInfo.username }}
          </div>
        </div>
        <a
          href="#"
          class="ml-auto bg-gray-800 text-white text-xs px-4 py-1 rounded"
          >用户中心</a
        >
      </div>
      <!-- 统计 -->
      <div class="mx-3 mt-4">
        <div class="flex flex-col items-center bg-gradient-to-r from-orange-100 to-orange-200 rounded-xl shadow p-4">
          <font-awesome-icon :icon="'wallet'" class="text-orange-500 text-2xl mb-1" />
          <div class="font-bold text-lg text-gray-800">{{ userInfo.balance || '0.00' }}</div>
          <div class="text-xs text-gray-500 mt-1">账户余额(元)</div>
        </div>
      </div>
      <!-- 我的订单 -->
      <div
        class="flex items-center justify-between px-4 py-3 border-b border-gray-100 mt-4"
      >
        <div class="text-base font-bold text-gray-800">我的订单</div>
        <router-link to="/personal/order" class="text-xs text-gray-400">查看更多&gt;</router-link>
      </div>
      <div class="flex justify-around py-3 border-b border-gray-100">
        <router-link to="/personal/order?status=0" class="flex flex-col items-center text-gray-700">
          <font-awesome-icon
            :icon="'credit-card'"
            class="w-6 h-6 mb-1 text-blue-500"
          />
          <div class="text-xs">待付款</div>
        </router-link>
 
        <router-link to="/personal/order?status=1" class="flex flex-col items-center text-gray-700">
          <font-awesome-icon
            :icon="'check-circle'"
            class="w-6 h-6 mb-1 text-green-500"
          />
          <div class="text-xs">已完成</div>
        </router-link>

        <router-link to="/personal/order?status=refund" class="flex flex-col items-center text-gray-700">
          <font-awesome-icon
            :icon="'undo'"
            class="w-6 h-6 mb-1 text-red-500"
          />
          <div class="text-xs">已退款</div>
        </router-link>
      </div>

      
      <!-- 功能按钮区 -->
      <div class="px-4 py-4">
        <div class="grid grid-cols-2 gap-4">
          <router-link
            to="/personal/rechargelist"
            class="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <font-awesome-icon
              :icon="'money-bill-wave'"
              class="w-8 h-8 mb-2 text-orange-500"
            />
            <div class="text-sm text-gray-700">充值管理</div>
          </router-link>
          <router-link
            to="/personal/userWithdrawal"
            class="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <font-awesome-icon :icon="'wallet'" class="w-8 h-8 mb-2 text-blue-500" />
            <div class="text-sm text-gray-700">提现管理</div>
          </router-link>
          <router-link
            to="/personal/promotion"
            class="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <font-awesome-icon :icon="'bullhorn'" class="w-8 h-8 mb-2 text-green-500" />
            <div class="text-sm text-gray-700">推广管理</div>
          </router-link>
          <router-link
            to="/personal/change-password"
            class="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <font-awesome-icon :icon="'lock'" class="w-8 h-8 mb-2 text-indigo-500" />
            <div class="text-sm text-gray-700">修改密码</div>
          </router-link>
          <router-link
            to="/personal/payment-binding"
            class="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <font-awesome-icon :icon="'credit-card'" class="w-8 h-8 mb-2 text-teal-500" />
            <div class="text-sm text-gray-700">绑定账户</div>
          </router-link>
          <router-link
            to="/"
            class="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <font-awesome-icon :icon="'home'" class="w-8 h-8 mb-2 text-purple-500" />
            <div class="text-sm text-gray-700">回到首页</div>
          </router-link>
          <button
            @click="handleLogout"
            class="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <font-awesome-icon :icon="'sign-out-alt'" class="w-8 h-8 mb-2 text-red-500" />
            <div class="text-sm text-gray-700">退出登录</div>
          </button>
        </div>
      </div>
    </div>
  </div>
  <login :show="showLoginPopup" @close="handleLoginClose" @goToRegister="handleGoToRegister" @goToForgotPassword="handleGoToForgotPassword" />
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import Login from "../login.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { useRouter } from "vue-router";
import {
  faCreditCard,
  faClock,
  faSpinner,
  faCheckCircle,
  faUndo,
  faMoneyBillWave,
  faWallet,
  faBullhorn,
  faHome,
  faSignOutAlt,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
library.add(
  faCreditCard,
  faClock,
  faSpinner,
  faCheckCircle,
  faUndo,
  faMoneyBillWave,
  faWallet,
  faBullhorn,
  faHome,
  faSignOutAlt,
  faLock
);

import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "vue-toast-notification";
library.add(faUserCircle);
import { useUserStore } from "../../store/user";
// import { getUserBalance } from "../../api";
import * as api from '@/api';
const userStore = useUserStore();
const router = useRouter();
console.log(userStore.userInfo);
const toast = useToast();

const handleLogout = () => {
  userStore.logout();
  toast.success('退出成功');
  router.push('/');
};

// 处理前往注册页面
const handleGoToRegister = () => {
  console.log("Navigating to register page");
  // 临时关闭登录窗口
  showLoginPopup.value = false;
  // 导航到注册页面
  router.push('/register');
};

// 处理前往忘记密码页面
const handleGoToForgotPassword = () => {
  console.log("Navigating to forgot password page");
  // 临时关闭登录窗口
  showLoginPopup.value = false;
  // 导航到忘记密码页面
  router.push('/forgot-password');
};

const userInfo = computed(() => {
  // 兼容 userStore.userInfo 可能是ref/computed
  const info =
    userStore.userInfo && userStore.userInfo.value
      ? userStore.userInfo.value
      : userStore.userInfo;
  return info && typeof info === "object" && "isLoggedIn" in info
    ? info
    : { username: "未登录用户", balance: "0.00", isLoggedIn: false };
});

//获取用户余额
const userBalance = async () => {
  try {
    const res = await api.getUserBalance()
    userStore.setBalance(res.balance-0)
    // userInfo.balance 会自动响应式更新
  } catch (error) {
    console.error('获取用户余额失败:', error);
    // 如果获取余额失败，不更新余额
  }
}

const showLoginPopup = ref(false);

// 组件挂载时检查登录状态
onMounted(() => {
  if (!userInfo.value.isLoggedIn) {
    showLoginPopup.value = true;
  } else {
    // 如果用户已登录，获取用户余额
    userBalance();
  }
});

// 处理登录窗口关闭事件
const handleLoginClose = () => {
  // 检查用户是否已登录
  if (!userInfo.value.isLoggedIn) {
    // 如果未登录，继续显示登录窗口
    setTimeout(() => {
      showLoginPopup.value = true;
    }, 300); // 短暂延迟，避免视觉上的闪烁
  } else {
    // 如果已登录，关闭登录窗口
    showLoginPopup.value = false;
  }
};

// 初始检查登录状态
if (userInfo.value.isLoggedIn == false) {
  showLoginPopup.value = true;
}

// 监听登录状态变化
watch(() => userInfo.value.isLoggedIn, (isLoggedIn) => {
  if (!isLoggedIn) {
    // 如果用户登出或登录状态变为未登录，显示登录窗口
    // 检查当前路由，如果不是注册页面才显示登录窗口
    if (router.currentRoute.value.path !== '/register') {
      showLoginPopup.value = true;
    }
  } else {
    // 如果用户登录成功，关闭登录窗口
    showLoginPopup.value = false;
  }
});

// 监听路由变化，当用户从注册页面返回时，如果未登录则显示登录窗口
watch(() => router.currentRoute.value.path, (path) => {
  if (path === '/personal/index' && !userInfo.value.isLoggedIn) {
    showLoginPopup.value = true;
  }
});

// const showLoginPopup = ref(false);

// function handleAvatarClick() {
//   if (!userInfo.value.isLoggedIn) {
//     showLoginPopup.value = true;
//   } else {
//     userStore.logout();
//     toast.success('退出成功');
//   }
// }
</script>