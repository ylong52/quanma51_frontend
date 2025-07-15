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
          
          <img :src="menu.img" alt="" style="width:30px;" />
          <span :class="menu.id === activeMenu ? 'text-info font-bold' : ''" :style="menu.id !== activeMenu ? 'color:var(--color-text-primary);' : ''">{{ menu.category }}</span>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { defineProps, defineEmits, onMounted,ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFire, faShoppingBag, faCutlery, faCoffee, faFilm, faMusic, faWrench, faBicycle, faPhone, faGamepad, faHeart } from '@fortawesome/free-solid-svg-icons';
import * as api from '@/api/index.js';

// 注册需要的图标
library.add(faFire, faShoppingBag, faCutlery, faCoffee, faFilm, faMusic, faWrench, faBicycle, faPhone, faGamepad, faHeart);

const props = defineProps({
  activeMenu: {
    type: String,
    required: true
  }
});



const emits = defineEmits(['menuChange']);

 

const menuList = ref([]);

const onMenuClick = (menuId) => {
  emits('menuChange', menuId);
};

const getProductCategory = async () => {
  const res = await api.getProductCategory();
  menuList.value = res.data;

};

onMounted(async () => {
  await getProductCategory();
});
</script>

<style scoped>
.menu-active {
  background-color: rgba(22, 93, 255, 0.1);
  color: #165DFF;
  border-left: 4px solid #165DFF;
}
</style>
    