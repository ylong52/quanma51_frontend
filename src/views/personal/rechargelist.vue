<template>
  <el-config-provider :locale="zhCn">
    <div class="min-h-screen bg-gray-100 flex flex-col">
      <div class="max-w-md mx-auto w-full p-4">
        <!-- 头部 -->
        <div
          class="flex items-center bg-white   shadow px-3 py-3 mb-4 fixed top-0 left-0 right-0 z-20 max-w-md mx-auto w-full">
          <router-link to="/personal/index" class="text-gray-500 text-lg mr-2">
            <font-awesome-icon :icon="'user'" />
          </router-link>
          <div class="flex-1 text-center text-lg font-bold text-gray-800">充值管理</div>
        </div>
        
        <!-- 登录检查 -->
        <div v-if="!isLoggedIn" class="flex items-center justify-center h-screen">
          <Login :show="showLoginPopup" @close="onLoginClose" />
        </div>
        <div v-else>
 
        <!-- 提示信息 -->
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md mb-4 mt-12">
        <div class="flex items-center">
          <font-awesome-icon :icon="'exclamation-circle'" class="text-yellow-500 mr-2" />
          <div class="text-sm text-gray-700">
            为便于规范化管理，优化服务流程，充值环节将附加手续费5%。
          </div>
        </div>
      </div>

        <!-- 充值功能区（可折叠） -->
        <div class="bg-white rounded-xl shadow mb-4 mt-0">
          <div class="flex items-center px-4 py-3 border-b border-gray-100 cursor-pointer select-none"
            @click="showForm = !showForm">
            <font-awesome-icon :icon="'money-bill-wave'" class="text-orange-500 mr-2" />
            <span class="font-bold">充值</span>
            <font-awesome-icon :icon="showForm ? 'chevron-up' : 'chevron-down'"
              class="ml-auto text-gray-400 transition-transform" />
          </div>
          <div v-show="showForm" class="px-4 py-4">
            <div class="mb-4">
              <label class="block text-sm mb-1">充值金额</label>
              <div class="relative">
                <font-awesome-icon :icon="'yen-sign'" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="number"
                  class="w-full pl-8 pr-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-orange-400 text-base"
                  placeholder="请输入充值金额"  v-model="rechargeAmount" @input="calculateTotal"/>
              </div>
            </div>
            <div class="mb-4">
              <label class="block text-sm mb-1">充值方式</label>
              <select class="w-full border border-gray-200 rounded py-2 px-3 text-base" v-model="rechargeMethod">
                <option value="alipay">支付宝</option>
                <option value="wechat">微信支付</option>
               
              </select>
            </div>
            <div class="mb-4">
              <label class="block text-sm mb-1">手续费</label>
              <div class="relative">
                <font-awesome-icon :icon="'yen-sign'" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  class="w-full pl-8 pr-3 py-2 border border-gray-200 rounded bg-gray-100 text-gray-500 focus:outline-none focus:border-orange-400 text-base"
                  placeholder="手续费"
                  value="5%"
                  readonly
                  disabled
                />
              </div>
            </div>
            <!-- 合计 -->
            <div class="mb-4">
              <label class="block text-sm mb-1">合计</label>
              <div class="relative">
                <font-awesome-icon :icon="'yen-sign'" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" class="w-full pl-8 pr-3 py-2 border border-gray-200 rounded bg-gray-100 text-gray-500 focus:outline-none focus:border-orange-400 text-base" placeholder="合计" :value="totalAmount" readonly disabled />
              </div>
            </div>
            <button
              class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded mt-2 flex items-center justify-center" @click="handleRecharge">
              <font-awesome-icon :icon="'plus-circle'" class="mr-2"  />立即充值
            </button>
          </div>
        </div>
        <!-- 充值记录卡片 -->
        <div class="bg-white rounded-xl shadow mb-4">
          <div class="flex items-center px-4 py-3 border-b border-gray-100">
            <font-awesome-icon :icon="'history'" class="text-blue-500 mr-2" />
            <span class="font-bold">充值记录</span>
          </div>
          <div class="px-4 py-4">
            <!-- 搜索和状态选择 -->
            <div class="flex items-center bg-gray-50 rounded px-2 py-1 mb-2">
              <font-awesome-icon :icon="'search'" class="text-gray-400 mr-1" />
              <el-input
                v-model="searchKeyword"
                placeholder="搜索订单号"
                clearable
                size="small"
                
                @clear="handleQuery"
                style="width: 300px;"
              />
              <el-select v-model="searchStatus" placeholder="全部状态" size="small" class="ml-2  ">
                <el-option label="全部" value="all" />
                <el-option label="待支付" value="pending" />
                <el-option label="已支付" value="success" />
                <el-option label="已取消" value="failed" />
              </el-select>
              <el-button type="primary" @click="handleQuery" size="small">查询</el-button>
            </div>
            <div class="flex items-center mb-3">
              <input type="date" v-model="startDate" class="flex-1 border border-gray-200 rounded px-2 py-1 text-sm" />
              <span class="mx-2 text-gray-400">至</span>
              <input type="date" v-model="endDate" class="flex-1 border border-gray-200 rounded px-2 py-1 text-sm" />
              
            </div>
            <!-- 充值记录列表 -->
            <div class="divide-y divide-gray-100">
              <!-- 加载状态 -->
              <div v-if="isLoading" class="flex justify-center items-center py-4">
                <el-loading-spinner></el-loading-spinner>
                <span class="ml-2">加载中...</span>
              </div>
              <!-- 空状态 -->
              <div v-else-if="rechargeList.length === 0" class="flex justify-center items-center py-4 text-gray-500">
                暂无充值记录
              </div>
              <!-- 充值记录 -->
              <template v-else>
                <div class="py-3 flex justify-between items-center" v-for="item in rechargeList" :key="item.id">
                  <div>
                    <div class="text-orange-500 font-bold text-base">+{{ item.amount }}元</div>
                    <div class="text-xs text-gray-400 mt-1">{{ item.payment_method_text }}</div>
                    <div class="text-xs text-gray-500 mt-1">订单号: {{ item.order_no || '-' }}</div>
                    <div class="text-xs text-gray-500 mt-1">充值金额: {{ item.amount || '-' }}元</div>
                    <div class="text-xs text-gray-500 mt-1">手续费: {{ item.handling_fee || '0' }}元</div>
                    <div class="text-xs text-gray-500 mt-1">小计: {{ item.total_amount || item.amount }}元</div>
   
                  </div>
                  <div class="flex flex-col items-end">
                    <span
                      class="bg-green-100 text-green-600 text-xs rounded px-2 py-0.5 mb-1">{{ item.status_text }}</span>
                    <span class="text-xs text-gray-400">{{ item.created_at }}</span>
                  </div>
                </div>
              </template>
            </div>
            <!-- 分页 -->
            <div class="flex flex-col items-center mt-2">
              <el-pagination 
                @current-change="handleCurrentChange" 
                :current-page="currentPage" 
                :page-size="pageSize"
                layout="prev, pager, next" 
                :total="total" 
                size="small" 
                background 
                :hide-on-single-page="true" 
                :pager-count="5"
                class="mini-pagination">
              </el-pagination>
              
               
            </div>
          </div>
        </div>
        <div class="h-10"></div>
      </div>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faMoneyBillWave, faChevronDown, faChevronUp, faYenSign, faPlusCircle, faHistory, faSearch, faSync, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import { ElConfigProvider } from 'element-plus';
