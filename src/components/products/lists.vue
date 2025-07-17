<template>
  <div>
    <!-- 附近商家 -->
    <div class="flex flex-wrap justify-end gap-4 mb-6">
      
        <div class="product bg-white border border-neutral-200 rounded-lg p-4 flex card-hover min-w-[280px] flex-1 max-w-[350px]" v-for="item in productList" :key="item.id">
            <img :src="item.imgUrl" :alt="item.name" class="w-20 h-20 object-cover rounded-lg mr-3">
            <div class="flex-1">
            <div class="flex items-center justify-between">
                <h3 class="font-medium text-neutral-700">{{ item.name }}</h3>
                <span class="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full">{{item.tagName}}</span>
            </div>
            <div class="flex items-center space-x-1 mt-1">
                <i class="fa fa-star text-yellow-400 text-xs"></i>
                <span class="text-xs text-neutral-500">商品编号</span>
                <span class="text-xs text-neutral-400">{{ item.id }}</span>
       
            </div>
            <div class="flex flex-wrap gap-2 mt-2">
                <span class="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded whitespace-nowrap">月售:{{ item.number }}</span>
               <span class="text-xs bg-blue-100 text-blue-500 px-2 py-0.5 rounded whitespace-nowrap">{{ item.type }}</span>  
            </div>
            <div class="flex justify-end mt-2">
                <button class="px-3 py-1 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary/90 transition-colors" @click="gotoDetail(item.id)">
                购买
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
import { defineProps, defineEmits, onMounted,ref } from 'vue';
import * as api from '@/api/index.js';
import { useRouter } from 'vue-router';

const router = useRouter();

onMounted(async () => {
  await getProductList();
});

const productList = ref([]);

const getProductList = async () => {
  const res = await api.getProductList();
  productList.value = res.data;
}

const gotoDetail = async(id) => {
  router.push({
    path: '/buyDetail',
    query: {
      id: id
    }
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
    