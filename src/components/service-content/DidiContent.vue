<template>
  <div>
    <!-- 服务卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <div class="bg-white border border-neutral-200 rounded-lg p-4 card-hover">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-medium text-neutral-700">快车</h3>
          <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">新用户立减10元</span>
        </div>
        <div class="flex items-center space-x-3 mb-2">
          <img src="https://picsum.photos/id/111/60/60" alt="快车" class="w-12 h-12 rounded-md object-cover">
          <div>
            <p class="text-sm text-neutral-500">预计3分钟到达</p>
            <div class="flex items-center mt-1">
              <i class="fa fa-star text-yellow-400 text-xs"></i>
              <span class="text-xs text-neutral-500 ml-1">4.9分</span>
            </div>
          </div>
        </div>
        <button class="w-full py-2 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors" @click="handleBuy(10)">
          购买
        </button>
      </div>
      
      <div class="bg-white border border-neutral-200 rounded-lg p-4 card-hover">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-medium text-neutral-700">专车</h3>
          <span class="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded-full">舒适出行</span>
        </div>
        <div class="flex items-center space-x-3 mb-2">
          <img src="https://picsum.photos/id/112/60/60" alt="专车" class="w-12 h-12 rounded-md object-cover">
          <div>
            <p class="text-sm text-neutral-500">预计5分钟到达</p>
            <div class="flex items-center mt-1">
              <i class="fa fa-star text-yellow-400 text-xs"></i>
              <span class="text-xs text-neutral-500 ml-1">4.9分</span>
            </div>
          </div>
        </div>
        <button class="w-full py-2 bg-neutral-800 text-white rounded-md text-sm font-medium hover:bg-neutral-700 transition-colors">
          购买
        </button>
      </div>
      
      <div class="bg-white border border-neutral-200 rounded-lg p-4 card-hover">
        <div class="flex items-center justify-between mb-3">
          <h3 class="font-medium text-neutral-700">拼车</h3>
          <span class="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full">低至5折</span>
        </div>
        <div class="flex items-center space-x-3 mb-2">
          <img src="https://picsum.photos/id/113/60/60" alt="拼车" class="w-12 h-12 rounded-md object-cover">
          <div>
            <p class="text-sm text-neutral-500">预计7分钟到达</p>
            <div class="flex items-center mt-1">
              <i class="fa fa-star text-yellow-400 text-xs"></i>
              <span class="text-xs text-neutral-500 ml-1">4.7分</span>
            </div>
          </div>
        </div>
        <button class="w-full py-2 bg-green-500 text-white rounded-md text-sm font-medium hover:bg-green-600 transition-colors">
          立即叫车
        </button>
      </div>
    </div>
    
    <!-- 优惠券 -->
    <div class="border-t border-neutral-200 pt-4">
      <h3 class="font-medium text-neutral-700 mb-3">可用优惠券</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg overflow-hidden flex card-hover">
          <div class="flex-1 p-3">
            <p class="text-white font-medium">新用户立减券</p>
            <p class="text-white/80 text-xs mt-1">首次使用滴滴快车立减15元</p>
          </div>
          <div class="bg-white p-3 flex items-center justify-center">
            <span class="text-blue-500 font-bold">立即使用</span>
          </div>
        </div>
        
        <div class="bg-gradient-to-r from-red-500 to-pink-600 rounded-lg overflow-hidden flex card-hover">
          <div class="flex-1 p-3">
            <p class="text-white font-medium">周末优惠券</p>
            <p class="text-white/80 text-xs mt-1">周末出行满20元减8元</p>
          </div>
          <div class="bg-white p-3 flex items-center justify-center">
            <span class="text-red-500 font-bold">立即使用</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()

const handleBuy = (id) => {
  router.push({
    path: '/buyDetail',
    query: { "id": id, "name": "滴滴快车" }
  })
}
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
    