import { ElMessage } from 'element-plus'; // Added ElMessage import
library.add(faUser, faMoneyBillWave, faChevronDown, faChevronUp, faYenSign, faPlusCircle, faHistory, faSearch, faSync, faExclamationCircle);
import * as api from "@/api";
import Login from '@/views/login.vue';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();

// 登录状态管理
const isLoggedIn = computed(() => {
  return userStore.userInfo && userStore.userInfo.isLoggedIn;
});
const showLoginPopup = ref(true);

// 登录窗口关闭处理
const onLoginClose = () => {
  showLoginPopup.value = false;
  // 如果登录成功，isLoggedIn 会自动变为 true
  // 如果登录失败但关闭了窗口，则返回上一页
  if (!isLoggedIn.value) {
    history.back();
  }
};

const showForm = ref(false);
const searchStatus = ref('all');
const currentPage = ref(1);
const pageSize = ref(8);
const total = ref(0);

const searchKeyword = ref('');
const startDate = ref('');
const endDate = ref('');

function handleQuery() {
  // 重置页码
  currentPage.value = 1;
  
  // 调试输出
  console.log('执行查询，关键词:', searchKeyword.value);
  
  // 执行查询
  rechargeRecord();
}

function resetFilters() {
  // 重置所有过滤条件
  searchKeyword.value = '';
  searchStatus.value = 'all';
  startDate.value = '';
  endDate.value = '';
  currentPage.value = 1;
  // 重新加载数据
  rechargeRecord();
}

function handleSizeChange(newSize) {
  pageSize.value = newSize;
  currentPage.value = 1; // 改变每页条数时重置为第一页
  rechargeRecord(); // 重新获取数据
}

function handleCurrentChange(newPage) {
  currentPage.value = newPage;
  rechargeRecord(); // 重新获取数据
}

const rechargeList = ref([]);
const isLoading = ref(false);

