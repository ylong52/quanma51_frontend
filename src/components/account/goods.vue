<template>
  <main class="flex-grow container mx-auto px-6 py-10">
     
    <!-- 订单管理 -->
    <div class="max-w-4xl mx-auto">
      <div class="apple-card mb-6">
        <div class="p-6">
          <!-- 订单状态选项卡 -->
          <el-tabs v-model="activeTab" class="mb-6">
            <el-tab-pane label="全部" name="all"></el-tab-pane>
            <el-tab-pane label="待付款" name="pending"></el-tab-pane>
            <el-tab-pane label="待发货" name="shipping"></el-tab-pane>
            <el-tab-pane label="待收货" name="received"></el-tab-pane>
            <el-tab-pane label="已完成" name="completed"></el-tab-pane>
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
              <el-select v-model="timeFilter" placeholder="时间范围" class="w-40">
                <el-option label="全部时间" value="all"></el-option>
                <el-option label="最近一个月" value="month"></el-option>
                <el-option label="最近三个月" value="quarter"></el-option>
                <el-option label="最近半年" value="halfyear"></el-option>
              </el-select>
              <el-select v-model="amountFilter" placeholder="金额范围" class="w-40">
                <el-option label="全部金额" value="all"></el-option>
                <el-option label="0-100元" value="0-100"></el-option>
                <el-option label="100-500元" value="100-500"></el-option>
                <el-option label="500-1000元" value="500-1000"></el-option>
                <el-option label="1000元以上" value="1000+"></el-option>
              </el-select>
            </div>
          </div>
          <!-- 订单列表 -->
          <div class="space-y-4">
            <el-card class="order-item " v-for="order in filteredOrders" :key="order.id">
              <div class="el-card__header flex justify-between items-center border-b border-gray-100">
                <div class="text-gray-600  mt-2 ">
                  <span class="text-bold text-black ">订单号：{{ order.orderNumber }}</span>
                  <span class="ml-4">{{ order.createTime }}</span>
                </div>
                <div class="font-medium" :class="{
                  'text-orange-500': order.status === 'pending',
                  'text-blue-500': order.status === 'shipping',
                  'text-purple-500': order.status === 'received',
                  'text-green-500': order.status === 'completed',
                  'text-gray-500': order.status === 'cancelled'
                }">
                  <font-awesome-icon v-if="order.status === 'pending'" icon="clock" class="mr-1" />
                  <font-awesome-icon v-if="order.status === 'shipping'" icon="truck" class="mr-1" />
                  <font-awesome-icon v-if="order.status === 'received'" icon="box-open" class="mr-1" />
                  <font-awesome-icon v-if="order.status === 'completed'" icon="check-circle" class="mr-1" />
                  <font-awesome-icon v-if="order.status === 'cancelled'" icon="ban" class="mr-1" />
                  {{ order.statusText }}
                </div>
              </div>
              <div class="el-card__body p-0">
                <div class="border-b border-gray-100">
                  <div class="flex items-center p-4 hover:bg-gray-50 transition-custom">
                    <img :src="order.productImage" alt="商品图片" class="w-20 h-20 object-cover rounded mr-4">
                    <div class="flex-1">
                      <div class="font-medium">{{ order.productName }}</div>
                      <div class="text-sm text-gray-500 mt-1">{{ order.productSpec }}</div>
                    </div>
                    <div class="text-right ml-4">
                      <div class="font-medium">¥{{ order.price }}</div>
                      <div class="text-sm text-gray-500">x{{ order.quantity }}</div>
                    </div>
                  </div>
                </div>
                <div class="p-4 flex justify-between items-center">
                  <div class="text-lg font-medium">
                    总计：<span class="text-primary">¥{{ order.totalAmount }}</span>
                  </div>
                  <div class="flex space-x-2">
                    <el-button v-if="order.status === 'pending'" type="primary" @click="payOrder(order)">
                      <font-awesome-icon icon="credit-card" class="mr-1" />立即付款
                    </el-button>
                    <el-button v-if="order.status === 'pending'" link @click="cancelOrder(order)">
                      <font-awesome-icon icon="times-circle" class="mr-1" />取消订单
                    </el-button>
                    <el-button v-if="order.status === 'received'" type="primary" @click="confirmReceipt(order)">
                      <font-awesome-icon icon="check" class="mr-1" />确认收货
                    </el-button>
                    <el-button v-if="order.status === 'completed'" link @click="viewOrderDetail(order)">
                      <font-awesome-icon icon="file-alt" class="mr-1" />查看详情
                    </el-button>
                    <el-button v-if="order.status === 'completed'" link @click="leaveReview(order)">
                      <font-awesome-icon icon="star" class="mr-1" />评价商品
                    </el-button>
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
import { ref, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faHouse, faUser, faList, faClock, faTruck, faBoxOpen, faCheckCircle, faBan, faCreditCard, faTimesCircle, faCheck, faFileAlt, faStar } from '@fortawesome/free-solid-svg-icons'

library.add(faHouse, faUser, faList, faClock, faTruck, faBoxOpen, faCheckCircle, faBan, faCreditCard, faTimesCircle, faCheck, faFileAlt, faStar)

// 注册全局组件（如果未全局注册）
// app.component('font-awesome-icon', FontAwesomeIcon)

