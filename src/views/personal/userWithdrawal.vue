<template>
  <div class="min-h-screen bg-gray-100 flex flex-col">
    <div class="max-w-md mx-auto w-full p-4">
      <!-- 头部 -->
      <div class="flex items-center bg-white   shadow px-3 py-3 mb-4 fixed top-0 left-0 right-0 z-20 max-w-md mx-auto w-full">
        <router-link to="/personal/index" class="text-gray-500 text-lg mr-2">
          <font-awesome-icon :icon="'user'" />
        </router-link>
        <div class="flex-1 text-center text-lg font-bold text-gray-800">提现管理</div>
        <router-link to="/personal/rechargelist" class="text-gray-500 text-lg mr-2">
          充值
        </router-link>
      </div>
      
      <!-- 提示信息 -->
      <div class="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded-md mb-4 mt-12">
        <div class="flex items-center">
          <font-awesome-icon :icon="'exclamation-circle'" class="text-yellow-500 mr-2" />
          <div class="text-sm text-gray-700">
            为保障资金安全，提现将在1-3个工作日内处理，请耐心等待。
          </div>
        </div>
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
              <input type="number" class="w-full pl-8 pr-3 py-2 border border-gray-200 rounded focus:outline-none focus:border-orange-400 text-base" placeholder="请输入提现金额" v-model="withdrawalAmount" v-if="userStore.userInfo.balance==0" disabled />
            </div>
            <p class="text-xs text-gray-400 mt-1">当前可提现余额: {{ userStore.userInfo.balance }}元</p>
          </div>
          <div class="mb-4">
            <label class="block text-sm mb-1">收款账户</label>
            <select v-model="paymentMethod" class="w-full border border-gray-200 rounded py-2 px-3 text-base" v-if="userStore.userInfo.balance==0" disabled>
              <option value="alipay">支付宝</option>           
              <option value="bank">银行卡</option>
            </select>
          </div>
          <!-- 支付宝账号输入框 -->
          <div class="mb-4" v-if="paymentMethod === 'alipay'">
            <label class="block text-sm mb-1">支付宝账号</label>
            <input type="text" class="w-full border border-gray-200 rounded py-2 px-3 text-base" placeholder="请输入支付宝账号"  v-model="withdrawalAlipayAccount" v-if="userStore.userInfo.balance==0" disabled />
          </div>
          <!-- 银行卡账号输入框 -->
          <div class="mb-4" v-if="paymentMethod === 'bank'">
            <label class="block text-sm mb-1">收款人姓名</label>
            <input type="text" class="w-full border border-gray-200 rounded py-2 px-3 text-base" placeholder="收款人姓名" v-model="withdrawalBankName"  v-if="userStore.userInfo.balance==0" disabled />
          </div>
          <div class="mb-4" v-if="paymentMethod === 'bank'">
            <label class="block text-sm mb-1">银行卡账号</label>
            <input type="text" class="w-full border border-gray-200 rounded py-2 px-3 text-base" placeholder="请输入银行卡账号" v-model="withdrawalBankAccount" v-if="userStore.userInfo.balance==0" disabled />
          </div>
          
          <button 
            class="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 rounded mt-2 flex items-center justify-center" 
            @click="handleWithdrawal"
            :disabled="userStore.userInfo.balance <= 0"
            :class="{'bg-gray-400 hover:bg-gray-400': userStore.userInfo.balance <= 0}"
          >
            <font-awesome-icon :icon="'paper-plane'" class="mr-2" />
            {{ userStore.userInfo.balance <= 0 ? '余额为0不能提现' : '提交提现申请' }}
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
          <div class="mb-3">
            <el-row :gutter="10">
              <el-col :span="8">
                <el-select v-model="status" placeholder="提现状态" clearable size="small" style="width: 100%">
                  <el-option label="全部" value=""></el-option>
                  <el-option label="待处理" value="0"></el-option>
                  <el-option label="已到账" value="1"></el-option>
                  <el-option label="失败" value="2"></el-option>
                </el-select>
              </el-col>
              <el-col :span="8">
                <el-input v-model="withdrawalId" placeholder="提现单号" clearable size="small"></el-input>
              </el-col>
              <el-col :span="8">
                <div class="flex space-x-1">
                  <el-button type="primary" @click="handleQuery" size="small">
                    <font-awesome-icon :icon="'search'" class="mr-1" /> 查询
                  </el-button>
                  <!-- <el-button @click="resetFilters" size="small">
                    <font-awesome-icon :icon="'sync'" class="mr-1" /> 重置
                  </el-button> -->
                </div>
              </el-col>
            </el-row>
          </div>
          
          <!-- 提现记录列表 -->
          <div v-loading="loading">
            <!-- 使用卡片式详情展示替代表格 -->
            <div v-if="filteredData.length > 0">
              <div v-for="(item, index) in filteredData" :key="index" class="bg-white rounded-lg shadow-sm mb-2 overflow-hidden">
                <!-- 卡片头部：序号、单号和状态 -->
                <div class="flex justify-between items-center p-2 border-b border-gray-100">
                  <div class="flex items-center">
                    <span class="text-xs bg-gray-100 text-gray-600 rounded px-1 mr-1">{{ index + 1 }}</span>
                    <span class="text-xs font-medium  " style="max-width: 120px;">{{ item.withdrawal_no }}</span>
                  </div>
                  <div class="flex items-center">
                    <span v-if="item.withdrawal_status === 0" class="text-xs bg-yellow-100 text-yellow-600 rounded px-1 py-0.5">待处理</span>
                    <span v-else-if="item.withdrawal_status === 1" class="text-xs bg-green-100 text-green-600 rounded px-1 py-0.5">已到账</span>
                    <span v-else-if="item.withdrawal_status === 2" class="text-xs bg-red-100 text-red-600 rounded px-1 py-0.5">失败</span>
                  </div>
                </div>
                
                <!-- 卡片内容：一行显示所有信息 -->
                <div class="p-2">
                  <div class="grid grid-cols-3 gap-1">
                    <!-- 金额 -->
                    <div>
                      <div class="text-xs text-gray-500">金额</div>
                      <div class="text-sm text-orange-500 font-bold">¥{{ item.amount }}</div>
                    </div>
                    
                    <!-- 提现方式和账号 -->
                    <div>
                      <div class="text-xs text-gray-500">账户</div>
                      <div class="text-xs">
                        <span v-if="item.withdrawal_method == 1">银行卡</span>
                        <span v-else-if="item.withdrawal_method == 2">支付宝</span>
                        <span v-else>其他</span>
                      </div>
                    </div>
                    
                    <!-- 操作按钮 -->
                    <div class="flex justify-end items-end">
                      <button 
                        v-if="item.withdrawal_status === 0 || item.withdrawal_status === 2" 
                        @click="deleteWithdrawal(item)" 
                        class="text-red-500 text-xs flex items-center bg-gray-50 rounded px-2 py-1"
                      >
                        <font-awesome-icon :icon="'trash'" class="mr-1" />
                        删除
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 无数据状态 -->
            <div v-else class="text-center py-5 bg-white rounded-lg shadow-sm">
              <font-awesome-icon :icon="'inbox'" class="text-gray-300 text-2xl mb-2" />
              <p class="text-gray-500 text-sm">暂无提现记录</p>
            </div>
          </div>
          
          <!-- 分页控件 -->
          <div class="mt-4 flex justify-center">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[5, 10, 15]"
              :page-size="pageSize"
              layout="prev, pager, next"
              :total="total"
              background
              small
              class="pagination-mobile"
            ></el-pagination>
          </div>
          
          <!-- 显示总记录数 -->
          <div class="text-center text-xs text-gray-500 mt-2">
            共 {{ total }} 条记录
          </div>
        </div>
      </div>
      <div class="h-10"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser, faCreditCard, faChevronDown, faChevronUp, faYenSign, faPaperPlane, faPlus, faHistory, faSearch, faSync, faTrash, faInbox } from '@fortawesome/free-solid-svg-icons';