const rechargeRecord = async () => {
  isLoading.value = true;
  try {
    // 构建API参数
    const apiParams = {
      page: currentPage.value,
      per_page: pageSize.value,
      status: searchStatus.value !== 'all' ? searchStatus.value : ''
    };
    
    // 只有当searchKeyword有值时才添加order_no参数
    if (searchKeyword.value && searchKeyword.value.trim() !== '') {
      apiParams.order_no = searchKeyword.value.trim();
    }
    
    // 只有当日期有值时才添加日期参数
    if (startDate.value) {
      apiParams.start_date = startDate.value;
    }
    
    if (endDate.value) {
      apiParams.end_date = endDate.value;
    }
    
    console.log('请求参数:', apiParams);
    
    const res = await api.rechargeRecord(apiParams);
    
    console.log('API返回数据:', res);

    // 处理不同的API返回格式
    if (res.list) {
      rechargeList.value = res.list;
    } else if (res.data && res.data.list) {
      rechargeList.value = res.data.list;
    } else {
      rechargeList.value = [];
    }

    // 更新分页参数 - 修复分页计算
    if (res.pagination) {
      // 直接使用API返回的分页信息
      total.value = parseInt(res.pagination.total) || 0;
      
      // 根据截图中的数据，如果total=3且per_page=5，则应该只有1页
      // 计算实际页数：向上取整(总条数/每页条数)
      const actualPages = Math.ceil(total.value / parseInt(res.pagination.per_page));
      
      // 确保当前页不超过实际页数
      currentPage.value = Math.min(parseInt(res.pagination.current_page) || 1, actualPages || 1);
      pageSize.value = parseInt(res.pagination.per_page) || 8;
      
      console.log('分页参数(res.pagination):', { 
        total: total.value, 
        currentPage: currentPage.value, 
        pageSize: pageSize.value,
        actualPages: actualPages
      });
    } else if (res.data && res.data.pagination) {
      total.value = parseInt(res.data.pagination.total) || 0;
      
      // 同样计算实际页数
      const actualPages = Math.ceil(total.value / parseInt(res.data.pagination.per_page));
      
      currentPage.value = Math.min(parseInt(res.data.pagination.current_page) || 1, actualPages || 1);
      pageSize.value = parseInt(res.data.pagination.per_page) || 8;
      
      console.log('分页参数(res.data.pagination):', { 
        total: total.value, 
        currentPage: currentPage.value, 
        pageSize: pageSize.value,
        actualPages: actualPages
      });
    } else {
      // 如果没有分页信息，使用列表长度
      total.value = rechargeList.value.length;
      console.log('无分页参数，使用列表长度:', total.value);
    }
    
    console.log('处理后的数据:', { 
      list: rechargeList.value, 
      total: total.value,
      currentPage: currentPage.value,
      pageSize: pageSize.value,
      actualPages: Math.ceil(total.value / pageSize.value)
    });
  } catch (error) {
    console.error('获取充值记录失败:', error);
    rechargeList.value = [];
    total.value = 0;
    currentPage.value = 1;
  } finally {
    isLoading.value = false;
  }
}

const rechargeMethod = ref('alipay');
const rechargeAmount = ref(100);
const totalAmount = ref(calculateTotalFromAmount(100)); // Initialize with default value

// 计算合计金额（含手续费）
function calculateTotalFromAmount(amount) {
  if (!amount || isNaN(amount) || amount <= 0) {
    return '0';
  }
  // 计算5%的手续费
  const fee = parseFloat(amount) * 0.05;
  const total = parseFloat(amount) + fee;
  return total.toFixed(2);
}

// 当充值金额变化时更新合计
function calculateTotal() {
  totalAmount.value = calculateTotalFromAmount(rechargeAmount.value);
}

const handleRecharge = async () => {
  // 验证充值金额
  if (!rechargeAmount.value || rechargeAmount.value <= 0) {
    ElMessage.error('请输入有效的充值金额');
    return;
  }

  try {
    const res = await api.rechargeCreatepay({
      amount: rechargeAmount.value,
      way_type: rechargeMethod.value,
      total_amount: totalAmount.value // 添加含手续费的总金额
    });
    
    if (res.status == 'success' && res.payinfo.pay_info) {
      window.location.href = res.payinfo.pay_info;
    } else {
      ElMessage.error(res.message || '创建充值订单失败');
    }
  } catch (error) {
    console.error('充值请求失败:', error);
    ElMessage.error('充值请求失败，请稍后再试');
  }
}

// 监听登录状态变化
watch(isLoggedIn, (newVal) => {
  if (newVal === true) {
    // 用户登录后加载数据
    rechargeRecord();
  }
});

onMounted(() => {
  // 只有在用户已登录的情况下才加载数据
  if (isLoggedIn.value) {
    rechargeRecord();
  }
});
</script>

<style scoped>
/* 自定义分页器样式 - 更紧凑版本 */
.mini-pagination {
  --el-pagination-button-width: 24px;
  --el-pagination-button-height: 24px;
  font-size: 12px;
  padding: 0;
  margin: 0;
}

:deep(.mini-pagination .el-pager li) {
  min-width: 20px;
  height: 20px;
  line-height: 20px;
  font-size: 11px;
  margin: 0 1px;
}

:deep(.mini-pagination .btn-prev),
:deep(.mini-pagination .btn-next) {
  min-width: 20px;
  height: 20px;
  line-height: 20px;
  padding: 0;
}
</style>
