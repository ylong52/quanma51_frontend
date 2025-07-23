<template>
  <div class="w-full max-w-md mx-auto bg-gray-100 min-h-screen flex flex-col py-4">
    <div  >
      <!-- 头部 -->
      <div class="flex items-center px-4 py-5 border-b border-gray-100">
        <img src="https://via.placeholder.com/60" alt="头像" class="w-15 h-15 rounded-full mr-4" />
        <div class="flex flex-col flex-1">
          <div class="text-base font-bold text-gray-800">苏三</div>
          <div class="text-xs text-gray-400 mt-1">黄金会员</div>
        </div>
        <a href="#" class="ml-auto bg-gray-800 text-white text-xs px-4 py-1 rounded">用户中心</a>
      </div>
      <!-- 统计 -->
      <div class="flex justify-around bg-gray-900 text-white py-3 rounded-lg shadow mx-3 mt-4">
        <div class="flex flex-col items-center">
          <div class="font-bold text-sm">0.00</div>
          <div class="text-xs text-gray-300">账户余额(元)</div>
        </div>
        <div class="flex flex-col items-center">
          <div class="font-bold text-sm">0.00</div>
          <div class="text-xs text-gray-300">消费金额(元)</div>
        </div>
         
      </div>
      <!-- 我的订单 -->
      <div class="flex items-center justify-between px-4 py-3 border-b border-gray-100 mt-4">
        <div class="text-base font-bold text-gray-800">我的订单</div>
        <a href="#" class="text-xs text-gray-400">查看更多&gt;</a>
      </div>
      <div class="flex justify-around py-3 border-b border-gray-100">
        <a href="#" class="flex flex-col items-center text-gray-700">
          <font-awesome-icon :icon="'credit-card'" class="w-6 h-6 mb-1 text-blue-500" />
          <div class="text-xs">待付款</div>
        </a>
        <a href="#" class="flex flex-col items-center text-gray-700">
          <font-awesome-icon :icon="'clock'" class="w-6 h-6 mb-1 text-yellow-500" />
          <div class="text-xs">待处理</div>
        </a>
 
        <a href="#" class="flex flex-col items-center text-gray-700">
          <font-awesome-icon :icon="'check-circle'" class="w-6 h-6 mb-1 text-green-500" />
          <div class="text-xs">已完成</div>
        </a>
 
      </div>
      <!-- 功能按钮区 -->
      <div class="flex flex-col px-4 py-4 space-y-3">
        <router-link to="/personal/rechargelist" class="flex items-center rounded-lg px-4 py-3 bg-orange-500 text-white font-medium">
          <font-awesome-icon :icon="'money-bill-wave'" class="w-6 h-6 mr-3" />充值管理
        </router-link>
        <router-link to="/personal/userWithdrawal" class="flex items-center rounded-lg px-4 py-3 bg-blue-500 text-white font-medium">
          <font-awesome-icon :icon="'wallet'" class="w-6 h-6 mr-3" />提现管理
        </router-link>
        <router-link to="/personal/promotion" class="flex items-center rounded-lg px-4 py-3 bg-green-500 text-white font-medium">
          <font-awesome-icon :icon="'bullhorn'" class="w-6 h-6 mr-3" />推广管理
        </router-link>
        <router-link to="/" class="flex items-center rounded-lg px-4 py-3 bg-purple-500 text-white font-medium">
          <font-awesome-icon :icon="'home'" class="w-6 h-6 mr-3" />回到首页
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCreditCard, faClock, faSpinner, faCheckCircle, faUndo, faMoneyBillWave, faWallet, faBullhorn, faHome } from '@fortawesome/free-solid-svg-icons';
library.add(faCreditCard, faClock, faSpinner, faCheckCircle, faUndo, faMoneyBillWave, faWallet, faBullhorn, faHome);

function handleQuery() {
  // 这里写重置逻辑，比如清空搜索框
  // searchKeyword.value = '';
}
</script>