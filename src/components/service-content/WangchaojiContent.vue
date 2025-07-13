<template>
  <div>
    <!-- 推荐饮品 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div class="bg-white border border-neutral-200 rounded-lg p-4 card-hover">
        <img src="https://picsum.photos/id/292/300/200" alt="伯牙绝弦" class="w-full h-40 object-cover rounded-lg mb-3">
        <h3 class="font-medium text-neutral-700">伯牙绝弦</h3>
        <p class="text-sm text-neutral-500 mb-2">雪顶鲜奶茶，茶底为茉莉绿茶</p>
        <div class="flex items-center justify-between">
          <span class="text-primary font-bold">¥18</span>
          <button class="px-3 py-1 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            立即购买
          </button>
        </div>
      </div>
      
      <div class="bg-white border border-neutral-200 rounded-lg p-4 card-hover">
        <img src="https://picsum.photos/id/139/300/200" alt="春日桃桃" class="w-full h-40 object-cover rounded-lg mb-3">
        <h3 class="font-medium text-neutral-700">春日桃桃</h3>
        <p class="text-sm text-neutral-500 mb-2">桃香乌龙茶，顶部有奶油顶</p>
        <div class="flex items-center justify-between">
          <span class="text-primary font-bold">¥20</span>
          <button class="px-3 py-1 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            立即购买
          </button>
        </div>
      </div>
      
      <div class="bg-white border border-neutral-200 rounded-lg p-4 card-hover">
        <img src="https://picsum.photos/id/431/300/200" alt="桂馥兰香" class="w-full h-40 object-cover rounded-lg mb-3">
        <h3 class="font-medium text-neutral-700">桂馥兰香</h3>
        <p class="text-sm text-neutral-500 mb-2">桂花乌龙茶，清爽甘甜</p>
        <div class="flex items-center justify-between">
          <span class="text-primary font-bold">¥16</span>
          <button class="px-3 py-1 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            立即购买
          </button>
        </div>
      </div>
    </div>
    
    <!-- 限时活动 -->
    <div class="border-t border-neutral-200 pt-4">
      <h3 class="font-medium text-neutral-700 mb-3">限时活动</h3>
      <div class="bg-gradient-to-r from-green-500 to-teal-600 rounded-lg p-4 mb-3 card-hover">
        <h4 class="text-white font-medium mb-1">新品上市：夏日青提</h4>
        <p class="text-white/80 text-sm">即日起至7月31日，购买新品享第二杯半价</p>
      </div>
      <div class="bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg p-4 card-hover">
        <h4 class="text-white font-medium mb-1">会员专享</h4>
        <p class="text-white/80 text-sm">会员日（每月8日）全场饮品8折优惠</p>
      </div>
    </div>
  </div>
</template>

<script setup>
// 这里可以添加霸王茶姬服务的相关逻辑
</script>

<style scoped>
.card-hover {
  transition: all 0.3s ease;
}

.card-hover:hover {
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  transform: translateY(-1px);
}
</style>
    