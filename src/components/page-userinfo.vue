<template>
  <div class="bg-white p-4 rounded-xl shadow-sm relative flex items-center">
    <!-- 头像和用户信息 -->
    <img :src="userAvatar" alt="用户头像" class="user-avatar cursor-pointer" @click="handleAvatarClick" />
    <div class="ml-3 flex-1 min-w-0">
      <div class="font-medium text-neutral-dark truncate">{{ userName }}</div>
      <div class="text-xs text-blue-500 cursor-pointer mt-0.5" @click="handleAvatarClick">{{ userStatus }}</div>
    </div>
    <!-- 余额按钮 -->
    <div class="absolute top-4 right-4">
      <button class="balance-btn">余额: ¥{{ balance }}</button>
    </div>
  </div>
  <!-- 快捷操作区 -->
  <div class="grid grid-cols-4 gap-0 mt-3 bg-white rounded-xl p-2">
    <div class="text-center">
      <div class="quick-icon"><i class="fa fa-credit-card text-primary"></i></div>
      <div class="quick-label">充值</div>
    </div>
    <div class="text-center">
      <div class="quick-icon"><i class="fa fa-exchange text-primary"></i></div>
      <div class="quick-label">提现</div>
    </div>
    <div class="text-center">
      <div class="quick-icon"><i class="fa fa-history text-primary"></i></div>
      <div class="quick-label">订单</div>
    </div>
    <div class="text-center">
      <div class="quick-icon"><i class="fa fa-gift text-primary"></i></div>
      <div class="quick-label">优惠券</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isLoggedIn = ref(false)
const userAvatar = ref('https://picsum.photos/seed/anonymous/100/100')
const userName = ref('未登录用户')
const userStatus = ref('点击头像登录')
const balance = ref('0.00')

function handleAvatarClick() {
  if (!isLoggedIn.value) {
    // 模拟登录
    userAvatar.value = 'https://picsum.photos/seed/user1/100/100'
    userName.value = '测试用户'
    userStatus.value = '会员有效期至: 2025-12-31'
    balance.value = '100.00'
    isLoggedIn.value = true
  } else {
    // 已登录状态点击头像可以跳转到个人中心
    alert('跳转到个人中心')
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