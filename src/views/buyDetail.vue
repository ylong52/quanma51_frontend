<template>
  <div class="w-full bg-white flex flex-col">
    <div class="container bg-white rounded-lg shadow">
      <!-- 头部 -->
      <div class="flex items-center px-4 py-3 border-b border-gray-100">
        <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-2">
          <font-awesome-icon :icon="'box-open'" class="text-lg text-primary" />
        </div>
        <div class="font-bold text-base text-gray-800">{{ productName }}</div>
         
      </div>
      <!-- 信息项 -->
      <div class="flex justify-between px-4 py-3 border-b border-gray-100 text-sm text-gray-700">
        <span class="text-gray-400">商品名称</span>
        <span>{{ productName }}</span>
      </div>
       
      <div v-if="goodsDetail && goodsDetail.accountName" class="flex justify-between px-4 py-3 border-b border-gray-100 text-sm text-gray-700">
        <span class="text-gray-400">购买数量</span>
        <span class="flex items-center">
            <button 
              @click="decreaseNumber" 
              class="w-8 h-8 rounded-l border border-gray-300 flex items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100"
              :disabled="buyNumber <= (goodsDetail && goodsDetail.min || 1)"
            >
              -
            </button>
            <input 
              type="number" 
              v-model="buyNumber" 
              class="w-12 h-8 text-center border-t border-b border-gray-300 focus:outline-none" 
              :min="goodsDetail && goodsDetail.min || 1" 
              :max="goodsDetail && goodsDetail.max || 999"
              @change="validateBuyNumber"
            />
            <button 
              @click="increaseNumber" 
              class="w-8 h-8 rounded-r border border-gray-300 flex items-center justify-center bg-gray-50 text-gray-500 hover:bg-gray-100"
              :disabled="buyNumber >= (goodsDetail && goodsDetail.max || 999)"
            >
              +
            </button>
          </span>
      </div>
      <div v-if="goodsDetail && goodsDetail.accountRequired !== 0" class="flex justify-between px-4 py-3 border-b border-gray-100 text-sm text-gray-700">
         
        <span class="text-gray-400"> <span v-if="goodsDetail && goodsDetail.accountRequired == 1" style="color: red;">*&nbsp;</span>{{goodsDetail && goodsDetail.accountName}}</span>
     
         <span>
           <input type="text" v-model="contactInfo" :placeholder="goodsDetail && goodsDetail.accountName" 
             class="border border-gray-300 rounded px-2 py-1 text-sm w-40 focus:outline-none focus:ring-1 focus:ring-orange-500"
             :class="{'border-red-500': isSubmitted && goodsDetail && goodsDetail.accountRequired === 1 && !contactInfo}">
           <div v-if="isSubmitted && goodsDetail && goodsDetail.accountRequired === 1 && !contactInfo" class="text-red-500 text-xs mt-1">
             此项为必填项
           </div>
         </span>
       </div>
      <!-- 金额 -->
      <div class="flex justify-between px-4 py-3 border-b border-gray-100 items-center">
        <span class="text-gray-800 text-base">订单金额</span>
        <span class="text-orange-500 text-lg font-bold">¥{{ (productPrice * buyNumber).toFixed(2) }}</span>
      </div>
      <!-- 支付方式 -->
      <div class="flex items-center px-4 py-3 border-b border-gray-100">
        <font-awesome-icon :icon="'wallet'" class="text-lg text-primary mr-2" />
        <span class="text-gray-800 text-sm">余额支付</span>
        <span class="ml-auto text-gray-400 text-sm">余额：{{ (userBalance-0).toFixed(2) }}元</span>
      </div>
      <!-- 下完单后还余多少 -->
      <div class="flex justify-between px-4 py-3 border-b border-gray-100 text-sm text-gray-700">
        <span class="text-gray-400">下完单后还余多少</span>
        <span>¥{{ (userBalance - productPrice * buyNumber).toFixed(2) }}</span>
      </div>

    </div>
    <!-- 底部支付按钮 -->
    <div class="bg-white border-t border-gray-200 z-10 w-full mt-4">
      <div class="flex gap-2 p-2">
        <button 
          @click="navigateToRecharge" 
          class="flex-1 text-center bg-blue-500 text-white text-base font-bold py-3 rounded-lg shadow active:scale-95 transition-all"
        >
          余额充值
        </button>
        <button 
          @click="handlePay" 
          :disabled="isPaying"
          class="flex-1 text-center bg-orange-500 text-white text-base font-bold py-3 rounded-lg shadow active:scale-95 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          <span v-if="isPaying" class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            支付中...
          </span>
          <span v-else>立即支付</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineProps, computed } from 'vue';
