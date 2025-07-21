<template>
  <div class="font-inter bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- 页面标题 -->
      <div class="mb-8 text-center">
        <h1 class="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-dark mb-2">账户充值</h1>
        <p class="text-gray-500">使用支付宝安全快捷充值</p>
      </div>
      
      <!-- 充值卡片 -->
      <div class="bg-white rounded-xl shadow-card overflow-hidden mb-8">
        <!-- 支付方式头部 -->
        <div class="bg-gradient-blue p-6 text-white">
          <div class="flex items-center">
            <div class="bg-white/20 rounded-full p-2 mr-4">
              <i class="fa fa-credit-card text-xl"></i>
            </div>
            <div>
              <h2 class="text-xl font-semibold">支付宝支付</h2>
              <p class="text-white/80 text-sm">安全、快捷、方便</p>
            </div>
          </div>
        </div>
        
        <!-- 充值内容 -->
        <div class="p-6">
          <!-- 充值金额选择 -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-gray-800 mb-4">选择充值金额</h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              <div 
                class="border-2 rounded-lg p-4 text-center cursor-pointer hover-scale"
                :class="selectedAmount === 50 ? 'border-primary bg-primary/5' : 'border-gray-200'"
                @click="selectAmount(50)"
              >
                <p class="text-lg font-semibold" :class="selectedAmount === 50 ? 'text-primary' : 'text-gray-800'">¥50</p>
                <p class="text-xs text-gray-500 mt-1">小额充值</p>
              </div>
              <div 
                class="border-2 rounded-lg p-4 text-center cursor-pointer hover-scale"
                :class="selectedAmount === 100 ? 'border-primary bg-primary/5' : 'border-gray-200'"
                @click="selectAmount(100)"
              >
                <p class="text-lg font-semibold" :class="selectedAmount === 100 ? 'text-primary' : 'text-gray-800'">¥100</p>
                <p class="text-xs text-gray-500 mt-1">常用金额</p>
              </div>
              <div 
                class="border-2 rounded-lg p-4 text-center cursor-pointer hover-scale"
                :class="selectedAmount === 200 ? 'border-primary bg-primary/5' : 'border-gray-200'"
                @click="selectAmount(200)"
              >
                <p class="text-lg font-semibold" :class="selectedAmount === 200 ? 'text-primary' : 'text-gray-800'">¥200</p>
                <p class="text-xs text-gray-500 mt-1">推荐选择</p>
              </div>
              <div 
                class="border-2 rounded-lg p-4 text-center cursor-pointer hover-scale"
                :class="selectedAmount === 500 ? 'border-primary bg-primary/5' : 'border-gray-200'"
                @click="selectAmount(500)"
              >
                <p class="text-lg font-semibold" :class="selectedAmount === 500 ? 'text-primary' : 'text-gray-800'">¥500</p>
                <p class="text-xs text-gray-500 mt-1">大额优惠</p>
              </div>
              <div 
                class="border-2 rounded-lg p-4 text-center cursor-pointer hover-scale"
                :class="selectedAmount === 1000 ? 'border-primary bg-primary/5' : 'border-gray-200'"
                @click="selectAmount(1000)"
              >
                <p class="text-lg font-semibold" :class="selectedAmount === 1000 ? 'text-primary' : 'text-gray-800'">¥1000</p>
                <p class="text-xs text-gray-500 mt-1">会员专享</p>
              </div>
              <div 
                class="border-2 rounded-lg p-4 text-center cursor-pointer hover-scale"
                :class="selectedAmount === 2000 ? 'border-primary bg-primary/5' : 'border-gray-200'"
                @click="selectAmount(2000)"
              >
                <p class="text-lg font-semibold" :class="selectedAmount === 2000 ? 'text-primary' : 'text-gray-800'">¥2000</p>
                <p class="text-xs text-gray-500 mt-1">企业用户</p>
              </div>
              <div 
                class="col-span-1 sm:col-span-3 md:col-span-2 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover-scale"
                :class="isCustomAmount ? 'border-primary' : 'border-gray-300'"
                @click="setCustomAmount"
              >
                <p class="text-lg font-semibold" :class="isCustomAmount ? 'text-primary' : 'text-gray-800'">自定义金额</p>
                <p class="text-xs text-gray-500 mt-1">输入其他金额</p>
              </div>
            </div>
          </div>
          
          <!-- 自定义金额输入 -->
          <div class="mb-8">
            <div class="relative">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium text-lg">¥</span>
              <input 
                type="number" 
                placeholder="输入充值金额" 
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-xl font-medium" 
                min="0.01" 
                step="0.01"
                v-model="customAmount"
                @input="onCustomAmountInput"
                @focus="setCustomAmount"
              >
            </div>
            <p class="text-xs text-gray-500 mt-2">最低充值金额：0.01元</p>
          </div>
          
          <!-- 支付方式确认 -->
          <div class="mb-8">
            <h3 class="text-lg font-medium text-gray-800 mb-4">选择支付渠道</h3>
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="flex items-center p-4 bg-primary/5 border-l-4 border-primary">
                <div class="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center mr-3">
                  <div class="w-3 h-3 rounded-full bg-primary"></div>
                </div>
                <img src="https://picsum.photos/seed/alipay/40/40" alt="支付宝" class="w-8 h-8 mr-3">
                <span class="font-medium">支付宝</span>
              </div>
            </div>
          </div>
          
          <!-- 订单摘要 -->
          <div class="mb-8 bg-gray-50 rounded-lg p-4">
            <h3 class="text-lg font-medium text-gray-800 mb-3">订单摘要</h3>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">充值金额</span>
                <span class="font-medium">¥{{ paymentAmount.toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">手续费</span>
                <span class="text-success">免费</span>
              </div>
              <div class="flex justify-between pt-3 border-t border-gray-200">
                <span class="font-medium">实付金额</span>
                <span class="text-xl font-bold text-primary">¥{{ paymentAmount.toFixed(2) }}</span>
              </div>
            </div>
          </div>
          
          <!-- 支付按钮 -->
          <div class="text-center">
            <button 
              class="bg-primary hover:bg-primary/90 text-white font-medium py-3 px-8 rounded-lg transition-all-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2"
              :disabled="paymentAmount <= 0"
              @click="handlePayment"
            >
              <i class="fa fa-alipay mr-2"></i>确认并支付
            </button>

            <button 
              class="bg-gray-500 hover:bg-gray-600 text-white font-medium ml-4 py-3 px-8 rounded-lg transition-all-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-gray-500/50 focus:ring-offset-2"
              @click="handleBackToList"
            >
              <i class="fa fa-arrow-left mr-2"></i>返回列表
            </button>

            <p class="text-xs text-gray-500 mt-3">
              <i class="fa fa-lock text-success mr-1"></i>
              支付过程由支付宝安全加密处理，保障您的资金安全
            </p>
          </div>
        </div>
      </div>
      
      <!-- 安全提示 -->
      <div class="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-8">
        <div class="flex">
          <div class="flex-shrink-0">
            <i class="fa fa-info-circle text-blue-500 text-xl"></i>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-blue-800">支付安全提示</h3>
            <div class="mt-2 text-sm text-blue-700 space-y-1">
              <p>• 请确认支付页面网址是否为支付宝官方网址</p>
              <p>• 请勿向他人泄露支付密码或验证码</p>
              <p>• 如遇问题，请立即联系客服</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 常见问题 -->
      <div class="mb-8">
        <h3 class="text-lg font-medium text-gray-800 mb-4">常见问题</h3>
        <div class="space-y-4">
          <FaqItem 
            question="支付成功但账户未到账怎么办？"
            answer="若支付成功但账户余额未更新，可能是由于网络延迟导致。一般情况下，资金会在5分钟内到账。若超过30分钟仍未到账，请联系客服处理。"
          />
          <FaqItem 
            question="如何取消未支付的订单？"
            answer="未支付的订单会在30分钟后自动取消。您也可以在'我的订单'中手动取消未支付的订单。"
          />
          <FaqItem 
            question="充值是否有手续费？"
            answer="目前通过支付宝充值不收取任何手续费，充值金额将全额到账。"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 定义 emit
const emit = defineEmits(['close']);

// 状态管理
const selectedAmount = ref(50); // 默认选中50元
const customAmount = ref('');
const isCustomAmount = ref(false);
const paymentLoading = ref(false);

// 计算属性：当前支付金额
const paymentAmount = computed(() => {
  if (isCustomAmount.value && customAmount.value && parseFloat(customAmount.value) > 0) {
    return parseFloat(customAmount.value);
  }
  return selectedAmount.value || 50; // 确保有默认值
});

// 方法
const selectAmount = (amount) => {
  selectedAmount.value = amount;
  isCustomAmount.value = false;
  customAmount.value = '';
  console.log('选择金额:', amount);
};

const setCustomAmount = () => {
  isCustomAmount.value = true;
  selectedAmount.value = null;
  // 聚焦到输入框
  setTimeout(() => {
    const input = document.querySelector('input[type="number"]');
    if (input) {
      input.focus();
    }
  }, 100);
};

const onCustomAmountInput = () => {
  if (customAmount.value && parseFloat(customAmount.value) > 0) {
    isCustomAmount.value = true;
    selectedAmount.value = null;
  } else {
    // 如果输入框为空或无效值，重置为默认选择
    isCustomAmount.value = false;
    selectedAmount.value = 50;
  }
};

const handlePayment = () => {
  if (paymentAmount.value <= 0) {
    alert('请选择或输入充值金额');
    return;
  }
  
  paymentLoading.value = true;
  
  // 模拟支付流程
  setTimeout(() => {
    paymentLoading.value = false;
    
    // 显示支付结果
    alert(`支付成功：¥${paymentAmount.value.toFixed(2)}`);
    
    // 支付成功后关闭弹窗
    emit('close');
  }, 1500);
};

// 返回列表方法
const handleBackToList = () => {
  emit('close');
};

// 常见问题组件
const FaqItem = {
  props: {
    question: String,
    answer: String
  },
  setup(props) {
    const isExpanded = ref(false);
    
    const toggleExpanded = () => {
      isExpanded.value = !isExpanded.value;
    };
    
    return {
      isExpanded,
      toggleExpanded
    };
  },
  template: `
    <div class="border border-gray-200 rounded-lg overflow-hidden">
      <button class="w-full text-left p-4 flex justify-between items-center focus:outline-none" @click="toggleExpanded">
        <span class="font-medium">{{ question }}</span>
        <i class="fa" :class="isExpanded ? 'fa-chevron-up text-gray-400' : 'fa-chevron-down text-gray-400'"></i>
      </button>
      <div class="px-4 pb-4 text-sm text-gray-600" v-show="isExpanded">
        {{ answer }}
      </div>
    </div>
  `
};

// 页面加载时的初始化
onMounted(() => {
  // 确保默认选中50元
  selectedAmount.value = 50;
  isCustomAmount.value = false;
  customAmount.value = '';
  console.log('充值页面初始化完成，默认金额:', selectedAmount.value);
});
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #303133;
}

.filter-area {
  margin-bottom: 20px;
}

.balance-info {
  margin-bottom: 20px;
}

.balance-value {
  padding: 16px 0;
  font-size: 16px;
}

.stats-area .text {
  color: #606266;
  font-size: 14px;
}

.stats-area .value {
  font-size: 24px;
  font-weight: 600;
  margin-top: 8px;
}

.text-success {
  color: #52c41a;
}

.text-danger {
  color: #ff4d4f;
}

.text-warning {
  color: #faad14;
}

.font-weight-bold {
  font-weight: 600;
}

/* 无数据状态样式 */
.empty-state {
  text-align: center;
  padding: 40px 0;
}

.empty-image {
  width: 200px;
  height: 150px;
  margin-bottom: 20px;
  border-radius: 8px;
}

.empty-text {
  font-size: 16px;
  color: #909399;
  margin-bottom: 20px;
}

/* 支付说明样式 */
.payment-notice {
  color: #909399;
  font-size: 14px;
  line-height: 1.5;
  padding: 8px 0;
}

/* 添加缺失的样式定义 */
.grid-content {
  border-radius: 4px;
  padding: 16px;
  background-color: #f5f7fa;
}

.bg-purple {
  background-color: #f9fafc;
}
</style>