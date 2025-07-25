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
        <a href="#" class="flex flex-col items-center text-gray-700">
          <font-awesome-icon
            :icon="'credit-card'"
            class="w-6 h-6 mb-1 text-blue-500"
          />
          <div class="text-xs">待付款</div>
        </a>
        <a href="#" class="flex flex-col items-center text-gray-700">
          <font-awesome-icon
            :icon="'clock'"
            class="w-6 h-6 mb-1 text-yellow-500"
          />
          <div class="text-xs">待处理</div>
        </a>

        <a href="#" class="flex flex-col items-center text-gray-700">
          <font-awesome-icon
            :icon="'check-circle'"
            class="w-6 h-6 mb-1 text-green-500"
          />
          <div class="text-xs">已完成</div>
        </a>
      </div>
      <!-- 功能按钮区 -->
      <div class="flex flex-col px-4 py-4 space-y-3">
        <router-link
          to="/personal/rechargelist"
          class="flex items-center rounded-lg px-4 py-3 bg-orange-500 text-white font-medium"
        >
          <font-awesome-icon
            :icon="'money-bill-wave'"
            class="w-6 h-6 mr-3"
          />充值管理
        </router-link>
        <router-link
          to="/personal/userWithdrawal"
          class="flex items-center rounded-lg px-4 py-3 bg-blue-500 text-white font-medium"
        >
          <font-awesome-icon :icon="'wallet'" class="w-6 h-6 mr-3" />提现管理
        </router-link>
        <router-link
          to="/personal/promotion"
          class="flex items-center rounded-lg px-4 py-3 bg-green-500 text-white font-medium"
        >
          <font-awesome-icon :icon="'bullhorn'" class="w-6 h-6 mr-3" />推广管理
        </router-link>
        <router-link
          to="/"
          class="flex items-center rounded-lg px-4 py-3 bg-purple-500 text-white font-medium"
        >
          <font-awesome-icon :icon="'home'" class="w-6 h-6 mr-3" />回到首页
        </router-link>
      </div>
    </div>
  </div>
  <login :show="showLoginPopup" @close="showLoginPopup = false" />
</template>

<script setup>
import { ref, computed } from "vue";
import Login from "@/views/login.vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
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
  faHome
);

import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "vue-toast-notification";
library.add(faUserCircle);
import { useUserStore } from "../../store/user";
import { getUserBalance } from "@/api";
const userStore = useUserStore();
console.log(userStore.userInfo);
const toast = useToast();

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
  const res = await getUserBalance()
  userStore.setBalance(res.balance)
  // userInfo.balance 会自动响应式更新
}
userBalance();

const showLoginPopup = ref(false);
if (userInfo.value.isLoggedIn == false) {
  showLoginPopup.value = true;
}

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