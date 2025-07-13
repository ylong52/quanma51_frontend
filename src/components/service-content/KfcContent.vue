<template>
  <div>
    <!-- 热门套餐 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="bg-white border border-neutral-200 rounded-lg p-4 card-hover">
        <img src="https://picsum.photos/id/292/300/200" alt="吮指原味鸡套餐" class="w-full h-40 object-cover rounded-lg mb-3">
        <h3 class="font-medium text-neutral-700">吮指原味鸡套餐</h3>
        <p class="text-sm text-neutral-500 mb-2">原味鸡2块 + 中份薯条 + 中杯可乐</p>
        <div class="flex items-center justify-between">
          <div>
            <span class="text-primary font-bold">¥39.9</span>
            <span class="text-neutral-400 text-sm line-through ml-1">¥52</span>
          </div>
          <button class="px-3 py-1 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            立即购买
          </button>
        </div>
      </div>
      
      <div class="bg-white border border-neutral-200 rounded-lg p-4 card-hover">
        <img src="https://picsum.photos/id/431/300/200" alt="香辣鸡腿堡套餐" class="w-full h-40 object-cover rounded-lg mb-3">
        <h3 class="font-medium text-neutral-700">香辣鸡腿堡套餐</h3>
        <p class="text-sm text-neutral-500 mb-2">香辣鸡腿堡 + 吮指原味鸡 + 中杯可乐</p>
        <div class="flex items-center justify-between">
          <div>
            <span class="text-primary font-bold">¥45.9</span>
            <span class="text-neutral-400 text-sm line-through ml-1">¥59</span>
          </div>
          <button class="px-3 py-1 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            立即购买
          </button>
        </div>
      </div>
      
      <div class="bg-white border border-neutral-200 rounded-lg p-4 card-hover">
        <img src="https://picsum.photos/id/139/300/200" alt="小食拼盘" class="w-full h-40 object-cover rounded-lg mb-3">
        <h3 class="font-medium text-neutral-700">小食拼盘</h3>
        <p class="text-sm text-neutral-500 mb-2">薯条 + 鸡翅 + 鸡块 + 蛋挞</p>
        <div class="flex items-center justify-between">
          <div>
            <span class="text-primary font-bold">¥35.9</span>
            <span class="text-neutral-400 text-sm line-through ml-1">¥45</span>
          </div>
          <button class="px-3 py-1 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            立即购买
          </button>
        </div>
      </div>
      
      <div class="bg-white border border-neutral-200 rounded-lg p-4 card-hover">
        <img src="https://picsum.photos/id/312/300/200" alt="儿童套餐" class="w-full h-40 object-cover rounded-lg mb-3">
        <h3 class="font-medium text-neutral-700">儿童套餐</h3>
        <p class="text-sm text-neutral-500 mb-2">迷你汉堡 + 小薯条 + 玩具</p>
        <div class="flex items-center justify-between">
          <div>
            <span class="text-primary font-bold">¥29.9</span>
            <span class="text-neutral-400 text-sm line-through ml-1">¥35</span>
          </div>
          <button class="px-3 py-1 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            立即购买
          </button>
        </div>
      </div>
    </div>
    
    <!-- 限时优惠 -->
    <div class="border-t border-neutral-200 pt-4">
      <h3 class="font-medium text-neutral-700 mb-3">限时优惠</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="bg-gradient-to-r from-red-500 to-pink-600 rounded-lg p-4 card-hover">
          <h4 class="text-white font-medium mb-1">周三疯狂拼</h4>
          <p class="text-white/80 text-sm">周三任意两款产品组合，第二件半价</p>
        </div>
        
        <div class="bg-gradient-to-r from-orange-500 to-yellow-600 rounded-lg p-4 card-hover">
          <h4 class="text-white font-medium mb-1">早餐特惠</h4>
          <p class="text-white/80 text-sm">每日6:00-9:30，早餐套餐仅需12元</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 这里可以添加肯德基服务的相关逻辑
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
    