<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <div class="max-w-md mx-auto w-full p-4">
      <!-- 头部 -->
      <div class="flex items-center bg-white   shadow px-3 py-3 mb-4 fixed top-0 left-0 right-0 z-20 max-w-md mx-auto w-full">
        <router-link to="/personal/index" class="text-gray-500 text-lg mr-2">
          <font-awesome-icon :icon="'user'" />
        </router-link>
        <div class="flex-1 text-center text-lg font-bold text-gray-800">提现管理</div>
      </div>
      <!-- 提现申请卡片 -->
      <div class="bg-white rounded-xl shadow mb-4 mt-12">
        <div class="flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer select-none" @click="showForm = !showForm">
          <font-awesome-icon :icon="'credit-card'" class="text-orange-500 mr-2" />
          <span class="font-bold">提现申请</span>
          <font-awesome-icon :icon="showForm ? 'chevron-up' : 'chevron-down'" class="ml-auto text-gray-400 transition-transform" />
        </div>
        <div v-show="showForm" class="px-4 py-4">
          <div class="mb-4">
            <label class="block text-sm mb-1">提现金额</label>
            <div class="relative">
              <font-awesome-icon :icon="'yen-sign'" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="number" class="w-full pl-8 pr-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-orange-400 text-base" placeholder="请输入提现金额" />
            </div>
            <p class="text-xs text-gray-400 mt-1">当前可提现余额: 10,000.00元</p>
          </div>
          <div class="mb-4">
            <label class="block text-sm mb-1">收款账户</label>
            <select class="w-full border border-gray-200 rounded py-2 px-3 text-base">
              <option value="alipay">支付宝 (****4567)</option>
              <option value="wechat">微信支付 (****8901)</option>
              <option value="bank">银行卡 (****2345)</option>
            </select>
          </div>
          <div class="mb-4">
            <label class="block text-sm mb-1">支付密码</label>
            <input type="password" class="w-full border border-gray-200 rounded py-2 px-3 text-base" placeholder="请输入支付密码" />
          </div>
          <button class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded mt-2 flex items-center justify-center">
            <font-awesome-icon :icon="'paper-plane'" class="mr-2" />提交提现申请
          </button>
          <button class="w-full bg-gray-100 text-gray-700 border border-gray-200 font-bold py-2 rounded mt-3 flex items-center justify-center">
            <font-awesome-icon :icon="'plus'" class="mr-2" />添加新收款账户
          </button>
        </div>
      </div>
      <!-- 提现记录卡片 -->
      <div class="bg-white rounded-xl shadow mb-4">
        <div class="flex items-center px-4 py-3 border-b border-gray-100">
          <font-awesome-icon :icon="'history'" class="text-blue-500 mr-2" />
          <span class="font-bold">提现记录</span>
        </div>
        <div class="px-4 py-4">
          <!-- 搜索和日期选择 -->
          <div class="flex items-center bg-gray-50 rounded px-2 py-1 mb-2">
            <font-awesome-icon :icon="'search'" class="text-gray-400 mr-1" />
            <input type="text" placeholder="搜索提现单号" class="flex-1 bg-transparent border-0 outline-none text-sm px-1" />
            <el-select v-model="searchStatus" placeholder="全部状态" size="small" class="ml-2 w-28">
              <el-option label="全部" value="all" />
              <el-option label="处理中" value="pending" />
              <el-option label="已完成" value="success" />
              <el-option label="已失败" value="failed" />
            </el-select>
            <el-button type="primary" @click="handleQuery" size="small">重置</el-button>
          </div>
          <div class="flex items-center mb-3">
            <input type="date" class="flex-1 border border-gray-200 rounded px-2 py-1 text-sm" />
            <span class="mx-2 text-gray-400">至</span>
            <input type="date" class="flex-1 border border-gray-200 rounded px-2 py-1 text-sm" />
          </div>
          <!-- 提现记录列表 -->
          <div class="divide-y divide-gray-100">
            <div class="py-3 flex justify-between items-center" v-for="item in 10" :key="item">
              <div>
                <div class="text-orange-500 font-bold text-base">+500.00元</div>
                <div class="text-xs text-gray-400 mt-1">支付宝 (****4567)</div>
              </div>
              <div class="flex flex-col items-end">
                <span class="bg-green-100 text-green-600 text-xs rounded px-2 py-0.5 mb-1">已完成</span>
                <span class="text-xs text-gray-400">2025-07-22 14:30</span>
              </div>
            </div>
          
             
          
          </div>
          <!-- 加载更多按钮 -->
          <button class="w-full bg-gray-100 text-gray-700 border border-gray-200 font-bold py-2 rounded mt-3 flex items-center justify-center">
            <font-awesome-icon :icon="'sync'" class="mr-2" />加载更多
          </button>
        </div>
      </div>
      <div class="h-10"></div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faCreditCard, faChevronDown, faChevronUp, faYenSign, faPaperPlane, faPlus, faHistory, faSearch, faSync } from '@fortawesome/free-solid-svg-icons';
library.add(faUser, faCreditCard, faChevronDown, faChevronUp, faYenSign, faPaperPlane, faPlus, faHistory, faSearch, faSync);
const showForm = ref(false);
function handleQuery() {
  // 重置搜索逻辑
}
</script>