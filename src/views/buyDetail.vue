<template>
  <div class="container mx-auto px-4 py-6 max-w-6xl">

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
    
    <!-- 面包屑 -->
    <div class="text-sm text-text-muted mb-4">
      <a href="#" class="hover:text-primary transition-colors">我要买券</a>
      <span class="mx-2">/</span>
      <a href="#" class="hover:text-primary transition-colors">京东E卡</a>
      <span class="mx-2">/</span>
      <span class="text-neutral-dark">下单</span>
    </div>
<!-- {{ productDetail }} -->
    <!-- 主内容 -->
    <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
     
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- 左侧卡片 -->
        <div class="lg:w-1/4">
          <div class="rounded-lg overflow-hidden border border-border-light card-shadow">
            <img :src="productDetail.cover" :alt="productDetail.name" class="w-full h-auto">
          </div>
        </div>

        <!-- 右侧主要内容 -->
        <div class="lg:w-3/4">
          <div class="mb-4">
            <h1 class="text-2xl font-bold text-neutral-dark mb-2">{{ productDetail.title }}</h1>
            <div class="ant-tag flex flex-wrap items-center gap-4 mb-4">
              <span class="inline-flex items-center px-2 py-0.5 border border-primary text-primary bg-white rounded-lg text-sm font-medium">
                <font-awesome-icon icon="shield-alt" class="w-4 h-4 mr-1" />
                {{ productDetail.type }}商品
              </span>
              <span class="inline-flex items-center px-2 py-0.5 border border-orange-500 text-orange-500 bg-white rounded-lg text-sm font-medium">
                <font-awesome-icon icon="chart-line" class="w-4 h-4 mr-1" />
                销量 {{ productDetail.count }}+
              </span>
              <!-- <span class="inline-flex items-center px-2 py-0.5 border border-green-500 text-green-500 bg-white rounded-lg text-sm font-medium">
                <font-awesome-icon icon="boxes" class="w-4 h-4 mr-1" />
                库存 9999
              </span> -->
            </div>
            <div class="price-info bg-white rounded-xl shadow-card p-5 flex flex-wrap items-center gap-4 text-lg mb-4 border border-border-light">
              <span class="text-text-muted mr-2">价格</span>
              <span class="text-primary font-bold text-2xl">¥{{ productDetail.money }}</span>
              <span class="inline-flex items-center px-2 py-0.5 border border-purple-500 text-purple-500 bg-white rounded-lg text-sm font-medium">
                <font-awesome-icon icon="ban" class="w-4 h-4 mr-1" />
                限购 {{ productDetail.min }}
              </span>
              <!-- <span class="inline-flex items-center px-2 py-0.5 border border-green-500 text-green-500 bg-white rounded-lg text-sm font-medium">
                <font-awesome-icon icon="boxes" class="w-4 h-4 mr-1" />
                库存 {{ productDetail.count }}
              </span> -->
              <span class="inline-flex items-center px-2 py-0.5 border border-gray-400 text-gray-600 bg-white rounded-lg text-sm font-medium">
                <font-awesome-icon icon="clock" class="w-4 h-4 mr-1" />
                质保时长 72小时
              </span>
            </div>
          </div>

          

          <!-- 购买信息卡片 -->
          <div class="bg-blue-50 rounded-xl shadow-card p-5 mb-6">
            <div class="flex flex-col gap-4">
              <!-- 第一行：购买数量 -->
              <div class="flex items-center">
                <label class="text-text-muted mr-3">购买数量</label>
                <div class="flex items-center border border-border-light rounded-md">
                  <button class="w-10 h-10 flex items-center justify-center hover:bg-neutral transition-colors" @click="decrement">
                    <font-awesome-icon icon="minus" class="text-base" />
                  </button>
                  <input
                    type="number"
                    v-model.number="buyNumber"
                    :min="productDetail.min"
                    :max="productDetail.max"
                    class="w-16 h-10 text-center border-x border-border-light focus:outline-none"
                  />
                  <button class="w-10 h-10 flex items-center justify-center hover:bg-neutral transition-colors" @click="increment">
                    <font-awesome-icon icon="plus" class="text-base" />
                  </button>
                </div>
               
              </div>
              <!-- 第二行：QQ号码 -->
              <div class="flex items-center">
                  <label class="text-text-muted mr-3">
                    <template v-if="productDetail.accountRequired === 1"><span class="text-red-500">*</span></template>                    
                    {{ productDetail.accountName }}</label>
                <template v-if="productDetail.accountType === 1">
                  <input
                    type="text"
                    v-model="accountContent"
                    class="w-full border border-border-light rounded-md p-2"
                    :required="productDetail.accountRequired === 1"
                    :placeholder="productDetail.accountName"
                  />
                </template>
                <template v-else-if="productDetail.accountType === 2">
                  <select
                    v-model="accountContent"
                    class="w-full border border-border-light rounded-md p-2"
                    :required="productDetail.accountRequired === 1"
                  >
                    <option value="" disabled selected>请选择{{ productDetail.accountName }}</option>
                    <option v-for="item in productDetail.accountOptions" :key="item.value" :value="item.value">
                      {{ item.label }}
                    </option>
                  </select>
                </template>
                <template v-else>
                  <!-- 其他类型可扩展 -->
                  <input
                    type="text"
                    v-model="accountContent"
                    class="w-full border border-border-light rounded-md p-2"
                    :required="productDetail.accountRequired === 1"
                    :placeholder="productDetail.accountName"
                  />
                </template>
              </div>
            </div>
          </div>

 

          <!-- 应付金额 -->
          <div class="mb-6">
            <span class="text-text-muted mr-3">应付金额</span>
            <span class="text-primary font-bold text-2xl">¥{{ totalPrice }}</span>
          </div>

          <!-- 余额支付控件 -->
          <div class="mb-4">
            <div class="border border-orange-200 bg-orange-50 rounded-md px-4 py-2 inline-flex items-center gap-3">
              <span class="flex items-center justify-center w-6 h-6 rounded-full border-2 border-red-400 bg-white mr-1">
                <span class="w-3 h-3 bg-red-400 rounded-full block"></span>
              </span>
              <span class="flex items-center justify-center w-6 h-6 rounded-full bg-orange-400 text-white">
                <font-awesome-icon icon="yen-sign" />
              </span>
              <span class="text-base text-gray-700 font-medium">余额支付</span>              
            </div>
          </div>

          <!-- 按钮组 -->
          <div class="flex flex-wrap gap-4">             
            <button class="buy-now px-8 py-3 bg-primary text-white rounded-md btn-hover" @click="goToPayment" :disabled="isSubmitting">
              <i class="fa fa-shopping-cart mr-2"></i>立即购买
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签栏和标签内容 -->
    <div class="bg-white rounded-xl shadow-sm overflow-hidden">
      <!-- 主标签 -->
      <div class="border-b border-border-light">
        <div class="flex overflow-x-auto scrollbar-hide">
          <span v-for="tab in tabs" :key="tab.key" :class="['tab px-6 py-4 cursor-pointer whitespace-nowrap', activeTab === tab.key ? 'tab-active' : '']" @click="activeTab = tab.key">
            <i :class="tab.icon + ' mr-2'"></i>{{ tab.label }}
          </span>
        </div>
      </div>
      <!-- 标签内容 -->
      <div class="tab-contents">
        <div v-show="activeTab === 'intro'" class="tab-content fade-in" id="intro">
           
          <div class="sub-tab-contents p-6">
            <div v-show="activeIntroSubTab === 'overview'" class="sub-tab-content  fade-in" id="intro-overview">
                 
                <div class="flex flex-col lg:flex-row gap-6"> 
                  <div class="lg:w-3/4">
                    <div class="  rounded-lg p-4 mb-6">
                      <template v-if="productDetail.desc">
                        {{ productDetail.desc }}
                      </template>
                      <template v-else>
                        <div class="flex flex-col items-center justify-center py-8">
                          <div class="text-gray-400 mt-2">暂无数据</div>
                        </div>
                      </template>
                    </div>
                  </div>
                </div>
 
            </div>
             
       
          </div>
        </div>
 
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed,onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '../store/user';
import Login from './login.vue';
import AgreementPopup from './AgreementPopup.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core'
     import { faShieldAlt, faChartLine, faBoxes, faBan, faClock, faMinus, faPlus, faYenSign } from '@fortawesome/free-solid-svg-icons'
     library.add(faShieldAlt, faChartLine, faBoxes, faBan, faClock, faMinus, faPlus, faYenSign)

