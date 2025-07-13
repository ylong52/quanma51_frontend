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

    <!-- 主内容 -->
    <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
      <div class="flex flex-col lg:flex-row gap-6">
        <!-- 左侧卡片 -->
        <div class="lg:w-1/4">
          <div class="rounded-lg overflow-hidden border border-border-light card-shadow">
            <img :src="product.img" alt="京东E卡" class="w-full h-auto">
          </div>
        </div>

        <!-- 右侧主要内容 -->
        <div class="lg:w-3/4">
          <div class="mb-4">
            <h1 class="text-2xl font-bold text-neutral-dark mb-2">{{ product.title }}</h1>
            <div class="flex items-center text-lg">
              <span class="text-text-muted mr-2">价格</span>
              <span class="text-primary font-bold text-2xl">¥{{ product.price }}</span>
              <span class="text-text-muted ml-2">平均价</span>
            </div>
          </div>

          <!-- 表格 -->
          <div class="border border-border-light rounded-lg overflow-hidden mb-6">
            <table class="w-full border-collapse">
              <thead>
                <tr class="bg-gradient-to-r from-primary to-secondary text-white shadow-sm">
                  <th class="py-4 px-4 text-left font-semibold tracking-wide text-lg border-b border-border-light">全选</th>
                  <th class="py-4 px-4 text-left font-semibold tracking-wide text-lg border-b border-border-light">价格</th>
                  <th class="py-4 px-4 text-left font-semibold tracking-wide text-lg border-b border-border-light">库存</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, idx) in product.prices" :key="idx" class="group bg-white hover:bg-primary/5 transition-colors border-b border-border-light last:border-b-0 shadow-sm hover:shadow-md rounded-lg">
                  <td class="py-4 px-4">
                    <input type="checkbox" v-model="item.checked" class="rounded border-primary focus:ring-primary accent-primary scale-110">
                    <span class="pl-4 text-sm text-text-muted">卖1</span>
                  </td>
                  <td class="py-4 px-4 text-lg font-bold text-primary group-hover:text-primary-dark transition-colors">¥{{ item.price }}</td>
                  <td class="py-4 px-4 text-base font-medium text-neutral-dark">{{ item.stock }}个</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 购买数量 -->
          <div class="flex items-center mb-6">
            <label class="text-text-muted mr-3">购买数量</label>
            <div class="flex items-center border border-border-light rounded-md">
              <button class="w-10 h-10 flex items-center justify-center hover:bg-neutral transition-colors" @click="decrement">
                <i class="fa fa-minus text-sm"></i>
              </button>
              <input type="number" v-model.number="count" min="1" class="w-16 h-10 text-center border-x border-border-light focus:outline-none" />
              <button class="w-10 h-10 flex items-center justify-center hover:bg-neutral transition-colors" @click="increment">
                <i class="fa fa-plus text-sm"></i>
              </button>
            </div>
            <span class="ml-3 text-text-muted">库存:{{ totalStock }}</span>
          </div>

          <!-- 质保时长 -->
          <div class="mb-6">
            <span class="text-text-muted mr-3">质保时长</span>
            <div class="inline-flex flex-wrap gap-2">
              <button v-for="q in qualityOptions" :key="q" :class="['px-4 py-2 border rounded-md btn-hover', selectedQuality === q ? 'border-primary bg-primary text-white' : 'border-border-light bg-white text-neutral-dark']" @click="selectedQuality = q">{{ q }}</button>
            </div>
          </div>

          <!-- 应付金额 -->
          <div class="mb-6">
            <span class="text-text-muted mr-3">应付金额</span>
            <span class="text-primary font-bold text-2xl">¥{{ totalPrice }}</span>
          </div>

          <!-- 按钮组 -->
          <div class="flex flex-wrap gap-4">
             
            <button class="buy-now px-8 py-3 bg-primary text-white rounded-md btn-hover" @click="goToPayment">
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
          <!-- 子标签栏 -->
          <div class="border-b border-border-light">
            <div class="flex overflow-x-auto scrollbar-hide">
              <span v-for="sub in introSubTabs" :key="sub.key" :class="['sub-tab px-5 py-3 cursor-pointer whitespace-nowrap', activeIntroSubTab === sub.key ? 'sub-tab-active' : '']" @click="activeIntroSubTab = sub.key">{{ sub.label }}</span>
            </div>
          </div>
          <div class="sub-tab-contents p-6">
            <div v-show="activeIntroSubTab === 'overview'" class="sub-tab-content active fade-in" id="intro-overview">
              <!-- 基本信息内容 -->
              <div class="flex flex-col lg:flex-row gap-6">
                <div class="lg:w-3/4">
                  <div class="bg-rose-50 border border-rose-100 rounded-lg p-4 mb-6">
                    <h3 class="font-bold text-primary mb-2">温馨提示：</h3>
                    <ul class="text-sm space-y-2">
                      <li class="flex items-start" v-for="(tip, idx) in product.tips" :key="idx">
                        <i class="fa fa-exclamation-circle text-primary mt-1 mr-2"></i>
                        <span>{{ tip }}</span>
                      </li>
                    </ul>
                  </div>
                  <div class="space-y-4">
                    <h3 class="text-lg font-bold">产品使用说明：</h3>
                    <ul class="space-y-2 list-disc pl-5">
                      <li v-for="(desc, idx) in product.usage" :key="idx">{{ desc }}</li>
                    </ul>
                  </div>
                </div>
                <div class="lg:w-1/4">
                  <div class="bg-neutral rounded-lg p-5 text-center">
                    <img :src="product.qr" alt="二维码" class="w-32 h-32 mx-auto mb-4 rounded-lg">
                    <h3 class="font-bold text-lg mb-1">{{ product.title }}</h3>
                    <p class="text-primary font-bold text-xl mb-3">¥{{ product.price }}</p>
                    <p class="text-sm mb-2">长按识别二维码 立即购买</p>
                    <p class="text-text-muted text-xs">分享来自券码无忧</p>
                  </div>
                </div>
              </div>
            </div>
            <div v-show="activeIntroSubTab === 'specs'" class="sub-tab-content fade-in" id="intro-specs">
              <div class="space-y-4">
                <h3 class="text-lg font-bold">京东E卡规格参数</h3>
                <ul class="space-y-3">
                  <li class="flex" v-for="(spec, idx) in product.specs" :key="idx">
                    <span class="w-1/4 text-text-muted">{{ spec.label }}：</span>
                    <span class="w-3/4">{{ spec.value }}</span>
                  </li>
                </ul>
              </div>
            </div>
            <div v-show="activeIntroSubTab === 'usage'" class="sub-tab-content fade-in" id="intro-usage">
              <div class="space-y-4">
                <h3 class="text-lg font-bold">京东E卡使用步骤</h3>
                <ol class="space-y-3 list-decimal pl-5">
                  <li v-for="(step, idx) in product.steps" :key="idx">{{ step }}</li>
                </ol>
                <h3 class="text-lg font-bold mt-6">注意事项</h3>
                <ul class="space-y-3 list-disc pl-5">
                  <li v-for="(note, idx) in product.notes" :key="idx">{{ note }}</li>
                </ul>
              </div>
            </div>
            <div v-show="activeIntroSubTab === 'faq'" class="sub-tab-content fade-in" id="intro-faq">
              <div class="space-y-6">
                <h3 class="text-lg font-bold">常见问题解答</h3>
                <div class="space-y-2" v-for="(faq, idx) in product.faqs" :key="idx">
                  <p class="font-medium">Q：{{ faq.q }}</p>
                  <p>A：{{ faq.a }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-show="activeTab === 'comment'" class="tab-content fade-in" id="comment">
          <!-- 子标签栏 -->
          <div class="border-b border-border-light">
            <div class="flex overflow-x-auto scrollbar-hide">
              <span v-for="sub in commentSubTabs" :key="sub.key" :class="['sub-tab px-5 py-3 cursor-pointer whitespace-nowrap', activeCommentSubTab === sub.key ? 'sub-tab-active' : '']" @click="activeCommentSubTab = sub.key">{{ sub.label }}</span>
            </div>
          </div>
          <div class="sub-tab-contents p-6">
            <div v-for="sub in commentSubTabs" :key="sub.key" v-show="activeCommentSubTab === sub.key" class="sub-tab-content fade-in">
              <div class="space-y-6">
                <div v-for="(comment, idx) in product.comments[sub.key]" :key="idx" class="border-b border-border-light pb-6">
                  <div class="flex items-center mb-3">
                    <span class="font-medium mr-2">{{ comment.user }}</span>
                    <div class="flex text-yellow-400">
                      <i v-for="i in 5" :key="i" :class="['fa', i <= comment.stars ? 'fa-star' : (i - comment.stars === 0.5 ? 'fa-star-half-o' : 'fa-star-o')]" />
                    </div>
                    <span class="ml-auto text-text-muted text-sm">{{ comment.date }}</span>
                  </div>
                  <p class="text-neutral-dark">{{ comment.text }}</p>
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
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../store/user';
import Login from './login.vue';
import AgreementPopup from './AgreementPopup.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

// 获取用户store和路由
const userStore = useUserStore();
const router = useRouter();

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

const product = ref({
  img: 'https://img11.360buyimg.com/imagetools/jfs/t1/207724/32/25903/43247/64b7c109F88999999/1234567890abcdef.png',
  qr: 'https://img10.360buyimg.com/imagetools/jfs/t1/197724/12/26903/54321/64b7c109F12345678/abcdef1234567890.png',
  title: '京东E卡-1元',
  price: 0.95,
  prices: [
    { price: 0.95, stock: 598, checked: true },
    { price: 0.96, stock: 553, checked: true },
    { price: 0.97, stock: 265, checked: true },
    { price: 0.98, stock: 91, checked: true },
  ],
  tips: [
    '券码为特殊商品，非质量问题，不可退货与申请纠纷',
    '券码质保期为72小时，系统会在购买72小时后自动确认收货',
    '务必在确认收货前使用，一旦确认收货，平台很难100%保障质量',
    '若使用时发现券码有误或已被使用，可在订单页面自助发起纠纷，平台客服会主动处理',
    '囤货有风险，超出质保期后未核销券码，平台无法保障其质量，确认收货48小时后，将无法发起纠纷，资金损失由本人承担！',
  ],
  usage: [
    '本京东E卡为1元面值卡，可在京东平台符合E卡使用规则的场景使用。',
    '使用前请仔细核对券码信息，确保券码有效且未被使用。',
    '如有任何疑问，可联系京东客服咨询。',
  ],
  specs: [
    { label: '面值', value: '1元' },
    { label: '有效期', value: '自激活之日起36个月' },
    { label: '使用范围', value: '京东商城大部分商品（部分特例商品除外）' },
    { label: '使用方式', value: '在线支付时选择京东E卡支付' },
    { label: '充值方式', value: '卡号+密码在线充值' },
    { label: '发票信息', value: '购买时可选择开具普通发票或电子发票' },
    { label: '退款政策', value: '非质量问题不支持退款' },
  ],
  steps: [
    '登录京东账户，将商品加入购物车',
    '结算时选择"使用优惠/礼品卡"',
    '点击"添加新卡"，输入E卡卡号和密码',
    '确认卡内余额并选择使用金额',
    '完成支付流程',
  ],
  notes: [
    '京东E卡不记名、不挂失、不能兑换现金',
    '请妥善保管卡号和密码，如泄露导致卡内金额被盗用，责任自负',
    '部分特殊商品可能无法使用E卡支付，请以结算页面显示为准',
  ],
  faqs: [
    { q: '京东E卡可以在哪些平台使用？', a: '京东E卡可以在京东商城（www.jd.com）购买大部分商品使用。' },
    { q: '一张订单可以使用多张E卡吗？', a: '可以，最多支持同时使用49张京东E卡。' },
    { q: 'E卡支付后可以退款吗？', a: '订单取消后，E卡支付部分会退回您的E卡账户，可以继续使用。' },
    { q: 'E卡过期了怎么办？', a: 'E卡过期前3个月内，您可以联系客服申请延期，每次延期6个月。' },
    { q: '如何查询E卡余额和交易记录？', a: '登录京东账户，进入"我的京东"->"我的资产"->"京东E卡"查询。' },
  ],
  comments: {
    all: [
      { user: '张**', stars: 5, date: '2025-06-15', text: '购买后立即到账，使用也很方便，下次还会再来！' },
      { user: '李**', stars: 4, date: '2025-06-10', text: '券码是真的，但是客服响应有点慢，等了几分钟才处理我的问题。' },
      { user: '王**', stars: 3, date: '2025-06-05', text: '券码使用时提示已过期，联系客服后很快解决了，重新发了一个可用的券码。' },
      { user: '赵**', stars: 4.5, date: '2025-05-28', text: '价格比官网便宜一点，很划算，券码也没问题，顺利购买了商品。' },
    ],
    good: [
      { user: '张**', stars: 5, date: '2025-06-15', text: '购买后立即到账，使用也很方便，下次还会再来！' },
      { user: '赵**', stars: 4.5, date: '2025-05-28', text: '价格比官网便宜一点，很划算，券码也没问题，顺利购买了商品。' },
    ],
    medium: [
      { user: '李**', stars: 4, date: '2025-06-10', text: '券码是真的，但是客服响应有点慢，等了几分钟才处理我的问题。' },
    ],
    bad: [
      { user: '王**', stars: 3, date: '2025-06-05', text: '券码使用时提示已过期，联系客服后很快解决了，重新发了一个可用的券码。' },
    ],
  },
});

const count = ref(1);
const qualityOptions = ['12h', '24h', '48h', '72h', '1h'];
const selectedQuality = ref('12h');

const tabs = [
  { key: 'intro', label: '产品介绍', icon: 'fa fa-info-circle' },
  { key: 'comment', label: '用户评价', icon: 'fa fa-comments' },
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

const increment = () => { count.value += 1; };
const decrement = () => { if (count.value > 1) count.value -= 1; };
const totalStock = computed(() => product.value.prices.reduce((sum, item) => sum + item.stock, 0));
const totalPrice = computed(() => {
  // 这里只做简单演示，实际应按选中价格和数量计算
  const checked = product.value.prices.find(item => item.checked);
  return checked ? (checked.price * count.value).toFixed(2) : '0.00';
});

const goToPayment = () => {
  if (!isLogin.value) {
    showLoginPopup.value = true;
    return;
  }
  router.push('/payment');
};
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
