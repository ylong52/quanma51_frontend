<template>
  <div>
    <!-- 附近商家 -->
    <div class="space-y-4 mb-6">
      <div class="bg-white border border-neutral-200 rounded-lg p-4 flex card-hover">
        <img src="https://picsum.photos/id/431/100/100" alt="川味小馆" class="w-20 h-20 object-cover rounded-lg mr-3">
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <h3 class="font-medium text-neutral-700">川味小馆</h3>
            <span class="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full">新店特惠</span>
          </div>
          <div class="flex items-center space-x-1 mt-1">
            <i class="fa fa-star text-yellow-400 text-xs"></i>
            <span class="text-xs text-neutral-500">4.8</span>
            <span class="text-xs text-neutral-400">|</span>
            <span class="text-xs text-neutral-500">月售1286</span>
            <span class="text-xs text-neutral-400">|</span>
            <span class="text-xs text-neutral-500">¥15起送</span>
          </div>
          <div class="flex items-center space-x-2 mt-2">
            <span class="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded">首单减10</span>
            <span class="text-xs bg-blue-100 text-blue-500 px-2 py-0.5 rounded">满30减5</span>
          </div>
          <div class="flex items-center justify-between mt-2">
            <span class="text-xs text-neutral-500">2.5km · 25-35分钟</span>
            <button class="px-3 py-1 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              进店
            </button>
          </div>
        </div>
      </div>
      
      <div class="bg-white border border-neutral-200 rounded-lg p-4 flex card-hover">
        <img src="https://picsum.photos/id/292/100/100" alt="粤式茶餐厅" class="w-20 h-20 object-cover rounded-lg mr-3">
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <h3 class="font-medium text-neutral-700">粤式茶餐厅</h3>
            <span class="text-xs bg-orange-500/10 text-orange-500 px-2 py-1 rounded-full">人气爆款</span>
          </div>
          <div class="flex items-center space-x-1 mt-1">
            <i class="fa fa-star text-yellow-400 text-xs"></i>
            <span class="text-xs text-neutral-500">4.9</span>
            <span class="text-xs text-neutral-400">|</span>
            <span class="text-xs text-neutral-500">月售2154</span>
            <span class="text-xs text-neutral-400">|</span>
            <span class="text-xs text-neutral-500">¥20起送</span>
          </div>
          <div class="flex items-center space-x-2 mt-2">
            <span class="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded">首单减8</span>
            <span class="text-xs bg-blue-100 text-blue-500 px-2 py-0.5 rounded">满50减15</span>
          </div>
          <div class="flex items-center justify-between mt-2">
            <span class="text-xs text-neutral-500">1.8km · 20-30分钟</span>
            <button class="px-3 py-1 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              进店
            </button>
          </div>
        </div>
      </div>
      
      <div class="bg-white border border-neutral-200 rounded-lg p-4 flex card-hover">
        <img src="https://picsum.photos/id/139/100/100" alt="寿司工坊" class="w-20 h-20 object-cover rounded-lg mr-3">
        <div class="flex-1">
          <div class="flex items-center justify-between">
            <h3 class="font-medium text-neutral-700">寿司工坊</h3>
            <span class="text-xs bg-purple-500/10 text-purple-500 px-2 py-1 rounded-full">品质优选</span>
          </div>
          <div class="flex items-center space-x-1 mt-1">
            <i class="fa fa-star text-yellow-400 text-xs"></i>
            <span class="text-xs text-neutral-500">4.7</span>
            <span class="text-xs text-neutral-400">|</span>
            <span class="text-xs text-neutral-500">月售963</span>
            <span class="text-xs text-neutral-400">|</span>
            <span class="text-xs text-neutral-500">¥25起送</span>
          </div>
          <div class="flex items-center space-x-2 mt-2">
            <span class="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded">首单减12</span>
            <span class="text-xs bg-blue-100 text-blue-500 px-2 py-0.5 rounded">满60减20</span>
          </div>
          <div class="flex items-center justify-between mt-2">
            <span class="text-xs text-neutral-500">3.2km · 30-40分钟</span>
            <button class="px-3 py-1 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
              进店
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 热门活动 -->
    <div class="border-t border-neutral-200 pt-4">
      <h3 class="font-medium text-neutral-700 mb-3">热门活动</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg p-4 card-hover">
          <h4 class="text-white font-medium mb-1">深夜食堂</h4>
          <p class="text-white/80 text-sm">22:00-次日6:00，夜宵满30减15</p>
        </div>
        
        <div class="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg p-4 card-hover">
          <h4 class="text-white font-medium mb-1">新店特惠</h4>
          <p class="text-white/80 text-sm">新入驻商家，全场7折起</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 这里可以添加美团外卖服务的相关逻辑
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
    