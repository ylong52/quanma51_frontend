<template>
  <div class="font-inter min-h-screen flex flex-col">
    <!-- 顶部导航 -->
    <header class="bg-primary shadow-sm sticky top-0 z-10">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <i class="fa fa-th-large text-white text-xl"></i>
          <h1 class="text-lg font-semibold text-white drop-shadow">多功能服务平台</h1>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input type="text" placeholder="搜索服务..."
              class="pl-9 pr-4 py-2 rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent w-48 lg:w-64 placeholder:text-neutral-400"
              style="color:#222;" />
            <i class="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-accent"></i>
          </div>
          <div class="flex items-center space-x-3">
            <button class="text-white hover:text-accent transition-colors">
              <i class="fa fa-bell-o text-lg"></i>
            </button>
            <div class="flex items-center space-x-2" style="cursor:pointer;">
              <template v-if="isLogin">
                <!-- 使用span包裹用户信息区域 -->
                <span class="relative group flex items-center space-x-2">
                  <img src="https://picsum.photos/id/64/40/40" alt="用户头像" class="w-10 h-10 rounded-full object-cover">
                  <span class="text-sm font-medium text-neutral-700 hidden sm:inline-block">{{ userStore.username
                    }}</span>

                  <!-- 下拉菜单 -->
                  <div
                    class="downupmenu absolute -right-20 mt-32 ml-32 w-48 bg-white rounded-md shadow-lg py-1 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right ">
                    <a href="/account" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">个人中心</a>
                    <button @click="handleLogout"
                      class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">退出</button>
                  </div>
                </span>
              </template>
              <template v-else>
                <button
                  class="flex items-center gap-2 px-5 py-2 text-base font-semibold text-primary border-2 border-white rounded-full bg-white hover:bg-accent hover:text-white transition-colors shadow-sm"
                  @click="showLoginPopup = true">
                  <font-awesome-icon icon="sign-in-alt" class="text-lg" /> 登录
                </button>
                <button
                  class="flex items-center gap-2 px-5 py-2 text-base font-semibold  text-black bg-accent bg-blue-500 rounded-full border-2 border-white hover:bg-white hover:text-accent transition-colors shadow-sm"
                  @click="showAgreementPopup = true">

                  <font-awesome-icon icon="user-plus" class="text-lg" /> 注册
                </button>
              </template>
            </div>
            <AgreementPopup v-if="showAgreementPopup" @close="(agree) => handleAgreementClose(agree)" />

            <Login :show="showLoginPopup" @close="onLoginClose" />
            <Register :show="showRegisterPopup" @close="() => showRegisterPopup = false" @goToLogin="goToLogin" />

          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容区 -->
    <main class="flex-1 container mx-auto p-4 flex flex-col md:flex-row gap-4">
      <!-- 左侧菜单 -->
      <SideMenu :activeMenu="activeMenu" @menuChange="handleMenuChange" />

      <!-- 右侧内容 -->
      <div class="flex-1 flex flex-col gap-4">
        <!-- <ServiceIcons :activeService="activeService" @serviceChange="handleServiceChange" /> -->
        <ProductsCategoryLevel2 />
        <!-- <ServiceContent :activeService="activeService" /> -->
        <productsLists />
      </div>
    </main>

    <!-- 页脚 -->
    <footer class="bg-white border-t border-neutral-200 py-6 mt-6">
      <div class="container mx-auto px-4">
        <div class="flex flex-col md:flex-row justify-between items-center">
          <div class="mb-4 md:mb-0">
            <p class="text-sm text-neutral-500">© 2025 多功能服务平台. 保留所有权利</p>
          </div>
          <div class="flex space-x-6">
            <a href="#" class="text-neutral-500 hover:text-primary transition-colors text-sm">关于我们</a>
            <a href="#" class="text-neutral-500 hover:text-primary transition-colors text-sm">服务条款</a>
            <a href="#" class="text-neutral-500 hover:text-primary transition-colors text-sm">隐私政策</a>
            <a href="#" class="text-neutral-500 hover:text-primary transition-colors text-sm">帮助中心</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import SideMenu from '@/components/SideMenu.vue';
import productsLists from '@/components/products/lists.vue';
import ServiceIcons from '@/components/ServiceIcons.vue';
import ProductsCategoryLevel2 from '@/components/products/ProductsCategoryLevel2.vue';
import ServiceContent from '@/components/ServiceContent.vue';
import AgreementPopup from './AgreementPopup.vue';
import Login from './login.vue';
import Register from '@/views/Register.vue';
import { useToast } from 'vue-toast-notification';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faSignInAlt, faUserPlus } from '@fortawesome/free-solid-svg-icons';
library.add(faSignInAlt, faUserPlus);

import { useUserStore } from '../store/user';
const userStore = useUserStore();

// 状态管理
const activeMenu = ref('hot');
const activeService = ref('didi');
const showLoginPopup = ref(false);

const isLogin = ref(false);
const showRegisterPopup = ref(false);
const showAgreementPopup = ref(false);

// Toast 实例
const toast = useToast();
const showToast = () => {
  toast.open({
    message: '这是一个全局 Toast 通知示例！',
    type: 'success',
    duration: 2500
  });
};

// 事件处理
const handleMenuChange = (menu) => {
  activeMenu.value = menu;
  // 菜单切换时，默认显示第一个服务
  activeService.value = 'didi';
};

const handleServiceChange = (service) => {
  activeService.value = service;
};

// 协议弹窗同意后，弹出登录弹窗
const handleAgreementClose = (agreed) => {
  if (agreed === true) {
    showRegisterPopup.value = true;
  }
};

const onLoginClose = () => {
  showLoginPopup.value = false;
  isLogin.value = true;
};

const goToLogin = () => {
  showLoginPopup.value = true;
}

const handleLogout = () => {
  userStore.logout();
  isLogin.value = false;
}

onMounted(() => {
  if (localStorage.getItem('userInfo')) {
    userStore.login(JSON.parse(localStorage.getItem('userInfo')))
    isLogin.value = true;
  }
  if (sessionStorage.getItem('userInfo')) {
    userStore.login(JSON.parse(sessionStorage.getItem('userInfo')))
    isLogin.value = true;
  }
})
</script>

<style scoped>
/* 全局样式可以在这里定义 */
</style>