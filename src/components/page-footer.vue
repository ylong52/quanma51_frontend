<template>
  <div class="fixed-footer bg-white border-t border-gray-200 py-2 px-4 shadow-lg section-highlight cursor-pointer" data-section="bottom-nav">
    <div class="flex justify-around">
      <a
        href="#"
        class="flex flex-col items-center"
        :class="active === 1 ? 'text-primary font-bold' : 'text-gray-500'"
        @click.prevent="active  = 1"
      >
        <font-awesome-icon :icon="'home'" class="text-2xl mb-1" />
        <span class="text-xs mt-1 text-bold">首页</span>
      </a>
      <a
        href="#"
        class="flex flex-col items-center"
        :class="active === 2 ? 'text-primary font-bold' : 'text-gray-500'"
        @click.prevent="active = 2"
      >
        <font-awesome-icon :icon="'th-large'" class="text-2xl mb-1" />
        <span class="text-xs mt-1 text-bold">分类</span>
      </a>
      <a
        href="#"
        class="flex flex-col items-center"
        :class="active === 3 ? 'text-primary font-bold' : 'text-gray-500'"
        @click.prevent="active = 3"
      >
        <font-awesome-icon :icon="'user'" class="text-2xl mb-1" />
        <span class="text-xs mt-1 text-bold">我的</span>
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faThLarge, faUser } from '@fortawesome/free-solid-svg-icons';
library.add(faHome, faThLarge, faUser);

const props = defineProps({
  active: {
    type: Number,
    default: 1
  }
});
  
  const active = ref(props.active); // 1: 首页, 2: 分类, 3: 我的
 
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