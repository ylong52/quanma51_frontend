<template>
  <div class="font-inter min-h-screen flex flex-col">
    <Header />
    <!-- 主要内容区 -->
    <main class="flex-1 container mx-auto p-4 flex flex-col md:flex-row gap-4">
      <!-- 左侧菜单 -->
      <SideMenu :activeMenu="activeMenu" @menuChange="handleMenuChange" />
      <!-- 右侧内容 -->
      <div class="flex-1 flex flex-col gap-4 right-component">
        <component :is="rightComponent" />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import SideMenu from '@/components/account/slider.vue';
import Header from '@/components/account/header.vue';
import AccountInfo from '@/components/account/accountinfo.vue';
import Goods from '@/components/account/goods.vue';
import recharge from '@/components/account/recharge.vue';
import promotionFeatures from '@/components/account/promotionFeatures.vue';

import userWithdrawal from '@/components/account/userWithdrawal.vue';

const activeMenu = ref('personalInfo');

const handleMenuChange = (menu) => {
  activeMenu.value = menu;
};

const rightComponent = computed(() => {
  if (activeMenu.value === 'personalInfo') return AccountInfo;
  if (activeMenu.value === 'productList') return Goods;
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
      