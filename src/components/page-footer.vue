<template>
  <div class="fixed-footer bg-white border-t border-gray-200 py-2 px-4 shadow-lg section-highlight cursor-pointer" data-section="bottom-nav">
    <div class="flex justify-around">
      <div
        @click="handleNavClick('/', 1)"
        class="flex flex-col items-center"
        :class="active === 1 ? 'text-primary font-bold' : 'text-gray-500'"
      >
        <font-awesome-icon :icon="'home'" class="text-2xl mb-1" />
        <span class="text-xs mt-1 text-bold">首页</span>
      </div>
      <div
        @click="handleNavClick('/category', 2)"
        class="flex flex-col items-center"
        :class="active === 2 ? 'text-primary font-bold' : 'text-gray-500'"
      >
        <font-awesome-icon :icon="'th-large'" class="text-2xl mb-1" />
        <span class="text-xs mt-1 text-bold">分类</span>
      </div>
      <div
        @click="handleNavClick('/personal/index', 3)"
        class="flex flex-col items-center"
        :class="active === 3 ? 'text-primary font-bold' : 'text-gray-500'"
      >
        <font-awesome-icon :icon="'user'" class="text-2xl mb-1" />
        <span class="text-xs mt-1 text-bold">我的</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faThLarge, faUser } from '@fortawesome/free-solid-svg-icons';
import { useRoute, useRouter } from 'vue-router';

library.add(faHome, faThLarge, faUser);

const props = defineProps({
  active: {
    type: Number,
    default: 1
  }
});

const route = useRoute();
const router = useRouter();
  
const active = ref(props.active); // 1: 首页, 2: 分类, 3: 我的

// 根据当前路由路径设置active值
const setActiveByRoute = () => {
  const path = route.path;
  if (path === '/') {
    active.value = 1;
  } else if (path === '/category') {
    active.value = 2;
  } else if (path.startsWith('/personal')) {
    active.value = 3;
  }
};

// 处理导航点击
const handleNavClick = (path, activeValue) => {
  active.value = activeValue;
  router.push(path);
};

// 监听路由变化
watch(() => route.path, () => {
  setActiveByRoute();
}, { immediate: true });

// 组件挂载时设置初始active状态
onMounted(() => {
  setActiveByRoute();
});
</script>

<style scoped>
.fixed-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 100;
  /* 你可以继续添加其它样式 */
}
.activeClass{
  color: #000;
  font-weight: bold;
  font-size: 14px;
  

}
/* 尾部组件样式（如需局部样式可在此添加） */
</style>