<template>
  <el-config-provider :locale="zhCn">
  <main class="flex-grow container mx-auto px-1 py-1 order-container">
     
    <!-- 订单管理 -->
    <div class="max-w-4xl mx-auto">
      <div class="apple-card mb-1">
        <div class="p-1">
          <!-- 订单状态选项卡 -->
          <el-tabs v-model="activeTab" class="mb-1" @tab-change="handleTabChange" size="small">
            <!-- 订单状态,0未支付，1表示成功,2表示失败，3表示取消 -->
            <el-tab-pane label="全部" name="all"></el-tab-pane>
            <el-tab-pane label="成功" name="1"></el-tab-pane>
            <el-tab-pane label="未支付" name="0"></el-tab-pane>
            <el-tab-pane label="取消" name="3"></el-tab-pane>
          </el-tabs>
          <!-- 搜索和筛选 -->
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-1 space-y-1 md:space-y-0">
            <div class="flex items-center space-x-1 w-full md:w-auto">
              <el-input 
                v-model="searchKeyword" 
                placeholder="搜索订单号、商品名称" 
                class="w-full md:w-80"
                @keyup.enter="searchOrders"
                size="small"
              >
                <template #append>
                  <el-button @click="searchOrders" icon="el-icon-search" size="small">搜索</el-button>
                </template>
              </el-input>
            </div>
          </div>
       
          <!-- 订单列表 -->
          <div class="space-y-1 order-list">
            <!-- 加载状态 -->
            <div v-if="isLoading" class="flex justify-center items-center py-1">
              <el-loading-spinner></el-loading-spinner>
              <span class="ml-2 text-xs">加载中...</span>
            </div>
            <!-- 空状态 -->
            <div v-else-if="filteredOrders.length === 0" class="flex justify-center items-center py-1 text-gray-500 text-xs">
              暂无订单数据
            </div>
            <!-- 订单列表 -->
            <div v-else v-for="order in filteredOrders" :key="order.id" class="order-item">
              <!-- 订单头部 -->
              <div class="order-item-header">
                <div class="text-gray-600 text-xs">
                  <div>
                    <span class="text-bold text-black">订单号：{{ order.order_number }}</span>
                  </div>
                  <div>
                    <span class="text-xs text-gray-400">{{ order.created_at }}</span>
                  </div>
                </div>
                <div class="font-medium text-xs" :class="{
                  'text-orange-500': order.status === 0,   // 未支付
                  'text-green-500': order.status === 1,    // 成功
                  'text-gray-500': order.status === 2,     // 失败
                  'text-red-500': order.status === 3       // 取消
                }">
                  <font-awesome-icon v-if="order.status === 0" icon="clock" class="mr-1" />
                  <font-awesome-icon v-if="order.status === 1" icon="check-circle" class="mr-1" />
                  <font-awesome-icon v-if="order.status === 2" icon="ban" class="mr-1" />
                  <font-awesome-icon v-if="order.status === 3" icon="times-circle" class="mr-1" />
                  {{ order.status_text }}
                </div>
              </div>
              <!-- 订单内容 -->
              <div class="order-item-content">
                <img :src="order.product_img" alt="商品图片" class="product-image">
                <div class="flex-1 min-w-0">
                  <div class="font-medium text-xs truncate">{{ order.product_name }}</div>
                  <div class="text-xs text-gray-500 truncate">{{ order.productSpec }}</div>
                </div>
                <div class="text-right ml-2 flex flex-col items-end">
                  <div class="font-medium text-xs">¥{{ order.item_price }}</div>
                  <div class="text-xs text-gray-500">x{{ order.buynumber }}</div>
                </div>
              </div>
              <!-- 订单底部 -->
              <div class="order-item-footer">
                <div class="text-xs font-medium">
                  总计：<span class="text-primary">¥{{ order.real_amount }}</span>
                </div>
                <div class="flex space-x-1">
                  <!-- 按钮区域 -->
                </div>
              </div>
            </div>
          </div>
          <!-- 分页 -->
          <div class="flex justify-center mt-2">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-size="pageSize"
              layout="prev, pager, next"
              :total="total"
              small
              background
              hide-on-single-page
              :pager-count="5"
              class="mini-pagination"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </main>
