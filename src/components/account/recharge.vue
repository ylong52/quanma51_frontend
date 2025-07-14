<template>
  <template v-if="rechargeDialogVisible==false"> 
  <div class="container mx-auto px-4 py-8">
   
    <!-- 页面标题 -->
    <PageHeader title="我的充值记录" />
    
    <!-- 余额信息 -->
    <el-card class="mb-6">
      <template #header>
        <div class="flex justify-between items-center">
          <span>当前余额222</span>
          <el-button type="primary" size="medium" @click="showRechargeDialog">
            <i class="fa fa-plus-circle"></i> 充值222
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
        <el-col :span="6">
          <el-select v-model="timeRange" placeholder="时间范围" clearable size="medium">
            <el-option label="全部" value="all"></el-option>
            <el-option label="今天" value="today"></el-option>
            <el-option label="昨天" value="yesterday"></el-option>
            <el-option label="近7天" value="7days"></el-option>
            <el-option label="本月" value="month"></el-option>
            <el-option label="上月" value="lastMonth"></el-option>
            <el-option label="自定义" value="custom"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="payMethod" placeholder="充值方式" clearable size="medium">
            <el-option label="全部" value="all"></el-option>
            <el-option label="微信支付" value="wechat"></el-option>
            <el-option label="支付宝" value="alipay"></el-option>
            <el-option label="银行卡" value="bank"></el-option>
            <el-option label="Apple Pay" value="applePay"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-select v-model="status" placeholder="充值状态" clearable size="medium">
            <el-option label="全部" value="all"></el-option>
            <el-option label="成功" value="success"></el-option>
            <el-option label="失败" value="fail"></el-option>
            <el-option label="处理中" value="processing"></el-option>
            <el-option label="已退款" value="refunded"></el-option>
          </el-select>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="filterData" size="medium">
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
<el-table
        :data="currentData"
    border
    stripe
    fit
    highlight-current-row
    size="medium"
    :header-cell-style="{ background: '#f5f7fa', color: '#606266' }"
  >
    <el-table-column type="index" label="序号" width="80"></el-table-column>
    <el-table-column prop="id" label="充值ID" width="120"></el-table-column>
    <el-table-column prop="time" label="充值时间" width="180"></el-table-column>
<el-table-column prop="amount" label="充值金额" width="120">
        <template #default="{ row = {} }">
          <span class="text-success font-weight-bold">{{ row.amount }}</span>
        </template>
      </el-table-column>
    <el-table-column prop="method" label="支付方式" width="120"></el-table-column>
    <el-table-column prop="arrival" label="实际到账" width="120">
       
    </el-table-column>
    <el-table-column prop="status" label="充值状态" width="120">
  
    </el-table-column>
    <el-table-column label="操作" width="180" fixed="right">
       
    </el-table-column>
  </el-table>


    </div>
    
    <!-- 分页区域 -->
    <div class="mt-8 text-center">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
 
  </div>
  </template>
<!-- 充值弹窗组件 -->
<alipaypayment v-if="rechargeDialogVisible" @close="rechargeDialogVisible = false" />
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import alipaypayment from '@/components/account/alipaypayment.vue';
// 状态管理
const currentBalance = ref(125.50);

const tableData = ref([
  {
    id: 2001,
    time: '2025-07-12 08:45',
    amount: '¥100.00',
    method: '微信支付',
    arrival: '¥100.00',
    status: '成功',
    orderNo: 'PAY20250712001',
    channel: '微信支付',
    remark: '用户正常充值'
  },
  {
    id: 2002,
    time: '2025-07-10 15:30',
    amount: '¥200.00',
    method: '支付宝',
    arrival: '¥200.00',
    status: '成功',
    orderNo: 'PAY20250710002',
    channel: '支付宝',
    remark: '用户正常充值'
  },
  {
    id: 2003,
    time: '2025-07-08 11:20',
    amount: '¥500.00',
    method: '银行卡',
    arrival: '¥0.00',
    status: '失败',
    orderNo: 'PAY20250708003',
    channel: '招商银行',
    remark: '银行卡余额不足，支付失败'
  },
  {
    id: 2004,
    time: '2025-07-05 19:10',
    amount: '¥300.00',
    method: '微信支付',
    arrival: '¥300.00',
    status: '成功',
    orderNo: 'PAY20250705004',
    channel: '微信支付',
    remark: '用户正常充值'
  },
  {
    id: 2005,
    time: '2025-07-03 14:25',
    amount: '¥1000.00',
    method: 'Apple Pay',
    arrival: '¥1000.00',
    status: '处理中',
    orderNo: 'PAY20250703005',
    channel: '工商银行',
    remark: '支付已受理，正在处理中'
  },
  {
    id: 2006,
    time: '2025-07-02 10:15',
    amount: '¥50.00',
    method: '支付宝',
    arrival: '¥50.00',
    status: '已退款',
    orderNo: 'PAY20250702006',
    channel: '支付宝',
    remark: '用户申请退款，已处理'
  }
]);

// 筛选条件
const timeRange = ref('all');
const payMethod = ref('all');
const status = ref('all');

// 分页参数
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(tableData.value.length);

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
const currentData = computed(() => {
  // 模拟筛选和分页
  let filteredData = tableData.value;
  
  // 时间范围筛选
  if (timeRange.value !== 'all') {
    // 实际项目中这里会根据不同时间范围筛选
    filteredData = filteredData;
  }
  
  // 支付方式筛选
  if (payMethod.value !== 'all') {
    filteredData = filteredData.filter(item => item.method === payMethod.value);
  }
  
  // 状态筛选
  if (status.value !== 'all') {
    filteredData = filteredData.filter(item => item.status === status.value);
  }
  
  // 更新总数
  total.value = filteredData.length;
  
  // 分页
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredData.slice(start, end);
});

// 方法
const filterData = () => {
  console.log('筛选条件:', { timeRange: timeRange.value, payMethod: payMethod.value, status: status.value });
  // 实际项目中这里会调用API获取数据
};

const resetFilters = () => {
  timeRange.value = 'all';
  payMethod.value = 'all';
  status.value = 'all';
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