library.add(faUser, faCreditCard, faChevronDown, faChevronUp, faYenSign, faPaperPlane, faPlus, faHistory, faSearch, faSync, faTrash, faInbox);
import * as api from '@/api';
import { useUserStore } from '@/store/user';
import { useToast } from "vue-toast-notification";
import { ElMessage, ElMessageBox } from 'element-plus';

const userStore = useUserStore();
const toast = useToast();
const searchStatus = ref('all');
const withdrawalAmount = ref(0);
const showForm = ref(false);
const paymentMethod = ref('alipay'); // 默认选择支付宝

const withdrawalAlipayAccount = ref('');
const withdrawalBankName = ref('');
const withdrawalBankAccount = ref('');

// 提现记录相关变量
const tableData = ref([]);
const loading = ref(false);
// 分页参数
const currentPage = ref(1);
const pageSize = ref(5);
const total = ref(0);
// 筛选条件
const status = ref('');
const withdrawalId = ref('');

// 获取提现记录
const getWithdrawalRecord = async () => {
  try {
    loading.value = true;
    let res = await api.userWithdrawalList({
      page: currentPage.value,
      pageSize: pageSize.value,
      status: status.value,
      withdrawal_no: withdrawalId.value
    });
    let data = res.list;
    tableData.value = data.data;
    // total,per_page,current_page
    total.value = data.total;
    pageSize.value = data.per_page;
    currentPage.value = data.current_page;
  } catch (error) {
    console.error('获取提现记录失败:', error);
    toast.error('获取提现记录失败');
  } finally {
    loading.value = false;
  }
}

