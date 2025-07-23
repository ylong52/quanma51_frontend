<template>
  <div class="font-inter min-h-screen flex flex-col">
    <Header />
    <!-- 主要内容区 -->
    <main class="flex-1 container mx-auto p-4 flex flex-col md:flex-row gap-4">
      <!-- 左侧菜单 -->
      <SideMenu :activeMenu="activeMenu" @menuChange="handleMenuChange" />
      <!-- 右侧内容 -->
      <div class="flex-1 flex flex-col gap-4 right-component">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SideMenu from '@/components/account/slider.vue';
import Header from '@/components/account/header.vue';
import AccountInfo from '@/components/account/accountinfo.vue';
import recharge from '@/components/account/recharge.vue';
import promotionFeatures from '@/components/account/promotionFeatures.vue';

import userWithdrawal from '@/components/account/userWithdrawal.vue';

const route = useRoute();
const router = useRouter();

const activeMenu = ref('personalInfo');

watch(
  () => route.path,
  (newPath) => {
    
    if (newPath.endsWith('/order')) {
      activeMenu.value = 'productList';
    }else if (newPath.endsWith('/recharge')) {
      activeMenu.value = 'recharge';
    } else if (newPath.endsWith('/userWithdrawal')) {
      activeMenu.value = 'userWithdrawal';
    } else if (newPath.endsWith('/promotionFeatures')) {
      activeMenu.value = 'promotionFeatures';
    } else {
      activeMenu.value = 'personalInfo';
    }
  },
  { immediate: true }
);

const handleMenuChange = (menu) => {
  activeMenu.value = menu;
  if (menu === 'personalInfo') {
    router.push('/account');
  } else if (menu === 'productList') {
    router.push('/account/order');
  } else if (menu === 'recharge') {
    router.push('/account/recharge');
  } else if (menu === 'userWithdrawal') {
    router.push('/account/userWithdrawal');
  } else if (menu === 'promotionFeatures') {
    router.push('/account/promotionFeatures');
  }
  // 其他菜单...
};

const rightComponent = computed(() => {
  if (activeMenu.value === 'personalInfo') return AccountInfo;
  if (activeMenu.value === 'productList') return require('@/components/account/order.vue').default;
  if (activeMenu.value === 'recharge') return recharge;
  if (activeMenu.value === 'userWithdrawal') return userWithdrawal;
  if (activeMenu.value === 'promotionFeatures') return promotionFeatures;
  // 其他菜单可扩展
  return { template: '<div></div>' };
});
</script>

<style scoped>
/* 全局样式可以在这里定义 */
</style>
      