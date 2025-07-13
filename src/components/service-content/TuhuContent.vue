<template>
  <div>
    <!-- 服务项目 -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="bg-white border border-neutral-200 rounded-lg p-4 card-hover">
        <div class="flex items-center space-x-3 mb-3">
          <div class="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <i class="fa fa-car text-blue-500 text-xl"></i>
          </div>
          <div>
            <h3 class="font-medium text-neutral-700">标准洗车</h3>
            <p class="text-sm text-neutral-500">外部清洗 + 内饰吸尘</p>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <span class="text-primary font-bold">¥39</span>
            <span class="text-neutral-400 text-sm line-through ml-1">¥59</span>
          </div>
          <button class="px-3 py-1 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            立即预约
          </button>
        </div>
      </div>
      
      <div class="bg-white border border-neutral-200 rounded-lg p-4 card-hover">
        <div class="flex items-center space-x-3 mb-3">
          <div class="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <i class="fa fa-tint text-green-500 text-xl"></i>
          </div>
          <div>
            <h3 class="font-medium text-neutral-700">精洗套餐</h3>
            <p class="text-sm text-neutral-500">全车深度清洁 + 内饰护理</p>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <span class="text-primary font-bold">¥129</span>
            <span class="text-neutral-400 text-sm line-through ml-1">¥169</span>
          </div>
          <button class="px-3 py-1 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            立即预约
          </button>
        </div>
      </div>
      
      <div class="bg-white border border-neutral-200 rounded-lg p-4 card-hover">
        <div class="flex items-center space-x-3 mb-3">
          <div class="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <i class="fa fa-shield text-purple-500 text-xl"></i>
          </div>
          <div>
            <h3 class="font-medium text-neutral-700">漆面镀膜</h3>
            <p class="text-sm text-neutral-500">车漆保护 + 提亮光泽</p>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <span class="text-primary font-bold">¥299</span>
            <span class="text-neutral-400 text-sm line-through ml-1">¥399</span>
          </div>
          <button class="px-3 py-1 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            立即预约
          </button>
        </div>
      </div>
      
      <div class="bg-white border border-neutral-200 rounded-lg p-4 card-hover">
        <div class="flex items-center space-x-3 mb-3">
          <div class="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
            <i class="fa fa-cog text-orange-500 text-xl"></i>
          </div>
          <div>
            <h3 class="font-medium text-neutral-700">内饰深度清洁</h3>
            <p class="text-sm text-neutral-500">座椅/顶棚/地板全面清洁</p>
          </div>
        </div>
        <div class="flex items-center justify-between">
          <div>
            <span class="text-primary font-bold">¥199</span>
            <span class="text-neutral-400 text-sm line-through ml-1">¥249</span>
          </div>
          <button class="px-3 py-1 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            立即预约
          </button>
        </div>
      </div>
    </div>
    
    <!-- 优惠券 -->
    <div class="border-t border-neutral-200 pt-4">
      <h3 class="font-medium text-neutral-700 mb-3">优惠券</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div class="bg-white border border-dashed border-red-500 rounded-lg p-3 flex items-center card-hover">
          <div class="flex-1">
            <p class="text-red-500 font-bold">满减券</p>
            <p class="text-sm text-neutral-500">满100减30</p>
          </div>
          <button class="px-2 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition-colors">
            领取
          </button>
        </div>
        
        <div class="bg-white border border-dashed border-blue-500 rounded-lg p-3 flex items-center card-hover">
          <div class="flex-1">
            <p class="text-blue-500 font-bold">新用户券</p>
            <p class="text-sm text-neutral-500">首单立减20元</p>
          </div>
          <button class="px-2 py-1 bg-blue-500 text-white rounded text-xs font-medium hover:bg-blue-600 transition-colors">
            领取
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 这里可以添加途虎洗车服务的相关逻辑
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
    