import * as api from '@/api/index.js';
import { useToast } from 'vue-toast-notification';
const toast = useToast();
// 获取用户store和路由
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
// 获取id
const productId = ref(route.query.id);

// 登录状态
const isLogin = computed(() => userStore.isLoggedIn);
const username = computed(() => userStore.username);

// 弹窗控制
const showLoginPopup = ref(false);
const showAgreementPopup = ref(false);

// 返回首页
const goToHome = () => {
  router.push('/');
};

// 登录弹窗关闭处理
const onLoginClose = () => {
  showLoginPopup.value = false;
};

// 协议弹窗关闭处理
const handleAgreementClose = (agree) => {
  showAgreementPopup.value = false;
  if (agree) {
    showLoginPopup.value = true;
  }
};


const tabs = [
  { key: 'intro', label: '产品介绍', icon: 'fa fa-info-circle' }, 
];
const introSubTabs = [
  { key: 'overview', label: '基本信息' },
  { key: 'specs', label: '规格参数' },
  { key: 'usage', label: '使用说明' },
  { key: 'faq', label: '常见问题' },
];
const commentSubTabs = [
  { key: 'all', label: '全部评价' },
  { key: 'good', label: '好评' },
  { key: 'medium', label: '中评' },
  { key: 'bad', label: '差评' },
];
const activeTab = ref('intro');
const activeIntroSubTab = ref('overview');
const activeCommentSubTab = ref('all');

