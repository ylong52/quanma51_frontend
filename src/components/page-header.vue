<template>
  <div class="fixed-header">
    
    <!-- 搜索区 -->
    <div class="bg-white p-3 shadow-sm section-highlight cursor-pointer" data-section="search-area">
      <div class="flex items-center space-x-2">
        <i class="fa fa-search text-gray-400 pl-3"></i>
        <input type="text" placeholder="请输入商品名称" class="flex-1 h-10 bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/30">
        <button class="bg-primary text-white py-2 px-5 rounded-full text-sm font-medium">
          搜索
        </button>
      </div>
    </div>
    
  </div>
</template>

<script setup>
// 头部组件逻辑可以在这里添加
</script>

<style scoped>
/* 头部组件样式（如需局部样式可在此添加） */
</style>