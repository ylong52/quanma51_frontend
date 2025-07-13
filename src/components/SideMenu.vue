<template>
  <aside class="w-full md:w-64 rounded-xl shadow-sm overflow-hidden " style="background-color:var(--color-bg-main);">
    <div class="p-4 border-b border-red-200">
      <h2 class="font-semibold  " style="color:var(--color-text-primary);">服务分类</h2>
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
  { id: 'hot', name: '热门推荐', icon: 'fire' },
  { id: 'mall', name: '商超购物', icon: 'shopping-bag' },
  { id: 'food', name: '美食生鲜', icon: 'cutlery' },
  { id: 'drink', name: '甜品饮品', icon: 'coffee' },
  { id: 'video', name: '影视下载', icon: 'film' },
  { id: 'music', name: '音乐读书', icon: 'music' },
  { id: 'life', name: '生活服务', icon: 'wrench' },
  { id: 'sport', name: '运动出行', icon: 'bicycle' },
  { id: 'phone', name: '话费油卡', icon: 'phone' },
  { id: 'game', name: '游戏点卡', icon: 'gamepad' },
  { id: 'fav', name: '我的收藏', icon: 'heart' }
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
    