// 计算属性：当前页数据
const filteredData = computed(() => {
  let filtered = tableData.value;
  
  // 状态筛选
  if (status.value !== '') {
    filtered = filtered.filter(item => String(item.withdrawal_status) === String(status.value));
  }
  
  // 提现单号筛选
  if (withdrawalId.value && withdrawalId.value.trim() !== '') {
    filtered = filtered.filter(item => 
      item.withdrawal_no && item.withdrawal_no.toLowerCase().includes(withdrawalId.value.toLowerCase())
    );
  }
  
  return filtered;
});

// 分页方法
const handleSizeChange = (val) => {
  pageSize.value = val;
  getWithdrawalRecord();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  getWithdrawalRecord();
};

// 查询和重置方法
function handleQuery() {
  // 如果有分页，重置到第一页
  currentPage.value = 1;
  // filteredData 会自动响应
}

const resetFilters = () => {
  status.value = '';
  withdrawalId.value = '';
};

// 删除提现记录
const deleteWithdrawal = (row) => {
  // 获取状态文本
  const statusText = row.withdrawal_status === 0 ? '待处理' : '失败';
  
  // 删除提现记录
  ElMessageBox.confirm(
    `确定要删除${statusText}状态的提现记录吗？<br/>
    <strong>提现单号：</strong>${row.withdrawal_no}<br/>
    <strong>提现金额：</strong>¥${row.amount}<br/>
    <strong>申请时间：</strong>${row.withdrawal_time}<br/>
    <strong>当前状态：</strong>${statusText}<br/><br/>
    删除后无法恢复，请谨慎操作！`,
    '确认删除',
    {
      confirmButtonText: '确定删除',
      cancelButtonText: '取消',
      type: 'warning',
      dangerouslyUseHTMLString: true
    }
  ).then(async () => {
    try {
      await api.deleteUserWithdrawal(row.id);
      toast.success('删除成功');
      // 刷新余额
      getuserBalance();
      // 重新获取数据
      getWithdrawalRecord();
    } catch (error) {
      console.error('删除失败:', error);
      toast.error('删除失败');
    }
  }).catch(() => {
    // 用户取消删除
    toast.info('已取消删除');
  });
};

const handleWithdrawal = () => {
  //判断是否有输入项
  if (withdrawalAmount.value == '' || withdrawalAmount.value == 0) {
    toast.error('请输入提现金额');
    return;
  }

  if (paymentMethod.value == '') {
    toast.error('请选择提现方式');
    return;
  }
  if (paymentMethod.value == 'alipay') {
    if (withdrawalAlipayAccount.value == '') {
      toast.error('请输入支付宝账号');
      return;
    }
  }
  if (paymentMethod.value == 'bank') {
    if (withdrawalBankName.value == '') { 
      toast.error('请输入收款人姓名');
      return;
    }
    if (withdrawalBankAccount.value == '') {
      toast.error('请输入银行卡账号');
      return;
    }
  }
  //判断余额是否足够
  if (withdrawalAmount.value > userStore.userInfo.balance) {
    toast.error('余额不足');
    return;
  }
  api.createUserWithdrawal({
    amount: withdrawalAmount.value,
    payment_method: paymentMethod.value,
    withdrawal_alipay_account: withdrawalAlipayAccount.value,
    withdrawal_bank_name: withdrawalBankName.value,
    withdrawal_bank_account: withdrawalBankAccount.value
  }).then(res => {
    if (res.status == 'success') {
      getuserBalance();
      toast.success('提现申请提交成功');
      // 重新获取提现记录
      getWithdrawalRecord();
    }
  })
}

const getuserBalance = async () => {
  const res = await api.getUserBalance()
  userStore.setBalance(res.balance)  
}

// 监听搜索输入变化
watch(withdrawalId, (newVal) => {
  // 当搜索内容变化时，可以触发查询
  console.log('搜索内容变化:', newVal);
});

onMounted(() => {
  getuserBalance();
  getWithdrawalRecord(); // 加载提现记录
});

</script>

<style scoped>
/* 添加必要的样式 */
.text-success {
  color: #52c41a;
}

.text-danger {
  color: #ff4d4f;
}

.text-warning {
  color: #faad14;
}

.text-primary {
  color: #1890ff;
}

.font-weight-bold {
  font-weight: 600;
}

/* 移动端表格样式优化 */
:deep(.el-table) {
  font-size: 12px;
}

:deep(.el-table th) {
  padding: 5px 0;
}

:deep(.el-table td) {
  padding: 5px 0;
}

/* 移动端分页样式优化 */
.pagination-mobile {
  width: 100%;
  display: flex;
  justify-content: center;
}

:deep(.el-pagination .el-pager li) {
  min-width: 24px;
}

/* 卡片阴影效果 */
.shadow-sm {
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}

/* 确保内容不会溢出容器 */
.overflow-hidden {
  overflow: hidden;
}
</style>