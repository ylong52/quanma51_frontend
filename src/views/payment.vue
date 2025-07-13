<template>
  <div class="font-inter bg-gray-50 text-gray-800 min-h-screen flex flex-col">
    <!-- 顶部导航 -->
       <!-- 顶部导航 -->
       <header class="bg-primary shadow-sm sticky top-0 z-10">
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <i class="fa fa-th-large text-white text-xl"></i>
          <h1 class="text-lg font-semibold text-white drop-shadow">多功能服务平台</h1>
          <!-- 添加返回首页按钮 -->
          <button class="flex items-center gap-2 px-3 py-1 text-sm font-medium text-white border border-white rounded-full hover:bg-white hover:text-primary transition-colors" @click="goToHome">
            <i class="fa fa-home text-sm"></i> 返回首页
          </button>
        </div>
        <div class="flex items-center space-x-4">
          <div class="relative">
            <input type="text" placeholder="搜索服务..." class="pl-9 pr-4 py-2 rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-accent w-48 lg:w-64 placeholder:text-neutral-400" style="color:#222;" />
            <i class="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-accent"></i>
          </div>
          <div class="flex items-center space-x-3">
            <button class="text-white hover:text-accent transition-colors">
              <i class="fa fa-bell-o text-lg"></i>
            </button>
            <div class="flex items-center space-x-2" style="cursor:pointer;">
              <template v-if="isLogin">
              <img src="https://picsum.photos/id/64/40/40" alt="用户头像" class="w-10 h-10 rounded-full object-cover">
              <span class="text-sm font-medium text-neutral-700 hidden sm:inline-block">{{ username }}</span>
            </template>
            <template v-else>
             
              <button class="flex items-center gap-2 px-5 py-2 text-base font-semibold text-primary border-2 border-white rounded-full bg-white hover:bg-accent hover:text-white transition-colors shadow-sm" @click="showLoginPopup = true">
                <font-awesome-icon icon="sign-in-alt" class="text-lg" /> 登录
              </button>
              <button class="flex items-center gap-2 px-5 py-2 text-base font-semibold  text-black bg-accent bg-blue-500 rounded-full border-2 border-white hover:bg-white hover:text-accent transition-colors shadow-sm"  @click="showAgreementPopup = true">

                <font-awesome-icon icon="user-plus" class="text-lg" /> 注册
              </button> 
            </template>
            </div>
            <AgreementPopup v-if="showAgreementPopup" @close="(agree) => handleAgreementClose(agree)" />

            <Login :show="showLoginPopup" @close="onLoginClose" />
          </div>
        </div>
      </div>
    </header>

    <!-- 主内容区 -->
    <main class="flex-grow container mx-auto px-6 py-10">
      <!-- 面包屑导航 -->
      <div class="flex items-center text-sm text-gray-500 mb-8">
        <router-link to="/" class="hover:text-primary transition-custom">首页</router-link>
        <span class="mx-2">/</span>
        <router-link to="/buyDetail" class="hover:text-primary transition-custom">我要买券</router-link>
        <span class="mx-2">/</span>
        <span class="text-gray-700">支付</span>
      </div>
      <!-- 支付区域 -->
      <div class="payment-container">
        <!-- 订单摘要 -->
        <div class="payment-summary space-y-6">
          <!-- 温馨提示 -->
          <div class="bg-yellow-50 border border-yellow-200 text-yellow-700 px-5 py-4 rounded-lg flex items-center">
            <i class="fa fa-info-circle mr-3 text-yellow-600"></i>
            <span>温馨提示：请在24小时内使用，否则系统将自动确认收货</span>
          </div>
          <!-- 产品信息核对 -->
          <div class="apple-card">
            <div class="p-6 border-b border-gray-100">
              <h2 class="text-xl font-semibold text-gray-900">订单摘要</h2>
            </div>
            <div class="p-6">
              <div class="flex items-center bg-gray-50 rounded-lg p-4 mb-5">
                <img :src="order.img" alt="代金券" class="w-32 h-16 object-cover rounded mr-4">
                <div class="flex-1">
                  <div class="font-medium text-gray-800 text-lg">{{ order.title }}</div>
                  <div class="flex justify-between mt-2">
                    <span class="text-sm text-gray-500">数量：x{{ order.count }}</span>
                    <div>
                      <span class="text-sm text-gray-400 line-through">¥{{ order.originPrice }}</span>
                      <span class="ml-3 font-semibold text-gray-900 text-lg">¥{{ order.price }}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="space-y-3 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-600">小计</span>
                  <span>¥{{ order.price }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">优惠</span>
                  <span class="text-green-600">-¥{{ order.discount }}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-600">运费</span>
                  <span>¥0.00</span>
                </div>
                <div class="border-t border-gray-100 mt-4 pt-4 flex justify-between">
                  <span class="font-medium text-lg">实付款</span>
                  <span class="font-bold text-xl text-primary">¥{{ order.price }}</span>
                </div>
              </div>
            </div>
          </div>
          <!-- 支付方式选择 -->
          <div class="apple-card">
            <div class="p-6 border-b border-gray-100">
              <h2 class="text-xl font-semibold text-gray-900">支付方式</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <label class="flex items-center p-4 border-2 border-primary bg-primary/5 rounded-lg cursor-pointer">
                  <input type="radio" name="payType" value="balance" v-model="payType" class="apple-radio">
                  <div class="ml-4 flex-1 flex items-center">
                    <i class="fa fa-wallet text-primary mr-3 text-lg"></i>
                    <span class="font-medium text-lg">余额支付</span>
                  </div>
                  <span class="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">推荐</span>
                </label>
                 
                 
              </div>
            </div>
          </div>
        </div>
        <!-- 支付详情 -->
        <div class="payment-details space-y-6">
          <!-- 支付密码输入 -->
          <div class="apple-card">
            <div class="p-6 border-b border-gray-100">
              <h2 class="text-xl font-semibold text-gray-900">确认并支付</h2>
            </div>
            <div class="p-6">
              <div class="mb-6">
                <label for="payPassword" class="block text-sm font-medium text-gray-700 mb-2">支付密码</label>
                <input type="password" id="payPassword" class="apple-input password-input" v-model="payPassword" maxlength="6" pattern="\d{6}" title="请输入6位数字" @focus="clearPasswordTip">
                <p class="text-red-500 text-sm mt-2" v-if="passwordTip">{{ passwordTip }}</p>
              </div>
               
              <!-- 倒计时提示 -->
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6 text-center">
                <div class="text-sm text-gray-600 mb-2">请在规定时间内完成支付</div>
                <div class="text-lg font-medium text-primary">
                  <i class="fa fa-clock-o mr-2"></i>
                  <span>{{ countdownText }}</span>
                </div>
              </div>
              <!-- 余额信息 -->
              <div class="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-6">
                <div class="flex justify-between mb-2">
                  <span class="text-gray-600">当前账户余额</span>
                  <span class="font-medium">¥{{ balance }}</span>
                </div>
                <div class="text-xs text-gray-500">
                  <i class="fa fa-info-circle mr-1"></i>支付后余额：¥{{ afterPayBalance }}
                </div>
              </div>
              <!-- 操作按钮 -->
              <div class="flex flex-col space-y-4">
                <button class="apple-btn text-lg" :disabled="paying || paySuccess" @click="handlePay">
                  <template v-if="paying">
                    <i class="fa fa-spinner fa-spin mr-2"></i> 支付处理中...
                  </template>
                  <template v-else-if="paySuccess">
                    <i class="fa fa-check mr-2"></i> 支付成功
                  </template>
                  <template v-else>
                    确认并支付 ¥{{ order.price }}
                  </template>
                </button>
                <button class="apple-btn-outline text-lg" :disabled="paying || paySuccess" @click="handleCancel">
                  取消订单
                </button>
              </div>
            </div>
          </div>
          <!-- 安全提示 -->
          <div class="bg-blue-50 border border-blue-200 text-blue-700 px-5 py-4 rounded-lg">
            <div class="flex items-start">
              <i class="fa fa-shield text-blue-600 mt-1 mr-3"></i>
              <div>
                <h3 class="font-medium mb-1">安全支付保障</h3>
                <ul class="text-sm space-y-1">
                  <li class="flex items-center">
                    <i class="fa fa-check-circle text-blue-600 mr-2"></i>
                    <span>采用银行级加密技术保护您的支付信息</span>
                  </li>
                  <li class="flex items-center">
                    <i class="fa fa-check-circle text-blue-600 mr-2"></i>
                    <span>所有交易均经过多重安全验证</span>
                  </li>
                  <li class="flex items-center">
                    <i class="fa fa-check-circle text-blue-600 mr-2"></i>
                    <span>支付完成后会发送短信通知</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
    
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router';

import { useUserStore } from '../store/user';
// 获取用户store和路由
const userStore = useUserStore();
const router = useRouter();

// 登录状态
const isLogin = computed(() => userStore.isLoggedIn);
const username = computed(() => userStore.username);

// 订单数据
const order = ref({
  img: 'https://picsum.photos/id/26/120/60',
  title: '10元代金券・8开头',
  count: 1,
  originPrice: 10.00,
  price: 9.68,
  discount: 0.32
})

const payType = ref('balance')
const payPassword = ref('')
const passwordTip = ref('')
const paying = ref(false)
const paySuccess = ref(false)
const balance = ref(2456.32)
const afterPayBalance = computed(() => (balance.value - order.value.price).toFixed(2))

// 倒计时
const minutes = ref(9)
const seconds = ref(45)
const countdownText = computed(() => `${minutes.value}分${seconds.value < 10 ? '0' : ''}${seconds.value}秒`)
let interval = null

const startCountdown = () => {
  interval = setInterval(() => {
    if (seconds.value === 0) {
      if (minutes.value === 0) {
        clearInterval(interval)
        passwordTip.value = '支付超时，订单已取消'
        paying.value = false
        return
      }
      minutes.value--
      seconds.value = 59
    } else {
      seconds.value--
    }
  }, 1000)
}

onMounted(() => {
  startCountdown()
})
onUnmounted(() => {
  clearInterval(interval)
})

const clearPasswordTip = () => {
  passwordTip.value = ''
}

const handlePay = () => {
  if (paying.value || paySuccess.value) return
  if (!/^\d{6}$/.test(payPassword.value)) {
    passwordTip.value = '请输入正确的6位数字支付密码'
    return
  }
  paying.value = true
  passwordTip.value = ''
  setTimeout(() => {
    paying.value = false
    paySuccess.value = true
    balance.value = afterPayBalance.value
    passwordTip.value = ''
  }, 2000)
}

// 返回首页
const goToHome = () => {
  router.push('/');
};
 
const handleCancel = () => {
  if (paying.value || paySuccess.value) return
  if (confirm('确定要取消订单吗？')) {
    clearInterval(interval)
    router.push('/')
  }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap');

.payment-container {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}
.payment-summary {
  grid-column: 1;
}
.payment-details {
  grid-column: 2;
}
@media (max-width: 768px) {
  .payment-container {
    grid-template-columns: 1fr;
  }
  .payment-summary, .payment-details {
    grid-column: 1;
  }
}
.apple-card {
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}
.apple-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
.password-input {
  width: 160px;
  letter-spacing: 12px;
  text-align: center;
  font-size: 1.25rem;
}
.apple-btn {
  background-color: var(--color-primary, #0071e3);
  color: #fff;
  border-radius: 9999px;
  font-weight: 500;
  padding: 0.75rem 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.apple-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.apple-btn-outline {
  border: 1px solid #d1d5db;
  color: #374151;
  border-radius: 9999px;
  font-weight: 500;
  padding: 0.75rem 2rem;
  background: #fff;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.apple-btn-outline:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.apple-input {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  font-size: 1.125rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.apple-input:focus {
  outline: none;
  border-color: var(--color-primary, #0071e3);
  box-shadow: 0 0 0 2px rgba(0,113,227,0.15);
}
.apple-radio {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-primary, #0071e3);
}
</style>
