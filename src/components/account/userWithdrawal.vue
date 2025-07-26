<template>
  <div class="container mx-auto px-4 py-8">

    <!-- 页面标题 -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold text-gray-800">我的提现记录</h1>
    </div>

    <!-- 余额信息 -->
    <el-card class="mb-6">
      <template #header>
        <div class="flex justify-between items-center">
          <span>当前余额 </span>
          <el-button type="primary" size="medium" @click="showWithdrawalDialog">
            <i class="fa fa-download"></i> 提现
          </el-button>
        </div>
      </template>
      <div class="p-4">
        <span class="text-gray-600">当前可用余额：</span>
        <span class="text-success font-bold text-xl">¥{{ currentBalance }}</span>
      </div>

      <div v-if="showWithdrawal">
        <el-input
          v-model="withdrawalAmount"
          placeholder="请输入提现金额"
          type="number"
          min="0.01"
          size="default"
          style="width: 200px;"
        ></el-input>
        
        <!-- 添加提现方式选择 -->
        <el-select v-model="withdrawalMethod" placeholder="提现方式" style="width: 150px; margin-left: 10px;">
          <el-option label="支付宝" value="alipay"></el-option>
          <el-option label="银行卡" value="bank"></el-option>
        </el-select>
        
        <!-- 支付宝账号输入框 -->
        <div v-if="withdrawalMethod === 'alipay'" style="margin-top: 10px;">
          <el-input
            v-model="alipayAccount"
            placeholder="请输入支付宝账号"
            size="default"
            style="width: 300px;"
          ></el-input>
        </div>
        
        <!-- 银行卡账号输入框 -->
        <div v-if="withdrawalMethod === 'bank'" style="margin-top: 10px;">
          <el-input
            v-model="bankAccount"
            placeholder="请输入银行卡账号"
            size="default"
            style="width: 300px;"
          ></el-input>
        </div>
        
        <el-button 
          type="primary" 
          @click="createWithdrawal" 
          size="default" 
          style="margin-top: 10px;"
          :disabled="currentBalance <= 0"
        >
          {{ currentBalance <= 0 ? '余额为0,不能提现' : '提现' }}
        </el-button>
      </div>
      
    </el-card>

    <!-- 筛选区域 -->
    <div class="mb-6">
      <el-row :gutter="20">
        <el-col :span="6">
          <el-select v-model="status" placeholder="提现状态" clearable size="medium">
            <el-option label="全部" value=""></el-option>
            <el-option label="待处理" value="0"></el-option>
            <el-option label="已到账" value="1"></el-option>
            <el-option label="失败" value="2"></el-option>
          </el-select>
        </el-col>

        <el-col :span="6">
          <el-input v-model="withdrawalId" placeholder="提现单号" clearable size="medium"></el-input>
        </el-col>

        <el-col :span="6">
          <el-button type="primary" @click="handleQuery" size="medium">
            <i class="fa fa-search"></i> 查询
          </el-button>
          <el-button @click="resetFilters" size="medium">
            <i class="fa fa-refresh"></i> 重置
          </el-button>
        </el-col>
      </el-row>
    </div>

    <!-- 列表区域 -->
    <div>
      <!-- 有数据时显示表格 -->
      <el-table :data="filteredData" border stripe fit highlight-current-row size="medium"
        :header-cell-style="{ background: '#f5f7fa', color: '#606266' }" v-loading="loading">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="id" label="提现ID" width="120"></el-table-column>
        <el-table-column prop="withdrawal_no" label="提现单号" width="180"></el-table-column>
        <el-table-column prop="withdrawal_time" label="申请时间" width="180"></el-table-column>
        <el-table-column prop="amount" label="提现金额" width="120">
          <template #default="{ row = {} }">
            <span class="text-primary font-weight-bold">¥{{ row.amount }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="handling_fee" label="手续费" width="120">
          <template #default="{ row = {} }">
            <span class="text-gray-600">¥{{ row.handling_fee }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="actual_amount" label="实际到账" width="120">
          <template #default="{ row = {} }">
            <span v-if="row.actual_amount" class="text-success font-weight-bold">¥{{ row.actual_amount }}</span>
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
        <el-table-column prop="withdrawal_method" label="提现方式" width="120">
          <template #default="{ row = {} }">
            <span v-if="row.withdrawal_method == 1" class="text-info">银行卡</span>
            <span v-else-if="row.withdrawal_method == 2" class="text-primary">支付宝</span>
            <span v-else class="text-gray-500">其他</span>
          </template>
        </el-table-column>
        <el-table-column prop="withdrawal_status" label="提现状态" width="120">
          <template #default="{ row = {} }">
            <span v-if="row.withdrawal_status === 0" class="text-warning">待处理</span>
            <span v-else-if="row.withdrawal_status === 1" class="text-success">已到账</span>
            <span v-else-if="row.withdrawal_status === 2" class="text-danger">失败</span>
          </template>
        </el-table-column>
        <el-table-column prop="arrival_time" label="到账时间" width="180">
          <template #default="{ row = {} }">
            <span v-if="row.arrival_time">{{ row.arrival_time }}</span>
            <span v-else class="text-gray-400">-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row = {} }">
            <el-button 
              v-if="row.withdrawal_status === 0 || row.withdrawal_status === 2" 
              link 
              size="small" 
              @click="deleteWithdrawal(row)"
              type="danger"
            >
              删除
            </el-button>
            <span v-else class="text-gray-400 text-sm">-</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页区域 -->
    <div class="mt-8 text-center">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
        :total="total"></el-pagination>
    </div>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import * as api from '@/api/index';

// 状态管理
const currentBalance = ref(0);

// 提现相关变量
const showWithdrawal = ref(false);
const withdrawalAmount = ref('');
const withdrawalMethod = ref('alipay'); // 默认选择支付宝
const alipayAccount = ref(''); // 支付宝账号
const bankAccount = ref(''); // 银行卡账号

const getCurrentBalance = async () => {
  let res = await api.getUserInfo();
  currentBalance.value = res.userinfo.balance;
}

getCurrentBalance();

// 获取提现记录
const tableData = ref([]);
const loading = ref(false);
// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(tableData.value.length);

const getWithdrawalRecord = async () => {
  try {
    loading.value = true;
    let res = await api.userWithdrawalList({
      page: currentPage.value,
      pageSize: pageSize.value
    });
    let data = res.list;
    tableData.value = data.data;
    // total,per_page,current_page
    total.value = data.total;
    pageSize.value = data.per_page;
    currentPage.value = data.current_page;
  } catch (error) {
    console.error('获取提现记录失败:', error);
    ElMessage.error('获取提现记录失败');
  } finally {
    loading.value = false;
  }
}

getWithdrawalRecord();

// 筛选条件
const status = ref('');
const withdrawalId = ref('');

// 计算属性：当前页数据
const filteredData = computed(() => {
  let filtered = tableData.value;
  
  // 状态筛选
  if (status.value !== '') {
    filtered = filtered.filter(item => String(item.withdrawal_status) === String(status.value));
  }
  
  // 提现单号筛选
  if (withdrawalId.value.trim() !== '') {
    filtered = filtered.filter(item => 
      item.withdrawal_no && item.withdrawal_no.toLowerCase().includes(withdrawalId.value.toLowerCase())
    );
  }
  
  return filtered;
});

// 方法
const resetFilters = () => {
  status.value = '';
  withdrawalId.value = '';
};

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
      ElMessage({
        type: 'success',
        message: '删除成功'
      });
      // 刷新余额
      getCurrentBalance();
      // 重新获取数据
      getWithdrawalRecord();
    } catch (error) {
      console.error('删除失败:', error);
      ElMessage.error('删除失败');
    }
  }).catch(() => {
    // 用户取消删除
    ElMessage({
      type: 'info',
      message: '已取消删除'
    });
  });
};

