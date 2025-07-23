<template>
  <div class="fixed-footer bg-white border-t border-gray-200 py-2 px-4 shadow-lg section-highlight cursor-pointer" data-section="bottom-nav">
    <div class="flex justify-around">
      <a href="#" class="flex flex-col items-center text-primary">
        <i class="fa fa-home text-xl"></i>
        <span class="text-xs mt-1 text-bold ">首页</span>
      </a>
      <a href="#" class="flex flex-col items-center text-gray-500">
        <i class="fa fa-th-large text-xl"></i>
        <span class="text-xs mt-1 text-bold">分类</span>
      </a>
 
      <a href="#" class="flex flex-col items-center text-gray-500">
        <i class="fa fa-user text-xl"></i>
        <span class="text-xs mt-1 text-bold">我的</span>
      </a>
    </div>
  </div>
</template>

<script setup>
// 尾部组件逻辑可以在这里添加
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
/* 尾部组件样式（如需局部样式可在此添加） */
</style>