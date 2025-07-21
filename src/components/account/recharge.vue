<template>
  <template v-if="rechargeDialogVisible == false">
    <div class="container mx-auto px-4 py-8">

      <!-- 页面标题 -->
      <PageHeader title="我的充值记录" />

      <!-- 余额信息 -->
      <el-card class="mb-6">
        <template #header>
          <div class="flex justify-between items-center">
            <span>当前余额 </span>
            <el-button type="primary" size="medium" @click="showRechargeDialog">
              <i class="fa fa-plus-circle"></i> 充值
            </el-button>
          </div>
        </template>
        <div class="p-4">
          <span class="text-gray-600">当前可用余额：</span>
          <span class="text-success font-bold text-xl">¥{{ currentBalance }}</span>
        </div>
      </el-card>

      <!-- 筛选区域 -->
      <div class="mb-6">
        <el-row :gutter="20">
          <!-- <el-col :span="6">
            <el-select v-model="timeRange" placeholder="时间范围" clearable size="medium">
              <el-option label="全部" value="all"></el-option>
              <el-option label="今天" value="today"></el-option>
              <el-option label="昨天" value="yesterday"></el-option>
              <el-option label="近7天" value="7days"></el-option>
              <el-option label="本月" value="month"></el-option>
              <el-option label="上月" value="lastMonth"></el-option>
              <el-option label="自定义" value="custom"></el-option>
            </el-select>
          </el-col> -->
          <!-- <el-col :span="6">
          <el-select v-model="payMethod" placeholder="充值方式" clearable size="medium">
            <el-option label="全部" value="all"></el-option>
            <el-option label="微信支付" value="wechat"></el-option>
            <el-option label="支付宝" value="alipay"></el-option>
            <el-option label="银行卡" value="bank"></el-option>
            <el-option label="Apple Pay" value="applePay"></el-option>
          </el-select>
        </el-col> -->

          <el-col :span="6">
            <el-select v-model="status" placeholder="充值状态" clearable size="medium">
              <el-option label="全部" value=""></el-option>
              <el-option label="待支付" value="0"></el-option>
              <el-option label="支付成功" value="1"></el-option>
              <el-option label="支付失败" value="2"></el-option>
            </el-select>
          </el-col>

          <el-col :span="6">
            <el-input v-model="rechargeId" placeholder="充值ID" clearable size="medium"></el-input>
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
        <!-- 无数据状态 -->
        <div v-if="tableData.length === 0" class="text-center py-12">
          <img src="https://picsum.photos/seed/nodata/200/150" alt="暂无数据" class="mx-auto mb-4 w-40 h-30 rounded">
          <p class="text-gray-500 mb-4">暂无充值记录</p>
          <el-button type="primary" @click="showRechargeDialog">
            <i class="fa fa-plus-circle"></i> 前去充值
          </el-button>
        </div>

        <!-- 有数据时显示表格 -->
        <el-table :data="filteredData" border stripe fit highlight-current-row size="medium"
          :header-cell-style="{ background: '#f5f7fa', color: '#606266' }">
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="id" label="充值ID" width="120"></el-table-column>
          <el-table-column prop="payment_time" label="充值时间" width="180"></el-table-column>
          <el-table-column prop="amount" label="充值金额" width="120">
            <template #default="{ row = {} }">
              <span class="text-success font-weight-bold">{{ row.amount }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="payment_method" label="支付方式" width="120">
            <template #default="{ row = {} }">
              <span v-if="row.payment_method == 1" class="text-success">微信</span>
              <span v-else-if="row.payment_method == 2" class="text-primary">支付宝</span>
              <span v-else-if="row.payment_method == 3" class="text-info">银行卡</span>
              <span v-else-if="row.payment_method == 4" class="text-warning">Apple Pay</span>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="充值状态" width="120">
            <template #default="{ row = {} }">
              <span v-if="row.status === 0" class="text-warning">待支付</span>
              <span v-else-if="row.status === 1" class="text-success">支付成功</span>
              <span v-else-if="row.status === 2" class="text-danger">支付失败</span>
            </template>
          </el-table-column>
          <el-table-column prop="created_at" label="创建时间" width="180"></el-table-column>
          <!--  
    <el-table-column label="操作" width="180" fixed="right">
       
    </el-table-column> -->
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
  <!-- 充值弹窗组件 -->
  <alipaypayment v-if="rechargeDialogVisible" @close="rechargeDialogVisible = false" />
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import alipaypayment from '@/components/account/alipaypayment.vue';
import * as api from '@/api/index';
//
const rechargeId = ref('');
// 状态管理
const currentBalance = ref(0);

const getCurrentBalance = async () => {
  let res = await api.getUserInfo();

  currentBalance.value = res.userinfo.balance;
}

getCurrentBalance();

// 获取充值记录
const tableData = ref([]);
// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(tableData.value.length);

const getRechargeRecord = async () => {
  let res = await api.rechargeRecord({
    page: currentPage.value,
    pageSize: pageSize.value
  });
  let data = res.list;
  tableData.value = data.data;
  // total,per_page,current_page
  total.value = data.total;
  pageSize.value = data.per_page;
  currentPage.value = data.current_page;

}
getRechargeRecord();

// 筛选条件
const timeRange = ref('all');
const payMethod = ref('all');
const status = ref('');



// 对话框状态
const rechargeDialogVisible = ref(false);
const detailDialogVisible = ref(false);
const detailData = ref({});

// 充值表单
const rechargeForm = ref({
  amount: '',
  method: 'wechat'
});

const rechargeRules = ref({
  amount: [
    { required: true, message: '请输入充值金额', trigger: 'blur' },
    { type: 'number', message: '请输入有效的数字', trigger: 'blur' },
    { min: 0.01, message: '充值金额不能小于0.01元', trigger: 'blur' }
  ],
  method: [
    { required: true, message: '请选择支付方式', trigger: 'change' }
  ]
});

// 充值表单引用
const rechargeFormRef = ref(null);

// 计算属性：当前页数据
const filteredData = computed(() => {
  // status.value 为空字符串时不过滤
  if (status.value === '') return tableData.value;
  // 其它情况，过滤
  return tableData.value.filter(item => String(item.status) === String(status.value));
});

// 方法
const filterData = () => {
  console.log('筛选条件:', { timeRange: timeRange.value, payMethod: payMethod.value, status: status.value });
  // 实际项目中这里会调用API获取数据
};

const resetFilters = () => {
  timeRange.value = 'all';
  payMethod.value = 'all';
  status.value = ''; // 重置充值状态
  rechargeId.value = ''; // 重置充值ID
};

const viewDetail = (row) => {
  detailData.value = { ...row };
  detailDialogVisible.value = true;
};

const retryPayment = (row) => {
  ElMessageBox.confirm(
    `确定要重新支付 ${row.amount} 吗？`,
    '确认支付',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    ElMessage({
      type: 'success',
      message: '已重新发起支付请求'
    });
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消支付'
    });
  });
};

const handleSizeChange = (val) => {
  pageSize.value = val;
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
};

const showRechargeDialog = () => {
  rechargeDialogVisible.value = true;
  rechargeForm.value = {
    amount: '',
    method: 'wechat'
  };
};

function handleQuery() {
  // 如果有分页，重置到第一页
  currentPage.value = 1;
  // filteredData 会自动响应
}




// 页面加载时的初始化
onMounted(() => {
  // 可以添加页面初始化逻辑
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