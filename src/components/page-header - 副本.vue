<template>
  <div class="fixed-header w-full max-w-full overflow-x-hidden">
    <!-- 搜索区 -->
    <div class="bg-white p-3 shadow-sm cursor-pointer w-full max-w-full">
      <div class="flex items-center space-x-2 w-full max-w-full overflow-hidden">
        <i class="fa fa-search text-gray-400 pl-3"></i>
        <input type="text" placeholder="请输入商品名称" class="min-w-0 flex-1 w-0 h-10 bg-gray-100 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary/30" />
        <button class="min-w-0 w-auto bg-primary text-white py-2 px-5 rounded-full text-sm font-medium">搜索</button>
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