<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <!-- 头部区域 -->
    <header class="bg-white shadow">
      <div class="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
        <router-link to="/" class="flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium transition ml-2">
          <font-awesome-icon :icon="'home'" class="mr-1" />首页
        </router-link>
        <div class="flex items-center">
          <button @click="$router.back()" class="text-gray-700 text-lg mr-2 bg-gray-200 rounded-full p-1">
            <font-awesome-icon :icon="'arrow-left'" class="w-5 h-5" />
          </button>
          <h1 class="text-gray-800 text-lg font-bold tracking-wide">充值余额</h1>
        </div>
      </div>
    </header>
    <!-- 主体内容 -->
    <main class="max-w-md mx-auto px-4 py-4 flex-grow w-full mt-10">
      <!-- 在线充值卡片 -->
      <div class="bg-white rounded-2xl shadow p-6 mb-6 -mt-10 relative z-10">
        <h2 class="text-gray-700 text-base font-bold mb-3 flex items-center">
          <font-awesome-icon :icon="'wallet'" class="mr-2 text-lg text-gray-500" />在线充值
        </h2>
        <!-- 充值金额输入 -->
        <div class="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden mb-2 bg-gray-50">
          <span class="w-10 flex items-center justify-center bg-gray-100 text-gray-500 text-xl font-bold">¥</span>
          <input type="number" placeholder="请输入充值金额" class="flex-grow border-0 px-4 py-4 text-2xl font-bold text-gray-700 bg-transparent outline-none" />
        </div>
        <p class="text-xs text-gray-400 mt-1">手续费 0.00 元</p>
        <!-- 快捷金额推荐 -->
        <div class="bg-gray-100 rounded-xl p-3 mt-4 flex items-center justify-between shadow-sm">
          <div>
            <span class="text-lg text-gray-700 font-bold">10000.00 元</span>
            <span class="ml-2 text-xs text-gray-500 bg-gray-200 rounded px-2 py-0.5">推荐</span>
          </div>
          <span class="text-xs text-gray-500 font-semibold">赠送：88.00 元</span>
        </div>
      </div>
      <!-- 支付方式卡片 -->
      <div class="bg-white rounded-2xl shadow p-5 mt-4 divide-y divide-gray-100">
        <!-- 支付宝转账充值 -->
        <label class="flex items-center py-3 cursor-pointer">
          <input type="radio" name="payType" value="alipay" class="mr-3 accent-gray-500" checked />
          <font-awesome-icon :icon="['fab', 'alipay']" class="w-7 h-7 mr-3 text-blue-500 bg-blue-50 rounded-full p-1 shadow" />
          <span class="text-base font-medium text-gray-700">支付宝转账充值</span>
          <span class="ml-auto px-2 py-0.5 text-xs bg-gray-200 text-gray-600 rounded shadow">快捷0手续费</span>
        </label>
      </div>
      <!-- 立即充值按钮 -->
      <button class="w-full bg-gray-700 hover:bg-gray-800 text-white text-lg font-bold py-3 rounded-2xl mt-8 shadow tracking-wider active:scale-95 transition-all">立即充值</button>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowLeft, faWallet, faHome } from '@fortawesome/free-solid-svg-icons';
import { faAlipay } from '@fortawesome/free-brands-svg-icons';
library.add(faArrowLeft, faWallet, faAlipay, faHome);
</script>

<style scoped>
body {
  background: #f7f8fa;
}
</style>
