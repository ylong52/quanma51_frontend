<template>
  <div class="w-full max-w-md mx-auto bg-white min-h-screen flex flex-col">
    <!-- 顶部图片及角标 -->
    <div class="relative">
      <img :src="goodsDetail.cover" alt="商品图" class="w-full object-cover" />
      <div class="absolute top-2 right-2">
        <font-awesome-icon :icon="'bolt'" class="text-yellow-400 text-3xl" />
      </div>
      <span class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">{{goodsDetail.accountName}}</span>
    </div>
    <!-- 标题 -->
    <h2 class="text-lg font-bold px-4 mt-3">{{goodsDetail.name}}</h2>
    <!-- 价格 -->
    <div class="text-red-500 text-xl font-bold px-4 mt-2">¥{{goodsDetail.salePrice}}</div>
    <!-- 描述 -->
    <div class="text-sm text-gray-500 px-4 mt-1 mb-2">{{goodsDetail.type}}  {{goodsDetail.name}} </div>
    <!-- 信息项 -->
    <div class="flex flex-wrap border-y border-gray-100 px-4 py-2 text-xs text-gray-400">    
      <div class="w-1/2 mb-1">商品编号: {{goodsDetail.id}}</div>
      <div class="w-1/2 mb-1">库存: {{goodsDetail.count}}</div>
    </div>
   
    <!-- 产品介绍 -->
    <div class="text-center text-red-500 text-sm border-b border-gray-100 px-4 py-2">产品介绍</div>
    <div class="flex-1 p-4">
      <div v-if="goodsDetail.desc" v-html="goodsDetail.desc"></div>
      <el-empty v-else description="暂无商品描述" :image-size="100"></el-empty>
    </div>
    <!-- 底部 -->
    <div class="fixed left-0 right-0 bottom-0 bg-white border-t border-gray-200 flex items-center z-10 max-w-md mx-auto">
      <div 
        @click="navigateTo('/', 1)" 
        class="flex-1 flex flex-col items-center py-2 cursor-pointer"
        :class="active === 1 ? 'text-primary font-bold' : 'text-gray-400'"
      >
        <font-awesome-icon :icon="'home'" class="text-lg mb-1" />
        <span class="text-xs">首页</span>
      </div>
       
      <div 
        @click="toggleOrderPopup" 
        class="flex-1 flex flex-col items-center py-2 cursor-pointer text-gray-400"
      >
        <font-awesome-icon :icon="'list'" class="text-lg mb-1" />
        <span class="text-xs">订单</span>
      </div>
      <div 
        @click="toggleBuyDetailPopup" 
        class="flex-[2] text-center bg-orange-500 text-white text-base font-bold py-3 rounded-lg mx-2 my-2 shadow active:scale-95 transition-all cursor-pointer"
      >
        立即购买
      </div>
    </div>
    
    <!-- 订单弹出窗口 -->
    <Teleport to="body">
      <div v-if="showOrderPopup" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- 遮罩层 -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click.self="toggleOrderPopup"></div>
        <!-- 订单卡片 -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden animate-fadeInUp" style="max-height: 85vh;">
          <!-- 关闭按钮 -->
          <button class="absolute top-3 right-3 text-gray-400 hover:text-primary text-xl z-10" @click="toggleOrderPopup">
            &times;
          </button>
          <!-- 订单组件 -->
          <div class="h-full overflow-auto">
            <OrderComponent />
          </div>
        </div>
      </div>
    </Teleport>
    
    <!-- 购买详情弹出窗口 -->
    <Teleport to="body">
      <div v-if="showBuyDetailPopup" class="fixed inset-0 z-50 flex items-center justify-center">
        <!-- 遮罩层 -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" @click.self="toggleBuyDetailPopup"></div>
        <!-- 购买详情卡片 -->
        <div class="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden animate-fadeInUp" style="max-height: 85vh;">
          <!-- 关闭按钮 -->
          <button class="absolute top-3 right-3 text-gray-400 hover:text-primary text-xl z-10" @click="toggleBuyDetailPopup">
            &times;
          </button>
          <!-- 购买详情组件 -->
          <div class="h-full overflow-auto">
            <BuyDetailComponent :goods-id="goodsId" />
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faList, faBolt, faTimes, faThLarge } from '@fortawesome/free-solid-svg-icons';
import { ElEmpty } from 'element-plus';
import OrderComponent from '@/components/account/order.vue';
import BuyDetailComponent from '@/views/buyDetail.vue';
import * as api from '@/api';

library.add(faHome, faList, faBolt, faTimes, faThLarge);

const route = useRoute();
const router = useRouter();
const goodsId = route.query.id;
const goodsDetail = ref({});
const showOrderPopup = ref(false);
const showBuyDetailPopup = ref(false);
const active = ref(0); // 当前激活的导航项

onMounted(() => {
  getProductDetail(goodsId);
});

const getProductDetail = async (goods_id) => {
  const res = await api.getProductDetail(goods_id);
  goodsDetail.value = res.data;
  console.log(res);
}

const toggleOrderPopup = () => {
  showOrderPopup.value = !showOrderPopup.value;
}

const toggleBuyDetailPopup = () => {
  showBuyDetailPopup.value = !showBuyDetailPopup.value;
}

// 导航到指定路由并设置active值
const navigateTo = (path, activeValue) => {
  active.value = activeValue;
  router.push(path);
}
</script>

<style scoped>
body {
  background: #fff;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeInUp {
  animation: fadeInUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-custom {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
