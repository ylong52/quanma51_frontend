<template>
    <div class="font-inter bg-gray-100 min-h-screen">
      <!-- 主要内容区 -->
      <main class="container mx-auto px-4 py-8">
         
          <!-- 提现表单 -->
    <div class="bg-white rounded-xl shadow-card p-4 mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold">发起提现</h3>
        <div class="text-sm text-gray-500">可用余额: <span class="text-primary font-medium">¥2,358.60</span></div>
      </div>
      
      <div class="form-row">
        <div class="form-item">
          <label class="block text-sm font-medium text-gray-700 mb-1">提现金额</label>
          <div class="relative">
            <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">¥</span>
            <input 
              type="number" 
              id="withdrawAmount" 
              placeholder="请输入提现金额" 
              class="w-full px-3 py-2 pl-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
              min="10"
              step="0.01"
            >
          </div>
          <p class="text-xs text-gray-500 my-4">最低提现金额：10元</p>
        </div>
        
        <div class="form-item">
          <label class="block text-sm font-medium text-gray-700 mb-1">提现方式</label>
          <select 
            id="withdrawMethod" 
            class="w-full py-2 px-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none bg-white"
          >
            <option value="bank">银行卡(****1234)</option>
            <option value="alipay">支付宝(****4321)</option>
            <option value="wechat">微信(****5678)</option>
          </select>
        </div>
        
        <div class="form-item self-end">
          <button 
            id="submitWithdraw" 
            class="bg-primary hover:bg-primary/90 text-white font-medium mt-4 py-2 px-6 rounded-lg transition-all-300 flex items-center w-full sm:w-auto"
          >
            <i class="fa fa-download mr-2"></i> 确认提现
          </button>
        </div>
      </div>
      
      <div class="mt-4 text-sm text-gray-500 flex flex-wrap gap-x-6 gap-y-2">
        <!-- <div><i class="fa fa-info-circle text-blue-500 mr-1"></i> 手续费：提现金额的1%</div> -->
        <div><i class="fa fa-info-circle text-blue-500 mr-1"></i> 预计到账时间：1-3个工作日</div>
      </div>
    </div>

        <!-- 提现列表 -->
        <div class="bg-white rounded-xl shadow-card overflow-hidden">
          <div class="p-6 border-b border-gray-100">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold">我的提现记录</h2>
              <div class="text-sm text-gray-500">共 <span class="text-primary font-medium">{{ total }}</span> 条记录</div>
            </div>
          </div>
          
          <!-- 筛选区域 -->
          <div class="p-6 border-b border-gray-100">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">时间范围</label>
                <div class="relative">
                  <el-select v-model="filters.timeRange" placeholder="请选择时间范围" class="w-full">
                    <el-option v-for="option in timeRangeOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
                  </el-select>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">提现状态</label>
                <div class="relative">
                  <el-select v-model="filters.status" placeholder="请选择提现状态" class="w-full">
                    <el-option v-for="option in statusOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
                  </el-select>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">提现方式</label>
                <div class="relative">
                  <el-select v-model="filters.method" placeholder="请选择提现方式" class="w-full">
                    <el-option v-for="option in methodOptions" :key="option.value" :label="option.label" :value="option.value"></el-option>
                  </el-select>
                </div>
              </div>
            </div>
            <div class="mt-4 flex justify-end space-x-3">
              <el-button @click="resetFilters" link>
                <font-awesome-icon icon="refresh" class="mr-1" /> 重置
              </el-button>
              <el-button @click="fetchWithdrawals" type="primary">
                <font-awesome-icon icon="search" class="mr-1" /> 查询
              </el-button>
            </div>
          </div>
          
          <!-- 列表内容 -->
          <el-table :data="withdrawalList" stripe border class="w-full">
            <el-table-column prop="id" label="提现ID" align="left"></el-table-column>
            <el-table-column prop="applyTime" label="申请时间" align="left"></el-table-column>
            <el-table-column prop="amount" label="提现金额" align="left">
              <template #default="scope">
                <span class="text-primary font-medium">¥{{ scope.row.amount }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="fee" label="手续费" align="left"></el-table-column>
            <el-table-column prop="actualAmount" label="实际到账" align="left">
              <template #default="scope">
                <span v-if="scope.row.actualAmount" class="text-success font-medium">¥{{ scope.row.actualAmount }}</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column prop="method" label="提现方式" align="left">
              <template #default="scope">
                <div class="flex items-center">
                  <font-awesome-icon :icon="getMethodIcon(scope.row.method)" class="text-blue-500 mr-2" />
                  <span>{{ scope.row.methodName }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="提现状态" align="left">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">{{ getStatusText(scope.row.status) }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="left">
              <template #default="scope">
                <el-button link size="small" @click="viewDetail(scope.row)">详情</el-button>
                <el-button v-if="scope.row.status === 'pending'" link size="small" @click="cancelWithdrawal(scope.row.id)">取消</el-button>
                <el-button v-if="scope.row.status === 'rejected'" link size="small" @click="reapply(scope.row.id)">重新申请</el-button>
              </template>
            </el-table-column>
          </el-table>
          
          <!-- 分页 -->
          <div class="p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center">
            <div class="text-sm text-gray-500 mb-4 sm:mb-0">
              显示 <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> 到 <span class="font-medium">{{ Math.min(currentPage * pageSize, total) }}</span> 条，共 <span class="font-medium">{{ total }}</span> 条记录
            </div>
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[5, 10, 20, 50]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="total">
            </el-pagination>
          </div>
        </div>
      </main>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue'
  import { useRouter } from 'vue-router'
  import { library } from '@fortawesome/fontawesome-svg-core'
  import { faRefresh, faSearch, faUser, faWallet, faCreditCard, faHistory, faDownload, faListAlt, faTrophy, faGift, faCog, faChevronLeft, faChevronRight, faInfoCircle, faTimes, faClock, faCheck } from '@fortawesome/free-solid-svg-icons'
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
  import { ElTable, ElTableColumn, ElSelect, ElOption, ElButton, ElTag, ElPagination } from 'element-plus'
  
  // 注册FontAwesome图标
  library.add(
    faRefresh, faSearch, faUser, faWallet, faCreditCard, faHistory, faDownload, 
    faListAlt, faTrophy, faGift, faCog, faChevronLeft, faChevronRight, faInfoCircle, 
    faTimes, faClock, faCheck
  )
  
  // 组件注册
  const components = {
    FontAwesomeIcon,
    ElTable,
    ElTableColumn,
    ElSelect,
    ElOption,
    ElButton,
    ElTag,
    ElPagination
  }
  
  const router = useRouter()
  
  // 状态管理
  const withdrawalList = ref([])
  const total = ref(28)
  const currentPage = ref(1)
  const pageSize = ref(5)
  const filters = ref({
    timeRange: 'all',
    status: 'all',
    method: 'all'
  })
  
  // 选项数据
  const timeRangeOptions = [
    { value: 'all', label: '全部' },
    { value: 'today', label: '今天' },
    { value: 'yesterday', label: '昨天' },
    { value: '7days', label: '近7天' },
    { value: 'month', label: '本月' },
    { value: 'lastMonth', label: '上月' },
    { value: 'custom', label: '自定义' }
  ]
  
  const statusOptions = [
    { value: 'all', label: '全部' },
    { value: 'pending', label: '审核中' },
    { value: 'approved', label: '已通过' },
    { value: 'rejected', label: '已拒绝' },
    { value: 'processing', label: '提现中' },
    { value: 'completed', label: '已到账' },
    { value: 'cancelled', label: '已取消' }
  ]
  
  const methodOptions = [
    { value: 'all', label: '全部' },
    { value: 'bank', label: '银行卡' },
    { value: 'alipay', label: '支付宝' },
    { value: 'wechat', label: '微信' }
  ]
  
  // 获取提现方式图标
  const getMethodIcon = (method) => {
    switch(method) {
      case 'bank':
        return 'credit-card'
      case 'alipay':
        return 'credit-card'
      case 'wechat':
        return 'credit-card'
      default:
        return 'question-circle'
    }
  }
  
  // 获取状态文本
  const getStatusText = (status) => {
    const statusMap = {
      'pending': '审核中',
      'approved': '已通过',
      'rejected': '已拒绝',
      'processing': '提现中',
      'completed': '已到账',
      'cancelled': '已取消'
    }
    return statusMap[status] || '未知状态'
  }
  
  // 获取状态标签类型
  const getStatusType = (status) => {
    const typeMap = {
      'pending': 'info',
      'approved': 'primary',
      'rejected': 'danger',
      'processing': 'warning',
      'completed': 'success',
      'cancelled': 'info'
    }
    return typeMap[status] || 'default'
  }
  
  // 生命周期钩子
  onMounted(() => {
    fetchWithdrawals()
  })
  
  // 获取提现列表
  const fetchWithdrawals = () => {
    // 模拟API请求
    const mockData = [
      { id: 3001, applyTime: '2025-07-15 10:20', amount: '500.00', fee: '5.00', actualAmount: '495.00', method: 'bank', methodName: '银行卡(****1234)', status: 'completed' },
      { id: 3002, applyTime: '2025-07-12 16:45', amount: '200.00', fee: '2.00', actualAmount: '198.00', method: 'alipay', methodName: '支付宝(****4321)', status: 'completed' },
      { id: 3003, applyTime: '2025-07-10 09:10', amount: '1000.00', fee: '10.00', actualAmount: null, method: 'wechat', methodName: '微信(****5678)', status: 'pending' },
      { id: 3004, applyTime: '2025-07-08 14:30', amount: '300.00', fee: '3.00', actualAmount: null, method: 'bank', methodName: '银行卡(****8765)', status: 'rejected' },
      { id: 3005, applyTime: '2025-07-05 11:50', amount: '800.00', fee: '8.00', actualAmount: '792.00', method: 'alipay', methodName: '支付宝(****4321)', status: 'completed' }
    ]
    
    // 模拟过滤和分页
    withdrawalList.value = mockData
  }
  
  // 重置筛选条件
  const resetFilters = () => {
    filters.value = {
      timeRange: 'all',
      status: 'all',
      method: 'all'
    }
  }
  
  // 分页事件处理
  const handleSizeChange = (newSize) => {
    pageSize.value = newSize
    fetchWithdrawals()
  }
  
  const handleCurrentChange = (newPage) => {
    currentPage.value = newPage
    fetchWithdrawals()
  }
  
  // 操作方法
  const viewDetail = (row) => {
    router.push({ name: 'WithdrawalDetail', params: { id: row.id } })
  }
  
  const cancelWithdrawal = (id) => {
    ElMessageBox.confirm(
      '确定要取消该提现申请吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    ).then(() => {
      // 模拟取消操作
      ElMessage({
        type: 'success',
        message: '提现申请已取消'
      })
      fetchWithdrawals()
    }).catch(() => {
      // 取消操作
    })
  }
  
  const reapply = (id) => {
    router.push({ name: 'WithdrawalReapply', params: { id } })
  }
  </script>
  
  <style scoped>
 

/* 自定义样式 - 只保留 Tailwind 中没有的 */
.shadow-card {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.08);
}

.text-primary {
  color: #165DFF;
}

.text-success {
  color: #52c41a;
}

.hover-scale {
  transition: transform 0.2s ease;
}

.hover-scale:hover {
  transform: scale(1.02);
}

.font-inter {
  font-family: 'Inter', sans-serif;
}
  </style>