// 订单状态数据
const activeTab = ref('all')
const searchKeyword = ref('')
const timeFilter = ref('all')
const amountFilter = ref('all')
const currentPage = ref(1)
const pageSize = ref(5)

// 模拟订单数据
const orders = ref([
  {
    id: 1,
    orderNumber: '202307140001',
    createTime: '2023-07-14 10:30:25',
    status: 'pending',
    statusText: '待付款',
    productImage: 'https://picsum.photos/id/96/200/200',
    productName: 'iPhone 14 Pro 256GB 深空黑',
    productSpec: '颜色：深空黑 / 容量：256GB',
    price: 7999,
    quantity: 1,
    totalAmount: 7999
  },
  {
    id: 2,
    orderNumber: '202307130002',
    createTime: '2023-07-13 15:45:12',
    status: 'shipping',
    statusText: '待发货',
    productImage: 'https://picsum.photos/id/119/200/200',
    productName: 'MacBook Air M2 13.6英寸',
    productSpec: '颜色：银色 / 配置：8核CPU/10核GPU/16GB/512GB',
    price: 9499,
    quantity: 1,
    totalAmount: 9499
  },
  {
    id: 3,
    orderNumber: '202307120003',
    createTime: '2023-07-12 09:20:38',
    status: 'received',
    statusText: '待收货',
    productImage: 'https://picsum.photos/id/160/200/200',
    productName: 'iPad Pro 11英寸 2022款',
    productSpec: '颜色：深空灰 / 容量：1TB / 蜂窝网络',
    price: 9299,
    quantity: 1,
    totalAmount: 9299
  },
  {
    id: 4,
    orderNumber: '202307100004',
    createTime: '2023-07-10 16:15:47',
    status: 'completed',
    statusText: '已完成',
    productImage: 'https://picsum.photos/id/20/200/200',
    productName: 'Apple Watch Series 8',
    productSpec: '尺寸：45mm / 颜色：星光色铝金属表壳',
    price: 3199,
    quantity: 1,
    totalAmount: 3199
  },
  {
    id: 5,
    orderNumber: '202307080005',
    createTime: '2023-07-08 11:45:21',
    status: 'completed',
    statusText: '已完成',
    productImage: 'https://picsum.photos/id/26/200/200',
    productName: 'AirPods Pro 2',
    productSpec: '主动降噪 / 空间音频',
    price: 1899,
    quantity: 1,
    totalAmount: 1899
  },
  {
    id: 6,
    orderNumber: '202307050006',
    createTime: '2023-07-05 14:30:16',
    status: 'cancelled',
    statusText: '已取消',
    productImage: 'https://picsum.photos/id/96/200/200',
    productName: 'iPhone 14 128GB 蓝色',
    productSpec: '颜色：蓝色 / 容量：128GB',
    price: 5999,
    quantity: 1,
    totalAmount: 5999
  }
])

// 计算过滤后的订单总数（不分页）
const filteredOrdersTotal = computed(() => {
  let filtered = [...orders.value]
  if (activeTab.value !== 'all') {
    filtered = filtered.filter(order => order.status === activeTab.value)
  }
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(order =>
      order.orderNumber.includes(keyword) ||
      order.productName.toLowerCase().includes(keyword)
    )
  }
  if (timeFilter.value !== 'all') {
    if (timeFilter.value === 'month') {
      filtered = filtered.filter((_, index) => index < 3)
    } else if (timeFilter.value === 'quarter') {
      filtered = filtered.filter((_, index) => index < 5)
    }
  }
  if (amountFilter.value !== 'all') {
    const [min, max] = amountFilter.value.split('-')
    if (max) {
      filtered = filtered.filter(order =>
        order.totalAmount >= parseInt(min) &&
        order.totalAmount <= parseInt(max)
      )
    } else {
      filtered = filtered.filter(order => order.totalAmount >= parseInt(min))
    }
  }
  return filtered.length
})

// 计算过滤+分页后的订单
const filteredOrders = computed(() => {
  let filtered = [...orders.value]
  if (activeTab.value !== 'all') {
    filtered = filtered.filter(order => order.status === activeTab.value)
  }
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(order =>
      order.orderNumber.includes(keyword) ||
      order.productName.toLowerCase().includes(keyword)
    )
  }
  if (timeFilter.value !== 'all') {
    if (timeFilter.value === 'month') {
      filtered = filtered.filter((_, index) => index < 3)
    } else if (timeFilter.value === 'quarter') {
      filtered = filtered.filter((_, index) => index < 5)
    }
  }
  if (amountFilter.value !== 'all') {
    const [min, max] = amountFilter.value.split('-')
    if (max) {
      filtered = filtered.filter(order =>
        order.totalAmount >= parseInt(min) &&
        order.totalAmount <= parseInt(max)
      )
    } else {
      filtered = filtered.filter(order => order.totalAmount >= parseInt(min))
    }
  }
  // 分页
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filtered.slice(start, end)
})

// 搜索订单
function searchOrders() {
  currentPage.value = 1
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
  ElMessage.success(`支付订单 ${order.orderNumber}`)
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
  ElMessage.info(`查看订单 ${order.orderNumber} 详情`)
}
function leaveReview(order) {
  ElMessage.info(`对 ${order.productName} 进行评价`)
}
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
    