</el-config-provider>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { ElConfigProvider } from 'element-plus'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHouse, faUser, faList, faClock, faTruck, faBoxOpen, faCheckCircle, faBan, faCreditCard, faTimesCircle, faCheck, faFileAlt, faStar } from '@fortawesome/free-solid-svg-icons'
import { orderList } from '@/api'
library.add(faHouse, faUser, faList, faClock, faTruck, faBoxOpen, faCheckCircle, faBan, faCreditCard, faTimesCircle, faCheck, faFileAlt, faStar)

// 注册全局组件（如果未全局注册）
// app.component('font-awesome-icon', FontAwesomeIcon)

// 订单状态数据
const activeTab = ref('all')
const searchKeyword = ref('')
const timeFilter = ref('all')
const currentPage = ref(1)
const pageSize = ref(5)

// 模拟订单数据
const orders = ref([])

// 计算过滤后的订单总数（不分页）
const filteredOrdersTotal = computed(() => {
  // 如果有搜索或过滤，使用前端过滤后的数量
  if (searchKeyword.value || activeTab.value !== 'all' || timeFilter.value !== 'all') {
    let filtered = [...orders.value]
    if (activeTab.value !== 'all') {
      // 直接使用数字状态值进行过滤
      filtered = filtered.filter(order => order.status === parseInt(activeTab.value))
    }
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      filtered = filtered.filter(order =>
        (order.order_number && order.order_number.includes(keyword)) ||
        (order.product_name && order.product_name.toLowerCase().includes(keyword))
      )
    }
    if (timeFilter.value !== 'all') {
      if (timeFilter.value === 'month') {
        filtered = filtered.filter((_, index) => index < 3)
      } else if (timeFilter.value === 'quarter') {
        filtered = filtered.filter((_, index) => index < 5)
      }
    }
    return filtered.length
  }
  
  // 否则使用后端返回的total
  return total.value
})

// 计算过滤+分页后的订单
const isLoading = ref(false);

const filteredOrders = computed(() => {
  // 如果还在加载中，返回空数组
  if (isLoading.value) {
    return [];
  }
  
  // 如果订单数组为空，直接返回空数组
  if (!orders.value || orders.value.length === 0) {
    return [];
  }
  
  let filtered = [...orders.value];
    
  if (activeTab.value !== 'all') {
    // 直接使用数字状态值进行过滤
    filtered = filtered.filter(order => order.status === parseInt(activeTab.value));
  }
  
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    filtered = filtered.filter(order =>
      (order.order_number && order.order_number.includes(keyword)) ||
      (order.product_name && order.product_name.toLowerCase().includes(keyword))
    );
  }
  
  // 不在前端进行分页，使用后端分页
  return filtered;
})

// 搜索订单
function searchOrders() {
  console.log('搜索关键词:', searchKeyword.value)
  currentPage.value = 1 // 重置到第一页
}

// 状态选项卡切换事件
function handleTabChange(tabName) {
  console.log('状态选项卡切换:', tabName)
  currentPage.value = 1 // 重置到第一页
}

// 时间筛选器变化事件
function handleTimeFilterChange(value) {
  console.log('时间筛选器变化:', value)
  currentPage.value = 1 // 重置到第一页
}
// 分页相关方法
function handleSizeChange(newSize) {
  pageSize.value = newSize;
  currentPage.value = 1; // 改变每页条数时重置为第一页
  getOrders(); // 重新获取数据
}

function handleCurrentChange(newPage) {
  currentPage.value = newPage;
  getOrders(); // 重新获取数据
}
// 订单操作方法
function payOrder(order) {
  ElMessage.success(`支付订单 ${order.order_number}`)
}
function cancelOrder(order) {
  ElMessageBox.confirm(
    '确定要取消该订单吗？',
    '取消订单',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    order.status = 'cancelled'
    order.statusText = '已取消'
    ElMessage({
      type: 'success',
      message: '订单已取消'
    })
  })
}
function confirmReceipt(order) {
  ElMessageBox.confirm(
    '确认已收到商品？',
    '确认收货',
    {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    order.status = 'completed'
    order.statusText = '已完成'
    ElMessage({
      type: 'success',
      message: '收货确认成功'
    })
  })
}
function viewOrderDetail(order) {
  ElMessage.info(`查看订单 ${order.order_number} 详情`)
}
function leaveReview(order) {
  ElMessage.info(`对 ${order.product_name} 进行评价`)
}

