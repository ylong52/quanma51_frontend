<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-2xl mx-auto">
      <h1 class="text-3xl font-bold text-center mb-8">测试页面导航</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- API测试 -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold mb-4 text-blue-600">
            <i class="fas fa-code mr-2"></i>
            API测试
          </h2>
          <p class="text-gray-600 mb-4">
            测试微信确认API调用，验证参数传递是否正确
          </p>
          <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm">
              <i class="fas fa-check text-green-500 mr-2"></i>
              测试API参数传递
            </div>
            <div class="flex items-center text-sm">
              <i class="fas fa-check text-green-500 mr-2"></i>
              验证URL参数格式
            </div>
            <div class="flex items-center text-sm">
              <i class="fas fa-check text-green-500 mr-2"></i>
              检查API响应
            </div>
          </div>
          <router-link 
            to="/personal/apitest"
            class="inline-block w-full bg-blue-500 hover:bg-blue-600 text-white text-center py-3 px-4 rounded-lg transition-colors"
          >
            进入API测试
          </router-link>
        </div>

        <!-- 微信JS-SDK测试 -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold mb-4 text-green-600">
            <i class="fab fa-weixin mr-2"></i>
            微信JS-SDK测试
          </h2>
          <p class="text-gray-600 mb-4">
            测试微信JS-SDK环境，检查转账功能支持情况
          </p>
          <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm">
              <i class="fas fa-check text-green-500 mr-2"></i>
              环境检测
            </div>
            <div class="flex items-center text-sm">
              <i class="fas fa-check text-green-500 mr-2"></i>
              API支持检查
            </div>
            <div class="flex items-center text-sm">
              <i class="fas fa-check text-green-500 mr-2"></i>
              调试日志
            </div>
          </div>
          <router-link 
            to="/weixin-test"
            class="inline-block w-full bg-green-500 hover:bg-green-600 text-white text-center py-3 px-4 rounded-lg transition-colors"
          >
            进入微信测试
          </router-link>
        </div>

        <!-- 用户提现页面 -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold mb-4 text-orange-600">
            <i class="fas fa-money-bill-wave mr-2"></i>
            用户提现
          </h2>
          <p class="text-gray-600 mb-4">
            实际的用户提现功能，包含微信转账确认
          </p>
          <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm">
              <i class="fas fa-check text-green-500 mr-2"></i>
              提现申请
            </div>
            <div class="flex items-center text-sm">
              <i class="fas fa-check text-green-500 mr-2"></i>
              微信转账确认
            </div>
            <div class="flex items-center text-sm">
              <i class="fas fa-check text-green-500 mr-2"></i>
              状态查询
            </div>
          </div>
          <router-link 
            to="/personal/userWithdrawal"
            class="inline-block w-full bg-orange-500 hover:bg-orange-600 text-white text-center py-3 px-4 rounded-lg transition-colors"
          >
            进入提现页面
          </router-link>
        </div>

        <!-- 返回首页 -->
        <div class="bg-white rounded-lg shadow-lg p-6">
          <h2 class="text-xl font-semibold mb-4 text-gray-600">
            <i class="fas fa-home mr-2"></i>
            返回首页
          </h2>
          <p class="text-gray-600 mb-4">
            返回应用主页面
          </p>
          <div class="space-y-2 mb-4">
            <div class="flex items-center text-sm">
              <i class="fas fa-arrow-left text-gray-500 mr-2"></i>
              退出测试模式
            </div>
          </div>
          <router-link 
            to="/"
            class="inline-block w-full bg-gray-500 hover:bg-gray-600 text-white text-center py-3 px-4 rounded-lg transition-colors"
          >
            返回首页
          </router-link>
        </div>
      </div>

      <!-- 状态信息 -->
      <div class="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h3 class="text-lg font-semibold mb-4">当前状态</h3>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="text-center">
            <div class="text-2xl font-bold text-green-600">✅</div>
            <div class="text-sm text-gray-600">API调用</div>
            <div class="text-xs text-green-600">正常</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-blue-600">🔧</div>
            <div class="text-sm text-gray-600">微信JS-SDK</div>
            <div class="text-xs text-blue-600">已配置</div>
          </div>
          <div class="text-center">
            <div class="text-2xl font-bold text-orange-600">📱</div>
            <div class="text-sm text-gray-600">环境检测</div>
            <div class="text-xs text-orange-600">可用</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log('测试页面导航已加载')
})
</script>
