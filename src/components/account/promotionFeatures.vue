<template>
    <div class="font-inter bg-gray-100 min-h-screen">
      <div class="container mx-auto px-4 py-8 max-w-6xl">
        <!-- 页面标题区 -->
        <div class="mb-6">
          <h1 class="text-[clamp(1.5rem,3vw,2rem)] font-bold text-gray-800">【推广中心】注册邀请链接管理</h1>
        </div>
        
         
        <!-- 推广链接生成区 -->
        <div class="bg-white rounded-xl shadow-card p-6 mb-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">生成推广链接</h2>
          
          <div class="space-y-6">
             
            <!-- 渠道标识 -->
            <div v-show="linkType === 'channel'" class="transition-all duration-300">
              <label class="block text-sm font-medium text-gray-700 mb-2">渠道标识 <span class="text-gray-500 text-xs">(选填，用于区分渠道)</span></label>
              <input type="text" v-model="channelTag" placeholder="例如：公众号、社群等" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary">
              <p class="text-xs text-gray-500 mt-1">仅用于区分不同推广渠道，不影响链接功能</p>
            </div>
            
            <!-- 邀请奖励规则 -->
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="font-medium text-gray-800 mb-2">邀请奖励规则</h3>
              <ul class="space-y-1 text-sm text-gray-600">
                <li class="flex items-start">
                  <font-awesome-icon icon="check-circle" class="text-success mt-0.5 mr-2" />
                  <span>好友完成注册: +¥10</span>
                </li>
                <li class="flex items-start">
                  <font-awesome-icon icon="check-circle" class="text-success mt-0.5 mr-2" />
                  <span>好友首次消费: +¥20</span>
                </li>
                <li class="flex items-start">
                  <font-awesome-icon icon="info-circle" class="text-primary mt-0.5 mr-2" />
                  <span>奖励将在好友完成对应行为后自动发放至您的账户</span>
                </li>
              </ul>
            </div>
            
            <!-- 生成结果 -->
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50">
              <h3 class="font-medium text-gray-800 mb-3">生成结果</h3>
              <div class="flex flex-col md:flex-row md:items-center gap-3">
                <div class="flex-1 bg-white rounded-lg border border-gray-200 p-3 overflow-hidden text-sm">
                  <span class="text-gray-500">https://mall.com/invite/</span>
                  <span class="font-medium">{{ inviteCode }}</span>
                </div>
                <div class="flex gap-2">
                  <button @click="copyLink" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-bg flex items-center">
                    <font-awesome-icon icon="copy" class="mr-1" />
                    复制链接
                  </button>
                  <button @click="generateQrCode" class="px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-bg flex items-center">
                    <font-awesome-icon icon="qrcode" class="mr-1" />
                    生成二维码
                  </button>
                </div>
              </div>
              
              <!-- 二维码显示区域 -->
              <div v-show="showQrCode" class="mt-4 text-center">
                <div class="inline-block p-3 bg-white rounded-lg border border-gray-200">
                  <div ref="qrCodeRef" class="w-48 h-48 mx-auto"></div>
                  <p class="mt-2 text-sm text-gray-500">扫码分享</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 注册用户列表区 -->
        <div class="bg-white rounded-xl shadow-card overflow-hidden mb-6">
          <div class="p-6 border-b border-gray-100">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold text-gray-800">注册用户列表</h2>
              <div class="text-sm text-gray-500">共 <span class="font-medium text-primary">{{ totalUsers }}</span> 条记录</div>
            </div>
          </div>
          
          <!-- 搜索和筛选 -->
          <div class="p-4 border-b border-gray-100">
            <div class="flex flex-col sm:flex-row gap-4">
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">搜索用户</label>
                <div class="relative">
                  <input type="text" v-model="searchKeyword" placeholder="请输入手机号" class="w-full px-3 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary">
                  <font-awesome-icon icon="search" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>
              
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">注册时间范围</label>
                <div class="flex gap-2">
                  <input type="date" v-model="startDate" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary">
                  <span class="flex items-center text-gray-500">至</span>
                  <input type="date" v-model="endDate" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary">
                </div>
              </div>
              
              <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700 mb-1">奖励状态</label>
                <select v-model="rewardStatus" class="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none bg-white">
                  <option value="all">全部</option>
                  <option value="paid">已发放</option>
                  <option value="pending">待发放</option>
                  <option value="unqualified">未达标</option>
                </select>
              </div>
              
              <div class="flex items-end">
                <button @click="filterUsers" class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-bg">
                  <font-awesome-icon icon="filter" class="mr-1" />
                  筛选
                </button>
              </div>
            </div>
          </div>
          
          <!-- 列表内容 -->
          <div class="p-4">
            <el-table :data="filteredUsers" stripe style="width: 100%">
              <el-table-column prop="index" label="序号" width="80" align="center"></el-table-column>
              <el-table-column label="注册用户" width="200">
                <template #default="scope">
                  <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <font-awesome-icon icon="user" />
                    </div>
                    <div class="ml-3">
                      <div class="font-medium text-gray-800">{{ scope.row.phone }}</div>
                    </div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="registerTime" label="注册时间" width="160"></el-table-column>
              <el-table-column prop="linkType" label="关联链接" width="120"></el-table-column>
              <el-table-column label="奖励状态">
                <template #default="scope">
                  <div class="flex items-center">
                    <div class="text-sm text-gray-800">¥{{ scope.row.totalReward }}</div>
                    <div class="ml-2 px-2 py-0.5" :class="getStatusClass(scope.row.status)">
                      {{ getStatusText(scope.row.status) }}
                    </div>
                  </div>
                  <div class="text-xs text-gray-500 mt-1">
                    注册: ¥{{ scope.row.registerReward }} + 首购: ¥{{ scope.row.firstPurchaseReward }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template #default="scope">
                  <button @click="showDetail(scope.row)" class="text-primary hover:text-primary/80">
                    查看详情
                  </button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          
          <!-- 分页区 -->
          <div class="p-6 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center">
            <div class="text-sm text-gray-500 mb-4 sm:mb-0">
              显示 <span class="font-medium">{{ (currentPage - 1) * pageSize + 1 }}</span> 到 <span class="font-medium">{{ Math.min(currentPage * pageSize, totalUsers) }}</span> 条，共 <span class="font-medium">24</span> 条记录
            </div>
            <div class="flex items-center">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[5, 10, 20]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="totalUsers">
              </el-pagination>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 模态框 - 奖励详情 -->
      <el-dialog :visible.sync="dialogVisible" title="奖励详情">
        <template #content>
          <div class="p-6">
            <div class="flex items-center mb-4">
              <div class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <font-awesome-icon icon="user" />
              </div>
              <div class="ml-3">
                <div class="font-medium text-gray-800">{{ selectedUser.phone }}</div>
                <div class="text-sm text-gray-500">注册时间: {{ selectedUser.registerTime }}</div>
              </div>
            </div>
            
            <div class="bg-gray-50 rounded-lg p-4 mb-4">
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">注册奖励</span>
                <span class="font-medium">¥{{ selectedUser.registerReward }}</span>
              </div>
              <div class="flex justify-between mb-2">
                <span class="text-gray-600">首次消费奖励</span>
                <span class="font-medium">¥{{ selectedUser.firstPurchaseReward }}</span>
              </div>
              <div class="flex justify-between pt-2 border-t border-gray-200">
                <span class="font-medium">总计</span>
                <span class="font-bold text-primary">¥{{ selectedUser.totalReward }}</span>
              </div>
            </div>
            
            <div class="space-y-3">
              <div class="flex items-start" v-if="selectedUser.registerRewardStatus === 'paid'">
                <div class="flex-shrink-0 mt-0.5">
                  <font-awesome-icon icon="check-circle" class="text-success" />
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-800">注册奖励</div>
                  <div class="text-xs text-gray-500">奖励金额: ¥{{ selectedUser.registerReward }} | 发放时间: {{ selectedUser.registerRewardTime }}</div>
                </div>
              </div>
              
              <div class="flex items-start" v-if="selectedUser.firstPurchaseReward > 0">
                <div class="flex-shrink-0 mt-0.5">
                  <font-awesome-icon :icon="selectedUser.firstPurchaseRewardStatus === 'paid' ? 'check-circle' : 'clock-o'" 
                                     :class="selectedUser.firstPurchaseRewardStatus === 'paid' ? 'text-success' : 'text-warning'" />
                </div>
                <div class="ml-3">
                  <div class="text-sm font-medium text-gray-800">首次消费奖励</div>
                  <div class="text-xs text-gray-500">奖励金额: ¥{{ selectedUser.firstPurchaseReward }} | 发放时间: {{ selectedUser.firstPurchaseRewardTime || '待发放' }}</div>
                  <div class="text-xs text-gray-500 mt-1" v-if="selectedUser.firstPurchaseRewardStatus === 'paid'">
                    订单号: {{ selectedUser.orderId }} | 消费金额: ¥{{ selectedUser.purchaseAmount }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template #footer>
          <div class="p-4 bg-gray-50 flex justify-end">
            <el-button @click="dialogVisible = false">关闭</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
  import { library } from '@fortawesome/fontawesome-svg-core';
  import { 
    faUser, 
    faCheckCircle, 
    faInfoCircle, 
    faCopy, 
    faQrcode, 
    faSearch, 
    faFilter, 
    faArrowUp, 
    faClock, 
    faTimes 
  } from '@fortawesome/free-solid-svg-icons';
  import QRCode from 'qrcode';
  import { ElTable, ElTableColumn, ElPagination, ElDialog, ElButton } from 'element-plus';
  import 'element-plus/dist/index.css';
  
  // 注册Font Awesome图标
  library.add(
    faUser, 
    faCheckCircle, 
    faInfoCircle, 
    faCopy, 
    faQrcode, 
    faSearch, 
    faFilter, 
    faArrowUp, 
    faClock,
    faTimes
  );
  
  // 数据状态
  const stats = ref({
    totalInvites: 156,
    validRegistrations: 128,
    totalRewards: 3840,
    pendingRewards: 560,
    inviteGrowthRate: 12.5,
    registrationGrowthRate: 8.3,
    rewardGrowthRate: 15.2
  });
  
  const linkType = ref('general');
  const channelTag = ref('');
  const inviteCode = ref('abc123');
  const showQrCode = ref(false);
  const qrCodeRef = ref(null);
  const dialogVisible = ref(false);
  const selectedUser = ref(null);
  
  // 表格数据
  const tableData = ref([
    {
      id: 1,
      phone: '手机号: 138****5678',
      registerTime: '2025-07-14 09:23',
      linkType: '通用链接',
      registerReward: 10,
      firstPurchaseReward: 20,
      totalReward: 30,
      status: 'paid',
      registerRewardStatus: 'paid',
      registerRewardTime: '2025-07-14 10:30',
      firstPurchaseRewardStatus: 'paid',
      firstPurchaseRewardTime: '2025-07-16 15:45',
      orderId: 'OD2025071600123',
      purchaseAmount: 299
    },
    {
      id: 2,
      phone: '手机号: 139****1234',
      registerTime: '2025-07-13 15:47',
      linkType: '公众号',
      registerReward: 10,
      firstPurchaseReward: 0,
      totalReward: 10,
      status: 'paid',
      registerRewardStatus: 'paid',
      registerRewardTime: '2025-07-13 16:30',
      firstPurchaseRewardStatus: 'unqualified',
      firstPurchaseRewardTime: '',
      orderId: '',
      purchaseAmount: 0
    },
    {
      id: 3,
      phone: '手机号: 137****8901',
      registerTime: '2025-07-12 11:35',
      linkType: '社群',
      registerReward: 10,
      firstPurchaseReward: 20,
      totalReward: 30,
      status: 'pending',
      registerRewardStatus: 'paid',
      registerRewardTime: '2025-07-12 12:30',
      firstPurchaseRewardStatus: 'pending',
      firstPurchaseRewardTime: '',
      orderId: 'OD2025071500456',
      purchaseAmount: 199
    },
    {
      id: 4,
      phone: '手机号: 136****2345',
      registerTime: '2025-07-10 18:20',
      linkType: '朋友圈',
      registerReward: 10,
      firstPurchaseReward: 0,
      totalReward: 10,
      status: 'unqualified',
      registerRewardStatus: 'paid',
      registerRewardTime: '2025-07-10 19:30',
      firstPurchaseRewardStatus: 'unqualified',
      firstPurchaseRewardTime: '',
      orderId: '',
      purchaseAmount: 0
    },
    {
      id: 5,
      phone: '手机号: 135****6789',
      registerTime: '2025-07-09 09:15',
      linkType: '公众号',
      registerReward: 10,
      firstPurchaseReward: 20,
      totalReward: 30,
      status: 'paid',
      registerRewardStatus: 'paid',
      registerRewardTime: '2025-07-09 10:30',
      firstPurchaseRewardStatus: 'paid',
      firstPurchaseRewardTime: '2025-07-12 14:20',
      orderId: 'OD2025071200789',
      purchaseAmount: 399
    }
  ]);
  
  // 搜索和筛选
  const searchKeyword = ref('');
  const startDate = ref('');
  const endDate = ref('');
  const rewardStatus = ref('all');
  
  // 分页
  const currentPage = ref(1);
  const pageSize = ref(5);
  const totalUsers = ref(tableData.value.length);
  
  // 计算属性 - 过滤后的用户列表
  const filteredUsers = computed(() => {
    let filtered = tableData.value;
    
    // 搜索过滤
    if (searchKeyword.value) {
      filtered = filtered.filter(user => 
        user.phone.includes(searchKeyword.value)
      );
    }
    
    // 日期范围过滤
    if (startDate.value && endDate.value) {
      filtered = filtered.filter(user => {
        const date = new Date(user.registerTime.split(' ')[0]);
        return date >= new Date(startDate.value) && date <= new Date(endDate.value);
      });
    }
    
    // 奖励状态过滤
    if (rewardStatus.value !== 'all') {
      filtered = filtered.filter(user => user.status === rewardStatus.value);
    }
    
    // 分页
    const start = (currentPage.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    return filtered.slice(start, end).map((user, index) => ({
      ...user,
      index: start + index + 1
    }));
  });
  
  // 方法
  const copyLink = () => {
    const linkText = `https://mall.com/invite/${inviteCode.value}`;
    navigator.clipboard.writeText(linkText).then(() => {
      alert('链接已复制到剪贴板');
    });
  };
  
  const generateQrCode = () => {
    if (qrCodeRef.value && !showQrCode.value) {
      showQrCode.value = true;
      setTimeout(() => {
        QRCode.toDataURL(`https://mall.com/invite/${inviteCode.value}`, {
          width: 192,
          height: 192,
          color: {
            dark: '#000000',
            light: '#ffffff'
          },
          errorCorrectionLevel: 'H'
        }, function (error, url) {
          if (error) {
            console.error('QR Code generation failed:', error);
          } else {
            qrCodeRef.value.innerHTML = `<img src="${url}" alt="QR Code" />`;
          }
        });
      }, 100);
    }
  };
  
  const getStatusText = (status) => {
    const statusMap = {
      'paid': '已发放',
      'pending': '待发放',
      'unqualified': '未达标'
    };
    return statusMap[status] || status;
  };
  
  const getStatusClass = (status) => {
    const classMap = {
      'paid': 'bg-green-100 text-green-800 rounded-full text-xs',
      'pending': 'bg-yellow-100 text-yellow-800 rounded-full text-xs',
      'unqualified': 'bg-gray-100 text-gray-800 rounded-full text-xs'
    };
    return classMap[status] || '';
  };
  
  const showDetail = (user) => {
    selectedUser.value = user;
    dialogVisible.value = true;
  };
  
  const filterUsers = () => {
    currentPage.value = 1; // 重置到第一页
  };
  
  const handleSizeChange = (newSize) => {
    pageSize.value = newSize;
  };
  
  const handleCurrentChange = (newPage) => {
    currentPage.value = newPage;
  };
  
  onMounted(() => {
    // 设置默认日期为今天和7天前
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    
    endDate.value = formatDate(today);
    startDate.value = formatDate(weekAgo);
  });
  
  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  </script>
  
  <style scoped>
  .hover-lift {
    transition: transform 0.2s ease;
  }
  
  .hover-lift:hover {
    transform: translateY(-2px);
  }
  
  .transition-bg {
    transition: background-color 0.2s ease;
  }
  </style>