const total = ref(0)
const getOrders = async () => {
  isLoading.value = true; // 开始加载
  try {
    console.log("请求参数:", { page: currentPage.value, pageSize: pageSize.value });
    
    const res = await orderList({
      page: currentPage.value,
      pageSize: pageSize.value
    });
    
    console.log("API返回数据:", res);
    
    if (!res.data || !res.data.orders) {
      console.error("API返回数据格式错误:", res);
      orders.value = [];
      return;
    }
   
    orders.value = res.data.orders;
    console.log("设置订单数据:", orders.value);
    
    // 更新分页参数
    if (res.data.pagination) {
      currentPage.value = res.data.pagination.current_page;
      pageSize.value = res.data.pagination.per_page;
      total.value = res.data.pagination.total;
      
      console.log("更新分页参数:", {
        currentPage: currentPage.value,
        pageSize: pageSize.value, 
        total: total.value,
        lastPage: res.data.pagination.last_page,
        from: res.data.pagination.from,
        to: res.data.pagination.to
      });
    }
  } catch (error) {
    console.error('获取订单列表失败:', error);
    orders.value = []; // 出错时清空订单列表
  } finally {
    isLoading.value = false; // 加载完成
  }
}
// 监听搜索关键词变化
watch(searchKeyword, (newValue) => {
  console.log('搜索关键词变化:', newValue)
  currentPage.value = 1 // 重置到第一页
})

onMounted(() => {
  getOrders()
})

</script>

<style scoped>
/* 已移除 font-awesome 外链 import，保留本地样式 */
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
.apple-btn {
  background: #0071e3;
  color: #fff;
  border-radius: 9999px;
  font-weight: 500;
  padding: 0.75rem 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.apple-btn:active, .apple-btn:focus {
  outline: none;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}
.apple-btn-outline {
  border: 1px solid #d1d5db;
  color: #374151;
  border-radius: 9999px;
  font-weight: 500;
  padding: 0.75rem 2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.apple-btn-outline:hover {
  border-color: #0071e3;
  color: #0071e3;
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
  border-color: #0071e3;
  box-shadow: 0 0 0 2px #0071e355;
}
.order-item {
  transition: all 0.2s ease;
}
.order-item:hover {
  transform: translateY(-1px);
}

.order-container {
  height: calc(100vh - 80px);
  overflow-y: auto;
}

/* 自定义分页器样式 - 手机端优化 */
:deep(.el-pagination) {
  --el-pagination-button-width: 28px;
  --el-pagination-button-height: 28px;
  font-size: 12px;
}

:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next) {
  min-width: 28px;
  padding: 0;
}

:deep(.el-pagination .el-pager li) {
  min-width: 24px;
  height: 24px;
  line-height: 24px;
  font-size: 12px;
  margin: 0 2px;
}

.order-list {
  max-height: calc(100vh - 180px);
  overflow-y: auto;
  margin: 0;
  padding: 0;
}

.order-container::-webkit-scrollbar {
  width: 5px;
}

.order-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.order-container::-webkit-scrollbar-thumb {
  background: #ccc;
  border-radius: 10px;
}

.order-container::-webkit-scrollbar-thumb:hover {
  background: #aaa;
}

/* 更紧凑的订单项样式 */
.order-item {
  margin-bottom: 1px;
  border-radius: 4px;
  border: 1px solid #f0f0f0;
  background-color: white;
  overflow: hidden;
}

.order-item-header {
  padding: 4px 8px;
  background-color: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-item-content {
  padding: 6px 8px;
  display: flex;
  align-items: center;
}

.order-item-footer {
  padding: 4px 8px;
  background-color: #fafafa;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.product-image {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 8px;
}

.order-list::-webkit-scrollbar {
  width: 4px;
}

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
    