const buyNumber = ref(1);

const increment = () => {
  if (buyNumber.value < productDetail.value.max) {
    buyNumber.value += 1;
  }
};
const decrement = () => {
  if (buyNumber.value > productDetail.value.min) {
    buyNumber.value -= 1;
  }
};

const accountContent = ref('');

const totalPrice = computed(() => {
  // 
  return buyNumber.value * productDetail.value.money
});

const isSubmitting = ref(false);

const goToPayment = async () => {
  if (isSubmitting.value) return; // 节流：正在请求中不再触发
  isSubmitting.value = true;

  if (!isLogin.value) {
    showLoginPopup.value = true;
    isSubmitting.value = false;
    return;
  }
  if(productDetail.value.accountRequired === 1 && accountContent.value === ''){ 
    toast.error('请输入'+productDetail.value.accountName);
    isSubmitting.value = false;
    return;
  }
  //下单
  const res = await api.createOrder({
    productId: productId.value,
    buynumber: buyNumber.value,
    accountRequired: productDetail.value.accountRequired,
    account: accountContent.value
  });
debugger;
  if(res.status == 'success'){
 
    router.push({
    path: '/payment',
    query: {
      order_number: res.order_number
    }
  });
  }else{
    toast.error(res.msg);
  }
  isSubmitting.value = false; // 请求结束，允许再次点击
};

const productDetail = ref({});

const getProductDetail = async () => {
 
  const res = await api.getProductDetail(productId.value);
  productDetail.value = res.data;
  buyNumber.value = res.data.min; // Set initial count to min
};

watch(buyNumber, (val) => {
  if (val < productDetail.value.min) {
    buyNumber.value = productDetail.value.min;
  } else if (val > productDetail.value.max) {
    buyNumber.value = productDetail.value.max;
  }
});

onMounted(() => {
  getProductDetail();
});
</script>

<style scoped>
.card-shadow {
  box-shadow: 0 2px 8px 0 rgba(0,0,0,0.06);
  transition: box-shadow 0.3s;
}
.card-shadow:hover {
  box-shadow: 0 8px 24px 0 rgba(0,0,0,0.12);
}
.tab-active {
  border-bottom: 2px solid #e1251b;
  color: #e1251b;
  font-weight: 500;
}
.sub-tab-active {
  border-bottom: 2px solid #ff9900;
  color: #ff9900;
  font-weight: 500;
}
.btn-hover {
  transition: transform 0.3s, box-shadow 0.3s;
}
.btn-hover:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 24px 0 rgba(0,0,0,0.10);
}
.fade-in {
  animation: fadeIn 0.5s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
/* 表格美化 */
table {
  background: transparent;
}
thead tr {
  background: linear-gradient(90deg, #e1251b 0%, #ff9900 100%);
}
thead th {
  color: #fff;
  font-size: 1.1rem;
  letter-spacing: 0.02em;
  border-bottom: 2px solid #f5f5f5;
}
tbody tr {
  background: #fff;
  transition: box-shadow 0.2s, background 0.2s;
  box-shadow: 0 1px 4px 0 rgba(225,37,27,0.03);
  border-radius: 0.5rem;
}
tbody tr:hover {
  background: #fff5f5;
  box-shadow: 0 4px 16px 0 rgba(225,37,27,0.08);
}
tbody td {
  font-size: 1rem;
  color: #222;
  border-bottom: 1px solid #f5f5f5;
}
tbody tr:last-child td {
  border-bottom: none;
}
input[type="checkbox"] {
  accent-color: #e1251b;
}
</style>
