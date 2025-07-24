<template>
  <main class="flex-grow container mx-auto px-6 py-10">
     
    <!-- 订单管理 -->
    <div class="max-w-4xl mx-auto">
      <div class="apple-card mb-6">
        <div class="p-6">
          <!-- 订单状态选项卡 -->
          <el-tabs v-model="activeTab" class="mb-6" @tab-change="handleTabChange">
            <!-- 订单状态,0未支付，1表示成功,2表示失败，3表示取消 -->
            <el-tab-pane label="全部" name="all"></el-tab-pane>
            <el-tab-pane label="成功" name="1"></el-tab-pane>
            <el-tab-pane label="未支付" name="0"></el-tab-pane>
          
        
            <el-tab-pane label="取消" name="3"></el-tab-pane>
          </el-tabs>
          <!-- 搜索和筛选 -->
          <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
            <div class="flex items-center space-x-2 w-full md:w-auto">
              <el-input 
                v-model="searchKeyword" 
                placeholder="搜索订单号、商品名称" 
                class="w-full md:w-80"
                @keyup.enter="searchOrders"
              >
                <template #append>
                  <el-button @click="searchOrders" icon="el-icon-search">搜索</el-button>
                </template>
              </el-input>
            </div>
            <div class="flex items-center space-x-3">
              <el-select v-model="timeFilter" placeholder="时间范围" class="w-40" @change="handleTimeFilterChange">
                <el-option label="全部时间" value="all"></el-option>
                <el-option label="最近一周" value="week"></el-option>
                <el-option label="最近一个月" value="month"></el-option>
                <el-option label="最近三个月" value="quarter"></el-option>
                <el-option label="最近半年" value="halfyear"></el-option>
              </el-select>
               
            </div>
          </div>
       
          <!-- 订单列表 -->
          <div class="space-y-4">
            <!-- 加载状态 -->
            <div v-if="isLoading" class="flex justify-center items-center py-8">
              <el-loading-spinner></el-loading-spinner>
              <span class="ml-2">加载中...</span>
            </div>
            <!-- 空状态 -->
            <div v-else-if="filteredOrders.length === 0" class="flex justify-center items-center py-8 text-gray-500">
              暂无订单数据
            </div>
            <!-- 订单列表 -->
            <el-card v-else class="order-item " v-for="order in filteredOrders" :key="order.id">
              <div class="el-card__header flex justify-between items-center border-b border-gray-100">
                <div class="text-gray-600  mt-2 ">
                  <span class="text-bold text-black ">订单号：{{ order.order_number }}</span>
                  <span class="ml-4">{{ order.created_at }}</span>
                </div>
                <div class="font-medium" :class="{
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
              <div class="el-card__body p-0">
                <div class="border-b border-gray-100">
                  <div class="flex items-center p-4 hover:bg-gray-50 transition-custom">
                    <img :src="order.product_img" alt="商品图片" class="w-20 h-20 object-cover rounded mr-4">
                    <div class="flex-1">
                      <div class="font-medium">{{ order.product_name }}</div>
                      <div class="text-sm text-gray-500 mt-1">{{ order.productSpec }}</div>
                    </div>
                    <div class="text-right ml-4">
                      <div class="font-medium">¥{{ order.item_price }}</div>
                      <div class="text-sm text-gray-500">x{{ order.buynumber }}</div>
                    </div>
                  </div>
                </div>
                <div class="p-4 flex justify-between items-center">
                  <div class="text-lg font-medium">
                    总计：<span class="text-primary">¥{{ order.real_amount }}</span>
                  </div>
                  <div class="flex space-x-2">
                    <!-- <el-button v-if="order.status === 0" type="primary" @click="payOrder(order)">
                      <font-awesome-icon icon="credit-card" class="mr-1" />立即付款
                    </el-button>
                    <el-button v-if="order.status === 0" link @click="cancelOrder(order)">
                      <font-awesome-icon icon="times-circle" class="mr-1" />取消订单
                    </el-button> -->
                    <!-- <el-button v-if="order.status === 1" type="primary" @click="confirmReceipt(order)">
                      <font-awesome-icon icon="check" class="mr-1" />确认收货
                    </el-button>
                    <el-button v-if="order.status === 1" link @click="viewOrderDetail(order)">
                      <font-awesome-icon icon="file-alt" class="mr-1" />查看详情
                    </el-button>
                    <el-button v-if="order.status === 1" link @click="leaveReview(order)">
                      <font-awesome-icon icon="star" class="mr-1" />评价商品
                    </el-button> -->
                  </div>
                </div>
              </div>
            </el-card>
          </div>
          <!-- 分页 -->
          <div class="flex justify-center mt-8">
            <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="currentPage"
              :page-sizes="[5, 10, 20]"
              :page-size="pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="filteredOrdersTotal"
            >
            </el-pagination>
          </div>
        </div>
      </div>
    </div>
  </main>
 
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
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
  let filtered = [...orders.value]
  if (activeTab.value !== 'all') {
    // 直接使用数字状态值进行过滤
    filtered = filtered.filter(order => order.status === parseInt(activeTab.value))
  }
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    console.log('搜索过滤(总数):', keyword, '原始数据量:', filtered.length)
    filtered = filtered.filter(order =>
      (order.order_number && order.order_number.includes(keyword)) ||
      (order.product_name && order.product_name.toLowerCase().includes(keyword))
    )
    console.log('搜索后数据量(总数):', filtered.length)
  }
  if (timeFilter.value !== 'all') {
    if (timeFilter.value === 'month') {
      filtered = filtered.filter((_, index) => index < 3)
    } else if (timeFilter.value === 'quarter') {
      filtered = filtered.filter((_, index) => index < 5)
    }
  }
  return filtered.length
})

// 计算过滤+分页后的订单
const isLoading = ref(false);

const filteredOrders = computed(() => {
  // 如果还在加载中，返回空数组
  if (isLoading.value) {
    return [];
  }
  
  let filtered = [...orders.value]
    
  if (activeTab.value !== 'all') {
    // 直接使用数字状态值进行过滤
    filtered = filtered.filter(order => order.status === parseInt(activeTab.value))
  }
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    console.log('搜索过滤(列表):', keyword, '原始数据量:', filtered.length)
    filtered = filtered.filter(order =>
      (order.order_number && order.order_number.includes(keyword)) ||
      (order.product_name && order.product_name.toLowerCase().includes(keyword))
    )
    console.log('搜索后数据量(列表):', filtered.length)
  }
  if (timeFilter.value !== 'all') {
    if (timeFilter.value === 'month') {
      filtered = filtered.filter((_, index) => index < 3)
    } else if (timeFilter.value === 'quarter') {
      filtered = filtered.filter((_, index) => index < 5)
    }
  }

  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filtered.slice(start, end)
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
  pageSize.value = newSize
}
function handleCurrentChange(newPage) {
  currentPage.value = newPage
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
    const res = await orderList({
      page: currentPage.value,
      pageSize: pageSize.value
    })
   
    orders.value = res.data.orders;
    console.log("orders.value==",orders.value)
    //分页面
    currentPage.value = res.data.pagination.current_page;
    pageSize.value = res.data.pagination.per_page;
    total.value = res.data.pagination.total;
    console.log("currentPage.value=",currentPage.value, "pageSize.value=", pageSize.value, "total.value=", total.value)
  } catch (error) {
    console.error('获取订单列表失败:', error);
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
  transform: translateY(-2px);
}
</style>
    