<template>
  <el-config-provider :locale="zhCn">
    <main class="min-h-screen bg-gray-100 flex flex-col ">
      <div class="w-full max-w-md mx-auto flex-1 pb-20"> <!-- 给底部留空间 -->
        <!-- 顶部头部 -->
        <div class="flex items-center px-2 py-2 bg-white border-b border-gray-100 sticky top-0 z-10">
          <button @click="$router.back()" class="text-gray-400 text-lg mr-2">
            <font-awesome-icon icon="arrow-left" />
          </button>
          <div class="flex-1 flex items-center bg-gray-100 rounded-full px-2 py-1">
            <font-awesome-icon icon="search" class="text-gray-400 mr-1" />
            <input v-model="searchKeyword" @keyup.enter="searchOrders" type="text" placeholder="所有单号/商品名称/充值账号/卡密"
              class="flex-1 bg-transparent border-0 outline-none text-sm px-1" />
          </div>
          <router-link to="/personal/index" class="ml-2 text-gray-400 text-lg">
            <font-awesome-icon icon="user-circle" />
          </router-link>
        </div>
        <!-- tabs -->
        <div
          class="flex justify-between items-center bg-white px-2 pt-2 pb-1 border-b border-gray-100 sticky top-[48px] z-10">
          <button v-for="tab in [
            { label: '全部', name: 'all' },
            { label: '待付款', name: '0' },         
            { label: '已完成', name: '1' },
            { label: '已退款', name: 'refund' }
          ]" :key="tab.name" @click="activeTab = tab.name"
            :class="['px-2 pb-1 text-sm font-medium border-b-2', activeTab === tab.name ? 'text-orange-500 border-orange-500' : 'text-gray-500 border-transparent']">
            {{ tab.label }}
          </button>
        </div>
        <!-- 订单管理卡片 -->
        <div class="px-2 py-2">
          <div class="space-y-4">
            <!-- 加载状态 -->
            <div v-if="isLoading" class="flex justify-center items-center py-8 text-gray-400">
              <font-awesome-icon icon="spinner" spin class="mr-2" />加载中...
            </div>
            <!-- 空状态 -->
            <div v-else-if="filteredOrders.length === 0" class="flex justify-center items-center py-8 text-gray-400">
              暂无订单数据
            </div>
            <!-- 订单卡片 -->
            <div v-else v-for="order in filteredOrders" :key="order.id"
              class="rounded-xl bg-white shadow border border-gray-100 overflow-hidden">
              <div class="flex justify-between items-center px-4 py-2 border-b border-gray-50">
                <div class="text-xs text-gray-500">
                  <span class="font-bold text-gray-800">订单号：{{ order.order_number }}</span>
                  <span class="ml-3">{{ order.created_at }}</span>
                </div>
                <div class="font-medium flex items-center" :class="{
                  'text-orange-500': order.status === 0,
                  'text-green-500': order.status === 1,
                  'text-gray-500': order.status === 2,
                  'text-red-500': order.status === 3
                }">
                  <font-awesome-icon v-if="order.status === 0" icon="clock" class="mr-1" />
                  <font-awesome-icon v-if="order.status === 1" icon="check-circle" class="mr-1" />
                  <font-awesome-icon v-if="order.status === 2" icon="ban" class="mr-1" />
                  <font-awesome-icon v-if="order.status === 3" icon="times-circle" class="mr-1" />
                  {{ order.status_text }}
                </div>
              </div>
              <div class="flex items-center px-4 py-3 border-b border-gray-50">
                <img :src="order.product_img" alt="商品图片" class="w-16 h-16 object-cover rounded mr-3" />
                <div class="flex-1 min-w-0">
                  <div class="font-medium truncate">{{ order.product_name }}</div>
                  <div class="text-xs text-gray-400 mt-1 truncate">{{ order.productSpec }}</div>
                </div>
                <div class="text-right ml-2">
                  <div class="font-bold text-base text-gray-800">¥{{ order.item_price }}</div>
                  <div class="text-xs text-gray-400">x{{ order.buynumber }}</div>
                </div>
              </div>
              <div class="flex justify-between items-center px-4 py-2">
                <div class="text-base font-medium">
                  总计：<span class="text-blue-500 font-bold">¥{{ order.real_amount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 固定底部分页 -->
      <div class="fixed left-0 right-0 bottom-0 bg-white border-t border-gray-200 z-20 max-w-md mx-auto w-full">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[5, 10, 20]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="filteredOrdersTotal" class="bg-white rounded shadow px-2" :background="true" :small="true" />
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
import { faHouse, faUser, faList, faClock, faTruck, faBoxOpen, faCheckCircle, faBan, faCreditCard, faTimesCircle, faCheck, faFileAlt, faStar, faUserCircle, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { orderList } from '@/api'
library.add(faHouse, faUser, faList, faClock, faTruck, faBoxOpen, faCheckCircle, faBan, faCreditCard, faTimesCircle, faCheck, faFileAlt, faStar, faUserCircle, faArrowLeft)

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
    // console.log('搜索过滤(总数):', keyword, '原始数据量:', filtered.length)
    filtered = filtered.filter(order =>
      (order.order_number && order.order_number.includes(keyword)) ||
      (order.product_name && order.product_name.toLowerCase().includes(keyword))
    )
    // console.log('搜索后数据量(总数):', filtered.length)
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

const getUserBalance = async () => {
  const res = await getUserBalance()
  console.log("res==", res)
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
    console.log("orders.value==", orders.value)
    //分页面
    currentPage.value = res.data.pagination.current_page;
    pageSize.value = res.data.pagination.per_page;
    total.value = res.data.pagination.total;
    console.log("currentPage.value=", currentPage.value, "pageSize.value=", pageSize.value, "total.value=", total.value)
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

.apple-btn:active,
.apple-btn:focus {
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