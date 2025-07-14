<template>
  <aside class="w-full md:w-64 rounded-xl shadow-sm overflow-hidden " style="background-color:var(--color-bg-main);">
    <div class="p-4 border-b border-red-200">
      <h2 class="font-semibold  " style="color:var(--color-text-primary);">个人中心</h2>
    </div>
    <nav class="py-2">
      <ul>
        <li 
          v-for="menu in menuList" 
          :key="menu.id"
          :class="{ 'menu-active': menu.id === activeMenu }"
          class="py-3 px-4 flex items-center space-x-3 cursor-pointer transition-all"
          @click="onMenuClick(menu.id)"
        >
          <font-awesome-icon :icon="menu.icon" :class="['text-lg', menu.id === activeMenu ? 'text-info' : 'text-primary']" />
          <span :class="menu.id === activeMenu ? 'text-info font-bold' : ''" :style="menu.id !== activeMenu ? 'color:var(--color-text-primary);' : ''">{{ menu.name }}</span>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFire, faShoppingBag, faCutlery, faCoffee, faFilm, faMusic, faWrench, faBicycle, faPhone, faGamepad, faHeart } from '@fortawesome/free-solid-svg-icons';

// 注册需要的图标
library.add(faFire, faShoppingBag, faCutlery, faCoffee, faFilm, faMusic, faWrench, faBicycle, faPhone, faGamepad, faHeart);

const props = defineProps({
  activeMenu: {
    type: String,
    required: true
  }
});



const emits = defineEmits(['menuChange']);

const menuList = [
  { id: 'personalInfo', name: '个人信息', icon: 'fire' },
  { id: 'productList', name: '订单列表', icon: 'shopping-bag' },
  { id: 'recharge', name: '充值列表', icon: 'cutlery' },
  { id: 'userWithdrawal', name: '用户提现', icon: 'coffee' },
  { id: 'promotionFeatures', name: '推广功能', icon: 'film' }
];

const onMenuClick = (menuId) => {
  emits('menuChange', menuId);
};
</script>

<style scoped>
.menu-active {
  background-color: rgba(22, 93, 255, 0.1);
  color: #165DFF;
  border-left: 4px solid #165DFF;
}
</style>
    