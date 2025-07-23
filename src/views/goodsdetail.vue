<template>
  <div class="w-full max-w-md mx-auto bg-white min-h-screen flex flex-col">
    <!-- 顶部图片及角标 -->
    <div class="relative">
      <img src="https://cdn.jsdelivr.net/gh/xiangyuecn/area-selector/area-selector-demo.png" alt="商品图" class="w-full object-cover" />
      <div class="absolute top-2 right-2">
        <font-awesome-icon :icon="'bolt'" class="text-yellow-400 text-3xl" />
      </div>
      <span class="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">填QQ自动到账/不支持TV端</span>
    </div>
    <!-- 标题 -->
    <h2 class="text-lg font-bold px-4 mt-3">腾讯视频VIP会员·月卡</h2>
    <!-- 价格 -->
    <div class="text-red-500 text-xl font-bold px-4 mt-2">¥8.60</div>
    <!-- 描述 -->
    <div class="text-sm text-gray-500 px-4 mt-1 mb-2">自营 【自动充值】腾讯视频会员7天 | 淘宝闲鱼专用</div>
    <!-- 信息项 -->
    <div class="flex flex-wrap border-y border-gray-100 px-4 py-2 text-xs text-gray-400">
      <div class="w-1/2 mb-1">市场价: ¥8.60</div>
      <div class="w-1/2 mb-1">商品编号: 1506</div>
      <div class="w-1/2 mb-1">库存: 99999件</div>
    </div>
    <!-- 倒计时 -->
    <div class="px-4 py-2 text-xs text-gray-400">订单耗时: 11分23秒</div>
    <!-- 产品介绍 -->
    <div class="text-center text-red-500 text-sm border-b border-gray-100 px-4 py-2">产品介绍</div>
    <div class="flex-1"></div>
    <!-- 底部 -->
    <div class="fixed left-0 right-0 bottom-0 bg-white border-t border-gray-200 flex items-center z-10 max-w-md mx-auto">
      <a href="#" class="flex-1 flex flex-col items-center py-2 text-gray-400">
        <font-awesome-icon :icon="'home'" class="text-lg mb-1" />
        <span class="text-xs">首页</span>
      </a>
      <a href="#" class="flex-1 flex flex-col items-center py-2 text-gray-400">
        <font-awesome-icon :icon="'list'" class="text-lg mb-1" />
        <span class="text-xs">订单</span>
      </a>
      <a href="#" class="flex-[2] text-center bg-orange-500 text-white text-base font-bold py-3 rounded-lg mx-2 my-2 shadow active:scale-95 transition-all">立即购买</a>
    </div>
    <page-footer class="mt-20" :active="0" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faHome, faList, faBolt } from '@fortawesome/free-solid-svg-icons';
import PageFooter from '@/components/page-footer.vue';
library.add(faHome, faList, faBolt);
const route = useRoute();
const goodsId = route.query.id;

</script>

<style scoped>
body {
  background: #fff;
}
</style>