import { useUserStore } from '../store/user';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faVideo, faWallet, faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import * as api from '@/api';
import { ElMessage, ElMessageBox } from 'element-plus';
import { useRouter } from 'vue-router';

library.add(faVideo, faWallet, faBoxOpen);
const router = useRouter();

const props = defineProps({
  goodsId: {
    type: [String, Number],
    required: true
  },
  
});

const userStore = useUserStore();
const userBalance = computed(() => userStore.balance);
const productDetails = ref({});
const productName = ref('加载中...');
const productPrice = ref('0.00');
const contactInfo = ref('');
const goodsDetail = ref(null); // 初始化为null而不是空对象
const isSubmitted = ref(false); // 新增：用于控制是否已提交
const buyNumber = ref(1); // 购买数量，默认为1
const isPaying = ref(false); // 新增：用于防抖，防止重复点击

onMounted(() => {
  getProductDetail();
});

const getProductDetail = async () => {
  try {
    const res = await api.getProductDetail(props.goodsId);
    if (res && res.data) {
      productDetails.value = res.data;
      productName.value = res.data.name || '未知商品';
      productPrice.value = res.data.platform_price || '0.00';
      goodsDetail.value = res.data;
      
      // 初始化购买数量为商品最小购买数量
      if (goodsDetail.value && goodsDetail.value.min && goodsDetail.value.min > 1) {
        buyNumber.value = goodsDetail.value.min;
      }
    }
  } catch (error) {
    console.error('获取商品详情失败:', error);
    ElMessage.error('获取商品详情失败');
  }
};

//获取用户余额
const getuserBalance = async () => {
  const res = await api.getUserBalance()
  userStore.setBalance(res.balance)
  // userInfo.balance 会自动响应式更新
}


// 增加购买数量
const increaseNumber = () => {
  const max = goodsDetail.value && goodsDetail.value.max || 999;
  if (buyNumber.value < max) {
    buyNumber.value++;
  }
};

// 减少购买数量
const decreaseNumber = () => {
  const min = goodsDetail.value && goodsDetail.value.min || 1;
  if (buyNumber.value > min) {
    buyNumber.value--;
  }
};

// 验证购买数量在有效范围内
const validateBuyNumber = () => {
  const min = goodsDetail.value && goodsDetail.value.min || 1;
  const max = goodsDetail.value && goodsDetail.value.max || 999;
  
  // 确保是整数
  buyNumber.value = Math.floor(Number(buyNumber.value));
  
  if (isNaN(buyNumber.value) || buyNumber.value < min) {
    buyNumber.value = min;
    ElMessage.warning(`最小购买数量为 ${min}`);
  } else if (buyNumber.value > max) {
    buyNumber.value = max;
    ElMessage.warning(`最大购买数量为 ${max}`);
  }
};

const handlePay = async () => {
  // 防抖：如果正在支付中，直接返回
  if (isPaying.value) {
    return;
  }
  
  isSubmitted.value = true; // 设置已提交状态
  if (goodsDetail.value && goodsDetail.value.accountRequired === 1 && !contactInfo.value) {
    return;
  }
  
  // 设置支付状态，防止重复点击
  isPaying.value = true;
  
  try {
    //下单
    const res = await api.payOrder({
      productId: goodsDetail.value && goodsDetail.value.id,
      buynumber: buyNumber.value,
      accountRequired: goodsDetail.value && goodsDetail.value.accountRequired,
      account: contactInfo.value
    });
    
    if (res.status == 'success') {
      getuserBalance(); 
      //提示选择，已经下单成功，是否前往订单页面 或 返回首页购物
      ElMessageBox.confirm('已经下单成功，是否前往订单页面 或 返回首页购物', '提示', {
        confirmButtonText: '前往订单页面',
        cancelButtonText: '返回首页购物',
        type: 'success',
      }).then(() => {
        // 用户点击"前往订单页面"
        router.push('/personal/order');
      }).catch(() => {
        // 用户点击"返回首页购物"
        router.push('/');
      });

    } else {
      ElMessage.error('支付失败');
    }
  } catch (error) {
    console.error('创建订单失败:', error);
    ElMessage.error('创建订单失败');
  } finally {
    // 无论成功还是失败，都要重置支付状态
    isPaying.value = false;
  }
};

const navigateToRecharge = () => {
  router.push('/personal/rechargelist');
};
</script>

<style scoped>
.transition-all {
  transition: all 0.3s ease;
}

.active\:scale-95:active {
  transform: scale(0.95);
}
</style>