const showWithdrawalDialog = () => {
  showWithdrawal.value = true; 
};

const createWithdrawal = async () => {
  if (!withdrawalAmount.value || Number(withdrawalAmount.value) <= 0) {
    ElMessage.error('请输入有效的提现金额');
    return;
  }
  if (Number(withdrawalAmount.value) > Number(currentBalance.value)) {
    ElMessage.error('提现金额不得大于当前余额');
    return;
  }
  
  // 验证账号信息
  if (withdrawalMethod.value === 'alipay' && !alipayAccount.value) {
    ElMessage.error('请输入支付宝账号');
    return;
  }
  if (withdrawalMethod.value === 'bank' && !bankAccount.value) {
    ElMessage.error('请输入银行卡账号');
    return;
  }
  
  try {
    let res = await api.createUserWithdrawal({
      amount: withdrawalAmount.value,
      method: withdrawalMethod.value,
      account: withdrawalMethod.value === 'alipay' ? alipayAccount.value : bankAccount.value
    });
    if (res.status == 'success') {
      ElMessage.success('申请成功');
      getuserBalance();
    } else {
      ElMessage.error(res.message);
    }
     
    showWithdrawal.value = false;
    withdrawalAmount.value = '';
    alipayAccount.value = '';
    bankAccount.value = '';
    // 刷新余额和列表
    getCurrentBalance();
    getWithdrawalRecord();
  } catch (err) {
    console.log(err);
    ElMessage.error('提现失败');
  }
};


const getuserBalance =  () => {
  debugger;
  const res = api.getUserBalance()
  userStore.setBalance(res.balance)  
}


const handleSizeChange = (val) => {
  pageSize.value = val;
  getWithdrawalRecord();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  getWithdrawalRecord();
};

function handleQuery() {
  // 如果有分页，重置到第一页
  currentPage.value = 1;
  // filteredData 会自动响应
}

// 监听搜索输入变化
watch(withdrawalId, (newVal) => {
  // 当搜索内容变化时，可以触发查询
  console.log('搜索内容变化:', newVal);
});adfadf

// 页面加载时的初始化
onMounted(() => {
  getuserBalance();
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

.text-primary {
  color: #1890ff;
}

.text-info {
  color: #13c2c2;
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