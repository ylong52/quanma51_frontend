<template>
  <div class="w-full max-w-md mx-auto bg-white min-h-screen flex flex-col">
    <div class="container bg-white rounded-lg shadow mt-2 mb-16">
      <!-- 头部 -->
      <div class="flex items-center px-4 py-3 border-b border-gray-100">
        <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-2">
          <font-awesome-icon :icon="'video'" class="text-lg text-primary" />
        </div>
        <div class="font-bold text-base text-gray-800">腾讯视频 淘宝闲鱼</div>
        <div class="ml-auto text-xs text-orange-500">剩余支付时间 00:03:12</div>
      </div>
      <!-- 信息项 -->
      <div class="flex justify-between px-4 py-3 border-b border-gray-100 text-sm text-gray-700">
        <span class="text-gray-400">商品名称</span>
        <span>【自动充值】腾讯视频会员7天 | 淘宝闲鱼专用</span>
      </div>
      <div class="flex justify-between px-4 py-3 border-b border-gray-100 text-sm text-gray-700">
        <span class="text-gray-400">订单编号</span>
        <span>Z0723296719763596378112</span>
      </div>
      <div class="flex justify-between px-4 py-3 border-b border-gray-100 text-sm text-gray-700">
        <span class="text-gray-400">购买数量</span>
        <span>x1</span>
      </div>
      <div class="flex justify-between px-4 py-3 border-b border-gray-100 text-sm text-gray-700">
        <span class="text-gray-400">QQ号/微信号/手机号</span>
        <span>7795442</span>
      </div>
      <!-- 金额 -->
      <div class="flex justify-between px-4 py-3 border-b border-gray-100 items-center">
        <span class="text-gray-800 text-base">订单金额</span>
        <span class="text-orange-500 text-lg font-bold">¥8.60</span>
      </div>
      <!-- 支付方式 -->
      <div class="flex items-center px-4 py-3 border-b border-gray-100">
        <font-awesome-icon :icon="'wallet'" class="text-lg text-primary mr-2" />
        <span class="text-gray-800 text-sm">余额支付</span>
        <span class="ml-auto text-gray-400 text-sm">余额：0元</span>
      </div>
    </div>
    <!-- 底部支付按钮 -->
    <div class="fixed left-0 right-0 bottom-0 bg-white border-t border-gray-200 z-10 max-w-md mx-auto">
      <a href="#" class="block w-full text-center bg-orange-500 text-white text-base font-bold py-3 rounded-lg mx-auto my-2 shadow active:scale-95 transition-all">立即支付</a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faVideo, faWallet } from '@fortawesome/free-solid-svg-icons';
library.add(faVideo, faWallet);
const route = useRoute();
const goodsId = route.query.id;




</script>

<style scoped>
body {
  background: #f5f5f5;
}
</style>
